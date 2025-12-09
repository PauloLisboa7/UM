import bcrypt from 'bcrypt';
import { db, query } from '../src/config/db.js';
import dotenv from 'dotenv';

dotenv.config();

async function createAdminUser() {
  try {
    console.log('Conectando ao banco de dados...');
    
    // Hash da senha "cleanwork7"
    const passwordHash = await bcrypt.hash('cleanwork7', 10);
    
    console.log('Criando usuário admin...');
    
    const result = await query(
      `INSERT INTO users (username, password, role, email, created_at, updated_at)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       ON CONFLICT (username) DO UPDATE SET
       role = 'admin',
       password = $2
       RETURNING id, username, role, email`,
      ['clean7', passwordHash, 'admin', 'admin@cleanwork.com']
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];
      console.log('✅ Usuário admin criado com sucesso!');
      console.log('');
      console.log('📋 Detalhes do usuário:');
      console.log(`   Username: ${user.username}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   ID: ${user.id}`);
      console.log('');
      console.log('🔐 Credenciais:');
      console.log('   Username: clean7');
      console.log('   Senha: cleanwork7');
    }
  } catch (error) {
    console.error('❌ Erro ao criar usuário admin:', error.message);
  } finally {
    process.exit(0);
  }
}

createAdminUser();
