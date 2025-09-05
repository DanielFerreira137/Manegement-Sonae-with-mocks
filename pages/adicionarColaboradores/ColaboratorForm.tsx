import React, { useState } from 'react';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../components/bootstrap/Card';
import Button from '../../components/bootstrap/Button';
import { postCreateFornecedorUser, postCreateFiscalUser } from '../../api/routes';

interface CompanyFormProps {
	setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
	role?: string;
}

const CompanyForm: React.FC<CompanyFormProps> = ({ setRefresh, role }) => {
	const [formData, setFormData] = useState({
		nome: '',
		nif: '',
		email: '',
		telemovel: '',
	});

	const handleChange = (e: { target: { name: any; value: any } }) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = (e: { preventDefault: () => void }) => {
		e.preventDefault();
		// Here you would add your API call to save the company
		console.log('Form submitted:', formData);
		const generatePassword = () => {
			return Math.random()
				.toString(36)
				.replace(/[^a-zA-Z0-9]+/g, '')
				.slice(-20);
		};

		const data = {
			nome: formData.nome,
			email: formData.email,
			telemovel: formData.telemovel,
			nif: formData.nif,
			password: generatePassword(),
		};
		if (role === 'Fornecedor') {
			postCreateFornecedorUser(data)
				.then((res) => {
					console.log('User created:', res);
				})
				.catch((err) => {
					console.error(err);
				});
				setFormData({
					nome : '',
					nif : '',
					email : '',
					telemovel : '',
				});
        setRefresh(true);
		}
		if (role === 'Fiscal') {
			postCreateFiscalUser(data)
				.then((res) => {
					console.log('User created:', res);
				})
				.catch((err) => {
					console.error(err);
				});
				setFormData({
					nome : '',
					nif : '',
					email : '',
					telemovel : '',
				});
        setRefresh(true);
		}
		
	};
	return (
		<div className='col-lg-4'>
			<Card>
				<CardHeader>
					<CardLabel icon='Business' iconColor='success'>
						<CardTitle>
							<div className='d-flex align-items-center'>
								<CardLabel>Adicionar Colaborador</CardLabel>
							</div>
						</CardTitle>
					</CardLabel>
				</CardHeader>
				<CardBody>
					<form onSubmit={handleSubmit}>
						<div className='mb-3'>
							<label className='form-label'>Nome</label>
							<input
								type='text'
								className='form-control'
								name='nome'
								value={formData.nome}
								onChange={handleChange}
								required
							/>
						</div>
						<div className='mb-3'>
							<label className='form-label'>NIF</label>
							<input
								type='text'
								className='form-control'
								name='nif'
								value={formData.nif}
								onChange={handleChange}
								required
							/>
						</div>

						<div className='mb-3'>
							<label className='form-label'>Email</label>
							<input
								type='email'
								className='form-control'
								name='email'
								value={formData.email}
								onChange={handleChange}
								required
							/>
						</div>
						<div className='mb-3'>
							<label className='form-label'>Telemóvel</label>
							<input
								type='tel'
								className='form-control'
								name='telemovel'
								value={formData.telemovel}
								onChange={handleChange}
								required
							/>
						</div>

						<Button color='success' type='submit' className='w-100'>
							Adicionar Colaborador
						</Button>
					</form>
				</CardBody>
			</Card>
		</div>
	);
};

export default CompanyForm;
