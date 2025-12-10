import { useEffect, useState } from 'react';
import api from '../services/api';

const TIPOS_ALERTA = [
  { id: 'trânsito', label: 'Alertas de Trânsito', icon: '🚦' },
  { id: 'climático', label: 'Alertas Climáticos', icon: '🌤️' },
  { id: 'coleta', label: 'Alertas de Coleta', icon: '♻️' },
  { id: 'manutenção', label: 'Alertas de Manutenção', icon: '🔧' },
];

const BAIRROS_SL = [
  'Centro',
  'Praia Grande',
  'Ponta da Areia',
  'Calhau',
  'São Francisco',
  'Liberdade',
  'Bacanga',
  'Vila Passos',
  'Vila Palmeira',
  'Cohafama',
  'Bequimão',
];

export default function AdminConfiguracoes() {
  const [configuracoes, setConfiguracoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchUsuario, setSearchUsuario] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    tipos_alerta: [],
    apenas_bairro: false,
    bairro: '',
    raio: 500,
  });

  useEffect(() => {
    carregarConfiguracoes();
  }, []);

  const carregarConfiguracoes = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/configuracoes-notificacao');
      setConfiguracoes(response.data.configuracoes || []);
      setError('');
    } catch (err) {
      console.error('Erro ao carregar configurações:', err);
      // Aceitar lista vazia se houver erro
      setConfiguracoes([]);
      setError('');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (config) => {
    setEditForm({
      tipos_alerta: config.tipos_alerta || [],
      apenas_bairro: config.apenas_bairro || false,
      bairro: config.bairro || '',
      raio: config.raio || 500,
    });
    setEditingId(config.usuario_id);
    setExpandedId(config.usuario_id);
  };

  const handleSaveEdit = async () => {
    try {
      await api.put(`/admin/configuracoes-notificacao/${editingId}`, editForm);
      setSuccess('Configuração atualizada com sucesso!');
      setEditingId(null);
      carregarConfiguracoes();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erro ao atualizar: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleCheckboxChange = (tipo) => {
    setEditForm(prev => ({
      ...prev,
      tipos_alerta: prev.tipos_alerta.includes(tipo)
        ? prev.tipos_alerta.filter(t => t !== tipo)
        : [...prev.tipos_alerta, tipo]
    }));
  };

  const handleDelete = async (usuarioId) => {
    if (!window.confirm('Deletar configurações deste usuário?')) return;

    try {
      await api.delete(`/admin/configuracoes-notificacao/${usuarioId}`);
      setSuccess('Configuração deletada com sucesso!');
      carregarConfiguracoes();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erro ao deletar: ' + (err.response?.data?.error || err.message));
    }
  };

  const configuracoesFiltradas = configuracoes.filter(config =>
    !searchUsuario ||
    config.usuario_nome?.toLowerCase().includes(searchUsuario.toLowerCase()) ||
    config.usuario_email?.toLowerCase().includes(searchUsuario.toLowerCase())
  );

  const stats = {
    total: configuracoes.length,
    apenasBairro: configuracoes.filter(c => c.apenas_bairro).length,
    coberturaTodaCidade: configuracoes.length - configuracoes.filter(c => c.apenas_bairro).length,
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ fontSize: '20px', color: '#333', marginBottom: '20px' }}>
        Configurações de Notificação dos Usuários
      </h2>

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
            Usuários com Notificações
          </div>
        </div>

        <div style={{
          backgroundColor: '#fff',
          padding: '15px',
          borderRadius: '8px',
          border: '2px solid #2196F3',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2196F3' }}>
            {stats.apenasBairro}
          </div>
          <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
            Apenas Bairro
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
            {stats.coberturaTodaCidade}
          </div>
          <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
            Cobertura Toda Cidade
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

      {/* BUSCA */}
      <div style={{
        backgroundColor: '#f9f9f9',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #e0e0e0',
      }}>
        <input
          type="text"
          value={searchUsuario}
          onChange={(e) => setSearchUsuario(e.target.value)}
          placeholder="Buscar por nome ou email do usuário"
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '14px',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* LISTA */}
      {loading ? (
        <div style={{ textAlign: 'center', color: '#999', padding: '40px' }}>
          Carregando configurações...
        </div>
      ) : configuracoesFiltradas.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          color: '#999', 
          padding: '40px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          border: '2px dashed #ddd'
        }}>
          <p style={{ margin: '10px 0' }}>Nenhuma configuração encontrada.</p>
          <p style={{ margin: '10px 0', fontSize: '13px' }}>As configurações de notificação dos usuários aparecerão aqui.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {configuracoesFiltradas.map(config => (
            <div
              key={config.usuario_id}
              style={{
                backgroundColor: '#fff',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '16px',
                transition: 'all 0.3s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {editingId === config.usuario_id ? (
                // MODO EDIÇÃO
                <div>
                  <h4 style={{ marginBottom: '15px', fontSize: '16px', fontWeight: '600' }}>
                    Editando: {config.usuario_nome}
                  </h4>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>
                      Tipos de Alerta:
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
                      {TIPOS_ALERTA.map(tipo => (
                        <label key={tipo.id} style={{ display: 'flex', gap: '8px', alignItems: 'center', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={editForm.tipos_alerta.includes(tipo.id)}
                            onChange={() => handleCheckboxChange(tipo.id)}
                            style={{ cursor: 'pointer' }}
                          />
                          <span>{tipo.icon} {tipo.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'flex', gap: '8px', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={editForm.apenas_bairro}
                        onChange={(e) => setEditForm(prev => ({ ...prev, apenas_bairro: e.target.checked }))}
                        style={{ cursor: 'pointer' }}
                      />
                      <span style={{ fontWeight: '500' }}>Apenas Alertas do Meu Bairro</span>
                    </label>
                  </div>

                  {editForm.apenas_bairro && (
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                        Bairro:
                      </label>
                      <select
                        value={editForm.bairro}
                        onChange={(e) => setEditForm(prev => ({ ...prev, bairro: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #ddd',
                          borderRadius: '6px',
                          fontSize: '14px',
                          boxSizing: 'border-box',
                        }}
                      >
                        <option value="">Selecione um bairro</option>
                        {BAIRROS_SL.map(bairro => (
                          <option key={bairro} value={bairro}>{bairro}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                      Raio de Cobertura: {editForm.raio}m
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="1000"
                      step="100"
                      value={editForm.raio}
                      onChange={(e) => setEditForm(prev => ({ ...prev, raio: parseInt(e.target.value) }))}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={handleSaveEdit}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#4CAF50',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        transition: 'background 0.3s',
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
                    >
                      💾 Salvar
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#999',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        transition: 'background 0.3s',
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#777'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#999'}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                // MODO VISUALIZAÇÃO
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                    <div>
                      <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>
                        {config.usuario_nome}
                      </h4>
                      <p style={{ fontSize: '13px', color: '#999', marginBottom: '8px' }}>
                        {config.usuario_email}
                      </p>
                    </div>
                    <span style={{
                      padding: '4px 8px',
                      backgroundColor: config.apenas_bairro ? '#2196F3' : '#4CAF50',
                      color: '#fff',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}>
                      {config.apenas_bairro ? `${config.bairro} (${config.raio}m)` : 'Toda Cidade'}
                    </span>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <span style={{ fontWeight: '500', fontSize: '14px' }}>Alertas: </span>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                      {config.tipos_alerta && config.tipos_alerta.length > 0 ? (
                        config.tipos_alerta.map(tipo => {
                          const tipoObj = TIPOS_ALERTA.find(t => t.id === tipo);
                          return (
                            <span key={tipo} style={{
                              padding: '4px 8px',
                              backgroundColor: '#f0f0f0',
                              borderRadius: '4px',
                              fontSize: '13px',
                            }}>
                              {tipoObj?.icon} {tipoObj?.label}
                            </span>
                          );
                        })
                      ) : (
                        <span style={{ fontSize: '13px', color: '#999' }}>Nenhum tipo selecionado</span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleEdit(config)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        backgroundColor: '#2196F3',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '600',
                        transition: 'background 0.3s',
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#0b7dda'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#2196F3'}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleDelete(config.usuario_id)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        backgroundColor: '#f44336',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '600',
                        transition: 'background 0.3s',
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#da190b'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#f44336'}
                    >
                      🗑️ Deletar
                    </button>
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
