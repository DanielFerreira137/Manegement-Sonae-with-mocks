import api from '../../api';

type InputProps = {
    password: string;
    nome: string;
    email: string;
    telemovel: string;
    nif: string;
};

export default async function postCreateFornecedorUser  (body: InputProps) {
    try {
        const res = await api.post('/users/createFornecedorUser ', body);
        return res.data;
    } catch (err: any) {
        throw new Error(err);
    }
}
