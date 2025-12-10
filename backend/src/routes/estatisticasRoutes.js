import express from 'express';
import { getSupabase } from '../config/supabaseClient.js';

const router = express.Router();

// SSE clients
const sseClients = new Set();
let realtimeSetup = false;

async function computeImpacto(supabase) {
  // Reuse the previous logic but encapsulated so we can call from SSE and HTTP handlers
  const [{ count: totalCount }, { data: statusData }, { data: bairroData }] = await Promise.all([
    supabase
      .from('solicitacoes')
      .select('id', { count: 'exact', head: true }),
    supabase
      .from('solicitacoes')
      .select('status'),
    supabase
      .from('solicitacoes')
      .select('bairro')
  ]);

  const countsByStatus = {};
  (statusData || []).forEach(s => {
    const key = s.status || 'Desconhecido';
    countsByStatus[key] = (countsByStatus[key] || 0) + 1;
  });

  const countsByBairro = {};
  (bairroData || []).forEach(r => {
    const b = (r.bairro || 'Sem Bairro').trim();
    if (!b) return;
    countsByBairro[b] = (countsByBairro[b] || 0) + 1;
  });
  const bairrosTop = Object.entries(countsByBairro)
    .map(([bairro, count]) => ({ bairro, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const concludedKey = Object.keys(countsByStatus).find(k => k.toLowerCase().includes('conclu'));
  const concluded = concludedKey ? countsByStatus[concludedKey] : 0;
  const completionRate = totalCount > 0 ? Math.round((concluded / totalCount) * 100) : 0;

  return {
    total: totalCount || 0,
    por_status: countsByStatus,
    concluido: concluded,
    taxa_conclusao_percent: completionRate,
    bairros_top: bairrosTop,
  };
}

async function ensureRealtimeSetup() {
  if (realtimeSetup) return;
  realtimeSetup = true;
  try {
    const supabase = getSupabase();
    const handleChange = async () => {
      try {
        const payload = await computeImpacto(supabase);
        const str = `data: ${JSON.stringify(payload)}\n\n`;
        for (const res of sseClients) {
          try { res.write(str); } catch (e) { /* ignore individual client errors */ }
        }
      } catch (e) {
        console.error('Erro ao recomputar impacto (realtime):', e?.message || e);
      }
    };

    const channel = supabase.channel('public:impacto');
    channel
      .on('postgres_changes', { event: '*', schema: 'public', table: 'solicitacoes' }, () => handleChange())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'status_historico' }, () => handleChange())
      .subscribe();

    // initial broadcast to warm clients if any
    channel.on('subscription_succeeded', () => {
      // no-op
    });
  } catch (err) {
    console.error('Erro ao configurar realtime para estatísticas:', err?.message || err);
  }
}

// Public endpoint: retorna KPIs/impacto local (contagens em tempo real)
router.get('/impacto', async (req, res) => {
  try {
    const supabase = getSupabase();
    const result = await computeImpacto(supabase);
    res.json(result);
  } catch (err) {
    console.error('Erro ao calcular estatísticas de impacto:', err?.message || err);
    res.status(500).json({ error: 'Erro ao calcular estatísticas' });
  }
});

// SSE endpoint for real-time impacto updates
router.get('/impacto/stream', async (req, res) => {
  // Headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  // Add to clients
  sseClients.add(res);
  req.on('close', () => {
    sseClients.delete(res);
  });

  // Ensure realtime subscriptions are active
  await ensureRealtimeSetup();

  try {
    const supabase = getSupabase();
    const initial = await computeImpacto(supabase);
    res.write(`data: ${JSON.stringify(initial)}\n\n`);
  } catch (e) {
    console.error('Erro ao enviar estado inicial SSE:', e?.message || e);
  }
});

export default router;
