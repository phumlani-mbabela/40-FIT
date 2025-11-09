
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080',
});

let authToken = null;
let tenantId = '00000000-0000-0000-0000-000000000001';

export function setAuthToken(token){
  authToken = token;
}
export function setTenantId(tid){
  tenantId = tid || tenantId;
}

api.interceptors.request.use((config)=>{
  if (authToken) config.headers['Authorization'] = `Bearer ${authToken}`;
  if (tenantId)  config.headers['X-Tenant-ID']   = tenantId;
  return config;
});
