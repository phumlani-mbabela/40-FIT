
import React, { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useDispatch } from 'react-redux';
import { setToken, setUser, setEmail } from '../store/slices/authSlice';
import { setAuthToken } from '../api/client';

export default function SupabaseAuthBridge({children}){
  const dispatch = useDispatch();
  useEffect(()=>{
    let mounted = true;
    const sync = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || null;
      const email = session?.user?.email || null;
      if(!mounted) return;
      dispatch(setToken(token)); setAuthToken(token);
      if(email){ dispatch(setEmail(email)); }
      dispatch(setUser(session?.user || null));
    };
    sync();
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      const token = session?.access_token || null;
      const email = session?.user?.email || null;
      dispatch(setToken(token)); setAuthToken(token);
      if(email){ dispatch(setEmail(email)); }
      dispatch(setUser(session?.user || null));
    });
    return ()=>{ mounted=false; sub?.subscription?.unsubscribe?.(); };
  }, [dispatch]);
  return <>{children}</>;
}
