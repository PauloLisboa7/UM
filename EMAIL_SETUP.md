# Configuração de Email com Gmail

## Variáveis de Ambiente Necessárias

Para que o sistema de envio de emails funcione, adicione as seguintes variáveis ao arquivo `.env` do backend:

```env
# Gmail Configuration
EMAIL_USER=seu-email@gmail.com
EMAIL_PASSWORD=sua-senha-de-app

# Frontend URL (para links nos emails)
FRONTEND_URL=http://localhost:5173
```

## Como Gerar Senha de App do Gmail

1. **Acesse sua conta Google**
   - Vá para https://myaccount.google.com
   - Clique em "Segurança" no menu lateral esquerdo

2. **Habilite a Autenticação em Duas Etapas**
   - Se já não estiver ativada, siga as instruções na seção "Autenticação em duas etapas"

3. **Gere uma Senha de App**
   - Depois que 2FA estiver ativado, você verá a opção "Senhas de app"
   - Clique em "Senhas de app"
   - Selecione "Mail" como app
   - Selecione "Windows Computer" (ou seu sistema operacional)
   - Google irá gerar uma senha de 16 caracteres
   - **Use esta senha no arquivo .env como `EMAIL_PASSWORD`**

## Emails Enviados Automaticamente

### 1. Email de Confirmação de Solicitação
- **Quando:** Imediatamente após a criação da solicitação
- **Para:** Email do usuário logado
- **Conteúdo:**
  - Título: "Solicitação Recebida!"
  - Número de rastreamento (destacado)
  - Detalhes completos da solicitação (CEP, endereço, descrição)
  - Instruções de próximos passos
  - Link direto para acompanhar a solicitação

### 2. Email de Atualização de Status
- **Quando:** Toda vez que o status de uma solicitação é atualizado
- **Para:** Email do usuário que fez a solicitação
- **Conteúdo:**
  - Novo status com emoji e cor correspondente
  - Data e hora da atualização
  - Número de rastreamento
  - Se rejeitado: motivo da rejeição
  - Localização completa da solicitação
  - Link para ver detalhes completos

## Testes

Para testar o sistema de emails localmente:

1. Configure as variáveis de ambiente com sua conta Gmail
2. Crie uma solicitação através do frontend
3. Verifique se o email foi recebido na caixa de entrada

## Solução de Problemas

### "550 User not found" ou "535 5.7.8 Username and password not accepted"
- Verifique se a senha do app está correta
- Certifique-se de que 2FA está ativado
- Gere uma nova senha de app

### Emails não são enviados
- Verifique se `EMAIL_USER` e `EMAIL_PASSWORD` estão no `.env`
- Verifique os logs do backend para erros de envio
- Confirme que o Gmail permite conexões menos seguras (já incluído na senha de app)

### O link no email não funciona
- Certifique-se de que `FRONTEND_URL` está configurado corretamente
- Se rodando localmente, use `http://localhost:5173`
- Se em produção, use a URL do seu domínio (ex: `https://seu-dominio.com`)
