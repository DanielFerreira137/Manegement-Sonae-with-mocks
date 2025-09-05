import api from '../../api';
import { setCookie } from 'nookies';

export default async function  getResponsaveisProjetobyProjeto(codigoProjeto: number) {
	try {
		const res = await api.get(`/projetos/getResponsaveisProjetobyProjeto/` + codigoProjeto);
		// Type RespostaProjeto
		console.log(res.data);
		return res.data;
	} catch (err: any) {
		throw new Error(err);
	}
}
