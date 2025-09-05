import api from '../../api';

type InputProps = {
	nome: string;
    nif: string;
    tipo: string;
    email: string;
    telemovel: string;
    morada: string;
};

export default async function PostCreateEmpresa(body: InputProps) {
	try {
		const res = await api.post('/empresas/createEmpresa', body);
		return res.data;
	} catch (err: any) {
		throw new Error(err);
	}
}
