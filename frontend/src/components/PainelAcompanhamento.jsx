import { useState } from 'react';

export default function PainelAcompanhamento() {
  const [numeroRastreamento, setNumeroRastreamento] = useState('');
  const [solicitacao, setSolicitacao] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const statusCores = {
    'Enviada/Em Análise': '#FF6B6B',
    'Repassada ao Órgão Competente': '#FFA500',
    'Em Execução/Serviço Agendado': '#FFD700',
    'Concluída/Resolvida': '#4CAF50',
    'Rejeitada': '#9E9E9E',
  };

  const statusIcons = {
    'Enviada/Em Análise': '→',
    'Repassada ao Órgão Competente': '→',
    'Em Execução/Serviço Agendado': '◆',
    'Concluída/Resolvida': '✓',
    'Rejeitada': '✗',
  };

  const buscarSolicitacao = async (e) => {
    e.preventDefault();
    const numero = numeroRastreamento.trim();
    if (!numero) {
      setError('Digite o número de rastreamento');
      return;
    }

    setLoading(true);
    setError('');
    setSolicitacao(null);
    setHistorico([]);

    try {
      const encoded = encodeURIComponent(numero);
      const response = await fetch(`/api/solicitacoes/rastreamento/${encoded}`);

      if (!response.ok) {
        // Try to parse error message from JSON, fallback to generic
        let errMsg = 'Solicitação não encontrada';
        try {
          const errData = await response.json();
          if (errData?.error) errMsg = errData.error;
        } catch (_) {}
        setError(errMsg);
        return;
      }

      const data = await response.json();
      setSolicitacao(data.solicitacao);
      setHistorico(data.historico || []);
    } catch (err) {
      setError('Erro ao buscar solicitação');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: '40px',
      maxWidth: '1000px',
      margin: '0 auto',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
    }}>
      <h2 style={{ marginBottom: '30px', color: '#333' }}>Acompanhamento de Solicitações</h2>

      {/* Formulário de busca */}
      <form onSubmit={buscarSolicitacao} style={{
        marginBottom: '40px',
        backgroundColor: '#ffffff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <div style={{
          display: 'flex',
          gap: '10px',
        }}>
          <input
            type="text"
            value={numeroRastreamento}
            onChange={(e) => setNumeroRastreamento(e.target.value)}
            placeholder="Digite seu número de rastreamento (ex: SOL-1702000000-ABC123DEF)"
            style={{
              flex: 1,
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px 24px',
              backgroundColor: loading ? '#cccccc' : '#ff8c00',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#e67e00')}
            onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#ff8c00')}
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
        {error && (
          <div style={{
            marginTop: '12px',
            padding: '12px',
            backgroundColor: '#ffebee',
            color: '#c62828',
            borderRadius: '4px',
            fontSize: '14px',
          }}>
            {error}
          </div>
        )}
      </form>

      {/* Resultado da busca */}
      {solicitacao && (
        <div style={{
          backgroundColor: '#ffffff',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          {/* Número de rastreamento */}
          <div style={{
            marginBottom: '20px',
            padding: '15px',
            backgroundColor: '#f0f0f0',
            borderRadius: '6px',
            borderLeft: `4px solid ${statusCores[solicitacao.status]}`,
          }}>
            <div style={{
              fontSize: '12px',
              color: '#666',
              marginBottom: '4px',
            }}>
              Número de Rastreamento
            </div>
            <div style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#333',
              fontFamily: 'monospace',
            }}>
              {solicitacao.numero_rastreamento}
            </div>
          </div>

          {/* Status atual */}
          <div style={{
            marginBottom: '30px',
            padding: '20px',
            backgroundColor: statusCores[solicitacao.status],
            color: '#ffffff',
            borderRadius: '8px',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '36px',
              marginBottom: '10px',
            }}>
              {statusIcons[solicitacao.status]}
            </div>
            <div style={{
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '8px',
            }}>
              {solicitacao.status}
            </div>
            {solicitacao.orgao_competente && (
              <div style={{
                fontSize: '14px',
                marginTop: '8px',
                opacity: 0.9,
              }}>
                Órgão: {solicitacao.orgao_competente}
              </div>
            )}
            {solicitacao.justificativa_rejeicao && (
              <div style={{
                fontSize: '14px',
                marginTop: '8px',
                opacity: 0.9,
              }}>
                Motivo: {solicitacao.justificativa_rejeicao}
              </div>
            )}
          </div>

          {/* Informações da solicitação */}
          <div style={{
            marginBottom: '30px',
            padding: '20px',
            backgroundColor: '#f9f9f9',
            borderRadius: '6px',
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#333' }}>Informações da Solicitação</h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '15px',
            }}>
              <div>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Bairro</div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>{solicitacao.bairro}</div>
              </div>
              
              <div>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Rua</div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>{solicitacao.rua}</div>
              </div>

              <div>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Número</div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>{solicitacao.numero || 'S/N'}</div>
              </div>

              <div>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>CEP</div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>{solicitacao.cep}</div>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Descrição</div>
                <div style={{ fontSize: '14px', color: '#333', lineHeight: '1.5' }}>{solicitacao.descricao}</div>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Data da Solicitação</div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>
                  {new Date(solicitacao.created_at).toLocaleDateString('pt-BR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Coordenadas</div>
                <div style={{ fontSize: '12px', color: '#333', fontFamily: 'monospace' }}>
                  Lat: {solicitacao.latitude.toFixed(6)}, Lng: {solicitacao.longitude.toFixed(6)}
                </div>
              </div>
            </div>
          </div>

          {/* Histórico de atualizações */}
          {historico.length > 0 && (
            <div style={{
              marginBottom: '20px',
            }}>
              <h3 style={{ marginBottom: '15px', color: '#333' }}>Histórico de Atualizações</h3>
              <div style={{
                borderLeft: '3px solid #ddd',
                paddingLeft: '20px',
              }}>
                {historico.map((evento, index) => (
                  <div key={index} style={{
                    marginBottom: '20px',
                    paddingBottom: '15px',
                    borderBottom: index < historico.length - 1 ? '1px solid #eee' : 'none',
                  }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#333',
                      marginBottom: '4px',
                    }}>
                      {evento.status_novo}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#666',
                      marginBottom: '8px',
                    }}>
                      {new Date(evento.created_at).toLocaleDateString('pt-BR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    {evento.orgao_competente && (
                      <div style={{
                        fontSize: '12px',
                        color: '#555',
                      }}>
                        <strong>Órgão:</strong> {evento.orgao_competente}
                      </div>
                    )}
                    {evento.justificativa && (
                      <div style={{
                        fontSize: '12px',
                        color: '#555',
                        marginTop: '4px',
                      }}>
                        <strong>Observação:</strong> {evento.justificativa}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!solicitacao && !error && !loading && (
        <div style={{
          padding: '60px 20px',
          textAlign: 'center',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          color: '#999',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
          <div style={{ fontSize: '16px' }}>
            Digite o número de rastreamento para acompanhar sua solicitação
          </div>
        </div>
      )}
    </div>
  );
}
