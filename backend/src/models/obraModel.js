import { query } from "../config/db.js";

export const criarObra = async (titulo, descricao, bairro, latitude, longitude, usuario_id, status = 'planejada', progresso = 0, data_inicio = null, data_fim = null, valor_estimado = null) => {
  try {
    const result = await query(
      `INSERT INTO obras (titulo, descricao, bairro, latitude, longitude, usuario_id, status, progresso, data_inicio, data_fim, valor_estimado)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [titulo, descricao, bairro, latitude, longitude, usuario_id, status, progresso, data_inicio, data_fim, valor_estimado]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Erro ao criar obra:', error);
    throw error;
  }
};

export const listarObras = async () => {
  try {
    const result = await query(
      'SELECT * FROM obras ORDER BY id DESC'
    );
    return result.rows;
  } catch (error) {
    console.error('Erro ao listar obras:', error);
    throw error;
  }
};

export const atualizarObra = async (id, status, progresso = null, data_inicio = null, data_fim = null, valor_estimado = null) => {
  try {
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (status !== undefined) {
      updates.push(`status = $${paramIndex++}`);
      values.push(status);
    }
    if (progresso !== null) {
      updates.push(`progresso = $${paramIndex++}`);
      values.push(progresso);
    }
    if (data_inicio !== null) {
      updates.push(`data_inicio = $${paramIndex++}`);
      values.push(data_inicio);
    }
    if (data_fim !== null) {
      updates.push(`data_fim = $${paramIndex++}`);
      values.push(data_fim);
    }
    if (valor_estimado !== null) {
      updates.push(`valor_estimado = $${paramIndex++}`);
      values.push(valor_estimado);
    }

    values.push(id);
    const result = await query(
      `UPDATE obras SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );
    return result.rows[0];
  } catch (error) {
    console.error('Erro ao atualizar obra:', error);
    throw error;
  }
};

export const deletarObra = async (id) => {
  try {
    const result = await query(
      'DELETE FROM obras WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Erro ao deletar obra:', error);
    throw error;
  }
};
