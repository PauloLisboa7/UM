import express from 'express';
import { db } from '../config/db.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Função auxiliar para garantir que as tabelas existem
const ensureTablesExist = async () => {
  try {
    // Criar tabela de avisos se não existir
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

    // Criar tabela de configurações de notificação se não existir
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

    // Criar tabela de alertas por bairro se não existir
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
  } catch (err) {
    console.error('Erro ao criar tabelas:', err);
  }
};

// ===== AVISOS E ALERTAS =====

// GET: Listar todos os avisos
router.get('/avisos', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await ensureTablesExist();
    const result = await db.query(`
      SELECT * FROM avisos 
      ORDER BY created_at DESC
    `);
    res.json({ avisos: result.rows });
  } catch (err) {
    console.error('Erro ao listar avisos:', err);
    res.status(500).json({ error: 'Erro ao listar avisos' });
  }
});

// POST: Criar novo aviso
router.post('/avisos', authMiddleware, adminMiddleware, async (req, res) => {
  const { titulo, descricao, tipo, status, localidade } = req.body;

  if (!titulo || !descricao) {
    return res.status(400).json({ error: 'Título e descrição são obrigatórios' });
  }

  try {
    await ensureTablesExist();
    const result = await db.query(`
      INSERT INTO avisos (titulo, descricao, tipo, status, localidade, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING *
    `, [titulo, descricao, tipo || 'trânsito', status || 'aviso', localidade || null]);

    res.status(201).json({ aviso: result.rows[0] });
  } catch (err) {
    console.error('Erro ao criar aviso:', err);
    res.status(500).json({ error: 'Erro ao criar aviso' });
  }
});

// PUT: Atualizar aviso
router.put('/avisos/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, tipo, status, localidade } = req.body;

  try {
    await ensureTablesExist();
    const result = await db.query(`
      UPDATE avisos 
      SET titulo = COALESCE($1, titulo),
          descricao = COALESCE($2, descricao),
          tipo = COALESCE($3, tipo),
          status = COALESCE($4, status),
          localidade = COALESCE($5, localidade),
          updated_at = NOW()
      WHERE id = $6
      RETURNING *
    `, [titulo, descricao, tipo, status, localidade, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Aviso não encontrado' });
    }

    res.json({ aviso: result.rows[0] });
  } catch (err) {
    console.error('Erro ao atualizar aviso:', err);
    res.status(500).json({ error: 'Erro ao atualizar aviso' });
  }
});

// DELETE: Deletar aviso
router.delete('/avisos/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM avisos WHERE id = $1', [id]);
    res.json({ message: 'Aviso deletado com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar aviso:', err);
    res.status(500).json({ error: 'Erro ao deletar aviso' });
  }
});

// ===== CONFIGURAÇÕES DE NOTIFICAÇÃO =====

// GET: Listar todas as configurações de notificação
router.get('/configuracoes-notificacao', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await ensureTablesExist();
    const result = await db.query(`
      SELECT cn.*, u.name as usuario_nome, u.email as usuario_email
      FROM configuracoes_notificacao cn
      JOIN users u ON cn.usuario_id = u.id
      ORDER BY u.name
    `);
    res.json({ configuracoes: result.rows });
  } catch (err) {
    console.error('Erro ao listar configurações:', err);
    // Retornar lista vazia se houver erro
    res.json({ configuracoes: [] });
  }
});

// PUT: Atualizar configuração de notificação
router.put('/configuracoes-notificacao/:usuarioId', authMiddleware, adminMiddleware, async (req, res) => {
  const { usuarioId } = req.params;
  const { tipos_alerta, apenas_bairro, bairro, raio } = req.body;

  try {
    await ensureTablesExist();
    const result = await db.query(`
      UPDATE configuracoes_notificacao 
      SET tipos_alerta = $1,
          apenas_bairro = $2,
          bairro = COALESCE($3, bairro),
          raio = COALESCE($4, raio),
          updated_at = NOW()
      WHERE usuario_id = $5
      RETURNING *
    `, [
      tipos_alerta ? JSON.stringify(tipos_alerta) : null,
      apenas_bairro,
      bairro,
      raio,
      usuarioId
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Configuração não encontrada' });
    }

    res.json({ configuracao: result.rows[0] });
  } catch (err) {
    console.error('Erro ao atualizar configuração:', err);
    res.status(500).json({ error: 'Erro ao atualizar configuração' });
  }
});

// DELETE: Deletar configuração de notificação
router.delete('/configuracoes-notificacao/:usuarioId', authMiddleware, adminMiddleware, async (req, res) => {
  const { usuarioId } = req.params;

  try {
    await db.query('DELETE FROM configuracoes_notificacao WHERE usuario_id = $1', [usuarioId]);
    res.json({ message: 'Configuração deletada com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar configuração:', err);
    res.status(500).json({ error: 'Erro ao deletar configuração' });
  }
});

// ===== ALERTAS POR BAIRRO =====

// GET: Listar todos os alertas por bairro
router.get('/alertas-bairro', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await ensureTablesExist();
    const result = await db.query(`
      SELECT * FROM alertas_bairro 
      ORDER BY bairro, created_at DESC
    `);
    res.json({ alertas: result.rows });
  } catch (err) {
    console.error('Erro ao listar alertas por bairro:', err);
    res.status(500).json({ error: 'Erro ao listar alertas' });
  }
});

// POST: Criar novo alerta por bairro
router.post('/alertas-bairro', authMiddleware, adminMiddleware, async (req, res) => {
  const { bairro, titulo, descricao, tipo, localidade_especifica } = req.body;

  if (!bairro || !titulo || !descricao) {
    return res.status(400).json({ error: 'Bairro, título e descrição são obrigatórios' });
  }

  try {
    await ensureTablesExist();
    const result = await db.query(`
      INSERT INTO alertas_bairro (bairro, titulo, descricao, tipo, localidade_especifica, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING *
    `, [bairro, titulo, descricao, tipo || 'trânsito', localidade_especifica || null]);

    res.status(201).json({ alerta: result.rows[0] });
  } catch (err) {
    console.error('Erro ao criar alerta:', err);
    res.status(500).json({ error: 'Erro ao criar alerta' });
  }
});

// PUT: Atualizar alerta por bairro
router.put('/alertas-bairro/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;
  const { bairro, titulo, descricao, tipo, localidade_especifica } = req.body;

  try {
    await ensureTablesExist();
    const result = await db.query(`
      UPDATE alertas_bairro 
      SET bairro = COALESCE($1, bairro),
          titulo = COALESCE($2, titulo),
          descricao = COALESCE($3, descricao),
          tipo = COALESCE($4, tipo),
          localidade_especifica = COALESCE($5, localidade_especifica),
          updated_at = NOW()
      WHERE id = $6
      RETURNING *
    `, [bairro, titulo, descricao, tipo, localidade_especifica, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Alerta não encontrado' });
    }

    res.json({ alerta: result.rows[0] });
  } catch (err) {
    console.error('Erro ao atualizar alerta:', err);
    res.status(500).json({ error: 'Erro ao atualizar alerta' });
  }
});

// DELETE: Deletar alerta por bairro
router.delete('/alertas-bairro/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM alertas_bairro WHERE id = $1', [id]);
    res.json({ message: 'Alerta deletado com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar alerta:', err);
    res.status(500).json({ error: 'Erro ao deletar alerta' });
  }
});

export default router;
