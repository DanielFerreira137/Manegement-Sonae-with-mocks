import api from '../../api';


export default async function deleteEmpresaProjeto(codigoProjeto: number, codigoEmpresa: number) {
	try {
		const res = await api.delete(`/projetos/deleteEmpresaProjeto/${codigoProjeto}/${codigoEmpresa}`);
		return res.data;
	} catch (err: any) {
		throw new Error(err);
	}
}
