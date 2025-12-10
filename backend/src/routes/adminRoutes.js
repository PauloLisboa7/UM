import express from 'express';
import { getSupabase } from '../config/supabaseClient.js';
import { adminMiddleware, authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Assumimos que as tabelas já existem no Supabase; não criamos tabelas aqui.

// ===== AVISOS E ALERTAS =====

// GET: Listar todos os avisos
router.get('/avisos', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const supabase = getSupabase();
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
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('avisos')
      .insert([{ titulo, descricao, tipo: tipo || 'trânsito', status: status || 'aviso', localidade: localidade || null }])
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
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('avisos')
      .update({ titulo, descricao, tipo, status, localidade })
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
    const supabase = getSupabase();
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
    const supabase = getSupabase();
    const { data: configs, error: configsErr } = await supabase
      .from('configuracoes_notificacao')
      .select('*');
    if (configsErr) throw configsErr;

    const userIds = [...new Set(configs.map(c => c.usuario_id).filter(Boolean))];
    let usersMap = {};
    if (userIds.length > 0) {
      const { data: users } = await supabase
        .from('users')
        .select('id, username, email')
        .in('id', userIds);
      usersMap = (users || []).reduce((acc, u) => { acc[u.id] = u; return acc; }, {});
    }

    const enriched = (configs || []).map(c => ({
      ...c,
      usuario_nome: usersMap[c.usuario_id]?.username || null,
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
    const supabase = getSupabase();
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
    const supabase = getSupabase();
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
    const supabase = getSupabase();
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
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('alertas_bairro')
      .insert([{ bairro, titulo, descricao, tipo: tipo || 'trânsito', localidade_especifica: localidade_especifica || null }])
      .select();
    if (error) {
      console.error('Erro detalhado ao criar alerta:', error);
      return res.status(500).json({ error: `Erro ao criar alerta: ${error.message || JSON.stringify(error)}` });
    }
    res.status(201).json({ alerta: data[0] });
  } catch (err) {
    console.error('Erro ao criar alerta:', err);
    res.status(500).json({ error: `Erro ao criar alerta: ${err.message}` });
  }
});

// PUT: Atualizar alerta por bairro
router.put('/alertas-bairro/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;
  const { bairro, titulo, descricao, tipo, localidade_especifica } = req.body;

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('alertas_bairro')
      .update({ bairro, titulo, descricao, tipo, localidade_especifica })
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
    const supabase = getSupabase();
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

// GET: listar usuários (admin) - aceita query param `ids` com lista separada por vírgula
router.get('/usuarios', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const supabase = getSupabase();
    const idsParam = req.query.ids;
    let query = supabase.from('users').select('id, username, email');
    if (idsParam) {
      const ids = idsParam.split(',').map(id => Number(id)).filter(Boolean);
      if (ids.length > 0) query = query.in('id', ids);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json({ users: data || [] });
  } catch (err) {
    console.error('Erro ao listar usuários (admin):', err);
    res.status(500).json({ error: 'Erro ao listar usuários' });
  }
});

// GET: listar eventos de login dos usuários (admin)
router.get('/logins', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const supabase = getSupabase();

    // paginação opcional
    const limit = Math.min(500, Number(req.query.limit || 200));

    const { data, error } = await supabase
      .from('user_logins')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    const userIds = [...new Set((data || []).map(d => d.user_id).filter(Boolean))];
    let usersMap = {};
    if (userIds.length > 0) {
      const { data: users } = await supabase
        .from('users')
        .select('id, username, email')
        .in('id', userIds);
      usersMap = (users || []).reduce((acc, u) => { acc[u.id] = u; return acc; }, {});
    }

    const enriched = (data || []).map(item => ({
      ...item,
      usuario_nome: usersMap[item.user_id]?.nome || usersMap[item.user_id]?.username || null,
    }));

    res.json({ logins: enriched });
  } catch (err) {
    console.error('Erro ao listar logins (admin):', err);
    res.status(500).json({ error: 'Erro ao listar logins' });
  }
});

// DELETE: deletar evento de login
router.delete('/logins/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = getSupabase();
    const { error } = await supabase
      .from('user_logins')
      .delete()
      .eq('id', id);
    if (error) throw error;
    res.json({ message: 'Evento de login deletado' });
  } catch (err) {
    console.error('Erro ao deletar login (admin):', err);
    res.status(500).json({ error: 'Erro ao deletar login' });
  }
});

// PUT: editar evento de login (metadados)
router.put('/logins/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body || {};
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('user_logins')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();
    if (error) throw error;
    res.json({ login: data[0] });
  } catch (err) {
    console.error('Erro ao atualizar login (admin):', err);
    res.status(500).json({ error: 'Erro ao atualizar login' });
  }
});

// GET: listar solicitações de um usuário específico (admin)
router.get('/usuarios/:id/solicitacoes', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const usuarioId = req.params.id;
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('solicitacoes')
      .select('*')
      .eq('user_id', usuarioId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ solicitacoes: data || [] });
  } catch (err) {
    console.error('Erro ao listar solicitacoes do usuario (admin):', err);
    res.status(500).json({ error: 'Erro ao listar solicitacoes do usuario' });
  }
});
