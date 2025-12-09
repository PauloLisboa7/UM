import { useState, useEffect } from 'react';
import api from '../services/api';

const TIPOS_ALERTA = [
  { id: 'trânsito', label: 'Trânsito', icon: '🚦' },
  { id: 'energia', label: 'Energia', icon: '⚡' },
  { id: 'coleta', label: 'Coleta de Lixo', icon: '♻️' },
  { id: 'manutenção', label: 'Manutenção', icon: '🔧' },
];

const STATUS_ALERTA = ['urgente', 'alerta', 'aviso', 'informação'];

export default function AdminGerenciarAvisos() {
  const [avisos, setAvisos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    tipo: 'trânsito',
    status: 'aviso',
    localidade: '',
  });

  useEffect(() => {
    carregarAvisos();
  }, []);

  const carregarAvisos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/admin/avisos');
      setAvisos(response.data.avisos || []);
      setError('');
    } catch (err) {
      console.error('Erro ao carregar avisos:', err);
      // Se for erro 404 ou 500, aceitar lista vazia (tabelas ainda não criadas)
      if (err.response?.status === 404 || err.response?.status === 500) {
        setAvisos([]);
        setError('');
      } else {
        setError('Erro ao carregar avisos: ' + (err.response?.data?.error || err.message));
      }
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
        await api.put(`/api/admin/avisos/${editingId}`, formData);
        setSuccess('Aviso atualizado com sucesso!');
      } else {
        await api.post('/api/admin/avisos', formData);
        setSuccess('Aviso criado com sucesso!');
      }
      
      setFormData({ titulo: '', descricao: '', tipo: 'trânsito', status: 'aviso', localidade: '' });
      setEditingId(null);
      setShowForm(false);
      carregarAvisos();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erro ao salvar aviso: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleEdit = (aviso) => {
    setFormData({
      titulo: aviso.titulo,
      descricao: aviso.descricao,
      tipo: aviso.tipo,
      status: aviso.status,
      localidade: aviso.localidade || '',
    });
    setEditingId(aviso.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar este aviso?')) return;

    try {
      await api.delete(`/api/admin/avisos/${id}`);
      setSuccess('Aviso deletado com sucesso!');
      carregarAvisos();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erro ao deletar aviso: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleCancel = () => {
    setFormData({ titulo: '', descricao: '', tipo: 'trânsito', status: 'aviso', localidade: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const getTipoIcon = (tipo) => {
    const tipo_obj = TIPOS_ALERTA.find(t => t.id === tipo);
    return tipo_obj?.icon || '📌';
  };

  const getStatusColor = (status) => {
    const colors = {
      'urgente': '#f44336',
      'alerta': '#FF8C00',
      'aviso': '#FFC107',
      'informação': '#2196F3',
    };
    return colors[status] || '#999';
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', color: '#333' }}>Gerenciar Avisos e Alertas</h2>
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
          {showForm ? '❌ Cancelar' : '➕ Novo Aviso'}
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
            {editingId ? 'Editar Aviso' : 'Criar Novo Aviso'}
          </h3>
          
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
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
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.icon} {tipo.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                  }}
                >
                  {STATUS_ALERTA.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
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
                placeholder="Ex: Interdição da Rua da Paz"
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
                placeholder="Descreva o alerta em detalhes"
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
                Localidade
              </label>
              <input
                type="text"
                name="localidade"
                value={formData.localidade}
                onChange={handleInputChange}
                placeholder="Ex: Centro, Praia Grande"
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

      {/* LISTA DE AVISOS */}
      {loading ? (
        <div style={{ textAlign: 'center', color: '#999', padding: '40px' }}>Carregando avisos...</div>
      ) : avisos.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          color: '#999', 
          padding: '40px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          border: '2px dashed #ddd'
        }}>
          <p style={{ margin: '10px 0' }}>Nenhum aviso criado ainda.</p>
          <p style={{ margin: '10px 0', fontSize: '13px' }}>Clique em "Novo Aviso" para criar o primeiro aviso da cidade.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
          {avisos.map(aviso => (
            <div
              key={aviso.id}
              style={{
                backgroundColor: '#fff',
                border: `3px solid ${getStatusColor(aviso.status)}`,
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '20px' }}>{getTipoIcon(aviso.tipo)}</span>
                  <span style={{
                    padding: '4px 8px',
                    backgroundColor: getStatusColor(aviso.status),
                    color: '#fff',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}>
                    {aviso.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#333' }}>
                {aviso.titulo}
              </h4>

              <p style={{ fontSize: '14px', color: '#666', marginBottom: '12px', lineHeight: '1.5' }}>
                {aviso.descricao}
              </p>

              {aviso.localidade && (
                <p style={{ fontSize: '12px', color: '#999', marginBottom: '12px' }}>
                  📍 {aviso.localidade}
                </p>
              )}

              <p style={{ fontSize: '12px', color: '#999', marginBottom: '16px' }}>
                Criado em: {new Date(aviso.created_at).toLocaleDateString('pt-BR')}
              </p>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleEdit(aviso)}
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
                  onClick={() => handleDelete(aviso.id)}
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
