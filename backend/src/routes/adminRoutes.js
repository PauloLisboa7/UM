import express from 'express';
import { adminMiddleware, authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Assumimos que as tabelas já existem no Supabase; não criamos tabelas aqui.

// ===== AVISOS E ALERTAS =====

// GET: Listar todos os avisos
router.get('/avisos', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('avisos')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ avisos: data });
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
    const { data, error } = await supabase
      .from('avisos')
      .insert([{ titulo, descricao, tipo: tipo || 'trânsito', status: status || 'aviso', localidade: localidade || null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }])
      .select();
    if (error) throw error;
    res.status(201).json({ aviso: data[0] });
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
    const { data, error } = await supabase
      .from('avisos')
      .update({ titulo, descricao, tipo, status, localidade, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();
    if (error) throw error;
    if (!data || data.length === 0) return res.status(404).json({ error: 'Aviso não encontrado' });
    res.json({ aviso: data[0] });
  } catch (err) {
    console.error('Erro ao atualizar aviso:', err);
    res.status(500).json({ error: 'Erro ao atualizar aviso' });
  }
});

// DELETE: Deletar aviso
router.delete('/avisos/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('avisos')
      .delete()
      .eq('id', id);
    if (error) throw error;
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
    const { data: configs, error: configsErr } = await supabase
      .from('configuracoes_notificacao')
      .select('*');
    if (configsErr) throw configsErr;

    const userIds = [...new Set(configs.map(c => c.usuario_id).filter(Boolean))];
    let usersMap = {};
    if (userIds.length > 0) {
      const { data: users } = await supabase
        .from('users')
        .select('id, nome, email')
        .in('id', userIds);
      usersMap = (users || []).reduce((acc, u) => { acc[u.id] = u; return acc; }, {});
    }

    const enriched = (configs || []).map(c => ({
      ...c,
      usuario_nome: usersMap[c.usuario_id]?.nome || null,
      usuario_email: usersMap[c.usuario_id]?.email || null,
    }));

    res.json({ configuracoes: enriched });
  } catch (err) {
    console.error('Erro ao listar configurações:', err);
    res.json({ configuracoes: [] });
  }
});

// PUT: Atualizar configuração de notificação
router.put('/configuracoes-notificacao/:usuarioId', authMiddleware, adminMiddleware, async (req, res) => {
  const { usuarioId } = req.params;
  const { tipos_alerta, apenas_bairro, bairro, raio } = req.body;

  try {
    const updateObj = {
      tipos_alerta: tipos_alerta ? tipos_alerta : null,
      apenas_bairro,
      bairro: bairro || null,
      raio: raio || null,
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabase
      .from('configuracoes_notificacao')
      .update(updateObj)
      .eq('usuario_id', usuarioId)
      .select();
    if (error) throw error;
    if (!data || data.length === 0) return res.status(404).json({ error: 'Configuração não encontrada' });
    res.json({ configuracao: data[0] });
  } catch (err) {
    console.error('Erro ao atualizar configuração:', err);
    res.status(500).json({ error: 'Erro ao atualizar configuração' });
  }
});

// DELETE: Deletar configuração de notificação
router.delete('/configuracoes-notificacao/:usuarioId', authMiddleware, adminMiddleware, async (req, res) => {
  const { usuarioId } = req.params;

  try {
    const { error } = await supabase
      .from('configuracoes_notificacao')
      .delete()
      .eq('usuario_id', usuarioId);
    if (error) throw error;
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
    const { data, error } = await supabase
      .from('alertas_bairro')
      .select('*')
      .order('bairro', { ascending: true })
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ alertas: data });
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
    const { data, error } = await supabase
      .from('alertas_bairro')
      .insert([{ bairro, titulo, descricao, tipo: tipo || 'trânsito', localidade_especifica: localidade_especifica || null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }])
      .select();
    if (error) throw error;
    res.status(201).json({ alerta: data[0] });
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
    const { data, error } = await supabase
      .from('alertas_bairro')
      .update({ bairro, titulo, descricao, tipo, localidade_especifica, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();
    if (error) throw error;
    if (!data || data.length === 0) return res.status(404).json({ error: 'Alerta não encontrado' });
    res.json({ alerta: data[0] });
  } catch (err) {
    console.error('Erro ao atualizar alerta:', err);
    res.status(500).json({ error: 'Erro ao atualizar alerta' });
  }
});

// DELETE: Deletar alerta por bairro
router.delete('/alertas-bairro/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('alertas_bairro')
      .delete()
      .eq('id', id);
    if (error) throw error;
    res.json({ message: 'Alerta deletado com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar alerta:', err);
    res.status(500).json({ error: 'Erro ao deletar alerta' });
  }
});

export default router;
