
import React from 'react';
import { createProgram } from '../api/services/marketplace';

export default function ProgramEditorPage(){
  const [title, setTitle] = React.useState('Balance Foundations');
  const [description, setDescription] = React.useState('Core balance & calisthenics fundamentals.');
  const [price, setPrice] = React.useState(49900);
  const [files, setFiles] = React.useState([]);

  const onSubmit = async () => {
    const payload = { title, description, base_price_cents: Number(price), assets: Array.from(files).map(f=>({ name:f.name, type: f.type })) };
    await createProgram(payload);
    alert('Program created (assets metadata sent). Use content uploader to push binaries to storage.');
  };

  return (
    <div className="container py-3">
      <h2>Create Program</h2>
      <div className="mb-2"><label>Title</label><input className="form-control" value={title} onChange={e=>setTitle(e.target.value)} /></div>
      <div className="mb-2"><label>Description</label><textarea className="form-control" rows={4} value={description} onChange={e=>setDescription(e.target.value)} /></div>
      <div className="mb-2"><label>Price (cents)</label><input className="form-control" type="number" value={price} onChange={e=>setPrice(e.target.value)} /></div>
      <div className="mb-3"><label>Upload videos/docs</label><input type="file" className="form-control" multiple onChange={e=>setFiles(e.target.files)} /></div>
      <button className="btn btn-primary" onClick={onSubmit}>Save</button>
    </div>
  );
}
