# 🚀 Plataforma de Transparência - Setup Completo

## 📋 Status Atual
✅ Projeto limpo de dados obsoletos  
✅ Backend conectado ao Supabase (`txzaqyaluvcbausnqpru`)  
✅ Schema SQL pronto para ser executado  

## 🔧 Próximos Passos

### 1️⃣ Executar SQL no Supabase (Limpeza e Criação de Tabelas)

1. Acesse: https://txzaqyaluvcbausnqpru.supabase.co
2. Vá para **SQL Editor** (lado esquerdo)
3. Crie uma nova query vazia
4. Copie e cola o conteúdo de **`CLEANUP_AND_SETUP_DB.sql`** do repositório
5. Execute (clique em "Run" ou Ctrl+Enter)
6. Aguarde a conclusão (deve levar 10-30 segundos)

**Resultado esperado:** Todas as tabelas criadas, índices configurados, RLS ativado.

### 2️⃣ Iniciar Backend

```bash
cd backend
npm install  # Se não tiver feito
npm run dev
```

Esperado:
```
[SUPABASE] Inicializando cliente com URL: https://txzaqyaluvcbausnqpru...
Supabase: conexão verificada (consulta de teste OK).
Servidor rodando na porta 5000
```

### 3️⃣ Iniciar Frontend

```bash
cd frontend
npm install  # Se não tiver feito
npm run dev
```

O frontend estará em `http://localhost:5173` (ou a porta mostrada).

### 4️⃣ Testar o Sistema

**Registro:**
1. Vá para `/register`
2. Crie um usuário novo (ex: `testuser`, `test@example.com`, `password123`)
3. Será criado automaticamente na tabela `users` do Supabase

**Login:**
1. Vá para `/login`
2. Use as credenciais criadas
3. Será emitido um JWT válido por 1 hora

**Admin Panel (Opcional):**
1. Crie um usuário admin manualmente no Supabase:
   - Tabela: `users`
   - Valores: `username: admin`, `password: <hashed_bcrypt>`, `role: admin`, `email: seu-email@example.com`

## 📊 Banco de Dados

**Tipo:** PostgreSQL (Supabase)  
**URL:** https://txzaqyaluvcbausnqpru.supabase.co  
**Conexão PG:** `postgresql://postgres:[PASSWORD]@db.txzaqyaluvcbausnqpru.supabase.co:5432/postgres`

**Tabelas:**
- `users` - Usuários com auth
- `solicitacoes` - Solicitações do público
- `status_historico` - Histórico de status das solicitações
- `obras` - Obras da cidade
- `demandas` - Demandas do público
- `estruturas_culturais` - Patrimônio cultural
- `avisos` - Avisos/alertas do admin
- `alertas_bairro` - Alertas por bairro
- `configuracoes_notificacao` - Preferências de notificação dos usuários

## 🔐 Segurança

- **RLS ativado:** Apenas service_role (backend) pode acessar
- **JWT:** Emitido pelo backend, válido por 1 hora
- **Bcrypt:** Senhas hasheadas com salt 10

## 📝 Arquivos Importantes

- `backend/src/server.js` - Entry point do backend
- `backend/src/config/supabaseClient.js` - Cliente Supabase
- `backend/.env` - Variáveis de ambiente
- `frontend/src/services/api.js` - Cliente HTTP frontend
- `CLEANUP_AND_SETUP_DB.sql` - Script SQL para limpar e criar schema

## ⚠️ Dúvidas?

1. Backend não conecta → Verifique `.env` tem as variáveis corretas
2. Tabelas não existem → Execute `CLEANUP_AND_SETUP_DB.sql` no Supabase
3. Registro falha → Verifique se backend está rodando (`npm run dev`)
4. Login falha → Confirme que o usuário foi criado na tabela `users`

---

**Última atualização:** 9 de dezembro de 2025  
**Status:** ✅ Pronto para desenvolvimento
