import api from '../../api';
import { setCookie } from 'nookies';

export default async function getAllLogsByData(codigoProjetoSeccoesZonaTrabalho: number) {
	try {
		const res = await api.get(`/logs/getAllLogsOrderByData/${codigoProjetoSeccoesZonaTrabalho}`);
		// Type
        console.log(res.data);
		return res.data.logs;
	} catch (err: any) {
		throw new Error(err);
	}
}
