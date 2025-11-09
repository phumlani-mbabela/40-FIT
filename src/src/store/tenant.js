import { create } from "zustand";
export const useTenant = create((set) => ({ tenantId: null, setTenantId: (tenantId) => set({ tenantId }) }));

