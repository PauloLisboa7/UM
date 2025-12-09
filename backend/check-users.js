import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verificarUsuarios() {
  console.log('\n========================================');
  console.log('USUÁRIOS NO BANCO DE DADOS');
  console.log('========================================\n');

  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, email, role')
      .order('id', { ascending: true });

    if (error) throw error;

    if (!data || data.length === 0) {
      console.log('❌ Nenhum usuário encontrado!');
      return;
    }

    console.log(`✅ Total: ${data.length} usuários\n`);
    
    data.forEach(user => {
      console.log(`ID: ${user.id}`);
      console.log(`  Username: ${user.username}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Role: ${user.role}`);
      console.log('');
    });

  } catch (err) {
    console.error('❌ Erro:', err.message);
  }

  console.log('========================================\n');
}

verificarUsuarios();
