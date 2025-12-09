import { query } from "../config/db.js";

export const criarDemanda = async (titulo, descricao, bairro, estado, cidade, latitude, longitude, usuario_id) => {
  try {
    const result = await query(
      `INSERT INTO demandas (titulo, descricao, bairro, estado, cidade, latitude, longitude, usuario_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [titulo, descricao, bairro, estado, cidade, latitude, longitude, usuario_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Erro ao criar demanda:', error);
    throw error;
  }
};

export const listarDemandas = async () => {
  try {
    const result = await query(
      'SELECT * FROM demandas ORDER BY id DESC'
    );
    return result.rows;
  } catch (error) {
    console.error('Erro ao listar demandas:', error);
    throw error;
  }
};

export const atualizarDemanda = async (id, status) => {
  try {
    const result = await query(
      'UPDATE demandas SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Erro ao atualizar demanda:', error);
    throw error;
  }
};

export const deletarDemanda = async (id) => {
  try {
    const result = await query(
      'DELETE FROM demandas WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Erro ao deletar demanda:', error);
    throw error;
  }
};
