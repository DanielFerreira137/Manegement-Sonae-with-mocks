import api from '../../api';

type InputProps = {
    password: string | null;
    nome: string | null;
    email: string | null;
    telemovel: string | null;
    nif: string | null;
    foto: string | null;
};

export default async function putUpdateUser(body: InputProps) {
    try {
        const res = await api.put('/users/updateUser', body);
        return res.data;
    } catch (err: any) {
        throw new Error(err);
    }
}