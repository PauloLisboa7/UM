# 📋 Copiar e Colar - Passo a Passo

## 🔴 PASSO 1: LIMPAR O BANCO (SE HOUVER ERRO)

Se você recebeu erro:
```
The table "notificacoes" already exists in the database
```

### Copie ISTO no SQL Editor:

```sql
DROP TABLE IF EXISTS notificacoes CASCADE;
DROP TABLE IF EXISTS status_historico CASCADE;
DROP TABLE IF EXISTS solicitacoes CASCADE;
DROP TABLE IF EXISTS users CASCADE;
```

### Clique [Execute]

Você verá:
```
✅ Query executed successfully
```

---

## 🟢 PASSO 2: CRIAR AS TABELAS

Depois que executar o DROP (ou se o banco estava vazio):

### Clique [Clear] para limpar o editor

### Copie TUDO ISTO:

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

### Cole no SQL Editor

### Clique [Execute]

Você verá:
```
✅ Query executed successfully
```

---

## ✅ PRONTO!

Suas tabelas estão criadas! 🎉

Agora vá para a próxima etapa:
- Passo 5 do NEON_HOW_TO_USE.md: Testar a Conexão do Backend
