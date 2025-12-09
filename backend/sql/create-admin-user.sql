-- Script SQL para criar usuário admin no Neon
-- Execute isto no SQL Editor do console Neon

-- Criar usuário admin (clean7)
-- Senha: cleanwork7
-- Hash bcrypt da senha "cleanwork7": $2b$10$4S6nECiLd6LZJmHx.7kXXeKRF9tDg3pY8Qv8c.mK8vL9.q2mW2nK6

INSERT INTO users (username, password, role, email, created_at, updated_at) 
VALUES (
  'clean7',
  '$2b$10$4S6nECiLd6LZJmHx.7kXXeKRF9tDg3pY8Qv8c.mK8vL9.q2mW2nK6',
  'admin',
  'admin@cleanwork.com',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT (username) DO UPDATE SET
  role = 'admin',
  password = '$2b$10$4S6nECiLd6LZJmHx.7kXXeKRF9tDg3pY8Qv8c.mK8vL9.q2mW2nK6'
RETURNING id, username, role;

-- Verificar se foi criado
SELECT id, username, role, email FROM users WHERE username = 'clean7';
