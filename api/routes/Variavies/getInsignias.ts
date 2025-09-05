import api from "../../api";
import { setCookie } from 'nookies';

export default async function getInsignias() {
    try {
        const res = await api.get('/variaveis/getInsignias');
        // Type Insignias
        console.log(res.data);
        return res.data.insignias;
    } catch (err: any) {
        throw new Error(err);
    }
}