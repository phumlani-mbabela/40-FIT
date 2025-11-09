
import { api } from '../client';
export const getMe = () => api.get('/v1/users/me').then(r=>r.data);
export const updateMe = (payload) => api.put('/v1/users/me', payload).then(r=>r.data);
export const registerTrainer = (payload) => api.post('/v1/trainers/register', payload).then(r=>r.data);
