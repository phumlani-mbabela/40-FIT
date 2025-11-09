import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// ⬇️ Adjust this import to wherever you initialize Supabase
import { supabase } from '../lib/supabaseClient';

export default function RedirectIfAuthed({ to = '/home', children = null }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    // Check current session; if present, redirect away from auth-only pages
    supabase.auth.getSession().then(({ data }) => {
      const session = data?.session;
      if (mounted && session) {
        navigate(to, { replace: true, state: { from: location } });
      }
    });
    return () => { mounted = false; };
  }, [navigate, location, to]);

  // If not authed (or while checking), render the children (e.g., <Login/>)
  return children;
}
