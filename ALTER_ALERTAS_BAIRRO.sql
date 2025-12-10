-- Script para adicionar campos faltantes na tabela alertas_bairro
-- Execute este script no SQL Editor do Supabase

-- Adicionar coluna titulo se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'alertas_bairro' 
                   AND column_name = 'titulo') THEN
        ALTER TABLE public.alertas_bairro ADD COLUMN titulo TEXT;
    END IF;
END $$;

-- Adicionar coluna localidade_especifica se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'alertas_bairro' 
                   AND column_name = 'localidade_especifica') THEN
        ALTER TABLE public.alertas_bairro ADD COLUMN localidade_especifica TEXT;
    END IF;
END $$;

-- Atualizar registros existentes com valores padrão se titulo for null
UPDATE public.alertas_bairro 
SET titulo = 'Alerta - ' || bairro 
WHERE titulo IS NULL;

-- Tornar titulo obrigatório
ALTER TABLE public.alertas_bairro ALTER COLUMN titulo SET NOT NULL;
