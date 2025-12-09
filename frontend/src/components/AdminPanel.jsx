import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line,
} from 'recharts';
import AdminGerenciarAvisos from './AdminGerenciarAvisos';
import AdminHistoricoUsuarios from './AdminHistoricoUsuarios';
import AdminConfiguracoes from './AdminConfiguracoes';
import AdminBairros from './AdminBairros';

const STATUS_OPTIONS = [
  'Enviada/Em Análise',
  'Repassada',
  'Em Execução',
  'Concluída',
  'Rejeitada'
];

const COLORS = ['#FF8C00', '#4CAF50', '#2196F3', '#9C27B0', '#f44336'];

export default function AdminPanel() {
  const { user, isAdmin } = useAuth();
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSolicitacao, setSelectedSolicitacao] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [justificativa, setJustificativa] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [activeTab, setActiveTab] = useState('graficos');

  // Verificar se é admin
  if (!user || !isAdmin?.()) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
        <h2>Acesso Negado</h2>
        <p>Você não tem permissão para acessar o painel de administração.</p>
      </div>
    );
  }

  // Carregar solicitações
  useEffect(() => {
    carregarSolicitacoes();
  }, []);

  const carregarSolicitacoes = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/solicitacoes/admin/listar');
      setSolicitacoes(response.data.solicitacoes || []);
      setError('');
    } catch (err) {
      setError('Erro ao carregar solicitações: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const atualizarStatus = async () => {
    if (!selectedSolicitacao || !newStatus) {
      setError('Selecione uma solicitação e um novo status');
      return;
    }

    try {
      await api.patch(`/api/solicitacoes/admin/${selectedSolicitacao.id}/status`, {
        status: newStatus,
        justificativa,
      });

      setSuccess('Status atualizado com sucesso!');
      setNewStatus('');
      setJustificativa('');
      setSelectedSolicitacao(null);
      carregarSolicitacoes();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erro ao atualizar status: ' + (err.response?.data?.error || err.message));
    }
  };

  const solicitacoesFiltradas = filtroStatus
    ? solicitacoes.filter(s => s.status === filtroStatus)
    : solicitacoes;

  // Dados para gráfico de distribuição de status
  const statusData = STATUS_OPTIONS.map(status => ({
    name: status,
    value: solicitacoes.filter(s => s.status === status).length,
  })).filter(d => d.value > 0);

  // Dados para gráfico de bairros
  const bairroData = {};
  solicitacoes.forEach(sol => {
    if (sol.bairro) {
      bairroData[sol.bairro] = (bairroData[sol.bairro] || 0) + 1;
    }
  });
  
  const bairroChartData = Object.entries(bairroData)
    .map(([bairro, count]) => ({ bairro, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Dados para timeline
  const timelineData = {};
  solicitacoes.forEach(sol => {
    const date = new Date(sol.created_at).toLocaleDateString('pt-BR');
    timelineData[date] = (timelineData[date] || 0) + 1;
  });

  const timelineChartData = Object.entries(timelineData)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ color: '#333', marginBottom: '30px' }}>Painel de Administração</h1>

      {/* ABAS */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '30px', borderBottom: '2px solid #ddd', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('lista')}
          style={{
            padding: '15px 25px',
            fontSize: '16px',
            fontWeight: '600',
            backgroundColor: activeTab === 'lista' ? '#FF8C00' : '#f5f5f5',
            color: activeTab === 'lista' ? '#fff' : '#666',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '6px 6px 0 0',
            transition: 'all 0.3s',
          }}
        >
          Solicitações
        </button>
        <button
          onClick={() => setActiveTab('graficos')}
          style={{
            padding: '15px 25px',
            fontSize: '16px',
            fontWeight: '600',
            backgroundColor: activeTab === 'graficos' ? '#FF8C00' : '#f5f5f5',
            color: activeTab === 'graficos' ? '#fff' : '#666',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '6px 6px 0 0',
            transition: 'all 0.3s',
          }}
        >
          📊 Acompanhamento em Tempo Real
        </button>
        <button
          onClick={() => setActiveTab('avisos')}
          style={{
            padding: '15px 25px',
            fontSize: '16px',
            fontWeight: '600',
            backgroundColor: activeTab === 'avisos' ? '#FF8C00' : '#f5f5f5',
            color: activeTab === 'avisos' ? '#fff' : '#666',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '6px 6px 0 0',
            transition: 'all 0.3s',
          }}
        >
          🚨 Gerenciar Avisos
        </button>
        <button
          onClick={() => setActiveTab('historico')}
          style={{
            padding: '15px 25px',
            fontSize: '16px',
            fontWeight: '600',
            backgroundColor: activeTab === 'historico' ? '#FF8C00' : '#f5f5f5',
            color: activeTab === 'historico' ? '#fff' : '#666',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '6px 6px 0 0',
            transition: 'all 0.3s',
          }}
        >
          📜 Histórico de Usuários
        </button>
        <button
          onClick={() => setActiveTab('config')}
          style={{
            padding: '15px 25px',
            fontSize: '16px',
            fontWeight: '600',
            backgroundColor: activeTab === 'config' ? '#FF8C00' : '#f5f5f5',
            color: activeTab === 'config' ? '#fff' : '#666',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '6px 6px 0 0',
            transition: 'all 0.3s',
          }}
        >
          ⚙️ Configurações
        </button>
        <button
          onClick={() => setActiveTab('bairros')}
          style={{
            padding: '15px 25px',
            fontSize: '16px',
            fontWeight: '600',
            backgroundColor: activeTab === 'bairros' ? '#FF8C00' : '#f5f5f5',
            color: activeTab === 'bairros' ? '#fff' : '#666',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '6px 6px 0 0',
            transition: 'all 0.3s',
          }}
        >
          Alertas por Bairro
        </button>
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

      {success && (
        <div style={{
          backgroundColor: '#e8f5e9',
          color: '#2e7d32',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '20px',
        }}>
          {success}
        </div>
      )}

      {/* CONTEÚDO DAS ABAS */}
      {activeTab === 'lista' && (
        // ABA LISTA
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          {/* Coluna Esquerda: Lista de Solicitações */}
          <div>
            <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Solicitações</h2>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Filtrar por Status:
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
                }}
              >
                <option value="">Todos os status</option>
                {STATUS_OPTIONS.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {loading ? (
              <p style={{ color: '#999' }}>Carregando...</p>
            ) : solicitacoesFiltradas.length === 0 ? (
              <p style={{ color: '#999' }}>Nenhuma solicitação encontrada.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '600px', overflowY: 'auto' }}>
                {solicitacoesFiltradas.map(solicitacao => (
                  <div
                    key={solicitacao.id}
                    onClick={() => setSelectedSolicitacao(solicitacao)}
                    style={{
                      padding: '12px',
                      backgroundColor: selectedSolicitacao?.id === solicitacao.id ? '#FFF3E0' : '#f9f9f9',
                      border: selectedSolicitacao?.id === solicitacao.id ? '2px solid #FF8C00' : '1px solid #ddd',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <p style={{ margin: '0 0 4px 0', fontWeight: '600', color: '#333' }}>
                      #{solicitacao.numero_rastreamento}
                    </p>
                    <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#666' }}>
                      {solicitacao.descricao?.substring(0, 50)}...
                    </p>
                    <p style={{ margin: '0', fontSize: '12px', color: '#999' }}>
                      Status: <span style={{ color: '#FF8C00', fontWeight: '600' }}>{solicitacao.status}</span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Coluna Direita: Detalhes e Edição */}
          <div>
            <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Detalhes</h2>
            {selectedSolicitacao ? (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', fontSize: '14px' }}>
                    Número de Rastreamento:
                  </label>
                  <p style={{ margin: '0', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '6px' }}>
                    {selectedSolicitacao.numero_rastreamento}
                  </p>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', fontSize: '14px' }}>
                    Descrição:
                  </label>
                  <p style={{ margin: '0', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '6px', fontSize: '14px' }}>
                    {selectedSolicitacao.descricao}
                  </p>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', fontSize: '14px' }}>
                    Localização:
                  </label>
                  <p style={{ margin: '0', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '6px', fontSize: '14px' }}>
                    {selectedSolicitacao.rua}, {selectedSolicitacao.numero} - {selectedSolicitacao.bairro} - CEP {selectedSolicitacao.cep}
                  </p>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', fontSize: '14px' }}>
                    Status Atual:
                  </label>
                  <p style={{ margin: '0', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '6px', fontSize: '14px', color: '#FF8C00', fontWeight: '600' }}>
                    {selectedSolicitacao.status}
                  </p>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
                    Novo Status:
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px',
                    }}
                  >
                    <option value="">Selecione um novo status</option>
                    {STATUS_OPTIONS.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
                    Justificativa (opcional):
                  </label>
                  <textarea
                    value={justificativa}
                    onChange={(e) => setJustificativa(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      minHeight: '100px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <button
                  onClick={atualizarStatus}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#FF8C00',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e67e00'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF8C00'}
                >
                  Atualizar Status
                </button>
              </>
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                Selecione uma solicitação na lista para ver os detalhes
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'graficos' && (
        // ABA GRÁFICOS
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
          gap: '30px'
        }}>
          {/* Gráfico 1: Distribuição de Status */}
          <div style={{
            backgroundColor: '#fff',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginTop: '0', color: '#333', marginBottom: '20px' }}>
              📊 Distribuição por Status
            </h3>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p style={{ textAlign: 'center', color: '#999' }}>Sem dados disponíveis</p>
            )}
            <p style={{ fontSize: '14px', color: '#666', marginTop: '10px', textAlign: 'center' }}>
              Total: {solicitacoes.length} solicitações
            </p>
          </div>

          {/* Gráfico 2: Top 10 Bairros */}
          <div style={{
            backgroundColor: '#fff',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginTop: '0', color: '#333', marginBottom: '20px' }}>
              🏘️ Top 10 Bairros com Mais Solicitações
            </h3>
            {bairroChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={bairroChartData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="bairro" type="category" width={140} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#FF8C00" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p style={{ textAlign: 'center', color: '#999' }}>Sem dados disponíveis</p>
            )}
          </div>

          {/* Gráfico 3: Timeline */}
          <div style={{
            backgroundColor: '#fff',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            gridColumn: '1 / -1'
          }}>
            <h3 style={{ marginTop: '0', color: '#333', marginBottom: '20px' }}>
              📈 Solicitações ao Longo do Tempo
            </h3>
            {timelineChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timelineChartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => `${value} solicitações`}
                    labelFormatter={(label) => `Data: ${label}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#FF8C00" 
                    strokeWidth={2}
                    dot={{ fill: '#FF8C00', r: 5 }}
                    activeDot={{ r: 7 }}
                    name="Solicitações"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p style={{ textAlign: 'center', color: '#999' }}>Sem dados disponíveis</p>
            )}
          </div>

          {/* Resumo de Estatísticas */}
          <div style={{
            backgroundColor: '#fff',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            gridColumn: '1 / -1'
          }}>
            <h3 style={{ marginTop: '0', color: '#333', marginBottom: '20px' }}>
              Resumo de Estatísticas
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
              <div style={{ 
                backgroundColor: '#f5f5f5', 
                padding: '15px', 
                borderRadius: '6px',
                textAlign: 'center',
                borderLeft: '4px solid #FF8C00'
              }}>
                <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold', color: '#FF8C00' }}>
                  {solicitacoes.length}
                </p>
                <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
                  Total de Solicitações
                </p>
              </div>

              {STATUS_OPTIONS.map((status, idx) => {
                const count = solicitacoes.filter(s => s.status === status).length;
                return (
                  <div 
                    key={status}
                    style={{ 
                      backgroundColor: '#f5f5f5', 
                      padding: '15px', 
                      borderRadius: '6px',
                      textAlign: 'center',
                      borderLeft: `4px solid ${COLORS[idx]}`
                    }}>
                    <p style={{ margin: '0', fontSize: '20px', fontWeight: 'bold', color: COLORS[idx] }}>
                      {count}
                    </p>
                    <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '12px' }}>
                      {status}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ABA GERENCIAR AVISOS */}
      {activeTab === 'avisos' && <AdminGerenciarAvisos />}

      {/* ABA HISTÓRICO DE USUÁRIOS */}
      {activeTab === 'historico' && <AdminHistoricoUsuarios />}

      {/* ABA CONFIGURAÇÕES */}
      {activeTab === 'config' && <AdminConfiguracoes />}

      {/* ABA ALERTAS POR BAIRRO */}
      {activeTab === 'bairros' && <AdminBairros />}
    </div>
  );
}
