import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/AreaMeuBairro.css';

export default function AreaMeuBairro() {
  const { user } = useAuth();
  const [bairro, setBairro] = useState('');
  const [endereco, setEndereco] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [solicitacoes, setSolicitacoes] = useState([]);
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
  }, [user]);

  const carregarDadosBairro = async () => {
    if (!user) {
      setCarregando(false);
      return;
    }

    try {
      setCarregando(true);
      const token = localStorage.getItem('authToken');

      // Carregar dados do usuário
      const resUsuario = await fetch('http://localhost:5000/api/usuarios/meu-bairro', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (resUsuario.ok) {
        const data = await resUsuario.json();
        setBairro(data.bairro || '');
        setEndereco(data.endereco || '');
      }

      // Carregar solicitações do bairro
      if (bairro) {
        const resSolicitacoes = await fetch(`http://localhost:5000/api/solicitacoes/por-bairro/${bairro}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (resSolicitacoes.ok) {
          const dados = await resSolicitacoes.json();
          setSolicitacoes(dados || []);
        }

        // Carregar alertas do bairro
        const resAlertas = await fetch('/data/avisos-alertas.json');
        if (resAlertas.ok) {
          const dados = await resAlertas.json();
          const alertasBairro = dados.avisos?.filter(a => 
            a.localidade === bairro || a.localidade === 'Toda a cidade'
          ) || [];
          setAlertas(alertasBairro);
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
    if (!bairro || !endereco) {
      setErro('Preencha todos os campos');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/usuarios/meu-bairro', {
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
        <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
          Acompanhe solicitações e alertas específicos da sua região
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
              onChange={(e) => setBairro(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#333',
              }}
            >
              <option value="">Escolha seu bairro...</option>
              {bairros.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, color: '#333', display: 'block', marginBottom: '8px' }}>
              Endereço (opcional):
            </label>
            <input
              type="text"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              placeholder="Rua, número, complemento..."
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#333',
              }}
            />
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
