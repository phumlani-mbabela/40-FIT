
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProgram } from '../api/services/marketplace';
import SubscribeProgramButton from '../components/SubscribeProgramButton';

export default function ProgramDetailPage(){
  const { id } = useParams();
  const { data: prog, isLoading } = useQuery({ queryKey:['program', id], queryFn: ()=>getProgram(id) });

  if(isLoading) return <div className="container py-3">Loading…</div>;
  if(!prog) return <div className="container py-3">Not found</div>;

  return (
    <div className="container py-3">
      <div className="row">
        <div className="col-md-8">
          <h2>{prog.title}</h2>
          <p className="text-muted">{prog.description}</p>
          <h6 className="mt-4">Contents</h6>
          <ul className="list-group">
            {(prog.assets||[]).map(a => (
              <li key={a.id} className="list-group-item d-flex justify-content-between">
                <span>{a.kind.toUpperCase()}: {a.name || a.storage_path}</span>
                <span className="text-muted">{a.mime}</span>
              </li>
            ))}
          </ul>
          <h6 className="mt-4">Community</h6>
          <div className="alert alert-secondary">Comments & ratings UI placeholder (connect to /comments and /ratings endpoints).</div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <strong>Price</strong>
                <span>{(prog.base_price_cents/100).toFixed(2)} ZAR</span>
              </div>
              <SubscribeProgramButton programId={id} onSuccess={()=>alert('Subscribed to program!')} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
