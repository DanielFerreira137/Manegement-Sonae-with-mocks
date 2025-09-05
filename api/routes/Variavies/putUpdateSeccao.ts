import api from '../../api';

type InputProps = {
    codigoSeccao: number;
    nome: string;
};

export default async function PutUpdateSeccao(body: InputProps) {
	try {
		const res = await api.put('/variaveis/updateSeccao', body);
		return res.data;
	} catch (err: any) {
		throw new Error(err);
	}
}
