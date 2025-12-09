/**
 * Teste: Verificar se as APIs estão retornando dados corretamente
 */

async function testarAPIs() {
  const API_URL = 'http://localhost:5000/api';

  console.log('\n========================================');
  console.log('TESTE: APIs de Solicitações');
  console.log('========================================\n');

  // Login como usuário normal
  console.log('📝 [1] Login como usuário normal...\n');
  let userToken = null;
  let userId = null;

  try {
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'vini7_test', password: 'teste123' })
    });

    const loginData = await loginRes.json();
    if (!loginRes.ok) {
      console.error('❌ Erro:', loginData.message);
      return;
    }

    userToken = loginData.token;
    const parts = userToken.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      userId = payload.id;
    }
    console.log('✅ Login bem-sucedido! User ID:', userId, '\n');
  } catch (err) {
    console.error('❌ Erro:', err.message);
    return;
  }

  // Testar: GET /solicitacoes/minhas-solicitacoes
  console.log('📝 [2] GET /solicitacoes/minhas-solicitacoes\n');
  try {
    const res = await fetch(`${API_URL}/solicitacoes/minhas-solicitacoes`, {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });

    console.log('Status:', res.status, res.statusText);
    const text = await res.text();
    console.log('Resposta raw:', text.substring(0, 200) + (text.length > 200 ? '...' : ''));

    const data = JSON.parse(text);
    console.log('Total:', Array.isArray(data) ? data.length : 'não é array');
    if (Array.isArray(data) && data.length > 0) {
      console.log('Primeira:', JSON.stringify(data[0], null, 2));
    }
  } catch (err) {
    console.error('❌ Erro:', err.message);
  }

  // Testar: GET /solicitacoes/admin/listar (admin)
  console.log('\n📝 [3] GET /solicitacoes/admin/listar (requer admin)\n');
  let adminToken = null;
  try {
    const adminLoginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'cleanwork', password: 'clean7' })
    });

    const adminLoginData = await adminLoginRes.json();
    if (!adminLoginRes.ok) {
      console.error('❌ Erro no login admin:', adminLoginData.message);
      return;
    }

    adminToken = adminLoginData.token;
    console.log('✅ Admin login bem-sucedido!\n');

    const res = await fetch(`${API_URL}/solicitacoes/admin/listar`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    console.log('Status:', res.status, res.statusText);
    const text = await res.text();
    console.log('Resposta raw:', text.substring(0, 300) + (text.length > 300 ? '...' : ''));

    const data = JSON.parse(text);
    console.log('Campo retornado:', Object.keys(data));
    if (data.solicitacoes) {
      console.log('Total:', data.solicitacoes.length);
      if (data.solicitacoes.length > 0) {
        console.log('Primeira:', JSON.stringify(data.solicitacoes[0], null, 2));
      }
    }
  } catch (err) {
    console.error('❌ Erro:', err.message);
  }

  console.log('\n========================================');
  console.log('Teste concluído!');
  console.log('========================================\n');
}

testarAPIs();
