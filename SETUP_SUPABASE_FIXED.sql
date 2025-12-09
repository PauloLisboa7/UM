-- ============================================================================
-- LIMPEZA COMPLETA DO BANCO DE DADOS (Supabase Compatible)
-- Execute este arquivo no Supabase SQL Editor para limpar tudo
-- ============================================================================

-- Passo 1: Desabilitar RLS em todas as tabelas
ALTER TABLE IF EXISTS public.avisos DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.alertas_bairro DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.configuracoes_notificacao DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.status_historico DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.solicitacoes DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.estruturas_culturais DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.demandas DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.obras DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.users DISABLE ROW LEVEL SECURITY;

-- Passo 2: Dropar todas as tabelas (sem IF EXISTS em TRUNCATE)
DROP TABLE IF EXISTS public.avisos CASCADE;
DROP TABLE IF EXISTS public.alertas_bairro CASCADE;
DROP TABLE IF EXISTS public.configuracoes_notificacao CASCADE;
DROP TABLE IF EXISTS public.status_historico CASCADE;
DROP TABLE IF EXISTS public.solicitacoes CASCADE;
DROP TABLE IF EXISTS public.estruturas_culturais CASCADE;
DROP TABLE IF EXISTS public.demandas CASCADE;
DROP TABLE IF EXISTS public.obras CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Passo 3: Dropar funções e triggers
DROP FUNCTION IF EXISTS public.trigger_set_timestamp() CASCADE;

-- Passo 4: Criar a função timestamp
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = timezone('utc', now());
  RETURN NEW;
END;
$$;

-- ============================================================================
-- CRIAR TABELAS PRINCIPAIS
-- ============================================================================

