import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configurar o transporter de email
// Usando Gmail com senha de aplicativo
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'seu-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'sua-senha-de-app'
  }
});

// Função para enviar email de confirmação de solicitação
export async function enviarEmailConfirmacaoSolicitacao(email, solicitacao) {
  try {
    // Formatar dados para o email
    const dataFormatada = new Date(solicitacao.created_at).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const statusColors = {
      'Enviada': '#FF6B6B',
      'Repassada': '#FFA500',
      'Em Execução': '#FFD700',
      'Concluída': '#4CAF50',
      'Rejeitada': '#9E9E9E'
    };

    const statusColor = statusColors[solicitacao.status] || '#333';

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmação de Solicitação</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 3px solid #ff8c00;
            margin-bottom: 30px;
          }
          .header h1 {
            margin: 0;
            color: #333;
            font-size: 28px;
          }
          .header p {
            margin: 5px 0 0 0;
            color: #666;
            font-size: 14px;
          }
          .tracking-box {
            background: linear-gradient(135deg, #ff8c00 0%, #ff7b00 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
          }
          .tracking-box h2 {
            margin: 0 0 10px 0;
            font-size: 14px;
            font-weight: normal;
            opacity: 0.9;
          }
          .tracking-number {
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 2px;
            font-family: 'Courier New', monospace;
            word-break: break-all;
          }
          .tracking-instruction {
            margin-top: 10px;
            font-size: 12px;
            opacity: 0.9;
          }
          .details-section {
            margin: 30px 0;
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 6px;
            border-left: 4px solid #ff8c00;
          }
          .details-section h3 {
            margin: 0 0 15px 0;
            color: #333;
            font-size: 16px;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            padding-bottom: 12px;
            border-bottom: 1px solid #eee;
            font-size: 14px;
          }
          .detail-row:last-child {
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
          }
          .detail-label {
            color: #666;
            font-weight: 600;
          }
          .detail-value {
            color: #333;
          }
          .status-badge {
            display: inline-block;
            background-color: ${statusColor};
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            margin-top: 5px;
          }
          .info-box {
            background-color: #e3f2fd;
            border-left: 4px solid #2196F3;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
            font-size: 14px;
            color: #1565c0;
          }
          .next-steps {
            margin: 30px 0;
            padding: 20px;
            background-color: #fff3cd;
            border-left: 4px solid #ff8c00;
            border-radius: 6px;
          }
          .next-steps h3 {
            margin: 0 0 15px 0;
            color: #333;
            font-size: 16px;
          }
          .next-steps ol {
            margin: 0;
            padding-left: 20px;
            color: #555;
            font-size: 14px;
          }
          .next-steps li {
            margin-bottom: 8px;
          }
          .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #999;
            font-size: 12px;
            margin-top: 30px;
          }
          .link-button {
            display: inline-block;
            background-color: #ff8c00;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin-top: 15px;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Solicitação Recebida!</h1>
            <p>Sua solicitação foi registrada com sucesso em nossa plataforma</p>
          </div>

          <div class="tracking-box">
            <h2>Número de Rastreamento</h2>
            <div class="tracking-number">${solicitacao.numero_rastreamento}</div>
            <div class="tracking-instruction">Guarde este número para acompanhar sua solicitação</div>
          </div>

          <div class="details-section">
            <h3>📋 Detalhes da Solicitação</h3>
            <div class="detail-row">
              <span class="detail-label">Status:</span>
              <span class="detail-value">
                <div class="status-badge">${solicitacao.status}</div>
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Data de Envio:</span>
              <span class="detail-value">${dataFormatada}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">CEP:</span>
              <span class="detail-value">${solicitacao.cep || 'Não informado'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Endereço:</span>
              <span class="detail-value">
                ${solicitacao.rua || 'Não informado'}${solicitacao.numero ? ', ' + solicitacao.numero : ''}${solicitacao.bairro ? ' - ' + solicitacao.bairro : ''}
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Descrição:</span>
              <span class="detail-value">${solicitacao.descricao}</span>
            </div>
          </div>

          <div class="info-box">
            ℹ️ Sua solicitação foi registrada e está sendo analisada. Você receberá atualizações de status por email.
          </div>

          <div class="next-steps">
            <h3>📍 Próximos Passos</h3>
            <ol>
              <li><strong>Guarde o número de rastreamento</strong> (${solicitacao.numero_rastreamento}) para futuras consultas</li>
              <li><strong>Acompanhe o status</strong> através da plataforma ou por email</li>
              <li><strong>Coopere conosco</strong> respondendo a possíveis solicitações de informações adicionais</li>
              <li><strong>Celebre com a gente</strong> quando a solicitação for concluída! ✨</li>
            </ol>
          </div>

          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/home?track=${solicitacao.numero_rastreamento}" class="link-button">
              Acompanhar Solicitação
            </a>
          </div>

          <div class="footer">
            <p>Este é um email automático. Não responda a este email.</p>
            <p>© 2024 Plataforma de Transparência de São Luís - Todos os direitos reservados</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Enviar email
    const mailOptions = {
      from: process.env.EMAIL_USER || 'seu-email@gmail.com',
      to: email,
      subject: `✓ Solicitação Recebida - Número: ${solicitacao.numero_rastreamento}`,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email enviado:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return { success: false, error: error.message };
  }
}

// Função para enviar email de atualização de status
export async function enviarEmailAtualizacaoStatus(email, solicitacao, novoStatus, justificativa = null) {
  try {
    const dataFormatada = new Date().toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const statusEmojis = {
      'Enviada': '📋',
      'Repassada': '🏢',
      'Em Execução': '🔨',
      'Concluída': '✅',
      'Rejeitada': '❌'
    };

    const statusDescricoes = {
      'Enviada': 'Sua solicitação foi enviada e está sendo analisada',
      'Repassada': 'Sua solicitação foi repassada ao órgão competente',
      'Em Execução': 'O serviço foi agendado ou está em execução',
      'Concluída': 'Sua solicitação foi resolvida com sucesso!',
      'Rejeitada': 'Sua solicitação foi rejeitada'
    };

    const statusColor = {
      'Enviada': '#FF6B6B',
      'Repassada': '#FFA500',
      'Em Execução': '#FFD700',
      'Concluída': '#4CAF50',
      'Rejeitada': '#9E9E9E'
    };

    const emoji = statusEmojis[novoStatus] || '📌';
    const descricao = statusDescricoes[novoStatus] || '';
    const color = statusColor[novoStatus] || '#333';

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Atualização de Status</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 3px solid ${color};
            margin-bottom: 30px;
          }
          .header h1 {
            margin: 0;
            color: #333;
            font-size: 28px;
          }
          .status-box {
            background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%);
            color: white;
            padding: 30px 20px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
          }
          .status-emoji {
            font-size: 48px;
            margin-bottom: 10px;
          }
          .status-title {
            font-size: 24px;
            font-weight: bold;
            margin: 10px 0;
          }
          .status-description {
            font-size: 14px;
            opacity: 0.95;
            margin-top: 10px;
          }
          .tracking-number {
            background-color: #f9f9f9;
            border-left: 4px solid ${color};
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 16px;
            font-weight: bold;
          }
          .tracking-label {
            color: #666;
            font-size: 12px;
            margin-bottom: 5px;
          }
          .rejection-box {
            background-color: #ffebee;
            border-left: 4px solid #f44336;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
          }
          .rejection-title {
            color: #c62828;
            font-weight: 600;
            margin-bottom: 10px;
          }
          .rejection-text {
            color: #666;
            font-size: 14px;
            line-height: 1.6;
          }
          .info-section {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 6px;
            margin: 20px 0;
            border-left: 4px solid ${color};
          }
          .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #999;
            font-size: 12px;
            margin-top: 30px;
          }
          .link-button {
            display: inline-block;
            background-color: ${color};
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin-top: 15px;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Atualização de Status</h1>
          </div>

          <div class="status-box">
            <div class="status-emoji">${emoji}</div>
            <div class="status-title">${novoStatus}</div>
            <div class="status-description">${descricao}</div>
            <div style="margin-top: 15px; font-size: 12px; opacity: 0.9;">
              ${dataFormatada}
            </div>
          </div>

          <div class="tracking-number">
            <div class="tracking-label">Número de Rastreamento</div>
            <div>${solicitacao.numero_rastreamento}</div>
          </div>

          ${justificativa ? `
            <div class="rejection-box">
              <div class="rejection-title">Motivo da Rejeição</div>
              <div class="rejection-text">${justificativa}</div>
            </div>
          ` : ''}

          <div class="info-section">
            <strong style="color: #333; display: block; margin-bottom: 10px;">Localização:</strong>
            <div style="color: #666; font-size: 14px;">
              ${solicitacao.rua || 'Não informado'}${solicitacao.numero ? ', ' + solicitacao.numero : ''}
              <br>
              ${solicitacao.bairro || ''}, CEP: ${solicitacao.cep || 'Não informado'}
            </div>
          </div>

          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/home?track=${solicitacao.numero_rastreamento}" class="link-button">
              Ver Detalhes Completos
            </a>
          </div>

          <div class="footer">
            <p>Este é um email automático. Não responda a este email.</p>
            <p>© 2024 Plataforma de Transparência de São Luís</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER || 'seu-email@gmail.com',
      to: email,
      subject: `📬 Atualização: Solicitação ${solicitacao.numero_rastreamento} - ${novoStatus}`,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email de atualização enviado:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Erro ao enviar email de atualização:', error);
    return { success: false, error: error.message };
  }
}
