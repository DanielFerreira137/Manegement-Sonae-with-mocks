import { mockData, mockApiResponse } from './mocks';

// Mock functions para substituir as chamadas à API

// Auth
export const LoginUser = async (data: { usr: string, pw: string }): Promise<Boolean> => {
  // Simular validação de credenciais
  if (data.usr && data.pw) {
    // Definir cookie mock para desenvolvimento
    if (typeof window !== 'undefined') {
      const { setCookie } = await import('nookies');
      setCookie(null, 'token', 'mock-token-' + Date.now(), {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      });
    }
    return mockApiResponse(true);
  }
  throw new Error('Credenciais inválidas');
};

export const getNomeByEmail = async (email: string) => {
  return mockApiResponse({ nome: "João Silva" });
};

// Users
export const getUserInfo = async () => {
  return mockApiResponse(mockData.user);
};

export const getUsersByEmpresa = async (codigoEmpresa: number) => {
  return mockApiResponse([mockData.user]);
};

export const getUsersFiscais = async () => {
  return mockApiResponse(mockData.usuariosFiscais);
};

export const getFiscaisEmpresaUser = async (codigoEmpresa: number) => {
  return mockApiResponse(mockData.usuariosFiscais);
};

export const postCreateFornecedorMainUser = async (data: any) => {
  return mockApiResponse({ success: true });
};

export const postCreateFiscalMainUser = async (data: any) => {
  return mockApiResponse({ success: true });
};

export const postCreateFornecedorUser = async (data: any) => {
  return mockApiResponse({ success: true });
};

export const postCreateFiscalUser = async (data: any) => {
  return mockApiResponse({ success: true });
};

export const putUpdateUser = async (data: any) => {
  return mockApiResponse({ success: true });
};

export const putUpdateUserAtivo = async (data: any) => {
  return mockApiResponse({ success: true });
};

// Variáveis
export const getInsignias = async () => {
  return mockApiResponse(mockData.insignias);
};

export const getLojas = async () => {
  return mockApiResponse(mockData.lojas);
};

export const getSeccoes = async () => {
  return mockApiResponse(mockData.seccoes);
};

export const getTipoDeProjeto = async () => {
  return mockApiResponse(mockData.tiposProjeto);
};

export const getZonas = async () => {
  return mockApiResponse(mockData.zonas);
};

export const getTrabalhos = async () => {
  return mockApiResponse(mockData.trabalhos);
};

export const getAllSeccoesZonas = async () => {
  // Estrutura esperada: array de SeccaoData
  const seccoesData = mockData.seccoes.map(seccao => {
    const zonasDaSeccao = mockData.zonas.filter(zona => zona.codigoSeccao === seccao.codigoSeccao);
    
    return {
      codigoSeccao: seccao.codigoSeccao.toString(),
      nomeSeccao: seccao.nome,
      zonas: zonasDaSeccao.map(zona => {
        const trabalhosDaZona = mockData.trabalhos.filter(trabalho => trabalho.codigoZona === zona.codigoZona);
        
        return {
          codigoZona: zona.codigoZona.toString(),
          nomeZona: zona.nome,
          trabalhos: trabalhosDaZona.map(trabalho => ({
            codigoTrabalho: trabalho.codigoTrabalho.toString(),
            nomeTrabalho: trabalho.nome
          }))
        };
      })
    };
  });
  
  return mockApiResponse(seccoesData);
};

export const getSeccoesZonasBySeccao = async (codigoSeccao: number) => {
  const zonas = mockData.zonas.filter(zona => zona.codigoSeccao === codigoSeccao);
  const seccao = mockData.seccoes.find(s => s.codigoSeccao === codigoSeccao);
  
  // Estrutura esperada: array de SeccaoZonaData
  const seccaoZonaData = zonas.map(zona => ({
    seccaoZona: {
      codigoSeccoesZonas: zona.codigoZona,
      codigoSeccao: zona.codigoSeccao,
      codigoZona: zona.codigoZona
    },
    seccao: seccao || {
      codigoSeccao: codigoSeccao,
      nome: `Seção ${codigoSeccao}`
    },
    zona: zona
  }));
  
  return mockApiResponse(seccaoZonaData);
};

