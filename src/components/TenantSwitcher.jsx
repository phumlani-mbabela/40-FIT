
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTenant, setTenants } from '../store/slices/tenantSlice';
import { api } from '../api/client';

export default function TenantSwitcher(){
  const dispatch = useDispatch();
  const { tenantId, tenants } = useSelector(s => s.tenant);

  React.useEffect(()=>{
    (async ()=>{
      try{
        const { data } = await api.get('/v1/tenants');
        dispatch(setTenants(data));
      }catch(e){ /* ignore */ }
    })();
  }, [dispatch]);

  return (
    <div className="d-flex align-items-center gap-2">
      <span className="text-muted">Tenant</span>
      <select className="form-select" style={{maxWidth: 280}} value={tenantId} onChange={(e)=>dispatch(setTenant(e.target.value))}>
        {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
      </select>
    </div>
  );
}
