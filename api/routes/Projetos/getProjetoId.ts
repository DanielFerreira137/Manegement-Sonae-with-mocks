import api from '../../api';
import { setCookie } from 'nookies';

export default async function  getProjeto(codigoProjeto: number) {
    try {
        const res = await api.get(`/projetos/getProjeto/` + codigoProjeto);
        // Type 
        console.log(res.data);
        return res.data;
    } catch (err: any) {
        throw new Error(err);
    }
}