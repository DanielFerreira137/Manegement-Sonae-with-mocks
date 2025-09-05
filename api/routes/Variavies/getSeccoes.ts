import api from '../../api';
import { setCookie } from 'nookies';

export default async function getSeccoes() {
    try {
        const res = await api.get('/variaveis/getSeccoes');
        console.log(res.data);
        return res.data.seccoes;
    } catch (err: any) {
        // Check if the error is a 404
        if (err.response && err.response.status === 404) {
            return [];
        }
        // For any other error, throw it
        throw new Error(err.message || 'An error occurred while fetching sections');
    }
}