import dotenv from 'dotenv';
import { sendWelcomeEmail } from './src/config/mailer.js';

dotenv.config();

const testEmail = async () => {
  try {
    console.log('📧 Enviando email de teste para: lisboabet7@gmail.com');
    await sendWelcomeEmail('lisboabet7@gmail.com', 'Teste User');
    console.log('✅ Email enviado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error.message);
    process.exit(1);
  }
};

testEmail();
