import { getSupabase } from '../config/supabaseClient.js';
import { solicitacaoModel } from '../models/solicitacaoModel.js';
import { enviarEmailAtualizacaoStatus, enviarEmailConfirmacaoSolicitacao } from '../services/emailService.js';

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

      // Buscar email do usuário via Supabase
      try {
        const { data: userData, error: userErr } = await getSupabase()
          .from('users')
          .select('email')
          .eq('id', user_id)
          .single();
        if (!userErr && userData?.email) {
          enviarEmailConfirmacaoSolicitacao(userData.email, solicitacao)
            .catch(err => console.error('Erro ao enviar email:', err));
        }
      } catch (e) {
        console.error('Erro ao buscar email do usuário:', e);
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

      // Buscar email do usuário que fez a solicitação via Supabase
      try {
        const { data: userData, error: userErr } = await getSupabase()
          .from('users')
          .select('email')
          .eq('id', solicitacao.user_id)
          .single();
        if (!userErr && userData?.email) {
          enviarEmailAtualizacaoStatus(userData.email, solicitacao, novoStatus, justificativa)
            .catch(err => console.error('Erro ao enviar email de atualização:', err));
        }
      } catch (e) {
        console.error('Erro ao buscar email do usuário:', e);
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

      // Buscar email do usuário via Supabase
      try {
        const { data: userData, error: userErr } = await getSupabase()
          .from('users')
          .select('email')
          .eq('id', solicitacao.user_id)
          .single();
        if (!userErr && userData?.email) {
          enviarEmailAtualizacaoStatus(userData.email, solicitacao, status, justificativa)
            .catch(err => console.error('Erro ao enviar email de atualização:', err));
        }
      } catch (e) {
        console.error('Erro ao buscar email do usuário:', e);
      }

      res.json({
        message: 'Status atualizado com sucesso',
        solicitacao,
      });
    } catch (error) {
      console.error('[ADMIN] Erro ao atualizar status:', error.message);
      console.error('[ADMIN] Stack:', error.stack);
      res.status(500).json({
        error: 'Erro ao atualizar status',
        details: error.message
      });
    }
  },
};
