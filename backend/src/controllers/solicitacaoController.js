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

      // Enriquecer com última atualização de status (buscar em lote status_historico)
      try {
        const solicitacaoIds = solicitacoes.map(s => s.id).filter(Boolean);
        if (solicitacaoIds.length > 0) {
          const { data: historicos, error: histErr } = await getSupabase()
            .from('status_historico')
            .select('solicitacao_id, created_at')
            .in('solicitacao_id', solicitacaoIds)
            .order('created_at', { ascending: false });

          if (!histErr && historicos) {
            const lastMap = {};
            for (const h of historicos) {
              if (!lastMap[h.solicitacao_id]) lastMap[h.solicitacao_id] = h.created_at;
            }
            // Anexar campo ultima_atualizacao_status em cada solicitacao
            for (const s of solicitacoes) {
              s.ultima_atualizacao_status = lastMap[s.id] || null;
            }
          }
        }
      } catch (e) {
        console.error('Erro ao enriquecer solicitações com histórico:', e);
      }

      res.json({ solicitacoes });
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

      // Enriquecer com nomes de usuário
      const userIds = [...new Set((solicitacoes || []).map(s => s.user_id || s.usuario_id).filter(Boolean))];
      let usersMap = {};
      if (userIds.length > 0) {
        try {
          // Tentar busca em lote primeiro
          const supabase = getSupabase();
          const { data: users, error: usersErr } = await supabase
            .from('users')
            .select('id, username, email')
            .in('id', userIds);

          if (!usersErr && users && users.length > 0) {
            usersMap = (users || []).reduce((acc, u) => { acc[u.id] = u; return acc; }, {});
          } else {
            // Caso a busca em lote não retorne (possível mismatch de tipo), buscar individualmente
            console.log('[solicitacaoController] coleta userIds:', userIds.slice(0, 20));
            await Promise.all(userIds.map(async (uid) => {
              try {
                const { data: singleUser, error: singleErr } = await supabase
                  .from('users')
                  .select('id, username, email')
                  .eq('id', uid)
                  .limit(1)
                  .single();
                if (!singleErr && singleUser) usersMap[singleUser.id] = singleUser;
              } catch (e) {
                // tentar como string
                try {
                  const { data: singleUser2, error: singleErr2 } = await supabase
                    .from('users')
                    .select('id, username, email')
                    .eq('id', String(uid))
                    .limit(1)
                    .single();
                  if (!singleErr2 && singleUser2) usersMap[singleUser2.id] = singleUser2;
                } catch (ee) {
                  // ignore
                }
              }
            }));
          }
        } catch (e) {
          console.error('Erro ao buscar usuários para enriquecer solicitações:', e);
        }
      }

      // Enriquecer com histórico de status e última atualização
      const solicitacaoIds = (solicitacoes || []).map(s => s.id).filter(Boolean);
      let historicosMap = {};
      let ultimaMap = {};
      if (solicitacaoIds.length > 0) {
        try {
          const { data: historicos, error: histErr } = await getSupabase()
            .from('status_historico')
            .select('*')
            .in('solicitacao_id', solicitacaoIds)
            .order('created_at', { ascending: false });

          if (!histErr && historicos) {
            for (const h of historicos) {
              if (!historicosMap[h.solicitacao_id]) historicosMap[h.solicitacao_id] = [];
              historicosMap[h.solicitacao_id].push(h);
              if (!ultimaMap[h.solicitacao_id]) ultimaMap[h.solicitacao_id] = h.created_at;
            }
          }
        } catch (e) {
          console.error('Erro ao buscar histórico para enriquecer solicitações:', e);
        }
      }

      const enriched = (solicitacoes || []).map(s => {
        const u = usersMap[s.user_id || s.usuario_id];
        const nome = u?.nome || u?.username || null;
        const email = u?.email || null;
        return {
          ...s,
          nome_usuario: nome,
          usuario_nome: nome, // compatibilidade com frontends antigos
          email_usuario: email,
          usuario_email: email,
          ultima_atualizacao_status: ultimaMap[s.id] || null,
          historico_status: (historicosMap[s.id] || []).slice(0, 10), // trazer até 10 entradas mais recentes
        };
      });

      // Log summary to help debugging in dev
      try {
        const foundNames = enriched.filter(s => s.nome_usuario).length;
        console.log(`[solicitacaoController] listarTodas: solicitacoes=${enriched.length}, com_nome_usuario=${foundNames}, usuarios_encontrados=${Object.keys(usersMap).length}`);
      } catch (e) {
        // ignore logging errors
      }

      res.json({ solicitacoes: enriched });
    } catch (error) {
      console.error('Erro ao listar solicitações:', error);
      res.status(500).json({
        error: 'Erro ao listar solicitações',
      });
    }
  },

  // Deletar solicitação (admin)
  async deletar(req, res) {
    try {
      const { id } = req.params;
      await solicitacaoModel.excluir(id);
      res.json({ message: 'Solicitação deletada com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar solicitação:', error);
      res.status(500).json({ error: 'Erro ao deletar solicitação' });
    }
  },

  // Atualizar campos da solicitação (admin)
  async atualizarPorAdmin(req, res) {
    try {
      const { id } = req.params;
      const dados = req.body;
      const updated = await solicitacaoModel.atualizarPorAdmin(id, dados);
      res.json({ solicitacao: updated });
    } catch (error) {
      console.error('Erro ao atualizar solicitação (admin):', error);
      res.status(500).json({ error: 'Erro ao atualizar solicitação' });
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
