-- SQL para criar tabela de histórico de logins de usuários
-- Execute no editor SQL do Neon / Supabase

CREATE TABLE IF NOT EXISTS user_logins (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT,
  username TEXT,
  ip TEXT,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice por user_id para consultas rápidas
CREATE INDEX IF NOT EXISTS idx_user_logins_user_id ON user_logins(user_id);
