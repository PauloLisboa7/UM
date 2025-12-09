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
  const [error, setError] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroBairro, setFiltroBairro] = useState('');
  const [searchUsuario, setSearchUsuario] = useState('');
  const [expandedId, setExpandedId] = useState(null);

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
      console.error('Erro ao carregar histórico:', err);
      // Aceitar lista vazia se houver erro
      setSolicitacoes([]);
      setError('');
    } finally {
      setLoading(false);
    }
  };

  const bairros = [...new Set(solicitacoes.map(s => s.bairro).filter(Boolean))];

  const solicitacoesFiltradas = solicitacoes.filter(s => {
    const statusMatch = !filtroStatus || s.status === filtroStatus;
    const bairroMatch = !filtroBairro || s.bairro === filtroBairro;
    const usuarioMatch = !searchUsuario || 
      s.usuario_nome?.toLowerCase().includes(searchUsuario.toLowerCase()) ||
      s.usuario_email?.toLowerCase().includes(searchUsuario.toLowerCase());
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
      <h2 style={{ fontSize: '20px', color: '#333', marginBottom: '20px' }}>Histórico de Solicitações dos Usuários</h2>

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

      {/* LISTA */}
      {loading ? (
        <div style={{ textAlign: 'center', color: '#999', padding: '40px' }}>
          Carregando solicitações...
        </div>
      ) : solicitacoesFiltradas.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          color: '#999', 
          padding: '40px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          border: '2px dashed #ddd'
        }}>
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
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
              onClick={() => setExpandedId(expandedId === solicitacao.id ? null : solicitacao.id)}
              onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{
                      padding: '4px 12px',
                      backgroundColor: getStatusColor(solicitacao.status),
                      color: '#fff',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}>
                      {solicitacao.status}
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>
                      {solicitacao.usuario_nome || 'Usuário Anônimo'}
                    </span>
                  </div>
                  
                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                    <strong>Título:</strong> {solicitacao.titulo || 'Sem título'}
                  </p>

                  <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: '#999' }}>
                    <span>📧 {solicitacao.usuario_email || 'Sem email'}</span>
                    <span>📍 {solicitacao.bairro || 'Sem bairro'}</span>
                    <span>📅 {formatarData(solicitacao.created_at)}</span>
                    <span>⏱️ {calcularDiasDecorridos(solicitacao.created_at)} dias</span>
                  </div>
                </div>
                <span style={{ fontSize: '18px', marginLeft: '10px' }}>
                  {expandedId === solicitacao.id ? '▼' : '▶'}
                </span>
              </div>

              {expandedId === solicitacao.id && (
                <div style={{
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '1px solid #eee',
                }}>
                  <div style={{ marginBottom: '12px' }}>
                    <strong style={{ fontSize: '14px' }}>Descrição:</strong>
                    <p style={{ fontSize: '14px', color: '#666', marginTop: '6px', lineHeight: '1.6' }}>
                      {solicitacao.descricao}
                    </p>
                  </div>

                  {solicitacao.foto_url && (
                    <div style={{ marginBottom: '12px' }}>
                      <strong style={{ fontSize: '14px' }}>Foto:</strong>
                      <img
                        src={solicitacao.foto_url}
                        alt="Foto da solicitação"
                        style={{
                          maxWidth: '200px',
                          maxHeight: '200px',
                          marginTop: '8px',
                          borderRadius: '6px',
                        }}
                      />
                    </div>
                  )}

                  <div style={{ fontSize: '13px', color: '#999' }}>
                    <p><strong>ID:</strong> {solicitacao.id}</p>
                    <p><strong>Latitude:</strong> {solicitacao.latitude}</p>
                    <p><strong>Longitude:</strong> {solicitacao.longitude}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
