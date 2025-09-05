import api from '../../api';

type InputProps = {
    password: string;
    nome: string;
    email: string;
    telemovel: string;
    nif: string;
};

export default async function postCreateFiscalUser (body: InputProps) {
    try {
        const res = await api.post('/users/createFiscalUser ', body);
        return res.data;
    } catch (err: any) {
        throw new Error(err);
    }
}
