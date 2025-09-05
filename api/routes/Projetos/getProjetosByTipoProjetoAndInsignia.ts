import api from '../../api';
import { setCookie } from 'nookies';

export default async function getProjetosByTipoProjetoAndInsignia(codigoTipoProjeto: number, codigoInsignia: number) {
	try {
		const res = await api.get(`/projetos/getProjetosByTipoProjetoAndInsignia/${codigoTipoProjeto}/${codigoInsignia}`);
		// Type ProjetosPerAnoByTipoProjetoAndInsignia		console.log(res.data);
		return res.data;
	} catch (err: any) {
		throw new Error(err);
	}
}
