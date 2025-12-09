/**
 * Teste completo de solicitação/reclamação
 * 1. Login
 * 2. Criar solicitação
 * 3. Verificar no banco de dados
 */

async function testarFluxoSolicitacao() {
  const API_URL = 'http://localhost:5000/api';

  console.log('\n========================================');
  console.log('TESTE DE FLUXO DE SOLICITAÇÃO');
  console.log('========================================\n');

  // Credenciais de teste
  const username = 'vini7_test';
  const password = 'teste123';

  let token = null;
  let userId = null;

  // 1. FAZER LOGIN
  console.log('📝 [1] Fazendo login...\n');
  try {
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const loginData = await loginRes.json();

    if (!loginRes.ok) {
      console.error('❌ Erro no login:', loginData.message);
      return;
    }

    token = loginData.token;
    console.log('✅ Login bem-sucedido!');
    console.log('🔑 Token:', token.substring(0, 30) + '...\n');

    // Decodificar JWT para pegar user ID (sem validar assinatura apenas para teste)
    const parts = token.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      userId = payload.id;
      console.log('👤 User ID:', userId, '\n');
    }
  } catch (err) {
    console.error('❌ Erro ao fazer login:', err.message);
    return;
  }

  // 2. CRIAR SOLICITAÇÃO
  console.log('📝 [2] Criando solicitação...\n');
  const novaSolicitacao = {
    descricao: 'Buraco na rua - Teste Automatizado',
    cep: '65010-000',
    bairro: 'Centro',
    rua: 'Rua do Teste',
    numero: '123',
    latitude: -2.9141,
    longitude: -60.2119,
    fotos_urls: [],
    anonima: false
  };

  console.log('Dados:', JSON.stringify(novaSolicitacao, null, 2), '\n');

  let numeroRastreamento = null;

  try {
    const solicitacaoRes = await fetch(`${API_URL}/solicitacoes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(novaSolicitacao)
    });

    const text = await solicitacaoRes.text();
    let solicitacaoData = {};
    try {
      solicitacaoData = text ? JSON.parse(text) : {};
    } catch (e) {
      console.error('Resposta não é JSON:', text);
      return;
    }

    if (!solicitacaoRes.ok) {
      console.error('❌ Erro ao criar solicitação:', solicitacaoData.error || solicitacaoData.message);
      return;
    }

    numeroRastreamento = solicitacaoData.solicitacao?.numero_rastreamento;
    console.log('✅ Solicitação criada com sucesso!');
    console.log('📊 Dados retornados:', JSON.stringify(solicitacaoData.solicitacao, null, 2), '\n');
  } catch (err) {
    console.error('❌ Erro ao criar solicitação:', err.message);
    console.error('Stack:', err.stack);
    return;
  }

  // 3. BUSCAR SOLICITAÇÃO POR RASTREAMENTO
  if (numeroRastreamento) {
    console.log('📝 [3] Buscando solicitação por rastreamento...\n');
    console.log('Número:', numeroRastreamento, '\n');

    try {
      const rastreRes = await fetch(`${API_URL}/solicitacoes/rastreamento/${numeroRastreamento}`);
      const rastreData = await rastreRes.json();

      if (rastreRes.ok) {
        console.log('✅ Solicitação encontrada!');
        console.log('📊 Dados:', JSON.stringify(rastreData, null, 2), '\n');
      } else {
        console.error('❌ Solicitação não encontrada:', rastreData.error);
      }
    } catch (err) {
      console.error('❌ Erro ao buscar:', err.message);
    }
  }

  // 4. LISTAR SOLICITAÇÕES DO USUÁRIO
  console.log('📝 [4] Listando solicitações do usuário...\n');
  try {
    const listRes = await fetch(`${API_URL}/solicitacoes/minhas-solicitacoes`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const listData = await listRes.json();

    if (listRes.ok) {
      console.log('✅ Solicitações listadas!');
      console.log(`📊 Total: ${Array.isArray(listData) ? listData.length : listData.solicitacoes?.length || 0} solicitações`);
      if (Array.isArray(listData) && listData.length > 0) {
        console.log('Últimas 3:');
        listData.slice(0, 3).forEach((sol, i) => {
          console.log(`  ${i+1}. ${sol.numero_rastreamento} - ${sol.descricao.substring(0, 50)}`);
        });
      }
    } else {
      console.error('❌ Erro ao listar:', listData.error);
    }
  } catch (err) {
    console.error('❌ Erro:', err.message);
  }

  console.log('\n========================================');
  console.log('TESTE CONCLUÍDO!');
  console.log('========================================\n');
}

testarFluxoSolicitacao();
