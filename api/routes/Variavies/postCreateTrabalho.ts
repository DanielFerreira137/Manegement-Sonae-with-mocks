import api from '../../api';

type InputProps = {
    nome: string;
	codigoZona: number;
};

export default async function PostCreateTrabalho(body: InputProps) {
	try {
		const res = await api.post('/variaveis/createTrabalho', body);
		console.log(res.data);
		return res.data;
	} catch (err: any) {
		throw new Error(err);
	}
}
