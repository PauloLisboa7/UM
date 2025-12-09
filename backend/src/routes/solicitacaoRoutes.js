import express from 'express';
import { solicitacaoController } from '../controllers/solicitacaoController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

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

// ADMIN: Atualizar status
router.patch('/admin/:solicitacaoId/status', authMiddleware, isAdmin, solicitacaoController.atualizarStatusAdmin);

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
