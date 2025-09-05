import api from '../../api';

type InputProps = {
	codigoProjetoSeccoesZonaTrabalho: number;
	status: string;
    comentario: string;
};

export default async function PostCreateTrabalhoLog(body: InputProps) {
	try {
		const res = await api.post('/logs/createTrabalhoLog', body);
		return res.data;
	} catch (err: any) {
		throw new Error(err);
	}
}
