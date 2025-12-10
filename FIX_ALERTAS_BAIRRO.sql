-- Script para corrigir a tabela alertas_bairro
-- Execute este script no SQL Editor do Supabase

-- Opção 1: Se a tabela não existe, criar
CREATE TABLE IF NOT EXISTS public.alertas_bairro (
  id BIGSERIAL PRIMARY KEY,
  bairro TEXT NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT,
  tipo TEXT DEFAULT 'trânsito',
  localidade_especifica TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Opção 2: Se a tabela existe mas falta colunas, adicionar
ALTER TABLE public.alertas_bairro ADD COLUMN IF NOT EXISTS titulo TEXT;
ALTER TABLE public.alertas_bairro ADD COLUMN IF NOT EXISTS localidade_especifica TEXT;

-- Atualizar registros que não tem titulo
UPDATE public.alertas_bairro 
SET titulo = COALESCE(titulo, 'Alerta - ' || bairro)
WHERE titulo IS NULL OR titulo = '';

-- Garantir que titulo não seja null
ALTER TABLE public.alertas_bairro ALTER COLUMN titulo SET NOT NULL;

-- Criar índice se não existir
CREATE INDEX IF NOT EXISTS alertas_bairro_idx ON public.alertas_bairro (bairro);

-- Criar ou recriar função de timestamp
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc', now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Remover trigger antigo se existir
DROP TRIGGER IF EXISTS set_timestamp_alertas ON public.alertas_bairro;

-- Criar trigger
CREATE TRIGGER set_timestamp_alertas
BEFORE UPDATE ON public.alertas_bairro
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- Habilitar RLS
ALTER TABLE public.alertas_bairro ENABLE ROW LEVEL SECURITY;

-- Criar política para service role (admin)
DROP POLICY IF EXISTS alertas_bairro_service_role_all ON public.alertas_bairro;
CREATE POLICY alertas_bairro_service_role_all ON public.alertas_bairro
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Verificar resultado
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'alertas_bairro'
ORDER BY ordinal_position;
