import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

// Verificar se as env vars estão carregadas
console.log('🔍 Verificando variáveis de ambiente...');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Carregado' : '❌ Não carregado');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Carregado' : '❌ Não carregado');

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Variáveis de ambiente não configuradas!');
  process.exit(1);
}

// Criar cliente Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testCreateUser() {
  console.log('\n📝 Testando criação de usuário...\n');

  const username = 'vini7_test';
  const email = 'tasaka343@gmail.com';
  const password = 'teste123';

  try {
    // 1. Verificar se usuário já existe
    console.log('1️⃣ Verificando se usuário já existe...');
    const { data: existing, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw new Error(`Erro ao verificar usuário: ${checkError.message}`);
    }

    if (existing) {
      console.log('⚠️ Usuário já existe. Tentando deletar...');
      const { error: delError } = await supabase
        .from('users')
        .delete()
        .eq('username', username);
      if (delError) console.log('Erro ao deletar:', delError.message);
    }
    console.log('✅ Prosseguindo...');

    // 2. Hash da senha
    console.log('\n2️⃣ Hashando senha...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('✅ Senha hasheada');

    // 3. Inserir usuário
    console.log('\n3️⃣ Inserindo usuário na tabela users...');
    const { data, error } = await supabase
      .from('users')
      .insert([{
        username,
        password: hashedPassword,
        email,
        role: 'user'
      }])
      .select();

    if (error) {
      console.error('❌ Erro ao inserir:', error);
      console.error('Código:', error.code);
      console.error('Status:', error.status);
      console.error('Message:', error.message);
      return;
    }

    console.log('✅ Usuário criado com sucesso!');
    console.log('📊 Dados retornados:', JSON.stringify(data, null, 2));

  } catch (err) {
    console.error('❌ Erro:', err.message);
    console.error('Stack:', err.stack);
  }
}

testCreateUser();
