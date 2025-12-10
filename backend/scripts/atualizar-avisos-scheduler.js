import { atualizarAvisos } from './atualizar-avisos.js';

// Interval in milliseconds (30 minutes)
const INTERVAL_MS = 30 * 60 * 1000;

console.log('Iniciando scheduler de avisos: atualiza a cada 30 minutos');

// Run immediately, then on interval
(async () => {
  try {
    await atualizarAvisos();
  } catch (err) {
    console.error('Erro na atualização inicial dos avisos:', err);
  }

  const timer = setInterval(async () => {
    try {
      await atualizarAvisos();
    } catch (err) {
      console.error('Erro ao atualizar avisos (interval):', err);
    }
  }, INTERVAL_MS);

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('Scheduler recebendo SIGINT — encerrando.');
    clearInterval(timer);
    process.exit(0);
  });
  process.on('SIGTERM', () => {
    console.log('Scheduler recebendo SIGTERM — encerrando.');
    clearInterval(timer);
    process.exit(0);
  });
})();
