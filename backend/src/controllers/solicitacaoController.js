import { solicitacaoModel } from '../models/solicitacaoModel.js';
import { enviarEmailConfirmacaoSolicitacao, enviarEmailAtualizacaoStatus } from '../services/emailService.js';
import { query } from '../config/db.js';

export const solicitacaoController = {
  // Criar nova solicitação
  async criar(req, res) {
    try {
      const {
        descricao,
        cep,
        bairro,
        rua,
        numero,
        latitude,
        longitude,
        fotos_urls,
        anonima,
      } = req.body;

      const user_id = req.user.id; // Do middleware de autenticação

      if (!descricao || !cep || !bairro || !rua || latitude === undefined || longitude === undefined) {
        return res.status(400).json({
          error: 'Campos obrigatórios faltando',
        });
      }

      const solicitacao = await solicitacaoModel.criar({
        user_id,
        descricao,
        cep,
        bairro,
        rua,
        numero,
        latitude,
        longitude,
        fotos_urls,
        anonima,
      });

      // Buscar email do usuário
      const userResult = await query(
        'SELECT email FROM users WHERE id = $1',
        [user_id]
      );

      // Enviar email de confirmação (não bloqueia a resposta)
      if (userResult.rows.length > 0 && userResult.rows[0].email) {
        enviarEmailConfirmacaoSolicitacao(userResult.rows[0].email, solicitacao)
          .catch(err => console.error('Erro ao enviar email:', err));
      }

      res.status(201).json({
        message: 'Solicitação criada com sucesso',
        solicitacao,
      });
    } catch (error) {
      console.error('Erro ao criar solicitação:', error);
      res.status(500).json({
        error: 'Erro ao criar solicitação',
      });
    }
  },

  // Buscar solicitação por número de rastreamento
  async buscarPorRastreamento(req, res) {
    try {
      const { numeroRastreamento } = req.params;

      const solicitacao = await solicitacaoModel.buscarPorRastreamento(numeroRastreamento);

      if (!solicitacao) {
        return res.status(404).json({
          error: 'Solicitação não encontrada',
        });
      }

      // Buscar histórico de status
      const historico = await solicitacaoModel.buscarHistorico(solicitacao.id);

      res.json({
        solicitacao,
        historico,
      });
    } catch (error) {
      console.error('Erro ao buscar solicitação:', error);
      res.status(500).json({
        error: 'Erro ao buscar solicitação',
      });
    }
  },

  // Listar solicitações do usuário
  async listarDoUsuario(req, res) {
    try {
      const user_id = req.user.id;

      const solicitacoes = await solicitacaoModel.listarPorUsuario(user_id);

      res.json({
        solicitacoes,
      });
    } catch (error) {
      console.error('Erro ao listar solicitações:', error);
      res.status(500).json({
        error: 'Erro ao listar solicitações',
      });
    }
  },

  // Listar todas as solicitações (para mapa público)
  async listarTodasPublicas(req, res) {
    try {
      const solicitacoes = await solicitacaoModel.listarTodas(true);

      res.json({
        solicitacoes,
      });
    } catch (error) {
      console.error('Erro ao listar solicitações:', error);
      res.status(500).json({
        error: 'Erro ao listar solicitações',
      });
    }
  },

  // Listar todas as solicitações (ADMIN)
  async listarTodas(req, res) {
    try {
      const solicitacoes = await solicitacaoModel.listarTodas();

      res.json({
        solicitacoes,
      });
    } catch (error) {
      console.error('Erro ao listar solicitações:', error);
      res.status(500).json({
        error: 'Erro ao listar solicitações',
      });
    }
  },

  // Atualizar status (apenas admin)
  async atualizarStatus(req, res) {
    try {
      const { id } = req.params;
      const { novoStatus, orgaoCompetente, justificativa } = req.body;

      // Validar se o usuário é admin
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
          error: 'Você não tem permissão para atualizar status',
        });
      }

      const statusValidos = [
        'Enviada/Em Análise',
        'Repassada ao Órgão Competente',
        'Em Execução/Serviço Agendado',
        'Concluída/Resolvida',
        'Rejeitada',
      ];

      if (!statusValidos.includes(novoStatus)) {
        return res.status(400).json({
          error: 'Status inválido',
        });
      }

      const solicitacao = await solicitacaoModel.atualizarStatus(
        id,
        novoStatus,
        orgaoCompetente,
        justificativa
      );

      // Buscar email do usuário que fez a solicitação
      const userResult = await query(
        'SELECT email FROM users WHERE id = $1',
        [solicitacao.user_id]
      );

      // Enviar email de atualização de status (não bloqueia a resposta)
      if (userResult.rows.length > 0 && userResult.rows[0].email) {
        enviarEmailAtualizacaoStatus(userResult.rows[0].email, solicitacao, novoStatus, justificativa)
          .catch(err => console.error('Erro ao enviar email de atualização:', err));
      }

      res.json({
        message: 'Status atualizado com sucesso',
        solicitacao,
      });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      res.status(500).json({
        error: 'Erro ao atualizar status',
      });
    }
  },

  // Buscar histórico de status
  async buscarHistorico(req, res) {
    try {
      const { id } = req.params;

      const historico = await solicitacaoModel.buscarHistorico(id);

      res.json({
        historico,
      });
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      res.status(500).json({
        error: 'Erro ao buscar histórico',
      });
    }
  },

  // Buscar solicitação por ID
  async buscarPorId(req, res) {
    try {
      const { id } = req.params;

      const solicitacao = await solicitacaoModel.buscarPorId(id);

      if (!solicitacao) {
        return res.status(404).json({
          error: 'Solicitação não encontrada',
        });
      }

      res.json({
        solicitacao,
      });
    } catch (error) {
      console.error('Erro ao buscar solicitação:', error);
      res.status(500).json({
        error: 'Erro ao buscar solicitação',
      });
    }
  },

  // ADMIN: Atualizar status (com validação de admin)
  async atualizarStatusAdmin(req, res) {
    try {
      const { solicitacaoId } = req.params;
      const { status, justificativa } = req.body;

      if (!status) {
        return res.status(400).json({
          error: 'Status é obrigatório',
        });
      }

      const solicitacao = await solicitacaoModel.atualizarStatus(
        solicitacaoId,
        status,
        null, // orgao_competente pode vir do admin
        justificativa || null
      );

      // Buscar email do usuário
      const userResult = await query(
        'SELECT email FROM users WHERE id = $1',
        [solicitacao.user_id]
      );

      // Enviar email de atualização de status
      if (userResult.rows.length > 0 && userResult.rows[0].email) {
        enviarEmailAtualizacaoStatus(userResult.rows[0].email, solicitacao, status, justificativa)
          .catch(err => console.error('Erro ao enviar email de atualização:', err));
      }

      res.json({
        message: 'Status atualizado com sucesso',
        solicitacao,
      });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      res.status(500).json({
        error: 'Erro ao atualizar status',
      });
    }
  },
};
