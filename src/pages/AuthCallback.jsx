import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function run() {
      try {
        // If the user already has a session (e.g., they refreshed on this page), just go home.
        const { data: initial } = await supabase.auth.getSession();
        if (initial?.session && !cancelled) {
          navigate('/allservices', { replace: true });
          return;
        }

        // PKCE OAuth exchange; required on the callback URL.
        const { data, error } = await supabase.auth.exchangeCodeForSession({
          // Optional; supabase-js will read from window.location if omitted.
          // authCode: new URLSearchParams(location.search).get('code'),
        });

        if (error) throw error;

        if (!cancelled) {
          // Signed in -> go to your app’s landing
          navigate('/allservices', { replace: true });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || 'Sign-in failed. Please try again.');
        }
      }
    }

    run();

    // Safety: If something hangs >10s, let user escape
    const timer = setTimeout(() => {
      if (!cancelled) setError('Still completing sign-in… If this persists, close this tab and try again.');
    }, 10_000);

    return () => {
      cancelled = true;
      controller.abort();
      clearTimeout(timer);
    };
    // location included so a second try (e.g., user retries) will rerun
  }, [navigate, location]);

  if (error) {
    return (
      <div className="page-content">
        <h1>Sign-in error</h1>
        <p>{error}</p>
        <button onClick={() => navigate('/login')}>Back to login</button>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div>Completing sign-in…</div>
    </div>
  );
}
