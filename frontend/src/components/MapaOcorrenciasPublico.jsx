import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

export default function MapaOcorrenciasPublico() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState('Todos');

  const statusCores = {
    'Enviada/Em Análise': '#FF6B6B',
    'Repassada ao Órgão Competente': '#FFA500',
    'Em Execução/Serviço Agendado': '#FFD700',
    'Concluída/Resolvida': '#4CAF50',
    'Rejeitada': '#9E9E9E',
  };

  const criarIcone = (status) => {
    return L.icon({
      iconUrl: `data:image/svg+xml,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
          <circle cx="12" cy="12" r="11" fill="${statusCores[status]}" stroke="white" stroke-width="2"/>
          <text x="12" y="15" font-size="14" fill="white" text-anchor="middle" font-weight="bold">•</text>
        </svg>`
      )}`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  };

  useEffect(() => {
    const buscarSolicitacoes = async () => {
      try {
        const response = await fetch('/api/solicitacoes/publicas/todas');
        const data = await response.json();
        setSolicitacoes(data.solicitacoes || []);
      } catch (error) {
        console.error('Erro ao buscar solicitações:', error);
      } finally {
        setLoading(false);
      }
    };

    buscarSolicitacoes();
  }, []);

  const solicitacoesFiltradas = filtroStatus === 'Todos' 
    ? solicitacoes 
    : solicitacoes.filter((sol) => sol.status === filtroStatus);

  const statusUnicos = ['Todos', ...Array.from(new Set(solicitacoes.map((sol) => sol.status)))];

  return (
    <div style={{
      padding: '40px',
      maxWidth: '1400px',
      margin: '0 auto',
    }}>
      <h2 style={{ marginBottom: '30px', color: '#333' }}>Mapa de Ocorrências - São Luís</h2>

      {/* Legenda e Filtros */}
      <div style={{
        marginBottom: '30px',
        backgroundColor: '#ffffff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#333' }}>Legenda de Status</h3>
        
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '15px',
          marginBottom: '20px',
        }}>
          {Object.entries(statusCores).map(([status, cor]) => (
            <div key={status} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: cor,
                border: '2px solid white',
                boxShadow: '0 0 0 1px #ddd',
              }}></div>
              <span style={{ fontSize: '14px', color: '#333' }}>{status}</span>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '500',
            color: '#333',
          }}>
            Filtrar por Status
          </label>
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            style={{
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              minWidth: '300px',
            }}
          >
            {statusUnicos.map((status) => (
              <option key={status} value={status}>
                {status}
                {status !== 'Todos' && ` (${solicitacoes.filter((sol) => sol.status === status).length})`}
              </option>
            ))}
          </select>
        </div>

        <div style={{
          marginTop: '15px',
          fontSize: '14px',
          color: '#666',
        }}>
          Total de ocorrências: <strong>{solicitacoesFiltradas.length}</strong>
        </div>
      </div>

      {/* Mapa */}
      {loading ? (
        <div style={{
          height: '600px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          fontSize: '16px',
          color: '#999',
        }}>
          Carregando mapa...
        </div>
      ) : (
        <MapContainer
          center={[-2.5349, -44.3050]} // Centro de São Luís
          zoom={12}
          style={{
            height: '600px',
            borderRadius: '8px',
            border: '2px solid #ddd',
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {solicitacoesFiltradas.map((solicitacao) => (
            <Marker
              key={solicitacao.id}
              position={[solicitacao.latitude, solicitacao.longitude]}
              icon={criarIcone(solicitacao.status)}
            >
              <Popup style={{
                maxWidth: '300px',
              }}>
                <div style={{
                  fontSize: '14px',
                  color: '#333',
                }}>
                  <div style={{
                    fontWeight: '600',
                    marginBottom: '8px',
                    color: statusCores[solicitacao.status],
                  }}>
                    {solicitacao.status}
                  </div>
                  
                  <div style={{
                    marginBottom: '8px',
                    fontSize: '12px',
                  }}>
                    <strong>Local:</strong> {solicitacao.rua}, {solicitacao.bairro}
                  </div>
                  
                  <div style={{
                    marginBottom: '8px',
                    fontSize: '12px',
                    lineHeight: '1.4',
                  }}>
                    <strong>Descrição:</strong> {solicitacao.descricao.substring(0, 100)}...
                  </div>

                  <div style={{
                    marginBottom: '8px',
                    fontSize: '12px',
                  }}>
                    <strong>Data:</strong> {new Date(solicitacao.created_at).toLocaleDateString('pt-BR')}
                  </div>

                  <div style={{
                    backgroundColor: '#f0f0f0',
                    padding: '8px',
                    borderRadius: '4px',
                    marginTop: '8px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    wordBreak: 'break-all',
                  }}>
                    <strong>ID:</strong> {solicitacao.numero_rastreamento}
                  </div>

                  <div style={{
                    marginTop: '12px',
                    fontSize: '12px',
                  }}>
                    <a
                      href={`#rastreamento/${solicitacao.numero_rastreamento}`}
                      style={{
                        color: '#ff8c00',
                        textDecoration: 'none',
                        fontWeight: '500',
                      }}
                    >
                      Ver detalhes →
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}

      {/* Informações adicionais */}
      <div style={{
        marginTop: '30px',
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#666',
        lineHeight: '1.6',
      }}>
        <p>
          <strong>ℹ️ Informações:</strong> Este mapa mostra todas as solicitações públicas cadastradas na plataforma. 
          Os pontos são coloridos de acordo com o status atual da solicitação. Clique em um ponto para ver mais detalhes 
          e obter o número de rastreamento para acompanhar o andamento.
        </p>
      </div>
    </div>
  );
}
