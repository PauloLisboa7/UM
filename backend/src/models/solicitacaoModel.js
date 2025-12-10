import { getSupabase } from '../config/supabaseClient.js';

export const solicitacaoModel = {
  // Criar uma nova solicitação
  async criar(solicitacao) {
    const {
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
    } = solicitacao;

    // Gerar número de rastreamento único
    const numeroRastreamento = `SOL-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const novaSolicitacao = {
      user_id,
      descricao,
      cep,
      bairro,
      rua,
      numero,
      latitude,
      longitude,
      fotos_urls: fotos_urls || [],
      anonima: anonima || false,
      numero_rastreamento: numeroRastreamento,
      status: 'Enviada/Em Análise',
      created_at: new Date().toISOString(),
    };

    const { data, error } = await getSupabase()
      .from('solicitacoes')
      .insert([novaSolicitacao])
      .select();
    if (error) {
      console.error('Erro ao criar solicitação:', error);
      throw error;
    }
    return data[0];
  },

  // Buscar solicitação por ID
  async buscarPorId(id) {
    const { data, error } = await getSupabase()
      .from('solicitacoes')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      console.error('Erro ao buscar solicitação:', error);
      throw error;
    }
    return data || null;
  },

  // Buscar solicitação por número de rastreamento
  async buscarPorRastreamento(numeroRastreamento) {
    const { data, error } = await getSupabase()
      .from('solicitacoes')
      .select('*')
      .eq('numero_rastreamento', numeroRastreamento)
      .single();
    if (error) {
      console.error('Erro ao buscar solicitação:', error);
      throw error;
    }
    return data || null;
  },

  // Listar solicitações do usuário
  async listarPorUsuario(userId) {
    const { data, error } = await getSupabase()
      .from('solicitacoes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Erro ao listar solicitações:', error);
      throw error;
    }
    return data;
  },

  // Listar todas as solicitações (para mapa público ou admin)
  async listarTodas(apenasPublicas = true) {
    let queryBuilder = getSupabase()
      .from('solicitacoes')
      .select('*');
    if (apenasPublicas) {
      queryBuilder = queryBuilder.eq('anonima', false);
    }
    queryBuilder = queryBuilder.order('created_at', { ascending: false });
    const { data, error } = await queryBuilder;
    if (error) {
      console.error('Erro ao listar solicitações:', error);
      throw error;
    }
    return data;
  },

  // Deletar solicitação por id
  async excluir(id) {
    const { error } = await getSupabase()
      .from('solicitacoes')
      .delete()
      .eq('id', id);
    if (error) {
      console.error('Erro ao deletar solicitação:', error);
      throw error;
    }
    return true;
  },

  // Atualizar campos da solicitação (admin)
  async atualizarPorAdmin(id, dados) {
    const { data, error } = await getSupabase()
      .from('solicitacoes')
      .update({ ...dados, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();
    if (error) {
      console.error('Erro ao atualizar solicitação (admin):', error);
      throw error;
    }
    return data[0];
  },

  // Atualizar status
  async atualizarStatus(id, novoStatus, orgaoCompetente = null, justificativa = null) {
    const solicitacao = await this.buscarPorId(id);
    if (!solicitacao) throw new Error('Solicitação não encontrada');

    // Adicionar ao histórico
    const historico = {
      solicitacao_id: id,
      status_anterior: solicitacao.status,
      status_novo: novoStatus,
      orgao_competente: orgaoCompetente,
      justificativa,
      created_at: new Date().toISOString(),
    };
    const { error: histError } = await getSupabase()
      .from('status_historico')
      .insert([historico]);
    if (histError) {
      console.error('Erro ao inserir histórico:', histError);
      throw histError;
    }

    // Atualizar solicitação
    const { data, error } = await getSupabase()
      .from('solicitacoes')
      .update({
        status: novoStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select();
    if (error) {
      console.error('Erro ao atualizar solicitação:', error);
      throw error;
    }
    return data[0];
  },

  // Buscar histórico de status
  async buscarHistorico(solicitacaoId) {
    const { data, error } = await getSupabase()
      .from('status_historico')
      .select('*')
      .eq('solicitacao_id', solicitacaoId)
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Erro ao buscar histórico:', error);
      throw error;
    }
    return data;
  },
};
