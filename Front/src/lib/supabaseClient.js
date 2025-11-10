import { createClient } from '@supabase/supabase-js';

let client = null;

export function getSupabase() {
  if (client) return client;
  const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('[Supabase] Falta configurar PUBLIC_SUPABASE_URL o PUBLIC_SUPABASE_ANON_KEY');
    throw new Error('Config de Supabase incompleta');
  }
  client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return client;
}
