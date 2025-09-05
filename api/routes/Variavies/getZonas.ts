import api from '../../api';
import { setCookie } from 'nookies';

export default async function getZonas() {
	try {
		const res = await api.get('/variaveis/getZonas');
		// Type ZonasList
        console.log(res.data.zonas);
		return res.data.zonas;
	} catch (err: any) {
		throw new Error(err);
	}
}
