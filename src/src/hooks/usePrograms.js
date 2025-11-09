import { useEffect, useState } from "react";
import { api } from "../lib/api"; import { useTenant } from "../store/tenant";
export function usePrograms() {
  const { tenantId } = useTenant(); const [data, setData] = useState({ items: [], loading: true, error: null });
  useEffect(()=>{ let alive=true; setData(d=>({...d,loading:true}));
    api(`/programs`, { tenantId }).then(items=> alive && setData({items,loading:false,error:null}))
      .catch(e=> alive && setData({items:[],loading:false,error:e.message}));
    return ()=>{alive=false}; }, [tenantId]);
  return data;
}

