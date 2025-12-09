import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createAdminUser() {
  console.log('\n========================================');
  console.log('CRIANDO USUÁRIO ADMIN');
  console.log('========================================\n');

  const username = 'cleanwork';
  const password = 'clean7';
  const email = 'admin@transparencia.ma.gov.br';
  const role = 'admin';

  console.log('📝 Dados do usuário:');
  console.log(`  Username: ${username}`);
  console.log(`  Email: ${email}`);
  console.log(`  Role: ${role}`);
  console.log('');

  try {
    // 1. Verificar se usuário já existe
    console.log('1️⃣ Verificando se usuário já existe...');
    const { data: existing, error: checkError } = await supabase
      .from('users')
      .select('id, username')
      .eq('username', username);

    if (checkError) {
      throw new Error(`Erro ao verificar usuário: ${checkError.message}`);
    }

    if (existing && existing.length > 0) {
      console.log('⚠️  Usuário já existe!');
      console.log('Dados atuais:');
      console.log(JSON.stringify(existing[0], null, 2));
      
      // Opcionalmente atualizar senha
      console.log('\n🔄 Atualizando senha...');
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const { data: updated, error: updateError } = await supabase
        .from('users')
        .update({ password: hashedPassword })
        .eq('username', username)
        .select();
      
      if (updateError) {
        throw new Error(`Erro ao atualizar: ${updateError.message}`);
      }
      
      console.log('✅ Senha atualizada com sucesso!');
      return;
    }

    console.log('✅ Usuário não existe, prosseguindo...\n');

    // 2. Hash da senha
    console.log('2️⃣ Hashando senha...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('✅ Senha hasheada\n');

    // 3. Inserir usuário admin
    console.log('3️⃣ Inserindo usuário admin na tabela users...');
    const { data, error } = await supabase
      .from('users')
      .insert([{
        username,
        password: hashedPassword,
        email,
        role
      }])
      .select();

    if (error) {
      console.error('❌ Erro ao inserir:', error);
      return;
    }

    console.log('✅ Usuário admin criado com sucesso!\n');
    console.log('📊 Dados inseridos:');
    console.log(JSON.stringify(data[0], null, 2));

    console.log('\n========================================');
    console.log('✅ ADMIN CRIADO COM SUCESSO!');
    console.log('========================================');
    console.log('\nCredenciais de acesso:');
    console.log(`  Username: ${username}`);
    console.log(`  Senha: ${password}`);
    console.log(`  Email: ${email}`);
    console.log(`  Role: ${role}`);
    console.log('');

  } catch (err) {
    console.error('❌ Erro:', err.message);
    console.error('Stack:', err.stack);
  }
}

createAdminUser();
