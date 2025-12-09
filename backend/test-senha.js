import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verify() {
  try {
    // Buscar usuário
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', 'paulolisboa7')
      .single();

    if (error) {
      console.log('❌ Erro ao buscar usuário:', error.message);
      return;
    }

    console.log('\n✅ Usuário encontrado:');
    console.log('ID:', data.id);
    console.log('Username:', data.username);
    console.log('Email:', data.email);
    console.log('Password hash (primeiros 30 chars):', data.password.substring(0, 30));

    // Testar senha
    const senhaTestada = 'paulo123';
    const senhaValida = await bcrypt.compare(senhaTestada, data.password);
    console.log('\n🔐 Teste de senha:');
    console.log('Senha testada:', senhaTestada);
    console.log('Válida?', senhaValida ? '✅ SIM' : '❌ NÃO');

  } catch (err) {
    console.error('❌ Erro:', err.message);
  }
}

verify();
