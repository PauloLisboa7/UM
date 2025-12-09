import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Footer() {
  const { isAdmin } = useAuth();
  const location = useLocation();

  // Rotas onde o menu lateral deve ficar oculto
  if (location.pathname.startsWith('/obras')) return null;
  const width = 220;
  const homeLabel = (typeof isAdmin === 'function' && isAdmin()) ? 'Painel de Controle' : 'Home';
  return (
    <aside aria-label="Menu lateral" style={{
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
      width: width,
      background: '#f2f4f7',
      borderRight: '1px solid rgba(0,0,0,0.06)',
      padding: '1rem 0.75rem',
      boxSizing: 'border-box',
      zIndex: 80,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: 12
    }}>
      <div style={{ padding: '0 8px', marginBottom: 10 }}>
        <Link to="/" style={{ display: 'inline-block', textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: '#ffffff', borderRadius: 12, boxShadow: '0 8px 20px rgba(2,6,23,0.08)' }}>
            <img src="/cleanwork-logo.svg" alt="CleanWork" style={{ height: 34, width: 'auto', display: 'block' }} />
            <span style={{ fontWeight: 700, color: '#0f172a', fontSize: 16 }}>CleanWork</span>
          </div>
        </Link>
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Link to="/home" style={{ textDecoration: 'none', color: '#1f2937' }}>
          <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: 8, boxShadow: '0 6px 18px rgba(0,0,0,0.04)', textAlign: 'left' }}>{homeLabel}</div>
        </Link>
        <Link to="/obras" style={{ textDecoration: 'none', color: '#1f2937' }}>
          <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: 8, boxShadow: '0 6px 18px rgba(0,0,0,0.04)', textAlign: 'left' }}>Obras</div>
        </Link>
        <Link to="/estruturas" style={{ textDecoration: 'none', color: '#1f2937' }}>
          <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: 8, boxShadow: '0 6px 18px rgba(0,0,0,0.04)', textAlign: 'left' }}>Estruturas Culturais</div>
        </Link>
        <Link to="/login" style={{ textDecoration: 'none', color: '#1f2937' }}>
          <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: 8, boxShadow: '0 6px 18px rgba(0,0,0,0.04)', textAlign: 'left' }}>Login/Cadastro</div>
        </Link>
      </nav>
      <div style={{ flex: 1 }} />
    </aside>
  );
}
