# ⚠️ ARQUIVOS DEPRECATED (Não usar com Neon)

Os seguintes arquivos fazem parte das funcionalidades antigas (página 3 antiga) e **NÃO devem ser usados** com o banco de dados Neon:

## Arquivos Descontinuados

### Models (Não converter para Neon)
- ❌ `src/models/demandaModel.js` - Tabela 'demandas' não existe no Neon
- ❌ `src/models/obraModel.js` - Tabela 'obras' não existe no Neon
- ❌ `src/models/estruturaModel.js` - Tabela 'estruturas_culturais' não existe no Neon

### Controllers (Não usar com Neon)
- ❌ `src/controllers/demandaController.js` - Funcionalidade antiga
- ❌ `src/controllers/obraControler.js` - Funcionalidade antiga (note o typo: "Controler")
- ❌ `src/controllers/estruturaController.js` - Funcionalidade antiga

### Routes (Não registrar no server.js)
- ❌ `src/routes/demandaRoutes.js` - Não importar no server.js
- ❌ `src/routes/obraRoutes.js` - Não importar no server.js
- ❌ `src/routes/estruturaRoutes.js` - Não importar no server.js

### Scripts (Não executar)
- ❌ `scripts/upsert-admin.js` - Usa tabelas antigas
- ❌ `populate-estruturas.js` - Usa tabelas antigas
- ❌ `populate-obras.js` - Usa tabelas antigas
- ❌ `create-tables.js` - Usa tabelas antigas
- ❌ `create-tables.sql` - Usa tabelas antigas

## Arquivos Ativos (Use apenas estes)

### Funções que você pode usar:

✅ **Autenticação:**
- `src/routes/authRoutes.js` - Login e registro
- `src/controllers/authController.js` - Lógica de autenticação
- `src/models/userModel.js` - Operações com users

✅ **Solicitações (Novas):**
- `src/routes/solicitacaoRoutes.js` - Endpoints de solicitação
- `src/controllers/solicitacaoController.js` - Lógica de solicitação
- `src/models/solicitacaoModel.js` - Operações com solicitações

✅ **Email:**
- `src/services/emailService.js` - Envio de emails

## Por que remover?

Ao usar Neon com apenas as novas funcionalidades:
- 🎯 Banco de dados limpo e organizado
- 📊 Apenas as tabelas necessárias
- ⚡ Performance melhorada
- 🔒 Segurança: menos código = menos vulnerabilidades

## Se precisar das antigas funcionalidades no futuro

Se você quiser adicionar as funcionalidades antigas de novo:

1. Crie as tabelas no Neon:
   - demandas
   - obras
   - estruturas_culturais

2. Reconverta os models para usar `pg`:
   - demandaModel.js
   - obraModel.js
   - estruturaModel.js

3. Re-importe as rotas no server.js

4. Os controllers já estão prontos, apenas ajuste conforme necessário

## Migração de Dados

Se você tem dados antigos no Supabase que quer migrar para Neon:

```bash
# Exportar apenas as novas tabelas do Supabase
pg_dump --table=users --table=solicitacoes --table=status_historico \
  "supabase-connection-string" > dados-novos.sql

# Importar no Neon
psql "neon-connection-string" < dados-novos.sql
```
