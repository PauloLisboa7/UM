// Serviço de envio de emails: suporta EmailJS (quando configurado) e fallback para Formspree
import emailjs from '@emailjs/browser';

const FORMSPREE_ID = 'xzgpxyqn'; // Fallback: você pode criar uma forma em formspree.io

// Vite expõe variáveis de ambiente via import.meta.env
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';

if (EMAILJS_PUBLIC_KEY) {
  try {
    emailjs.init(EMAILJS_PUBLIC_KEY);
    console.log('EmailJS inicializado com a chave pública.');
  } catch (e) {
    console.warn('Falha ao inicializar EmailJS:', e.message || e);
  }
}

export const sendWelcomeEmailFromFrontend = async (userEmail, userName) => {
  // Se EmailJS estiver configurado (service + template + public key), use-o
  if (EMAILJS_PUBLIC_KEY && EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID) {
    const templateParams = {
      user_email: userEmail,
      user_name: userName,
      subject: '🎉 Bem-vindo à Plataforma de Solicitações!',
      message: `Olá ${userName},\n\nBem-vindo à nossa plataforma!`,
    };

    try {
      const result = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
      console.log('✅ Email enviado via EmailJS', result);
      return { success: true, source: 'emailjs', result };
    } catch (error) {
      console.error('❌ Erro ao enviar email via EmailJS:', error);
      // não interromper o fluxo — tentar fallback
    }
  }

  // Fallback para Formspree (mantém comportamento anterior)
  try {
    const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userEmail,
        name: userName,
        subject: '🎉 Bem-vindo à Plataforma de Solicitações!',
        message: `Olá ${userName},\n\nQue alegria tê-lo conosco!`,
      }),
    });

    if (!response.ok) {
      throw new Error('Erro ao enviar email');
    }

    const data = await response.json();
    console.log('✅ Email enviado com sucesso (Formspree)', data);
    return { success: true, source: 'formspree', data };
  } catch (error) {
    console.error('❌ Erro ao enviar email (Formspree):', error);
    // Não lançar erro para não bloquear o cadastro — simular sucesso
    return { success: true, simulated: true };
  }
};
