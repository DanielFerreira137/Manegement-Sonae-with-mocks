import React, { use, useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import dayjs from 'dayjs';
import classNames from 'classnames';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import useTourStep from '../../../hooks/useTourStep';
import useDarkMode from '../../../hooks/useDarkMode';
import { getUserInfo } from '../../../api/routes';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Button from '../../../components/bootstrap/Button';
import OffCanvas, {
	OffCanvasBody,
	OffCanvasHeader,
	OffCanvasTitle,
} from '../../../components/bootstrap/OffCanvas';
import Badge from '../../../components/bootstrap/Badge';
import Avatar from '../../../components/Avatar';
import Icon from '../../../components/icon/Icon';
import { func } from 'prop-types';
import ProfileEditForm from './ProfileEditForm';
const EmployeePage: NextPage = () => {
	useTourStep(19);
	const { darkModeStatus } = useDarkMode();

	const [funcionario, setFuncionario] = useState<UserApp>();
	const [open, setOpen] = useState(false);

	// Estado para os dados do formulário
	const [formData, setFormData] = useState({
		nome: '',
		email: '',
		telemovel: '',
		password: '',
		confirmPassword: '',
	});

	useEffect(() => {
		getUserInfo().then((res) => {
			setFuncionario(res);
		});
	}, []);

	// Manipulação de dados do formulário
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	// Função de envio para adicionar colaborador
	const handleAddCollaborator = () => {
		if (formData.password !== formData.confirmPassword) {
			console.error('As senhas não coincidem.');
			return;
		}
		console.log('Novo colaborador adicionado:', formData);
		// Aqui você pode enviar os dados para a API, se necessário.
		setOpen(false); // Fecha o OffCanvas
		setFormData({
			nome: '',
			email: '',
			telemovel: '',
			password: '',
			confirmPassword: '',
		});
	};

	return (
		<PageWrapper>
			<Head>
				<title>Gestão de Colaboradores</title>
			</Head>

			<Page>
				<div className="pt-3 pb-5 d-flex align-items-center">
					<span className="display-4 fw-bold me-3">{funcionario?.nome}</span>
					<span className="border border-success border-2 text-success fw-bold px-3 py-2 rounded">
						{funcionario?.role}
					</span>
				</div>
				<div className="row">
					<div className="col-lg-4">
						<Card className="shadow-3d-info">
							<CardBody>
								<div className="row g-5">
									<div className="col-12 d-flex justify-content-center">
										<Avatar
											src={
												funcionario?.foto ||
												`https://ui-avatars.com/api/?name=${funcionario?.nome || 'User'}&background=random&color=fff`
											}
										/>
									</div>
									<div className="col-12">
										<div className="row g-2">
											<div className="col-12">
												<div className="d-flex align-items-center">
													<div className="flex-shrink-0">
														<Icon icon="Mail" size="3x" color="info" />
													</div>
													<div className="flex-grow-1 ms-3">
														<div className="fw-bold fs-5 mb-0">
															{funcionario?.email}
														</div>
														<div className="text-muted">Email</div>
													</div>
												</div>
											</div>
											<div className="col-12">
												<div className="d-flex align-items-center">
													<div className="flex-shrink-0">
														<Icon icon="Phone" size="3x" color="info" />
													</div>
													<div className="flex-grow-1 ms-3">
														<div className="fw-bold fs-5 mb-0">
															{funcionario?.telemovel}
														</div>
														<div className="text-muted">Telefone</div>
													</div>
												</div>
											</div>
											<div className="col-12">
												<div className="d-flex align-items-center">
													<div className="flex-shrink-0">
														<Icon icon="ConfirmationNumber" size="3x" color="info" />
													</div>
													<div className="flex-grow-1 ms-3">
														<div className="fw-bold fs-5 mb-0">
															{funcionario?.nif}
														</div>
														<div className="text-muted">NIF</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</CardBody>
						</Card>
					</div>
					{funcionario && <ProfileEditForm funcionario={funcionario} />}
					
				</div>
			</Page>
			
		</PageWrapper>
	);
};


// Função para obter as traduções de servidor para cliente
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
	props: {
		// @ts-ignore
		...(await serverSideTranslations(locale, ['common', 'menu'])),
	},
});

export default EmployeePage;
function getUserDataFromCookie(id: string | string[] | undefined): [any] {
	throw new Error('Function not implemented.');
}
