
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMe, updateMe } from '../api/services/users';

export default function UserProfilePage(){
  const qc = useQueryClient();
  const { data: me, isLoading } = useQuery({ queryKey:['me'], queryFn:getMe });
  const mut = useMutation({ mutationFn: updateMe, onSuccess: ()=> qc.invalidateQueries({queryKey:['me']}) });

  const [form, setForm] = React.useState({ name:'', nickname:'', dob:'', address:'' });
  React.useEffect(()=>{
    if(me){
      setForm({
        name: me.name || '',
        nickname: me.nickname || '',
        dob: me.dob ? me.dob.slice(0,10) : '',
        address: me.address || ''
      });
    }
  }, [me]);

  if(isLoading) return <div className="container py-3">Loading…</div>;

  return (
    <div className="container py-3">
      <h2>My Profile</h2>
      <div className="row">
        <div className="col-md-8">
          <div className="mb-2">
            <label className="form-label">Full name</label>
            <input className="form-control" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
          </div>
          <div className="mb-2">
            <label className="form-label">Nickname</label>
            <input className="form-control" value={form.nickname} onChange={e=>setForm({...form, nickname:e.target.value})} />
          </div>
          <div className="mb-2">
            <label className="form-label">Date of birth</label>
            <input className="form-control" type="date" value={form.dob} onChange={e=>setForm({...form, dob:e.target.value})} />
          </div>
          <div className="mb-3">
            <label className="form-label">Address</label>
            <input className="form-control" value={form.address} onChange={e=>setForm({...form, address:e.target.value})} />
          </div>
          <button className="btn btn-primary" onClick={()=>mut.mutate(form)} disabled={mut.isLoading}>
            {mut.isLoading ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
