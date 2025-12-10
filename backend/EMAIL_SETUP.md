# Configuração de Email para o Projeto

Para que o sistema de envio de emails funcione, você precisa configurar as credenciais do Gmail.

## Passo 1: Habilitar 2FA no Gmail

1. Acesse: https://myaccount.google.com/security
2. Procure por "Verificação em 2 etapas" e ative

## Passo 2: Gerar Senha de App

1. Acesse: https://myaccount.google.com/apppasswords
2. Selecione "Mail" e "Windows Computer" (ou seu dispositivo)
3. Copie a senha gerada (16 caracteres sem espaços)

## Passo 3: Atualizar .env

Edite o arquivo `backend/.env` e atualize:

```
EMAIL_USER=seu-email@gmail.com
EMAIL_PASSWORD=sua-senha-de-app-16-caracteres
```

**Exemplo:**
```
EMAIL_USER=lisboabet7@gmail.com
EMAIL_PASSWORD=xyzabc defghijklm
```

## Passo 4: Testar

Execute no terminal da pasta backend:

```bash
node test-welcome-email.js
```

Se funcionar, você verá: `✅ Email enviado com sucesso!`

## Solução de Problemas

- **"Missing credentials for PLAIN"**: As variáveis EMAIL_USER ou EMAIL_PASSWORD estão vazias ou faltando
- **"Invalid login credentials"**: Verifique se a senha de app está correta e sem espaços extras
- **Email não chega**: Verifique a pasta de spam/lixo
