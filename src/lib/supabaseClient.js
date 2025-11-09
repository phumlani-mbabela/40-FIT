import { createClient } from '@supabase/supabase-js';

const url = process.env.REACT_APP_SUPABASE_URL?.trim();
const anon = process.env.REACT_APP_SUPABASE_ANON_KEY?.trim();

export const hasSupabaseConfig = Boolean(url && anon);

// Temporary log so you can verify CRA picked them up:
if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line no-console
  console.log('[env check]', {
    REACT_APP_SUPABASE_URL: url,
    hasAnonKey: !!anon,
  });
}

export const supabase = hasSupabaseConfig
  ? createClient(url, anon, {
      auth: {
        detectSessionInUrl: true,
        flowType: 'pkce',
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;


