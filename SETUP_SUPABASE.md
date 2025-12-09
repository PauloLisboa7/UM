# Setup Supabase - Banco de Dados Limpo

## Banco de Dados
- **URL:** https://txzaqyaluvcbausnqpru.supabase.co
- **Conexão PostgreSQL:** postgresql://postgres:[YOUR_PASSWORD]@db.txzaqyaluvcbausnqpru.supabase.co:5432/postgres

## Passos para Configurar

### 1. Remover todas as tabelas existentes (Limpeza)
Acesse o **Supabase Dashboard** → **SQL Editor** e execute:

```sql
-- Desabilitar RLS temporariamente para deletar tudo
ALTER TABLE IF EXISTS public.avisos DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.alertas_bairro DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.configuracoes_notificacao DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.status_historico DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.solicitacoes DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.estruturas_culturais DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.demandas DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.obras DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.users DISABLE ROW LEVEL SECURITY;

-- Dropar todas as tabelas
DROP TABLE IF EXISTS public.avisos CASCADE;
DROP TABLE IF EXISTS public.alertas_bairro CASCADE;
DROP TABLE IF EXISTS public.configuracoes_notificacao CASCADE;
DROP TABLE IF EXISTS public.status_historico CASCADE;
DROP TABLE IF EXISTS public.solicitacoes CASCADE;
DROP TABLE IF EXISTS public.estruturas_culturais CASCADE;
DROP TABLE IF EXISTS public.demandas CASCADE;
DROP TABLE IF EXISTS public.obras CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Dropar funções
DROP FUNCTION IF EXISTS public.trigger_set_timestamp();
```

### 2. Criar Nova Schema
Execute o SQL do arquivo `backend/create-tables.sql` no Supabase SQL Editor.

### 3. Criar Tabelas Adicionais
Execute também os SQLs adicionais:
- `backend/create-solicitacoes-tables.sql`
- `backend/create-admin-tables.sql`

### 4. Validar Conexão Backend
O backend está configurado com:
- `SUPABASE_URL=https://txzaqyaluvcbausnqpru.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

Inicie o backend com `npm run dev` na pasta `backend`.

## Resultado Final
✅ Banco de dados limpo e vazio
✅ Schema criado com todas as tabelas
✅ Backend conectado ao Supabase
✅ Pronto para novos dados
