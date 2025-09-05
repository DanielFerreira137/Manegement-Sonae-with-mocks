import api from '../../api';

type InputProps = {
	codigoProjeto: number;
    nUtilizador: number;
};

export default async function PostCreateResponsavelProjeto(body: InputProps) {
	try {
		const res = await api.post('/projetos/createResponsavelProjeto', body);
		return res.data;
	} catch (err: any) {
		throw new Error(err);
	}
}
