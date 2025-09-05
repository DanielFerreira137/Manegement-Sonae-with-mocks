import api from "../../api";
import { setCookie } from 'nookies';

export default async function getTipoDeProjeto() {
    try {
        const res = await api.get('/projetos/getTiposProjeto');
        return res.data; // Type TiposProjeto
    } catch (err: any) {
        if (err.response) {
            // Erros de resposta do backend (como 404 ou 500)
            const statusCode = err.response.status;
            const message = err.response.data?.error || 'Erro desconhecido no servidor.';
            throw new Error(`Erro ${statusCode}: ${message}`);
        } else if (err.request) {
            // Erros relacionados à falta de resposta do servidor
            throw new Error('Erro na conexão com o servidor.');
        } else {
            // Outros erros (por exemplo, erro na configuração da requisição)
            throw new Error('Erro desconhecido ao processar a requisição.');
        }
    }
}

