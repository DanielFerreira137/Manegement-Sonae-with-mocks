import api from '../../api';

type InputProps = {
    nome: string;
	codigoSeccao: number;
};

export default async function PostCreateZona(body: InputProps) {
	try {
		const res = await api.post('/variaveis/createZona', body);
		return res.data;
	} catch (err: any) {
		throw new Error(err);
	}
}
