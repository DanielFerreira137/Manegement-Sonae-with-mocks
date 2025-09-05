import api from '../../api';
import { setCookie } from 'nookies';

export default async function getLojas(id: number) {
	try {
		const res = await api.get('/variaveis/getLojasByInsignia/' + id);
		// Type LojasByInsignia
        console.log(res.data);
		return res.data.lojas;
	} catch (err: any) {
		throw new Error(err);
	}
}
