
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import crypto from 'crypto';
import fetch from 'node-fetch';
import { pool } from './db.js';
import { getInvoiceSignedUrl } from './storage.js';
import { recordWebhookEvent, settleInvoiceByRef, verifyPayfastSignature, remoteValidatePayfast, verifyPaystack } from './payments.js';

const app = express();
function rawBody(req, _res, buf) { req.rawBody = buf; }

app.use(cors());
app.use(express.json({ verify: rawBody }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

/** Idempotency (in-memory; replace with Redis) */
const seen = new Map();
function idempotency(req, res, next){
  const key = req.headers['idempotency-key'];
  if(!key) return next();
  if(seen.has(key)){
    const cached = seen.get(key);
    return res.status(cached.status).set(cached.headers||{}).send(cached.body);
  }
  const oldSend = res.send.bind(res);
  res.send = (body)=>{ seen.set(key, { status: res.statusCode, headers: {}, body }); return oldSend(body); };
  next();
}
app.use(idempotency);

/** Middleware: tenant header required */
app.use((req,res,next)=>{
  req.tenantId = req.headers['x-tenant-id'] || req.headers['X-Tenant-Id'] || '00000000-0000-0000-0000-000000000001';
  next();
});

/** --- Invoices --- */
app.get('/v1/invoices/:id/download', async (req, res) => {
  try{
    const { rows } = await pool.query(`select id, storage_path from invoices where id=$1 and tenant_id=$2`, [req.params.id, req.tenantId]);
    if (rows.length === 0) return res.status(404).send('Not found');
    const path = rows[0].storage_path;
    if (!path) return res.status(404).send('Missing file');
    const url = await getInvoiceSignedUrl(path);
    // Redirect to signed URL so browser directly downloads/embeds
    return res.redirect(302, url);
  }catch(e){
    console.error(e);
    res.status(500).send('error');
  }
});

/** --- Tenants demo endpoints (minimal) --- */
app.get('/v1/tenants', async (_req,res) => {
  const { rows } = await pool.query(`select id, name, created_at from tenants order by created_at asc`);
  res.json(rows);
});

app.post('/v1/tenants', async (req,res) => {
  const name = req.body?.name || 'Tenant';
  const { rows } = await pool.query(`insert into tenants(name) values ($1) returning id, name, created_at`, [name]);
  res.status(201).json(rows[0]);
});

/** --- Subscriptions: pause/resume --- */
app.post('/v1/subscriptions/:id/pause', async (req,res) => {
  const { rows } = await pool.query(`update user_subscriptions set status='paused', updated_time=now() where id=$1 and tenant_id=$2 returning id, status`, [req.params.id, req.tenantId]);
  if (rows.length === 0) return res.status(404).send('Not found');
  res.json(rows[0]);
});
app.post('/v1/subscriptions/:id/resume', async (req,res) => {
  const { rows } = await pool.query(`update user_subscriptions set status='active', updated_time=now() where id=$1 and tenant_id=$2 returning id, status`, [req.params.id, req.tenantId]);
  if (rows.length === 0) return res.status(404).send('Not found');
  res.json(rows[0]);
});

/** --- Webhooks --- */

/* PayFast */
app.post('/v1/webhooks/payfast', express.urlencoded({ extended:true }), async (req,res) => {
  try{
    const data = req.body || {};
    const passphrase = process.env.PAYFAST_PASSPHRASE || '';
    const { valid, payload } = verifyPayfastSignature(data, passphrase);
    // Optional remote validation (disabled in local dev)
    const remoteOk = await remoteValidatePayfast(payload);

    // Idempotent record of event id (if tx id present)
    const externalId = data.pf_payment_id || data.m_payment_id || crypto.randomUUID();

    // Log event, mark processed later
    const client = await pool.connect();
    try{
      await client.query('begin');
      const ins = `insert into webhook_events(provider, external_event_id, raw) values ('payfast',$1,$2::jsonb) on conflict do nothing`;
      await client.query(ins, [externalId, JSON.stringify(data)]);
      await client.query('commit');
    } catch(e){ await client.query('rollback'); throw e; }
    finally{ client.release(); }

    // If valid -> mark invoice paid
    if (valid && remoteOk){
      const invoiceId = data.custom_str1 || data.m_payment_id; /* map your invoice id here */
      const amountCents = Math.round(parseFloat(data.amount_gross || data.amount) * 100);
      await settleInvoiceByRef(invoiceId, 'payfast', externalId, amountCents, (data.currency || 'ZAR'), data);
    }

    res.status(200).send('OK');
  }catch(e){
    console.error('payfast webhook error', e);
    res.status(200).send('OK'); // avoid retries loop storms
  }
});

/* Paystack */
app.post('/v1/webhooks/paystack', async (req,res) => {
  try{
    const secret = process.env.PAYSTACK_SECRET || '';
    const signature = req.headers['x-paystack-signature'] || '';
    const raw = req.rawBody || JSON.stringify(req.body);
    const ok = verifyPaystack(raw, signature, secret);
    if (ok){
      const evt = req.body || {};
      const externalId = evt?.data?.id || evt?.event || crypto.randomUUID();
      // save event
      await pool.query(`insert into webhook_events(provider, external_event_id, raw) values ('paystack',$1,$2::jsonb) on conflict do nothing`, [String(externalId), JSON.stringify(evt)]);
      // handle charge success
      if (evt.event === 'charge.success'){
        const invoiceId = evt.data?.metadata?.invoice_id;
        const amountCents = evt.data?.amount;
        const currency = (evt.data?.currency || 'ZAR').toUpperCase();
        if (invoiceId && amountCents){
          await settleInvoiceByRef(invoiceId, 'paystack', String(externalId), Number(amountCents), currency, evt);
        }
      }
    }
    res.status(200).json({ ok: true });
  }catch(e){
    console.error('paystack webhook error', e);
    res.status(200).json({ ok: true });
  }
});

// Boot (if run directly)
if (process.argv[1] && process.argv[1].includes('server.js')) {
  const port = process.env.PORT || 8080;
  app.listen(port, () => console.log('API listening on :' + port));
}

export default app;
