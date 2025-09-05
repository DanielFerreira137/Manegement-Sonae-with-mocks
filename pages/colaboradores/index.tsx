import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import CompanyForm from './companyForm';
import useDarkMode from '../../hooks/useDarkMode';
import useTourStep from '../../hooks/useTourStep';
import {
	getUserInfo,
	getEmpresas,
	getEmpresasFiscalizacao,
} from '../../api/routes';
import { demoPagesMenu } from '../../menu';

// Componentes reutilizáveis
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

interface Empresa {
    codigoEmpresa: number;
    nome: string;
    nif: string;
    tipo: string;
    email: string;
    telemovel: string;
    morada: string;
}

interface UserApp {
    nome: string;
    role: string;
}

const ITEMS_PER_PAGE = 10;

const Index: NextPage = () => {
	useTourStep(12);
	const { darkModeStatus } = useDarkMode();
	
	const [funcionario, setFuncionario] = useState<UserApp | null>(null);
	const [empresas, setEmpresas] = useState<Empresa[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);

	// Cálculos para paginação
	const totalPages = Math.ceil(empresas.length / ITEMS_PER_PAGE);
	const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
	const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
	const currentEmpresas = empresas.slice(indexOfFirstItem, indexOfLastItem);
	const [refresh, setRefresh] = useState(false);
const handlePageChange = (page: number) => {
	setCurrentPage(page);
};

useEffect(() => {
	const refreshData = async () => {
		if (refresh) {
			const [userInfo, empresasNormais, empresasFisc] = await Promise.all([
				getUserInfo(),
				getEmpresas(),
				getEmpresasFiscalizacao()
			]);

			setFuncionario(userInfo);

			const empresasMap = new Map();
			[...empresasNormais, ...empresasFisc].forEach(empresa => {
				empresasMap.set(empresa.codigoEmpresa, empresa);
			});

			setEmpresas(Array.from(empresasMap.values()));
			setRefresh(false);
		}
	};

	refreshData();
}, [refresh]);
	useEffect(() => {
		const loadData = async () => {
			try {
				setIsLoading(true);
				setError(null);

				const [userInfo, empresasNormais, empresasFisc] = await Promise.all([
					getUserInfo(),
					getEmpresas(),
					getEmpresasFiscalizacao()
				]);

				setFuncionario(userInfo);

				const empresasMap = new Map();
				[...empresasNormais, ...empresasFisc].forEach(empresa => {
					empresasMap.set(empresa.codigoEmpresa, empresa);
				});

				setEmpresas(Array.from(empresasMap.values()));
			} catch (err) {
				setError('Erro ao carregar dados. Por favor, tente novamente.');
				console.error('Erro:', err);
			} finally {
				setIsLoading(false);
			}
		};

		loadData();
	}, []);

	if (funcionario && funcionario.role !== 'Dec') {
		return null;
	}

	const PaginationControls = () => (
		<div className="d-flex justify-content-between align-items-center mt-3">
			<div>
				<span className="me-2">
					A Mostrar {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, empresas.length)} de {empresas.length}
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

			

			<Page>
				
				<div className='row'>
					<div className='col-lg-9'>
						<Card>
							<CardHeader>
								<CardLabel icon='Task' iconColor='danger'>
									<CardTitle>
										<div className='d-flex align-items-center justify-content-between'>
											<CardLabel>Fornecedores/Fiscais</CardLabel>
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
													<th>Nif</th>
													<th>Tipo</th>
													<th>Email</th>
													<th>Telemóvel</th>
													<th>Morada</th>
													<th>Status</th>
												</tr>
											</thead>
											<tbody>
												{currentEmpresas.length === 0 ? (
													<tr>
														<td colSpan={7} className="text-center">
															Nenhuma empresa encontrada
														</td>
													</tr>
												) : (
													currentEmpresas.map((empresa) => (
														<tr key={empresa.codigoEmpresa}>
															<td>{empresa.nome}</td>
															<td>{empresa.nif}</td>
															<td>{empresa.tipo}</td>
															<td>{empresa.email}</td>
															<td>{empresa.telemovel}</td>
															<td>{empresa.morada}</td>
															<td>
																<Badge color='success'>
																	Ativo
																</Badge>
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
					<CompanyForm setRefresh= {setRefresh}/>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default Index;