import { db, query } from '../config/db.js';

export const getUserByUsername = async (username) => {
  const sanitizedUsername = (username ?? '').trim();
  if (!sanitizedUsername) return null;

  try {
    const result = await query(
      'SELECT * FROM users WHERE LOWER(username) = LOWER($1)',
      [sanitizedUsername]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Erro ao buscar usuário por username:', error);
    throw error;
  }
};

export const createUser = async (username, password, role = 'user', email = null) => {
  const sanitizedUsername = (username ?? '').trim();
  if (!sanitizedUsername) throw new Error('Nome de usuário obrigatório');

  try {
    const result = await query(
      'INSERT INTO users (username, password, role, email) VALUES ($1, $2, $3, $4) RETURNING *',
      [sanitizedUsername, password, role, email]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw error;
  }
};
