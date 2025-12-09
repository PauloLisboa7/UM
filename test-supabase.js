// Test script for registration and login
const API_URL = 'http://localhost:5000/api';

async function testRegister() {
  console.log('\n=== TESTANDO CADASTRO ===\n');
  
  const testUser = {
    username: `testuser_${Date.now()}`,
    email: `test_${Date.now()}@example.com`,
    password: 'senha123'
  };

  console.log('📝 Cadastrando usuário:', testUser.username);
  
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });

    const body = await response.json();
    
    if (response.ok) {
      console.log('✅ Cadastro bem-sucedido!');
      console.log('Resposta:', JSON.stringify(body, null, 2));
      return testUser;
    } else {
      console.log('❌ Erro no cadastro (Status ' + response.status + ')');
      console.log('Mensagem:', body.message || body.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Erro na requisição:', error.message);
    return null;
  }
}

async function testLogin(user) {
  if (!user) {
    console.log('⏭️  Pulando login - cadastro falhou');
    return;
  }

  console.log('\n=== TESTANDO LOGIN ===\n');
  console.log('🔑 Fazendo login com:', user.username);

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: user.username,
        password: user.password
      })
    });

    const body = await response.json();

    if (response.ok) {
      console.log('✅ Login bem-sucedido!');
      console.log('Token:', body.token ? body.token.substring(0, 20) + '...' : 'N/A');
      console.log('Role:', body.role);
      return body.token;
    } else {
      console.log('❌ Erro no login (Status ' + response.status + ')');
      console.log('Mensagem:', body.message || body.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Erro na requisição:', error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 TESTE DE SUPABASE INTEGRATION');
  console.log('==================================');
  
  const user = await testRegister();
  await testLogin(user);
  
  console.log('\n==================================');
  console.log('✅ Teste concluído!');
}

main();
