-- Tabela para avisos e alertas gerais
CREATE TABLE IF NOT EXISTS avisos (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT NOT NULL,
  tipo VARCHAR(50) DEFAULT 'trânsito',
  status VARCHAR(50) DEFAULT 'aviso',
  localidade VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para configurações de notificação dos usuários
CREATE TABLE IF NOT EXISTS configuracoes_notificacao (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL,
  tipos_alerta JSONB DEFAULT '[]',
  apenas_bairro BOOLEAN DEFAULT FALSE,
  bairro VARCHAR(255),
  raio INTEGER DEFAULT 500,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabela para alertas específicos por bairro
CREATE TABLE IF NOT EXISTS alertas_bairro (
  id SERIAL PRIMARY KEY,
  bairro VARCHAR(255) NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT NOT NULL,
  tipo VARCHAR(50) DEFAULT 'trânsito',
  localidade_especifica VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_avisos_tipo ON avisos(tipo);
CREATE INDEX IF NOT EXISTS idx_avisos_status ON avisos(status);
CREATE INDEX IF NOT EXISTS idx_configuracoes_usuario ON configuracoes_notificacao(usuario_id);
CREATE INDEX IF NOT EXISTS idx_alertas_bairro_nome ON alertas_bairro(bairro);
CREATE INDEX IF NOT EXISTS idx_alertas_bairro_tipo ON alertas_bairro(tipo);
