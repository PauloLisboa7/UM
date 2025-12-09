async function testFlow() {
  console.log('\n========================================');
  console.log('TESTE COMPLETO: Login → Histórico');
  console.log('========================================\n');

  try {
    // Step 1: Login
    console.log('📝 [1] Fazendo login...\n');
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'paulolisboa7',
        password: 'paulo123'
      })
    });

    const loginData = await loginResponse.json();

    if (!loginResponse.ok) {
      console.log('❌ Login falhou!');
      console.log('Status:', loginResponse.status);
      console.log('Erro:', loginData);
      return;
    }

    const token = loginData.token;
    console.log('✅ Login sucesso!');
    console.log('Token recebido:', token.substring(0, 20) + '...\n');

    // Step 2: Buscar histórico
    console.log('📝 [2] Buscando histórico...\n');
    const historyResponse = await fetch('http://localhost:5000/api/solicitacoes/minhas-solicitacoes', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const historyData = await historyResponse.json();

    if (!historyResponse.ok) {
      console.log('❌ Erro ao buscar histórico!');
      console.log('Status:', historyResponse.status);
      console.log('Erro:', historyData);
      return;
    }

    console.log('✅ Histórico obtido!\n');
    console.log('Total de solicitações:', historyData.solicitacoes?.length || 0);
    
    if (historyData.solicitacoes && historyData.solicitacoes.length > 0) {
      console.log('\n📋 Solicitações:');
      historyData.solicitacoes.forEach((s, i) => {
        console.log(`\n  [${i+1}] ID: ${s.id}`);
        console.log(`      Descrição: ${s.descricao?.substring(0, 50)}...`);
        console.log(`      Status: ${s.status}`);
        console.log(`      Data: ${s.created_at}`);
      });
    }

  } catch (error) {
    console.log('❌ Erro:', error.message);
  }
}

testFlow();
