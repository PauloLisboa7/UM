import { createClient } from '@supabase/supabase-js';

let supabaseInstance = null;

export function initializeSupabase() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) throw new Error('SUPABASE_URL não está definida no .env');
  if (!supabaseKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY não está definida no .env');

  console.log('[SUPABASE] Inicializando cliente com URL:', supabaseUrl.substring(0, 40) + '...');
  supabaseInstance = createClient(supabaseUrl, supabaseKey);
  return supabaseInstance;
}

export function getSupabase() {
  if (!supabaseInstance) throw new Error('Supabase não inicializado. Chame initializeSupabase() primeiro.');
  return supabaseInstance;
}

// For backwards compatibility, also export as 'supabase'
export let supabase;

export function setSupabaseInstance(instance) {
  supabaseInstance = instance;
  // This will be called after initialization
}
