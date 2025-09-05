import React, { use, useEffect, useState } from 'react';
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
	postCreateEmpresaProjeto,
	getResponsaveisProjetobyProjeto,
	getEmpresasProjeto,
	getUsersFiscais,
	postCreateResponsavelProjeto,
	postCreateLoja,
	deleteEmpresaProjeto,
	deleteResponsavelProjeto,
	getInsignias,
	getTipoDeProjeto,
	putUpdateProjeto,
	getUsersByEmpresa,
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
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Label from '../../../../components/bootstrap/forms/Label';
import Input from '../../../../components/bootstrap/forms/Input';
import { set } from 'zod';

const Index: NextPage = () => {
	// Estados gerais
	useTourStep(12);
	const router = useRouter();
	const { codigoProjeto, codigoInsignia } = router.query;
	const [projectData, setProjectData] = useState<any>(null);
	const [funcionario, setFuncionario] = useState<any>();
	const [projetos, setProjetos] = useState<ProjetosPerAnoByTipoProjetoAndInsignia>([]);
	const [empresas, setEmpresas] = useState<Empresa[]>([]);
	const [lojas, setLojas] = useState<Loja[]>([]);
	const currentYear = new Date().getFullYear();
	const [seletedProject, setSelectedProject] = useState<Projeto>();

	// Estados Offcanvas e Collapse
	const [upcomingEventsEditOffcanvas, setUpcomingEventsEditOffcanvas] = useState(false);
	const [offcanvaEdit, setOffcanvaEdit] = useState(false);
	const [fornecedorCollapse, setFornecedorCollapse] = useState(false);
	const [lojaCollapse, setLojaCollapse] = useState(false);
	// Estados para armazenar os dados
	const [nomeProjeto, setNomeProjeto] = useState('');
	const [fornecedoresSelecionados, setFornecedoresSelecionados] = useState<number[]>([]);
	const [lojaSelecionada, setLojaSelecionada] = useState<number | null>(null);
	const [Fiscais, setFiscais] = useState<UserApp[] | null>([]);
	const [Fornecedores, setFornecedores] = useState<UserApp[] | null>([]);
	const [tipoProjeto, setTipoProjeto] = useState<string>('');
	const [Insignia, setInsignia] = useState<string>('');
	const [refresh, setRefresh] = useState(false);
	// Busca de dados
	if (!codigoProjeto || !codigoInsignia) {
		router.push('/projetos');
		return null;
	}
	useEffect(() => {
		if (refresh) {
			getProjetosByTipoProjetoAndInsignia(Number(codigoProjeto), Number(codigoInsignia)).then(
				(data) => {
					setProjetos(data);
				},
			);
			setRefresh(false);
		}
	}, [refresh, codigoProjeto, codigoInsignia]);
	
	useEffect(() => {
		const fetchData = async () => {
			try {
				if (!codigoProjeto || !codigoInsignia) {
					return;
				}
				const funcData = await getUserInfo();
				const [
					projetosData,
					empresasData,
					lojaData,
					ficaisData,
					tipoProjetoData,
					InsigniaData,
					forneceData,
				] = await Promise.all([
					getProjetosByTipoProjetoAndInsignia(
						Number(codigoProjeto),
						Number(codigoInsignia),
					),
					getEmpresas(),
					getLojas(Number(codigoInsignia)),
					getUsersFiscais(),
					getTipoDeProjeto(),
					getInsignias(),
					getUsersByEmpresa(funcData.codigoEmpresa),
				]);
				setFuncionario(funcData);
				setProjetos(projetosData);
				setEmpresas(empresasData);
				setLojas(lojaData);
				setFiscais(ficaisData);
				setFornecedores(forneceData);
				
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
			} catch (error) {}
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
	const [fornecedoresOriginais, setFornecedoresOriginais] = useState<number[]>([]);
	const [fiscaisSelecionados, setFiscaisSelecionados] = useState<number[]>([]);
	const [fiscaisOriginais, setFiscaisOriginais] = useState<number[]>([]);
	const [fiscalCollapse, setFiscalCollapse] = useState(false);
	// Função para gerenciar seleção de fiscais
	const toggleFiscalSelecionado = (codigoFiscal: number) => {
		setFiscaisSelecionados(
			(prev) =>
				prev.includes(codigoFiscal)
					? prev.filter((codigo) => codigo !== codigoFiscal) // Remove se já estiver selecionado
					: [...prev, codigoFiscal], // Adiciona se não estiver selecionado
		);
	};

	const handleEdit = async (projeto: Projeto) => {
		try {
			setOffcanvaEdit(true);
			setNomeProjeto(projeto.nomeProjeto);
			setLojaSelecionada(projeto.codigoLoja);
			setSelectedProject(projeto);

			// Buscar fornecedores associados
			const res = await getEmpresasProjeto(projeto.codigoProjeto);
			if (res?.empresasProjeto) {
				const empresas = res.empresasProjeto.map((empresa: any) => empresa.codigoEmpresa);
				setFornecedoresSelecionados(empresas);
				setFornecedoresOriginais(empresas); // Salve os fornecedores originais
			}
			try {
				const res2 = await getResponsaveisProjetobyProjeto(projeto.codigoProjeto);

				if (res2?.responsaveisProjeto) {
					const fiscais = res2.responsaveisProjeto.map(
						(responsavel: any) => responsavel.nUtilizador,
					);

					setFiscaisSelecionados(fiscais);
					setFiscaisOriginais(fiscais); // Salve os fiscais originais para comparação futura
				} else {
					// Caso não haja responsáveis no retorno
					setFiscaisSelecionados([]); // Nenhum fiscal selecionado
					setFiscaisOriginais([]); // Nenhum fiscal original
				}
			} catch (error) {
				// Trata o erro 404 ou outros erros
				if ((error as any).response?.status === 404) {
					console.error('Nenhum responsável encontrado para este projeto.');
					setFiscaisSelecionados([]); // Nenhum fiscal selecionado
					setFiscaisOriginais([]); // Nenhum fiscal original
				} else {
					console.error('Erro ao buscar responsáveis:', error);
				}

				// Garanta que os checkboxes estejam todos unchecked no caso de erro
				setFiscaisSelecionados([]);
				setFiscaisOriginais([]);
			}
		} catch (error) {
			console.error('Erro ao buscar as empresas do projeto:', error);
		}
	};

	// Monitorar mudanças em `responsaveis`
	const handleSaveProject = () => {
		const dadosProjeto = {
			nomeProjeto,
			fornecedoresSelecionados,
			fiscaisSelecionados,
			lojaSelecionada,
		};
		console.log('Dados do Projeto:', dadosProjeto);

		const input = {
			codigoTipoProjeto: Number(codigoProjeto),
			codigoLoja: lojaSelecionada as number,
			nomeProjeto: nomeProjeto,
			ano: currentYear,

		};
		console.log('Input:', input);
		
		postCreateProjeto(input).then((res) => {
			console.log('Resposta:', res);
			getProjetosByTipoProjetoAndInsignia(Number(codigoProjeto), Number(codigoInsignia)).then(
				(data) => {
					setProjetos(data);
				},
			);

			// Criar associações com fornecedores
			for (let i = 0; i < fornecedoresSelecionados.length; i++) {
				postCreateEmpresaProjeto({
					codigoEmpresa: fornecedoresSelecionados[i],
					codigoProjeto: res.codigoProjeto,
				});
			}

			// Criar associações com fiscais
			for (let i = 0; i < fiscaisSelecionados.length; i++) {
				const data = {
					nUtilizadores: fiscaisSelecionados[i],
					codigoProjeto: res.codigoProjeto,
				};
				console.log(data);
				postCreateResponsavelProjeto({
					nUtilizador: fiscaisSelecionados[i],
					codigoProjeto: res.codigoProjeto,
				});
			}
		});
		setUpcomingEventsEditOffcanvas(false); // Fechar o OffCanvas após salvar
	};

	const handleSaveEditedProject = async () => {
		if (!seletedProject) return;

		// Comparar fornecedores antes e depois da edição
		const fornecedoresAntes = fornecedoresOriginais || [];
		const fornecedoresAdicionados = fornecedoresSelecionados.filter(
			(id) => !fornecedoresAntes.includes(id),
		);
		const fornecedoresRemovidos = fornecedoresAntes.filter(
			(id) => !fornecedoresSelecionados.includes(id),
		);

		// Comparar fiscais antes e depois da edição
		const fiscaisAntes = fiscaisOriginais || [];
		const fiscaisAdicionados = fiscaisSelecionados.filter((id) => !fiscaisAntes.includes(id));
		const fiscaisRemovidos = fiscaisAntes.filter((id) => !fiscaisSelecionados.includes(id));

		console.log('Fornecedores Adicionados:', fornecedoresAdicionados);
		console.log('Fornecedores Removidos:', fornecedoresRemovidos);
		console.log('Fiscais Adicionados:', fiscaisAdicionados);
		console.log('Fiscais Removidos:', fiscaisRemovidos);

		try {
			// Atualizar fornecedores adicionados
			for (const fornecedorId of fornecedoresAdicionados) {
				await postCreateEmpresaProjeto({
					codigoProjeto: seletedProject.codigoProjeto,
					codigoEmpresa: fornecedorId,
				});
			}

			// Remover fornecedores desassociados
			for (const fornecedorId of fornecedoresRemovidos) {
				await deleteEmpresaProjeto(seletedProject.codigoProjeto, fornecedorId);
			}

			// Atualizar fiscais adicionados
			for (const fiscalId of fiscaisAdicionados) {
				await postCreateResponsavelProjeto({
					codigoProjeto: seletedProject.codigoProjeto,
					nUtilizador: fiscalId,
				});
			}

			// Remover fiscais desassociados
			for (const fiscalId of fiscaisRemovidos) {
				await deleteResponsavelProjeto(seletedProject.codigoProjeto, fiscalId);
			}

			console.log('Projeto atualizado com sucesso!');
			setOffcanvaEdit(false); // Fecha o modal
		} catch (error) {
			console.error('Erro ao salvar o projeto editado:', error);
		}
	
		const data={
			codigoProjeto : seletedProject.codigoProjeto,
			nomeProjeto : nomeProjeto,
			codigoLoja : lojaSelecionada as number,
		}
		await putUpdateProjeto(data);
		setRefresh(true);
		
	};
	const [mostrarInputs, setMostrarInputs] = useState(false);
	const [nomeLoja, setNomeLoja] = useState('');
	const [moradaLoja, setMoradaLoja] = useState('');

	// Função para manipular o clique no botão de adicionar loja
	const handleAdicionarLoja = () => {
		setMostrarInputs(true);
	};

	// Função para salvar a nova loja
	const handleSalvarLoja = () => {
		// Aqui você pode enviar os dados para o backend ou tratá-los como necessário
		console.log('Nova loja criada:', { nome: nomeLoja, morada: moradaLoja });
		postCreateLoja({
			codigoInsignia: Number(codigoInsignia),
			nome: nomeLoja,
			morada: moradaLoja,
		}).then((res) => {
			console.log('Resposta:', res);
			setLojas((prev) => [...prev, res.loja]);
		});
		// Limpar os inputs após salvar
		setNomeLoja('');
		setMoradaLoja('');
		setMostrarInputs(false); // Ocultar os inputs após salvar
	};
	return (
		<PageWrapper>
			

			

			<Page>
				<div className='row'>
					{/* Renderizar os projetos */}
					<div className='display-4 fw-bold py-3'>
						Projetos de {tipoProjeto} da Insignía {Insignia}
					</div>
					{!projetos.some((projeto) => Number(projeto.ano) === currentYear) &&
						funcionario?.role === 'Dec' && (
							<div className='col-12'>
								<div className='display-4 fw-bold py-3'>{currentYear}</div>
								<div className='row'>
									<div className='col-md-4'>
										<Card stretch>
											<CardBody className='d-flex align-items-center justify-content-center'>
												<Button
													color='info'
													size='lg'
													isLight
													className='w-100 h-100'
													icon='AddCircle'
													onClick={() => {
														setUpcomingEventsEditOffcanvas(true);
														setNomeProjeto('');
														setLojaSelecionada(null);
														setFornecedoresSelecionados([]);
													}}>
													Adicionar Novo Projeto
												</Button>
											</CardBody>
										</Card>
									</div>
								</div>
							</div>
						)}
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
														{funcionario?.role === 'Dec' && (
															<Button
																icon='Edit'
																onClick={() =>
																	handleEdit(subProjeto)
																} // Volta para a seleção de seções
															/>
														)}
														{funcionario?.responsavelEmpresa && funcionario?.role === 'Fiscal'  ||funcionario?.responsavelEmpresa && funcionario?.role === 'Fornecedor' && (
															<Button
																icon='Edit'
																onClick={() =>
																	handleEdit(subProjeto)
																} // Volta para a seleção de seções
															/>
														)}
													</CardTitle>
												</CardLabel>
												<CardActions>
													<Button
														color='primary'
														onClick={() =>
															router.push(
																`/projetos/trabalhos/${subProjeto.codigoProjeto}`,
															)
														}>
														Ver Detalhes
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
								{Number(projeto.ano) === currentYear &&
									funcionario?.role === 'Dec' && (
										<div className='col-md-4'>
											<Card stretch>
												<CardBody className='d-flex align-items-center justify-content-center'>
													<Button
														color='info'
														size='lg'
														isLight
														className='w-100 h-100'
														icon='AddCircle'
														onClick={() => {
															setUpcomingEventsEditOffcanvas(true);
															setNomeProjeto('');
															setLojaSelecionada(null);
															setFornecedoresSelecionados([]);
														}}>
														Adicionar Novo Projeto
													</Button>
												</CardBody>
											</Card>
										</div>
									)}
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
									<br />
									{/* Botão para adicionar uma nova loja */}
									{!mostrarInputs && (
										<Button
											color='info'
											className='w-50'
											onClick={handleAdicionarLoja}>
											Adicionar Nova Loja
										</Button>
									)}

									{/* Inputs para nome e morada, visíveis somente quando "mostrarInputs" for true */}
									{mostrarInputs && (
										<div className='mt-3'>
											<FormGroup>
												<Input
													type='text'
													id='nomeLoja'
													placeholder='Digite o nome da loja'
													value={nomeLoja}
													onChange={(
														e: React.ChangeEvent<HTMLInputElement>,
													) => setNomeLoja(e.target.value)}
												/>
											</FormGroup>
											<br />
											<FormGroup>
												<Input
													type='text'
													id='moradaLoja'
													placeholder='Digite a morada da loja'
													value={moradaLoja}
													onChange={(
														e: React.ChangeEvent<HTMLInputElement>,
													) => setMoradaLoja(e.target.value)}
												/>
											</FormGroup>
											<br />
											<Button
												color='success'
												className='me-2'
												onClick={handleSalvarLoja}>
												Salvar Loja
											</Button>
											<Button
												color='danger'
												onClick={() => setMostrarInputs(false)}>
												Cancelar
											</Button>
										</div>
									)}
								</CardBody>
							</Collapse>
						</Card>
						<Card stretch>
							<CardHeader className='bg-transparent'>
								<CardLabel onClick={() => setFiscalCollapse(!fiscalCollapse)}>
									<CardTitle tag='h5' className='h6'>
										Selecionar Fiscais para o Projeto
									</CardTitle>
								</CardLabel>
							</CardHeader>
							<Collapse isOpen={fiscalCollapse}>
								<CardBody>
									{Fiscais?.map(
										(fiscal, index) =>
											fiscal.responsavelEmpresa && (
												<div key={index} className='form-check'>
													<input
														type='checkbox'
														className='form-check-input'
														id={`fiscal-edit-${fiscal.nUtilizador}`}
														checked={fiscaisSelecionados.includes(
															fiscal.nUtilizador,
														)}
														onChange={() =>
															toggleFiscalSelecionado(
																fiscal.nUtilizador,
															)
														}
													/>
													<label
														className='form-check-label ms-2'
														htmlFor={`fiscal-edit-${fiscal.nUtilizador}`}>
														{fiscal.nome}
													</label>
												</div>
											),
									)}
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

			<OffCanvas setOpen={setOffcanvaEdit} isOpen={offcanvaEdit} isBodyScroll placement='end'>
				<OffCanvasHeader setOpen={setOffcanvaEdit}>
					<OffCanvasTitle id='upcomingEdit'>Editar Projeto</OffCanvasTitle>
				</OffCanvasHeader>
				<OffCanvasBody>
					<div>
						{funcionario?.role === 'Dec' && (
							<>
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
											onClick={() =>
												setFornecedorCollapse(!fornecedorCollapse)
											}>
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
														checked={
															lojaSelecionada === loja.codigoLoja
														}
														onChange={() =>
															setLojaSelecionada(loja.codigoLoja)
														}
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
								<Card stretch>
									<CardHeader className='bg-transparent'>
										<CardLabel
											onClick={() => setFiscalCollapse(!fiscalCollapse)}>
											<CardTitle tag='h5' className='h6'>
												Editar Fiscais do Projeto
											</CardTitle>
										</CardLabel>
									</CardHeader>
									<Collapse isOpen={fiscalCollapse}>
										<CardBody>
											{Fiscais?.map(
												(fiscal, index) =>
													fiscal.responsavelEmpresa && (
														<div key={index} className='form-check'>
															<input
																type='checkbox'
																className='form-check-input'
																id={`fiscal-edit-${fiscal.nUtilizador}`}
																checked={fiscaisSelecionados.includes(
																	fiscal.nUtilizador,
																)}
																onChange={() =>
																	toggleFiscalSelecionado(
																		fiscal.nUtilizador,
																	)
																}
															/>
															<label
																className='form-check-label ms-2'
																htmlFor={`fiscal-edit-${fiscal.nUtilizador}`}>
																{fiscal.nome}
															</label>
														</div>
													),
											)}
										</CardBody>
									</Collapse>
								</Card>
							</>
						)}
						{funcionario?.responsavelEmpresa && funcionario?.role === 'Fiscal' && (
							<>
								<Card stretch>
									<CardHeader className='bg-transparent'>
										<CardLabel
											onClick={() => setFiscalCollapse(!fiscalCollapse)}>
											<CardTitle tag='h5' className='h6'>
												Editar Fiscais do Projeto
											</CardTitle>
										</CardLabel>
									</CardHeader>
									<Collapse isOpen={fiscalCollapse}>
										<CardBody>
											{Fiscais?.filter((fiscal :any) => {
												console.log(
													'Código empresa do fiscal:',
													fiscal.codigoEmpresa
													,
												);
												console.log(
													'Código empresa do funcionário:',
													funcionario.
													codigoEmpresa,
												);
												return (
													fiscal.codigoEmpresa ===
													funcionario.codigoEmpresa
												);
											}).map((fiscal, index) => (
												<div key={index} className='form-check'>
													<input
														type='checkbox'
														className='form-check-input'
														id={`fiscal-edit-${fiscal.nUtilizador}`}
														checked={fiscaisSelecionados.includes(
															fiscal.nUtilizador,
														)}
														onChange={() =>
															toggleFiscalSelecionado(
																fiscal.nUtilizador,
															)
														}
													/>
													<label
														className='form-check-label ms-2'
														htmlFor={`fiscal-edit-${fiscal.nUtilizador}`}>
														{fiscal.nome}
													</label>
												</div>
											))}
										</CardBody>
									</Collapse>
								</Card>
							</>
						)}
						{funcionario?.responsavelEmpresa && funcionario?.role === 'Fornecedor' && (
							<>
								<Card stretch>
									<CardHeader className='bg-transparent'>
										<CardLabel
											onClick={() => setFiscalCollapse(!fiscalCollapse)}>
											<CardTitle tag='h5' className='h6'>
												Editar Fornecedores do Projeto
											</CardTitle>
										</CardLabel>
									</CardHeader>
									<Collapse isOpen={fiscalCollapse}>
										<CardBody>
											{Fornecedores?.filter((fiscal :any) => {
												console.log(
													'Código empresa do fiscal:',
													fiscal.codigoEmpresa
													,
												);
												console.log(
													'Código empresa do funcionário:',
													funcionario.
													codigoEmpresa,
												);
												return (
													fiscal.codigoEmpresa ===
													funcionario.codigoEmpresa
												);
											}).map((fiscal, index) => (
												<div key={index} className='form-check'>
													<input
														type='checkbox'
														className='form-check-input'
														id={`fiscal-edit-${fiscal.nUtilizador}`}
														checked={fiscaisSelecionados.includes(
															fiscal.nUtilizador,
														)}
														onChange={() =>
															toggleFiscalSelecionado(
																fiscal.nUtilizador,
															)
														}
													/>
													<label
														className='form-check-label ms-2'
														htmlFor={`fiscal-edit-${fiscal.nUtilizador}`}>
														{fiscal.nome}
													</label>
												</div>
											))}
										</CardBody>
									</Collapse>
								</Card>
							</>
						)}
					</div>
				</OffCanvasBody>
				<div className='row m-0'>
					<div className='col-12 p-3'>
						<Button color='info' className='w-100' onClick={handleSaveEditedProject}>
							Salvar
						</Button>
					</div>
				</div>
			</OffCanvas>
		</PageWrapper>
	);
};

export default Index;
