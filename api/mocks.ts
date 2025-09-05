// Mock data para substituir as chamadas à API
export const mockData = {
  // User data
  user: {
    nUtilizador: 1,
    nome: "João Silva",
    email: "joao.silva@sonae.pt",
    empresa: "Sonae",
    cargo: "Gestor de Projetos",
    ativo: true
  },

  // Tipos de projeto
  tiposProjeto: [
    { codigoTipoProjeto: 1, tipo: "Renovação" },
    { codigoTipoProjeto: 2, tipo: "Manutenção" },
    { codigoTipoProjeto: 3, tipo: "Construção" }
  ],

  // Insígnias
  insignias: [
    { 
      codigoInsignia: 1, 
      nome: "Insígnia Ouro", 
      logo: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop&crop=center"
    },
    { 
      codigoInsignia: 2, 
      nome: "Insígnia Prata", 
      logo: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=200&fit=crop&crop=center"
    },
    { 
      codigoInsignia: 3, 
      nome: "Insígnia Bronze", 
      logo: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&h=200&fit=crop&crop=center"
    }
  ],

  // Projetos
  projetos: [
    {
      codigoProjeto: 1,
      nome: "Projeto Renovação Loja 1",
      descricao: "Renovação completa da loja principal",
      codigoTipoProjeto: 1,
      codigoInsignia: 1,
      dataInicio: "2024-01-15",
      dataFim: "2024-06-30",
      status: "Em andamento"
    },
    {
      codigoProjeto: 2,
      nome: "Projeto Manutenção Loja 2",
      descricao: "Manutenção preventiva da loja secundária",
      codigoTipoProjeto: 2,
      codigoInsignia: 2,
      dataInicio: "2024-02-01",
      dataFim: "2024-04-30",
      status: "Concluído"
    },
    {
      codigoProjeto: 3,
      nome: "Projeto Construção Centro Comercial",
      descricao: "Construção de novo centro comercial com foco em sustentabilidade e eficiência energética",
      codigoTipoProjeto: 3,
      codigoInsignia: 3,
      dataInicio: "2024-03-01",
      dataFim: "2024-12-31",
      status: "Em andamento"
    }
  ],

  // Seções
  seccoes: [
    { codigoSeccao: 1, nome: "Seção A" },
    { codigoSeccao: 2, nome: "Seção B" },
    { codigoSeccao: 3, nome: "Seção C" }
  ],

  // Zonas
  zonas: [
    { codigoZona: 1, nome: "Zona Norte", codigoSeccao: 1 },
    { codigoZona: 2, nome: "Zona Sul", codigoSeccao: 1 },
    { codigoZona: 3, nome: "Zona Este", codigoSeccao: 2 }
  ],

  // Trabalhos
  trabalhos: [
    { codigoTrabalho: 1, nome: "Pintura", codigoZona: 1 },
    { codigoTrabalho: 2, nome: "Eletricidade", codigoZona: 1 },
    { codigoTrabalho: 3, nome: "Canalização", codigoZona: 2 },
    { codigoTrabalho: 4, nome: "Fundações", codigoZona: 3 },
    { codigoTrabalho: 5, nome: "Estrutura Metálica", codigoZona: 3 },
    { codigoTrabalho: 6, nome: "Sistemas HVAC", codigoZona: 3 },
    { codigoTrabalho: 7, nome: "Acabamentos", codigoZona: 3 }
  ],

  // Empresas
  empresas: [
    { codigoEmpresa: 1, nome: "Empresa A", nif: "123456789" },
    { codigoEmpresa: 2, nome: "Empresa B", nif: "987654321" }
  ],

  // Lojas
  lojas: [
    { codigoLoja: 1, nome: "Loja Centro", morada: "Rua Central, 123" },
    { codigoLoja: 2, nome: "Loja Norte", morada: "Avenida Norte, 456" }
  ],

  // Logs
  logs: [
    {
      codigoLog: 1,
      descricao: "Início dos trabalhos",
      data: "2024-01-15T09:00:00Z",
      tipo: "Trabalho"
    },
    {
      codigoLog: 2,
      descricao: "Fiscalização realizada",
      data: "2024-01-16T14:30:00Z",
      tipo: "Fiscalização"
    },
    {
      codigoLog: 3,
      descricao: "Início da construção - Fundações concluídas",
      data: "2024-03-15T08:00:00Z",
      tipo: "Trabalho"
    },
    {
      codigoLog: 4,
      descricao: "Fiscalização da estrutura metálica",
      data: "2024-04-20T10:30:00Z",
      tipo: "Fiscalização"
    },
    {
      codigoLog: 5,
      descricao: "Instalação dos sistemas HVAC iniciada",
      data: "2024-05-10T14:00:00Z",
      tipo: "Trabalho"
    },
    {
      codigoLog: 6,
      descricao: "Fiscalização de segurança e qualidade",
      data: "2024-06-05T11:15:00Z",
      tipo: "Fiscalização"
    }
  ],

  // Documentos
  documentos: [
    {
      codigoDocumento: 1,
      nome: "Plano de Obra.pdf",
      url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&h=150&fit=crop&crop=center",
      tipo: "PDF"
    },
    {
      codigoDocumento: 2,
      nome: "Especificações.docx",
      url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=200&h=150&fit=crop&crop=center",
      tipo: "DOC"
    },
    {
      codigoDocumento: 3,
      nome: "Projeto Arquitetónico.pdf",
      url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=150&fit=crop&crop=center",
      tipo: "PDF"
    },
    {
      codigoDocumento: 4,
      nome: "Especificações Técnicas HVAC.pdf",
      url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=200&h=150&fit=crop&crop=center",
      tipo: "PDF"
    },
    {
      codigoDocumento: 5,
      nome: "Certificados de Qualidade.docx",
      url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&h=150&fit=crop&crop=center",
      tipo: "DOC"
    }
  ],

  // Imagens
  imagens: [
    {
      codigoImagem: 1,
      nome: "Foto Antes.jpg",
      url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=300&h=200&fit=crop&crop=center"
    },
    {
      codigoImagem: 2,
      nome: "Foto Depois.jpg",
      url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&h=200&fit=crop&crop=center"
    },
    {
      codigoImagem: 3,
      nome: "Fundações Concluídas.jpg",
      url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&h=200&fit=crop&crop=center"
    },
    {
      codigoImagem: 4,
      nome: "Estrutura Metálica.jpg",
      url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop&crop=center"
    },
    {
      codigoImagem: 5,
      nome: "Sistemas HVAC.jpg",
      url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=200&fit=crop&crop=center"
    },
    {
      codigoImagem: 6,
      nome: "Acabamentos Finais.jpg",
      url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&h=200&fit=crop&crop=center"
    }
  ],

  // Responsáveis de projeto
  responsaveisProjeto: [
    {
      codigoResponsavel: 1,
      nUtilizador: 1,
      codigoProjeto: 1,
      sendEmail: true
    },
    {
      codigoResponsavel: 2,
      nUtilizador: 1,
      codigoProjeto: 3,
      sendEmail: true
    }
  ],

  // Usuários fiscais
  usuariosFiscais: [
    {
      nUtilizador: 2,
      nome: "Maria Santos",
      email: "maria.santos@sonae.pt",
      empresa: "Sonae",
      ativo: true
    }
  ]
};

// Função para simular delay de API
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Função para simular erro ocasional
const shouldSimulateError = () => Math.random() < 0.1; // 10% chance de erro

// Função para simular resposta de API
export const mockApiResponse = async <T>(data: T, errorMessage?: string) => {
  await delay();
  
  if (shouldSimulateError() && errorMessage) {
    throw new Error(errorMessage);
  }
  
  return data;
};
