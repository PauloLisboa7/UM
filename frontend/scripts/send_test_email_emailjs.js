const fetch = global.fetch || require('node-fetch');

(async () => {
  try {
    const service_id = process.argv[2] || 'service_1rfe7qw';
    const template_id = process.argv[3] || 'template_jnjnkys';
    const user_id = process.argv[4] || 'qvlNxrJsFdvVJ_g9O';
    const targetEmail = process.argv[5] || 'lisboabet7@gmail.com';
    const targetName = process.argv[6] || 'Paulo Lisboa';
    const private_key = process.argv[7] || 'A7aKkEZXZb_-Na0mjg6wn';

    const payload = {
      service_id,
      template_id,
      user_id,
      accessToken: private_key,
      template_params: {
        user_email: targetEmail,
        user_name: targetName,
        subject: '🎉 Bem-vindo à Plataforma de Solicitações! (Teste via EmailJS)',
        message: `Olá ${targetName},\n\nEste é um email de teste enviado via EmailJS (API REST).`,
        to_email: targetEmail
      }
    };

    console.log('Enviando via EmailJS para', targetEmail);

    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const txt = await res.text();
    if (!res.ok) {
      console.error('Falha no envio. Status:', res.status, txt);
      process.exitCode = 1;
      return;
    }

    console.log('Resposta EmailJS:', txt);
    console.log('✅ Enviado via EmailJS — verifique a caixa de entrada do destinatário.');
  } catch (err) {
    console.error('Erro ao enviar via EmailJS:', err);
    process.exitCode = 2;
  }
})();
