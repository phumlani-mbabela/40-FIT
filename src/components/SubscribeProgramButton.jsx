
import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { subscribeProgram } from '../api/services/marketplace';

export default function SubscribeProgramButton({ programId, onSuccess }){
  const mut = useMutation({ mutationFn: () => subscribeProgram(programId), onSuccess });
  return (
    <button className="btn btn-primary" onClick={()=>mut.mutate()} disabled={mut.isLoading}>
      {mut.isLoading ? 'Subscribing…' : 'Subscribe'}
    </button>
  );
}
