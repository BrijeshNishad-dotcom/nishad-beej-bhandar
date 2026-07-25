import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-key-for-build-purposes-only';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.warn('Warning: NEXT_PUBLIC_SUPABASE_URL is not set. Using dummy fallback for build.');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn('Warning: NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. Using dummy fallback for build.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: typeof window !== 'undefined',
    autoRefreshToken: typeof window !== 'undefined',
    detectSessionInUrl: true,
  },
});
