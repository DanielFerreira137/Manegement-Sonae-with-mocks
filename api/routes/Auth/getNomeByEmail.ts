import api from "../../api";
import { setCookie } from 'nookies';

export default async function getNomeByEmail(email: string) {
    try {
        const res = await api.get('/auth/getNomeByEmail/' + email);
        // Type NomeByEmail
        console.log(res.data);
        return res.data;

    } catch (err: any) {
        throw new Error(err);
    }
}