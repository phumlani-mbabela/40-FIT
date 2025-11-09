
import React from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/client';

export default function InvoiceViewerPage(){
  const { id } = useParams();
  const [url, setUrl] = React.useState(null);
  const [err, setErr] = React.useState(null);

  React.useEffect(()=>{
    let active = true;
    (async ()=>{
      try{
        const resp = await api.get(`/v1/invoices/${id}/download`, { responseType: 'blob' });
        const blobUrl = URL.createObjectURL(new Blob([resp.data], { type: 'application/pdf' }));
        if(active) setUrl(blobUrl);
      }catch(e){ if(active) setErr(e.message); }
    })();
    return ()=>{ active=false; if(url) URL.revokeObjectURL(url); };
  }, [id]);

  if(err) return <div className="container py-3"><div className="alert alert-danger">{String(err)}</div></div>;
  if(!url) return <div className="container py-3">Loading…</div>;

  return (
    <div className="container py-3">
      <h2>Invoice {id}</h2>
      <iframe title="invoice" src={url} style={{width:'100%', height:'85vh', border:'1px solid #ddd'}} />
    </div>
  );
}
