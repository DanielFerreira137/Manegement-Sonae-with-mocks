import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import CompanyForm from './ColaboratorForm';
import useDarkMode from '../../hooks/useDarkMode';
import useTourStep from '../../hooks/useTourStep';
import {
	getUserInfo,
	getUsersByEmpresa,
} from '../../api/routes';
import { demoPagesMenu } from '../../menu';

import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import SubHeader, { SubHeaderLeft } from '../../layout/SubHeader/SubHeader';
import Page from '../../layout/Page/Page';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
	CardFooter,
} from '../../components/bootstrap/Card';
import Badge from '../../components/bootstrap/Badge';
import Button from '../../components/bootstrap/Button';

const ITEMS_PER_PAGE = 10;

const Index: NextPage = () => {
	useTourStep(12);
	const { darkModeStatus } = useDarkMode();

	const [funcionario, setFuncionario] = useState<UserApp>();
	const [funcionarios, setFuncionarios] = useState<UserApp[]>([]);
	const [refresh, setRefresh] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);

	// Cálculos para paginação
	const totalPages = Math.ceil((funcionarios?.length || 0) / ITEMS_PER_PAGE);
	const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
	const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
	const currentFuncionarios = funcionarios?.slice(indexOfFirstItem, indexOfLastItem) || [];

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	// Efeito para refresh
	console.log(refresh, funcionario?.empresa?.codigoEmpresa);
	if(refresh && funcionario?.empresa?.codigoEmpresa !== undefined) {
		getUsersByEmpresa(funcionario.empresa.codigoEmpresa)
			.then((res) => {
				setFuncionarios(res);
			})
			.catch((err) => {
				console.error(err);
				setError('Erro ao carregar funcionários');
			})
			.finally(() => {
				setRefresh(false);
			});
	}

	// Carregar informações do usuário
	useEffect(() => {
		getUserInfo()
			.then((res) => {
				setFuncionario(res);
			})
			.catch((err) => {
				console.error(err);
				setError('Erro ao carregar informações do usuário');
			});
	}, []);

	// Carregar funcionários quando tiver informação da empresa
	useEffect(() => {
		if (funcionario?.empresa?.codigoEmpresa) {
			setIsLoading(true);
			getUsersByEmpresa(funcionario.empresa.codigoEmpresa)
				.then((res) => {
					setFuncionarios(res);
				})
				.catch((err) => {
					console.error(err);
					setError('Erro ao carregar funcionários');
				})
				.finally(() => {
					setIsLoading(false);
				});
		}
	}, [funcionario]);

	if (funcionario?.role === 'Dec') {
		return null;
	}

	const PaginationControls = () => (
		<div className="d-flex justify-content-between align-items-center mt-3">
			<div>
				<span className="me-2">
					Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, funcionarios?.length || 0)} de {funcionarios?.length || 0}
				</span>
			</div>
			<div className="d-flex gap-2">
				<Button
					color="info"
					isLight
					onClick={() => handlePageChange(currentPage - 1)}
					isDisable={currentPage === 1}
				>
					Anterior
				</Button>
				{[...Array(totalPages)].map((_, index) => (
					<Button
						key={index + 1}
						color={currentPage === index + 1 ? "info" : "light"}
						onClick={() => handlePageChange(index + 1)}
					>
						{index + 1}
					</Button>
				))}
				<Button
					color="info"
					isLight
					onClick={() => handlePageChange(currentPage + 1)}
					isDisable={currentPage === totalPages}
				>
					Próximo
				</Button>
			</div>
		</div>
	);

	return (
		<PageWrapper>
			<Head>
				<title>{demoPagesMenu.projectManagement.subMenu.list.text}</title>
			</Head>

			<SubHeader>
				<SubHeaderLeft>
					<strong className='fs-5'>Olá, {funcionario?.nome}</strong>
				</SubHeaderLeft>
			</SubHeader>

			<Page>
				<div className="row">
					<div className='col-lg-8'>
						<Card>
							<CardHeader>
								<CardLabel icon='Task' iconColor='danger'>
									<CardTitle>
										<div className='d-flex align-items-center justify-content-between'>
											<CardLabel>Colaboradores</CardLabel>
										</div>
									</CardTitle>
								</CardLabel>
							</CardHeader>

							<CardBody>
								{error && (
									<div className="alert alert-danger" role="alert">
										{error}
									</div>
								)}

								{isLoading ? (
									<div className="text-center p-4">
										<div className="spinner-border text-primary" role="status">
											<span className="visually-hidden">Carregando...</span>
										</div>
									</div>
								) : (
									<div className='table-responsive'>
										<table className='table table-modern mb-0'>
											<thead>
												<tr>
													<th>Nome</th>
													<th>Email</th>
													<th>Telemovel</th>
													<th>Nif</th>
													<th>Status</th>
												</tr>
											</thead>
											<tbody>
												{currentFuncionarios.length === 0 ? (
													<tr>
														<td colSpan={5} className="text-center">
															Nenhum funcionário encontrado
														</td>
													</tr>
												) : (
													currentFuncionarios.map((funcionario) => (
														<tr key={funcionario.nUtilizador}>
															<td>{funcionario.nome}</td>
															<td>{funcionario.email}</td>
															<td>{funcionario.telemovel}</td>
															<td>{funcionario.nif}</td>
															<td>
																<Badge color='success'>Ativo</Badge>
															</td>
														</tr>
													))
												)}
											</tbody>
										</table>
									</div>
								)}
							</CardBody>
							<CardFooter>
								<PaginationControls />
							</CardFooter>
						</Card>
					</div>
					<CompanyForm setRefresh={setRefresh} role={funcionario?.role}/>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default Index;