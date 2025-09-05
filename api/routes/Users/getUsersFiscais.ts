import api from "../../api";
import { setCookie } from 'nookies';

export default async function getUsersFiscais() {
    try {
        const res = await api.get('/users/getUsersFiscais');
        // Type UsersFiscais
        console.log(res.data.users);
        return res.data.users;

    } catch (err: any) {
        throw new Error(err);
    }
}