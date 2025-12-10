import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  // Top bar simplificada e menu lateral à esquerda.
  // A área principal da página já usa `marginLeft: 240`, então o menu lateral ocupa esse espaço.
  return (
    <>
      <nav style={{ 
        padding: "0.6rem 1rem", 
        color: "var(--text)", 
        borderBottom: '1px solid var(--border)', 
        background: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        height: '56px',
        position: 'relative',
      }}>
        <div style={{ 
          maxWidth: 1400, 
          margin: "0 auto", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between",
          width: '100%',
        }}>
          {/* Logo + CleanWork */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <img
              src="/logo%20cln.png"
              alt="CleanWork"
              style={{
                height: '40px',
                width: 'auto',
              }}
            />
            <div style={{
              color: '#FF8C00',
              fontWeight: 700,
              fontSize: '18px',
              lineHeight: 1,
              paddingTop: '2px',
              margin: 0,
            }}>
              CleanWork
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {/* espaço para controles (login/tema) se necessário */}
          </div>
        </div>
      </nav>

      {/* Menu lateral fixo à esquerda */}
      <aside style={{ position: 'fixed', left: 0, top: 56, bottom: 0, width: 220, padding: '1rem 0.6rem', background: 'var(--side-bg, transparent)', borderRight: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 12px' }}>
          <Link to="/home" style={{ textDecoration: 'none', color: 'var(--text)', padding: '8px 10px', borderRadius: 6 }}>Início</Link>
          <Link to="/obras" style={{ textDecoration: 'none', color: 'var(--text)', padding: '8px 10px', borderRadius: 6 }}>Obras</Link>

          {/* Espaço separador e link Estruturas posicionado abaixo das demais abas */}
          <div style={{ height: 12 }} />
          <Link to="/estruturas" style={{ textDecoration: 'none', color: 'var(--text)', padding: '8px 10px', borderRadius: 6, fontWeight: 600 }}>Estruturas Culturais</Link>
        </div>
      </aside>
    </>
  );
}
