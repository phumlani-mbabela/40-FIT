
import React from 'react';

export default function GuestPassModal({ onClose, onSubmit, loading }){
  const [email, setEmail] = React.useState('');
  return (
    <div className="modal d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Send 1-day Guest Pass</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <label className="form-label">Recipient email</label>
            <input className="form-control" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="friend@example.com" />
            <small className="text-muted">The pass will expire in 24 hours from first activation.</small>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
            <button className="btn btn-primary" disabled={!email || loading} onClick={()=>onSubmit(email)}>
              {loading ? 'Sending…' : 'Send Pass'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
