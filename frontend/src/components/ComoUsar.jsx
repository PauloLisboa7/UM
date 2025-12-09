import { useState } from 'react';
import PainelAcompanhamento from './PainelAcompanhamento';
import MapaOcorrenciasPublico from './MapaOcorrenciasPublico';

export default function ComoUsar() {
  const [abaAtiva, setAbaAtiva] = useState('tutorial');

  return (
    <div style={{
      padding: '40px',
      maxWidth: '1400px',
      margin: '0 auto',
    }}>
      {/* Abas */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '30px',
        borderBottom: '2px solid #ddd',
        overflowX: 'auto',
      }}>
        <button
          onClick={() => setAbaAtiva('tutorial')}
          style={{
            padding: '12px 24px',
            border: 'none',
            backgroundColor: abaAtiva === 'tutorial' ? '#ff8c00' : '#f0f0f0',
            color: abaAtiva === 'tutorial' ? '#ffffff' : '#333',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            borderRadius: '4px 4px 0 0',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => {
            if (abaAtiva !== 'tutorial') {
              e.target.style.backgroundColor = '#e0e0e0';
            }
          }}
          onMouseLeave={(e) => {
            if (abaAtiva !== 'tutorial') {
              e.target.style.backgroundColor = '#f0f0f0';
            }
          }}
        >
          📖 Tutorial
        </button>

        <button
          onClick={() => setAbaAtiva('acompanhamento')}
          style={{
            padding: '12px 24px',
            border: 'none',
            backgroundColor: abaAtiva === 'acompanhamento' ? '#ff8c00' : '#f0f0f0',
            color: abaAtiva === 'acompanhamento' ? '#ffffff' : '#333',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            borderRadius: '4px 4px 0 0',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => {
            if (abaAtiva !== 'acompanhamento') {
              e.target.style.backgroundColor = '#e0e0e0';
            }
          }}
          onMouseLeave={(e) => {
            if (abaAtiva !== 'acompanhamento') {
              e.target.style.backgroundColor = '#f0f0f0';
            }
          }}
        >
          🔍 Acompanhar Solicitação
        </button>

        <button
          onClick={() => setAbaAtiva('mapa')}
          style={{
            padding: '12px 24px',
            border: 'none',
            backgroundColor: abaAtiva === 'mapa' ? '#ff8c00' : '#f0f0f0',
            color: abaAtiva === 'mapa' ? '#ffffff' : '#333',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            borderRadius: '4px 4px 0 0',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => {
            if (abaAtiva !== 'mapa') {
              e.target.style.backgroundColor = '#e0e0e0';
            }
          }}
          onMouseLeave={(e) => {
            if (abaAtiva !== 'mapa') {
              e.target.style.backgroundColor = '#f0f0f0';
            }
          }}
        >
          🗺️ Mapa de Ocorrências
        </button>
      </div>

      {/* Conteúdo das abas */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}>
        {abaAtiva === 'tutorial' && (
          <div style={{
            padding: '40px',
          }}>
            <h2 style={{ marginTop: 0, color: '#333' }}>Como Usar a Plataforma</h2>

            {/* Seção 1: Como fazer uma solicitação */}
            <div style={{
              marginBottom: '40px',
              paddingBottom: '40px',
              borderBottom: '1px solid #eee',
            }}>
              <h3 style={{ color: '#ff8c00', marginBottom: '15px' }}>Passo 1: Como Fazer uma Solicitação</h3>
              <div style={{
                backgroundColor: '#f9f9f9',
                padding: '20px',
                borderRadius: '6px',
                lineHeight: '1.8',
                color: '#555',
              }}>
                <ol style={{
                  paddingLeft: '20px',
                  margin: 0,
                }}>
                  <li style={{ marginBottom: '12px' }}>
                    <strong>Faça login</strong> na sua conta ou crie uma nova conta
                  </li>
                  <li style={{ marginBottom: '12px' }}>
                    <strong>Acesse a aba "Solicitar Reclamação"</strong> no menu principal
                  </li>
                  <li style={{ marginBottom: '12px' }}>
                    <strong>Descreva o problema</strong> que você encontrou na rua (buracos, lixo, estruturas danificadas, etc)
                  </li>
                  <li style={{ marginBottom: '12px' }}>
                    <strong>Digite o CEP</strong> do local onde o problema ocorreu. O sistema preencherá automaticamente a rua e o bairro
                  </li>
                  <li style={{ marginBottom: '12px' }}>
                    <strong>Adicione o número</strong> da casa ou estabelecimento (opcional)
                  </li>
                  <li style={{ marginBottom: '12px' }}>
                    <strong>Anexe fotos</strong> do problema para comprovar a situação
                  </li>
                  <li style={{ marginBottom: '12px' }}>
                    <strong>Clique no mapa</strong> ao lado para marcar a localização exata do problema (latitude/longitude)
                  </li>
                  <li style={{ marginBottom: '12px' }}>
                    <strong>Envie sua solicitação</strong> e anote o número de rastreamento fornecido
                  </li>
                </ol>
              </div>
            </div>

            {/* Seção 2: Status das solicitações */}
            <div style={{
              marginBottom: '40px',
              paddingBottom: '40px',
              borderBottom: '1px solid #eee',
            }}>
              <h3 style={{ color: '#ff8c00', marginBottom: '15px' }}>📊 Passo 2: Entenda os Status das Solicitações</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px',
              }}>
                <div style={{
                  backgroundColor: '#FFE6E6',
                  padding: '15px',
                  borderRadius: '6px',
                  borderLeft: '4px solid #FF6B6B',
                }}>
                  <div style={{ fontWeight: '600', color: '#FF6B6B', marginBottom: '8px' }}>Enviada/Em Análise</div>
                  <div style={{ fontSize: '14px', color: '#555' }}>
                    Sua solicitação foi recebida e está sendo analisada pelos responsáveis
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#FFF0E6',
                  padding: '15px',
                  borderRadius: '6px',
                  borderLeft: '4px solid #FFA500',
                }}>
                  <div style={{ fontWeight: '600', color: '#FFA500', marginBottom: '8px' }}>Repassada ao Órgão Competente</div>
                  <div style={{ fontSize: '14px', color: '#555' }}>
                    O problema foi repassado ao órgão responsável pela solução
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#FFFACC',
                  padding: '15px',
                  borderRadius: '6px',
                  borderLeft: '4px solid #FFD700',
                }}>
                  <div style={{ fontWeight: '600', color: '#FFD700', marginBottom: '8px' }}>Em Execução/Serviço Agendado</div>
                  <div style={{ fontSize: '14px', color: '#555' }}>
                    O serviço foi agendado ou está em execução neste momento
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#E6F4E6',
                  padding: '15px',
                  borderRadius: '6px',
                  borderLeft: '4px solid #4CAF50',
                }}>
                  <div style={{ fontWeight: '600', color: '#4CAF50', marginBottom: '8px' }}>Concluída/Resolvida</div>
                  <div style={{ fontSize: '14px', color: '#555' }}>
                    O problema foi resolvido. Obrigado por contribuir com São Luís!
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#F0F0F0',
                  padding: '15px',
                  borderRadius: '6px',
                  borderLeft: '4px solid #9E9E9E',
                  gridColumn: '1 / 2',
                }}>
                  <div style={{ fontWeight: '600', color: '#9E9E9E', marginBottom: '8px' }}>❌ Rejeitada</div>
                  <div style={{ fontSize: '14px', color: '#555' }}>
                    A solicitação foi rejeitada. Verifique o motivo na descrição
                  </div>
                </div>
              </div>
            </div>

            {/* Seção 3: Como acompanhar */}
            <div style={{
              marginBottom: '40px',
              paddingBottom: '40px',
              borderBottom: '1px solid #eee',
            }}>
              <h3 style={{ color: '#ff8c00', marginBottom: '15px' }}>🔍 Passo 3: Como Acompanhar sua Solicitação</h3>
              <div style={{
                backgroundColor: '#f9f9f9',
                padding: '20px',
                borderRadius: '6px',
                lineHeight: '1.8',
                color: '#555',
              }}>
                <ol style={{
                  paddingLeft: '20px',
                  margin: 0,
                }}>
                  <li style={{ marginBottom: '12px' }}>
                    <strong>Acesse a aba "Acompanhar Solicitação"</strong> nesta página
                  </li>
                  <li style={{ marginBottom: '12px' }}>
                    <strong>Digite o número de rastreamento</strong> que você recebeu ao enviar a solicitação
                  </li>
                  <li style={{ marginBottom: '12px' }}>
                    <strong>Clique em "Buscar"</strong> para ver o status atual
                  </li>
                  <li style={{ marginBottom: '12px' }}>
                    <strong>Acompanhe o histórico</strong> de todas as atualizações da sua solicitação
                  </li>
                </ol>
              </div>
            </div>

            {/* Seção 4: Mapa público */}
            <div>
              <h3 style={{ color: '#ff8c00', marginBottom: '15px' }}>🗺️ Passo 4: Visualize o Mapa de Ocorrências</h3>
              <div style={{
                backgroundColor: '#f9f9f9',
                padding: '20px',
                borderRadius: '6px',
                lineHeight: '1.8',
                color: '#555',
              }}>
                <p>
                  <strong>Acesse a aba "Mapa de Ocorrências"</strong> para visualizar todas as solicitações em um mapa interativo.
                </p>
                <p>
                  Os pontos no mapa são coloridos de acordo com o status:
                </p>
                <ul style={{
                  paddingLeft: '20px',
                  margin: 0,
                }}>
                  <li>🔴 <strong>Vermelho</strong> = Enviada/Em Análise</li>
                  <li>🟠 <strong>Laranja</strong> = Repassada ao Órgão Competente</li>
                  <li>🟡 <strong>Amarelo</strong> = Em Execução/Serviço Agendado</li>
                  <li>🟢 <strong>Verde</strong> = Concluída/Resolvida</li>
                  <li>⚫ <strong>Cinza</strong> = Rejeitada</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {abaAtiva === 'acompanhamento' && (
          <PainelAcompanhamento />
        )}

        {abaAtiva === 'mapa' && (
          <MapaOcorrenciasPublico />
        )}
      </div>
    </div>
  );
}
