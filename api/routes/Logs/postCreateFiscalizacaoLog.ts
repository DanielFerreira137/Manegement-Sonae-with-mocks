import api from '../../api';

type InputProps = {
	codigoProjetoSeccoesZonaTrabalho: number;
    comentario: string;
};

export default async function PostCreateFiscalizacaoLog(body: InputProps) {
	try {
		const res = await api.post('/logs/createFiscalizacaoLog', body);
		return res.data;
	} catch (err: any) {
		throw new Error(err);
	}
}
