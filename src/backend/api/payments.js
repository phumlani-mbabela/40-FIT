
import crypto from 'crypto';
import fetch from 'node-fetch';
import { tx } from './db.js';

/** Idempotent event recording */
export async function recordWebhookEvent(client, provider, externalEventId, raw){
  const q = `insert into webhook_events (provider, external_event_id, raw) values ($1,$2,$3) on conflict do nothing returning id;`;
  const { rows } = await client.query(q, [provider, externalEventId, raw]);
  return rows[0]?.id || null;
}

/** Mark invoice paid & create payment row */
export async function settleInvoiceByRef(invoiceId, provider, providerRef, amountCents, currency, raw){
  return tx(async (client) => {
    const inv = await client.query(`select id, status, amount_cents, currency from invoices where id=$1 for update`, [invoiceId]);
    if (inv.rowCount === 0) throw new Error('invoice_not_found');
    const row = inv.rows[0];
    if (row.status === 'paid') return { ok: true, already: true };

    if (Number(row.amount_cents) !== Number(amountCents) || row.currency !== currency){
      throw new Error('amount_or_currency_mismatch');
    }
    await client.query(`insert into payments (invoice_id, provider, provider_ref, amount_cents, currency, status, raw) values ($1,$2,$3,$4,$5,'succeeded',$6)`, [invoiceId, provider, providerRef, amountCents, currency, raw]);
    await client.query(`update invoices set status='paid' where id=$1`, [invoiceId]);
    return { ok: true };
  });
}

/** PayFast: verify signature and optionally remote validate */
export function verifyPayfastSignature(data, passphrase){
  const pairs = Object.keys(data).filter(k => k !== 'signature').sort().map(k => `${k}=${encodeURIComponent(data[k])}`);
  let payload = pairs.join('&');
  if (passphrase) payload += `&passphrase=${encodeURIComponent(passphrase)}`;
  const md5 = crypto.createHash('md5').update(payload).digest('hex');
  return { valid: (data.signature || '').toLowerCase() === md5, payload };
}

export async function remoteValidatePayfast(payload){
  // Typically POST to https://www.payfast.co.za/eng/query/validate
  // This is a placeholder to avoid outbound calls in local dev.
  // const resp = await fetch('https://www.payfast.co.za/eng/query/validate', { method:'POST', headers:{ 'Content-Type':'application/x-www-form-urlencoded' }, body: payload });
  // const text = await resp.text();
  // return /VALID/.test(text);
  return true;
}

/** Paystack: compare sha512 HMAC of raw body */
export function verifyPaystack(rawBody, signature, secret){
  const hash = crypto.createHmac('sha512', secret).update(rawBody).digest('hex');
  return (signature || '').toLowerCase() === hash;
}
