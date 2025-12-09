# Migração para Neon PostgreSQL

## O que foi mudado

Sua aplicação foi migrada do **Supabase** para **Neon PostgreSQL**. A Neon oferece um banco PostgreSQL escalável e serverless com ótimo desempenho.

## Passos para Configurar

### 1. Criar Conta no Neon

1. Acesse https://neon.tech
2. Clique em "Sign up" (Cadastrar)
3. Use Google, GitHub ou email para criar uma conta
4. Confirme seu email

### 2. Criar um Novo Projeto

1. No dashboard do Neon, clique em "New Project"
2. Dê um nome (ex: "clean-work-db")
3. Selecione a região mais próxima (ex: us-east-1)
4. Clique em "Create Project"

### 3. Copiar a String de Conexão

1. Após criar o projeto, você verá um painel com as credenciais
2. Procure por "Connection string" ou "Full connection string"
3. Deve estar em um formato como: `postgresql://user:password@host/database?sslmode=require`
4. Copie essa string completa

### 4. Atualizar o .env do Backend

1. Abra o arquivo `.env` na pasta `backend/`
2. Adicione (ou atualize) a variável:

```env
NEON_DATABASE_URL=postgresql://seu-user:sua-senha@seu-host/seu-banco?sslmode=require
```

3. Salve o arquivo

### 5. Copiar Seu Banco de Dados Antigo (Opcional)

Se você quer migrar os dados do Supabase para Neon, siga os passos:

#### Opção A: Usando pg_dump (Recomendado)

1. **De seu computador local, faça backup do Supabase:**
```bash
pg_dump "sua-connection-string-supabase" > backup.sql
```

2. **Importe para Neon:**
```bash
psql "sua-neon-connection-string" < backup.sql
```

#### Opção B: Manualmente no Neon Console

1. Acesse o Neon Console
2. Vá para "SQL Editor"
3. Cole suas queries CREATE TABLE
4. Execute para criar as tabelas
5. Use INSERT para adicionar dados

### 6. Criar as Tabelas no Neon

Você só vai usar as tabelas das **novas funcionalidades** (solicitações e rastreamento). Execute os seguintes comandos no **Neon SQL Editor**:

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

-- Tabela de solicitações (Solicitar Reclamação)
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

-- Tabela de histórico de status (Acompanhamento)
CREATE TABLE status_historico (
  id SERIAL PRIMARY KEY,
  solicitacao_id INTEGER REFERENCES solicitacoes(id),
  status_anterior VARCHAR(100),
  status_novo VARCHAR(100),
  orgao_competente VARCHAR(255),
  justificativa TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de notificações (Sistema de notificações)
CREATE TABLE notificacoes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  solicitacao_id INTEGER REFERENCES solicitacoes(id),
  mensagem TEXT,
  lida BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para melhor performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_solicitacoes_numero_rastreamento ON solicitacoes(numero_rastreamento);
CREATE INDEX idx_solicitacoes_user_id ON solicitacoes(user_id);
CREATE INDEX idx_solicitacoes_status ON solicitacoes(status);
CREATE INDEX idx_status_historico_solicitacao ON status_historico(solicitacao_id);
CREATE INDEX idx_notificacoes_user_id ON notificacoes(user_id);
CREATE INDEX idx_notificacoes_lida ON notificacoes(lida);
```

**Tabelas Removidas (da página 3 antiga):**
- ❌ demandas
- ❌ obras
- ❌ estruturas_culturais

**Tabelas Mantidas (apenas novas funcionalidades):**
- ✅ users (autenticação)
- ✅ solicitacoes (formulário de reclamação)
- ✅ status_historico (histórico de mudanças de status)
- ✅ notificacoes (futura notificação de status)

### 7. Testar a Conexão

1. Abra um terminal na pasta `backend/`
2. Execute:
```bash
npm run dev
```

3. Você deverá ver na saída:
```
Neon: conexão com PostgreSQL estabelecida
Neon: conexão verificada (consulta de teste OK).
```

## Mudanças no Código

- **Antes**: Usava SDK `@supabase/supabase-js` com métodos como `.from().select()`
- **Depois**: Usa biblioteca `pg` com queries SQL diretas e parametrizadas
- **Segurança**: Todas as queries usam prepared statements ($1, $2, etc) contra SQL injection
- **Compatibilidade**: Toda a lógica de negócio permanece a mesma

## Estrutura de Arquivos Alterada

```
backend/src/config/
  db.js           # Novo: conexão com Neon (pg)

backend/src/models/
  userModel.js         # Atualizado: usa pg queries
  demandaModel.js      # Atualizado: usa pg queries
  obraModel.js         # Atualizado: usa pg queries
  estruturaModel.js    # Atualizado: usa pg queries
  solicitacaoModel.js  # Atualizado: usa pg queries
```

## Variáveis de Ambiente Necessárias

```env
# Neon PostgreSQL (obrigatório)
NEON_DATABASE_URL=postgresql://...

# JWT (obrigatório)
JWT_SECRET=sua-chave-secreta

# Email (opcional, mas recomendado)
EMAIL_USER=seu-email@gmail.com
EMAIL_PASSWORD=sua-senha-app
FRONTEND_URL=http://localhost:5173

# Server (opcional)
PORT=5000
```

## Vantagens do Neon

✅ **Escalabilidade**: Cresce com seu projeto  
✅ **Serverless**: Sem servidor para gerenciar  
✅ **Confiável**: Backup automático e recuperação  
✅ **Rápido**: Branching de banco de dados para desenvolvimento  
✅ **Barato**: Plano gratuito generoso  
✅ **PostgreSQL puro**: Sem propriedade de fornecedor  

## Troubleshooting

### Erro: "NEON_DATABASE_URL is not defined"
- Verifique se a variável está no arquivo `.env`
- Reinicie o servidor com `npm run dev`

### Erro: "connect ECONNREFUSED"
- Verifique se a URL do Neon está correta
- Teste a conexão: `psql "sua-neon-connection-string"`

### Erro: "relation 'users' does not exist"
- Você precisa criar as tabelas (veja a seção "Criar as Tabelas no Neon")

### Performance lenta
- Verifique os índices foram criados
- Use o Neon Console para monitorar queries lentas

## Suporte

- Neon Docs: https://neon.tech/docs
- PostgreSQL Docs: https://www.postgresql.org/docs