-- Tabela: users
CREATE TABLE public.users (
  id BIGSERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  email TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user','admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE UNIQUE INDEX IF NOT EXISTS users_username_ci_idx ON public.users ((lower(username)));
CREATE INDEX IF NOT EXISTS users_email_idx ON public.users (email);

-- Tabela: solicitacoes
CREATE TABLE public.solicitacoes (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES public.users(id) ON DELETE SET NULL,
  descricao TEXT NOT NULL,
  cep TEXT,
  bairro TEXT,
  rua TEXT,
  numero TEXT,
  latitude NUMERIC(9,6),
  longitude NUMERIC(9,6),
  fotos_urls TEXT[],
  anonima BOOLEAN DEFAULT FALSE,
  numero_rastreamento TEXT UNIQUE,
  status TEXT DEFAULT 'Enviada/Em Análise',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS solicitacoes_user_idx ON public.solicitacoes (user_id);
CREATE INDEX IF NOT EXISTS solicitacoes_status_idx ON public.solicitacoes (status);
CREATE INDEX IF NOT EXISTS solicitacoes_bairro_idx ON public.solicitacoes (bairro);
CREATE INDEX IF NOT EXISTS solicitacoes_rastreamento_idx ON public.solicitacoes (numero_rastreamento);

DROP TRIGGER IF EXISTS set_timestamp_solicitacoes ON public.solicitacoes;
CREATE TRIGGER set_timestamp_solicitacoes
BEFORE UPDATE ON public.solicitacoes
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- Tabela: status_historico
CREATE TABLE public.status_historico (
  id BIGSERIAL PRIMARY KEY,
  solicitacao_id BIGINT NOT NULL REFERENCES public.solicitacoes(id) ON DELETE CASCADE,
  status_anterior TEXT,
  status_novo TEXT,
  orgao_competente TEXT,
  justificativa TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS status_historico_solicitacao_idx ON public.status_historico (solicitacao_id);

-- Tabela: obras
CREATE TABLE public.obras (
  id BIGSERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT,
  bairro TEXT,
  status TEXT NOT NULL DEFAULT 'planejada'
    CHECK (status IN ('planejada','em_andamento','concluida','cancelada','parada')),
  progresso SMALLINT NOT NULL DEFAULT 0 CHECK (progresso BETWEEN 0 AND 100),
  valor_estimado NUMERIC(14,2),
  data_inicio DATE,
  data_fim DATE,
  latitude NUMERIC(9,6),
  longitude NUMERIC(9,6),
  usuario_id BIGINT REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS obras_status_idx ON public.obras (status);
CREATE INDEX IF NOT EXISTS obras_bairro_idx ON public.obras (bairro);
CREATE INDEX IF NOT EXISTS obras_usuario_idx ON public.obras (usuario_id);

DROP TRIGGER IF EXISTS set_timestamp_obras ON public.obras;
CREATE TRIGGER set_timestamp_obras
BEFORE UPDATE ON public.obras
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- Tabela: demandas
CREATE TABLE public.demandas (
  id BIGSERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT,
  bairro TEXT,
  cidade TEXT,
  estado TEXT,
  status TEXT NOT NULL DEFAULT 'pendente'
    CHECK (status IN ('pendente','confirmada','confirmado','resolvida','cancelada','em_andamento','planejada')),
  latitude NUMERIC(9,6),
  longitude NUMERIC(9,6),
  usuario_id BIGINT REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS demandas_status_idx ON public.demandas (status);
CREATE INDEX IF NOT EXISTS demandas_local_idx ON public.demandas (estado, cidade, bairro);

DROP TRIGGER IF EXISTS set_timestamp_demandas ON public.demandas;
CREATE TRIGGER set_timestamp_demandas
BEFORE UPDATE ON public.demandas
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- Tabela: estruturas_culturais
CREATE TABLE public.estruturas_culturais (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  imagem TEXT,
  local TEXT,
  ano TEXT,
  descricao TEXT,
  historia TEXT,
  latitude NUMERIC(9,6),
  longitude NUMERIC(9,6),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS estruturas_nome_idx ON public.estruturas_culturais (nome);
CREATE INDEX IF NOT EXISTS estruturas_coords_idx ON public.estruturas_culturais (latitude, longitude);

DROP TRIGGER IF EXISTS set_timestamp_estruturas ON public.estruturas_culturais;
CREATE TRIGGER set_timestamp_estruturas
BEFORE UPDATE ON public.estruturas_culturais
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- Tabela: avisos
CREATE TABLE public.avisos (
  id BIGSERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT,
  tipo TEXT DEFAULT 'trânsito',
  status TEXT DEFAULT 'aviso',
  localidade TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS avisos_status_idx ON public.avisos (status);

DROP TRIGGER IF EXISTS set_timestamp_avisos ON public.avisos;
CREATE TRIGGER set_timestamp_avisos
BEFORE UPDATE ON public.avisos
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- Tabela: alertas_bairro
CREATE TABLE public.alertas_bairro (
  id BIGSERIAL PRIMARY KEY,
  bairro TEXT NOT NULL,
  descricao TEXT,
  tipo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS alertas_bairro_idx ON public.alertas_bairro (bairro);

DROP TRIGGER IF EXISTS set_timestamp_alertas ON public.alertas_bairro;
CREATE TRIGGER set_timestamp_alertas
BEFORE UPDATE ON public.alertas_bairro
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- Tabela: configuracoes_notificacao
CREATE TABLE public.configuracoes_notificacao (
  id BIGSERIAL PRIMARY KEY,
  usuario_id BIGINT REFERENCES public.users(id) ON DELETE CASCADE,
  email_ativo BOOLEAN DEFAULT TRUE,
  sms_ativo BOOLEAN DEFAULT FALSE,
  telefone TEXT,
  bairros TEXT[],
  tipos_notificacao TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS config_notif_user_idx ON public.configuracoes_notificacao (usuario_id);

DROP TRIGGER IF EXISTS set_timestamp_config_notif ON public.configuracoes_notificacao;
CREATE TRIGGER set_timestamp_config_notif
BEFORE UPDATE ON public.configuracoes_notificacao
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ============================================================================
-- HABILITAR ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solicitacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.status_historico ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.obras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demandas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estruturas_culturais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avisos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alertas_bairro ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuracoes_notificacao ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- CRIAR POLÍTICAS RLS (Service Role All Access)
-- ============================================================================

CREATE POLICY users_service_role_all ON public.users
FOR ALL USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY solicitacoes_service_role_all ON public.solicitacoes
FOR ALL USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY status_historico_service_role_all ON public.status_historico
FOR ALL USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY obras_service_role_all ON public.obras
FOR ALL USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY demandas_service_role_all ON public.demandas
FOR ALL USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY estruturas_culturais_service_role_all ON public.estruturas_culturais
FOR ALL USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY avisos_service_role_all ON public.avisos
FOR ALL USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY alertas_bairro_service_role_all ON public.alertas_bairro
FOR ALL USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY configuracoes_notificacao_service_role_all ON public.configuracoes_notificacao
FOR ALL USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');
