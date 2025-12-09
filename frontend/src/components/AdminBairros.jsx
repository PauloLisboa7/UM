import { useState, useEffect } from 'react';
import api from '../services/api';

const BAIRROS_SL = [
  'Centro',
  'Praia Grande',
  'Ponta da Areia',
  'Calhau',
  'São Francisco',
  'Liberdade',
  'Bacanga',
  'Vila Passos',
  'Cohafama',
  'Bequimão',
];

const TIPOS_ALERTA = ['trânsito', 'energia', 'coleta', 'manutenção', 'saúde', 'segurança'];

export default function AdminBairros() {
  const [alertasBairro, setAertasBairro] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filtroBairro, setFiltroBairro] = useState('Centro');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    bairro: 'Centro',
    titulo: '',
    descricao: '',
    tipo: 'trânsito',
    localidade_especifica: '',
  });

  useEffect(() => {
    carregarAertasBairro();
  }, []);

  const carregarAertasBairro = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/admin/alertas-bairro');
      setAertasBairro(response.data.alertas || []);
      setError('');
    } catch (err) {
      console.error('Erro ao carregar alertas:', err);
      // Aceitar lista vazia se houver erro
      setAertasBairro([]);
      setError('');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.titulo || !formData.descricao) {
      setError('Título e descrição são obrigatórios');
      return;
    }

    try {
      if (editingId) {
        await api.put(`/api/admin/alertas-bairro/${editingId}`, formData);
        setSuccess('Alerta atualizado com sucesso!');
      } else {
        await api.post('/api/admin/alertas-bairro', formData);
        setSuccess('Alerta criado com sucesso!');
      }
      
      setFormData({
        bairro: 'Centro',
        titulo: '',
        descricao: '',
        tipo: 'trânsito',
        localidade_especifica: '',
      });
      setEditingId(null);
      setShowForm(false);
      carregarAertasBairro();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erro ao salvar alerta: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleEdit = (alerta) => {
    setFormData({
      bairro: alerta.bairro,
      titulo: alerta.titulo,
      descricao: alerta.descricao,
      tipo: alerta.tipo || 'trânsito',
      localidade_especifica: alerta.localidade_especifica || '',
    });
    setEditingId(alerta.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar este alerta?')) return;

    try {
      await api.delete(`/api/admin/alertas-bairro/${id}`);
      setSuccess('Alerta deletado com sucesso!');
      carregarAertasBairro();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erro ao deletar alerta: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleCancel = () => {
    setFormData({
      bairro: 'Centro',
      titulo: '',
      descricao: '',
      tipo: 'trânsito',
      localidade_especifica: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const alertasFiltradas = alertasBairro.filter(a => 
    !filtroBairro || a.bairro === filtroBairro
  );

  const getTipoColor = (tipo) => {
    const colors = {
      'trânsito': '#FF8C00',
      'energia': '#FFD700',
      'coleta': '#4CAF50',
      'manutenção': '#9C27B0',
      'saúde': '#2196F3',
      'segurança': '#f44336',
    };
    return colors[tipo] || '#999';
  };

  const stats = {
    total: alertasBairro.length,
    porBairro: {},
  };

  alertasBairro.forEach(alerta => {
    stats.porBairro[alerta.bairro] = (stats.porBairro[alerta.bairro] || 0) + 1;
  });

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', color: '#333' }}>Gerenciar Alertas por Bairro</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#FF8C00',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'background 0.3s',
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#E57C00'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#FF8C00'}
        >
          {showForm ? '❌ Cancelar' : '➕ Novo Alerta'}
        </button>
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

      {/* ESTATÍSTICAS */}
      <div style={{
        backgroundColor: '#f9f9f9',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #e0e0e0',
      }}>
        <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>
          Total: {stats.total} alertas
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px' }}>
          {BAIRROS_SL.map(bairro => (
            <div key={bairro} style={{ fontSize: '13px', color: '#666' }}>
              <strong>{bairro}:</strong> {stats.porBairro[bairro] || 0}
            </div>
          ))}
        </div>
      </div>

      {/* FORMULÁRIO */}
      {showForm && (
        <div style={{
          backgroundColor: '#f9f9f9',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '30px',
          border: '1px solid #e0e0e0',
        }}>
          <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>
            {editingId ? 'Editar Alerta' : 'Criar Novo Alerta por Bairro'}
          </h3>
          
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Bairro *
                </label>
                <select
                  name="bairro"
                  value={formData.bairro}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                  }}
                >
                  {BAIRROS_SL.map(bairro => (
                    <option key={bairro} value={bairro}>{bairro}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Tipo de Alerta *
                </label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                  }}
                >
                  {TIPOS_ALERTA.map(tipo => (
                    <option key={tipo} value={tipo}>
                      {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Título *
              </label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleInputChange}
                placeholder="Ex: Problema de água quente na região"
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

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Descrição *
              </label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                placeholder="Descreva o alerta com detalhes"
                rows="4"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Localidade Específica
              </label>
              <input
                type="text"
                name="localidade_especifica"
                value={formData.localidade_especifica}
                onChange={handleInputChange}
                placeholder="Ex: Rua da Paz, próximo à Escola Estadual"
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

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="submit"
                style={{
                  padding: '12px 24px',
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
                type="button"
                onClick={handleCancel}
                style={{
                  padding: '12px 24px',
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
          </form>
        </div>
      )}

      {/* FILTRO */}
      <div style={{
        backgroundColor: '#f9f9f9',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #e0e0e0',
      }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
          Filtrar por Bairro:
        </label>
        <select
          value={filtroBairro}
          onChange={(e) => setFiltroBairro(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '300px',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '14px',
          }}
        >
          <option value="">Todos os Bairros</option>
          {BAIRROS_SL.map(bairro => (
            <option key={bairro} value={bairro}>{bairro}</option>
          ))}
        </select>
      </div>

      {/* LISTA DE ALERTAS */}
      {loading ? (
        <div style={{ textAlign: 'center', color: '#999' }}>Carregando alertas...</div>
      ) : alertasFiltradas.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          color: '#999', 
          padding: '40px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          border: '2px dashed #ddd'
        }}>
          <p style={{ margin: '10px 0' }}>📍 Nenhum alerta encontrado para este bairro.</p>
          <p style={{ margin: '10px 0', fontSize: '13px' }}>Clique em "Novo Alerta" para criar um aviso específico do bairro.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {alertasFiltradas.map(alerta => (
            <div
              key={alerta.id}
              style={{
                backgroundColor: '#fff',
                border: `3px solid ${getTipoColor(alerta.tipo)}`,
                borderRadius: '8px',
                padding: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s, box-shadow 0.3s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{ marginBottom: '12px' }}>
                <div style={{
                  display: 'inline-block',
                  padding: '4px 8px',
                  backgroundColor: getTipoColor(alerta.tipo),
                  color: '#fff',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '600',
                  marginRight: '8px',
                }}>
                  {alerta.tipo.toUpperCase()}
                </div>
                <div style={{
                  display: 'inline-block',
                  padding: '4px 8px',
                  backgroundColor: '#f0f0f0',
                  color: '#333',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '600',
                }}>
                  📍 {alerta.bairro}
                </div>
              </div>

              <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#333' }}>
                {alerta.titulo}
              </h4>

              <p style={{ fontSize: '14px', color: '#666', marginBottom: '12px', lineHeight: '1.5' }}>
                {alerta.descricao}
              </p>

              {alerta.localidade_especifica && (
                <p style={{ fontSize: '12px', color: '#999', marginBottom: '12px' }}>
                  📌 {alerta.localidade_especifica}
                </p>
              )}

              <p style={{ fontSize: '11px', color: '#bbb', marginBottom: '16px' }}>
                Criado em: {new Date(alerta.created_at).toLocaleDateString('pt-BR')}
              </p>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleEdit(alerta)}
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
                  onClick={() => handleDelete(alerta.id)}
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
          ))}
        </div>
      )}
    </div>
  );
}
