import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";
import estruturasFallback from "../data/estruturas";

export default function EstruturaDetail() {
  const { id } = useParams();
  const [estrutura, setEstrutura] = useState(() => estruturasFallback.find((s) => (s.slug || s.id) === id));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await api.get(`/estruturas/${id}`);
        if (active) {
          setEstrutura(res.data);
        }
      } catch (error) {
        console.error("Erro ao carregar estrutura cultural:", error);
        if (active) {
          setEstrutura((prev) => prev ?? null);
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading && !estrutura) {
    return (
      <div className="app-container">
        <Navbar />
        <main className="main-content" style={{ marginLeft: 0 }}>
          <div style={{ maxWidth: 800, margin: '2rem auto', padding: 12, textAlign: 'center', color: 'var(--muted)' }}>
            Buscando informações da estrutura...
          </div>
        </main>
      </div>
    );
  }

  if (!estrutura) {
    return (
      <div className="app-container">
        <Navbar />
        <main className="main-content" style={{ marginLeft: 0 }}>
          <div style={{ maxWidth: 800, margin: '2rem auto', padding: 12 }}>
            <h2>Estrutura não encontrada</h2>
            <p>Verifique a lista de estruturas.</p>
            <Link to="/estruturas" className="btn-ghost">Voltar</Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content" style={{ marginLeft: 0 }}>
        <div style={{ maxWidth: 900, margin: '1.5rem auto', background: 'var(--card-bg)', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)' }}>
          <div style={{ width: '100%', height: 360, overflow: 'hidden' }}>
            <img src={estrutura.imagem} alt={estrutura.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ padding: 20 }}>
            <h1 style={{ marginTop: 0 }}>{estrutura.nome}</h1>
            <div style={{ color: 'var(--muted)', marginBottom: 12 }}>{estrutura.local} • Fundação: {estrutura.ano}</div>
            <h3>Descrição</h3>
            <p style={{ color: 'var(--text)' }}>{estrutura.descricao}</p>
            <h3>História</h3>
            <p style={{ color: 'var(--text)' }}>{estrutura.historia}</p>
            <div style={{ marginTop: 12 }}>
              <Link to="/estruturas" className="btn-ghost">Voltar à lista</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
