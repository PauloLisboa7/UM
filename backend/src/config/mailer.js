import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail', // ou outro serviço
  auth: {
    user: 'SEU_EMAIL@gmail.com',
    pass: 'SUA_SENHA_DE_APP',
  },
});

export const sendWelcomeEmail = async (toEmail, username) => {
  await transporter.sendMail({
    from: 'SEU_EMAIL@gmail.com',
    to: toEmail,
    subject: 'Bem-vindo ao sistema!',
    text: `Olá ${username}, obrigado por se cadastrar!`,
  });
};
