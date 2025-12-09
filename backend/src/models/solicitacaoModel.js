import { query } from '../config/db.js';

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

    try {
      const result = await query(
        `INSERT INTO solicitacoes (user_id, descricao, cep, bairro, rua, numero, latitude, longitude, fotos_urls, anonima, numero_rastreamento, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
        [user_id, descricao, cep, bairro, rua, numero, latitude, longitude, fotos_urls || [], anonima || false, numeroRastreamento, 'Enviada/Em Análise']
      );
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao criar solicitação:', error);
      throw error;
    }
  },

  // Buscar solicitação por ID
  async buscarPorId(id) {
    try {
      const result = await query(
        'SELECT * FROM solicitacoes WHERE id = $1',
        [id]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Erro ao buscar solicitação:', error);
      throw error;
    }
  },

  // Buscar solicitação por número de rastreamento
  async buscarPorRastreamento(numeroRastreamento) {
    try {
      const result = await query(
        'SELECT * FROM solicitacoes WHERE numero_rastreamento = $1',
        [numeroRastreamento]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Erro ao buscar solicitação:', error);
      throw error;
    }
  },

  // Listar solicitações do usuário
  async listarPorUsuario(userId) {
    try {
      const result = await query(
        'SELECT * FROM solicitacoes WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );
      return result.rows;
    } catch (error) {
      console.error('Erro ao listar solicitações:', error);
      throw error;
    }
  },

  // Listar todas as solicitações (para mapa público)
  async listarTodas(apenasPublicas = true) {
    try {
      let sql = 'SELECT id, descricao, latitude, longitude, status, numero_rastreamento, created_at, bairro, rua FROM solicitacoes';
      
      if (apenasPublicas) {
        sql += ' WHERE anonima = false';
      }
      
      sql += ' ORDER BY created_at DESC';
      
      const result = await query(sql);
      return result.rows;
    } catch (error) {
      console.error('Erro ao listar solicitações:', error);
      throw error;
    }
  },

  // Atualizar status
  async atualizarStatus(id, novoStatus, orgaoCompetente = null, justificativa = null) {
    try {
      const solicitacao = await this.buscarPorId(id);
      if (!solicitacao) throw new Error('Solicitação não encontrada');
      
      // Adicionar ao histórico
      await query(
        `INSERT INTO status_historico (solicitacao_id, status_anterior, status_novo, orgao_competente, justificativa)
         VALUES ($1, $2, $3, $4, $5)`,
        [id, solicitacao.status, novoStatus, orgaoCompetente, justificativa]
      );

      // Atualizar solicitação
      const result = await query(
        `UPDATE solicitacoes SET status = $1, orgao_competente = $2, justificativa_rejeicao = $3, updated_at = NOW()
         WHERE id = $4 RETURNING *`,
        [novoStatus, orgaoCompetente, justificativa, id]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      throw error;
    }
  },

  // Buscar histórico de status
  async buscarHistorico(solicitacaoId) {
    try {
      const result = await query(
        'SELECT * FROM status_historico WHERE solicitacao_id = $1 ORDER BY created_at DESC',
        [solicitacaoId]
      );
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      throw error;
    }
  },
};
