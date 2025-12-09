import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import 'leaflet/dist/leaflet.css';
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import estruturasFallback from "../data/estruturas";

// Fix for default markers in webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export default function MapView() {
  const { isAdmin } = useAuth();
  const mapRef = useRef(null);
  const [obras, setObras] = useState([]);
  const [demandas, setDemandas] = useState([]);
  const [estruturas, setEstruturas] = useState(estruturasFallback);

  const deleteObra = async (id) => {
    try {
      await api.delete(`/obras/${id}`);
      carregarObras();
    } catch (error) {
      console.error("Erro ao deletar obra:", error);
    }
  };

  const deleteDemanda = async (id) => {
    try {
      await api.delete(`/demandas/${id}`);
      carregarDemandas();
    } catch (error) {
      console.error("Erro ao deletar demanda:", error);
    }
  };

  const carregarObras = async () => {
    try {
      const res = await api.get("/obras");
      setObras(res.data);
    } catch (error) {
      console.error("Erro ao carregar obras:", error);
    }
  };

  const carregarDemandas = async () => {
    try {
      const res = await api.get("/demandas");
      setDemandas(res.data);
    } catch (error) {
      console.error("Erro ao carregar demandas:", error);
    }
  };

  const carregarEstruturas = async () => {
    try {
      const res = await api.get("/estruturas");
      if (Array.isArray(res.data) && res.data.length > 0) {
        setEstruturas(res.data);
      }
    } catch (error) {
      console.error("Erro ao carregar estruturas culturais:", error);
    }
  };

  useEffect(() => {
    carregarObras();
    carregarDemandas();
    carregarEstruturas();
  }, []);

  useEffect(() => {
    window.deleteObra = deleteObra;
    window.deleteDemanda = deleteDemanda;
  }, [deleteObra, deleteDemanda]);

  useEffect(() => {
    if (mapRef.current) return; // já inicializado

    const map = L.map("map-root", {
      center: [-2.5307, -44.3068], // São Luís, MA (aprox)
      zoom: 12,
      layers: [
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors"
        })
      ]
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // Limpar marcadores existentes
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapRef.current.removeLayer(layer);
      }
    });

    const statusColor = {
      'planejada': '#fbbf24',
      'pendente': '#fbbf24',
      'em_andamento': '#3b82f6',
      'concluida': '#10b981',
      'resolvida': '#10b981',
      'cancelada': '#ef4444'
    };

    const statusText = {
      'planejada': 'Planejada',
      'pendente': 'Pendente',
      'em_andamento': 'Em Andamento',
      'concluida': 'Concluída',
      'resolvida': 'Resolvida',
      'cancelada': 'Cancelada'
    };

    // Criar ícones customizados
    const obraIcon = L.divIcon({
      className: 'custom-obra-marker',
      html: '<div style="width: 24px; height: 24px; background: #3b82f6; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
      iconSize: [24, 24],
      iconAnchor: [12, 24]
    });

    const demandaIcon = L.divIcon({
      className: 'custom-demanda-marker',
      html: '<div style="width: 24px; height: 24px; background: #ef4444; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
      iconSize: [24, 24],
      iconAnchor: [12, 24]
    });

    const demandaConfirmadaIcon = L.divIcon({
      className: 'custom-demanda-confirmada-marker',
      html: '<div style="width: 24px; height: 24px; background: #3b82f6; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
      iconSize: [24, 24],
      iconAnchor: [12, 24]
    });

    const estruturaIcon = L.divIcon({
      className: 'custom-estrutura-marker',
      html: '<div style="width: 20px; height: 20px; background: #10b981; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.25);"></div>',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

  // Adicionar marcadores das obras
    obras.forEach((obra) => {
      if (obra.latitude && obra.longitude) {
        const marker = L.marker([obra.latitude, obra.longitude], { icon: obraIcon }).addTo(mapRef.current);

        const popupContent = `
          <div style="font-family: Arial, sans-serif; max-width: 250px;">
            <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px;">Obra: ${obra.titulo}</h3>
            <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 14px;">${obra.descricao}</p>
            <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 12px;">Bairro: ${obra.bairro}</p>
            <div style="display: flex; align-items: center; margin-bottom: 4px;">
              <span style="background: ${statusColor[obra.status] || '#6b7280'}; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px; font-weight: bold;">
                ${statusText[obra.status] || obra.status}
              </span>
            </div>
            ${obra.progresso !== null ? `<p style="margin: 0 0 4px 0; color: #6b7280; font-size: 12px;">Progresso: ${obra.progresso}%</p>` : ''}
            ${obra.valor_estimado ? `<p style="margin: 0 0 4px 0; color: #6b7280; font-size: 12px;">Valor Estimado: R$ ${obra.valor_estimado.toLocaleString('pt-BR')}</p>` : ''}
            ${obra.data_inicio ? `<p style="margin: 0 0 4px 0; color: #6b7280; font-size: 12px;">Início: ${new Date(obra.data_inicio).toLocaleDateString('pt-BR')}</p>` : ''}
            ${obra.data_fim ? `<p style="margin: 0; color: #6b7280; font-size: 12px;">Fim Previsto: ${new Date(obra.data_fim).toLocaleDateString('pt-BR')}</p>` : ''}
            ${isAdmin() ? `<button onclick="window.deleteObra(${obra.id})" style="margin-top: 8px; background: #ef4444; color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer;">Excluir</button>` : ''}
          </div>
        `;

        marker.bindPopup(popupContent);
      }
    });

    // Adicionar marcadores das estruturas culturais
    estruturas.forEach((e) => {
      if (e.latitude && e.longitude) {
        const marker = L.marker([e.latitude, e.longitude], { icon: estruturaIcon }).addTo(mapRef.current);

        const popupContent = `
          <div style="font-family: Arial, sans-serif; max-width: 240px;">
            <h3 style="margin: 0 0 8px 0; color: #064e3b; font-size: 15px;">Estrutura: ${e.nome}</h3>
            <p style="margin: 0 0 6px 0; color: #6b7280; font-size: 13px;">${e.local}</p>
            <p style="margin: 0; color: #6b7280; font-size: 13px;">${e.descricao}</p>
          </div>
        `;

        marker.bindPopup(popupContent);
      }
    });

    // Adicionar marcadores das demandas
    demandas.forEach((demanda) => {
      if (demanda.latitude && demanda.longitude) {
        const iconToUse = (demanda.status === 'confirmada' || demanda.status === 'confirmado') ? demandaConfirmadaIcon : demandaIcon;
        const marker = L.marker([demanda.latitude, demanda.longitude], { icon: iconToUse }).addTo(mapRef.current);

        const popupContent = `
          <div style="font-family: Arial, sans-serif; max-width: 250px;">
            <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px;">Demanda: ${demanda.titulo}</h3>
            <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 14px;">${demanda.descricao}</p>
            <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 12px;">Bairro: ${demanda.bairro}</p>
            <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 12px;">${demanda.cidade}, ${demanda.estado}</p>
            <div style="display: flex; align-items: center; margin-bottom: 4px;">
              <span style="background: ${statusColor[demanda.status] || '#6b7280'}; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px; font-weight: bold;">
                ${statusText[demanda.status] || demanda.status}
              </span>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
      }
    });
  }, [obras, demandas, estruturas]);

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <div id="map-root" style={{ height: "100%", width: "100%" }} />
      <div style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        background: "var(--card-bg)",
        padding: "8px 12px",
        borderRadius: "6px",
        border: "1px solid var(--border)",
        color: "var(--text)",
        fontSize: "12px",
        zIndex: 1000
      }}>
        <strong>Obras Públicas e Demandas</strong><br/>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <div style={{ width: "12px", height: "12px", background: "#3b82f6", borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)" }}></div>
            <span>Obras: {obras.length}</span>
          </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <div style={{ width: "12px", height: "12px", background: "#10b981", borderRadius: "50%" }}></div>
              <span>Estruturas: {estruturas.length}</span>
            </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <div style={{ width: "12px", height: "12px", background: "#ef4444", borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)" }}></div>
            <span>Demandas: {demandas.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
