export default function SplashNavbarSimple() {
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
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
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
        <a href="#quem-somos" className="splash-menu-link" style={{
          textDecoration: 'none',
          color: '#333',
          fontSize: '16px',
          fontWeight: '500',
          cursor: 'pointer',
        }}>
          Quem somos
        </a>
        <a href="#como-usar" className="splash-menu-link" style={{
          textDecoration: 'none',
          color: '#333',
          fontSize: '16px',
          fontWeight: '500',
          cursor: 'pointer',
        }}>
          Como usar
        </a>
        <a href="#impacto-local" className="splash-menu-link" style={{
          textDecoration: 'none',
          color: '#333',
          fontSize: '16px',
          fontWeight: '500',
          cursor: 'pointer',
        }}>
          Impacto Local
        </a>
        <a href="#parcerias" className="splash-menu-link" style={{
          textDecoration: 'none',
          color: '#333',
          fontSize: '16px',
          fontWeight: '500',
          cursor: 'pointer',
        }}>
          Parcerias
        </a>
        <a href="#nossa-equipe" className="splash-menu-link" style={{
          textDecoration: 'none',
          color: '#333',
          fontSize: '16px',
          fontWeight: '500',
          cursor: 'pointer',
        }}>
          Nossa Equipe
        </a>
        <a href="#" className="splash-menu-link" style={{
          textDecoration: 'none',
          color: '#333',
          fontSize: '16px',
          fontWeight: '500',
          cursor: 'pointer',
        }}>
          Nossa Equipe
        </a>
      </div>

      {/* Espaço vazio para manter alinhamento */}
      <div style={{
        width: '200px',
      }}>
      </div>
    </nav>
  );
}
