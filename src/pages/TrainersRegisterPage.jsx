
import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { registerTrainer } from '../api/services/users';

export default function TrainersRegisterPage(){
  const [bio, setBio] = React.useState('');
  const [specialties, setSpecs] = React.useState('Calisthenics, Mobility, Balance');
  const mut = useMutation({ mutationFn: ()=> registerTrainer({ bio, specialties }) });

  return (
    <div className="container py-3">
      <h2>Become a Personal Trainer</h2>
      <div className="mb-2">
        <label className="form-label">Bio</label>
        <textarea className="form-control" rows={5} value={bio} onChange={e=>setBio(e.target.value)} />
      </div>
      <div className="mb-3">
        <label className="form-label">Specialties</label>
        <input className="form-control" value={specialties} onChange={e=>setSpecs(e.target.value)} />
      </div>
      <button className="btn btn-primary" disabled={mut.isLoading} onClick={()=>mut.mutate(undefined,{ onSuccess:()=>alert('Registered as trainer!') })}>
        {mut.isLoading ? 'Submitting…' : 'Register'}
      </button>
      <p className="text-muted mt-2">After approval, you can publish programs in the marketplace.</p>
    </div>
  );
}
