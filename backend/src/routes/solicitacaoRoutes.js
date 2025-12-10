import express from 'express';
import { solicitacaoController } from '../controllers/solicitacaoController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getSupabase } from '../config/supabaseClient.js';
import { solicitacaoModel } from '../models/solicitacaoModel.js';

const router = express.Router();

// Middleware para verificar admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Acesso negado: apenas admin' });
  }
};

// ROTAS ESPECÍFICAS (ANTES das rotas genéricas)

// ADMIN: Listar todas as solicitações
router.get('/admin/listar', authMiddleware, isAdmin, solicitacaoController.listarTodas);

// DEBUG (DEV ONLY): retornar solicitações enriquecidas e mapa de usuários (sem auth)
router.get('/admin/debug-listar', async (req, res) => {
  try {
    const supabase = getSupabase();
    const solicitacoes = await solicitacaoModel.listarTodas();

    const userIds = [...new Set((solicitacoes || []).map(s => s.user_id || s.usuario_id).filter(Boolean))];
    let usersMap = {};
    if (userIds.length > 0) {
        try {
          const { data: users, error: usersErr } = await supabase
          .from('users')
          .select('id, username, email')
          .in('id', userIds);
        if (!usersErr && users) usersMap = (users || []).reduce((acc, u) => { acc[u.id] = u; return acc; }, {});
      } catch (e) {
        console.error('[DEBUG] erro buscando users em lote', e);
      }
    }

    // fallback: tentar buscar individualmente se usersMap vazio
    if (Object.keys(usersMap).length === 0 && userIds.length > 0) {
      for (const uid of userIds.slice(0, 100)) {
        try {
          const { data: u, error: ue } = await supabase.from('users').select('id, username, email').eq('id', uid).limit(1).single();
          if (!ue && u) usersMap[u.id] = u;
        } catch (e) {
          try {
            const { data: u2, error: ue2 } = await supabase.from('users').select('id, username, email').eq('id', String(uid)).limit(1).single();
            if (!ue2 && u2) usersMap[u2.id] = u2;
          } catch (ee) {
            // ignore
          }
        }
      }
    }

    const enriched = (solicitacoes || []).map(s => ({
      ...s,
      nome_usuario: usersMap[s.user_id || s.usuario_id]?.nome || usersMap[s.user_id || s.usuario_id]?.username || null,
      usuario_nome: usersMap[s.user_id || s.usuario_id]?.nome || usersMap[s.user_id || s.usuario_id]?.username || null,
      email_usuario: usersMap[s.user_id || s.usuario_id]?.email || null,
      usuario_email: usersMap[s.user_id || s.usuario_id]?.email || null,
    }));

    // também retornar amostra dos primeiros users para diagnóstico
    let allUsersSample = [];
    try {
      const { data: allUsers } = await supabase.from('users').select('id, username, email').limit(50);
      allUsersSample = allUsers || [];
    } catch (e) {
      console.error('[DEBUG] erro fetching all users sample', e);
    }

    res.json({ solicitacoes: enriched, userIds, usersFound: Object.keys(usersMap).length, usersMap, allUsersSample });
  } catch (err) {
    console.error('[DEBUG] erro debug-listar', err);
    res.status(500).json({ error: 'Erro debug listar' });
  }
});

// ADMIN: Atualizar status
router.patch('/admin/:solicitacaoId/status', authMiddleware, isAdmin, solicitacaoController.atualizarStatusAdmin);

// ADMIN: Atualizar campos (edição completa)
router.patch('/admin/:id', authMiddleware, isAdmin, solicitacaoController.atualizarPorAdmin);

// ADMIN: Deletar solicitação
router.delete('/admin/:id', authMiddleware, isAdmin, solicitacaoController.deletar);

// Listar solicitações do usuário (autenticado)
router.get('/minhas-solicitacoes', authMiddleware, solicitacaoController.listarDoUsuario);

// Listar todas as solicitações públicas (para mapa)
router.get('/publicas/todas', solicitacaoController.listarTodasPublicas);

// Buscar por número de rastreamento (público)
router.get('/rastreamento/:numeroRastreamento', solicitacaoController.buscarPorRastreamento);

// ROTAS GENÉRICAS (POR ÚLTIMO)

// Criar nova solicitação (autenticado)
router.post('/', authMiddleware, solicitacaoController.criar);

// Atualizar status (apenas admin)
router.put('/:id/status', authMiddleware, solicitacaoController.atualizarStatus);

// Buscar histórico de status
router.get('/:id/historico', solicitacaoController.buscarHistorico);

// Fallback genérico para GET (pega por ID)
router.get('/:id', solicitacaoController.buscarPorId);

export default router;
