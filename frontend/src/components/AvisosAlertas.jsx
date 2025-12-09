import { useState, useEffect } from 'react';
import '../styles/AvisosAlertas.css';

export default function AvisosAlertas() {
  const [avisos, setAvisos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState(null);

  // Buscar avisos do arquivo JSON
  useEffect(() => {
    const carregarAvisos = async () => {
      try {
        setCarregando(true);
        const response = await fetch('/data/avisos-alertas.json');
        if (!response.ok) throw new Error('Erro ao carregar avisos');
        
        const data = await response.json();
        setAvisos(data.avisos || []);
        setUltimaAtualizacao(new Date(data.ultimaAtualizacao));
        setErro(null);
      } catch (err) {
        console.error('Erro ao carregar avisos:', err);
        setErro('Não foi possível carregar os avisos');
        setAvisos([]);
      } finally {
        setCarregando(false);
      }
    };

    carregarAvisos();

    // Atualizar a cada 24 horas (86400000 ms)
    const intervalo = setInterval(carregarAvisos, 24 * 60 * 60 * 1000);

    return () => clearInterval(intervalo);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'urgente':
        return '#F44336';
      case 'alerta':
        return '#FF9800';
      case 'aviso':
        return '#FFC107';
      case 'informação':
        return '#2196F3';
      default:
        return '#666';
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours === 0) return `há ${minutes}m`;
    if (hours === 1) return 'há 1 hora';
    if (hours < 24) return `há ${hours}h`;
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="avisos-alertas-container">
      <div className="avisos-header">
        <h2 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 8px 0', color: '#333' }}>
          Avisos e Alertas da Cidade
        </h2>
        <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
          Mantenha-se informado sobre eventos importantes em São Luís
        </p>
        {ultimaAtualizacao && (
          <p style={{ fontSize: '12px', color: '#999', margin: '8px 0 0 0' }}>
            ✓ Última atualização: {ultimaAtualizacao.toLocaleString('pt-BR')}
          </p>
        )}
      </div>

      {carregando ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <p>Carregando avisos...</p>
        </div>
      ) : erro ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#F44336' }}>
          <p>{erro}</p>
        </div>
      ) : avisos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <p>Nenhum aviso no momento. Tudo bem na cidade! ✨</p>
        </div>
      ) : (
        <div className="avisos-grid">
          {avisos.map((aviso) => (
            <div
              key={aviso.id}
              className="aviso-card"
              style={{
                borderLeft: `4px solid ${getStatusColor(aviso.status)}`,
              }}
            >
              <div className="aviso-header">
                <div className="aviso-icon" style={{ fontSize: '24px' }}>
                  {aviso.icon}
                </div>
                <div className="aviso-meta">
                  <span
                    className="aviso-tipo"
                    style={{
                      backgroundColor: getStatusColor(aviso.status),
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                    }}
                  >
                    {aviso.status}
                  </span>
                  <span style={{ fontSize: '12px', color: '#999', marginLeft: '8px' }}>
                    {formatTime(new Date(aviso.data))}
                  </span>
                </div>
              </div>

              <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '12px 0 8px 0', color: '#333' }}>
              {aviso.titulo}
            </h3>

            <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.6, margin: '0 0 8px 0' }}>
              {aviso.descricao}
            </p>

            {aviso.localidade && (
              <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>
                Local: {aviso.localidade}
              </p>
            )}
          </div>
        ))}
      </div>
      )}
    </div>
  );
}
