import api from "../../api";
import { setCookie } from 'nookies';

export default async function LoginUser(data : { usr: string, pw: string}): Promise<Boolean> {
    try {
        const res = await api.post('/auth/login', {
            email: data.usr,
            password: data.pw
        });
        console.log("res", res);
        
        if (res.data.token) {
            setCookie(null, 'token', res.data.token, {
                maxAge: 30 * 24 * 60 * 60,
                path: '/',
            });
        } else {
            throw new Error("Error setting session");
        }   
    
        return await Promise.resolve(true);
    } catch (err: any) {
        console.error("Login failed:", err.response?.data || err.message);
        throw new Error(err.response?.data?.message || "An error occurred during login");
    }
    
}