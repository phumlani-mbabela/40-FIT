
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getGuestPass, activateGuestPass } from '../api/services/guestpass';
import Countdown from '../components/Countdown';

export default function GuestActivatePage(){
  const { id } = useParams();
  const qc = useQueryClient();
  const q = useQuery({ queryKey:['guestpass', id], queryFn: ()=>getGuestPass(id) });
  const act = useMutation({ mutationFn: ()=>activateGuestPass(id), onSuccess: ()=> qc.invalidateQueries({ queryKey:['guestpass', id] }) });
  React.useEffect(()=>{ if(q.data && q.data.status === 'pending' && !act.isLoading){ act.mutate(); }}, [q.data, act]);
  if(q.isLoading) return <div className="container py-4">Loading guest pass…</div>;
  if(q.isError) return <div className="container py-4"><div className="alert alert-danger">Invalid or missing guest pass.</div></div>;
  const gp = q.data;
  return (
    <div className="container py-4">
      <div className="card"><div className="card-body">
        <h3 className="mb-2">Guest Pass</h3>
        <p className="text-muted">Invited by <strong>{gp.issued_by}</strong> for <strong>{gp.issued_to_email}</strong></p>
        {gp.status === 'active' && gp.expires_at && (<div className="alert alert-success">Pass is active. Time left: <Countdown until={gp.expires_at} /></div>)}
        {gp.status === 'pending' && (<div className="alert alert-info">Activating your pass…</div>)}
        {gp.status === 'expired' && (<div className="alert alert-warning">This guest pass has expired.</div>)}
        <div className="d-flex gap-2 mt-3">
          <Link className="btn btn-primary" to="/marketplace" disabled={gp.status!=='active'}>Explore Programs</Link>
          <Link className="btn btn-outline-secondary" to="/">Home</Link>
        </div>
        <hr/>
        <div className="small text-muted">
          First activated: {gp.first_activated_at ? new Date(gp.first_activated_at).toLocaleString() : '—'}<br/>
          Expires at: {gp.expires_at ? new Date(gp.expires_at).toLocaleString() : '—'}
        </div>
      </div></div>
    </div>
  );
}
