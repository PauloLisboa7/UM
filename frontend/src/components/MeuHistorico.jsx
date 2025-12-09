import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/MeuHistorico.css';

export default function MeuHistorico() {
  const { user } = useAuth();
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [filtro, setFiltro] = useState('todas');

  useEffect(() => {
    carregarSolicitacoes();
  }, [user]);

  const carregarSolicitacoes = async () => {
    if (!user) {
      setCarregando(false);
      return;
    }

    try {
      setCarregando(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/solicitacoes/minhas-solicitacoes', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Erro ao carregar solicitações');

      const data = await response.json();
      setSolicitacoes(data || []);
      setErro(null);
    } catch (err) {
      console.error('Erro:', err);
      setErro('Não foi possível carregar seu histórico');
      setSolicitacoes([]);
    } finally {
      setCarregando(false);
    }
  };

  const getSolicitacoesFiltradas = () => {
    if (filtro === 'todas') return solicitacoes;
    return solicitacoes.filter(sol => sol.status === filtro);
  };

  const getStatusColor = (status) => {
    const cores = {
      'pendente': '#FFC107',
      'em-andamento': '#2196F3',
      'resolvida': '#4CAF50',
      'rejeitada': '#F44336',
    };
    return cores[status] || '#666';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'pendente': 'Pendente',
      'em-andamento': 'Em Andamento',
      'resolvida': 'Resolvida',
      'rejeitada': 'Rejeitada',
    };
    return labels[status] || status;
  };

  const calcularTempoResolucao = (dataCriacao, dataResolucao) => {
    if (!dataResolucao) return '−';
    const inicio = new Date(dataCriacao);
    const fim = new Date(dataResolucao);
    const dias = Math.floor((fim - inicio) / (1000 * 60 * 60 * 24));
    return `${dias} dia${dias !== 1 ? 's' : ''}`;
  };

  const solicitacoesFiltradas = getSolicitacoesFiltradas();

  return (
    <div className="meu-historico-container">
      <div className="historico-header">
        <h2 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 8px 0', color: '#333' }}>
          Meu Histórico de Repostes
        </h2>
        <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
          Acompanhe todas as solicitações que você abriu
        </p>
      </div>

      {carregando ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <p>Carregando seu histórico...</p>
        </div>
      ) : erro ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#F44336' }}>
          <p>{erro}</p>
        </div>
      ) : !user ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <p>Faça login para ver seu histórico de solicitações</p>
        </div>
      ) : solicitacoes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <p>Você ainda não abriu nenhuma solicitação</p>
        </div>
      ) : (
        <>
          {/* Filtros */}
          <div className="historico-filtros">
            <button
              onClick={() => setFiltro('todas')}
              className={`filtro-btn ${filtro === 'todas' ? 'ativo' : ''}`}
            >
              Todas ({solicitacoes.length})
            </button>
            <button
              onClick={() => setFiltro('pendente')}
              className={`filtro-btn ${filtro === 'pendente' ? 'ativo' : ''}`}
            >
              Pendentes ({solicitacoes.filter(s => s.status === 'pendente').length})
            </button>
            <button
              onClick={() => setFiltro('em-andamento')}
              className={`filtro-btn ${filtro === 'em-andamento' ? 'ativo' : ''}`}
            >
              Em Andamento ({solicitacoes.filter(s => s.status === 'em-andamento').length})
            </button>
            <button
              onClick={() => setFiltro('resolvida')}
              className={`filtro-btn ${filtro === 'resolvida' ? 'ativo' : ''}`}
            >
              Resolvidas ({solicitacoes.filter(s => s.status === 'resolvida').length})
            </button>
          </div>

          {/* Estatísticas */}
          <div className="historico-stats">
            <div className="stat-card">
              <div style={{ fontSize: '28px' }}>•</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#333' }}>
                {solicitacoes.length}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>Total de Solicitações</div>
            </div>
            <div className="stat-card">
              <div style={{ fontSize: '28px' }}>→</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#2196F3' }}>
                {solicitacoes.filter(s => s.status === 'em-andamento').length}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>Em Andamento</div>
            </div>
            <div className="stat-card">
              <div style={{ fontSize: '28px' }}>✓</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#4CAF50' }}>
                {solicitacoes.filter(s => s.status === 'resolvida').length}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>Resolvidas</div>
            </div>
          </div>

          {/* Tabela de Solicitações */}
          <div className="historico-table-container">
            <table className="historico-table">
              <thead>
                <tr>
                  <th>Número</th>
                  <th>Descrição</th>
                  <th>Data</th>
                  <th>Status</th>
                  <th>Tempo de Resolução</th>
                </tr>
              </thead>
              <tbody>
                {solicitacoesFiltradas.map((sol) => (
                  <tr key={sol.id} className="historico-row">
                    <td style={{ fontWeight: 600, color: '#FF8C00' }}>
                      #{sol.numero_rastreamento || sol.id}
                    </td>
                    <td>
                      <div style={{ fontSize: '14px', fontWeight: 500, color: '#333', marginBottom: '4px' }}>
                        {sol.descricao?.substring(0, 50)}...
                      </div>
                      <div style={{ fontSize: '12px', color: '#999' }}>
                        {sol.bairro || 'Bairro não informado'}
                      </div>
                    </td>
                    <td style={{ fontSize: '13px', color: '#666' }}>
                      {new Date(sol.data_criacao).toLocaleDateString('pt-BR')}
                    </td>
                    <td>
                      <span
                        style={{
                          backgroundColor: getStatusColor(sol.status),
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 600,
                          display: 'inline-block',
                        }}
                      >
                        {getStatusLabel(sol.status)}
                      </span>
                    </td>
                    <td style={{ fontSize: '13px', color: '#666', textAlign: 'center' }}>
                      {calcularTempoResolucao(sol.data_criacao, sol.data_resolucao)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
