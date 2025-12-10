import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import { useSolicitacao } from '../contexts/SolicitacaoContext';

// Lista COMPLETA de bairros de São Luís - Oficial
const BAIRROS_SAO_LUIS = [
  'Alameda dos Sonhos',
  'Alemanha',
  'Amapá',
  'Andiroba',
  'Angelim',
  'Anil',
  'Anjo da Guarda',
  'Apeadouro',
  'Apicum',
  'Aparecida',
  'Arame',
  'Argola e Tambor',
  'Arraial',
  'Areinha',
  'Aurora',
  'Alto Bonito',
  'Alto da Alegria',
  'Alto da Esperança',
  'Alto do Angelim',
  'Alto do Calhau',
  'Alto do Pinho',
  'Ananandiba',
  'Bacanga',
  'Barreto',
  'Barreirinhas',
  'Bela Vista',
  'Belira',
  'Bequimão',
  'Boa Vista',
  'Bom Jesus',
  'Bom Milagre',
  'Botafogo',
  'Brisa do Mar',
  'Cajueiro',
  'Cajupe',
  'Cajupary',
  'Calhau',
  'Camboa',
  'Camboa dos Frades',
  'Campo Grande',
  'Canto da Fabril',
  'Cantinho do Céu',
  'Caratatiua',
  'Carioca',
  'Cassaco',
  'Centro',
  'Chácara Brasil',
  'Cidade Nova do Gapara',
  'Cidade Olímpica',
  'Cidade Operária',
  'Cinturão Verde',
  'Codozinho',
  'Cohab Anil I',
  'Cohab Anil II',
  'Cohab Anil III',
  'Cohab Anil IV',
  'Cohab Anil V',
  'Cohafuma',
  'Cohajap',
  'Cohajoli',
  'Cohatrac I',
  'Cohatrac II',
  'Cohatrac III',
  'Cohatrac IV',
  'Cohama',
  'Cohapam',
  'Cohaserma',
  'Coheb',
  'Conjunto Alexandra Tavares',
  'Conjunto Basa',
  'Conjunto Belo Horizonte',
  'Conjunto Bom Clima',
  'Conjunto dos Ipens',
  'Conjunto Dom Sebastião',
  'Conjunto Jaguarema',
  'Conjunto Juçara',
  'Conjunto Penalva',
  'Conjunto Primavera',
  'Conjunto Promorar',
  'Conjunto Radional',
  'Conjunto São Raimundo',
  'Coqueiro',
  'Coqueiral',
  'Coquilho',
  'Coreia',
  'Coroado',
  'Coroadinho',
  'Corre Corrente',
  'Cruzeiro de Santa Bárbara',
  'Cruzeiro do Anil',
  'Cutim',
  'Cury',
  'Diamante',
  'Diogo Velho',
  'Distrito Industrial',
  'Divineia',
  'Eco Tajaçuaba',
  'Estiva',
  'Fabril',
  'Fátima',
  'Faveira',
  'Fé em Deus',
  'Filipinho',
  'Floresta',
  'Forquilha',
  'Fumacê',
  'Galpão',
  'Gancharia',
  'Gapara',
  'Goiabeiras',
  'Goiabal',
  'Habitacional Nice Lobão',
  'Habitacional Turu',
  'Igaraú',
  'Ilhinha',
  'Ilha Bela',
  'Ilha da Paz',
  'Ilhéus',
  'Inhaúma',
  'Ipase de baixo',
  'Ipase de cima',
  'Ipem São Cristóvão',
  'Ipem Turu',
  'Itapecuru',
  'Itapera',
  'Itapiracó',
  'Itaqui',
  'Itaqui-Bacanga',
  'Ivar Saldanha',
  'Jacamim',
  'Jaracati',
  'Jaracaty',
  'Jambeiro',
  'Jardim América',
  'Jardim Atlântico',
  'Jardim Coelho Neto',
  'Jardim Conceição',
  'Jardim de Allah',
  'Jardim de Fátima',
  'Jardim Eldorado',
  'Jardim Libanês',
  'Jardim Paulista',
  'Jardim Renascença',
  'Jardim São Cristóvão I',
  'Jardim São Cristóvão II',
  'Jardim São Francisco',
  'Jardim São Raimundo',
  'Jardim SM',
  'Jardim das Margaridas',
  'Jeniparana',
  'João de Deus',
  'João Paulo',
  'Jordoa',
  'Joquei Club',
  'Karatê',
  'Km 4',
  'Km 6',
  'Km 8',
  'Lado Sul',
  'Lapa',
  'Laranjeiras',
  'Liberdade',
  'Limoeiro',
  'Lira',
  'Litorânea',
  'Lopes Mateus',
  'Loteamento Alterosa',
  'Loteamento Valiam',
  'Macaúba',
  'Madre Deus',
  'Mãe Chica',
  'Magril',
  'Mangue Seco',
  'Maracanã',
  'Maranhão Novo',
  'Marataoan',
  'Materna Matel',
  'Maternidade',
  'Matosinhos',
  'Mata da Itapera',
  'Mato Grosso',
  'Matinha do Rio Grande',
  'Matões do Turu',
  'Médici',
  'Mirante',
  'Monção',
  'Monte Castelo',
  'Morro do Zé Bombom',
  'Morros',
  'Mouro',
  'Murtosa',
  'Navegantes',
  'Niterói',
  'Nova Betel',
  'Nova Imperatriz',
  'Novo Angelim',
  'Novo Honarado',
  'Olho d\'Água',
  'Ouricuri',
  'Outeirinhos',
  'Outeiro da Cruz',
  'Pã de Açúcar',
  'Padre Cirilo',
  'Pandi',
  'Pantanais',
  'Panteão',
  'Parque Amazonas',
  'Parque Atenas',
  'Parque Atlântico',
  'Parque Aurora',
  'Parque Brasil',
  'Parque das Palmeiras',
  'Parque dos Nobres',
  'Parque dos Sabiás',
  'Parque Guanabara',
  'Parque Nice Lobão',
  'Parque Olinda',
  'Parque Pindorama',
  'Parque Shalom',
  'Parque Smithland',
  'Parque Timbira',
  'Parque Universitário',
  'Paulista',
  'Pavuna',
  'Pedra Branca',
  'Pedra Mole',
  'Pedrinhas',
  'Pedraria',
  'Pereira',
  'Pequiá',
  'Peri',
  'Peritoró',
  'Pernambuco',
  'Perseu Patriota',
  'Piancó',
  'Piçarra',
  'Piçarreira',
  'Picarrão',
  'Piquizeiro',
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
  'Pirapora',
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
  'Piraçaguaba',
  'Piraçaguém',
  'Piraçaguera',
  'Piraçaguinha',
  'Planalto Anil I',
  'Planalto Anil II',
  'Planalto Anil III',
  'Planalto Anil IV',
  'Planalto Aurora',
  'Planalto Ipase',
  'Planalto Pingão',
  'Planalto Turu I',
  'Planalto Turu II',
  'Planalto Turu III',
  'Planalto Vinhais I',
  'Planalto Vinhais II',
  'Ponta d\'Areia',
  'Ponta do Farol',
  'Portal da Ilha',
  'Porto Grande',
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
  'Primavera do Bom Jesus',
  'Quebra Pote',
  'Quintas do Calhau',
  'Quitandinha',
  'Recanto Canaã',
  'Recanto Fialho',
  'Recanto Verde',
  'Recanto dos Nobres',
  'Recanto dos Pássaros',
  'Recanto dos Signos',
  'Recanto dos Vinhais',
  'Recanto do Bequimão',
  'Redenção',
  'Renascença',
  'Residencial 2000',
  'Residencial Albino Soeiro',
  'Residencial Alexandra Tavares',
  'Residencial Amendoeira',
  'Residencial Ana Jansen',
  'Residencial Araras',
  'Residencial Aroeiras',
  'Residencial Batatã',
  'Residencial Dom Ricardo',
  'Residencial Esperança',
  'Residencial Estrela Dalva',
  'Residencial Francisco Lima',
  'Residencial Ilha Bela',
  'Residencial Ivan Sarney',
  'Residencial Ivaldo Rodrigues',
  'Residencial João Alberto',
  'Residencial João do Vale',
  'Residencial José Reinaldo Tavares',
  'Residencial Luiz Bacelar',
  'Residencial Marcelo Dino',
  'Residencial Morada do Sol',
  'Residencial Nestor',
  'Residencial Nova Vida',
  'Residencial Olímpico',
  'Residencial Paraíso',
  'Residencial Parque das Palmeiras',
  'Residencial Parque do Leme',
  'Residencial Pinheiros',
  'Residencial Primavera',
  'Residencial Resende',
  'Residencial Ribeira',
  'Residencial Rio Anil',
  'Residencial Santos Dumont',
  'Residencial Santo Antônio',
  'Residencial São Domingos',
  'Residencial São Jerônimo',
  'Residencial São Paulo',
  'Residencial Shalom',
  'Residencial Tiradentes',
  'Residencial Valeam',
  'Residencial Vinhais',
  'Retiro Natal',
  'Ribamar',
  'Rio Anil',
  'Rio dos Cachorros',
  'Rio do Meio',
  'Rio Grande',
  'Rodolfo Teófilo',
  'Rosa Helena',
  'Rosário',
  'Sá Viana',
  'Sacavém',
  'Salina do Sacavém',
  'Santana',
  'Santa Bárbara',
  'Santa Clara',
  'Santa Cruz',
  'Santa Efigênia',
  'Santa Helena',
  'Santa Rosa',
  'Santo Antônio',
  'Santos Dumont',
  'São Bernardo',
  'São Benedito',
  'São Cristóvão',
  'São Francisco',
  'São Joaquim',
  'São Marcos',
  'São Mateus',
  'São Raimundo',
  'Sítio Leal',
  'Sitinho',
  'Sol e Mar',
  'Solar dos Lusitanos',
  'Tahim',
  'Tajaçuaba',
  'Tajipuru',
  'Tauá-Mirim',
  'Tibiri',
  'Tibirizinho',
  'Tinai',
  'Tindiba',
  'Tirirical',
  'Túnel do Sacavém',
  'Turu',
  'Vera Cruz',
  'Vila 21 de Abril',
  'Vila 25 de Maio',
  'Vila Alexandra Tavares',
  'Vila Almirante',
  'Vila Americana',
  'Vila Apaco',
  'Vila Aparecida',
  'Vila Aracati',
  'Vila Ariri',
  'Vila Ayrton Senna',
  'Vila Augusta',
  'Vila Bacuri',
  'Vila Bananeira',
  'Vila Bela',
  'Vila Belém',
  'Vila Brasil',
  'Vila Brasileira',
  'Vila Brasileirinha',
  'Vila Brás',
  'Vila Cabral Miranda',
  'Vila Caiçara',
  'Vila Câmara',
  'Vila Campestre',
  'Vila Cândido',
  'Vila Cantinho',
  'Vila Canto',
  'Vila Capanema',
  'Vila Capim',
  'Vila Capitão',
  'Vila Cardeal',
  'Vila Carmelita',
  'Vila Carpina',
  'Vila Cascavel',
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
  'Vila Chamique',
  'Vila Chamira',
  'Vila Chamirela',
  'Vila Chamiscal',
  'Vila Chamiso',
  'Vila Chamissa',
  'Vila Collier',
  'Vila Conceição',
  'Vila Cruzado',
  'Vila Cristalina',
  'Vila Cutia',
  'Vila Dom Luís',
  'Vila dos Frades',
  'Vila Eliseu Matos',
  'Vila Embratel',
  'Vila Esperança',
  'Vila Francesa',
  'Vila Funil',
  'Vila Geniparana',
  'Vila Industrial',
  'Vila Isabel',
  'Vila Isabel Cafeteira',
  'Vila Itamar',
  'Vila Ivar Saldanha',
  'Vila Jacu',
  'Vila Janaína',
  'Vila Jacu',
  'Vila Luizão',
  'Vila Madureira',
  'Vila Magril',
  'Vila Maracujá',
  'Vila Maranhão',
  'Vila Marinha',
  'Vila Mauro Fecury I',
  'Vila Mauro Fecury II',
  'Vila Mauro Fecury III',
  'Vila Mauro Fecury IV',
  'Vila Menino Jesus Praga',
  'Vila Natal',
  'Vila Nova',
  'Vila Nova Betel',
  'Vila Nova República',
  'Vila Palmeira',
  'Vila Passos',
  'Vila Portela',
  'Vila Progresso',
  'Vila Real',
  'Vila Regina',
  'Vila Ribeiro',
  'Vila Rica',
  'Vila Riod',
  'Vila Romário',
  'Vila Samara',
  'Vila Santa Julia',
  'Vila Sarney',
  'Vila Sete de Setembro',
  'Vila São João',
  'Vila São Luís',
  'Vila São Sebastião',
  'Vila Tiradentes',
  'Vila Vicente Fialho',
  'Vila Vitória',
  'Village dos Jasmins',
  'Vinhais',
  'Vinhais Velho',
  'Vivendas da Cohama',
  'Vivendas do Turu',
].sort();

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
  const { notifyNovaReclamacao } = useSolicitacao();
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

      // Normalizar o bairro retornado pela ViaCEP (remover "Zona", "Bairro", etc)
      let bairroNormalizado = data.bairro || '';
      
      // Remover prefixos comuns
      bairroNormalizado = bairroNormalizado
        .replace(/^Zona\s+/i, '')
        .replace(/^Bairro\s+/i, '')
        .trim();

      // Capitalizar corretamente (primeira letra maiúscula)
      bairroNormalizado = bairroNormalizado
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');

      // Buscar o bairro mais próximo da lista se não encontrar exato
      let bairroFinal = bairroNormalizado;
      if (!BAIRROS_SAO_LUIS.includes(bairroNormalizado)) {
        // Tentar encontrar uma correspondência aproximada
        const encontrado = BAIRROS_SAO_LUIS.find(b => 
          b.toLowerCase().includes(bairroNormalizado.toLowerCase()) ||
          bairroNormalizado.toLowerCase().includes(b.toLowerCase())
        );
        if (encontrado) {
          bairroFinal = encontrado;
        }
      }

      // Preencher rua e bairro automaticamente - IMEDIATO
      setFormData((prev) => ({
        ...prev,
        rua: data.logradouro || '',
        bairro: bairroFinal,
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
      
      // Notificar outros componentes sobre a nova reclamação
      notifyNovaReclamacao();
      
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
