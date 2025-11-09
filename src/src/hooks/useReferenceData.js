import { useEffect, useState } from "react";
import { api } from "../lib/api";
export function useReferenceData() {
  const [data, setData] = useState({ loading: true, error: null, genders: [], bodyTypes: [], tiers: [], ranks: [], countries: [], provinces: [], cities: [] });
  useEffect(()=>{ let alive=true;
    Promise.all([
      api("/reference/genders"), api("/reference/body-types"),
      api("/reference/subscription-tiers"), api("/reference/ranks"),
      api("/reference/countries"), api("/reference/provinces?country=ZA"),
      api("/reference/cities?province=Gauteng"),
    ]).then(([genders, bodyTypes, tiers, ranks, countries, provinces, cities])=>{
      if(!alive) return; setData({ loading:false, error:null, genders, bodyTypes, tiers, ranks, countries, provinces, cities });
    }).catch(e=> alive && setData(d=>({ ...d, loading:false, error:e.message })));
    return ()=>{alive=false}; },[]);
  return data;
}

