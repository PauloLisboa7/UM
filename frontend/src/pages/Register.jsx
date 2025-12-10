import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendWelcomeEmailFromFrontend } from '../services/emailService';

const API_URL = '/api';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const text = await res.text();
      let body = {};
      try {
        body = text ? JSON.parse(text) : {};
      } catch (parseErr) {
        body = { __raw: text };
      }

      if (!res.ok) {
        const msg = body.message || body.__raw || 'Erro no cadastro';
        setError(msg);
        return;
      }

      // Enviar email de boas-vindas
      try {
        await sendWelcomeEmailFromFrontend(email, username);
      } catch (emailErr) {
        console.warn('Aviso: email de boas-vindas não foi enviado', emailErr);
      }

      alert('Cadastro realizado com sucesso! Faça login.');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Erro no cadastro.');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url("/fundo-login.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      color: 'var(--text)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'Inter, Segoe UI, Arial, sans-serif'
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
        background: 'var(--card-bg)',
        padding: '2rem',
        borderRadius: '16px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
        width: '100%',
        maxWidth: '400px',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        zIndex: 1
      }}>
        <h1 style={{
          textAlign: 'center',
          marginBottom: '1.5rem',
          color: 'var(--text)',
          fontWeight: 800,
          fontSize: '2rem',
          textShadow: '0 2px 8px rgba(0,0,0,0.18)'
        }}>
          Cadastro de Usuário
        </h1>
        <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#1a202c',
                        fontWeight: '600'
                      }}>
                        E-mail:
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
              color: 'var(--text)',
              fontWeight: 700,
              fontSize: '1.08rem',
              textShadow: '0 1px 4px rgba(0,0,0,0.12)'
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
                border: '1px solid var(--border)',
                borderRadius: '4px',
                background: 'var(--card-bg)',
                color: 'var(--text)',
                boxSizing: 'border-box',
                fontWeight: 500,
                fontSize: '1rem'
              }}
              required
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: 'var(--text)',
              fontWeight: 700,
              fontSize: '1.08rem',
              textShadow: '0 1px 4px rgba(0,0,0,0.12)'
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
                border: '1px solid var(--border)',
                borderRadius: '4px',
                background: 'var(--card-bg)',
                color: 'var(--text)',
                boxSizing: 'border-box',
                fontWeight: 500,
                fontSize: '1rem'
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
              Confirmar Senha:
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            Cadastrar
          </button>
          <button
            type="button"
            onClick={() => navigate('/login')}
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
            Voltar ao Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
