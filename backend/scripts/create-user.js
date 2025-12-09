import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { query } from '../src/config/db.js';

dotenv.config();

async function createUser(username, password, email = null) {
  try {
    console.log(`Criando usuário: ${username}...`);
    
    const passwordHash = await bcrypt.hash(password, 10);
    
    const result = await query(
      `INSERT INTO users (username, password, role, email, created_at, updated_at)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       ON CONFLICT (username) DO UPDATE SET
       role = 'user',
       password = $2
       RETURNING id, username, role, email`,
      [username, passwordHash, 'user', email || `${username}@cleanwork.com`]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];
      console.log('✅ Usuário criado com sucesso!');
      console.log('');
      console.log('📋 Detalhes do usuário:');
      console.log(`   Username: ${user.username}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   ID: ${user.id}`);
      console.log('');
      console.log('🔐 Credenciais:');
      console.log(`   Username: ${username}`);
      console.log(`   Senha: ${password}`);
    }
  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error.message);
  } finally {
    process.exit(0);
  }
}

// Obter argumentos da linha de comando
const username = process.argv[2];
const password = process.argv[3];
const email = process.argv[4];

if (!username || !password) {
  console.error('❌ Uso: npm run create-user -- <username> <password> [email]');
  console.error('Exemplo: npm run create-user -- user user1 user@example.com');
  process.exit(1);
}

createUser(username, password, email);
