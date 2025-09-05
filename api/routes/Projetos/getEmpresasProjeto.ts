import api from '../../api';
import { setCookie } from 'nookies';

export default async function  getEmpresasProjeto(codigoProjeto: number) {
	try {
		const res = await api.get(`/projetos/getEmpresasProjeto/` + codigoProjeto);
		// Type RespostaEmpresasProjeto
		console.log(res.data);
		return res.data;
	} catch (err: any) {
		throw new Error(err);
	}
}
