import api from '../../api';
import { setCookie } from 'nookies';

export default async function getEmpresas() {
	try {
		const res = await api.get(`/empresas/getEmpresasFornecedor`);
		// Type Empresas
		console.log(res.data.empresas);
		return res.data.empresas;
	} catch (err: any) {
		throw new Error(err);
	}
}
