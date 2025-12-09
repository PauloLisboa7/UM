import { db } from "./src/config/db.js";

async function setupAdminTables() {
  try {
    console.log("Criando tabelas de administração...");

    // Criar tabela de avisos
    await db.query(`
      CREATE TABLE IF NOT EXISTS avisos (
        id SERIAL PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        descricao TEXT NOT NULL,
        tipo VARCHAR(50) DEFAULT 'trânsito',
        status VARCHAR(50) DEFAULT 'aviso',
        localidade VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✓ Tabela 'avisos' criada");

    // Criar tabela de configurações de notificação
    await db.query(`
      CREATE TABLE IF NOT EXISTS configuracoes_notificacao (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER NOT NULL,
        tipos_alerta JSONB DEFAULT '[]',
        apenas_bairro BOOLEAN DEFAULT FALSE,
        bairro VARCHAR(255),
        raio INTEGER DEFAULT 500,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(usuario_id)
      )
    `);
    console.log("✓ Tabela 'configuracoes_notificacao' criada");

    // Criar tabela de alertas por bairro
    await db.query(`
      CREATE TABLE IF NOT EXISTS alertas_bairro (
        id SERIAL PRIMARY KEY,
        bairro VARCHAR(255) NOT NULL,
        titulo VARCHAR(255) NOT NULL,
        descricao TEXT NOT NULL,
        tipo VARCHAR(50) DEFAULT 'trânsito',
        localidade_especifica VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✓ Tabela 'alertas_bairro' criada");

    // Criar índices
    await db.query(`CREATE INDEX IF NOT EXISTS idx_avisos_tipo ON avisos(tipo)`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_avisos_status ON avisos(status)`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_configuracoes_usuario ON configuracoes_notificacao(usuario_id)`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_alertas_bairro_nome ON alertas_bairro(bairro)`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_alertas_bairro_tipo ON alertas_bairro(tipo)`);
    console.log("✓ Índices criados");

    console.log("\n✅ Tabelas de administração configuradas com sucesso!");
  } catch (err) {
    console.error("❌ Erro ao criar tabelas:", err);
    process.exit(1);
  }
}

// Executar setup
setupAdminTables();
