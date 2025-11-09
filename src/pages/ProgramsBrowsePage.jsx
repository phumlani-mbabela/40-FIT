
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { searchPrograms } from '../api/services/marketplace';

export default function ProgramsBrowsePage(){
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const { data: programs = [], isLoading } = useQuery({ queryKey:['programs', q], queryFn: ()=>searchPrograms(q) });

  return (
    <div className="container py-3">
      <div className="d-flex align-items-center justify-content-between">
        <h2>Marketplace</h2>
        <div className="input-group" style={{maxWidth:420}}>
          <input className="form-control" placeholder="Search programs…" value={q} onChange={e=>setParams({ q: e.target.value })} />
          <span className="input-group-text">🔎</span>
        </div>
      </div>
      {isLoading && <p>Loading…</p>}
      <div className="row mt-3">
        {programs.map(p => (
          <div className="col-md-4 mb-3" key={p.id}>
            <div className="card h-100">
              {p.cover_url ? <img src={p.cover_url} alt={p.title} className="card-img-top" /> : <div className="card-img-top bg-light" style={{height:160}}/>}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{p.title}</h5>
                <p className="card-text text-muted">{p.description?.slice(0,120)}{(p.description||'').length>120?'…':''}</p>
                <div className="mt-auto d-flex justify-content-between align-items-center">
                  <span className="fw-bold">{(p.base_price_cents/100).toFixed(2)} ZAR</span>
                  <Link className="btn btn-outline-primary btn-sm" to={`/marketplace/${p.id}`}>View</Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
