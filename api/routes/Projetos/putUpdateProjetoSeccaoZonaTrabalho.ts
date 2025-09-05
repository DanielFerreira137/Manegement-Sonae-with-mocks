import api from '../../api';

type InputProps = {
    codigoProjetoSeccoesZonaTrabalho: number;
    dataIntervencao: string;
    dataPrevista: string;
    status: string;
};

export default async function putUpdateProjetoSeccaoZonaTrabalho(body: any) {
    try {
        
        const res = await api.put('/projetos/updateProjetoSeccaoZonaTrabalho', body.data);
        return res.data;
    } catch (err: any) {
        throw new Error(err);
    }
}