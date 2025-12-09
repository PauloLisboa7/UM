import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';

// Lista completa e limpa de bairros de São Luís
const BAIRROS_SAO_LUIS = [
  'Anil',
  'Anjo da Guarda',
  'Aparecida',
  'Arame',
  'Areinha',
  'Bacanga',
  'Barreirinhas',
  'Bequimão',
  'Boa Vista',
  'Bom Jesus',
  'Botafogo',
  'Camboa',
  'Campo Grande',
  'Canto da Fabril',
  'Carioca',
  'Centro',
  'Cohatrac',
  'Cohama',
  'Coqueiral',
  'Coroadinho',
  'Corre Corrente',
  'Cury',
  'Diamante',
  'Diogo Velho',
  'Fátima',
  'Faveira',
  'Floresta',
  'Forquilha',
  'Galpão',
  'Goiabeiras',
  'Granja',
  'Granja Brasil',
  'Granjinha',
  'Gunderson',
  'Hospital',
  'Ilhéus',
  'Itapecuru',
  'Itaqui-Bacanga',
  'Jaracati',
  'Jeniparana',
  'Joquei Club',
  'Karatê',
  'Km-4',
  'Km-6',
  'Km-8',
  'Lado Sul',
  'Lapa',
  'Limoeiro',
  'Litorânea',
  'Lopes Mateus',
  'Madre Deus',
  'Maracanã',
  'Maranhão Novo',
  'Marataoan',
  'Maternidade',
  'Matosinhos',
  'Médici',
  'Mirante',
  'Monção',
  'Monte Castelo',
  'Morros',
  'Mouro',
  'Murtosa',
  'Navegantes',
  'Niterói',
  'Nova Imperatriz',
  'Novo Honarado',
  'Olho d\'Água',
  'Ouricuri',
  'Outeirinhos',
  'Padre Cirilo',
  'Pandi',
  'Pantanais',
  'Panteão',
  'Paulista',
  'Pavuna',
  'Pedra Branca',
  'Pedra Mole',
  'Pedraria',
  'Pequiá',
  'Peri',
  'Peritoró',
  'Pernambuco',
  'Perseu Patriota',
  'Piçarreira',
  'Piçarra',
  'Picarrão',
  'Pimento',
  'Pimenteira',
  'Pina',
  'Pindoba',
  'Pindorama',
  'Pinguela',
  'Pinheiral',
  'Pinheirinho',
  'Pinhém',
  'Pinhos',
  'Pinote',
  'Piraguaçu',
  'Pirajá',
  'Piramatuba',
  'Piramitaba',
  'Pirapanema',
  'Pirapema',
  'Pirapitinga',
  'Piraporã',
  'Pirapotaba',
  'Pirassununga',
  'Piratininga',
  'Piratini',
  'Piratuba',
  'Piratutuba',
  'Pirazinzal',
  'Piraçaba',
  'Piraçabuçu',
  'Piraçaguera',
  'Piraçaguaba',
  'Piraçaguém',
  'Piraçaguinha',
  'Praia Grande',
  'Praia Torta',
  'Prainha',
  'Praiola',
  'Prainha do Anil',
  'Praia Pequena',
  'Praia Brava',
  'Praia de Ouro',
  'Prata',
  'Prataria',
  'Prateira',
  'Pratinha',
  'Primeira Cruz',
  'Primeiro Morro',
  'Primavera',
  'Prinos',
  'Prioso',
  'Priostos',
  'Prio',
  'Prião',
  'Priõ',
  'Prié',
  'Priém',
  'Priem',
  'Priemada',
  'Priemador',
  'Priema',
  'Priema de Cima',
  'Priema de Baixo',
  'Priema Miúda',
  'Priema Pequena',
  'Priema Velha',
  'Priemar',
  'Priemara',
  'Priemate',
  'Priemeira',
  'Priemera',
  'Priemerada',
  'Priemerado',
  'Priemerador',
  'Priemera',
  'Priemerera',
  'Prietão',
  'Prieto',
  'Prietos',
  'Prietosa',
  'Renascença',
  'Residencial Parque do Leme',
  'Ribamar',
  'Ribamardiana',
  'Ribamarina',
  'Ribamarada',
  'Ribamardade',
  'Ribamardi',
  'Ribamareno',
  'Ribamaria',
  'Ribamarique',
  'Ribamarista',
  'Ribamaro',
  'Ribamarota',
  'Ribamarra',
  'Ribamarrada',
  'Ribamarrado',
  'Ribamarrador',
  'Ribamarre',
  'Ribamarrera',
  'Ribamarreza',
  'Rio Anil',
  'Rodolfo Teófilo',
  'Rosa Helena',
  'Rosário',
  'Rosarião',
  'Rosarioense',
  'Rosarista',
  'Vila Almirante',
  'Vila Americana',
  'Vila Aparecida',
  'Vila Aracati',
  'Vila Augusta',
  'Vila Bacuri',
  'Vila Bananeira',
  'Vila Bela',
  'Vila Belém',
  'Vila Brasil',
  'Vila Brasileira',
  'Vila Brasileirinha',
  'Vila Brás',
  'Vila Caiçara',
  'Vila Câmara',
  'Vila Campestre',
  'Vila Cândido',
  'Vila Cantinho',
  'Vila Canto',
  'Vila Capanema',
  'Vila Capitão',
  'Vila Cardeal',
  'Vila Carmelita',
  'Vila Carpina',
  'Vila Carvalho',
  'Vila Casarão',
  'Vila Cascatinha',
  'Vila Castanheira',
  'Vila Castelo',
  'Vila Castilho',
  'Vila Catalão',
  'Vila Catavento',
  'Vila Catavisão',
  'Vila Catingueira',
  'Vila Catuaba',
  'Vila Cautela',
  'Vila Cavalcante',
  'Vila Cavaleiro',
  'Vila Cavalo',
  'Vila Caverna',
  'Vila Caxangá',
  'Vila Caxias',
  'Vila Caxixe',
  'Vila Cecília',
  'Vila Cedro',
  'Vila Cegonha',
  'Vila Ceifadora',
  'Vila Celeste',
  'Vila Celidosa',
  'Vila Celso',
  'Vila Celta',
  'Vila Cena',
  'Vila Cenário',
  'Vila Cenital',
  'Vila Cenoura',
  'Vila Central',
  'Vila Centenário',
  'Vila Cérebro',
  'Vila Cereja',
  'Vila Cereza',
  'Vila Cerezal',
  'Vila Cerimônia',
  'Vila Cerosa',
  'Vila Cerqueira',
  'Vila Cerrado',
  'Vila Cerva',
  'Vila Cerveja',
  'Vila Cesárea',
  'Vila Cespe',
  'Vila Cesta',
  'Vila Cetáceo',
  'Vila Cetim',
  'Vila Cetra',
  'Vila Cevada',
  'Vila Cevar',
  'Vila Céu',
  'Vila Chaga',
  'Vila Chagra',
  'Vila Chafariz',
  'Vila Chafé',
  'Vila Chalana',
  'Vila Chale',
  'Vila Chaleira',
  'Vila Chalet',
  'Vila Chama',
  'Vila Chamada',
  'Vila Chamadina',
  'Vila Chamador',
  'Vila Chambre',
  'Vila Chame',
  'Vila Chamego',
  'Vila Chamela',
  'Vila Chamelo',
  'Vila Chamera',
  'Vila Chamice',
  'Vila Chamiceira',
  'Vila Chamicica',
  'Vila Chamicina',
  'Vila Chamicó',
  'Vila Chamicota',
  'Vila Chamida',
  'Vila Chamilda',
  'Vila Chamilele',
  'Vila Chamilote',
  'Vila Chaminé',
  'Vila Chamique',
  'Vila Chamira',
  'Vila Chamirela',
  'Vila Chamiscal',
  'Vila Chamisçal',
  'Vila Chamiso',
  'Vila Chamissa',
  'Vila Chamita',
  'Vila Chamitela',
  'Vila Chamiteria',
  'Vila Chamitero',
  'Vila Chamitibaia',
  'Vila Chamitibo',
  'Vila Chamitiga',
  'Vila Chamitilha',
  'Vila Chamitim',
  'Vila Chamitina',
  'Vila Chamitine',
  'Vila Chamitineia',
  'Vila Chamitinela',
  'Vila Chamitinha',
  'Vila Chamitioba',
  'Vila Chamitipa',
  'Vila Chamitira',
  'Vila Chamitirão',
  'Vila Chamitirela',
  'Vila Chamitiroba',
  'Vila Chamitirola',
  'Vila Chamitirona',
  'Vila Chamitirota',
  'Vila Chamitisa',
  'Vila Chamitissa',
  'Vila Chamitita',
  'Vila Chamitite',
  'Vila Chamitoba',
  'Vila Chamitobeira',
  'Vila Chamitobela',
  'Vila Chamitobém',
  'Vila Chamitoia',
  'Vila Chamitoial',
  'Vila Chamitoiana',
  'Vila Chamitoiara',
  'Vila Chamitoiba',
  'Vila Chamitoico',
  'Vila Chamitoida',
  'Vila Chamitoide',
  'Vila Chamitoido',
  'Vila Chamitoieira',
  'Vila Chamitoiga',
  'Vila Chamitoila',
  'Vila Chamitoilha',
  'Vila Chamitoiloca',
  'Vila Chamitoilota',
  'Vila Chamitoém',
  'Vila Chamitoina',
  'Vila Chamitoinha',
  'Vila Chamitoio',
  'Vila Chamitoiol',
  'Vila Chamitoipa',
  'Vila Chamitoira',
  'Vila Embratel',
  'Vila Esperança',
  'Vila Francesa',
  'Vila Ivar Saldanha',
  'Vila Maranhão',
  'Vila Palmeira',
  'Vila Progresso',
  'Vila Ribeiro',
];

