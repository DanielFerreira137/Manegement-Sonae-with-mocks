import api from '../../api';

type InputProps = {
    nUtilizador: number;
};

export default async function putUpdateUserAtivo(body: InputProps) {
    try {
        const res = await api.put('/users/updateUser/ativo', body);
        return res.data;
    } catch (err: any) {
        throw new Error(err);
    }
}