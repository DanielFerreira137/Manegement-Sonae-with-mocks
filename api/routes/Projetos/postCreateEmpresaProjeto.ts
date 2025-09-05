import api from '../../api';

type InputProps = {
	codigoProjeto: number;
    codigoEmpresa: number;
};

export default async function PostCreateEmpresaProjeto(body: InputProps) {
	try {
		const res = await api.post('/projetos/createEmpresaProjeto', body);
		return res.data;
	} catch (err: any) {
		throw new Error(err);
	}
}
