import { createClient } from '@supabase/supabase-js';

const isServer = typeof window === 'undefined';

const supabaseUrl = 
  (isServer ? process.env['NEXT_PUBLIC_SUPABASE_URL'] : process.env.NEXT_PUBLIC_SUPABASE_URL) || 
  'https://dummy.supabase.co';

const supabaseAnonKey = 
  (isServer ? process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) || 
  'dummy-key-for-build-purposes-only';

if (isServer) {
  if (!process.env['NEXT_PUBLIC_SUPABASE_URL']) {
    console.warn('Warning: NEXT_PUBLIC_SUPABASE_URL is not set at runtime on the server.');
  }
  if (!process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']) {
    console.warn('Warning: NEXT_PUBLIC_SUPABASE_ANON_KEY is not set at runtime on the server.');
  }
} else {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.warn('Warning: NEXT_PUBLIC_SUPABASE_URL is not set on the client.');
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn('Warning: NEXT_PUBLIC_SUPABASE_ANON_KEY is not set on the client.');
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: typeof window !== 'undefined',
    autoRefreshToken: typeof window !== 'undefined',
    detectSessionInUrl: true,
  },
});
