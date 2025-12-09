import { query } from '../src/config/db.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkUsers() {
  try {
    const result = await query('SELECT id, username, role, email FROM users');
    console.log('Usuários no banco:');
    console.table(result.rows);
  } catch (error) {
    console.error('Erro:', error.message);
  } finally {
    process.exit(0);
  }
}

checkUsers();
