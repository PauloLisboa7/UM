import { query } from "../config/db.js";

const table = "estruturas_culturais";

export const listarEstruturas = async () => {
  try {
    const result = await query(
      `SELECT * FROM ${table} ORDER BY nome ASC`
    );
    return result.rows;
  } catch (error) {
    console.error('Erro ao listar estruturas:', error);
    throw error;
  }
};

export const criarEstrutura = async (estrutura) => {
  try {
    const keys = Object.keys(estrutura);
    const values = Object.values(estrutura);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
    
    const result = await query(
      `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`,
      values
    );
    return result.rows[0];
  } catch (error) {
    console.error('Erro ao criar estrutura:', error);
    throw error;
  }
};

export const atualizarEstrutura = async (id, updates) => {
  try {
    const keys = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    
    const result = await query(
      `UPDATE ${table} SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
      [...values, id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Erro ao atualizar estrutura:', error);
    throw error;
  }
};

export const deletarEstrutura = async (id) => {
  try {
    const result = await query(
      `DELETE FROM ${table} WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Erro ao deletar estrutura:', error);
    throw error;
  }
};

export const obterEstrutura = async (identifier) => {
  try {
    const isNumeric = !Number.isNaN(Number(identifier));
    const column = isNumeric ? 'id' : 'slug';
    const value = isNumeric ? Number(identifier) : identifier;
    
    const result = await query(
      `SELECT * FROM ${table} WHERE ${column} = $1`,
      [value]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Erro ao obter estrutura:', error);
    throw error;
  }
};

