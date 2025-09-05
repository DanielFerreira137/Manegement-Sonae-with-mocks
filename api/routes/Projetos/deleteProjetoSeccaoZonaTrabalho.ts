import api from '../../api';


export default async function deleteProjetoSeccaoZonaTrabalho(codigoProjetoSeccoesZonaTrabalho: number) {
	try {
		const res = await api.delete(`/projetos/deleteProjetoSeccaoZonaTrabalho/${codigoProjetoSeccoesZonaTrabalho}`);
		return res.data;
	} catch (err: any) {
		throw new Error(err);
	}
}
