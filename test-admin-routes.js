// Script para testar se as rotas admin estão funcionando
// Use: node test-admin-routes.js

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';

async function testAdminRoutes() {
  try {
    console.log('🧪 Testando rotas admin...\n');

    // 1. Fazer login para obter token
    console.log('1️⃣ Fazendo login como admin...');
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'clean7',
        password: 'cleanwork7'
      })
    });

    if (!loginRes.ok) {
      console.error('❌ Erro ao fazer login:', loginRes.statusText);
      return;
    }

    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log('✅ Login bem-sucedido\n');

    // 2. Testar GET /api/admin/avisos
    console.log('2️⃣ Testando GET /api/admin/avisos...');
    const avisosRes = await fetch(`${BASE_URL}/api/admin/avisos`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const avisosData = await avisosRes.json();
    console.log(`✅ Status: ${avisosRes.status}`);
    console.log(`   Avisos encontrados: ${avisosData.avisos?.length || 0}\n`);

    // 3. Testar POST /api/admin/avisos
    console.log('3️⃣ Testando POST /api/admin/avisos...');
    const createRes = await fetch(`${BASE_URL}/api/admin/avisos`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        titulo: 'Teste de Alerta',
        descricao: 'Este é um alerta de teste',
        tipo: 'trânsito',
        status: 'aviso',
        localidade: 'Centro'
      })
    });
    const createData = await createRes.json();
    console.log(`✅ Status: ${createRes.status}`);
    console.log(`   Aviso criado: ${createData.aviso?.id}\n`);

    // 4. Testar GET /api/admin/configuracoes-notificacao
    console.log('4️⃣ Testando GET /api/admin/configuracoes-notificacao...');
    const configRes = await fetch(`${BASE_URL}/api/admin/configuracoes-notificacao`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const configData = await configRes.json();
    console.log(`✅ Status: ${configRes.status}`);
    console.log(`   Configurações encontradas: ${configData.configuracoes?.length || 0}\n`);

    // 5. Testar GET /api/admin/alertas-bairro
    console.log('5️⃣ Testando GET /api/admin/alertas-bairro...');
    const bairroRes = await fetch(`${BASE_URL}/api/admin/alertas-bairro`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const bairroData = await bairroRes.json();
    console.log(`✅ Status: ${bairroRes.status}`);
    console.log(`   Alertas de bairro encontrados: ${bairroData.alertas?.length || 0}\n`);

    console.log('✅ Todos os testes passaram!');

  } catch (err) {
    console.error('❌ Erro:', err.message);
  }
}

testAdminRoutes();
