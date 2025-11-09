
import { api } from '../client';
export const searchPrograms = (q='') => api.get('/v1/programs', { params: { search: q }}).then(r=>r.data);
export const getProgram = (id) => api.get(`/v1/programs/${id}`).then(r=>r.data);
export const subscribeProgram = (id) => api.post(`/v1/programs/${id}/subscribe`).then(r=>r.data);
export const createProgram = (payload) => api.post('/v1/programs', payload).then(r=>r.data);
