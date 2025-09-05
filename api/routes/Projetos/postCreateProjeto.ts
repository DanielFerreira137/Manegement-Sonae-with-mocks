import api from '../../api';

type InputProps = {
	codigoTipoProjeto: number;
	codigoLoja: number;
    nomeProjeto: string;
    ano: number;
};

export default async function PostCreateProjeto(body: InputProps) {
	try {
		const res = await api.post('/projetos/createProjeto', body);
		return res.data;
	} catch (err: any) {
		throw new Error(err);
	}
}
