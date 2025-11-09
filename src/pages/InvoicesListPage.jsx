
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { listMyInvoices } from '../api/services/invoices';

export default function InvoicesListPage(){
  const { data: invoices = [], isLoading } = useQuery({ queryKey:['my_invoices'], queryFn: listMyInvoices });

  if(isLoading) return <div className="container py-3">Loading…</div>;
  return (
    <div className="container py-3">
      <h2>Invoices</h2>
      {invoices.length === 0 && <div className="alert alert-info">No invoices found.</div>}
      <div className="table-responsive">
        <table className="table align-middle">
          <thead><tr><th>ID</th><th>Amount</th><th>Status</th><th>Created</th><th></th></tr></thead>
          <tbody>
            {invoices.map(inv => (
              <tr key={inv.id}>
                <td><code>{inv.id}</code></td>
                <td>{(inv.amount_cents/100).toFixed(2)} {inv.currency || 'ZAR'}</td>
                <td><span className={`badge bg-${inv.status==='paid'?'success':inv.status==='unpaid'?'warning':'secondary'}`}>{inv.status}</span></td>
                <td>{new Date(inv.created_at).toLocaleString()}</td>
                <td>
                  <Link className="btn btn-sm btn-outline-primary" to={`/invoices/${inv.id}`}>View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
