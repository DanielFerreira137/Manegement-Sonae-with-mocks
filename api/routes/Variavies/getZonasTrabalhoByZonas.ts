import api from "../../api";
import { setCookie } from 'nookies';

export default async function getZonasTrabalhosByZona(codigoZona: number) {
    try {
        const res = await api.get('/variaveis/getZonasTrabalhosByZona/' + codigoZona);
        // Type ZonasTrabalhosByZona
        console.log(res.data);
        return res.data.data;
    } catch (err: any) {
        throw new Error(err);
    }
}
