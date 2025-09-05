// Interfaces para estruturas de dados principais (objetos com propriedades claras)
interface UserApp {
    nUtilizador: number;
    codigoEmpresa: number;
    responsavelEmpresa: boolean;
    nome: string;
    email: string;
    telemovel: string;
    nif: string;
    foto: string | null;
    role: string;
    ativo: boolean;
    empresa: Empresa | null;
}

interface Empresa {
    codigoEmpresa: number;
    nome: string;
    nif: string;
    tipo: string;
    email: string;
    telemovel: string;
    morada: string;
}

interface Loja {
    codigoLoja: number;
    codigoInsignia: number;
    nome: string;
    morada: string;
}

interface TipoProjeto {
    codigoTipoProjeto: number;
    tipo: string;
}

interface Projeto {
    codigoProjeto: number;
    codigoTipoProjeto: number;
    nomeProjeto: string;
    ano: number;
 
    createdAt: string;
    updatedAt: string;
    codigoLoja: number;
    loja: Loja;
    tiposProjeto: TipoProjeto;
}

interface Seccao {
    codigoSeccao: number;
    nome: string;
    codigoEmpresa: number;
}

interface Zona {
    codigoZona: number;
    nome: string;
    codigoEmpresa: number;
}

interface Trabalho {
    codigoTrabalho: number;
    nome: string;
    codigoEmpresa: number;
}

interface ProjetoSeccaoZonaTrabalho {
    codigoProjetoSeccoesZonaTrabalho: number;
    codigoProjeto: number;
    codigoSeccoesZonas: number;
    codigoZonaTrabalho: number;
    codigoEmpresa: number;
    dataIntervencao: string | null;
    dataPrevista: string | null;
    status: string;
    dataAlteracaoStatus: string | null;
    dataAlteracaoDataPrevista: string | null;
}

interface LogFiscalizacao {
    codigoFiscalizacaoLogs: number;
    codigoProjetoSeccoesZonaTrabalho: number;
    nUtilizador: number;
    comentario: string;
    createdAt: string;
    updatedAt: string;
}

interface LogTrabalho {
    codigoTrabalhoLogs: number;
    codigoProjetoSeccoesZonaTrabalho: number;
    nUtilizador: number;
    status: string;
    comentario: string;
    createdAt: string;
    updatedAt: string;
}

interface LogDec {
    codigoDecLogs: number;
    codigoProjetoSeccoesZonaTrabalho: number;
    nUtilizador: number;
    comentario: string;
    createdAt: string;
    updatedAt: string;
}

interface DetalhesTrabalho {
    projetoSeccaoZonaTrabalho: ProjetoSeccaoZonaTrabalho;
    empresa: Empresa;
}

interface Insignia {
    codigoInsignia: number;
    nome: string;
    logo: string;
}

interface SeccaoZona {
    codigoSeccoesZonas: number;
    codigoSeccao: number;
    codigoZona: number;
}

interface ZonaTrabalho {
    codigoZonaTrabalho: number;
    codigoZona: number;
    codigoTrabalho: number;
}

interface Acessos {
    nUtilizador: number;
    nome: string;
    email: string;
    foto: string | null;
}

interface ResponsavelProjeto {
    codigoResponsavelProjeto: number;
    codigoProjeto: number;
    nUtilizador: number;
    sendEmail: boolean;
    acessos: Acessos;
}

interface EmpresaProjeto {
    codigoEmpresaProjeto: number;
    codigoProjeto: number;
    codigoEmpresa: number;
    empresa: Empresa;
}

interface DocumentoImagem {
    codigoDocumentoImagem: number;
    codigoProjeto: number;
    nUtilizador: number;
    tipo: string;
    url: string;
    codigoEmpresa: number | null;
    role: string;
    nomeFicheiro: string;
    createdAt: string;
    updatedAt: string;
    nomeEmpresa: string | null;
}

interface Documento {
    nomeFicheiro: string;
    codigoDocumentoImagem: number;
    codigoProjeto: number;
    nUtilizador: number;
    tipo: string;
    url: string;
    codigoEmpresa: number | null;
    role: string;
    createdAt: string;
    updatedAt: string;
}

// Types para estruturas compostas, uniões e aliases
type Logs = {
    fiscalizacaoLog: LogFiscalizacao | null;
    trabalhoLog: LogTrabalho | null;
    decLog: LogDec | null;
}

type Trabalhos = {
    trabalho: Trabalho;
    detalhes: DetalhesTrabalho;
    logs: Logs;
}

type Zonas = {
    zona: Zona;
    trabalhos: Trabalhos[];
}

type SeccoesZonnas = {
    seccao: Seccao;
    zonas: Zonas[];
}

type EmpresasSeccoes = {
    empresa: Empresa;
    seccoes: SeccoesZonnas[];
}

type AnoProjetos = {
    ano: string;
    projetos: Projeto[];
}

type SeccaoZonaData = {
    seccaoZona: SeccaoZona;
    seccao: Seccao;
    zona: Zona;
}

type ZonaTrabalhoData = {
    zonaTrabalho: ZonaTrabalho;
    zona: Zona;
    trabalho: Trabalho;
}

// Types para responses e containers
type UsersByEmpresa = {
    users: UserApp[];
}

type User = {
    user: UserApp;
}

type Empresas = {
    empresas: Empresa[];
}

type NomeByEmail = {
    nome: string;
}

type ProjetosPerAnoByTipoProjetoAndInsignia = AnoProjetos[];

type ProjetosSeccaoZonaTrabalho = {
    empresas: EmpresasSeccoes[];
}

type Insignias = {
    insignias: Insignia[];
}

type LojasByInsignia = {
    lojas: Loja[];
}

type Seccoes = {
    seccoes: Seccao[];
}

type SeccoesZonasBySeccao = {
    data: SeccaoZonaData[];
}

type ZonasTrabalhosByZona = {
    data: ZonaTrabalhoData[];
}

type TiposProjeto = TipoProjeto[];

type RespostaProjeto = {
    responsaveisProjeto: ResponsavelProjeto[];
}

type RespostaEmpresasProjeto = {
    empresasProjeto: EmpresaProjeto[];
}

type UsersFiscais = {
    users: UserApp[];
}

type Log = {
    codigoTrabalhoLogs?: number;
    codigoFiscalizacaoLogs?: number;
    codigoDecLogs?: number;
    codigoProjetoSeccoesZonaTrabalho: number;
    nUtilizador: number;
    status?: string;
    comentario: string;
    createdAt: string;
    updatedAt: string;
    acesso: {
        nUtilizador: number;
        nome: string;
        email: string;
        telemovel: string;
        foto: string | null;
        role: string;
    };
    type: "trabalho" | "fiscalizacao" | "dec";
}

type LogsResponse = {
    message: string;
    logs: Log[];
}

// Tipo para Imagens Agrupadas por Role
type GroupedImages = {
    Fornecedor: DocumentoImagem[];
    Fiscal: DocumentoImagem[];
    Dec: DocumentoImagem[];
}

// Resposta completa do JSON fornecido
type GroupedImagesResponse = {
    message: string;
    groupedImages: GroupedImages;
}

// Resposta completa do JSON fornecido
type DocumentsResponse = {
    message: string; // Mensagem da resposta
    docs: Documento[]; // Lista de documentos
}