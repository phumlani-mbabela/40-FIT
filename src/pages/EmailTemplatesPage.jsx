
import React from 'react';
import { api } from '../api/client';

const templates = ['signup_confirmation','join_request','password_reset','payment_thanks','blog_new'];

export default function EmailTemplatesPage(){
  const [tpl, setTpl] = React.useState('signup_confirmation');
  const [html, setHtml] = React.useState('');

  const load = async () => {
    const { data } = await api.get('/v1/email/preview', { params: { template: tpl, name: 'JC', link: 'https://fortyplusfit.co.za' } });
    setHtml(data.html || '<p>No preview</p>');
  };

  return (
    <div className="container py-3">
      <h2>Email Templates</h2>
      <div className="d-flex gap-2 mb-2">
        <select className="form-select" style={{maxWidth:280}} value={tpl} onChange={e=>setTpl(e.target.value)}>
          {templates.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <button className="btn btn-secondary" onClick={load}>Preview</button>
      </div>
      <div className="card">
        <div className="card-body">
          <div dangerouslySetInnerHTML={{__html: html}} />
        </div>
      </div>
    </div>
  );
}
