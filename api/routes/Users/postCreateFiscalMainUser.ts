import api from '../../api';

type InputProps = {
    codigoEmpresa: number;
    password: string;
    nome: string;
    email: string;
    telemovel: string;
    nif: string;
};

export default async function postCreateFiscalMainUser (body: InputProps) {
    try {
        const res = await api.post('/users/createFiscalMainUser ', body);
        return res.data;
    } catch (err: any) {
        throw new Error(err);
    }
}
