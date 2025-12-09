async function testLogin() {
  console.log('\n========================================');
  console.log('TESTE DE LOGIN - paulolisboa7');
  console.log('========================================\n');

  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'paulolisboa7',
        password: 'paulo123'
      })
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Login sucesso!');
      console.log('Status:', response.status);
      console.log('Token:', data.token ? '✅ Recebido' : '❌ Não recebido');
      console.log('User ID:', data.user?.id);
      console.log('Username:', data.user?.username);
      console.log('Email:', data.user?.email);
      console.log('Is Admin:', data.user?.is_admin);
    } else {
      console.log('❌ Login falhou!');
      console.log('Status:', response.status);
      console.log('Erro:', data);
    }

  } catch (error) {
    console.log('❌ Erro de conexão:', error.message);
  }
}

testLogin();
