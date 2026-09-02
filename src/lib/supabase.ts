import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const createDemoClient = () => ({
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({
      data: { subscription: { unsubscribe: () => undefined } },
    }),
    signInWithPassword: async () => ({
      data: { user: null, session: null },
      error: {
        message: 'Supabase is not configured for this deployment yet.',
        name: 'ConfigurationError',
        status: 0,
      },
    }),
    signUp: async () => ({
      data: { user: null, session: null },
      error: {
        message: 'Supabase is not configured for this deployment yet.',
        name: 'ConfigurationError',
        status: 0,
      },
    }),
    signOut: async () => ({ error: null }),
  },
  from: () => {
    throw new Error('Supabase is not configured for this deployment yet.');
  },
}) as unknown as SupabaseClient<Database>;

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : createDemoClient();
