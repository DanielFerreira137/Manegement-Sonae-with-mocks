import api from '../../api';


export default async function deleteResponsavelProjeto(codigoProjeto: number, nUtilizador: number) {
	try {
		const res = await api.delete(`/projetos/deleteResponsavelProjeto/${codigoProjeto}/${nUtilizador}`);
		return res.data;
	} catch (err: any) {
		throw new Error(err);
	}
}
