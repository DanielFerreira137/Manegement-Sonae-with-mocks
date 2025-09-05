import api from '../../api';
import { setCookie } from 'nookies';

export default async function getEmpresasFiscalizacao() {
    try {
        const res = await api.get(`/empresas/getEmpresasFiscalizacao`);
        // Type Empresas
        console.log(res.data.empresas);
        return res.data.empresas;
    } catch (err: any) {
        throw new Error(err);
    }
}
