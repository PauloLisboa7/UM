import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import './Splash.css';

const Splash = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = React.useState(null);
  const { user, isAdmin } = useAuth();
  const [kpiTotal, setKpiTotal] = React.useState(0);
  const [kpiAndamento, setKpiAndamento] = React.useState(0);
  const [kpiConcluidas, setKpiConcluidas] = React.useState(0);
  const [kpiTaxa, setKpiTaxa] = React.useState('0%');
  const [statusChartData, setStatusChartData] = React.useState([]);
  const [bairroChartData, setBairroChartData] = React.useState([]);

  React.useEffect(() => {
    let mounted = true;
    async function fetchImpacto() {
      try {
        const res = await fetch('/api/estatisticas/impacto');
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted) return;
        setKpiTotal(data.total || 0);
        setKpiConcluidas(data.concluido || 0);
        setKpiTaxa((data.taxa_conclusao_percent || 0) + '%');

        // tentar mapear 'em andamento' por status keys
        const porStatus = data.por_status || {};
        const andamentoKey = Object.keys(porStatus).find(k => k.toLowerCase().includes('and') || k.toLowerCase().includes('execu') || k.toLowerCase().includes('em execução'));
        const andamento = andamentoKey ? porStatus[andamentoKey] : 0;
        setKpiAndamento(andamento || 0);

        // status chart data
        const sData = Object.entries(porStatus).map(([name, value]) => ({ name, value }));
        setStatusChartData(sData);

        // bairro top
        const bairrosTop = data.bairros_top || [];
        const bData = bairrosTop.map(b => ({ name: b.bairro, value: b.count }));
        setBairroChartData(bData);
      } catch (e) {
        console.error('Erro ao buscar impacto:', e);
      }
    }

    fetchImpacto();
    const id = setInterval(fetchImpacto, 30000);

    // Try to open an SSE connection for real-time updates; fallback to polling above
    let es;
    try {
      es = new EventSource('/api/estatisticas/impacto/stream');
      es.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          if (!mounted) return;
          setKpiTotal(data.total || 0);
          setKpiConcluidas(data.concluido || 0);
          setKpiTaxa((data.taxa_conclusao_percent || 0) + '%');
          const porStatus = data.por_status || {};
          const andamentoKey = Object.keys(porStatus).find(k => k.toLowerCase().includes('and') || k.toLowerCase().includes('execu') || k.toLowerCase().includes('em execução'));
          const andamento = andamentoKey ? porStatus[andamentoKey] : 0;
          setKpiAndamento(andamento || 0);
          const sData = Object.entries(porStatus).map(([name, value]) => ({ name, value }));
          setStatusChartData(sData);
          const bairrosTop = data.bairros_top || [];
          const bData = bairrosTop.map(b => ({ name: b.bairro, value: b.count }));
          setBairroChartData(bData);
        } catch (err) {
          console.error('Erro processando SSE impacto:', err);
        }
      };
      es.onerror = (err) => {
        // if SSE fails, we keep polling as fallback
        console.warn('SSE connection errored, falling back to polling', err);
        try { es.close(); } catch (e) {}
      };
    } catch (e) {
      console.warn('EventSource não suportado ou falhou:', e);
    }

    return () => { mounted = false; clearInterval(id); if (es) es.close(); };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="splash-container" style={{
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--bg)',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Header/Navbar */}
      <nav className="splash-navbar" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '16px 40px',
        borderBottom: '1px solid var(--border)',
        height: '70px',
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
        position: 'relative',
      }}>
        {/* Logo + Name - Posicionado à esquerda */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          position: 'absolute',
          left: '40px',
        }}>
          <img
            src="/logo%20cln.png"
            alt="CleanWork"
            style={{
              height: '50px',
              width: 'auto',
            }}
          />
          <div className="splash-impacto-label" style={{ 
            textTransform: 'none', 
            color: 'var(--brand-orange)', 
            fontWeight: 700,
            fontSize: '24px',
            margin: 0,
            lineHeight: 1,
            paddingTop: '2px',
          }}>
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
            color: '#000000',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
          }}>
            Quem somos
          </a>
          <a href="#como-usar" className="splash-menu-link" style={{
            textDecoration: 'none',
            color: '#000000',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
          }}>
            Como usar
          </a>
          <a href="#impacto-local" className="splash-menu-link" style={{
            textDecoration: 'none',
            color: '#000000',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
          }}>
            Impacto Local
          </a>
          <a href="#parcerias" className="splash-menu-link" style={{
            textDecoration: 'none',
            color: '#000000',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
          }}>
            Parcerias
          </a>
          <a href="#nossa-equipe" className="splash-menu-link" style={{
            textDecoration: 'none',
            color: '#000000',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
          }}>
            Nossa Equipe
          </a>
          <a href="#" className="splash-menu-link" style={{
            textDecoration: 'none',
            color: '#000000',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
          }}>
            Nossa Equipe
          </a>
        </div>

        {/* Botões Direita - Posicionado à direita */}
        <div style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          position: 'absolute',
          right: '40px',
        }}>
          <a
            href="https://wa.me/5598999621664?text=Ol%C3%A1%2C%20quero%20falar%20com%20a%20equipe%20CleanWork"
            target="_blank"
            rel="noopener noreferrer"
            className="splash-btn-primary"
            style={{
              padding: '10px 24px',
              backgroundColor: '#ff8c00',
              color: '#ffffff',
              border: 'none',
              borderRadius: '24px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
              display: 'inline-block',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#e67e00'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#ff8c00'}
          >
            Fale com nossa Equipe
          </a>
          <button 
            onClick={() => navigate('/login')}
            style={{
            padding: '10px 24px',
            backgroundColor: 'transparent',
            color: '#000000',
            border: '2px solid #000000',
            borderRadius: '24px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#000000';
            e.target.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = '#000000';
          }}
          >
            Login
          </button>
        </div>
      </nav>

      {/* Conteúdo em branco */}
      <div style={{
        backgroundColor: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 40px',
        backgroundImage: 'linear-gradient(135deg, rgba(100,100,100,0.05) 0%, rgba(100,100,100,0.02) 100%)',
        minHeight: '320px',
      }}>
        {/* Imagem de fundo (simulada com uma div) */}
        <div style={{
          position: 'absolute',
          top: '80px',
          right: '0',
          width: '40%',
          height: '320px',
          backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 800 600%27%3E%3Crect fill=%27%23e8e8e8%27 width=%27800%27 height=%27600%27/%3E%3Crect fill=%27%23f0f0f0%27 x=%27100%27 y=%2750%27 width=%27200%27 height=%27300%27/%3E%3Crect fill=%27%23d0d0d0%27 x=%27350%27 y=%27150%27 width=%27150%27 height=%27250%27/%3E%3C/svg%3E")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.3,
          zIndex: 0,
        }}>
        </div>

        {/* Conteúdo de texto */}
        <div style={{
          maxWidth: '600px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}>
          <h1 className="splash-hero-title">
            CleanWork<br />
            A empresa que te ajuda a chegar na solução.
          </h1>
          
          <p className="splash-hero-subtitle">
            Trazendo mais facilidade em suas reclamações sobre obras.
          </p>
        </div>
      </div>

      
      

      {/* Seção "Quem somos" */}
      <section id="quem-somos" className="splash-section delay-1" style={{
        backgroundColor: 'var(--bg)',
        padding: '100px 40px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decoração de linhas no canto inferior esquerdo */}
        <div style={{
          position: 'absolute',
          bottom: '-50px',
          left: '-50px',
          width: '300px',
          height: '300px',
          opacity: 0.06,
          pointerEvents: 'none',
        }}>
          <svg viewBox="0 0 300 300" style={{ width: '100%', height: '100%' }}>
            <circle cx="50" cy="50" r="40" fill="none" stroke="var(--accent)" strokeWidth="3"/>
            <circle cx="50" cy="50" r="80" fill="none" stroke="var(--accent)" strokeWidth="2"/>
            <circle cx="50" cy="50" r="120" fill="none" stroke="var(--accent)" strokeWidth="1"/>
          </svg>
        </div>

        <div className="splash-quem-somos-grid" style={{ 
          width: '100%', 
          maxWidth: '1000px', 
          margin: '0 auto', 
          color: 'var(--text)',
          lineHeight: 1.75,
          backgroundColor: 'var(--card-bg)',
          padding: '40px',
          borderRadius: '12px',
          border: '2px solid var(--accent)',
          boxShadow: '0 8px 24px rgba(255, 140, 0, 0.1)'
        }}>
          <div className="left">
            <p className="splash-quem-somos-label">Quem somos</p>
            <h2 className="splash-quem-somos-title">Nossa Missão e Time</h2>
          </div>

          <div className="right">
            <p className="splash-quem-somos-text">
              Somos a equipe CleanWork, um grupo de três estudantes do Técnico em Desenvolvimento de Sistemas do Senac. Nossa união nasceu de um objetivo comum: aplicar o conhecimento técnico em prol de uma solução cívica e eficiente para a cidade de São Luís.
            </p>
            <p className="splash-quem-somos-text">
              Nossa missão é simples: usar o desenvolvimento de sistemas como ferramenta de transformação urbana e melhoria da qualidade de vida.
            </p>
            <p className="splash-quem-somos-text">
              O CleanWork combina práticas de Frontend, Análise de Dados e Arquitetura da Informação para construir uma ponte clara entre o cidadão e a manutenção da infraestrutura urbana.
            </p>
            <p className="splash-quem-somos-text">
              Cada reporte no CleanWork não é apenas uma reclamação, mas um passo concreto para tornar São Luís mais transparente e responsiva.
            </p>
          </div>
        </div>
      </section>

      {/* Seção "Dados e Dashboard" - O Impacto do CleanWork - PRIMEIRA */}
      <div id="como-usar" style={{
        backgroundColor: 'var(--bg)',
        padding: '120px 60px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}>
        {/* Título superior */}
        <p className="splash-impacto-label">
          Como usar o nosso SITE
        </p>

        {/* Título principal (removido: '3 PASSOS') */}
        {/* Showcase com 3 screenshots (colocado dentro da seção 'Como usar o nosso SITE') */}
        <div style={{ width: '100%', maxWidth: 1100, marginTop: 28 }}>
          <section className="splash-showcase-section">
            <div className="splash-showcase">
              {/* Card 1: Página Inicial */}
              <div className="splash-showcase-card" onMouseEnter={() => setHoveredCard(0)} onMouseLeave={() => setHoveredCard(null)}>
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <img src="/screenshots/pagina 1.png" alt="Página Inicial" />
                  <div className="splash-card-tooltip-circle" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <div className="splash-tooltip-dot"></div>
                    {hoveredCard === 0 && (
                      <div className="splash-tooltip-box">
                        Página inicial com visão geral do CleanWork e acesso rápido às funcionalidades principais
                      </div>
                    )}
                  </div>
                </div>
                <p style={{ marginTop: '12px', color: 'var(--muted)', fontSize: '18px', fontWeight: '500' }}>Página Inicial</p>
              </div>

              {/* Card 2: Cadastro de Usuário */}
              <div className="splash-showcase-card splash-showcase-card--center" onMouseEnter={() => setHoveredCard(1)} onMouseLeave={() => setHoveredCard(null)}>
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <img src="/screenshots/pagina 2.png" alt="Cadastro de Usuário" />
                  <div className="splash-card-tooltip-circle" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <div className="splash-tooltip-dot"></div>
                    {hoveredCard === 1 && (
                      <div className="splash-tooltip-box">
                        Faça seu cadastro com email e senha para começar a usar o CleanWork
                      </div>
                    )}
                  </div>
                </div>
                <p style={{ marginTop: '12px', color: 'var(--muted)', fontSize: '18px', fontWeight: '500' }}>Cadastro de Usuário</p>
              </div>

              {/* Card 3: Página 3 (sempre visível ao lado dos outros dois) */}
              <div className="splash-showcase-card" onMouseEnter={() => setHoveredCard(2)} onMouseLeave={() => setHoveredCard(null)}>
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <img src="/screenshots/pagina 3.png" alt="Página de Solicitação" />
                  <div className="splash-card-tooltip-circle" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <div className="splash-tooltip-dot"></div>
                    {hoveredCard === 2 && (
                      <div className="splash-tooltip-box">
                        Visualização da Página de Solicitação — exemplo da tela de envio de reporte
                      </div>
                    )}
                  </div>
                </div>
                <p style={{ marginTop: '12px', color: 'var(--muted)', fontSize: '18px', fontWeight: '500' }}>Página de Solicitação</p>
              </div>
              
            </div>
          </section>
        </div>
      </div>

      {/* Seção "Dados e Dashboard" - O Impacto do CleanWork */}
      <div id="impacto-local" style={{
        backgroundColor: 'var(--bg)',
        padding: '120px 60px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}>
        {/* Título superior */}
        <p className="splash-impacto-label">
          Impacto Local
        </p>

        {/* Título principal */}
        <h2 className="splash-impacto-title" style={{ fontSize: '30px', fontWeight: 600, margin: '0 0 12px 0' }}>
          Solicitações em Tempo Real em São Luís
        </h2>

        {/* Gráfico de Status das Obras */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          width: '100%',
          maxWidth: '1100px',
          marginTop: '60px',
        }}>
          {/* Gráfico Pie - Status das Obras */}
          <div className="splash-chart-container" style={{
            backgroundColor: '#f9f9f9',
            borderRadius: '12px',
            padding: '30px',
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 20px 0', color: '#333' }}>
              Status das Obras
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusChartData.length > 0 ? statusChartData : [{ name: 'Sem Dados', value: 1 }]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {(statusChartData.length > 0 ? statusChartData : [{}, {}, {}, {}]).map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={["#FF8C00", "#4CAF50", "#F44336", "#FFC107"][idx % 4]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} obras`} />
                </PieChart>
              </ResponsiveContainer>
          </div>

          {/* Gráfico Bar - Obras por Bairro */}
          <div className="splash-chart-container" style={{
            backgroundColor: 'var(--muted-bg)',
            borderRadius: '12px',
            padding: '30px',
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 20px 0', color: 'var(--text)' }}>
              Obras por Bairro (Top 5)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={bairroChartData.length > 0 ? bairroChartData : []}
                margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip formatter={(value) => `${value} obras`} />
                <Bar dataKey="value" fill="#FF8C00" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* KPIs em tempo real */}
        <div style={{
          display: 'flex',
          gap: '40px',
          justifyContent: 'center',
          marginTop: '80px',
          flexWrap: 'wrap',
        }}>
          {/* KPI 1 - Total de Obras */}
          <div className="splash-kpi-card" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            minWidth: '180px',
          }}>
            <div className="splash-kpi-icon" style={{
              color: '#0066cc',
              fontSize: '28px',
              fontWeight: 'bold',
            }}>
              ▪
            </div>
            <p className="splash-kpi-number" style={{ color: '#0066cc' }} id="kpi-total">
              {kpiTotal}
            </p>
            <p className="splash-kpi-label">
              Total de Solicitações
            </p>
          </div>

          {/* KPI 2 - Em Andamento */}
          <div className="splash-kpi-card" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            minWidth: '180px',
          }}>
            <div className="splash-kpi-icon" style={{
              color: '#0066cc',
              fontSize: '24px',
            }}>
              ⟳
            </div>
            <p className="splash-kpi-number" style={{ color: '#0066cc' }} id="kpi-andamento">{kpiAndamento}</p>
            <p className="splash-kpi-label">
              Em Andamento
            </p>
          </div>

          {/* KPI 3 - Concluídas */}
          <div className="splash-kpi-card" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            minWidth: '180px',
          }}>
            <div className="splash-kpi-icon" style={{
              color: '#0066cc',
              fontSize: '24px',
            }}>
              ✓
            </div>
            <p className="splash-kpi-number" style={{ color: '#0066cc' }} id="kpi-concluidas">{kpiConcluidas}</p>
            <p className="splash-kpi-label">
              Concluídas
            </p>
          </div>

          {/* KPI 4 - Taxa de Conclusão */}
          <div className="splash-kpi-card" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            minWidth: '180px',
          }}>
            <div className="splash-kpi-icon" style={{
              color: '#0066cc',
              fontSize: '20px',
            }}>
              ◇
            </div>
            <p className="splash-kpi-number" style={{ color: '#0066cc' }} id="kpi-taxa">{kpiTaxa}</p>
            <p className="splash-kpi-label">
              Taxa de Conclusão
            </p>
          </div>
        </div>
      </div>

      

      {/* Seção "Parcerias" */}
      <div id="parcerias" style={{
        backgroundColor: 'var(--bg)',
        padding: '80px 60px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}>
        <p className="splash-parcerias-label">
          Parcerias
        </p>

        <h3 className="splash-parcerias-title" style={{ fontSize: '22px', fontWeight: 600, margin: '0 0 12px 0' }}>
          Parceiros estratégicos que confiam no CleanWork
        </h3>

        <div style={{
          display: 'flex',
          gap: '32px',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}>
          {/* Logos reais colocados em /public */}
          <div className="parcerias-card">
            <img src="/senac-maranhao.jpg" alt="Parceiro Senac" />
          </div>

          <div className="parcerias-card">
            <img src="/Gemini_Generated_Image_7mnco27mnco27mnc.png" alt="Parceiro 2" />
          </div>

          {/* Se quiser mais logos, adicione arquivos em /public e referência abaixo */}
        </div>
      </div>

      {/* Seção "Criadores" */}
      <div id="nossa-equipe" style={{
        backgroundColor: 'var(--bg)',
        padding: '120px 60px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}>
        {/* Título superior */}
        <p className="splash-equipe-label">
          Nossa Equipe
        </p>

        {/* Título principal */}
        <h2 className="splash-equipe-title" style={{ fontSize: '30px', fontWeight: 600, margin: '0 0 12px 0' }}>
          Conheça os criadores do CleanWork
        </h2>

        {/* Cards de criadores */}
        <div style={{
          display: 'flex',
          gap: '60px',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          {/* Criador 1 */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            maxWidth: '280px',
          }}>
            <div className="splash-membro-avatar" style={{ width: '220px', height: '220px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
              <img src="/Marcos%20Vinicius.jpeg" alt="Marcos Vinicius" />
            </div>
            <div>
              <p className="splash-membro-name">Marcos Vinicius</p>
              <p className="splash-membro-role">Desenvolvedor</p>
            </div>
          </div>

          {/* Criador 2 */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            maxWidth: '280px',
          }}>
            <div className="splash-membro-avatar" style={{ width: '220px', height: '220px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
              <img src="/Paulo%20Lisboa.jpeg" alt="Paulo Lisboa" />
            </div>
            <div>
              <p className="splash-membro-name">Paulo Lisboa</p>
              <p className="splash-membro-role">Desenvolvedor</p>
            </div>
          </div>

          {/* Criador 3 */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            maxWidth: '280px',
          }}>
            <div className="splash-membro-avatar" style={{ width: '220px', height: '220px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
              <img src="/Guilherme%20Moreira.jpeg" alt="Guilherme Moreira" />
            </div>
            <div>
              <p className="splash-membro-name">Guilherme Moreira</p>
              <p className="splash-membro-role">Desenvolvedor</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#2d2d2d',
        color: '#ffffff',
        padding: '60px 60px 30px 60px',
      }}>
        {/* Conteúdo principal do footer */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          gap: '36px',
          marginBottom: '60px',
          borderBottom: '1px solid #444',
          paddingBottom: '60px',
        }}>
          <div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#ff8c00',
              margin: '0 0 24px 0',
              lineHeight: '1.3',
            }}>
              Oportunidades em novos projetos e obras.
            </h3>
            <a href="/login" style={{
              color: '#ffffff',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              Login →
            </a>
          </div>

          {/* Coluna 2 - Páginas */}
          <div>
            <p style={{
              color: '#ff8c00',
              fontSize: '12px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              margin: '0 0 24px 0',
            }}>
              Páginas
            </p>
            <ul style={{
              listStyle: 'none',
              padding: '0',
              margin: '0',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
              <li><a href="#quem-somos" style={{ color: '#ccc', textDecoration: 'none', fontSize: '14px' }}>Quem somos</a></li>
              <li><a href="#como-usar" style={{ color: '#ccc', textDecoration: 'none', fontSize: '14px' }}>Como usar</a></li>
              <li><a href="#impacto-local" style={{ color: '#ccc', textDecoration: 'none', fontSize: '14px' }}>Impacto Local</a></li>
              <li><a href="#parcerias" style={{ color: '#ccc', textDecoration: 'none', fontSize: '14px' }}>Parcerias</a></li>
              <li><a href="#nossa-equipe" style={{ color: '#ccc', textDecoration: 'none', fontSize: '14px' }}>Nossa Equipe</a></li>
            </ul>
          </div>

          {/* Coluna 3 - Contato (moved next to Páginas) */}
          <div>
            <p style={{
              color: '#ff8c00',
              fontSize: '12px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              margin: '0 0 24px 0',
            }}>
              Contato
            </p>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              fontSize: '14px',
            }}>
              <p style={{ margin: '0', color: '#ccc' }}>
                <strong style={{ color: '#fff' }}>Atendimento –</strong> 98 99962-1664
              </p>
              <p style={{ margin: '8px 0 0 0', color: '#ccc' }}>
                atendimento@cleanwork.com.br
              </p>
              <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                <a href="#" style={{ fontSize: '18px', textDecoration: 'none' }}>f</a>
                <a href="#" style={{ fontSize: '18px', textDecoration: 'none' }}>in</a>
                <a href="#" style={{ fontSize: '18px', textDecoration: 'none' }}>◉</a>
                <a href="#" style={{ fontSize: '18px', textDecoration: 'none' }}>▶</a>
              </div>
            </div>
          </div>

          <div>
            {/* Transparência removida conforme solicitado (links excluídos) */}
          </div>
        </div>

        {/* Endereço removido por solicitação */}

        {/* Copyright */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '24px',
          borderTop: '1px solid #444',
          fontSize: '13px',
          color: '#999',
        }}>
          <p style={{ margin: '0' }}>
            © CleanWork 2025. Todos os direitos reservados
          </p>
          <div style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#ccc',
          }}>
            Clean<span style={{ color: '#ff8c00' }}>Work</span>
          </div>
        </div>
      </footer>

      {/* Botão flutuante de volta ao topo */}
      <button
        onClick={scrollToTop}
        style={{
          position: 'fixed',
          bottom: '40px',
          right: '40px',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: '#ff8c00',
          color: '#ffffff',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(255, 140, 0, 0.3)',
          zIndex: 100,
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#e67e00';
          e.target.style.boxShadow = '0 6px 16px rgba(255, 140, 0, 0.4)';
          e.target.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#ff8c00';
          e.target.style.boxShadow = '0 4px 12px rgba(255, 140, 0, 0.3)';
          e.target.style.transform = 'scale(1)';
        }}
        title="Voltar ao topo"
      >
        ↑
      </button>
    </div>
  );
};

export default Splash;
