import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { username, password });
      // backend retorna { token, role } — criar um objeto user consistente para o contexto
      const userObj = { username, role: res.data.role };
      login(userObj, res.data.token);
      // If account is admin, request Home to open admin panel on load
      if (res.data.role === 'admin' || userObj.role === 'admin') {
        try {
          localStorage.setItem('initialSection', 'admin');
        } catch (e) {
          console.warn('Não foi possível escrever initialSection no localStorage', e);
        }
      }
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro no login.');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("/fundo-login.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      color: 'var(--text)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Overlay escuro para melhor legibilidade */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none'
      }}></div>

      <div style={{
        background: 'rgba(255, 255, 255, 0.97)',
        padding: '2rem',
        borderRadius: '16px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
        width: '100%',
        maxWidth: '400px',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        zIndex: 1
      }}>
        <button
          onClick={() => navigate('/')}
          aria-label="Voltar para a página inicial"
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: '20px',
            color: '#1a202c',
            padding: '6px',
          }}
          onMouseEnter={(e) => e.target.style.opacity = 0.8}
          onMouseLeave={(e) => e.target.style.opacity = 1}
        >
          ←
        </button>
        <h1 style={{
          textAlign: 'center',
          marginBottom: '1.5rem',
          color: '#1a202c',
          fontWeight: 'bold'
        }}>
          Login
        </h1>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#1a202c',
              fontWeight: '600'
            }}>
              Usuário:
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #cbd5e0',
                borderRadius: '4px',
                background: '#ffffff',
                color: '#1a202c',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#1a202c',
              fontWeight: '600'
            }}>
              Senha:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #cbd5e0',
                borderRadius: '4px',
                background: '#ffffff',
                color: '#1a202c',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>
          {error && (
            <p style={{
              color: '#e53e3e',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              {error}
            </p>
          )}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#ff8c00',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
              marginBottom: '1rem',
              fontWeight: '600'
            }}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => navigate('/register')}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#ffffff',
              color: '#ff8c00',
              border: '2px solid #ff8c00',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600'
            }}
          >
            Cadastrar Usuário
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
