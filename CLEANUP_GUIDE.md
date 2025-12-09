# Limpeza do Projeto - Remover Funcionalidades Antigas

Para manter seu projeto limpo com apenas as novas funcionalidades no Neon, você pode **opcionalmente** remover os seguintes arquivos:

## ⚙️ Arquivos que Podem Ser Deletados

### Modelos (que usam tabelas antigas)
```
backend/src/models/demandaModel.js      # Tabela 'demandas' não existe
backend/src/models/obraModel.js         # Tabela 'obras' não existe
backend/src/models/estruturaModel.js    # Tabela 'estruturas_culturais' não existe
```

### Controllers (que usam modelos antigos)
```
backend/src/controllers/demandaController.js      # Usa demandaModel
backend/src/controllers/obraControler.js          # Usa obraModel
backend/src/controllers/estruturaController.js    # Usa estruturaModel
```

### Routes (que usam controllers antigos)
```
backend/src/routes/demandaRoutes.js      # Usa demandaController
backend/src/routes/obraRoutes.js         # Usa obraController
backend/src/routes/estruturaRoutes.js    # Usa estruturaController
```

### Scripts (que usam tabelas antigas)
```
backend/scripts/upsert-admin.js          # Script de admin antigo
backend/populate-estruturas.js           # Popula tabela antiga
backend/populate-obras.js                # Popula tabela antiga
backend/create-tables.js                 # Cria tabelas antigas
backend/create-tables.sql                # SQL das tabelas antigas
```

## ✅ Arquivos que Devem Ser Mantidos

### Essencial
```
backend/src/config/db.js                 # Conexão com Neon ✓
backend/src/models/userModel.js          # Operações com users ✓
backend/src/controllers/authController.js # Autenticação ✓
backend/src/routes/authRoutes.js         # Routes de auth ✓
```

### Novo Sistema de Solicitações
```
backend/src/models/solicitacaoModel.js        # Novo ✓
backend/src/controllers/solicitacaoController.js # Novo ✓
backend/src/routes/solicitacaoRoutes.js        # Novo ✓
backend/src/services/emailService.js           # Emails ✓
```

### Configuração
```
backend/src/server.js                    # Server principal ✓
backend/package.json                     # Dependências ✓
backend/.env                             # Variáveis de ambiente ✓
```

## 🗑️ Como Deletar (Comando PowerShell)

```powershell
# Ir para o diretório backend
cd backend

# Remover modelos antigos
Remove-Item src/models/demandaModel.js -Force
Remove-Item src/models/obraModel.js -Force
Remove-Item src/models/estruturaModel.js -Force

# Remover controllers antigos
Remove-Item src/controllers/demandaController.js -Force
Remove-Item src/controllers/obraControler.js -Force
Remove-Item src/controllers/estruturaController.js -Force

# Remover routes antigas
Remove-Item src/routes/demandaRoutes.js -Force
Remove-Item src/routes/obraRoutes.js -Force
Remove-Item src/routes/estruturaRoutes.js -Force

# Remover scripts antigos
Remove-Item scripts/upsert-admin.js -Force
Remove-Item populate-estruturas.js -Force
Remove-Item populate-obras.js -Force
Remove-Item create-tables.js -Force
Remove-Item create-tables.sql -Force
```

## ⚠️ Antes de Deletar

1. **Faça backup** dos arquivos em caso de precisar deles depois
2. **Certifique-se** de que não há imports deles em nenhum outro arquivo
3. **Teste a aplicação** depois das mudanças

## 🔍 Verificar se há imports residuais

```bash
# Procurar por imports dos arquivos deletados
grep -r "demandaModel\|obraModel\|estruturaModel" backend/src/
grep -r "demandaController\|obraController\|estruturaController" backend/src/
grep -r "demandaRoutes\|obraRoutes\|estruturaRoutes" backend/src/
```

Se não retornar nada, está seguro para deletar!

## ✨ Benefícios da Limpeza

- 📦 Projeto menor e mais organizado
- 🚀 Menos código = menos bugs potenciais
- 🔒 Superfície de ataque menor
- 📖 Mais fácil de entender (apenas código ativo)
- 🎯 Menos confusão entre código novo e antigo

## 🔄 Se Precisar das Funcionalidades Antigas Depois

Você tem o histórico no Git, então pode recuperar os arquivos quando precisar:

```bash
# Ver histórico
git log --oneline

# Recuperar arquivo deletado
git restore backend/src/models/obraModel.js
```
