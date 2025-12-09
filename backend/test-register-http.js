async function testRegisterAPI() {
  const testUser = {
    username: 'vini7_http_test',
    email: 'test@example.com',
    password: 'senha123'
  };

  console.log('\n🌐 Testando POST para /api/auth/register\n');
  console.log('URL:', 'http://localhost:5000/api/auth/register');
  console.log('Body:', JSON.stringify(testUser, null, 2));
  console.log('');

  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });

    console.log('Status:', response.status, response.statusText);
    
    const text = await response.text();
    console.log('Response Body (raw):', text);
    
    try {
      const json = JSON.parse(text);
      console.log('Response Body (parsed):', JSON.stringify(json, null, 2));
    } catch (e) {
      console.log('(Não é JSON válido)');
    }

  } catch (err) {
    console.error('❌ Erro na requisição:', err.message);
  }
}

testRegisterAPI();
