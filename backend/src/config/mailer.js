// Transporter para Mailtrap via API REST
export const transporter = {
  sendMail: async (mailOptions) => {
    try {
      const payload = {
        from: {
          email: mailOptions.from || 'hello@demomailtrap.com',
          name: 'Plataforma de Solicitações',
        },
        to: [
          {
            email: mailOptions.to,
          },
        ],
        subject: mailOptions.subject,
        html: mailOptions.html,
        text: mailOptions.text,
      };

      const response = await fetch('https://send.api.mailtrap.io/api/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.MAILTRAP_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(JSON.stringify(error));
      }

      const data = await response.json();
      console.log(`✅ Email enviado via Mailtrap para ${mailOptions.to}`);
      return data;
    } catch (error) {
      console.error('❌ Erro ao enviar email:', error.message);
      throw error;
    }
  },
};

export const sendWelcomeEmail = async (toEmail, username) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bem-vindo!</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f5f5f5;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #ffffff;
          padding: 40px 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .content {
          padding: 40px 30px;
          color: #333333;
          line-height: 1.6;
        }
        .content h2 {
          color: #667eea;
          margin-top: 0;
        }
        .content p {
          margin: 15px 0;
          font-size: 16px;
        }
        .highlight {
          background-color: #f0f4ff;
          padding: 15px;
          border-left: 4px solid #667eea;
          margin: 20px 0;
          border-radius: 4px;
        }
        .cta-button {
          display: inline-block;
          background-color: #667eea;
          color: #ffffff;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 6px;
          margin: 20px 0;
          font-weight: 600;
        }
        .footer {
          background-color: #f9f9f9;
          padding: 20px;
          text-align: center;
          color: #666666;
          font-size: 14px;
          border-top: 1px solid #eeeeee;
        }
        .footer p {
          margin: 5px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Bem-vindo!</h1>
        </div>
        <div class="content">
          <h2>Olá ${username},</h2>
          <p>Que alegria tê-lo conosco! 😊</p>
          <p>Agradecemos sinceramente por se cadastrar em nossa plataforma. Você agora faz parte de uma comunidade dedicada a melhorar nosso bairro e nossa cidade.</p>
          
          <div class="highlight">
            <strong>O que você pode fazer agora:</strong>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>📝 Solicitar reclamações sobre problemas nas ruas</li>
              <li>👀 Acompanhar o histórico de suas solicitações</li>
              <li>📍 Explorar informações sobre seu bairro</li>
              <li>🔔 Receber alertas e avisos importantes</li>
            </ul>
          </div>

          <p>Se você tiver dúvidas sobre como usar a plataforma, não hesite em consultar nossa seção "Como Usar".</p>

          <a href="${process.env.FRONTEND_URL}/home" class="cta-button">Começar Agora</a>

          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Se você não se cadastrou, por favor, ignore este email.
          </p>
        </div>
        <div class="footer">
          <p><strong>Plataforma de Solicitações e Reclamações</strong></p>
          <p>© 2025. Todos os direitos reservados.</p>
          <p>Dúvidas? Entre em contato conosco.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: process.env.MAILTRAP_SENDER_EMAIL || 'hello@demomailtrap.com',
      to: toEmail,
      subject: '🎉 Bem-vindo à Plataforma de Solicitações!',
      html: htmlContent,
      text: `Olá ${username}, obrigado por se cadastrar em nossa plataforma!`,
    });
    
    console.log(`✅ Email de boas-vindas enviado para ${toEmail}`);
    return { success: true };
  } catch (error) {
    console.error(`❌ Erro ao enviar email para ${toEmail}:`, error.message);
    throw error;
  }
};
