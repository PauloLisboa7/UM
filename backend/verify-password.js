import './src/config/db.js';
import { getSupabase } from './src/config/supabaseClient.js';

async function verify() {
  const supabase = getSupabase();
  
  const { data, error } = await supabase
    .from('users')
    .select('id, username, email, password')
    .eq('username', 'paulolisboa7')
    .single();
  
  if (error) {
    console.log('❌ Erro:', error);
  } else {
    console.log('✅ Usuário encontrado:');
    console.log('ID:', data.id);
    console.log('Username:', data.username);
    console.log('Email:', data.email);
    console.log('Password hash:', data.password.substring(0, 20) + '...');
  }
}

verify().catch(console.error);
