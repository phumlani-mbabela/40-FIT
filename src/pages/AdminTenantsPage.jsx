
import React from 'react';
import { useSelector } from 'react-redux';
import { api } from '../api/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function AdminTenantsPage(){
  const qc = useQueryClient();
  const { tenantId } = useSelector(s=>s.tenant);
  const { data: tenants = [] } = useQuery({ queryKey:['tenants'], queryFn: ()=> api.get('/v1/tenants').then(r=>r.data) });
  const createMut = useMutation({ mutationFn: (payload)=> api.post('/v1/tenants', payload).then(r=>r.data), onSuccess: ()=> qc.invalidateQueries({queryKey:['tenants']}) });
  const inviteMut = useMutation({ mutationFn: (payload)=> api.post(`/v1/tenants/${payload.tenant_id}/invites`, payload).then(r=>r.data) });

  const [name, setName] = React.useState('Corporate A');
  const [email, setEmail] = React.useState('employee@example.com');

  return (
    <div className="container py-3">
      <h2>Corporate Tenants</h2>
      <ul className="list-group mb-3">
        {tenants.map(t => <li key={t.id} className="list-group-item d-flex justify-content-between"><span>{t.name}</span><span className="text-muted">{t.id}</span></li>)}
      </ul>
      <div className="card mb-3"><div className="card-body d-flex gap-2">
        <input className="form-control" placeholder="Tenant name" value={name} onChange={e=>setName(e.target.value)} />
        <button className="btn btn-primary" onClick={()=>createMut.mutate({ name })}>Create</button>
      </div></div>
      <div className="card"><div className="card-body d-flex gap-2">
        <input className="form-control" placeholder="Invite email" value={email} onChange={e=>setEmail(e.target.value)} />
        <button className="btn btn-secondary" onClick={()=>inviteMut.mutate({ tenant_id: tenantId, email })}>Invite to current tenant</button>
      </div></div>
    </div>
  );
}
