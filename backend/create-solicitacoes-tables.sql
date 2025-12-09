-- Tabela para armazenar solicitações
CREATE TABLE IF NOT EXISTS solicitacoes (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  cep VARCHAR(8) NOT NULL,
  bairro VARCHAR(255) NOT NULL,
  rua VARCHAR(255) NOT NULL,
  numero VARCHAR(10),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  status VARCHAR(50) DEFAULT 'Enviada/Em Análise',
  orgao_competente VARCHAR(255),
  justificativa_rejeicao TEXT,
  fotos_urls TEXT[],
  numero_rastreamento VARCHAR(20) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  anonima BOOLEAN DEFAULT FALSE
);

-- Tabela para histórico de status
CREATE TABLE IF NOT EXISTS status_historico (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  solicitacao_id BIGINT REFERENCES solicitacoes(id) ON DELETE CASCADE,
  status_anterior VARCHAR(50),
  status_novo VARCHAR(50) NOT NULL,
  orgao_competente VARCHAR(255),
  justificativa TEXT,
  updated_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para notificações
CREATE TABLE IF NOT EXISTS notificacoes (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  solicitacao_id BIGINT REFERENCES solicitacoes(id) ON DELETE CASCADE,
  tipo VARCHAR(50) NOT NULL,
  mensagem TEXT NOT NULL,
  lida BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_solicitacoes_user_id ON solicitacoes(user_id);
CREATE INDEX IF NOT EXISTS idx_solicitacoes_status ON solicitacoes(status);
CREATE INDEX IF NOT EXISTS idx_solicitacoes_numero_rastreamento ON solicitacoes(numero_rastreamento);
CREATE INDEX IF NOT EXISTS idx_notificacoes_user_id ON notificacoes(user_id);
CREATE INDEX IF NOT EXISTS idx_notificacoes_lida ON notificacoes(lida);
