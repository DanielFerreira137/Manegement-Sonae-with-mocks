import api from '../../api';
import { setCookie } from 'nookies';

export default async function getTrabalhos() {
	try {
		const res = await api.get('/variaveis/getTrabalhos');
		// Type TrabalhosList
        console.log(res.data);
		return res.data.seccoes;
	} catch (err: any) {
		throw new Error(err);
	}
}
