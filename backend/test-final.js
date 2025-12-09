/**
 * Teste final: Validar que usuários e admins conseguem ver suas solicitações
 */

async function testarSolicitacoes() {
  const API_URL = 'http://localhost:5000/api';

  console.log('\n========================================');
  console.log('TESTE FINAL: Solicitações no Sistema');
  console.log('========================================\n');

  // 1. Usuário normal vê suas solicitações
  console.log('📝 [1] Usuário normal vendo suas solicitações\n');
  try {
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'vini7_test', password: 'teste123' })
    });

    const loginData = await loginRes.json();
    const userToken = loginData.token;

    const res = await fetch(`${API_URL}/solicitacoes/minhas-solicitacoes`, {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });

    const data = await res.json();
    
    if (data.solicitacoes && Array.isArray(data.solicitacoes)) {
      console.log('✅ Solicitações carregadas corretamente!');
      console.log(`📊 Total: ${data.solicitacoes.length} solicitação(ões)`);
      
      data.solicitacoes.forEach((sol, i) => {
        console.log(`\n  ${i+1}. Rastreamento: ${sol.numero_rastreamento}`);
        console.log(`     Descrição: ${sol.descricao}`);
        console.log(`     Status: ${sol.status}`);
        console.log(`     Bairro: ${sol.bairro}`);
      });
    } else {
      console.error('❌ Formato incorreto:', typeof data.solicitacoes);
    }
  } catch (err) {
    console.error('❌ Erro:', err.message);
  }

  // 2. Admin vê TODAS as solicitações
  console.log('\n\n📝 [2] Admin vendo TODAS as solicitações\n');
  try {
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'cleanwork', password: 'clean7' })
    });

    const loginData = await loginRes.json();
    const adminToken = loginData.token;

    const res = await fetch(`${API_URL}/solicitacoes/admin/listar`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    const data = await res.json();
    
    if (data.solicitacoes && Array.isArray(data.solicitacoes)) {
      console.log('✅ Solicitações admin carregadas corretamente!');
      console.log(`📊 Total: ${data.solicitacoes.length} solicitação(ões) de TODOS os usuários`);
      
      data.solicitacoes.forEach((sol, i) => {
        console.log(`\n  ${i+1}. Rastreamento: ${sol.numero_rastreamento}`);
        console.log(`     Descrição: ${sol.descricao}`);
        console.log(`     Status: ${sol.status}`);
        console.log(`     Usuário: ${sol.user_id}`);
        console.log(`     Bairro: ${sol.bairro}`);
      });
    } else {
      console.error('❌ Formato incorreto:', typeof data.solicitacoes);
    }
  } catch (err) {
    console.error('❌ Erro:', err.message);
  }

  console.log('\n\n========================================');
  console.log('✅ Testes concluídos!');
  console.log('========================================\n');
}

testarSolicitacoes();
