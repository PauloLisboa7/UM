import { useEffect, useState, useRef } from "react";
import Footer from "../components/Footer";
import MapSelector from "../components/MapSelector";
import Navbar from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import { FaSearch, FaPrint, FaFilePdf, FaFileExcel } from 'react-icons/fa';

import "../App.home.css";

export default function Home() {
  const { isAdmin } = useAuth();
  const [demandas, setDemandas] = useState([]);
  const [obras, setObras] = useState([]);
  const [nova, setNova] = useState({ titulo: "", descricao: "", bairro: "", estado: "", cidade: "", latitude: null, longitude: null });
  // estados para formulário simplificado de usuário
  const [descricaoSolicitacao, setDescricaoSolicitacao] = useState("");
  const [lugarSolicitacao, setLugarSolicitacao] = useState("");
  const [dataSolicitacao, setDataSolicitacao] = useState("");
  const [solicitacaoLatitude, setSolicitacaoLatitude] = useState(null);
  const [solicitacaoLongitude, setSolicitacaoLongitude] = useState(null);
  const [mapFocus, setMapFocus] = useState(null);
  const [geocodeStatus, setGeocodeStatus] = useState("idle");
  const lastGeocodeValue = useRef("");

  // Dados de estados e cidades do Brasil com coordenadas aproximadas
  const estados = [
    { sigla: "AC", nome: "Acre", lat: -9.974, lng: -67.809 },
    { sigla: "AL", nome: "Alagoas", lat: -9.571, lng: -36.782 },
    { sigla: "AP", nome: "Amapá", lat: 0.902, lng: -52.003 },
    { sigla: "AM", nome: "Amazonas", lat: -3.416, lng: -65.856 },
    { sigla: "BA", nome: "Bahia", lat: -12.971, lng: -38.501 },
    { sigla: "CE", nome: "Ceará", lat: -3.731, lng: -38.526 },
    { sigla: "DF", nome: "Distrito Federal", lat: -15.794, lng: -47.882 },
    { sigla: "ES", nome: "Espírito Santo", lat: -20.315, lng: -40.312 },
    { sigla: "GO", nome: "Goiás", lat: -16.686, lng: -49.264 },
    { sigla: "MA", nome: "Maranhão", lat: -2.530, lng: -44.306 },
    { sigla: "MT", nome: "Mato Grosso", lat: -15.598, lng: -56.094 },
    { sigla: "MS", nome: "Mato Grosso do Sul", lat: -20.469, lng: -54.620 },
    { sigla: "MG", nome: "Minas Gerais", lat: -19.919, lng: -43.938 },
    { sigla: "PA", nome: "Pará", lat: -1.455, lng: -48.504 },
    { sigla: "PB", nome: "Paraíba", lat: -7.115, lng: -34.861 },
    { sigla: "PR", nome: "Paraná", lat: -25.428, lng: -49.267 },
    { sigla: "PE", nome: "Pernambuco", lat: -8.047, lng: -34.877 },
    { sigla: "PI", nome: "Piauí", lat: -5.089, lng: -42.803 },
    { sigla: "RJ", nome: "Rio de Janeiro", lat: -22.906, lng: -43.172 },
    { sigla: "RN", nome: "Rio Grande do Norte", lat: -5.794, lng: -35.209 },
    { sigla: "RS", nome: "Rio Grande do Sul", lat: -30.034, lng: -51.217 },
    { sigla: "RO", nome: "Rondônia", lat: -8.761, lng: -63.903 },
    { sigla: "RR", nome: "Roraima", lat: 2.819, lng: -60.671 },
    { sigla: "SC", nome: "Santa Catarina", lat: -27.595, lng: -48.548 },
    { sigla: "SP", nome: "São Paulo", lat: -23.550, lng: -46.633 },
    { sigla: "SE", nome: "Sergipe", lat: -10.947, lng: -37.073 },
    { sigla: "TO", nome: "Tocantins", lat: -10.249, lng: -48.324 }
  ];

  const cidadesPorEstado = {
    AC: ["Rio Branco", "Cruzeiro do Sul", "Sena Madureira", "Tarauacá", "Feijó"],
    AL: ["Maceió", "Arapiraca", "Rio Largo", "Palmeira dos Índios", "São Miguel dos Campos"],
    AP: ["Macapá", "Santana", "Laranjal do Jari", "Oiapoque", "Porto Grande"],
    AM: ["Manaus", "Parintins", "Itacoatiara", "Manacapuru", "Coari"],
    BA: ["Salvador", "Feira de Santana", "Vitória da Conquista", "Camaçari", "Itabuna"],
    CE: ["Fortaleza", "Caucaia", "Juazeiro do Norte", "Maracanaú", "Sobral"],
    DF: ["Brasília"],
    ES: ["Vitória", "Vila Velha", "Serra", "Cariacica", "Linhares"],
    GO: ["Goiânia", "Aparecida de Goiânia", "Anápolis", "Rio Verde", "Luziânia"],
    MA: ["São Luís", "Imperatriz", "São José de Ribamar", "Timon", "Caxias"],
    MT: ["Cuiabá", "Várzea Grande", "Rondonópolis", "Sinop", "Tangará da Serra"],
    MS: ["Campo Grande", "Dourados", "Três Lagoas", "Corumbá", "Ponta Porã"],
    MG: ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Betim"],
    PA: ["Belém", "Ananindeua", "Santarém", "Marabá", "Castanhal"],
    PB: ["João Pessoa", "Campina Grande", "Santa Rita", "Patos", "Bayeux"],
    PR: ["Curitiba", "Londrina", "Maringá", "Ponta Grossa", "Cascavel"],
    PE: ["Recife", "Jaboatão dos Guararapes", "Olinda", "Caruaru", "Petrolina"],
    PI: ["Teresina", "Parnaíba", "Picos", "Piripiri", "Floriano"],
    RJ: ["Rio de Janeiro", "São Gonçalo", "Duque de Caxias", "Nova Iguaçu", "Niterói"],
    RN: ["Natal", "Mossoró", "Parnamirim", "São Gonçalo do Amarante", "Macau"],
    RS: ["Porto Alegre", "Caxias do Sul", "Pelotas", "Canoas", "Santa Maria"],
    RO: ["Porto Velho", "Ji-Paraná", "Ariquemes", "Vilhena", "Cacoal"],
    RR: ["Boa Vista", "Rorainópolis", "Caracaraí", "Alto Alegre", "Mucajaí"],
    SC: ["Florianópolis", "Joinville", "Blumenau", "São José", "Chapecó"],
    SP: ["São Paulo", "Guarulhos", "Campinas", "São Bernardo do Campo", "Santo André"],
    SE: ["Aracaju", "Nossa Senhora do Socorro", "Lagarto", "Itabaiana", "São Cristóvão"],
    TO: ["Palmas", "Araguaína", "Gurupi", "Porto Nacional", "Paraíso do Tocantins"]
  };

  const carregarDemandas = async () => {
    try {
      const res = await api.get("/demandas");
      setDemandas(res.data);
    } catch (err) {
      console.error('Erro ao carregar demandas:', err);
      setDemandas([]);
    }
  };

  const carregarObras = async () => {
    try {
      const res = await api.get('/obras');
      setObras(res.data || []);
    } catch (err) {
      console.error('Erro ao carregar obras:', err);
      setObras([]);
    }
  };

  const imprimirPainel = () => {
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Painel de Monitoramento</title><style>body{font-family:Arial,Helvetica,sans-serif;padding:20px;color:#111} .card{display:flex;align-items:center;gap:12px;padding:12px;border-radius:8px;background:#fff;margin-bottom:8px;box-shadow:0 6px 18px rgba(2,6,23,0.04)} .left{width:6px;height:48px;border-radius:4px}</style></head><body>` +
      `<h2>Painel de Monitoramento</h2>` +
      `<div class="card"><div class="left" style="background:#3b82f6"></div><div><div style="font-size:12px;color:#666">Total de Obras</div><div style="font-size:20px;font-weight:700">${obras.length}</div></div></div>` +
      `<div class="card"><div class="left" style="background:#f97316"></div><div><div style="font-size:12px;color:#666">Em Andamento</div><div style="font-size:20px;font-weight:700">${obras.filter(o => o.status === 'em_andamento').length}</div></div></div>` +
      `<div class="card"><div class="left" style="background:#10b981"></div><div><div style="font-size:12px;color:#666">Concluídas</div><div style="font-size:20px;font-weight:700">${obras.filter(o => o.status === 'concluida' || o.status === 'concluídas').length}</div></div></div>` +
      `<div class="card"><div class="left" style="background:#ef4444"></div><div><div style="font-size:12px;color:#666">Paradas</div><div style="font-size:20px;font-weight:700">${obras.filter(o => o.status === 'parada' || o.status === 'cancelada' || o.status === 'paradas').length}</div></div></div>` +
      `</body></html>`;
    const w = window.open('', '_blank');
    w.document.write(html);
    w.document.close();
    setTimeout(() => { w.print(); w.close(); }, 500);
  };

  const exportarCSVPainel = () => {
    const rows = [ ['Métrica','Valor'], ['Total de Obras', obras.length], ['Em Andamento', obras.filter(o => o.status === 'em_andamento').length], ['Concluídas', obras.filter(o => o.status === 'concluida' || o.status === 'concluídas').length], ['Paradas', obras.filter(o => o.status === 'parada' || o.status === 'cancelada' || o.status === 'paradas').length] ];
    const csvContent = rows.map(r => r.map(c => `"${(''+c).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'painel_monitoramento.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportarPDFPainel = () => {
    imprimirPainel();
  };

  const imprimirSolicitacoes = () => {
    const rowsHtml = demandas.map((d, i) => {
      const inicio = d.created_at ? new Date(d.created_at).toLocaleString() : '-';
      const atualizado = d.updated_at ? new Date(d.updated_at).toLocaleString() : '-';
      return `<tr><td>${i + 1}</td><td>${(d.titulo||'')}</td><td>${(d.bairro||'')}</td><td>${(d.status||'')}</td><td>-</td><td>${inicio}</td><td>-</td><td>${atualizado}</td></tr>`;
    }).join('');
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Solicitações de Novas Obras</title><style>body{font-family:Arial,Helvetica,sans-serif;padding:20px;color:#111}table{width:100%;border-collapse:collapse}th,td{padding:8px;border:1px solid #e6e9ef;text-align:left}th{background:#f8fafc;color:#6b7280;font-size:12px}</style></head><body>` +
      `<h2>Solicitações de Novas Obras</h2><table><thead><tr><th>N°</th><th>TÍTULO</th><th>BAIRRO</th><th>STATUS</th><th>PROGRESSO</th><th>INÍCIO</th><th>FIM</th><th>ATUALIZADO EM</th></tr></thead><tbody>${rowsHtml}</tbody></table></body></html>`;
    const w = window.open('', '_blank');
    w.document.write(html);
    w.document.close();
    setTimeout(() => { w.print(); w.close(); }, 500);
  };

  const exportarCSVSolicitacoes = () => {
    const headers = ['N°','TÍTULO','BAIRRO','STATUS','PROGRESSO','INÍCIO','FIM','ATUALIZADO EM','LATITUDE','LONGITUDE'];
    const rows = demandas.map((d, i) => {
      const inicio = d.created_at ? new Date(d.created_at).toLocaleString() : '-';
      const atualizado = d.updated_at ? new Date(d.updated_at).toLocaleString() : '-';
      return [i + 1, d.titulo || '', d.bairro || '', d.status || '', '-', inicio, '-', atualizado, d.latitude || '', d.longitude || ''];
    });
    const csvContent = [headers, ...rows].map(r => r.map(c => `"${(''+c).replace(/"/g,'""') }"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'solicitacoes_novas_obras.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportarPDFSolicitacoes = () => {
    imprimirSolicitacoes();
  };

  const criarSolicitacao = async (e) => {
    e.preventDefault();
    try {
      // Monta a demanda com título padrão para solicitações de obra
      const payload = {
        titulo: 'Solicitação de Nova Obra',
        descricao: `${descricaoSolicitacao}\nLocal: ${lugarSolicitacao}\nData sugerida: ${dataSolicitacao}`,
        bairro: lugarSolicitacao || '',
        cidade: '',
        estado: '',
        latitude: solicitacaoLatitude,
        longitude: solicitacaoLongitude
      };
      await api.post('/demandas', payload);
      setDescricaoSolicitacao('');
      setLugarSolicitacao('');
      setDataSolicitacao('');
      setSolicitacaoLatitude(null);
      setSolicitacaoLongitude(null);
      alert('Solicitação enviada com sucesso. Obrigado!');
      carregarDemandas();
    } catch (err) {
      console.error('Erro ao enviar solicitação:', err);
      alert('Erro ao enviar solicitação. Tente novamente.');
    }
  };

  const criarDemanda = async (e) => {
    e.preventDefault();
    try {
      await api.post("/demandas", { ...nova });
      setNova({ titulo: "", descricao: "", bairro: "", estado: "", cidade: "", latitude: null, longitude: null });
      carregarDemandas();
    } catch (err) {
      console.error('Erro ao criar demanda:', err);
    }
  };

  const deletarDemanda = async (id) => {
    try {
      await api.delete(`/demandas/${id}`);
      carregarDemandas();
    } catch (err) {
      console.error('Erro ao deletar demanda:', err);
    }
  };

  useEffect(() => {
    carregarDemandas();
    carregarObras();
    let intervalId;
    if (isAdmin && isAdmin()) {
      intervalId = setInterval(() => carregarDemandas(), 20000);
    }
    return () => { if (intervalId) clearInterval(intervalId); };
  }, []);

  useEffect(() => {
    const query = lugarSolicitacao.trim();
    if (query.length < 3) {
      if (!query) {
        setGeocodeStatus("idle");
      }
      return undefined;
    }

    const normalizedQuery = query.toLowerCase();
    if (normalizedQuery === lastGeocodeValue.current) {
      return undefined;
    }

    const controller = new AbortController();
    setGeocodeStatus("loading");

    const timeoutId = setTimeout(async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=br&q=${encodeURIComponent(`${query}, São Luís, Maranhão, Brasil`)}`;
        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            Accept: "application/json",
          },
        });
        if (!response.ok) throw new Error("Falha ao buscar localização");
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);
          setMapFocus({ lat, lng });
          setSolicitacaoLatitude(lat);
          setSolicitacaoLongitude(lng);
          setGeocodeStatus("done");
          lastGeocodeValue.current = normalizedQuery;
        } else {
          setGeocodeStatus("not_found");
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Erro ao localizar bairro:", error);
          setGeocodeStatus("error");
        }
      }
    }, 700);

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [lugarSolicitacao]);

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content" style={{ marginLeft: 240 }}>
        <h1 className="page-title">
          {isAdmin() ? 'Painel de Controle' : 'Demandas Comunitárias e Mapa de Obras'}
        </h1>

        {/* Se for admin, mostrar resumo de monitoramento com cartões e tabela de solicitações */}
        {isAdmin() ? (
          <div className="admin-dashboard">
            <div className="dashboard-card">
              <h2>Monitoramento de Obras</h2>
              <p>Acompanhe o andamento de todas as obras em tempo real</p>
              <div className="card-grid">
                <div className="card">
                  <div className="card-icon" style={{ background: '#3b82f6' }}></div>
                  <div>
                    <p>Total de Obras</p>
                    <h3>{obras.length}</h3>
                  </div>
                </div>
                <div className="card">
                  <div className="card-icon" style={{ background: '#f97316' }}></div>
                  <div>
                    <p>Em Andamento</p>
                    <h3>{obras.filter(o => o.status === 'em_andamento').length}</h3>
                  </div>
                </div>
                <div className="card">
                  <div className="card-icon" style={{ background: '#10b981' }}></div>
                  <div>
                    <p>Concluídas</p>
                    <h3>{obras.filter(o => o.status === 'concluida' || o.status === 'concluídas').length}</h3>
                  </div>
                </div>
                <div className="card">
                  <div className="card-icon" style={{ background: '#ef4444' }}></div>
                  <div>
                    <p>Paradas</p>
                    <h3>{obras.filter(o => o.status === 'parada' || o.status === 'cancelada' || o.status === 'paradas').length}</h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="solicitacoes-section">
              <div className="section-header">
                <h3>Solicitações de Novas Obras</h3>
                <div className="action-buttons">
                  <button onClick={imprimirSolicitacoes} className="btn-ghost">
                    <FaPrint /> Imprimir
                  </button>
                  <button onClick={exportarPDFSolicitacoes} className="btn-ghost">
                    <FaFilePdf /> Exportar PDF
                  </button>
                  <button onClick={exportarCSVSolicitacoes} className="btn-primary">
                    <FaFileExcel /> Exportar Excel
                  </button>
                </div>
              </div>

              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>N°</th>
                      <th>TÍTULO</th>
                      <th>BAIRRO</th>
                      <th>STATUS</th>
                      <th>PROGRESSO</th>
                      <th>INÍCIO</th>
                      <th>FIM</th>
                      <th>ATUALIZADO EM</th>
                      <th>AÇÕES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demandas.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="empty-state">
                          <FaSearch className="empty-icon" />
                          <p>Nenhuma solicitação encontrada</p>
                          <small>Tente ajustar os filtros de busca</small>
                        </td>
                      </tr>
                    ) : (
                      demandas.map((d, i) => (
                        <tr key={d.id}>
                          <td>{i + 1}</td>
                          <td>{d.titulo}</td>
                          <td>{d.bairro}</td>
                          <td>{d.status}</td>
                          <td>-</td>
                          <td>{d.created_at ? new Date(d.created_at).toLocaleDateString() : '-'}</td>
                          <td>-</td>
                          <td>{d.updated_at ? new Date(d.updated_at).toLocaleDateString() : '-'}</td>
                          <td>
                            {isAdmin && isAdmin() && (
                              <div className="action-group">
                                {d.status === 'pendente' ? (
                                  <button onClick={async () => { try { await api.put(`/demandas/${d.id}`, { status: 'confirmada' }); carregarDemandas(); } catch (err) { console.error('Erro ao confirmar demanda:', err); alert('Erro ao confirmar demanda'); } }} className="btn-primary">Verificar / Confirmar</button>
                                ) : (
                                  <span className="status-confirmed">Confirmada</span>
                                )}
                                <button onClick={async () => { if (confirm('Deseja deletar esta demanda?')) { try { await api.delete(`/demandas/${d.id}`); carregarDemandas(); } catch (err) { console.error('Erro ao deletar demanda:', err); alert('Erro ao deletar demanda'); } } }} className="btn-ghost">Excluir</button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="user-dashboard">
            {/* User-specific content */}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
