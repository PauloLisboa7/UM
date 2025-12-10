# Implantação no Vercel - Projeto UM

## Configuração da Implantação

Este projeto está configurado para implantação no Vercel com frontend (Vite/React) e backend (Express/Node.js).

## Pré-requisitos

1. Conta no Vercel (https://vercel.com)
2. Conta no GitHub conectada ao Vercel
3. Variáveis de ambiente configuradas no Supabase

## Variáveis de Ambiente Necessárias

Configure estas variáveis de ambiente no painel do Vercel:

### Backend
- `SUPABASE_URL` - URL do seu projeto Supabase
- `SUPABASE_ANON_KEY` - Chave anônima do Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - Chave de service role do Supabase
- `JWT_SECRET` - Chave secreta para JWT (gere uma senha forte)
- `PORT` - Porta do servidor (deixe vazio para usar padrão do Vercel)

### Frontend (se necessário)
- `VITE_API_URL` - URL da API do backend (será gerada pelo Vercel)
- `VITE_SUPABASE_URL` - URL do Supabase
- `VITE_SUPABASE_ANON_KEY` - Chave anônima do Supabase

## Passos para Implantação

### Opção 1: Via Dashboard do Vercel

1. Acesse https://vercel.com/new
2. Importe o repositório GitHub: `https://github.com/PauloLisboa7/UM`
3. Configure o projeto:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (raiz do projeto)
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/dist`
   - **Install Command**: `npm install`

4. Adicione as variáveis de ambiente na aba "Environment Variables"
5. Clique em "Deploy"

### Opção 2: Via CLI do Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Navegar para o diretório do projeto
cd c:\Users\senac\Music\UM

# Implantar
vercel

# Para produção
vercel --prod
```

## Configuração do Backend no Vercel

O backend Express está configurado como Serverless Functions no Vercel. Todas as rotas `/api/*` serão redirecionadas para o backend.

## Configuração do Frontend

O frontend Vite será compilado e servido como site estático pelo Vercel.

## Pós-Implantação

Após a implantação:

1. Anote a URL gerada pelo Vercel (ex: `https://um-xxxx.vercel.app`)
2. Configure o CORS no backend se necessário
3. Atualize a URL da API no frontend se estiver usando configuração dinâmica
4. Teste todas as funcionalidades

## Problemas Comuns

### Erro 404 em rotas da API
- Verifique se o `vercel.json` está configurado corretamente
- Certifique-se de que as rotas começam com `/api`

### Erro de CORS
- Configure o CORS no backend para aceitar a URL do Vercel
- Adicione a URL do frontend nas origens permitidas

### Variáveis de ambiente não carregadas
- Verifique se todas as variáveis estão configuradas no Vercel
- Reinicie a implantação após adicionar novas variáveis

## Atualizações

Sempre que fizer push para a branch `save-ui-updates`, o Vercel irá automaticamente:
1. Detectar as mudanças
2. Compilar o projeto
3. Implantar a nova versão

## Suporte

Para mais informações sobre implantação no Vercel:
- Documentação: https://vercel.com/docs
- Suporte: https://vercel.com/support
