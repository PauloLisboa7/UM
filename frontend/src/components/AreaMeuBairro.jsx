import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSolicitacao } from '../contexts/SolicitacaoContext';
import '../styles/AreaMeuBairro.css';

export default function AreaMeuBairro() {
  const { user } = useAuth();
  const { refreshBairro } = useSolicitacao();
  const [bairro, setBairro] = useState('');
  const [endereco, setEndereco] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [solicitacoesOriginais, setSolicitacoesOriginais] = useState([]);
  const [availableBairros, setAvailableBairros] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [abaSelecionada, setAbaSelecionada] = useState('solicitacoes');

  const bairros = [
    'Centro',
    'Praia Grande',
    'Calhau',
    'São Francisco',
    'Anil',
    'Olho d\'Água',
    'Bacanga',
    'Tirirical',
    'Anjo da Guarda',
    'Coroado',
  ];

  useEffect(() => {
    carregarDadosBairro();
  }, [user, refreshBairro]);

  const carregarDadosBairro = async () => {
    if (!user) {
      setCarregando(false);
      return;
    }

    try {
      setCarregando(true);
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');

      if (!token) {
        setErro('Token não encontrado. Por favor, faça login novamente.');
        setCarregando(false);
        return;
      }

      // Carregar dados do usuário
      const resUsuario = await fetch('/api/usuarios/meu-bairro', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      let bairroDoUsuario = '';
      if (resUsuario.ok) {
        const data = await resUsuario.json();
        bairroDoUsuario = data.bairro || '';
        setBairro(bairroDoUsuario);
        setEndereco(data.endereco || '');
      }

      // Carregar solicitações do usuário para extrair bairros únicos
      let minhas = [];
      try {
        const resMinhas = await fetch('/api/solicitacoes/minhas-solicitacoes', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (resMinhas.ok) {
          const minhasData = await resMinhas.json();
          minhas = minhasData.solicitacoes || [];
          setSolicitacoes(minhas);
          setSolicitacoesOriginais(minhas);
          
          // Extrair bairros únicos das solicitações
          const bairrosDoUsuario = Array.from(
            new Set(minhas.map(s => s.bairro).filter(b => b && b.trim() !== ''))
          ).sort();
          
          console.log('Bairros do usuário:', bairrosDoUsuario);
          
          // Se há bairros nas solicitações, usa eles; caso contrário, deixa vazio
          setAvailableBairros(bairrosDoUsuario);
        } else {
          console.error('Erro ao buscar solicitações:', resMinhas.status);
          setAvailableBairros([]);
        }
      } catch (e) {
        console.error('Erro ao buscar minhas solicitações:', e);
        setAvailableBairros([]);
      }

      // Se o usuário já tem bairro configurado, filtrar solicitações e alertas desse bairro
      if (bairroDoUsuario && minhas.length > 0) {
        // Filtrar as solicitações já carregadas em solicitacoesOriginais
        const solicitacoesFiltradas = minhas.filter(s => s.bairro === bairroDoUsuario);
        setSolicitacoes(solicitacoesFiltradas);

        // Carregar alertas do bairro a partir da API de admin (visível para usuário)
        try {
          const resAlertas = await fetch(`/api/solicitacoes/alertas-bairro/${encodeURIComponent(bairroDoUsuario)}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (resAlertas.ok) {
            const dados = await resAlertas.json();
            const iconByTipo = {
              'trânsito': '🚧',
              'energia': '⚡',
              'coleta': '🗑️',
              'manutenção': '🛠️',
              'saúde': '🏥',
              'segurança': '🚨',
            };

            const alertasBairro = (dados.alertas || []).map(a => ({
              id: a.id,
              titulo: a.titulo,
              descricao: a.descricao,
              data: a.created_at || a.updated_at,
              icon: iconByTipo[a.tipo] || 'ℹ️',
              tipo: a.tipo,
              bairro: a.bairro,
              localidade_especifica: a.localidade_especifica,
            }));
            setAlertas(alertasBairro);
          } else {
            setAlertas([]);
          }
        } catch (e) {
          console.error('Erro ao buscar alertas do bairro:', e);
          setAlertas([]);
        }
      }

      setErro(null);
    } catch (err) {
      console.error('Erro:', err);
      setErro('Erro ao carregar dados do bairro');
    } finally {
      setCarregando(false);
    }
  };

  const handleSalvarBairro = async () => {
    if (!bairro) {
      setErro('Selecione um bairro');
      return;
    }

    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await fetch('/api/usuarios/meu-bairro', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bairro, endereco }),
      });

      if (response.ok) {
        setErro(null);
        carregarDadosBairro();
      } else {
        setErro('Erro ao salvar bairro');
      }
    } catch (err) {
      console.error('Erro:', err);
      setErro('Erro ao salvar bairro');
    }
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

  return (
    <div className="area-bairro-container">
      <div className="bairro-header">
        <h2 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 8px 0', color: '#333' }}>
          📍 Área do Meu Bairro
        </h2>
        <p style={{ fontSize: '12px', color: '#666', margin: '0 0 8px 0' }}>
          📍 {bairro || (user?.bairro || '—')}
        </p>
        <p style={{ fontSize: '12px', color: '#666', margin: '0 0 8px 0' }}>
          👤 {user ? (user.nome || user.username || user.email || user.id) : 'Visitante'}
        </p>
      </div>

      {erro && (
        <div style={{
          padding: '12px 16px',
          backgroundColor: '#FFEBEE',
          color: '#C62828',
          borderRadius: '8px',
          marginBottom: '20px',
          fontSize: '14px',
        }}>
          Erro: {erro}
        </div>
      )}

      {/* Configurar Bairro */}
      {!bairro ? (
        <div className="configurar-bairro">
          <h3 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 16px 0', color: '#333' }}>
            Configure seu bairro
          </h3>
          <p style={{ fontSize: '13px', color: '#666', marginBottom: '16px' }}>
            Cadastre seu endereço para receber informações personalizadas da sua região
          </p>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, color: '#333', display: 'block', marginBottom: '8px' }}>
              Bairro:
            </label>
            <select
              value={bairro}
              onChange={(e) => {
                setBairro(e.target.value);
                // Filtrar solicitações do bairro selecionado
                if (e.target.value) {
                  const solicitacoesFiltradas = solicitacoesOriginais.filter(s => s.bairro === e.target.value);
                  setSolicitacoes(solicitacoesFiltradas);
                } else {
                  // Se desselecionar, mostrar todas
                  setSolicitacoes(solicitacoesOriginais);
                }
              }}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#333',
              }}
            >
              <option value="">
                {availableBairros.length > 0 
                  ? 'Escolha seu bairro...' 
                  : 'Carregando bairros das suas solicitações...'}
              </option>
              {availableBairros.length > 0 ? (
                availableBairros.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))
              ) : (
                <option disabled>Nenhum bairro encontrado nas suas solicitações</option>
              )}
            </select>
            {availableBairros.length > 0 && (
              <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                {availableBairros.length} bairro{availableBairros.length !== 1 ? 's' : ''} encontrado{availableBairros.length !== 1 ? 's' : ''} nas suas solicitações
              </p>
            )}
          </div>

          <button
            onClick={handleSalvarBairro}
            style={{
              padding: '10px 24px',
              backgroundColor: '#FF8C00',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Salvar Meu Bairro
          </button>
        </div>
      ) : (
        <>
          {/* Informações do Bairro */}
          <div className="info-bairro">
            <div>
              <div style={{ fontSize: '12px', color: '#999' }}>Seu Bairro</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#333' }}>{bairro}</div>
              {endereco && (
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>📍 {endereco}</div>
              )}
            </div>
            <button
              onClick={() => {
                setBairro('');
                setEndereco('');
              }}
              style={{
                padding: '8px 16px',
                backgroundColor: '#f0f0f0',
                color: '#666',
                border: 'none',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Alterar
            </button>
          </div>

          {/* Abas */}
          <div className="bairro-abas">
            <button
              onClick={() => setAbaSelecionada('solicitacoes')}
              className={`aba ${abaSelecionada === 'solicitacoes' ? 'ativa' : ''}`}
            >
              Solicitações Ativas ({solicitacoes.length})
            </button>
            <button
              onClick={() => setAbaSelecionada('alertas')}
              className={`aba ${abaSelecionada === 'alertas' ? 'ativa' : ''}`}
            >
              Alertas da Região ({alertas.length})
            </button>
          </div>

          {/* Conteúdo das Abas */}
          {carregando ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <p>Carregando informações...</p>
            </div>
          ) : abaSelecionada === 'solicitacoes' ? (
            <div className="bairro-content">
              {solicitacoes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                  <p>Nenhuma solicitação ativa no seu bairro no momento</p>
                </div>
              ) : (
                <div className="solicitacoes-grid">
                  {solicitacoes.map((sol) => (
                    <div key={sol.id} className="solicitacao-card">
                      <div style={{ marginBottom: '12px' }}>
                        <span
                          style={{
                            backgroundColor: getStatusColor(sol.status),
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 600,
                          }}
                        >
                          {sol.status?.toUpperCase()}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 8px 0', color: '#333' }}>
                        {sol.descricao?.substring(0, 50)}...
                      </h4>
                      <p style={{ fontSize: '12px', color: '#666', margin: '0 0 8px 0' }}>
                        📍 {sol.bairro}
                      </p>
                      <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>
                        🕐 {new Date(sol.data_criacao).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bairro-content">
              {alertas.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                  <p>Nenhum alerta para sua região no momento</p>
                </div>
              ) : (
                <div className="alertas-grid">
                  {alertas.map((alerta) => (
                    <div key={alerta.id} className="alerta-card">
                      <div style={{ fontSize: '24px', marginBottom: '12px' }}>{alerta.icon}</div>
                      <h4 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 8px 0', color: '#333' }}>
                        {alerta.titulo}
                      </h4>
                      <p style={{ fontSize: '12px', color: '#666', margin: '0 0 8px 0', lineHeight: 1.5 }}>
                        {alerta.descricao}
                      </p>
                      <p style={{ fontSize: '11px', color: '#999', margin: 0 }}>
                        {new Date(alerta.data).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
