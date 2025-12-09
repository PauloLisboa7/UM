# Arquitetura Nova - Apenas Novas Funcionalidades

## 📊 Estrutura do Banco de Dados (Neon)

```
┌─────────────────────────────────────────┐
│         Neon PostgreSQL Database        │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ users                            │  │
│  │ ─────────────────────────────────│  │
│  │ id (PK)                          │  │
│  │ username (UNIQUE)                │  │
│  │ password                         │  │
│  │ role (user, admin)               │  │
│  │ email                            │  │
│  │ created_at, updated_at           │  │
│  └──────────────────────────────────┘  │
│              ↓                          │
│  ┌──────────────────────────────────┐  │
│  │ solicitacoes                     │  │
│  │ ─────────────────────────────────│  │
│  │ id (PK)                          │  │
│  │ user_id (FK → users)             │  │
│  │ numero_rastreamento (UNIQUE)     │  │
│  │ descricao                        │  │
│  │ cep, bairro, rua, numero         │  │
│  │ latitude, longitude              │  │
│  │ fotos_urls []                    │  │
│  │ status (5 estados)               │  │
│  │ orgao_competente, justificativa  │  │
│  │ created_at, updated_at           │  │
│  └──────────────────────────────────┘  │
│              ↓                          │
│  ┌──────────────────────────────────┐  │
│  │ status_historico                 │  │
│  │ ─────────────────────────────────│  │
│  │ id (PK)                          │  │
│  │ solicitacao_id (FK)              │  │
│  │ status_anterior                  │  │
│  │ status_novo                      │  │
│  │ orgao_competente                 │  │
│  │ justificativa                    │  │
│  │ created_at                       │  │
│  └──────────────────────────────────┘  │
│              ↓                          │
│  ┌──────────────────────────────────┐  │
│  │ notificacoes                     │  │
│  │ ─────────────────────────────────│  │
│  │ id (PK)                          │  │
│  │ user_id (FK → users)             │  │
│  │ solicitacao_id (FK)              │  │
│  │ mensagem                         │  │
│  │ lida (boolean)                   │  │
│  │ created_at                       │  │
│  └──────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

## 🏗️ Arquitetura da API

```
┌────────────────────────────────────────────────────┐
│          Frontend (React/Vite)                     │
│  ┌────────────────────────────────────────────┐  │
│  │ Home.jsx → ComoUsar.jsx                    │  │
│  │   ├─ SolicitarReclamacao (POST)            │  │
│  │   ├─ PainelAcompanhamento (GET)            │  │
│  │   └─ MapaOcorrenciasPublico (GET)          │  │
│  └────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────┘
                     ↓ (API Calls)
┌────────────────────────────────────────────────────┐
│          Backend Express Server                    │
├────────────────────────────────────────────────────┤
│                                                    │
│  ┌─────────────────────────────────────────────┐ │
│  │ Autenticação (/api/auth)                    │ │
│  │ ├─ POST /login → JWT Token                  │ │
│  │ └─ POST /register → Novo usuário + Email    │ │
│  └─────────────────────────────────────────────┘ │
│                                                    │
│  ┌─────────────────────────────────────────────┐ │
│  │ Solicitações (/api/solicitacoes)            │ │
│  │ ├─ POST / → Nova solicitação + Email        │ │
│  │ ├─ GET /rastreamento/:num → Buscar pública  │ │
│  │ ├─ GET /minhas-solicitacoes → Minhas        │ │
│  │ ├─ GET /publicas/todas → Mapa              │ │
│  │ ├─ PUT /:id/status → Atualizar (Admin)      │ │
│  │ └─ GET /:id/historico → Histórico          │ │
│  └─────────────────────────────────────────────┘ │
│                                                    │
│  ┌─────────────────────────────────────────────┐ │
│  │ Serviços                                     │ │
│  │ ├─ emailService.js (Nodemailer)             │ │
│  │ └─ authMiddleware.js (JWT validation)       │ │
│  └─────────────────────────────────────────────┘ │
│                                                    │
│  ┌─────────────────────────────────────────────┐ │
│  │ Modelos (Database Layer)                    │ │
│  │ ├─ userModel.js                             │ │
│  │ └─ solicitacaoModel.js                      │ │
│  └─────────────────────────────────────────────┘ │
│                                                    │
└────────────────────────────────────────────────────┘
                     ↓ (pg queries)
┌────────────────────────────────────────────────────┐
│         Neon PostgreSQL Database                   │
│  ├─ users                                          │
│  ├─ solicitacoes                                   │
│  ├─ status_historico                              │
│  └─ notificacoes                                   │
└────────────────────────────────────────────────────┘
```

## 📋 Fluxo de Dados - Criar Solicitação

```
1. Usuário preenche formulário
   ↓
