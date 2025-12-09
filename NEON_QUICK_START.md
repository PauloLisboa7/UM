# Guia Rápido: Migração para Neon

## ⚡ Passos Rápidos (5 minutos)

### 1️⃣ Criar Conta Neon
```
1. Acesse https://neon.tech
2. Clique "Sign up"
3. Use Google ou GitHub
4. Confirme email
```

### 2️⃣ Copiar Connection String
```
1. Dashboard → Novo Projeto
2. Copie: postgresql://user:password@host/database?sslmode=require
```

### 3️⃣ Adicionar ao .env
```bash
# backend/.env
NEON_DATABASE_URL=postgresql://seu-user:sua-senha@seu-host/seu-banco?sslmode=require
JWT_SECRET=sua-chave-secreta
EMAIL_USER=seu-email@gmail.com
EMAIL_PASSWORD=sua-senha-app
FRONTEND_URL=http://localhost:5173
```

### 4️⃣ Criar Tabelas
- Abra Neon SQL Editor
- Cole o SQL de `NEON_SETUP.md` (seção "Criar as Tabelas no Neon")
- Execute

### 5️⃣ Testar
```bash
cd backend
npm run dev
```

Se vir isso, funcionou! ✅
```
Neon: conexão com PostgreSQL estabelecida
Neon: conexão verificada (consulta de teste OK).
```

## 📊 O que mudou

| Aspecto | Antes | Depois |
|--------|-------|--------|
| **Banco** | Supabase | Neon |
| **Driver** | @supabase/supabase-js | pg (PostgreSQL) |
| **Queries** | ORM (from, select) | SQL direto |
| **Conexão** | SUPABASE_URL + KEY | NEON_DATABASE_URL |

## ✨ Vantagens

- ✅ SQL puro (sem lock-in do Supabase)
- ✅ Mais controle
- ✅ Melhor performance
- ✅ Backup automático
- ✅ Plano gratuito generoso

## 🆘 Problemas Comuns

### "NEON_DATABASE_URL is not defined"
```bash
# Verifique se está em backend/.env
# Reinicie: npm run dev
```

### "connect ECONNREFUSED"
```bash
# Copie a URL correta do Neon
# Teste: psql "sua-url"
```

### "relation 'users' does not exist"
```bash
# Execute o SQL para criar as tabelas
# (Neon SQL Editor)
```

## 📚 Documentação Completa

Veja `NEON_SETUP.md` para:
- Migração de dados do Supabase
- Todas as queries SQL
- Troubleshooting detalhado
- Índices e performance
