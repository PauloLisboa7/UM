import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';

dotenv.config();

// Configuração do Neon PostgreSQL
export const db = new Client({
  connectionString: process.env.NEON_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Conectar ao banco de dados
db.connect()
  .then(() => console.log('Neon: conexão com PostgreSQL estabelecida'))
  .catch(err => console.error('Erro ao conectar ao Neon:', err));

// Função para executar queries
export async function query(text, params) {
  try {
    const result = await db.query(text, params);
    return result;
  } catch (error) {
    console.error('Erro na query:', error);
    throw error;
  }
}

// Export para manter compatibilidade com código antigo (se necessário)
export const supabase = null;
