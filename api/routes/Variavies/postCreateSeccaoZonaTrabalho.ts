import api from '../../api';

type InputProps = {
    nomeSeccao: string;
    nomeZona: string;
    nomeTrabalho: string;
};

export default async function PostCreateSeccaoZonaTrabalho(body: InputProps) {
	try {
		const res = await api.post('/variaveis/createSeccaoZonaTrabalho', [body]);
		return res.data;
	}  catch (error: any) {
        if (error.response) {
            // Erro com resposta da API
            console.error("Erro na resposta da API:", error.response.data);
            throw new Error(error.response.data.message || 'Erro ao criar seção.');
        } else if (error.request) {
            // Erro sem resposta da API
            console.error("Nenhuma resposta da API recebida:", error.request);
            throw new Error('Nenhuma resposta recebida do servidor.');
        } else {
            // Outro erro
            console.error("Erro ao fazer o request:", error.message);
            throw new Error(error.message || 'Erro desconhecido.');
        }
    }
}