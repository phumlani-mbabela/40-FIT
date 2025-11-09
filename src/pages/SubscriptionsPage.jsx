
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMySubscriptions, pauseSubscription, resumeSubscription, cancelSubscription, addMember, removeMember, issueGuestPass } from '../api/services/subscriptions';
import GuestPassModal from '../components/GuestPassModal';

export default function SubscriptionsPage(){
  const qc = useQueryClient();
  const { data: subs = [], isLoading } = useQuery({ queryKey:['my_subs'], queryFn:getMySubscriptions });

  // Optimistic helpers
  const optimisticUpdate = (id, updater) => {
    qc.setQueryData(['my_subs'], (old=[]) => old.map(s => s.id === id ? updater({...s}) : s));
  };
  const rollbackCache = qc.getQueryData(['my_subs']);

  const pauseMut = useMutation({
    mutationFn: (id)=>pauseSubscription(id),
    onMutate: async (id)=>{
      await qc.cancelQueries({queryKey:['my_subs']});
      const prev = qc.getQueryData(['my_subs']);
      optimisticUpdate(id, (s)=>({ ...s, status: 'paused' }));
      return { prev };
    },
    onError: (_e, _vars, ctx)=>{ qc.setQueryData(['my_subs'], ctx.prev); },
    onSettled: ()=> qc.invalidateQueries({queryKey:['my_subs']})
  });
  const resumeMut = useMutation({
    mutationFn: (id)=>resumeSubscription(id),
    onMutate: async (id)=>{
      await qc.cancelQueries({queryKey:['my_subs']});
      const prev = qc.getQueryData(['my_subs']);
      optimisticUpdate(id, (s)=>({ ...s, status: 'active' }));
      return { prev };
    },
    onError: (_e, _vars, ctx)=>{ qc.setQueryData(['my_subs'], ctx.prev); },
    onSettled: ()=> qc.invalidateQueries({queryKey:['my_subs']})
  });
  const cancelMut = useMutation({
    mutationFn: (id)=>cancelSubscription(id),
    onMutate: async (id)=>{
      await qc.cancelQueries({queryKey:['my_subs']});
      const prev = qc.getQueryData(['my_subs']);
      qc.setQueryData(['my_subs'], (old=[]) => old.filter(s => s.id !== id));
      return { prev };
    },
    onError: (_e, _vars, ctx)=>{ qc.setQueryData(['my_subs'], ctx.prev); },
    onSettled: ()=> qc.invalidateQueries({queryKey:['my_subs']})
  });
  const addMemberMut = useMutation({
    mutationFn: ({id, email, member_type})=>addMember(id, { email, member_type }),
    onMutate: async ({id, email, member_type})=>{
      await qc.cancelQueries({queryKey:['my_subs']});
      const prev = qc.getQueryData(['my_subs']);
      optimisticUpdate(id, (s)=>({ ...s, members: [...(s.members||[]), { email, member_type }] }));
      return { prev };
    },
    onError: (_e, _vars, ctx)=>{ qc.setQueryData(['my_subs'], ctx.prev); },
    onSettled: ()=> qc.invalidateQueries({queryKey:['my_subs']})
  });
  const removeMemberMut = useMutation({
    mutationFn: ({id, email})=>removeMember(id, email),
    onMutate: async ({id, email})=>{
      await qc.cancelQueries({queryKey:['my_subs']});
      const prev = qc.getQueryData(['my_subs']);
      optimisticUpdate(id, (s)=>({ ...s, members: (s.members||[]).filter(m=>m.email!==email) }));
      return { prev };
    },
    onError: (_e, _vars, ctx)=>{ qc.setQueryData(['my_subs'], ctx.prev); },
    onSettled: ()=> qc.invalidateQueries({queryKey:['my_subs']})
  });
  const guestMut = useMutation({ mutationFn: ({id, email})=>issueGuestPass(id, { email }) });

  const [showGuestFor, setShowGuestFor] = React.useState(null);
  const [newMemberEmail, setNewMemberEmail] = React.useState('');
  const [newMemberType, setNewMemberType] = React.useState('Spouse');

  if(isLoading) return <div className="container py-3">Loading…</div>;

  return (
    <div className="container py-3">
      <h2 className="mb-3">My Subscriptions</h2>
      {subs.length === 0 && <div className="alert alert-info">No active subscriptions yet.</div>}
      {subs.map(s => (
        <div key={s.id} className="card mb-3">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <h5 className="mb-0">{s.plan_name || s.type_code}</h5>
                <small className="text-muted">Status: <strong>{s.status}</strong> · MemberType: {s.member_type}</small>
              </div>
              <div className="btn-group">
                {s.status !== 'paused' ? (
                  <button className="btn btn-outline-warning btn-sm" onClick={()=>pauseMut.mutate(s.id)}>Pause</button>
                ) : (
                  <button className="btn btn-outline-success btn-sm" onClick={()=>resumeMut.mutate(s.id)}>Resume</button>
                )}
                <button className="btn btn-outline-danger btn-sm" onClick={()=>cancelMut.mutate(s.id)}>Cancel</button>
                <button className="btn btn-outline-primary btn-sm" onClick={()=>setShowGuestFor(s.id)}>Send Guest Pass</button>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <h6>Members</h6>
                <ul className="list-group">
                  {(s.members||[]).map(m => (
                    <li key={m.email} className="list-group-item d-flex justify-content-between align-items-center">
                      <span>{m.email} <small className="text-muted">({m.member_type})</small></span>
                      <button className="btn btn-sm btn-outline-secondary" onClick={()=>removeMemberMut.mutate({id:s.id, email:m.email})}>Remove</button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-md-6">
                <h6>Add member</h6>
                <div className="d-flex gap-2">
                  <input className="form-control" placeholder="email" value={newMemberEmail} onChange={e=>setNewMemberEmail(e.target.value)} />
                  <select className="form-select" style={{maxWidth:160}} value={newMemberType} onChange={e=>setNewMemberType(e.target.value)}>
                    {['Spouse','Child','Brother','Sister'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <button className="btn btn-primary" onClick={()=>addMemberMut.mutate({id:s.id, email:newMemberEmail, member_type:newMemberType})}>Add</button>
                </div>
                <small className="text-muted">Only the <strong>Main</strong> member can add others, and subscription must be active.</small>
              </div>
            </div>
          </div>
        </div>
      ))}

      {showGuestFor && (
        <GuestPassModal
          loading={guestMut.isLoading}
          onClose={()=>setShowGuestFor(null)}
          onSubmit={(email)=>guestMut.mutate({ id: showGuestFor, email }, { onSuccess: ()=>{ setShowGuestFor(null); alert('Guest pass sent.'); }})}
        />
      )}
    </div>
  );
}
