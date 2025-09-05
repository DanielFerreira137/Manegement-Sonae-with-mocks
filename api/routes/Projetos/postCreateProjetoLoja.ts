import api from '../../api';

type InputProps = {
	codigoProjeto: number;
    codigoLoja: number;
};

export default async function PostCreateProjetoLoja(body: InputProps) {
	try {
		const res = await api.post('/projetos/createProjetoLoja', body);
		return res.data;
	} catch (err: any) {
		throw new Error(err);
	}
}
