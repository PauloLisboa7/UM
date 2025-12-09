import '../styles/GuiaServicos.css';

export default function GuiaServicos() {
  const servicos = [
    {
      id: 1,
      titulo: 'Solicitar Nova Ligação de Água',
      descricao: 'Instruções para solicitar uma nova ligação de água na sua propriedade.',
      passos: [
        'Acesse o portal da CAEMA (Companhia de Água e Esgoto do Maranhão)',
        'Clique em "Solicitações de Serviços"',
        'Preencha o formulário com dados pessoais e do imóvel',
        'Agende a vistoria',
        'Aguarde contato para conclusão da ligação',
      ],
      link: 'https://www.caema.ma.gov.br',
      icon: '💧',
      cor: '#2196F3',
    },
    {
      id: 2,
      titulo: 'Solicitar Nova Ligação de Energia',
      descricao: 'Processo para conectar energia elétrica em seu imóvel.',
      passos: [
        'Acesse o site da Equatorial Maranhão',
        'Selecione "Novo Serviço" ou "Ligação"',
        'Forneça documentação do imóvel e RG',
        'Pague taxa de ligação',
        'Agende vistoria técnica',
      ],
      link: 'https://ma.equatorialenergia.com.br/',
      icon: '⚡',
      cor: '#FFC107',
    },
    {
      id: 3,
      titulo: 'Como Tirar um Alvará de Funcionamento',
      descricao: 'Guia para obter licença de funcionamento para seu negócio.',
      passos: [
        'Reúna documentos: RG, CPF, comprovante de endereço',
        'Acesse a Prefeitura de São Luís (Departamento de Licenças)',
        'Preencha o formulário de solicitação',
        'Pague taxa de análise',
        'Aguarde inspeção do estabelecimento',
      ],
      link: 'https://saoluis.ma.gov.br',
      icon: '▶',
      cor: '#4CAF50',
    },
    {
      id: 4,
      titulo: 'Solicitar Habite-se',
      descricao: 'Obtenha o certificado de conclusão de construção.',
      passos: [
        'Finalize todas as obras e melhorias',
        'Contrate um engenheiro responsável',
        'Reúna documentos da construção',
        'Acesse a Prefeitura - Departamento de Construção',
        'Solicite inspeção final',
      ],
      link: 'https://saoluis.ma.gov.br',
      icon: '▢',
      cor: '#FF9800',
    },
    {
      id: 5,
      titulo: 'Alterar/Solicitar CPF',
      descricao: 'Processo para solicitar ou alterar seu CPF.',
      passos: [
        'Acesse o portal da Receita Federal',
        'Selecione "Solicitar CPF" ou "Alterar Dados"',
        'Preencha o formulário online',
        'Localize a unidade da Receita Federal mais próxima',
        'Agende atendimento presencial',
      ],
      link: 'https://www.gov.br/cidadania/pt-br/acesso-a-informacao/acoes-e-programas/cpf',
      icon: '◎',
      cor: '#9C27B0',
    },
    {
      id: 6,
      titulo: 'Pedir Certidão Negativa de Débitos',
      descricao: 'Obtenha comprovação de inexistência de débitos públicos.',
      passos: [
        'Acesse a Prefeitura Municipal de São Luís',
        'Procure por "Certidões e Consultas"',
        'Insira seu CPF ou CNPJ',
        'Gere a certidão gratuitamente',
        'Salve ou imprima o documento',
      ],
      link: 'https://saoluis.ma.gov.br',
      icon: '✓',
      cor: '#00BCD4',
    },
  ];

  return (
    <div className="guia-servicos-container">
      <div className="guia-header">
        <h2 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 8px 0', color: '#333' }}>
          📚 Guia de Serviços Públicos
        </h2>
        <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
          Encontre instruções passo a passo para solicitar serviços comuns da cidade
        </p>
      </div>

      <div className="servicos-grid">
        {servicos.map((servico) => (
          <div key={servico.id} className="servico-card">
            <div className="servico-header" style={{ borderTop: `4px solid ${servico.cor}` }}>
              <div className="servico-icon" style={{ fontSize: '32px' }}>
                {servico.icon}
              </div>
              <div className="servico-info">
                <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 4px 0', color: '#333' }}>
                  {servico.titulo}
                </h3>
                <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>
                  {servico.descricao}
                </p>
              </div>
            </div>

            <div className="servico-passos">
              <h4 style={{ fontSize: '13px', fontWeight: 600, margin: '16px 0 8px 0', color: '#333' }}>
                Como fazer:
              </h4>
              <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#666', lineHeight: 1.6 }}>
                {servico.passos.map((passo, index) => (
                  <li key={index}>{passo}</li>
                ))}
              </ol>
            </div>

            <a
              href={servico.link}
              target="_blank"
              rel="noopener noreferrer"
              className="servico-btn"
              style={{
                display: 'inline-block',
                marginTop: '12px',
                padding: '8px 16px',
                backgroundColor: servico.cor,
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.opacity = '0.8';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.opacity = '1';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Acessar Portal →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
