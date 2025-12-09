import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function resetarSenhaUsuario() {
  console.log('\n========================================');
  console.log('RESETAR SENHA DE USUÁRIO');
  console.log('========================================\n');

  const username = 'paulolisboa7';
  const novaSenha = 'paulo123';

  try {
    console.log(`📝 Atualizando senha de ${username}...\n`);
    
    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(novaSenha, 10);
    console.log('✅ Senha hasheada\n');

    // Atualizar usuário
    const { data, error } = await supabase
      .from('users')
      .update({ password: hashedPassword })
      .eq('username', username)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      console.error(`❌ Usuário ${username} não encontrado!`);
      return;
    }

    console.log(`✅ Senha atualizada com sucesso!\n`);
    console.log('Credenciais:');
    console.log(`  Username: ${username}`);
    console.log(`  Senha: ${novaSenha}`);
    console.log(`  Email: ${data[0].email}`);

  } catch (err) {
    console.error('❌ Erro:', err.message);
  }

  console.log('\n========================================\n');
}

resetarSenhaUsuario();
