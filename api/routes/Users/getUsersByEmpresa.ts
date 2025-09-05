import api from "../../api";
import { setCookie } from 'nookies';

export default async function getUsersByEmpresa(codigoEmpresa: number) {
    try {
        const res = await api.get('/users/getUsersbyEmpresa/' + codigoEmpresa);
        // Type UsersByEmpresa
        console.log(res.data.users);
        return res.data.users;

    } catch (err: any) {
        throw new Error(err);
    }
}