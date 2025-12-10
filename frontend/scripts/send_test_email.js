const fetch = global.fetch || require('node-fetch');

(async () => {
  try {
    const FORMSPREE_ID = 'xzgpxyqn';
    const targetEmail = process.argv[2] || 'lisboabet7@gmail.com';
    const targetName = process.argv[3] || 'Paulo Teste';

    const payload = {
      email: targetEmail,
      name: targetName,
      subject: '🎉 Bem-vindo à Plataforma de Solicitações! (Teste) ',
      message: `Olá ${targetName},\n\nEste é um email de teste enviado via Formspree (envio automático de teste).`,
    };

    console.log('Enviando teste para', targetEmail);

    const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    if (!res.ok) {
      console.error('Falha no envio. Status:', res.status, text);
      process.exitCode = 1;
      return;
    }

    console.log('Resposta do Formspree:', text);
    console.log('✅ Enviado (ou enfileirado) — verifique a caixa de entrada do destinatário.');
  } catch (err) {
    console.error('Erro ao enviar teste:', err);
    process.exitCode = 2;
  }
})();
