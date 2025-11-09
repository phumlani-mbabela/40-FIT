import { useEffect } from "react";
import { api } from "../lib/api";
import { useAuth } from "../store/auth"; import { useTenant } from "../store/tenant";
export function useSubscription() {
  const { subscription, setSubscription } = useAuth(); const { tenantId } = useTenant();
  useEffect(()=>{ let alive=true;
    api(`/subscription`, { tenantId })
      .then(s=> alive && setSubscription(s || { status: "none" }))
      .catch(()=> alive && setSubscription({ status: "none" }));
    return ()=>{alive=false}; }, [tenantId, setSubscription]);
  return subscription || { status: "none" };
}

