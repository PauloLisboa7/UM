// ...existing code...
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import solicitacaoRoutes from "./routes/solicitacaoRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { db } from "./config/db.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/solicitacoes", solicitacaoRoutes);
app.use("/api/admin", adminRoutes);

// Rotas de exemplo
app.get("/", (req, res) => {
  res.send("API da Plataforma de Transparência está rodando 🚀");
});

// Função para testar conexão com o Neon (tenta ler 1 registro da tabela 'users')
async function testarConexaoDB() {
  try {
    const result = await db.query('SELECT id FROM users LIMIT 1');
    console.log('Neon: conexão verificada (consulta de teste OK).');
    return true;
  } catch (err) {
    console.error('Erro ao testar Neon:', err.message);
    return false;
  }
}

// Porta do servidor
const PORT = process.env.PORT || 5000;

// Inicia o servidor após tentar verificar a conexão com o DB (não bloqueante em caso de falha)
(async () => {
  const ok = await testarConexaoDB();
  if (!ok) {
    console.warn('Aviso: não foi possível verificar o Neon na inicialização. Se as variáveis de ambiente estiverem corretas, verifique a conectividade da rede e a URL de conexão. O servidor continuará inicializando.');
  }

  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
})();
// ...existing code...