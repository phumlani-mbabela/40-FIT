
import { api } from '../client';
export const getGuestPass = (id) => api.get(`/v1/guest-passes/${id}`).then(r=>r.data);
export const activateGuestPass = (id) => api.post(`/v1/guest-passes/${id}/activate`).then(r=>r.data);