export const getZonasTrabalhosByZona = async (codigoZona: number) => {
  const trabalhos = mockData.trabalhos.filter(trabalho => trabalho.codigoZona === codigoZona);
  
  // Estrutura esperada: array de ZonaTrabalhoData
  const zonaTrabalhoData = trabalhos.map(trabalho => {
    const zona = mockData.zonas.find(z => z.codigoZona === trabalho.codigoZona);
    return {
      zonaTrabalho: {
        codigoZonaTrabalho: trabalho.codigoTrabalho,
        codigoZona: trabalho.codigoZona,
        codigoTrabalho: trabalho.codigoTrabalho
      },
      zona: zona || {
        codigoZona: trabalho.codigoZona,
        nome: `Zona ${trabalho.codigoZona}`,
        codigoSeccao: 1
      },
      trabalho: trabalho
    };
  });
  
  return mockApiResponse(zonaTrabalhoData);
};

// POST operations
export const postCreateLoja = async (data: any) => {
  return mockApiResponse({ success: true, codigoLoja: Date.now() });
};

export const postCreateSeccao = async (data: any) => {
  return mockApiResponse({ success: true, codigoSeccao: Date.now() });
};

export const postCreateZona = async (data: any) => {
  return mockApiResponse({ success: true, codigoZona: Date.now() });
};

export const postCreateTrabalho = async (data: any) => {
  return mockApiResponse({ success: true, codigoTrabalho: Date.now() });
};

export const PostCreateSeccaoZonaTrabalho = async (data: any) => {
  return mockApiResponse({ success: true });
};

// PUT operations
export const putUpdateSeccao = async (data: any) => {
  return mockApiResponse({ success: true });
};

export const putUpdateZona = async (data: any) => {
  return mockApiResponse({ success: true });
};

export const putUpdateTrabalho = async (data: any) => {
  return mockApiResponse({ success: true });
};

// Projetos
export const getProjetosByTipoProjetoAndInsignia = async (codigoTipoProjeto: number, codigoInsignia: number) => {
  const projetos = mockData.projetos.filter(
    projeto => projeto.codigoTipoProjeto === codigoTipoProjeto && projeto.codigoInsignia === codigoInsignia
  );
  
  // Estrutura esperada: array de AnoProjetos
  const projetosPorAno = [
    {
      ano: "2024",
      projetos: projetos.map(projeto => ({
        codigoProjeto: projeto.codigoProjeto,
        nomeProjeto: projeto.nome,
        descricao: projeto.descricao,
        dataInicio: projeto.dataInicio,
        dataFim: projeto.dataFim,
        status: projeto.status,
        codigoTipoProjeto: projeto.codigoTipoProjeto,
        codigoInsignia: projeto.codigoInsignia,
        loja: {
          codigoLoja: 1,
          nome: "Loja Centro",
          morada: "Rua Central, 123"
        }
      }))
    }
  ];
  
  return mockApiResponse(projetosPorAno);
};

