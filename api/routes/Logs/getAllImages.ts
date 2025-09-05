import api from '../../api';
import { setCookie } from 'nookies';

export default async function getAllImages(codigoProjeto: number) {
	try {
		const res = await api.get(`/logs/getAllImages/${codigoProjeto}`);
		// Type GroupedImagesResponse	
        console.log(res.data.groupedImages);
		return res.data.groupedImages;
	} catch (err: any) {
		throw new Error(err);
	}
}
