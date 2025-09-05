import api from '../../api';
import { setCookie } from 'nookies';

export default async function getAllDocs(codigoProjeto: number) {
	try {
		const res = await api.get(`/logs/getAllDocs/${codigoProjeto}`);
		// Type DocumentsResponse	
        console.log(res.data);
		return res.data;
	} catch (err: any) {
		throw new Error(err);
	}
}
