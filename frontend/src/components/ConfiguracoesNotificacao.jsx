import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/ConfiguracoesNotificacao.css';

export default function ConfiguracoesNotificacao() {
  const { user } = useAuth();
  const [configuracoes, setConfiguracoes] = useState({
    alertasTrafego: true,
    alertasClima: true,
    alertasColeta: true,
    alertasManutencao: true,
    apenasArredores: false,
    raioKm: 500,
    bairro: '',
  });
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    carregarConfiguracoes();
  }, [user]);

  const carregarConfiguracoes = async () => {
    if (!user) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/usuarios/configuracoes-notificacao', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setConfiguracoes({
          ...configuracoes,
          ...data,
        });
      }
    } catch (err) {
      console.error('Erro ao carregar configurações:', err);
    }
  };

  const handleToggle = (chave) => {
    setConfiguracoes({
      ...configuracoes,
      [chave]: !configuracoes[chave],
    });
  };

  const handleChange = (chave, valor) => {
    setConfiguracoes({
      ...configuracoes,
      [chave]: valor,
    });
  };

  const salvarConfiguracoes = async () => {
    if (!user) return;

    try {
      setSalvando(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/usuarios/configuracoes-notificacao', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(configuracoes),
      });

      if (response.ok) {
        setMensagem('✓ Configurações salvas com sucesso!');
        setTimeout(() => setMensagem(''), 3000);
      } else {
        setMensagem('✗ Erro ao salvar configurações');
      }
    } catch (err) {
      console.error('Erro:', err);
      setMensagem('✗ Erro ao salvar configurações');
    } finally {
      setSalvando(false);
    }
  };

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

  return (
    <div className="config-notificacao-container">
      <div className="config-header">
        <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 8px 0', color: '#333' }}>
          Configurações de Notificação
        </h2>
        <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
          Personalize quais alertas você deseja receber
        </p>
      </div>

      {mensagem && (
        <div style={{
          padding: '12px 16px',
          backgroundColor: mensagem.includes('✓') ? '#E8F5E9' : '#FFEBEE',
          color: mensagem.includes('✓') ? '#2E7D32' : '#C62828',
          borderRadius: '8px',
          marginBottom: '20px',
          fontSize: '14px',
        }}>
          {mensagem}
        </div>
      )}

      {/* Seção 1: Tipos de Alertas */}
      <div className="config-section">
        <h3 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 16px 0', color: '#333' }}>
          Tipos de Alertas
        </h3>
        <p style={{ fontSize: '13px', color: '#666', marginBottom: '16px' }}>
          Escolha quais categorias de alertas você quer receber:
        </p>

        <div className="config-option">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="checkbox"
              id="alertasTrafego"
              checked={configuracoes.alertasTrafego}
              onChange={() => handleToggle('alertasTrafego')}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <label htmlFor="alertasTrafego" style={{ cursor: 'pointer', flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>🚗 Alertas de Trânsito</div>
              <div style={{ fontSize: '12px', color: '#999' }}>Alterações de trânsito e bloqueios</div>
            </label>
          </div>
        </div>

        <div className="config-option">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="checkbox"
              id="alertasClima"
              checked={configuracoes.alertasClima}
              onChange={() => handleToggle('alertasClima')}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <label htmlFor="alertasClima" style={{ cursor: 'pointer', flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>⛈️ Alertas Climáticos</div>
              <div style={{ fontSize: '12px', color: '#999' }}>Chuvas fortes, tempestades e avisos meteorológicos</div>
            </label>
          </div>
        </div>

        <div className="config-option">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="checkbox"
              id="alertasColeta"
              checked={configuracoes.alertasColeta}
              onChange={() => handleToggle('alertasColeta')}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <label htmlFor="alertasColeta" style={{ cursor: 'pointer', flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>♻️ Cronograma de Coleta</div>
              <div style={{ fontSize: '12px', color: '#999' }}>Coleta de lixo e reciclagem</div>
            </label>
          </div>
        </div>

        <div className="config-option">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="checkbox"
              id="alertasManutencao"
              checked={configuracoes.alertasManutencao}
              onChange={() => handleToggle('alertasManutencao')}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <label htmlFor="alertasManutencao" style={{ cursor: 'pointer', flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>💡 Manutenção Pública</div>
              <div style={{ fontSize: '12px', color: '#999' }}>Intervenções de iluminação, água e energia</div>
            </label>
          </div>
        </div>
      </div>

      {/* Seção 2: Filtro por Bairro */}
      <div className="config-section">
        <h3 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 16px 0', color: '#333' }}>
          📍 Alertas do Meu Bairro
        </h3>
        <p style={{ fontSize: '13px', color: '#666', marginBottom: '16px' }}>
          Receba alertas apenas de uma região específica:
        </p>

        <div className="config-option">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="checkbox"
              id="apenasArredores"
              checked={configuracoes.apenasArredores}
              onChange={() => handleToggle('apenasArredores')}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <label htmlFor="apenasArredores" style={{ cursor: 'pointer', flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                Apenas alertas do meu bairro
              </div>
            </label>
          </div>
        </div>

        {configuracoes.apenasArredores && (
          <>
            <div style={{ marginTop: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 500, color: '#333', display: 'block', marginBottom: '8px' }}>
                Selecione seu bairro:
              </label>
              <select
                value={configuracoes.bairro}
                onChange={(e) => handleChange('bairro', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#333',
                  cursor: 'pointer',
                }}
              >
                <option value="">Escolha um bairro...</option>
                {bairros.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div style={{ marginTop: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 500, color: '#333', display: 'block', marginBottom: '8px' }}>
                Raio de abrangência: {configuracoes.raioKm}m
              </label>
              <input
                type="range"
                min="100"
                max="1000"
                step="100"
                value={configuracoes.raioKm}
                onChange={(e) => handleChange('raioKm', parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
              <div style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
                Receba alertas em um raio de {configuracoes.raioKm}m do seu bairro
              </div>
            </div>
          </>
        )}
      </div>

      {/* Botão Salvar */}
      <div style={{ marginTop: '32px', textAlign: 'right' }}>
        <button
          onClick={salvarConfiguracoes}
          disabled={salvando}
          style={{
            padding: '12px 32px',
            backgroundColor: '#FF8C00',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: salvando ? 'not-allowed' : 'pointer',
            opacity: salvando ? 0.7 : 1,
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            if (!salvando) e.target.style.backgroundColor = '#E67E00';
          }}
          onMouseLeave={(e) => {
            if (!salvando) e.target.style.backgroundColor = '#FF8C00';
          }}
        >
          {salvando ? '💾 Salvando...' : '💾 Salvar Configurações'}
        </button>
      </div>
    </div>
  );
}
