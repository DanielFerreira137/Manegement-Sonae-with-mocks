import api from '../../api';

type InputProps = {
    codigoProjeto : number;
};

export default async function putUpdateProjetoSendEmail(body: InputProps) {
    try {
        const res = await api.put('/projetos/updateProjetoSendEmail', body);
        return res.data;
    } catch (err: any) {
        throw new Error(err);
    }
}