import api from '../../api';

type InputProps = {
    nome: string;
};

export default async function PostCreateSeccao(body: InputProps) {
	try {
		const res = await api.post('/variaveis/createSeccao', body);
		return res.data;
	} catch (err: any) {
		throw new Error(err);
	}
}
