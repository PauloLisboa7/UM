# 🎯 Como Usar Neon - Guia Visual Simples

## 1️⃣ Entrar no Neon

### Passo 1: Abrir o Dashboard
```
Vá para: https://console.neon.tech
→ Você já deve estar logado (sua conta Neon)
```

### Passo 2: Você verá algo assim:
```
┌─────────────────────────────────────────┐
│  Projects                               │
│  ─────────────────────────────────────  │
│  [neondb] ← Seu projeto                 │
│           Location: US-EAST             │
└─────────────────────────────────────────┘
```

### Passo 3: Clique no Seu Projeto
```
Clique em: [neondb]
```

---

## 2️⃣ Acessar o SQL Editor

### Dentro do Seu Projeto:
```
Menu à esquerda:
├── Dashboard
├── Browser (para ver tabelas)
├── SQL Editor ← CLIQUE AQUI
├── Branches
└── Settings
```

### Clique em "SQL Editor"
```
┌─────────────────────────────────────────┐
│  SQL Editor                             │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐  │
│  │                                 │  │
│  │  (Cole seu SQL aqui)            │  │
│  │                                 │  │
│  │                                 │  │
│  └─────────────────────────────────┘  │
│                                         │
│  [Execute] [Clear]                     │
└─────────────────────────────────────────┘
```

---

## 3️⃣ Executar o SQL de Criação de Tabelas

### ⚠️ IMPORTANTE: Tabelas Já Existem?

Se você receber um erro tipo:
```
The table "notificacoes" already exists in the database
```

**Pule para a seção "Resetar o Banco" abaixo** antes de executar.

### Passo 1: Copiar o SQL Completo (Primeira Vez)

Se o banco está **vazio**, copie TUDO isto:

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
CREATE INDEX idx_notificacoes_user_id ON notificacoes(user_id);
CREATE INDEX idx_notificacoes_lida ON notificacoes(lida);
```

### ⚠️ SE RECEBER ERRO "table already exists"

Execute PRIMEIRO isto para limpar o banco:

```sql
DROP TABLE IF EXISTS notificacoes CASCADE;
DROP TABLE IF EXISTS status_historico CASCADE;
DROP TABLE IF EXISTS solicitacoes CASCADE;
DROP TABLE IF EXISTS users CASCADE;
```

Depois cole o SQL de criação completo acima.

### Passo 2: Colar no Editor

1. Abra o **SQL Editor** (conforme acima)
2. Clique na caixa branca
3. **Ctrl+A** para selecionar tudo (se houver algo)
4. **Ctrl+V** para colar o SQL

### Passo 3: Executar

Clique no botão **[Execute]** (verde)

Você deve ver:
```
✅ Query executed successfully
```

### Passo 2: Colar no Editor

1. Abra o **SQL Editor** (conforme acima)
2. Clique na caixa branca
3. **Ctrl+A** para selecionar tudo (se houver algo)
4. **Ctrl+V** para colar o SQL

### Passo 3: Executar

Clique no botão **[Execute]** (verde)

Você deve ver:
```
✅ Query executed successfully
```

---

## 4️⃣ Verificar as Tabelas Criadas

### Opção 1: Browser (Visual)
```
Menu esquerdo → Browser
```

Você verá:
```
neondb
├── public
│   ├── users ✅
│   ├── solicitacoes ✅
│   ├── status_historico ✅
│   └── notificacoes ✅
```

### Opção 2: SQL (Verificar)
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

Você verá:
```
table_name
──────────────────
users
solicitacoes
status_historico
notificacoes
```

---

## 5️⃣ Testar a Conexão do Backend

### Passo 1: Abrir Terminal
```bash
cd c:\Users\paulo\OneDrive\Imagens\clean-work\backend
```

### Passo 2: Iniciar o Servidor
```bash
npm run dev
```

### Passo 3: Você deve ver:
```
Neon: conexão com PostgreSQL estabelecida
Neon: conexão verificada (consulta de teste OK).
Servidor rodando na porta 5000
```

✅ **Funcionou!**

---

## 6️⃣ Criar um Usuário de Teste

### Opção 1: SQL no Neon
```sql
INSERT INTO users (username, password, role, email) 
VALUES ('testuser', '$2b$10$...', 'user', 'test@email.com');
```

⚠️ **Cuidado:** A senha deve estar com hash bcrypt!

### Opção 2: Usar a API (Melhor)

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username":"testuser",
    "password":"123456",
    "email":"test@email.com"
  }'
```

