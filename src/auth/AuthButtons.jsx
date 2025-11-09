import React from 'react';
import { supabase, hasSupabaseConfig } from '../lib/supabaseClient';

export default function AuthButtons() {
  if (!hasSupabaseConfig || !supabase) {
    return (
      <div style={{ padding: 12, border: '1px solid #fca5a5', background: '#fef2f2', borderRadius: 8 }}>
        <strong>Auth isn’t configured.</strong><br />
        Add <code>REACT_APP_SUPABASE_URL</code> and <code>REACT_APP_SUPABASE_ANON_KEY</code> to <code>.env</code> at the project root,
        then stop and re-run <code>npm start</code>.
      </div>
    );
  }

  const handleAuth = async (provider) => {
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo } });
    if (error) { console.error(error); alert(error.message); }
  };

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <button onClick={() => handleAuth('google')}>Continue with Google</button>
      <button onClick={() => handleAuth('facebook')}>Continue with Facebook</button>
      <button onClick={() => handleAuth('linkedin')}>Continue with LinkedIn</button>
    </div>
  );
}


