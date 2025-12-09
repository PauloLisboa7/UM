# ⚡ START HERE - Guia de Início em 10 Minutos

## 🎯 Você está aqui

Você já fez:
- ✅ Migração de Supabase para Neon
- ✅ Conversão de todos os models para SQL direto
- ✅ Integração de emails
- ✅ Remoção de funcionalidades antigas
- ✅ Documentação completa

Agora: **Apenas 5 passos para colocar em produção!**

---

## 🚀 5 Passos Essenciais

### 1️⃣ Criar Conta Neon (2 minutos)
```
https://neon.tech
→ Click "Sign up"
→ Use Google ou GitHub
→ Confirme email
```

### 2️⃣ Copiar Connection String (1 minuto)
```
No dashboard Neon:
1. Click no seu projeto
2. Copie: postgresql://user:password@host/db?sslmode=require
```

### 3️⃣ Configurar .env (1 minuto)
```bash
# backend/.env

NEON_DATABASE_URL=postgresql://seu-user:sua-senha@seu-host/seu-banco?sslmode=require
JWT_SECRET=sua-chave-secreta-aqui
EMAIL_USER=seu-email@gmail.com
EMAIL_PASSWORD=sua-senha-de-app-gmail
FRONTEND_URL=http://localhost:5173
PORT=5000
```

### 4️⃣ Criar Tabelas (2 minutos)
```
Neon SQL Editor
↓
Cole este SQL:
```

```sql
-- Tabela de usuários
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de solicitações
CREATE TABLE solicitacoes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  descricao TEXT NOT NULL,
  cep VARCHAR(20),
  bairro VARCHAR(255),
  rua VARCHAR(255),
  numero VARCHAR(50),
  latitude NUMERIC,
  longitude NUMERIC,
  fotos_urls TEXT[] DEFAULT '{}',
  anonima BOOLEAN DEFAULT false,
  numero_rastreamento VARCHAR(255) UNIQUE,
  status VARCHAR(100) DEFAULT 'Enviada/Em Análise',
  orgao_competente VARCHAR(255),
  justificativa_rejeicao TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de histórico
CREATE TABLE status_historico (
  id SERIAL PRIMARY KEY,
  solicitacao_id INTEGER REFERENCES solicitacoes(id),
  status_anterior VARCHAR(100),
  status_novo VARCHAR(100),
  orgao_competente VARCHAR(255),
  justificativa TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de notificações
CREATE TABLE notificacoes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  solicitacao_id INTEGER REFERENCES solicitacoes(id),
  mensagem TEXT,
  lida BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_solicitacoes_numero_rastreamento ON solicitacoes(numero_rastreamento);
CREATE INDEX idx_solicitacoes_user_id ON solicitacoes(user_id);
CREATE INDEX idx_solicitacoes_status ON solicitacoes(status);
CREATE INDEX idx_status_historico_solicitacao ON status_historico(solicitacao_id);
```

### 5️⃣ Testar (1 minuto)
```bash
cd backend
npm run dev
```

Você deve ver:
```
Neon: conexão com PostgreSQL estabelecida
Neon: conexão verificada (consulta de teste OK).
Servidor rodando na porta 5000
```

✅ **Pronto! Sua API está rodando!**

---

## 🧪 Testar Endpoints

### Login
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username":"testuser",
    "password":"123456",
    "email":"test@email.com"
  }'
```

### Criar Solicitação
```bash
# Primeiro faça login e copie o token

curl -X POST http://localhost:5000/api/solicitacoes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "descricao":"Buraco na rua",
    "cep":"65020-360",
    "bairro":"Centro",
    "rua":"Rua do Comércio",
    "numero":"123",
    "latitude":-2.5349,
    "longitude":-44.3050
  }'
```

Salve o `numero_rastreamento` retornado!

### Acompanhar
```bash
curl http://localhost:5000/api/solicitacoes/rastreamento/SOL-1702076400000-ABC123XYZ
```

### Ver Mapa
```bash
curl http://localhost:5000/api/solicitacoes/publicas/todas
```

---

## 🎮 Testar Frontend

```bash
cd frontend
npm run dev
```

Acesse `http://localhost:5173`

### Fluxo:
1. **Home** → Clique "Solicitar Reclamação"
2. **Formulário** → Preencha e envie
3. **Confirmação** → Veja o número de rastreamento
4. **Como usar** → Acompanhe sua solicitação
5. **Mapa** → Visualize no mapa

---

## 📧 Configurar Email

Para emails funcionarem:

### 1. Habilitar 2FA no Gmail
- https://myaccount.google.com → Segurança → 2FA

### 2. Gerar Senha de App
- https://myaccount.google.com → Segurança → Senhas de app
- Selecione "Mail" e "Windows"
- Copie a senha de 16 caracteres

### 3. Adicionar ao .env
```env
EMAIL_USER=seu-email@gmail.com
EMAIL_PASSWORD=aaaa-bbbb-cccc-dddd
```

### 4. Testar
- Crie uma solicitação
- Verifique email na caixa de entrada

---

## ⚠️ Erros Comuns

### "NEON_DATABASE_URL is not defined"
```bash
# Verifique se está no arquivo .env
# Reinicie: npm run dev
```

### "relation 'users' does not exist"
```bash
# Execute o SQL de criação de tabelas no Neon SQL Editor
```

### "connect ECONNREFUSED"
```bash
# Verifique a connection string do Neon
# Teste: psql "sua-neon-url"
```

### "Email não enviado"
```bash
# Verifique EMAIL_USER e EMAIL_PASSWORD no .env
# Use senha de app, não a senha normal do Gmail
```

---

## 📚 Documentação

Depois de tudo pronto, explore:

1. **API_DOCS.md** - Todos os endpoints
2. **ARCHITECTURE.md** - Diagrama da arquitetura
3. **MIGRATION_SUMMARY.md** - O que mudou
4. **CLEANUP_GUIDE.md** - Remover arquivos antigos (opcional)

---

## ✅ Checklist de Setup

- [ ] Conta Neon criada
- [ ] Connection string copiada
- [ ] `.env` atualizado
- [ ] Tabelas criadas (SQL executado)
- [ ] `npm run dev` funciona
- [ ] Login funciona
- [ ] Solicitação criada
- [ ] Email recebido
- [ ] Acompanhamento funciona
- [ ] Mapa funciona
- [ ] Frontend funciona

---

## 🎉 Sucesso!

Você agora tem:
- ✅ Banco Neon operacional
- ✅ 4 tabelas limpas
- ✅ API completa e funcional
- ✅ Sistema de email
- ✅ Frontend pronto

**Próximo passo: Fazer deploy em produção! 🚀**

---

## 🔗 Links Rápidos

- **Neon Dashboard:** https://console.neon.tech
- **API Docs:** Ver `API_DOCS.md` neste projeto
- **Neon Suporte:** https://neon.tech/docs

---

**Parabéns! Você está pronto! 🎊**
