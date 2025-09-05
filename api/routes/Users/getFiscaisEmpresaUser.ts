import api from "../../api";
import { setCookie } from 'nookies';

export default async function getFiscaisEmpresaUser() {
    try {
        const res = await api.get('/users/getFiscaisEmpresaUser');
        // Type UsersByEmpresa
        console.log(res.data.user);
        return res.data.user;

    } catch (err: any) {
        throw new Error(err);
    }
}