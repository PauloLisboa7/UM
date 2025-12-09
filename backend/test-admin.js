/**
 * Teste: Admin vê todas as solicitações e pode atualizar status
 */

async function testarFluxoAdmin() {
  const API_URL = 'http://localhost:5000/api';

  console.log('\n========================================');
  console.log('TESTE: FLUXO DE ADMIN');
  console.log('========================================\n');

  // Credenciais admin
  const adminUsername = 'cleanwork';
  const adminPassword = 'clean7';

  let adminToken = null;

  // 1. LOGIN COMO ADMIN
  console.log('📝 [1] Fazendo login como admin...\n');
  try {
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: adminUsername, password: adminPassword })
    });

    const loginData = await loginRes.json();

    if (!loginRes.ok) {
      console.error('❌ Erro no login:', loginData.message);
      return;
    }

    adminToken = loginData.token;
    console.log('✅ Login admin bem-sucedido!');
    console.log('🔑 Token:', adminToken.substring(0, 30) + '...\n');
  } catch (err) {
    console.error('❌ Erro ao fazer login:', err.message);
    return;
  }

  // 2. LISTAR TODAS AS SOLICITAÇÕES (ADMIN)
  console.log('📝 [2] Listando TODAS as solicitações (acesso admin)...\n');
  let solicitacoes = [];
  try {
    const listRes = await fetch(`${API_URL}/solicitacoes/admin/listar`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });

    const text = await listRes.text();
    let listData = {};
    try {
      listData = text ? JSON.parse(text) : {};
    } catch (e) {
      console.error('Resposta não é JSON:', text);
      return;
    }

    if (!listRes.ok) {
      console.error('❌ Erro ao listar:', listData.error);
      return;
    }

    solicitacoes = listData.solicitacoes || [];
    console.log('✅ Solicitações listadas!');
    console.log(`📊 Total: ${solicitacoes.length} solicitações\n`);

    if (solicitacoes.length > 0) {
      console.log('Primeiras 3 solicitações:');
      solicitacoes.slice(0, 3).forEach((sol, i) => {
        console.log(`  ${i+1}. ${sol.numero_rastreamento}`);
        console.log(`     User: ${sol.user_id}`);
        console.log(`     Status: ${sol.status}`);
        console.log(`     Bairro: ${sol.bairro}\n`);
      });
    }
  } catch (err) {
    console.error('❌ Erro ao listar solicitações:', err.message);
    return;
  }

  // 3. ATUALIZAR STATUS DE PRIMEIRA SOLICITAÇÃO
  if (solicitacoes.length > 0) {
    const primeiraSol = solicitacoes[0];
    
    console.log('📝 [3] Atualizando status da primeira solicitação...\n');
    console.log(`Solicitação: ${primeiraSol.numero_rastreamento}`);
    console.log(`Status atual: ${primeiraSol.status}`);
    console.log(`Novo status: Repassada\n`);

    try {
      const updateRes = await fetch(`${API_URL}/solicitacoes/admin/${primeiraSol.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          status: 'Repassada',
          justificativa: 'Encaminhado para departamento responsável'
        })
      });

      console.log('Status HTTP:', updateRes.status, updateRes.statusText);

      const text = await updateRes.text();
      console.log('Resposta raw:', text);
      
      let updateData = {};
      try {
        updateData = text ? JSON.parse(text) : {};
      } catch (e) {
        console.error('Resposta não é JSON:', text);
        return;
      }

      if (!updateRes.ok) {
        console.error('❌ Erro ao atualizar:', updateData.error, updateData.details);
        return;
      }

      console.log('✅ Status atualizado com sucesso!');
      console.log('📊 Nova solicitação:');
      console.log(JSON.stringify(updateData.solicitacao || updateData, null, 2));
    } catch (err) {
      console.error('❌ Erro na requisição:', err.message);
    }
  }

  console.log('\n========================================');
  console.log('✅ TESTE CONCLUÍDO!');
  console.log('========================================\n');
}

testarFluxoAdmin();
