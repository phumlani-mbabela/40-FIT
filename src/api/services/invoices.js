
import { api } from '../client';

export const listMyInvoices = () => api.get('/v1/invoices', { params: { user: 'me' }}).then(r=>r.data);
export const downloadInvoiceBlob = async (id) => {
  // Server redirects to signed URL; allow browser to follow via iframe or fetch blob
  const resp = await api.get(`/v1/invoices/${id}/download`, { responseType: 'blob' });
  return resp.data;
};
