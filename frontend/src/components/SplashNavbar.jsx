import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function SplashNavbar({ onNavClick }) {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const handleNavClick = (section) => {
    if (onNavClick) {
      onNavClick(section);
    }
  };

  return (
    <nav className="splash-navbar" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 40px',
      backgroundColor: '#f5f5f5',
      borderBottom: '1px solid #e0e0e0',
      height: '70px',
    }}>
      {/* Logo + Name */}
      <div 
        onClick={() => {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
      >
        <img
          src="/logo%20cln.png"
          alt="CleanWork"
          style={{
            height: '50px',
            width: 'auto',
          }}
        />
        <div className="splash-impacto-label" style={{ textTransform: 'none' }}>
          CleanWork
        </div>
      </div>

      {/* Menu Central */}
      <div style={{
        display: 'flex',
        gap: '32px',
        alignItems: 'center',
      }}>
        {/* Menu Normal (Usuários Comuns) */}
        {!user || !isAdmin?.() ? (
          <>
            <a 
              href="#solicitar-reclamacao"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('solicitar-reclamacao');
              }}
              className="splash-menu-link" 
              style={{
                textDecoration: 'none',
                color: '#333',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
              }}>
              Solicitar Reclamação
            </a>
            <a 
              href="#como-usar"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('como-usar');
              }}
              className="splash-menu-link" 
              style={{
                textDecoration: 'none',
                color: '#333',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
              }}>
              Acompanhe Aqui
            </a>
            <a 
              href="#avisos"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('avisos');
              }}
              className="splash-menu-link" 
              style={{
                textDecoration: 'none',
                color: '#333',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
              }}>
              Avisos & Alertas
            </a>
            <a 
              href="#guia-servicos"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('guia-servicos');
              }}
              className="splash-menu-link" 
              style={{
                textDecoration: 'none',
                color: '#333',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
              }}>
              Guia de Serviços
            </a>

            {/* Menu logado (se usuário está autenticado) */}
            {user && !isAdmin?.() && (
              <>
                <div style={{ borderLeft: '1px solid #ddd', height: '20px' }}></div>
                
                <a 
                  href="#meu-historico"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick('meu-historico');
                  }}
                  className="splash-menu-link" 
                  style={{
                    textDecoration: 'none',
                    color: '#333',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: 'pointer',
                  }}>
                  Meu Histórico
                </a>
                <a 
                  href="#meu-bairro"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick('meu-bairro');
                  }}
                  className="splash-menu-link" 
                  style={{
                    textDecoration: 'none',
                    color: '#333',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: 'pointer',
                  }}>
                  Meu Bairro
                </a>
                <a 
                  href="#configuracoes"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick('configuracoes');
                  }}
                  className="splash-menu-link" 
                  style={{
                    textDecoration: 'none',
                    color: '#333',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: 'pointer',
                  }}>
                  Configurações
                </a>
              </>
            )}
          </>
        ) : (
          /* Menu Admin - Apenas "Acompanhar Solicitações" */
          <a 
            href="#admin"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('admin');
            }}
            className="splash-menu-link" 
            style={{
              textDecoration: 'none',
              color: '#FF8C00',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
            }}>
            Acompanhar Solicitações
          </a>
        )}
      </div>

      {/* Espaço direito com saudação do usuário */}
      <div style={{
        display: 'flex',
        gap: '15px',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}>

        {/* Saudação do usuário */}
        <div style={{
          width: '200px',
          textAlign: 'right',
        }}>
          {user && (
            <div style={{
              color: '#FF8C00',
              fontSize: '18px',
              fontWeight: '600',
              border: '2px solid #FF8C00',
              padding: '8px 12px',
              borderRadius: '6px',
              display: 'inline-block',
            }}>
              Olá, {user.username}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
