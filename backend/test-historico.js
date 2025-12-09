/**
 * Teste: Verificar por que o histórico não carrega para paulolisboa7
 */

async function testarHistorico() {
  const API_URL = 'http://localhost:5000/api';

  console.log('\n========================================');
  console.log('TESTE: Histórico para paulolisboa7');
  console.log('========================================\n');

  // 1. Tentar login com paulolisboa7
  console.log('📝 [1] Tentando login com paulolisboa7...\n');
  try {
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'paulolisboa7', password: 'senha123' })
    });

    const text = await loginRes.text();
    console.log('Status:', loginRes.status, loginRes.statusText);
    console.log('Response:', text.substring(0, 300));

    if (!loginRes.ok) {
      console.error('❌ Login falhou!');
      return;
    }

    const loginData = JSON.parse(text);
    const token = loginData.token;

    console.log('✅ Login bem-sucedido!');
    
    // Decodificar token
    const parts = token.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      console.log('Token payload:', payload, '\n');
    }

    // 2. Testar GET /solicitacoes/minhas-solicitacoes
    console.log('📝 [2] GET /solicitacoes/minhas-solicitacoes\n');
    console.log('Headers:', { 'Authorization': `Bearer ${token.substring(0, 30)}...` });

    const histRes = await fetch(`${API_URL}/solicitacoes/minhas-solicitacoes`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const histText = await histRes.text();
    console.log('Status:', histRes.status, histRes.statusText);
    console.log('Response:', histText.substring(0, 500));

    if (!histRes.ok) {
      console.error('❌ Erro ao buscar histórico!');
      return;
    }

    const histData = JSON.parse(histText);
    console.log('\n✅ Resposta recebida!');
    console.log('Type of response:', typeof histData);
    console.log('Fields:', Object.keys(histData));
    
    if (histData.solicitacoes) {
      console.log(`\n📊 Solicitações: ${histData.solicitacoes.length}`);
      histData.solicitacoes.forEach(sol => {
        console.log(`  - ${sol.numero_rastreamento}: ${sol.descricao}`);
      });
    } else {
      console.log('❌ Campo "solicitacoes" não encontrado!');
    }

  } catch (err) {
    console.error('❌ Erro:', err.message);
  }

  console.log('\n========================================\n');
}

testarHistorico();
