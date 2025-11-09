
import { api } from '../client';

export const getMySubscriptions = () => api.get('/v1/me/subscriptions').then(r=>r.data);
export const pauseSubscription = (id) => api.post(`/v1/subscriptions/${id}/pause`).then(r=>r.data);
export const resumeSubscription = (id) => api.post(`/v1/subscriptions/${id}/resume`).then(r=>r.data);
export const cancelSubscription = (id) => api.post(`/v1/subscriptions/${id}/cancel`).then(r=>r.data);
export const addMember = (id, { email, member_type }) => api.post(`/v1/subscriptions/${id}/members`, { email, member_type }).then(r=>r.data);
export const removeMember = (id, email) => api.delete(`/v1/subscriptions/${id}/members/${encodeURIComponent(email)}`).then(r=>r.data);
export const issueGuestPass = (id, { email }) => api.post(`/v1/subscriptions/${id}/guest-pass`, { email }).then(r=>r.data);
