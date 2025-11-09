
import React from 'react';
import { api } from '../api/client';

export default function AdminImportsPage(){
  const [file, setFile] = React.useState(null);
  const submit = async () => {
    if(!file) return;
    const form = new FormData(); form.append('file', file);
    await api.post('/v1/admin/imports/csv', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    alert('Uploaded');
  };
  return (
    <div className="container py-3">
      <h2>Bulk Import (CSV)</h2>
      <input type="file" accept=".csv" onChange={e=>setFile(e.target.files?.[0]||null)} />
      <button className="btn btn-primary ms-2" onClick={submit} disabled={!file}>Upload</button>
      <p className="text-muted mt-3">Supported: users, memberships, programs</p>
    </div>
  );
}
