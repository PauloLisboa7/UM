import { useState } from 'react';
import Footer from '../components/Footer';
import SplashNavbar from '../components/SplashNavbar';
import SolicitarReclamacao from '../components/SolicitarReclamacao';
import ComoUsar from '../components/ComoUsar';
import AdminPanel from '../components/AdminPanel';
import AvisosAlertas from '../components/AvisosAlertas';
import GuiaServicos from '../components/GuiaServicos';
import MeuHistorico from '../components/MeuHistorico';
import ConfiguracoesNotificacao from '../components/ConfiguracoesNotificacao';
import AreaMeuBairro from '../components/AreaMeuBairro';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { user, isAdmin } = useAuth();
  const [activeSection, setActiveSection] = useState(() => {
    try {
      const initial = localStorage.getItem('initialSection');
      if (initial) {
        localStorage.removeItem('initialSection');
        return initial;
      }
    } catch (e) {
      // ignore
    }

    // Try to read stored user synchronously so reloads (F5) pick up role immediately
    try {
      const raw = localStorage.getItem('user');
      const storedUser = raw && raw !== 'undefined' ? JSON.parse(raw) : null;
      if (storedUser && storedUser.role === 'admin') return 'admin';
    } catch (e) {
      // ignore parse errors
    }

    return 'solicitar-reclamacao';
  });

  const handleNavClick = (section) => {
    setActiveSection(section);
  };

  return (
    <div>
      <SplashNavbar onNavClick={handleNavClick} />
      <div style={{ paddingTop: '20px', minHeight: 'calc(100vh - 90px)' }}>
        {activeSection === 'avisos' ? (
          <AvisosAlertas />
        ) : activeSection === 'guia-servicos' ? (
          <GuiaServicos />
        ) : activeSection === 'solicitar-reclamacao' ? (
          <SolicitarReclamacao />
        ) : activeSection === 'como-usar' ? (
          <ComoUsar />
        ) : activeSection === 'meu-historico' ? (
          <MeuHistorico />
        ) : activeSection === 'configuracoes' ? (
          <ConfiguracoesNotificacao />
        ) : activeSection === 'meu-bairro' ? (
          <AreaMeuBairro />
        ) : activeSection === 'admin' && user && isAdmin?.() ? (
          <AdminPanel />
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            {/* Conteúdo padrão da página */}
          </div>
        )}
      </div>
    </div>
  );
}
