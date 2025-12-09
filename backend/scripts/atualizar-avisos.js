/**
 * Script para gerenciar avisos e alertas diários
 * Execute este script via cron job ou agendador de tarefas
 * 
 * Exemplo de uso via npm:
 * npm run atualizar-avisos
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const avisosPath = path.join(__dirname, '../../frontend/public/data/avisos-alertas.json');

// Dados de exemplo que podem ser atualizados diariamente
const avisosTemplate = {
  avisos: [
    {
      id: 1,
      tipo: 'trânsito',
      titulo: 'Alteração no Trânsito - Av. Getúlio Vargas',
      descricao: 'Obras de reparo causarão bloqueio total na Avenida Getúlio Vargas até amanhã às 18h. Utilize vias alternativas.',
      data: new Date().toISOString(),
      icon: '🚗',
      status: 'urgente',
      localidade: 'Centro',
    },
    {
      id: 2,
      tipo: 'clima',
      titulo: 'Alerta de Chuva Forte',
      descricao: 'Previsão de chuvas fortes e possíveis tempestades entre 14h e 20h. Evite áreas alagáveis.',
      data: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      icon: '⛈️',
      status: 'alerta',
      localidade: 'São Luís',
    },
    {
      id: 3,
      tipo: 'coleta',
      titulo: `Cronograma de Coleta - Semana de ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}`,
      descricao: 'Segunda a Sexta: Coleta comum às 6h da manhã. Sábado: Coleta de recicláveis às 7h.',
      data: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      icon: '♻️',
      status: 'informação',
      localidade: 'Toda a cidade',
    },
    {
      id: 4,
      tipo: 'manutenção',
      titulo: 'Manutenção da Iluminação Pública',
      descricao: 'Equipes trabalharão na iluminação da Rua das Flores. Possível falta de energia entre 22h e 23h.',
      data: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
      icon: '💡',
      status: 'aviso',
      localidade: 'Praia Grande',
    },
  ],
  ultimaAtualizacao: new Date().toISOString(),
  proximaAtualizacao: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
};

function atualizarAvisos() {
  try {
    // Criar diretório se não existir
    const dir = path.dirname(avisosPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Escrever dados no arquivo
    fs.writeFileSync(avisosPath, JSON.stringify(avisosTemplate, null, 2));
    console.log('✅ Avisos atualizados com sucesso em:', avisosPath);
    console.log('📅 Data da atualização:', new Date().toLocaleString('pt-BR'));
  } catch (error) {
    console.error('❌ Erro ao atualizar avisos:', error);
    process.exit(1);
  }
}

atualizarAvisos();
