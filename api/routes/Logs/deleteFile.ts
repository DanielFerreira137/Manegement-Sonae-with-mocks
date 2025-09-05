import api from '../../api';


export default async function deleteFile(codigoDocumentoImagem: number) {
    try {
        const res = await api.delete(`/logs/deleteFile/${codigoDocumentoImagem}`);
        return res.data;
    } catch (err: any) {
        throw new Error(err);
    }
}
