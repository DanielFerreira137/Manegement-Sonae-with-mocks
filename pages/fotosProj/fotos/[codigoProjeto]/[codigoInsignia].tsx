import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

// Hooks e dados
import useDarkMode from '../../../../hooks/useDarkMode';
import useTourStep from '../../../../hooks/useTourStep';
import {
	getUserInfo,
	getProjetosByTipoProjetoAndInsignia,
	getEmpresas,
	getLojas,
	postCreateProjeto,
	getInsignias,
	getTipoDeProjeto
} from '../../../../api/routes';
import { demoPagesMenu } from '../../../../menu';

// Componentes reutilizáveis
import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import SubHeader, { SubHeaderLeft } from '../../../../layout/SubHeader/SubHeader';
import Page from '../../../../layout/Page/Page';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../../../../components/bootstrap/Card';
import Avatar from '../../../../components/Avatar';
import Button from '../../../../components/bootstrap/Button';
import OffCanvas, {
	OffCanvasBody,
	OffCanvasHeader,
	OffCanvasTitle,
} from '../../../../components/bootstrap/OffCanvas';
import Collapse from '../../../../components/bootstrap/Collapse';
import { get } from 'http';

const Index: NextPage = () => {
	// Estados gerais
	useTourStep(12);
	const router = useRouter();
	const { codigoProjeto, codigoInsignia } = router.query;
	const [projectData, setProjectData] = useState<any>(null);
	const [funcionario, setFuncionario] = useState<UserApp>();
	const [projetos, setProjetos] = useState<ProjetosPerAnoByTipoProjetoAndInsignia>([]);
	const [empresas, setEmpresas] = useState<Empresa[]>([]);
	const [lojas, setLojas] = useState<Loja[]>([]);
	const currentYear = new Date().getFullYear();

	// Estados Offcanvas e Collapse
	const [upcomingEventsEditOffcanvas, setUpcomingEventsEditOffcanvas] = useState(false);
	const [fornecedorCollapse, setFornecedorCollapse] = useState(false);
	const [lojaCollapse, setLojaCollapse] = useState(false);
	// Estados para armazenar os dados
	const [nomeProjeto, setNomeProjeto] = useState('');
	const [fornecedoresSelecionados, setFornecedoresSelecionados] = useState<number[]>([]);
	const [lojaSelecionada, setLojaSelecionada] = useState<number | null>(null);
	const [tipoProjeto, setTipoProjeto] = useState<string>('');
	const [Insignia, setInsignia] = useState<string>('');
	// Busca de dados
	useEffect(() => {
		const fetchData = async () => {
			const [funcData, projetosData, empresasData, lojaData,tipoProjetoData,InsigniaData] = await Promise.all([
				getUserInfo(),
				getProjetosByTipoProjetoAndInsignia(Number(codigoProjeto), Number(codigoInsignia)),
				getEmpresas(),
				getLojas(Number(codigoInsignia)),
				getTipoDeProjeto(),
				getInsignias()
			]);
			setFuncionario(funcData);
			setProjetos(projetosData);
			setEmpresas(empresasData);
			setLojas(lojaData);
			const tipoProjetoMap = new Map();
				tipoProjetoData.forEach((tipo: any) => {
					if (tipo.codigoTipoProjeto === Number(codigoProjeto)) {
						tipoProjetoMap.set(tipo.codigoTipoProjeto, tipo.tipo);
					}
				});
				const tipoProjetoSelecionado = tipoProjetoMap.get(Number(codigoProjeto));
				setTipoProjeto(tipoProjetoSelecionado);
			
				const insigniaMap = new Map();
				InsigniaData.forEach((insignia: any) => {
					if (insignia.codigoInsignia === Number(codigoInsignia)) {
						insigniaMap.set(insignia.codigoInsignia, insignia.nome);
					}
				});
				const insigniaSelecionada = insigniaMap.get(Number(codigoInsignia));
				setInsignia(insigniaSelecionada);
		};
		fetchData();
	}, [codigoProjeto, codigoInsignia]);

	// Renderização do componente
	const toggleFornecedorSelecionado = (codigoEmpresa: number) => {
		setFornecedoresSelecionados(
			(prev) =>
				prev.includes(codigoEmpresa)
					? prev.filter((codigo) => codigo !== codigoEmpresa) // Remove se já estiver selecionado
					: [...prev, codigoEmpresa], // Adiciona se não estiver selecionado
		);
	};
	const handleSaveProject = () => {
		const dadosProjeto = {
			nomeProjeto,
			fornecedoresSelecionados,
			lojaSelecionada,
		};
		console.log('Dados do Projeto:', dadosProjeto);
		const input = {
			codigoTipoProjeto: Number(codigoProjeto),
			nomeProjeto:nomeProjeto,
			ano: currentYear,
			codigoLoja:lojaSelecionada !== null ? lojaSelecionada : 1,
		};
		console.log('Input:', input);
		postCreateProjeto(input).then((res) => {
			console.log(res);
		}
		);
		// Aqui você pode enviar os dados para o backend, se necessário.
		setUpcomingEventsEditOffcanvas(false); // Fechar o OffCanvas após salvar
	};

	return (
		<PageWrapper>
			<Head>
				<title>{demoPagesMenu.projectManagement.subMenu.list.text}</title>
			</Head>

			
			<Page>
				<div className='row'>
				<div className='display-4 fw-bold py-3'>
						Projetos de {tipoProjeto} da Insignía {Insignia}
					</div>
					{/* Renderizar os projetos */}
					{projetos.map((projeto, index) => (
						<div key={index} className='col-12'>
							<div className='display-4 fw-bold py-3'>
								{Number(projeto.ano) === currentYear ? currentYear : projeto.ano}
							</div>
							<div className='row'>
								{projeto.projetos.map((subProjeto, subIndex) => (
									<div className='col-md-4' key={subIndex}>
										<Card stretch>
											<CardHeader className='bg-transparent'>
												<CardLabel>
													<CardTitle tag='h4' className='h5'>
														{subProjeto.nomeProjeto}
													</CardTitle>
												</CardLabel>
												<CardActions>
													<Button
														color='primary'
														onClick={() =>
															router.push(
																`/fotosProj/fotosDocumentacao/${subProjeto.codigoProjeto}`,
															)
														}>
														Fotos e Documentação
													</Button>
												</CardActions>
											</CardHeader>
											<CardLabel>
												<CardTitle tag='h4' className='h5'>
													<CardHeader className='bg-transparent'>
														<Avatar
															size={40}
															src='https://cdn-icons-png.flaticon.com/512/3515/3515146.png'
															className='me-2'
														/>
														<CardLabel>
															<CardTitle tag='h4' className='h5'>
																{subProjeto.loja.nome}
															</CardTitle>
															<CardSubTitle tag='h6' className='h6'>
																{subProjeto.loja.morada}
															</CardSubTitle>
														</CardLabel>
													</CardHeader>
												</CardTitle>
											</CardLabel>
										</Card>
									</div>
								))}
								{/* Adicionar Novo Projeto para o ano atual */}
								
							</div>
						</div>
					))}
					{/* Adicionar Novo Projeto se não houver projetos no ano atual */}
					
				</div>
			</Page>

			{/* OffCanvas para criar projeto */}
			<OffCanvas
				setOpen={setUpcomingEventsEditOffcanvas}
				isOpen={upcomingEventsEditOffcanvas}
				isBodyScroll
				placement='end'>
				<OffCanvasHeader setOpen={setUpcomingEventsEditOffcanvas}>
					<OffCanvasTitle id='upcomingEdit'>Criar Projeto</OffCanvasTitle>
				</OffCanvasHeader>
				<OffCanvasBody>
					<div>
						{/* Nome do Projeto */}
						<input
							type='text'
							className='form-control w-100 mb-3'
							placeholder='Nome do Projeto'
							value={nomeProjeto}
							onChange={(e) => setNomeProjeto(e.target.value)}
						/>
						{/* Fornecedores */}
						<Card stretch>
							<CardHeader className='bg-transparent'>
								<CardLabel
									onClick={() => setFornecedorCollapse(!fornecedorCollapse)}>
									<CardTitle tag='h5' className='h6'>
										Fornecedores para este projeto
									</CardTitle>
								</CardLabel>
							</CardHeader>
							<Collapse isOpen={fornecedorCollapse}>
								<CardBody>
									{empresas.map((empresa, index) => (
										<div key={index} className='form-check'>
											<input
												type='checkbox'
												className='form-check-input'
												id={`empresa-${empresa.codigoEmpresa}`}
												checked={fornecedoresSelecionados.includes(
													empresa.codigoEmpresa,
												)}
												onChange={() =>
													toggleFornecedorSelecionado(
														empresa.codigoEmpresa,
													)
												}
											/>
											<label
												className='form-check-label ms-2'
												htmlFor={`empresa-${empresa.codigoEmpresa}`}>
												{empresa.nome}
											</label>
										</div>
									))}
								</CardBody>
							</Collapse>
						</Card>
						{/* Lojas */}
						<Card stretch>
							<CardHeader className='bg-transparent'>
								<CardLabel onClick={() => setLojaCollapse(!lojaCollapse)}>
									<CardTitle tag='h5' className='h6'>
										Selecionar Loja para o Projeto
									</CardTitle>
								</CardLabel>
							</CardHeader>
							<Collapse isOpen={lojaCollapse}>
								<CardBody>
									{lojas.map((loja, index) => (
										<div key={index} className='form-check'>
											<input
												type='radio'
												className='form-check-input'
												name='lojaSelecionada'
												id={`loja-${loja.codigoLoja}`}
												value={loja.codigoLoja}
												checked={lojaSelecionada === loja.codigoLoja}
												onChange={() => setLojaSelecionada(loja.codigoLoja)}
											/>
											<label
												className='form-check-label ms-2'
												htmlFor={`loja-${loja.codigoLoja}`}>
												{loja.nome}
											</label>
										</div>
									))}
								</CardBody>
							</Collapse>
						</Card>
					</div>
				</OffCanvasBody>
				<div className='row m-0'>
					<div className='col-12 p-3'>
						<Button color='info' className='w-100' onClick={handleSaveProject}>
							Salvar
						</Button>
					</div>
				</div>
			</OffCanvas>
		</PageWrapper>
	);
};

export default Index;