export const getProjetosSeccaoZonaTrabalho = async (codigoProjeto: number) => {
  // Estrutura esperada: ProjetosSeccaoZonaTrabalho
  const projetosSeccaoZonaTrabalho = {
    empresas: [
      {
        empresa: {
          codigoEmpresa: 1,
          nome: "Empresa A",
          nif: "123456789"
        },
        seccoes: [
          {
            seccao: {
              codigoSeccao: 1,
              nome: "Seção A"
            },
            zonas: [
              {
                zona: {
                  codigoZona: 1,
                  nome: "Zona Norte",
                  codigoSeccao: 1
                },
                trabalhos: [
                  {
                    trabalho: {
                      codigoTrabalho: 1,
                      nome: "Pintura",
                      codigoZona: 1
                    },
                    detalhes: {
                      projetoSeccaoZonaTrabalho: {
                        codigoProjetoSeccaoZonaTrabalho: 1,
                        status: "Em andamento",
                        dataAlteracaoStatus: "2024-01-15T09:00:00Z",
                        progresso: 75
                      }
                    },
                    logs: {
                      trabalhoLog: {
                        codigoTrabalhoLog: 1,
                        comentario: "Início da pintura das paredes principais",
                        data: "2024-01-15T09:00:00Z"
                      },
                      fiscalizacaoLog: {
                        codigoFiscalizacaoLog: 1,
                        comentario: "Fiscalização da qualidade da tinta",
                        data: "2024-01-16T14:30:00Z"
                      },
                      decLog: {
                        codigoDecLog: 1,
                        comentario: "Aprovação do trabalho de pintura",
                        data: "2024-01-17T10:15:00Z"
                      }
                    }
                  },
                  {
                    trabalho: {
                      codigoTrabalho: 2,
                      nome: "Eletricidade",
                      codigoZona: 1
                    },
                    detalhes: {
                      projetoSeccaoZonaTrabalho: {
                        codigoProjetoSeccaoZonaTrabalho: 2,
                        status: "Concluído",
                        dataAlteracaoStatus: "2024-01-20T16:30:00Z",
                        progresso: 100
                      }
                    },
                    logs: {
                      trabalhoLog: {
                        codigoTrabalhoLog: 2,
                        comentario: "Instalação completa do sistema elétrico",
                        data: "2024-01-18T08:00:00Z"
                      },
                      fiscalizacaoLog: {
                        codigoFiscalizacaoLog: 2,
                        comentario: "Teste de segurança elétrica aprovado",
                        data: "2024-01-19T15:45:00Z"
                      },
                      decLog: {
                        codigoDecLog: 2,
                        comentario: "Trabalho de eletricidade concluído com sucesso",
                        data: "2024-01-20T16:30:00Z"
                      }
                    }
                  }
                ]
              },
              {
                zona: {
                  codigoZona: 2,
                  nome: "Zona Sul",
                  codigoSeccao: 1
                },
                trabalhos: [
                  {
                    trabalho: {
                      codigoTrabalho: 3,
                      nome: "Canalização",
                      codigoZona: 2
                    },
                    detalhes: {
                      projetoSeccaoZonaTrabalho: {
                        codigoProjetoSeccaoZonaTrabalho: 3,
                        status: "Pendente",
                        dataAlteracaoStatus: "2024-01-10T14:00:00Z",
                        progresso: 25
                      }
                    },
                    logs: {
                      trabalhoLog: {
                        codigoTrabalhoLog: 3,
                        comentario: "Planejamento da instalação de canalização",
                        data: "2024-01-10T14:00:00Z"
                      },
                      fiscalizacaoLog: null,
                      decLog: null
                    }
                  }
                ]
              }
            ]
          },
          {
            seccao: {
              codigoSeccao: 2,
              nome: "Seção B"
            },
            zonas: [
              {
                zona: {
                  codigoZona: 3,
                  nome: "Zona Este",
                  codigoSeccao: 2
                },
                trabalhos: [
                  {
                    trabalho: {
                      codigoTrabalho: 4,
                      nome: "Fundações",
                      codigoZona: 3
                    },
                    detalhes: {
                      projetoSeccaoZonaTrabalho: {
                        codigoProjetoSeccaoZonaTrabalho: 4,
                        status: "Concluído",
                        dataAlteracaoStatus: "2024-03-15T08:00:00Z",
                        progresso: 100
                      }
                    },
                    logs: {
                      trabalhoLog: {
                        codigoTrabalhoLog: 4,
                        comentario: "Fundações concluídas com sucesso",
                        data: "2024-03-15T08:00:00Z"
                      },
                      fiscalizacaoLog: {
                        codigoFiscalizacaoLog: 4,
                        comentario: "Fiscalização das fundações aprovada",
                        data: "2024-03-16T10:00:00Z"
                      },
                      decLog: {
                        codigoDecLog: 4,
                        comentario: "Fundações aprovadas para continuidade",
                        data: "2024-03-17T09:30:00Z"
                      }
                    }
                  },
                  {
                    trabalho: {
                      codigoTrabalho: 5,
                      nome: "Estrutura Metálica",
                      codigoZona: 3
                    },
                    detalhes: {
                      projetoSeccaoZonaTrabalho: {
                        codigoProjetoSeccaoZonaTrabalho: 5,
                        status: "Em andamento",
                        dataAlteracaoStatus: "2024-04-20T10:30:00Z",
                        progresso: 80
                      }
                    },
                    logs: {
                      trabalhoLog: {
                        codigoTrabalhoLog: 5,
                        comentario: "Montagem da estrutura metálica em progresso",
                        data: "2024-04-20T10:30:00Z"
                      },
                      fiscalizacaoLog: {
                        codigoFiscalizacaoLog: 5,
                        comentario: "Fiscalização da estrutura metálica",
                        data: "2024-04-21T14:00:00Z"
                      },
                      decLog: null
                    }
                  },
                  {
                    trabalho: {
                      codigoTrabalho: 6,
                      nome: "Sistemas HVAC",
                      codigoZona: 3
                    },
                    detalhes: {
                      projetoSeccaoZonaTrabalho: {
                        codigoProjetoSeccaoZonaTrabalho: 6,
                        status: "Em andamento",
                        dataAlteracaoStatus: "2024-05-10T14:00:00Z",
                        progresso: 60
                      }
                    },
                    logs: {
                      trabalhoLog: {
                        codigoTrabalhoLog: 6,
                        comentario: "Instalação dos sistemas HVAC iniciada",
                        data: "2024-05-10T14:00:00Z"
                      },
                      fiscalizacaoLog: null,
                      decLog: null
                    }
                  },
                  {
                    trabalho: {
                      codigoTrabalho: 7,
                      nome: "Acabamentos",
                      codigoZona: 3
                    },
                    detalhes: {
                      projetoSeccaoZonaTrabalho: {
                        codigoProjetoSeccaoZonaTrabalho: 7,
                        status: "Pendente",
                        dataAlteracaoStatus: "2024-06-05T11:15:00Z",
                        progresso: 0
                      }
                    },
                    logs: {
                      trabalhoLog: null,
                      fiscalizacaoLog: null,
                      decLog: null
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        empresa: {
          codigoEmpresa: 2,
          nome: "Empresa B",
          nif: "987654321"
        },
        seccoes: [
          {
            seccao: {
              codigoSeccao: 3,
              nome: "Seção C"
            },
            zonas: [
              {
                zona: {
                  codigoZona: 4,
                  nome: "Zona Oeste",
                  codigoSeccao: 3
                },
                trabalhos: [
                  {
                    trabalho: {
                      codigoTrabalho: 8,
                      nome: "Pavimentação",
                      codigoZona: 4
                    },
                    detalhes: {
                      projetoSeccaoZonaTrabalho: {
                        codigoProjetoSeccaoZonaTrabalho: 8,
                        status: "Em andamento",
                        dataAlteracaoStatus: "2024-05-25T09:45:00Z",
                        progresso: 40
                      }
                    },
                    logs: {
                      trabalhoLog: {
                        codigoTrabalhoLog: 8,
                        comentario: "Pavimentação em andamento",
                        data: "2024-05-25T09:45:00Z"
                      },
                      fiscalizacaoLog: null,
                      decLog: null
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };
  
  return mockApiResponse(projetosSeccaoZonaTrabalho);
};

export const getProjeto = async (codigoProjeto: number) => {
  const projeto = mockData.projetos.find(p => p.codigoProjeto === codigoProjeto) || mockData.projetos[0];
  
  // Adicionar nomeProjeto que é esperado pela interface
  const projetoComNome = {
    ...projeto,
    nomeProjeto: projeto.nome
  };
  
  return mockApiResponse(projetoComNome);
};

export const getEmpresasProjeto = async (codigoProjeto: number) => {
  return mockApiResponse({ empresas: mockData.empresas });
};

export const getResponsaveisProjetobyProjeto = async (codigoProjeto: number) => {
  return mockApiResponse({ responsaveisProjeto: mockData.responsaveisProjeto });
};

export const postCreateProjeto = async (data: any) => {
  return mockApiResponse({ success: true, codigoProjeto: Date.now() });
};

export const postCreateProjetoLoja = async (data: any) => {
  return mockApiResponse({ success: true });
};

export const postCreateEmpresaProjeto = async (data: any) => {
  return mockApiResponse({ success: true });
};

export const postCreateResponsavelProjeto = async (data: any) => {
  return mockApiResponse({ success: true });
};

export const postCreateProjetoSeccaoZonaTrabalho = async (data: any) => {
  return mockApiResponse({ success: true });
};

export const putUpdateProjetoSeccaoZonaTrabalho = async (data: any) => {
  return mockApiResponse({ success: true });
};

export const deleteProjetoSeccaoZonaTrabalho = async (data: any) => {
  return mockApiResponse({ success: true });
};

export const deleteEmpresaProjeto = async (data: any) => {
  return mockApiResponse({ success: true });
};

export const deleteResponsavelProjeto = async (data: any) => {
  return mockApiResponse({ success: true });
};

export const putUpdateProjeto = async (data: any) => {
  return mockApiResponse({ success: true });
};

export const putUpdateProjetoSendEmail = async (data: any) => {
  return mockApiResponse({ success: true });
};

export const postSendUpdateEmail = async (data: any) => {
  return mockApiResponse({ success: true });
};

// Empresas
export const getEmpresas = async () => {
  return mockApiResponse(mockData.empresas);
};

export const getEmpresasFiscalizacao = async () => {
  return mockApiResponse(mockData.empresas);
};

export const getEmpresasFornecedor = async () => {
  return mockApiResponse(mockData.empresas);
};

export const postCreateEmpresa = async (data: any) => {
  return mockApiResponse({ success: true, codigoEmpresa: Date.now() });
};

// Logs
export const getAllLogsByData = async (codigoProjetoSeccoesZonaTrabalho: number) => {
  return mockApiResponse(mockData.logs);
};

export const getAllDocs = async (codigoProjeto: number) => {
  // Estrutura esperada: DocumentsResponse
  const documentsResponse = {
    message: "Documentos carregados com sucesso",
    docs: mockData.documentos.map(doc => ({
      nomeFicheiro: doc.nome,
      codigoDocumentoImagem: doc.codigoDocumento,
      codigoProjeto: codigoProjeto,
      nUtilizador: 1,
      tipo: doc.tipo,
      url: doc.url,
      codigoEmpresa: 1,
      role: "Admin",
      createdAt: "2024-01-15T09:00:00Z",
      updatedAt: "2024-01-15T09:00:00Z"
    }))
  };
  
  return mockApiResponse(documentsResponse);
};

export const getAllImages = async (codigoProjeto: number) => {
  // Estrutura esperada: GroupedImages
  const groupedImages = {
    Fornecedor: mockData.imagens.slice(0, 2).map(img => ({
      codigoDocumentoImagem: img.codigoImagem,
      codigoProjeto: codigoProjeto,
      nUtilizador: 1,
      tipo: "image",
      url: img.url,
      codigoEmpresa: 1,
      role: "Fornecedor",
      nomeFicheiro: img.nome,
      createdAt: "15/01/2024",
      updatedAt: "15/01/2024",
      nomeEmpresa: "Empresa A"
    })),
    Fiscal: mockData.imagens.slice(2, 4).map(img => ({
      codigoDocumentoImagem: img.codigoImagem,
      codigoProjeto: codigoProjeto,
      nUtilizador: 2,
      tipo: "image",
      url: img.url,
      codigoEmpresa: 1,
      role: "Fiscal",
      nomeFicheiro: img.nome,
      createdAt: "16/01/2024",
      updatedAt: "16/01/2024",
      nomeEmpresa: "Empresa A"
    })),
    Dec: mockData.imagens.slice(4, 6).map(img => ({
      codigoDocumentoImagem: img.codigoImagem,
      codigoProjeto: codigoProjeto,
      nUtilizador: 1,
      tipo: "image",
      url: img.url,
      codigoEmpresa: 1,
      role: "Dec",
      nomeFicheiro: img.nome,
      createdAt: "17/01/2024",
      updatedAt: "17/01/2024",
      nomeEmpresa: "Empresa A"
    }))
  };
  
  return mockApiResponse(groupedImages);
};

export const postCreateTrabalhoLog = async (data: any) => {
  return mockApiResponse({ success: true });
};

export const postCreateFiscalizacaoLog = async (data: any) => {
  return mockApiResponse({ success: true });
};

export const postCreateDecLog = async (data: any) => {
  return mockApiResponse({ success: true });
};

export const postUpload = async (data: any) => {
  return mockApiResponse({ success: true, url: "https://via.placeholder.com/300x200" });
};

export const deleteFile = async (data: any) => {
  return mockApiResponse({ success: true });
};
