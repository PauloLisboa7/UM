# API Backend - Documentação de Endpoints

## 🔐 Autenticação

### POST /api/auth/login
Fazer login com usuário e senha

**Request:**
```json
{
  "username": "user",
  "password": "user123"
}
```

**Response:**
```json
{
  "token": "eyJhbGc...",
  "role": "user"
}
```

---

### POST /api/auth/register
Registrar novo usuário

**Request:**
```json
{
  "username": "novo_user",
  "password": "senha123",
  "email": "novo@email.com"
}
```

**Response:**
```json
{
  "message": "Usuário criado",
  "user": {
    "id": 1,
    "username": "novo_user",
    "email": "novo@email.com",
    "role": "user"
  }
}
```

---

## 📋 Solicitações (Reclamações)

### POST /api/solicitacoes
Criar nova solicitação de reclamação

**Headers:**
```
Authorization: Bearer <seu-token>
```

**Request:**
```json
{
  "descricao": "Buraco na rua",
  "cep": "65020-360",
  "bairro": "Centro",
  "rua": "Rua do Comércio",
  "numero": "123",
  "latitude": -2.5349,
  "longitude": -44.3050,
  "fotos_urls": ["https://..."]
}
```

**Response:**
```json
{
  "message": "Solicitação criada com sucesso",
  "solicitacao": {
    "id": 1,
    "numero_rastreamento": "SOL-1702076400000-ABC123XYZ",
    "status": "Enviada/Em Análise",
    "created_at": "2024-12-08T10:00:00Z"
  }
}
```

---

### GET /api/solicitacoes/rastreamento/:numeroRastreamento
Buscar solicitação por número de rastreamento (público)

**Response:**
```json
{
  "solicitacao": {
    "id": 1,
    "numero_rastreamento": "SOL-1702076400000-ABC123XYZ",
    "descricao": "Buraco na rua",
    "status": "Em Execução/Serviço Agendado",
    "cep": "65020-360",
    "bairro": "Centro",
    "rua": "Rua do Comércio",
    "latitude": -2.5349,
    "longitude": -44.3050
  },
  "historico": [
    {
      "status_anterior": "Enviada/Em Análise",
      "status_novo": "Repassada ao Órgão Competente",
      "orgao_competente": "Prefeitura de São Luís",
      "created_at": "2024-12-08T12:00:00Z"
    }
  ]
}
```

---

### GET /api/solicitacoes/minhas-solicitacoes
Listar solicitações do usuário logado

**Headers:**
```
Authorization: Bearer <seu-token>
```

**Response:**
```json
{
  "solicitacoes": [
    {
      "id": 1,
      "numero_rastreamento": "SOL-1702076400000-ABC123XYZ",
      "descricao": "Buraco na rua",
      "status": "Em Execução/Serviço Agendado",
      "created_at": "2024-12-08T10:00:00Z"
    }
  ]
}
```

---

### GET /api/solicitacoes/publicas/todas
Listar todas as solicitações públicas (para o mapa)

**Response:**
```json
{
  "solicitacoes": [
    {
      "id": 1,
      "numero_rastreamento": "SOL-1702076400000-ABC123XYZ",
      "descricao": "Buraco na rua",
      "status": "Em Execução/Serviço Agendado",
      "latitude": -2.5349,
      "longitude": -44.3050,
      "bairro": "Centro",
      "rua": "Rua do Comércio",
      "created_at": "2024-12-08T10:00:00Z"
    }
  ]
}
```

---

### PUT /api/solicitacoes/:id/status
Atualizar status da solicitação (apenas admin)

**Headers:**
```
Authorization: Bearer <seu-token-admin>
```

**Request:**
```json
{
  "novoStatus": "Em Execução/Serviço Agendado",
  "orgaoCompetente": "Prefeitura de São Luís",
  "justificativa": "Serviço agendado para próxima semana"
}
```

**Response:**
```json
{
  "message": "Status atualizado com sucesso",
  "solicitacao": {
    "id": 1,
    "numero_rastreamento": "SOL-1702076400000-ABC123XYZ",
    "status": "Em Execução/Serviço Agendado"
  }
}
```

---

### GET /api/solicitacoes/:id/historico
Obter histórico de mudanças de status

**Response:**
```json
{
  "historico": [
    {
      "id": 1,
      "solicitacao_id": 1,
      "status_anterior": "Enviada/Em Análise",
      "status_novo": "Repassada ao Órgão Competente",
      "orgao_competente": "Prefeitura de São Luís",
      "created_at": "2024-12-08T12:00:00Z"
    },
    {
      "id": 2,
      "solicitacao_id": 1,
      "status_anterior": "Repassada ao Órgão Competente",
      "status_novo": "Em Execução/Serviço Agendado",
      "orgao_competente": "Prefeitura de São Luís",
      "created_at": "2024-12-09T08:00:00Z"
    }
  ]
}
```

---

## 📊 Status Disponíveis

- `Enviada/Em Análise` - Solicitação recebida e em análise
- `Repassada ao Órgão Competente` - Encaminhada ao órgão responsável
- `Em Execução/Serviço Agendado` - Serviço agendado ou em andamento
- `Concluída/Resolvida` - Problema resolvido ✅
- `Rejeitada` - Solicitação rejeitada ❌

---

## 🔄 Fluxo de Uso

### 1. Usuário cria solicitação
```
POST /api/solicitacoes
→ Recebe numero_rastreamento
→ Email de confirmação enviado
```

### 2. Usuário acompanha
```
GET /api/solicitacoes/rastreamento/:numeroRastreamento
→ Vê status atual e histórico
```

### 3. Admin atualiza status
```
PUT /api/solicitacoes/:id/status
→ Email de atualização enviado ao usuário
```

### 4. Todos podem ver no mapa
```
GET /api/solicitacoes/publicas/todas
→ Mostra todas as solicitações não-anônimas
```

---

## 🚀 Como Usar (Exemplo)

### 1. Registrar usuário
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"paulo","password":"123456","email":"paulo@email.com"}'
```

### 2. Fazer login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"paulo","password":"123456"}'
```

Salve o `token` retornado.

### 3. Criar solicitação
```bash
curl -X POST http://localhost:5000/api/solicitacoes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "descricao":"Buraco na rua",
    "cep":"65020-360",
    "bairro":"Centro",
    "rua":"Rua do Comércio",
    "numero":"123",
    "latitude":-2.5349,
    "longitude":-44.3050
  }'
```

Anote o `numero_rastreamento`.

### 4. Acompanhar solicitação
```bash
curl http://localhost:5000/api/solicitacoes/rastreamento/SOL-1702076400000-ABC123XYZ
```

---

## ⚠️ Funcionalidades Descontinuadas

As seguintes rotas **NÃO existem mais** no Neon:
- ❌ `/api/demandas/*` - Removido
- ❌ `/api/obras/*` - Removido
- ❌ `/api/estruturas/*` - Removido

Veja `DEPRECATED.md` para mais informações.

---

## 📧 Emails Automáticos

O sistema envia emails automaticamente em:

1. **Confirmação de Solicitação** - Quando cria solicitação
2. **Atualização de Status** - Quando admin atualiza status

Configure `EMAIL_USER` e `EMAIL_PASSWORD` no `.env` para ativar.

---

## 🔒 Autenticação

Todos os endpoints de escrita (`POST`, `PUT`) requerem:
- Token JWT no header `Authorization: Bearer <token>`
- Token obtido via `/api/auth/login`

Endpoints de leitura pública não requerem autenticação.
