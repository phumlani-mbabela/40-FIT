
import express from 'express';
import { pool } from '../db.js';
import { currentTenant } from '../middleware/authn.js';

const router = express.Router();

function mapRow(r){
  return { id:r.id, issued_by:r.issued_by, issued_to_email:r.issued_to_email, first_activated_at:r.first_activated_at, expires_at:r.expires_at, status:r.status };
}

router.get('/v1/guest-passes/:id', async (req,res) => {
  const tenant = currentTenant(req);
  const { rows } = await pool.query(`select id, issued_by, issued_to_email, first_activated_at, expires_at, status from guest_passes where id=$1 and tenant_id=$2`, [req.params.id, tenant]);
  if(rows.length === 0) return res.status(404).send('not found');
  const r = rows[0];
  let status = r.status;
  if (r.expires_at){ status = (new Date(r.expires_at) > new Date()) ? 'active' : 'expired'; }
  res.json({ ...mapRow(r), status });
});

router.post('/v1/guest-passes/:id/activate', async (req,res) => {
  const tenant = currentTenant(req);
  const now = new Date();
  const { rows } = await pool.query(`select id, first_activated_at, expires_at, status from guest_passes where id=$1 and tenant_id=$2`, [req.params.id, tenant]);
  if(rows.length === 0) return res.status(404).send('not found');
  const gp = rows[0];
  if (gp.expires_at && new Date(gp.expires_at) <= now){
    await pool.query(`update guest_passes set status='expired' where id=$1`, [gp.id]);
    return res.status(410).json({ status:'expired' });
  }
  if (!gp.first_activated_at){
    const expires = new Date(now.getTime() + 24*60*60*1000);
    const upd = await pool.query(`update guest_passes set first_activated_at=$1, expires_at=$2, status='active' where id=$3 returning id, first_activated_at, expires_at, status`, [now.toISOString(), expires.toISOString(), gp.id]);
    return res.json(upd.rows[0]);
  }
  return res.json({ id:gp.id, first_activated_at: gp.first_activated_at, expires_at: gp.expires_at, status: gp.status || 'active' });
});

export default router;
