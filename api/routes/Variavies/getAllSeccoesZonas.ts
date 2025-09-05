import api from "../../api";
import { setCookie } from 'nookies';

export default async function getAllSeccoesZonas() {
    try {
        const res = await api.get('/variaveis/getSeccoesZonasTrabalhos');
        console.log(res.data);
        return res.data.data;
    } catch (err: any) {
        throw new Error(err);
    }
}