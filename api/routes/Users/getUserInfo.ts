import api from "../../api";
import { setCookie } from 'nookies';

export default async function getUserInfo() {
    try {
        const res = await api.get('/users/getUser');
        // Type User
        console.log(res.data.user);
        return res.data.user;

    } catch (err: any) {
        throw new Error(err);
    }
}