2. Frontend: SolicitarReclamacao.jsx
   - Validação de campos
   - CEP → ViaCEP (autofill rua)
   - CEP → Nominatim (atualizar mapa)
   - Upload de fotos
   - Marca local no mapa
   ↓
3. POST /api/solicitacoes
   ↓
4. Backend: solicitacaoController.criar()
   - Validação de obrigatoriedade
   - solicitacaoModel.criar()
     - Gera numero_rastreamento único
     - INSERT em solicitacoes
   - Busca email do user
   - enviarEmailConfirmacaoSolicitacao()
   ↓
5. Frontend recebe resposta
   - Mostra numero_rastreamento
   - Salva em localStorage
   ↓
6. Usuário recebe email
   - Status: "Enviada/Em Análise"
   - Número de rastreamento
   - Link para acompanhar
```

## 📊 Fluxo de Dados - Acompanhar Solicitação

```
1. Usuário digita numero_rastreamento
   ↓
2. Frontend: PainelAcompanhamento.jsx
   - Busca número digitado
   ↓
3. GET /api/solicitacoes/rastreamento/:numero
   (Público - sem autenticação)
   ↓
4. Backend: solicitacaoController.buscarPorRastreamento()
   - solicitacaoModel.buscarPorRastreamento()
     - SELECT * FROM solicitacoes WHERE numero_rastreamento = $1
   - solicitacaoModel.buscarHistorico()
     - SELECT * FROM status_historico WHERE solicitacao_id = $1
   ↓
5. Frontend mostra
   - Status atual (com cor)
   - Timeline de mudanças
   - Detalhes completos
   - Órgão responsável
```

## 🗺️ Fluxo de Dados - Mapa Público

```
1. Usuário acessa aba "Mapa de Ocorrências"
   ↓
2. Frontend: MapaOcorrenciasPublico.jsx
   - Leaflet map inicializado
   ↓
3. GET /api/solicitacoes/publicas/todas
   ↓
4. Backend: solicitacaoController.listarTodas()
   - solicitacaoModel.listarTodas(true)
     - SELECT id, descricao, latitude, longitude, status, numero_rastreamento, created_at, bairro, rua
     - FROM solicitacoes
     - WHERE anonima = false
     ↓
5. Frontend renderiza
   - Marcadores coloridos por status
   - Filtro por status
   - Pop-ups com detalhes
   - Links para acompanhar
```

## 🔐 Fluxo de Autenticação

```
Registro:
  POST /api/auth/register
  → userModel.createUser()
  → bcrypt.hash(password)
  → INSERT users
  → enviarEmailBoasVindas()

Login:
  POST /api/auth/login
  → userModel.getUserByUsername()
  → bcrypt.compare(password)
  → jwt.sign() → Token
  → Frontend salva em localStorage

Requisições autenticadas:
  Header: Authorization: Bearer <token>
  → authMiddleware valida JWT
  → req.user setado com dados do token
```

## 📁 Estrutura de Arquivos Ativa

```
backend/
├── src/
│   ├── config/
│   │   └── db.js          ← Neon PostgreSQL (pg)
│   ├── controllers/
│   │   ├── authController.js      ✓
│   │   └── solicitacaoController.js ✓
│   ├── middleware/
│   │   └── authMiddleware.js      ✓
│   ├── models/
│   │   ├── userModel.js           ✓
│   │   └── solicitacaoModel.js    ✓
│   ├── routes/
│   │   ├── authRoutes.js          ✓
│   │   └── solicitacaoRoutes.js   ✓
│   ├── services/
│   │   └── emailService.js        ✓
│   └── server.js                  ✓
├── .env                           ✓
├── package.json                   ✓
└── API_DOCS.md                    ✓
```

## 🔄 Eliminado (Não Usar)

```
❌ demandas (tabela)
❌ obras (tabela)
❌ estruturas_culturais (tabela)
❌ demandaModel.js
❌ obraModel.js
❌ estruturaModel.js
❌ demandaController.js
❌ obraController.js
❌ estruturaController.js
❌ demandaRoutes.js
❌ obraRoutes.js
❌ estruturaRoutes.js
```

## 🚀 Deploy Checklist

- [ ] Neon account criada
- [ ] Banco de dados criado
- [ ] Tabelas criadas (SQL executado)
- [ ] `.env` configurado com NEON_DATABASE_URL
- [ ] EMAIL_USER e EMAIL_PASSWORD configurados
- [ ] `npm run dev` executa sem erros
- [ ] Pode fazer login
- [ ] Pode criar solicitação
- [ ] Pode acompanhar solicitação
- [ ] Pode visualizar mapa
- [ ] Emails sendo enviados
