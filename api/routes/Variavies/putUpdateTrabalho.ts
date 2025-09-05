import api from '../../api';

type InputProps = {
    codigoTrabalho: number;
    nome: string;
};

export default async function PutUpdateTrabalho(body: InputProps) {
	try {
		const res = await api.put('/variaveis/updateTrabalho', body);
		return res.data;
	} catch (err: any) {
		throw new Error(err);
	}
}
