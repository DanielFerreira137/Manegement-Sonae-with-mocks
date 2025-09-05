import api from '../../api';

type InputProps = {
	codigoProjeto: number;
    codigoSeccao: number;
    codigoZona: number;
	codigoTrabalho: number;
    codigoEmpresa: number;
    dataIntervencao: string;
};

export default async function PostCreateProjetoSeccaoZonaTrabalho(body: InputProps) {
	try {
		const res = await api.post('/projetos/createProjetoSeccaoZonaTrabalho', body);
		return res.data;
	} catch (err: any) {
		throw new Error(err);
	}
}
