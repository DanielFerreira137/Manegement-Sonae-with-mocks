import api from "../../api";

export default async function getSeccoesZonasBySeccao(codigoSeccao: number) {
    try {
        const res = await api.get(`/variaveis/getSeccoesZonasBySeccao/${codigoSeccao}`);
        return res.data.data; // Retorna os dados se a requisição for bem-sucedida
    } catch (err: any) {
        // Verifica se o erro é 404 e retorna um array vazio
        if (err.response && err.response.status === 404) {
            console.warn(`Nenhuma zona encontrada para o código da seção ${codigoSeccao}. Retornando um array vazio.`);
            return [];
        }
        // Lança outros erros
        console.error("Erro ao buscar zonas por seção:", err);
        throw new Error(err);
    }
}
