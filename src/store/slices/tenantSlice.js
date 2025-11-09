
import { createSlice } from '@reduxjs/toolkit';
import { setTenantId } from '../../api/client';

const initialState = {
  tenantId: '00000000-0000-0000-0000-000000000001',
  tenants: [],
};

const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {
    setTenant(state, action){
      state.tenantId = action.payload;
      setTenantId(action.payload);
    },
    setTenants(state, action){
      state.tenants = action.payload || [];
    }
  }
});

export const { setTenant, setTenants } = tenantSlice.actions;
export default tenantSlice.reducer;
