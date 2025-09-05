import api from '../../api';

type InputProps = {
    codigoProjeto : number;
    nomeProjeto : string;
    codigoLoja : number;
};

export default async function putUpdateProjeto(body: InputProps) {
    try {
        const res = await api.put('/projetos/updateProjeto', body);
        return res.data;
    } catch (err: any) {
        throw new Error(err);
    }
}