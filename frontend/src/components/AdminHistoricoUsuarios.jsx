import { useState, useEffect } from 'react';
import api from '../services/api';

const STATUS_OPTIONS = [
  'Enviada/Em Análise',
  'Repassada',
  'Em Execução',
  'Concluída',
  'Rejeitada'
];

export default function AdminHistoricoUsuarios() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [logins, setLogins] = useState([]);
  const [loadingLogins, setLoadingLogins] = useState(false);
  const [activeTab, setActiveTab] = useState('solicitacoes'); // 'solicitacoes' or 'logins'
  const [error, setError] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroBairro, setFiltroBairro] = useState('');
  const [searchUsuario, setSearchUsuario] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    carregarSolicitacoes();
    carregarLogins();

    // Listeners para atualizações em tempo real disparadas pelo admin
    const onUpdated = (e) => {
      const updated = e?.detail;
      if (!updated) return;
      setSolicitacoes(prev => {
        const found = prev.find(p => p.id === updated.id);
        if (found) return prev.map(p => p.id === updated.id ? { ...p, ...updated } : p);
        // se não encontrado, adicionar no topo
        return [updated, ...prev];
      });
      // Recarrega estatísticas se necessário
    };

    const onDeleted = (e) => {
      const id = e?.detail?.id;
      if (!id) return;
      setSolicitacoes(prev => prev.filter(p => p.id !== id));
    };

    window.addEventListener('solicitacao:updated', onUpdated);
    window.addEventListener('solicitacao:deleted', onDeleted);

    return () => {
      window.removeEventListener('solicitacao:updated', onUpdated);
      window.removeEventListener('solicitacao:deleted', onDeleted);
    };
  }, []);

  const carregarSolicitacoes = async () => {
    setLoading(true);
    try {
      const response = await api.get('/solicitacoes/admin/listar');
      setSolicitacoes(response.data.solicitacoes || []);
      setError('');
    } catch (err) {
      console.error('Erro ao carregar histórico:', err);
      // Aceitar lista vazia se houver erro
      setSolicitacoes([]);
      setError('');
    } finally {
      setLoading(false);
    }
  };

  const carregarLogins = async () => {
    setLoadingLogins(true);
    try {
      const response = await api.get('/admin/logins');
      setLogins(response.data.logins || []);
    } catch (err) {
      console.error('Erro ao carregar logins:', err);
      setLogins([]);
    } finally {
      setLoadingLogins(false);
    }
  };

  const deletarLogin = async (id) => {
    if (!window.confirm('Deseja realmente deletar este evento de login?')) return;
    try {
      await api.delete(`/admin/logins/${id}`);
      setLogins(prev => prev.filter(l => l.id !== id));
    } catch (err) {
      console.error('Erro ao deletar login:', err);
      alert('Erro ao deletar login: ' + (err.response?.data?.error || err.message));
    }
  };

  const [showSolicitacoesModal, setShowSolicitacoesModal] = useState(false);
  const [modalSolicitacoes, setModalSolicitacoes] = useState([]);

  const abrirSolicitacoesUsuario = async (userId) => {
    if (!userId) return alert('Usuário desconhecido');
    try {
      const resp = await api.get(`/admin/usuarios/${userId}/solicitacoes`);
      const solicitacoesUsuario = resp.data.solicitacoes || [];

      // Para cada solicitação, buscar histórico detalhado (se necessário)
      const solicitacoesComHistorico = await Promise.all(solicitacoesUsuario.map(async (s) => {
        try {
          const h = await api.get(`/solicitacoes/${s.id}/historico`);
          return { ...s, historico_status: (h.data.historico || []).slice(0, 20) };
        } catch (err) {
          return { ...s, historico_status: s.historico_status || [] };
        }
      }));

      setModalSolicitacoes(solicitacoesComHistorico);
      setShowSolicitacoesModal(true);
    } catch (err) {
      console.error('Erro ao carregar solicitacoes do usuario:', err);
      alert('Erro ao carregar solicitações do usuário');
    }
  };

  const bairros = [...new Set(solicitacoes.map(s => s.bairro).filter(Boolean))];

  const solicitacoesFiltradas = solicitacoes.filter(s => {
    const statusMatch = !filtroStatus || s.status === filtroStatus;
    const bairroMatch = !filtroBairro || s.bairro === filtroBairro;
    const usuarioMatch = !searchUsuario || 
      (s.nome_usuario || s.usuario_nome)?.toLowerCase().includes(searchUsuario.toLowerCase()) ||
      (s.usuario_email || s.email_usuario)?.toLowerCase().includes(searchUsuario.toLowerCase());
    return statusMatch && bairroMatch && usuarioMatch;
  });

  const getStatusColor = (status) => {
    const colors = {
      'Enviada/Em Análise': '#FFC107',
      'Repassada': '#2196F3',
      'Em Execução': '#9C27B0',
      'Concluída': '#4CAF50',
      'Rejeitada': '#f44336',
    };
    return colors[status] || '#999';
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calcularDiasDecorridos = (dataCriacao) => {
    const agora = new Date();
    const criacao = new Date(dataCriacao);
    const dias = Math.floor((agora - criacao) / (1000 * 60 * 60 * 24));
    return dias;
  };

  const stats = {
    total: solicitacoes.length,
    pendentes: solicitacoes.filter(s => s.status === 'Enviada/Em Análise').length,
    emExecucao: solicitacoes.filter(s => s.status === 'Em Execução').length,
    concluidas: solicitacoes.filter(s => s.status === 'Concluída').length,
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', color: '#333' }}>Histórico de Solicitações dos Usuários</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setActiveTab('solicitacoes')} style={{ padding: '8px 12px', background: activeTab === 'solicitacoes' ? '#FF8C00' : '#eee', color: activeTab === 'solicitacoes' ? '#fff' : '#333', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Solicitações</button>
          <button onClick={() => setActiveTab('logins')} style={{ padding: '8px 12px', background: activeTab === 'logins' ? '#2196F3' : '#eee', color: activeTab === 'logins' ? '#fff' : '#333', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Logins</button>
        </div>
      </div>

      {/* ESTATÍSTICAS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '30px'
      }}>
        <div style={{
          backgroundColor: '#fff',
          padding: '15px',
          borderRadius: '8px',
          border: '2px solid #FF8C00',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#FF8C00' }}>
            {stats.total}
          </div>
          <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
            Total de Solicitações
          </div>
        </div>

        <div style={{
          backgroundColor: '#fff',
          padding: '15px',
          borderRadius: '8px',
          border: '2px solid #FFC107',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#FFC107' }}>
            {stats.pendentes}
          </div>
          <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
            Pendentes
          </div>
        </div>

        <div style={{
          backgroundColor: '#fff',
          padding: '15px',
          borderRadius: '8px',
          border: '2px solid #9C27B0',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#9C27B0' }}>
            {stats.emExecucao}
          </div>
          <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
            Em Execução
          </div>
        </div>

        <div style={{
          backgroundColor: '#fff',
          padding: '15px',
          borderRadius: '8px',
          border: '2px solid #4CAF50',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#4CAF50' }}>
            {stats.concluidas}
          </div>
          <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
            Concluídas
          </div>
        </div>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#ffebee',
          color: '#c62828',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '20px',
        }}>
          {error}
        </div>
      )}

      {/* FILTROS */}
      {activeTab === 'solicitacoes' ? (
        <>
          <div style={{
            backgroundColor: '#f9f9f9',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #e0e0e0',
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>Filtros</h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '15px',
            }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px' }}>
                  Buscar por Usuário
                </label>
                <input
                  type="text"
                  value={searchUsuario}
                  onChange={(e) => setSearchUsuario(e.target.value)}
                  placeholder="Nome ou email"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px' }}>
                  Filtrar por Status
                </label>
                <select
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="">Todos os Status</option>
                  {STATUS_OPTIONS.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px' }}>
                  Filtrar por Bairro
                </label>
                <select
                  value={filtroBairro}
                  onChange={(e) => setFiltroBairro(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="">Todos os Bairros</option>
                  {bairros.map(bairro => (
                    <option key={bairro} value={bairro}>{bairro}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Filtros simples para Logins */}
          <div style={{
            backgroundColor: '#f9f9f9',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #e0e0e0',
            display: 'flex',
            gap: '12px',
            alignItems: 'center'
          }}>
            <input placeholder="Buscar por usuário" style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid #ddd', flex: 1 }} value={searchUsuario} onChange={(e) => setSearchUsuario(e.target.value)} />
            <button onClick={carregarLogins} style={{ padding: '8px 12px', background: '#2196F3', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Atualizar</button>
          </div>
        </>
      )}
      {/* LISTA: Simplified rendering for solicitações and logins */}
      {activeTab === 'solicitacoes' ? (
        loading ? (
          <div style={{ textAlign: 'center', color: '#999', padding: '40px' }}>Carregando solicitações...</div>
        ) : solicitacoesFiltradas.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#999', padding: '40px', backgroundColor: '#f5f5f5', borderRadius: '8px', border: '2px dashed #ddd' }}>
            <p style={{ margin: '10px 0' }}>Nenhuma solicitação encontrada.</p>
            <p style={{ margin: '10px 0', fontSize: '13px' }}>Os usuários poderão consultar o histórico de suas solicitações aqui.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {solicitacoesFiltradas.map(solicitacao => (
              <div
                key={solicitacao.id}
                style={{
                  backgroundColor: '#fff',
                  border: `2px solid ${getStatusColor(solicitacao.status)}`,
                  borderRadius: '8px',
                  padding: '16px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ padding: '4px 12px', backgroundColor: getStatusColor(solicitacao.status), color: '#fff', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>{solicitacao.status}</span>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>{solicitacao.nome_usuario || solicitacao.usuario_nome || 'Usuário Anônimo'}</span>
                    </div>
                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}><strong>Título:</strong> {solicitacao.titulo || 'Sem título'}</p>
                    <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: '#999' }}>
                      <span>📧 {solicitacao.usuario_email || solicitacao.email_usuario || 'Sem email'}</span>
                      <span>📍 {solicitacao.bairro || 'Sem bairro'}</span>
                      <span>📅 {formatarData(solicitacao.created_at)}</span>
                      {solicitacao.numero_rastreamento && <span>🔎 {solicitacao.numero_rastreamento}</span>}
                      {solicitacao.ultima_atualizacao_status && <span>🕑 Última atualização: {formatarData(solicitacao.ultima_atualizacao_status)}</span>}
                    </div>
                  </div>
                </div>
                {/* Fotos (miniaturas) */}
                {Array.isArray(solicitacao.fotos_urls) && solicitacao.fotos_urls.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                    {solicitacao.fotos_urls.map((url, idx) => (
                      <img key={idx} src={url} alt={`foto-${idx}`} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #eee' }} />
                    ))}
                  </div>
                )}

                {/* Histórico resumido (últimos 3) */}
                {Array.isArray(solicitacao.historico_status) && solicitacao.historico_status.length > 0 && (
                  <div style={{ marginTop: '10px', padding: '10px', background: '#fafafa', borderRadius: '6px', border: '1px dashed #eee' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Histórico (últimos)</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {solicitacao.historico_status.slice(0,3).map((h, i) => (
                        <div key={i} style={{ fontSize: '13px', color: '#555' }}>
                          <strong>{h.status_novo || h.status}</strong> — {h.justificativa || ''} <span style={{ color: '#999' }}>({formatarData(h.created_at)})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      ) : (
        loadingLogins ? (
          <div style={{ textAlign: 'center', color: '#999', padding: '40px' }}>Carregando logins...</div>
        ) : logins.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#999', padding: '40px', backgroundColor: '#f5f5f5', borderRadius: '8px', border: '2px dashed #ddd' }}>
            <p style={{ margin: '10px 0' }}>Nenhum evento de login registrado.</p>
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: '8px', padding: '12px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
                  <th style={{ padding: '8px' }}>Data</th>
                  <th style={{ padding: '8px' }}>Usuário</th>
                  <th style={{ padding: '8px' }}>Username</th>
                  <th style={{ padding: '8px' }}>IP</th>
                  <th style={{ padding: '8px' }}>User-Agent</th>
                  <th style={{ padding: '8px' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {logins.map(l => (
                  <tr key={l.id} style={{ borderBottom: '1px solid #f1f1f1' }}>
                    <td style={{ padding: '8px', verticalAlign: 'top' }}>{formatarData(l.created_at)}</td>
                    <td style={{ padding: '8px', verticalAlign: 'top', cursor: l.user_id ? 'pointer' : 'default', color: l.user_id ? '#1976d2' : '#000' }} onClick={() => l.user_id && abrirSolicitacoesUsuario(l.user_id)}>{l.usuario_nome || '-'}</td>
                    <td style={{ padding: '8px', verticalAlign: 'top' }}>{l.username || '-'}</td>
                    <td style={{ padding: '8px', verticalAlign: 'top' }}>{l.ip || '-'}</td>
                    <td style={{ padding: '8px', verticalAlign: 'top', maxWidth: '420px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.user_agent || '-'}</td>
                    <td style={{ padding: '8px', verticalAlign: 'top' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => abrirSolicitacoesUsuario(l.user_id)} style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #eee', background: '#fff', cursor: 'pointer' }}>Solicitações</button>
                        <button onClick={() => deletarLogin(l.id)} style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #eee', background: '#fff', cursor: 'pointer', color: '#c62828' }}>Excluir</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* Modal de solicitações do usuário (simples) */}
      {showSolicitacoesModal && (
        <div style={{ position: 'fixed', left: 0, top: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000 }}>
          <div style={{ width: '90%', maxWidth: '900px', background: '#fff', borderRadius: '8px', padding: '20px', maxHeight: '80vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3>Solicitações do Usuário</h3>
              <button onClick={() => setShowSolicitacoesModal(false)} style={{ padding: '6px 10px' }}>Fechar</button>
            </div>

            {modalSolicitacoes.length === 0 ? (
              <div style={{ color: '#666', padding: '20px' }}>Nenhuma solicitação encontrada para este usuário.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {modalSolicitacoes.map(s => (
                  <div key={s.id} style={{ border: '1px solid #eee', padding: '12px', borderRadius: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontWeight: 600 }}>{s.titulo || 'Sem título'}</div>
                      <div style={{ color: '#999' }}>{new Date(s.created_at).toLocaleString()}</div>
                    </div>
                    <div style={{ color: '#666', marginTop: '8px' }}>{s.descricao}</div>

                    {s.numero_rastreamento && (
                      <div style={{ marginTop: '6px', fontSize: '13px' }}>🔎 <strong>Rastreamento:</strong> {s.numero_rastreamento}</div>
                    )}

                    {Array.isArray(s.fotos_urls) && s.fotos_urls.length > 0 && (
                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                        {s.fotos_urls.map((u, i) => (
                          <img key={i} src={u} alt={`foto-${i}`} style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #eee' }} />
                        ))}
                      </div>
                    )}

                    {Array.isArray(s.historico_status) && s.historico_status.length > 0 && (
                      <div style={{ marginTop: '10px', padding: '10px', background: '#fafafa', borderRadius: '6px', border: '1px dashed #eee' }}>
                        <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>Histórico de Status</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {s.historico_status.map((h, i) => (
                            <div key={i} style={{ fontSize: '13px', color: '#444' }}>
                              <div><strong>{h.status_novo || h.status}</strong> <span style={{ color: '#999' }}>({formatarData(h.created_at)})</span></div>
                              {h.orgao_competente && <div style={{ color: '#666', fontSize: '13px' }}>Órgão: {h.orgao_competente}</div>}
                              {h.justificativa && <div style={{ color: '#666', fontSize: '13px' }}>Justificativa: {h.justificativa}</div>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
