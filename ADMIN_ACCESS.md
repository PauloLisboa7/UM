# 🔐 Acessar Painel Admin

## Credenciais de Teste

Para entrar no painel de administração, use:

```
Username: clean7
Senha: cleanwork7
```

---

## Como Acessar

### 1️⃣ Fazer Login

1. Acesse: http://localhost:5173
2. Clique em **Login/Cadastro**
3. Preencha:
   - **Username:** `clean7`
   - **Senha:** `cleanwork7`
4. Clique em **Login**

### 2️⃣ Acessar o Painel Admin

Após fazer login, você verá:

```
┌─────────────────────────────┐
│ Olá, clean7 [moldura laranja]│
└─────────────────────────────┘
```

No menu de navegação (Solicitar Reclamação | Acompanhe Aqui | ...), aparecerá uma opção nova:

```
Admin  ← NOVO LINK (em laranja)
```

Clique em **Admin** para acessar o painel de controle.

---

## Painel Admin - Recursos

Uma vez dentro do painel admin, você terá acesso a:

### 📋 Lista de Solicitações (Esquerda)
- Filtrar por status
- Visualizar número de rastreamento
- Ver resumo da descrição
- Status atual destacado

### 🔧 Detalhes e Atualização (Direita)

Clique em qualquer solicitação para ver:
- Número de rastreamento completo
- Descrição completa
- Localização (rua, número, bairro)
- CEP
- Status atual
- Data de criação

E para atualizar:
- Selecione um novo status
- Adicione uma justificativa (opcional)
- Clique em **"Atualizar Status"**

---

## Status Disponíveis

1. **Enviada/Em Análise** - Recebida e sendo analisada
2. **Repassada** - Enviada ao órgão competente
3. **Em Execução** - Serviço agendado ou em progresso
4. **Concluída** - Resolvida com sucesso ✅
5. **Rejeitada** - Não será processada ❌

---

## O Que Acontece Ao Atualizar Status?

### Automaticamente:
1. ✉️ **Email enviado** ao usuário com o novo status
2. 📊 **Histórico registrado** no banco de dados
3. 🔄 **Dashboard atualizado** na página "Acompanhe Aqui"
4. 🗺️ **Mapa atualizado** com novo status

### Email Enviado Contém:
- Novo status com emoji e cor
- Justificativa (se fornecida)
- Instruções de próximos passos
- Link direto para acompanhar

---

## 📊 Exemplo de Uso

### Cenário: Uma solicitação chega

1. Usuário cria reclamação → Email de confirmação enviado
2. Você clica em **Admin**
3. Ve a solicitação com status **"Enviada/Em Análise"**
4. Analisa a descrição e localização
5. Muda para **"Repassada"** com justificativa: "Enviado para secretaria de obras"
6. **Clica Atualizar Status**
7. Sistema envia email ao usuário: "Sua solicitação foi repassada!"

---

## ⚠️ Apenas Admin Pode:

- ✅ Acessar o painel admin
- ✅ Ver todas as solicitações
- ✅ Atualizar status
- ✅ Adicionar justificativas
- ❌ Usuários normais não veem o menu Admin

---

## 🔍 Dicas

### Buscar Rapidamente
Use o filtro de status para encontrar:
- Solicitações **pendentes**: "Enviada/Em Análise"
- Solicitações **concluídas**: "Concluída"
- Solicitações **rejeitadas**: "Rejeitada"

### Justificativas
Sempre adicione uma justificativa quando:
- **Rejeitar**: Explique por que não pode ser processada
- **Mudar status**: Informe o progresso
- **Concluir**: Descreva o que foi feito

---

## Logout

Para sair do painel:
1. Recarregue a página ou volte para Home
2. Clique em **Login/Cadastro**
3. Faça logout (se houver botão)

---

## ✅ Checklist de Acesso Admin

- [ ] Backend iniciado (`npm run dev` na pasta `backend`)
- [ ] Frontend iniciado (`npm run dev` na pasta `frontend`)
- [ ] Acesso a http://localhost:5173
- [ ] Login com `clean7` / `cleanwork7`
- [ ] Link "Admin" aparece no menu (em laranja)
- [ ] Painel admin abre com lista de solicitações
- [ ] Consegue atualizar status de uma solicitação
- [ ] Email é enviado após atualização

---

**Sucesso! Painel admin funcionando! 🎉**
