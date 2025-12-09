# 🔐 Criar Usuário Admin Localmente

## Pré-requisito

Você já deve ter as tabelas criadas no banco de dados. Se ainda não tem:

1. Acesse o Neon SQL Editor
2. Execute o SQL de criação de tabelas (veja `NEON_COPY_PASTE.md`)

---

## 📝 Opção 1: Script Automático (Recomendado)

### Passo 1: Certifique-se que o .env está configurado

Abra `backend/.env` e verifique:

```env
NEON_DATABASE_URL=postgresql://neondb_owner:...
JWT_SECRET=Estronda31.
PORT=5000
```

### Passo 2: Execute o script

```bash
cd backend
npm run create-admin
```

Você verá:

```
Conectando ao banco de dados...
Criando usuário admin...
✅ Usuário admin criado com sucesso!

📋 Detalhes do usuário:
   Username: clean7
   Role: admin
   Email: admin@cleanwork.com
   ID: 1

🔐 Credenciais:
   Username: clean7
   Senha: cleanwork7
```

---

## 📝 Opção 2: SQL Manual (Alternativa)

Se preferir criar diretamente no banco, execute no Neon SQL Editor:

```sql
-- Criar usuário admin clean7
INSERT INTO users (username, password, role, email, created_at, updated_at) 
VALUES (
  'clean7',
  '$2b$10$4S6nECiLd6LZJmHx.7kXXeKRF9tDg3pY8Qv8c.mK8vL9.q2mW2nK6',
  'admin',
  'admin@cleanwork.com',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT (username) DO UPDATE SET
  role = 'admin',
  password = '$2b$10$4S6nECiLd6LZJmHx.7kXXeKRF9tDg3pY8Qv8c.mK8vL9.q2mW2nK6'
RETURNING id, username, role;

-- Verificar
SELECT id, username, role, email FROM users WHERE username = 'clean7';
```

---

## 🎯 Testando o Admin

### 1. Inicie o Backend e Frontend

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

### 2. Acesse a Aplicação

```
http://localhost:5173
```

### 3. Faça Login com Admin

- **Username:** `clean7`
- **Senha:** `cleanwork7`

### 4. Você Verá:

No canto direito superior (após login):
```
┌──────────────────────┐
│ Olá, clean7 [laranja]│
└──────────────────────┘
```

No menu de navegação:
```
Solicitar Reclamação | Acompanhe Aqui | ... | Admin
                                            ↑
                                       (em laranja!)
```

### 5. Clique em "Admin"

Você verá o **Painel de Administração** com:
- ✅ Lista de solicitações (vazia inicialmente)
- ✅ Detalhes e atualização de status
- ✅ Filtros por status
- ✅ Justificativa de mudança

---

## ⚠️ Problemas Comuns

### "Error: connect ECONNREFUSED"
```
❌ Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solução:** 
- Certifique-se que a URL do Neon está correta no `.env`
- A URL deve começar com `postgresql://`
- Não esqueça de adicionar `?sslmode=require&channel_binding=require`

### "relation \"users\" does not exist"
```
❌ error: relation "users" does not exist
```

**Solução:**
- As tabelas ainda não foram criadas no Neon
- Execute o SQL do `NEON_COPY_PASTE.md` no Neon SQL Editor

### "duplicate key value violates unique constraint"
```
❌ duplicate key value violates unique constraint "users_username_key"
```

**Solução:**
- O usuário `clean7` já existe
- O script trata isso com `ON CONFLICT DO UPDATE`
- Se quiser recrear, execute manualmente no SQL

---

## ✅ Verificar se Admin Foi Criado

### No Neon SQL Editor:

```sql
SELECT username, role, email FROM users WHERE username = 'clean7';
```

Você deve ver:
```
username | role  | email
─────────┼───────┼──────────────────────
clean7   | admin | admin@cleanwork.com
```

---

## 📊 Resumo

| Passo | Ação | Status |
|-------|------|--------|
| 1 | Tabelas criadas no Neon | ✅ Necessário |
| 2 | `.env` configurado | ✅ Necessário |
| 3 | `npm run create-admin` executado | ✅ Você está aqui |
| 4 | Backend iniciado | ⏳ Próximo |
| 5 | Frontend iniciado | ⏳ Próximo |
| 6 | Login com clean7/cleanwork7 | ⏳ Próximo |
| 7 | Acessar painel Admin | ⏳ Próximo |

---

**Pronto! Admin criado! 🎉**

Agora você pode testar o painel completo com:
- Listar solicitações
- Atualizar status
- Receber emails de confirmação

