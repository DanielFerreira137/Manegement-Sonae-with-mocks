import api from '../../api';
import { setCookie } from 'nookies';

export default async function  getProjetosSeccaoZonaTrabalho(codigoProjeto: number) {
	try {
		const res = await api.get(`/projetos/getProjetoSeccaoZonaTrabalho/` + codigoProjeto);
		// Type ProjetosSeccaoZonaTrabalho
		console.log(res.data);
		return res.data;
	} catch (err: any) {
		throw new Error(err);
	}
}
