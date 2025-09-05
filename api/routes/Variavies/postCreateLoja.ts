import api from '../../api';

type InputProps = {
	codigoInsignia: number;
    nome: string;
    morada: string;
};

export default async function PostCreateLoja(body: InputProps) {
	try {
		const res = await api.post('/variaveis/createLoja', body);
		return res.data;
	} catch (err: any) {
		throw new Error(err);
	}
}