Você verá:
```json
{
  "message": "Usuário criado",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@email.com",
    "role": "user"
  }
}
```

---

## 7️⃣ Verificar Dados no Neon

### Ver Usuários Criados:
```sql
SELECT * FROM users;
```

Você verá:
```
id │ username  │ password              │ role │ email
───┼───────────┼───────────────────────┼──────┼──────────────
 1 │ testuser  │ $2b$10$...            │ user │ test@email.com
```

### Ver Solicitações:
```sql
SELECT * FROM solicitacoes;
```

Se estiver vazio, você precisa criar uma solicitação via frontend/API.

---

## 🎮 Workflow Completo

### 1. Backend Iniciado ✅
```bash
npm run dev
```

### 2. Frontend Iniciado ✅
```bash
cd frontend
npm run dev
```

### 3. Acesse em seu navegador
```
http://localhost:5173
```

### 4. Teste o Fluxo:
```
Home → Solicitar Reclamação
   ↓
Preencha o formulário
   ↓
Clique enviar
   ↓
Veja número de rastreamento
   ↓
Vá para "Como usar"
   ↓
Procure sua solicitação
   ↓
Veja no mapa!
```

### 5. Verifique no Neon:
```sql
SELECT * FROM solicitacoes;
```

Você verá suas solicitações! 🎉

---

## 📊 Exemplos de Queries Úteis

### Ver Tudo
```sql
SELECT * FROM users;
SELECT * FROM solicitacoes;
SELECT * FROM status_historico;
SELECT * FROM notificacoes;
```

### Ver Solicitações de um Usuário
```sql
SELECT * FROM solicitacoes 
WHERE user_id = 1;
```

### Ver Histórico de Uma Solicitação
```sql
SELECT * FROM status_historico 
WHERE solicitacao_id = 1
ORDER BY created_at DESC;
```

### Contar Solicitações
```sql
SELECT COUNT(*) FROM solicitacoes;
```

### Ver Solicitações por Status
```sql
SELECT status, COUNT(*) 
FROM solicitacoes 
GROUP BY status;
```

---

## ⚠️ Erros Comuns

### Erro: "relation does not exist"
```
❌ ERROR: relation "users" does not exist
```

**Solução:** Você não executou o SQL de criação de tabelas!
→ Volte para o passo 3 acima

### Erro: "NEON_DATABASE_URL is not defined"
```
❌ Error: NEON_DATABASE_URL is not defined
```

**Solução:** O .env não está configurado!
→ Verifique se a URL está em `backend/.env`

### Erro: "connection refused"
```
❌ Error: connect ECONNREFUSED
```

**Solução:** A URL do Neon está errada!
→ Copie a URL correta do console Neon

---

## 🔍 Dicas Úteis

### ⭐ Resetar o Banco (Se Precisar)

Se você recebeu erro "table already exists", faça isto:

**Passo 1:** Execute ISTO no SQL Editor:
```sql
DROP TABLE IF EXISTS notificacoes CASCADE;
DROP TABLE IF EXISTS status_historico CASCADE;
DROP TABLE IF EXISTS solicitacoes CASCADE;
DROP TABLE IF EXISTS users CASCADE;
```

**Passo 2:** Clique [Clear] para limpar o editor

**Passo 3:** Cole o SQL completo de criação (seção 3️⃣, Passo 1)

**Passo 4:** Clique [Execute]

✅ Pronto! Banco zerado e recriado!

### Copiar a URL Correta do Neon
```
Console Neon
  ↓
Seu Projeto (neondb)
  ↓
Connection string (canto superior direito)
  ↓
Copie a URL
```

### Ver Todas as Tabelas
```sql
\dt
```

---

## ✅ Checklist

- [ ] Entrei no console.neon.tech
- [ ] Abri o SQL Editor
- [ ] Colei o SQL completo
- [ ] Cliquei Execute
- [ ] Vi "Query executed successfully"
- [ ] Verifiquei as tabelas no Browser
- [ ] Iniciei o backend com `npm run dev`
- [ ] Vi a mensagem de conexão OK
- [ ] Criei um usuário de teste
- [ ] Verifiquei no Neon com SQL

---

**Pronto! Você domina o Neon! 🚀**

Se tiver dúvidas, releia este guia!
