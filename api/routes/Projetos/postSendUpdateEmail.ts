import api from '../../api';

type InputProps = {
    codigoProjetoSeccoesZonaTrabalho: number;
    codigoProjeto: number;
    bodyEmail: string;
};

export default async function postSendUpdateEmail(body: InputProps) {
    try {
        const res = await api.post('/projetos/sendUpdateEmail', body);
        return res.data;
    } catch (err: any) {
        throw new Error(err);
    }
}
