# 🚀 Teste Rápido - Como Entrar no Painel Admin

## ⚡ 5 Passos Rápidos

### 1️⃣ Criar o Usuário Admin

```bash
cd backend
npm run create-admin
```

Você verá:
```
✅ Usuário admin criado com sucesso!
Username: clean7
Senha: cleanwork7
```

---

### 2️⃣ Iniciar Backend

```bash
# Terminal 1 - Backend
cd backend
npm run dev
```

Espere ver:
```
Servidor rodando na porta 5000
```

---

### 3️⃣ Iniciar Frontend

```bash
# Terminal 2 - Frontend
cd frontend
npm run dev
```

---

### 4️⃣ Fazer Login

1. Acesse: http://localhost:5173
2. Clique em **Login/Cadastro**
3. Preencha:
   ```
   Username: clean7
   Senha: cleanwork7
   ```
4. Clique em **Login**

---

### 5️⃣ Acessar Painel Admin

Após login, você verá no menu:

```
Solicitar Reclamação | Acompanhe Aqui | ... | Admin ← CLIQUE AQUI
                                             (em laranja)
```

---

## ✨ Pronto!

Você está agora no **Painel de Administração** onde pode:

- 📋 Ver todas as solicitações
- 🔄 Mudar status de solicitações
- 📝 Adicionar justificativas
- 📧 Enviar emails automaticamente

---

## 📸 O que Você Verá

### Canto Direito Superior:
```
┌──────────────────────────┐
│ Olá, clean7 [moldura🟠]  │
└──────────────────────────┘
```

### Painel Admin (2 colunas):

**Esquerda - Lista:**
```
┌─────────────────────┐
│ Solicitações        │
├─────────────────────┤
│ Status: Todos ▼     │
│                     │
│ SOL-123456-ABC      │
│ Descrição...        │
│ [Status]            │
│                     │
│ SOL-789012-DEF      │
│ Descrição...        │
│ [Status]            │
└─────────────────────┘
```

**Direita - Detalhes:**
```
┌──────────────────────┐
│ Número: SOL-123-ABC  │
│ Descrição: ...       │
│ Localização: ...     │
│                      │
│ Novo Status: [▼]     │
│ Justificativa: [...]│
│                      │
│ [Atualizar Status]   │
└──────────────────────┘
```

---

## 🎯 Próximos Testes

### Teste 1: Criar uma Solicitação
1. Faça logout (refreshar página)
2. Login com **qualquer usuário** (ou cadastre um novo)
3. Clique em "Solicitar Reclamação"
4. Preencha o formulário
5. Clique no mapa para marcar localização
6. Clique "Enviar"
7. Note o **número de rastreamento**

### Teste 2: Ver no Admin
1. Faça logout
2. Login com **clean7 / cleanwork7**
3. Clique em "Admin"
4. Você verá a solicitação que criou

### Teste 3: Mudar Status
1. Selecione a solicitação
2. Mude o status para "Concluída"
3. Adicione justificativa: "Serviço realizado!"
4. Clique "Atualizar Status"
5. Veja a mensagem de sucesso

---

## ⚠️ Se Algo Não Funcionar

### Admin não aparece no menu?
- [ ] Você fez login com clean7?
- [ ] O usuário tem `role = 'admin'`?
- [ ] Tente recarregar a página (F5)

### Erro ao criar admin?
- [ ] `.env` está configurado?
- [ ] NEON_DATABASE_URL está correto?
- [ ] Tabelas foram criadas no Neon?

### Solicitações não aparecem?
- [ ] Você criou alguma solicitação?
- [ ] O backend está rodando?
- [ ] Veja o console do navegador (F12)

---

## 📞 Documentação Completa

Para mais detalhes, consulte:

- **`ADMIN_ACCESS.md`** - Guia completo do painel admin
- **`CREATE_ADMIN_USER.md`** - Como criar o usuário admin
- **`IMPLEMENTACOES_COMPLETAS.md`** - Resumo de tudo que foi feito
- **`EMAIL_SETUP.md`** - Configurar emails

---

**Sucesso! 🎉 Painel admin pronto para testar!**
