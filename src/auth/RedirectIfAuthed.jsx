// src/auth/RedirectIfAuthed.jsx
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function RedirectIfAuthed({ children }) {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setSession(data.session ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (mounted) setSession(nextSession ?? null);
    });
    return () => sub?.subscription?.unsubscribe?.();
  }, []);

  if (session === undefined) return null;           // loading
  if (session) return <Navigate to="/allservices" replace />;

  return children; // not authed -> show login/signup
}