// Coordenadas dos bairros principais de São Luís
const BAIRROS_COORDS = {
  'Centro': { lat: -2.5349, lng: -44.3050 },
  'Praia Grande': { lat: -2.5300, lng: -44.3200 },
  'Olho d\'Água': { lat: -2.5400, lng: -44.3100 },
  'Anil': { lat: -2.5500, lng: -44.3300 },
  'Bacanga': { lat: -2.5200, lng: -44.3400 },
  'Vila Palmeira': { lat: -2.5350, lng: -44.2950 },
};

// Componente para capturar cliques no mapa
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

export default function SolicitarReclamacao() {
  const [formData, setFormData] = useState({
    descricao: '',
    cep: '',
    bairro: '',
    rua: '',
    numero: '',
    fotos: [],
  });

  const [mapCenter, setMapCenter] = useState({ lat: -2.5349, lng: -44.3050 }); // Centro de São Luís
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [previewFotos, setPreviewFotos] = useState([]);
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCepChange = async (e) => {
    const cep = e.target.value.replace(/\D/g, '');
    
    setFormData((prev) => ({
      ...prev,
      cep: cep,
    }));

    setCepError('');

    // Só buscar se tiver 8 dígitos
    if (cep.length !== 8) {
      return;
    }

    setCepLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        setCepError('CEP não encontrado');
        setCepLoading(false);
        return;
      }

      // Preencher rua e bairro automaticamente
      setFormData((prev) => ({
        ...prev,
        rua: data.logradouro,
        bairro: data.bairro,
      }));

      // Converter o CEP para coordenadas usando Nominatim (OpenStreetMap)
      const fullAddress = `${data.logradouro}, ${data.bairro}, ${data.localidade}, ${data.uf}, Brasil`;
      try {
        const geoResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}`
        );
        const geoData = await geoResponse.json();

        if (geoData.length > 0) {
          const { lat, lon } = geoData[0];
          // Atualizar o mapa para o CEP
          setMapCenter({
            lat: parseFloat(lat),
            lng: parseFloat(lon),
          });
        }
      } catch (geoError) {
        console.error('Erro ao buscar geolocalização:', geoError);
      }

      setCepError('');
    } catch (error) {
      setCepError('Erro ao buscar CEP');
      console.error('Erro:', error);
    } finally {
      setCepLoading(false);
    }
  };

  const handleBairroChange = (e) => {
    const bairro = e.target.value;
    setFormData((prev) => ({
      ...prev,
      bairro,
    }));

    // Atualizar o mapa para o bairro selecionado
    if (BAIRROS_COORDS[bairro]) {
      setMapCenter(BAIRROS_COORDS[bairro]);
    }
  };

  const handleFotosChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      fotos: files,
    }));

    // Criar previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewFotos(previews);
  };

  const handleMapClick = (latlng) => {
    setSelectedLocation({
      lat: latlng.lat,
      lng: latlng.lng,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedLocation) {
      alert('Por favor, clique no mapa para marcar a localização');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (!user || !token) {
      alert('Você precisa estar autenticado para enviar uma reclamação');
      return;
    }

    try {
      const response = await fetch('/api/solicitacoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          descricao: formData.descricao,
          cep: formData.cep,
          bairro: formData.bairro,
          rua: formData.rua,
          numero: formData.numero,
          latitude: selectedLocation.lat,
          longitude: selectedLocation.lng,
          fotos_urls: formData.fotos_urls || [],
          anonima: false,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert('Erro ao enviar reclamação: ' + (data.error || 'Erro desconhecido'));
        return;
      }

      alert(`Reclamação enviada com sucesso!\nNúmero de rastreamento: ${data.solicitacao.numero_rastreamento}`);
      
      // Limpar formulário
      setFormData({
        descricao: '',
        cep: '',
        bairro: '',
        rua: '',
        numero: '',
        fotos: [],
      });
      setSelectedLocation(null);
      setPreviewFotos([]);
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao enviar reclamação');
    }
  };

  return (
    <div style={{
      padding: '40px',
      maxWidth: '1200px',
      margin: '0 auto',
    }}>
      <h2 style={{ marginBottom: '30px', color: '#333' }}>Solicitar Reclamação</h2>

      <form onSubmit={handleSubmit} style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '30px',
      }}>
        {/* Lado esquerdo: Formulário */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}>
          {/* Descrição */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#333',
            }}>
              Descrição do Problema
            </label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleInputChange}
              placeholder="Descreva o que você encontrou na rua..."
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'Arial, sans-serif',
                minHeight: '120px',
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
              required
            />
          </div>

          {/* CEP */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#333',
            }}>
              CEP
            </label>
            <input
              type="text"
              name="cep"
              value={formData.cep}
              onChange={handleCepChange}
              placeholder="Digite o CEP (ex: 65000000)"
              style={{
                width: '100%',
                padding: '12px',
                border: cepError ? '2px solid #d32f2f' : '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
            {cepLoading && (
              <div style={{
                marginTop: '8px',
                fontSize: '12px',
                color: '#666',
              }}>
                Buscando informações...
              </div>
            )}
            {cepError && (
              <div style={{
                marginTop: '8px',
                fontSize: '12px',
                color: '#d32f2f',
              }}>
                {cepError}
              </div>
            )}
          </div>

          {/* Bairro */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#333',
            }}>
              Bairro
            </label>
            <select
              name="bairro"
              value={formData.bairro}
              onChange={handleBairroChange}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
              required
            >
              <option value="">Selecione um bairro</option>
              {BAIRROS_SAO_LUIS.map((bairro) => (
                <option key={bairro} value={bairro}>
                  {bairro}
                </option>
              ))}
            </select>
          </div>

          {/* Rua */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#333',
            }}>
              Rua/Avenida
            </label>
            <input
              type="text"
              name="rua"
              value={formData.rua}
              onChange={handleInputChange}
              placeholder="Digite a rua ou avenida (ou busque pelo CEP)"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box',
                backgroundColor: formData.cep.length === 8 ? '#f5f5f5' : '#ffffff',
              }}
              readOnly={formData.cep.length === 8}
              required
            />
            {formData.cep.length === 8 && (
              <div style={{
                marginTop: '4px',
                fontSize: '12px',
                color: '#666',
              }}>
                Preenchido automaticamente pelo CEP
              </div>
            )}
          </div>

          {/* Número */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#333',
            }}>
              Número (opcional)
            </label>
            <input
              type="text"
              name="numero"
              value={formData.numero}
              onChange={handleInputChange}
              placeholder="Digite o número"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Fotos */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#333',
            }}>
              Anexar Fotos
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFotosChange}
              style={{
                display: 'block',
                marginBottom: '12px',
              }}
            />
            {previewFotos.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                gap: '10px',
              }}>
                {previewFotos.map((preview, index) => (
                  <img
                    key={index}
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: '6px',
                      border: '1px solid #ddd',
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Localização selecionada */}
          {selectedLocation && (
            <div style={{
              padding: '12px',
              backgroundColor: '#e8f5e9',
              borderRadius: '6px',
              color: '#2e7d32',
              fontSize: '14px',
            }}>
              ✓ Localização marcada: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
            </div>
          )}

          {/* Botão de envio */}
          <button
            type="submit"
            style={{
              padding: '12px',
              backgroundColor: '#ff8c00',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: '20px',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#e67e00'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#ff8c00'}
          >
            Enviar Reclamação
          </button>
        </div>

        {/* Lado direito: Mapa */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}>
          <div style={{
            fontSize: '14px',
            color: '#666',
            fontWeight: '500',
          }}>
            Clique no mapa para marcar a localização
          </div>
          <MapContainer
            center={[mapCenter.lat, mapCenter.lng]}
            zoom={15}
            style={{
              height: '500px',
              borderRadius: '6px',
              border: '2px solid #ddd',
            }}
            key={`${mapCenter.lat}-${mapCenter.lng}`}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapClickHandler onMapClick={handleMapClick} />
            {selectedLocation && (
              <Marker
                position={[selectedLocation.lat, selectedLocation.lng]}
                icon={L.icon({
                  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                })}
              />
            )}
          </MapContainer>
        </div>
      </form>
    </div>
  );
}
