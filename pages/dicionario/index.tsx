import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import SearchComponent from './SearchComponent';
// Hooks e dados
import useDarkMode from '../../hooks/useDarkMode';
import useTourStep from '../../hooks/useTourStep';
import {
	getUserInfo,
	getSeccoes,
	getSeccoesZonasBySeccao,
	getZonasTrabalhosByZona,
	postCreateSeccao,
	postCreateTrabalho,
	getZonas,
	postCreateZona,
	putUpdateSeccao,
	putUpdateZona,
	putUpdateTrabalho,
} from '../../api/routes';
import { demoPagesMenu } from '../../menu';

// Componentes reutilizáveis
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import SubHeader, { SubHeaderLeft } from '../../layout/SubHeader/SubHeader';
import Page from '../../layout/Page/Page';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../components/bootstrap/Card';
import Button from '../../components/bootstrap/Button';
import OffCanvas, {
	OffCanvasBody,
	OffCanvasHeader,
	OffCanvasTitle,
} from '../../components/bootstrap/OffCanvas';
import { get } from 'http';

const Index: NextPage = () => {
	// Passo do tour
	useTourStep(12);

	// Estado de modo escuro
	const { darkModeStatus } = useDarkMode();

	// Estados
	const [funcionario, setFuncionario] = useState<UserApp>();
	const [seccoes, setSeccoes] = useState<Seccao[]>([]);
	const [zonas, setZonas] = useState<SeccaoZonaData[]>([]);
	const [cardNovaSecao, setCardNovaSecao] = useState<boolean>(false);
	const [cardNovaZona, setCardNovaZona] = useState<boolean>(true);
	const [codigoSeccao, setCodigoSeccao] = useState<number>();
	const [cardNovoTrabalho, setCardNovoTrabalho] = useState<boolean>(false);
	const [codigoZona, setCodigoZona] = useState<number>();
	const [nomeSecao, setNomeSecao] = useState('');
	const [nomeZona, setNomeZona] = useState('');
	const [nomeTrabalho, setNomeTrabalho] = useState('');
	const [showZonas, setShowZonas] = useState<boolean>(false);
	const [openTrabalhos, setOpenTrabalhos] = useState<boolean>(false);
	const [trabalhos, setTrabalhos] = useState<ZonaTrabalhoData[]>([]);
	const [resetSeccaoSearch, setResetSeccaoSearch] = useState(false);
	const [resetZonaSearch, setResetZonaSearch] = useState(false);
	const [resetTrabalhoSearch, setResetTrabalhoSearch] = useState(false);
	// Buscar informações do funcionário e seções ao carregar
	useEffect(() => {
		const fetchData = async () => {
			const [funcData, seccoesData] = await Promise.all([getUserInfo(), getSeccoes()]);
			setFuncionario(funcData);
			setSeccoes(seccoesData);
		};
		fetchData();
	}, []);
	const [filteredSeccoes, setFilteredSeccoes] = useState(seccoes);
	const [filteredZonas, setFilteredZonas] = useState(zonas);
	const [filteredTrabalhos, setFilteredTrabalhos] = useState(trabalhos);
	// Função para selecionar uma seção e buscar suas zonas
	const handleSelecionarSeccao = async (codigoSeccao: number) => {
		try {
			const zonasData = await getSeccoesZonasBySeccao(codigoSeccao);
			setZonas(zonasData);
			setCodigoSeccao(codigoSeccao);
			setShowZonas(true);
			setResetSeccaoSearch(true); // Adicione isto para resetar a busca
		} catch (error) {
			console.error('Erro ao buscar zonas:', error);
			setZonas([]);
			setShowZonas(true);
		}
	};

	// Função para criar uma nova seção
	const handleNovaSeccao = async () => {
		if (!nomeSecao.trim()) {
			alert('O nome da seção não pode estar vazio!');
			return;
		}
		postCreateSeccao({ nome: nomeSecao })
			.then((data) => {
				getSeccoes().then((seccoesData) => {
					setSeccoes(seccoesData);
				});
				setNomeSecao('');
				setCardNovaSecao(false);
			})
			.catch((error) => {
				console.error('Erro ao criar seção:', error);
			});
	};

	// Função para criar uma nova zona
	const handleNovaZona = async () => {
		if (!nomeZona.trim()) {
			alert('O nome da zona não pode estar vazio!');
			return;
		}
		postCreateZona({ nome: nomeZona, codigoSeccao: codigoSeccao as number })
			.then((data) => {
				getSeccoesZonasBySeccao(codigoSeccao as number).then((zonasData) => {
					setZonas(zonasData);
				});
				setNomeZona('');
				setCardNovaZona(false);
			})
			.catch((error) => {
				console.error('Erro ao criar zona:', error);
			});
	};
	const handleSelecionarZona = (codigoZona: number) => {
		if (codigoZona === undefined) {
			console.error('Código da zona não encontrado');
			return;
		}
		setCodigoZona(codigoZona);
		getZonasTrabalhosByZona(codigoZona)
			.then((data) => {
				setTrabalhos(data);
				setResetZonaSearch(true); // Adicione isto para resetar a busca
			})
			.catch((error) => {
				console.error('Erro ao buscar zonas:', error);
				setTrabalhos([]);
			});
		setOpenTrabalhos(true);
	};
	const [editingTrabalho, setEditingTrabalho] = useState(null as ZonaTrabalhoData | null);

	// Função para salvar o trabalho editado
	const handleSaveTrabalho = (trabalhoEditado: ZonaTrabalhoData) => {
		// Aqui você pode enviar o trabalho editado para o backend ou atualizar a lista local
		console.log('Trabalho salvo:', trabalhoEditado);
		putUpdateTrabalho({
			codigoTrabalho: trabalhoEditado.trabalho.codigoTrabalho,
			nome: trabalhoEditado.trabalho.nome,
		})
			.then((data) => {
				getZonasTrabalhosByZona(codigoZona as number).then((trabalhosData) => {
					setTrabalhos(trabalhosData);
				});
			})
			.catch((error) => {
				console.error('Erro ao atualizar trabalho:', error);
			});
		setEditingTrabalho(null); // Fecha o modo de edição
	};
	const handleNovoTrabalho = (codigoZona: number) => {
		console.log(codigoZona);
		postCreateTrabalho({ nome: nomeTrabalho, codigoZona })
			.then((data) => {
				getZonasTrabalhosByZona(codigoZona)
					.then((data) => {
						setTrabalhos(data);
					})
					.catch((error) => {
						console.error('Erro ao buscar zonas:', error);
					});
				setNomeTrabalho('');
				setCardNovoTrabalho(false);
			})
			.catch((error) => {
				console.error('Erro ao criar trabalho:', error);
			});
	};
	// Estados adicionais para edição
	const [editingSeccao, setEditingSeccao] = useState(null as Seccao | null);

	// Função para salvar a secção editada
	const handleSaveSeccao = (seccaoEditada: Seccao) => {
		// Aqui você pode enviar a secção editada para o backend ou atualizar a lista local
		console.log('Secção salva:', seccaoEditada);
		putUpdateSeccao({ codigoSeccao: seccaoEditada.codigoSeccao, nome: seccaoEditada.nome })
			.then((data) => {
				getSeccoes().then((seccoesData) => {
					setSeccoes(seccoesData);
				});
			})
			.catch((error) => {
				console.error('Erro ao atualizar seção:', error);
			});

		setEditingSeccao(null); // Fecha o modo de edição
	};

	// Renderização da lista de seções
	const renderSeccoes = () => (
		<>
			<div className='col-12'>
				<div className='display-4 fw-bold py-3'>Selecione Uma Secção</div>
				<SearchComponent
					data={seccoes}
					type='seccoes'
					onFilteredData={setFilteredSeccoes}
					resetSearch={resetSeccaoSearch}
					onResetComplete={() => setResetSeccaoSearch(false)}
				/>
			</div>
			{filteredSeccoes.map((item) => (
				<div className='col-md-4' key={item.codigoSeccao}>
					<Card stretch>
						<CardHeader className='bg-transparent'>
							<CardLabel>
								<CardTitle tag='h4' className='h5'>
									{item.codigoSeccao === editingSeccao?.codigoSeccao ? (
										<input
											type='text'
											className='form-control'
											value={editingSeccao.nome}
											onChange={(e) =>
												setEditingSeccao({
													...editingSeccao,
													nome: e.target.value,
												})
											}
										/>
									) : (
										item.nome
									)}
								</CardTitle>
							</CardLabel>
							<CardActions>
								{funcionario?.codigoEmpresa === item.codigoEmpresa && (
									<>
										{item.codigoSeccao === editingSeccao?.codigoSeccao ? (
											<>
												<Button
													icon='save'
													aria-label='Save'
													hoverShadow='default'
													color={darkModeStatus ? 'dark' : 'success'}
													onClick={() => handleSaveSeccao(editingSeccao)}
												/>
												<Button
													icon='cancel'
													aria-label='Cancel'
													hoverShadow='default'
													color='danger'
													onClick={() => setEditingSeccao(null)}
												/>
											</>
										) : (
											<Button
												icon='edit'
												aria-label='Edit'
												hoverShadow='default'
												color={darkModeStatus ? 'dark' : undefined}
												onClick={() => setEditingSeccao(item)}
											/>
										)}
									</>
								)}
								<Button
									icon='ArrowForwardIos'
									aria-label='Read More'
									hoverShadow='default'
									color={darkModeStatus ? 'dark' : undefined}
									onClick={() => handleSelecionarSeccao(item.codigoSeccao)}
								/>
							</CardActions>
						</CardHeader>
					</Card>
				</div>
			))}
			{funcionario?.role === 'Fornecedor' && (
				<div className='col-md-4'>
					<Card stretch>
						<CardBody className='d-flex align-items-center justify-content-center'>
							{cardNovaSecao ? (
								<>
									<input
										type='text'
										className='form-control w-100 h-100'
										placeholder='Nome da Nova Secção'
										value={nomeSecao}
										onChange={(e) => setNomeSecao(e.target.value)}
									/>
									<div className='px-3'>
										<Button
											color='success'
											size='lg'
											isLight
											icon='AddTask'
											onClick={handleNovaSeccao}
										/>
									</div>
									<div className=''>
										<Button
											color='danger'
											size='lg'
											isLight
											icon='Cancel'
											onClick={() => {
												setCardNovaSecao(!cardNovaSecao);
											}}
										/>
									</div>
								</>
							) : (
								<Button
									color='info'
									size='lg'
									isLight
									className='w-100 h-100'
									icon='AddCircle'
									onClick={() => {
										setCardNovaSecao(!cardNovaSecao);
									}}>
									Adicionar Nova Secção
								</Button>
							)}
						</CardBody>
					</Card>
				</div>
			)}
		</>
	);

	// Estados adicionais para edição
	const [editingZona, setEditingZona] = useState(null as SeccaoZonaData | null);

	// Função para salvar a zona editada
	const handleSaveZona = (zonaEditada: SeccaoZonaData) => {
		// Aqui você pode enviar a zona editada para o backend ou atualizar a lista local
		console.log('Zona salva:', zonaEditada);
		putUpdateZona({ codigoZona: zonaEditada.zona.codigoZona, nome: zonaEditada.zona.nome })
			.then((data) => {
				getSeccoesZonasBySeccao(codigoSeccao as number).then((zonasData) => {
					setZonas(zonasData);
				});
			})
			.catch((error) => {
				console.error('Erro ao atualizar zona:', error);
			});
		setEditingZona(null); // Fecha o modo de edição
	};
	// Renderização da lista de zonas
	const renderSeccoesZonas = () => (
		<>
			<div className='col-12'>
				<div className='d-flex align-items-center'>
					<Button
						icon='ArrowBack'
						hoverShadow='default'
						color={darkModeStatus ? 'dark' : undefined}
						onClick={() => {
							setShowZonas(false);
							setResetZonaSearch(true); // Adicione isto para resetar a busca ao voltar
						}}
					/>
					<div className='display-4 fw-bold py-3'>Selecione Uma Zona</div>
				</div>
				<SearchComponent
					data={zonas}
					type='zonas'
					onFilteredData={setFilteredZonas}
					resetSearch={resetZonaSearch}
					onResetComplete={() => setResetZonaSearch(false)}
				/>
			</div>
			{filteredZonas.map((item) => (
				<div className='col-md-4' key={item.zona.codigoZona}>
					<Card stretch>
						<CardHeader className='bg-transparent'>
							<CardLabel>
								<CardTitle tag='h4' className='h5'>
									{item.zona.codigoZona === editingZona?.zona.codigoZona ? (
										<input
											type='text'
											className='form-control'
											value={editingZona.zona.nome}
											onChange={(e) =>
												setEditingZona({
													...editingZona,
													zona: {
														...editingZona.zona,
														nome: e.target.value,
													},
												})
											}
										/>
									) : (
										item.zona.nome
									)}
								</CardTitle>
							</CardLabel>
							<CardActions>
								{funcionario?.codigoEmpresa === item.zona.codigoEmpresa && (
									<>
										{item.zona.codigoZona === editingZona?.zona.codigoZona ? (
											<>
												<Button
													icon='save'
													aria-label='Save'
													hoverShadow='default'
													color={darkModeStatus ? 'dark' : 'success'}
													onClick={() => handleSaveZona(editingZona)}
												/>
												<Button
													icon='cancel'
													aria-label='Cancel'
													hoverShadow='default'
													color='danger'
													onClick={() => setEditingZona(null)}
												/>
											</>
										) : (
											<Button
												icon='edit'
												aria-label='Edit'
												hoverShadow='default'
												color={darkModeStatus ? 'dark' : undefined}
												onClick={() => setEditingZona(item)}
											/>
										)}
									</>
								)}
								<Button
									icon='ArrowForwardIos'
									aria-label='Read More'
									hoverShadow='default'
									color={darkModeStatus ? 'dark' : undefined}
									onClick={() => handleSelecionarZona(item.zona.codigoZona)}
								/>
							</CardActions>
						</CardHeader>
					</Card>
				</div>
			))}
			{funcionario?.role === 'Fornecedor' && (
				<div className='col-md-4'>
					<Card stretch>
						<CardBody className='d-flex align-items-center justify-content-center'>
							{!cardNovaZona ? (
								<>
									<input
										type='text'
										className='form-control w-100 h-100'
										placeholder='Nome da Nova Zona'
										value={nomeZona}
										onChange={(e) => setNomeZona(e.target.value)}
									/>
									<div className='px-3'>
										<Button
											color='success'
											size='lg'
											isLight
											icon='AddTask'
											onClick={handleNovaZona}
										/>
									</div>
									<div className=''>
										<Button
											color='danger'
											size='lg'
											isLight
											icon='Cancel'
											onClick={() => setCardNovaZona(!cardNovaZona)}
										/>
									</div>
								</>
							) : (
								<Button
									color='info'
									size='lg'
									isLight
									className='w-100 h-100'
									icon='AddCircle'
									onClick={() => setCardNovaZona(!cardNovaZona)}>
									Adicionar Nova Zona
								</Button>
							)}
						</CardBody>
					</Card>
				</div>
			)}
		</>
	);

	return (
		<PageWrapper>
			<Head>
				<title>{demoPagesMenu.projectManagement.subMenu.list.text}</title>
			</Head>

			<Page>
				<div className='row'>{showZonas ? renderSeccoesZonas() : renderSeccoes()}</div>
			</Page>
			<OffCanvas
				setOpen={() => setOpenTrabalhos(!openTrabalhos)}
				isOpen={openTrabalhos}
				titleId='upcomingEdit'
				isBodyScroll
				placement='end'>
				<OffCanvasHeader setOpen={() => setOpenTrabalhos(!openTrabalhos)}>
					<OffCanvasTitle id='upcomingEdit'>Trabalhos</OffCanvasTitle>
				</OffCanvasHeader>
				<OffCanvasBody>
					<div className='row g-4'>
						<div className='col-12'>
							<SearchComponent
								data={trabalhos}
								type='trabalhos'
								onFilteredData={setFilteredTrabalhos}
								resetSearch={resetTrabalhoSearch}
								onResetComplete={() => setResetTrabalhoSearch(false)}
							/>
							{filteredTrabalhos.map((item) => (
								<div className='' key={item.trabalho.codigoTrabalho}>
									<Card stretch>
										<CardHeader className='bg-transparent'>
											<CardLabel>
												<CardTitle tag='h4' className='h5'>
													{item.trabalho.codigoTrabalho ===
													editingTrabalho?.trabalho.codigoTrabalho ? (
														<input
															type='text'
															className='form-control'
															value={editingTrabalho.trabalho.nome}
															onChange={(e) =>
																setEditingTrabalho({
																	...editingTrabalho,
																	trabalho: {
																		...editingTrabalho.trabalho,
																		nome: e.target.value,
																	},
																})
															}
														/>
													) : (
														item.trabalho.nome
													)}
												</CardTitle>
											</CardLabel>
											<CardActions>
												{funcionario?.role === 'Fornecedor' &&
													funcionario?.codigoEmpresa ===
														item.trabalho.codigoEmpresa && (
														<>
															{item.trabalho.codigoTrabalho ===
															editingTrabalho?.trabalho
																.codigoTrabalho ? (
																<>
																	<Button
																		icon='save'
																		aria-label='Save'
																		hoverShadow='default'
																		color='success'
																		onClick={() =>
																			handleSaveTrabalho(
																				editingTrabalho,
																			)
																		}
																	/>
																	<Button
																		icon='cancel'
																		aria-label='Cancel'
																		hoverShadow='default'
																		color='danger'
																		onClick={() =>
																			setEditingTrabalho(null)
																		}
																	/>
																</>
															) : (
																<Button
																	icon='edit'
																	aria-label='Edit'
																	hoverShadow='default'
																	color='info'
																	onClick={() =>
																		setEditingTrabalho(item)
																	}
																/>
															)}
														</>
													)}
											</CardActions>
										</CardHeader>
									</Card>
								</div>
							))}
							{funcionario?.role === 'Fornecedor' && (
								<Card>
									<CardBody className='d-flex align-items-center justify-content-center'>
										{cardNovoTrabalho ? (
											<>
												<input
													type='text'
													className='form-control w-100 h-100'
													placeholder='Nome do Trabalho'
													value={nomeTrabalho}
													onChange={(e) =>
														setNomeTrabalho(e.target.value)
													}
												/>
												<div className='px-3'>
													<Button
														color='success'
														size='lg'
														isLight
														icon='AddTask'
														onClick={() =>
															handleNovoTrabalho(codigoZona as number)
														}
													/>
												</div>
												<div className=''>
													<Button
														color='danger'
														size='lg'
														isLight
														icon='Cancel'
														onClick={() =>
															setCardNovoTrabalho(!cardNovoTrabalho)
														}
													/>
												</div>
											</>
										) : (
											<Button
												color='info'
												size='lg'
												isLight
												className='w-100 h-100'
												icon='AddCircle'
												onClick={() =>
													setCardNovoTrabalho(!cardNovoTrabalho)
												}>
												Adicionar Novo Trabalho
											</Button>
										)}
									</CardBody>
								</Card>
							)}
						</div>
					</div>
				</OffCanvasBody>
			</OffCanvas>
		</PageWrapper>
	);
};

export default Index;
