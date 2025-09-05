import api from '../../api';

type InputProps = {
    codigoZona: number;
    nome: string;
};

export default async function PutUpdateZona(body: InputProps) {
	try {
		const res = await api.put('/variaveis/updateZona', body);
		return res.data;
	} catch (err: any) {
		throw new Error(err);
	}
}
