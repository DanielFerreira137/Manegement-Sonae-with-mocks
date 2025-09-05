import React, { FC, useEffect, useState } from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { FormikHelpers, useFormik } from 'formik';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Button from '../../../components/bootstrap/Button';
import { priceFormat } from '../../../helpers/helpers';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../components/bootstrap/Dropdown';
import Icon from '../../../components/icon/Icon';
import OffCanvas, {
	OffCanvasBody,
	OffCanvasHeader,
	OffCanvasTitle,
} from '../../../components/bootstrap/OffCanvas';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Textarea from '../../../components/bootstrap/forms/Textarea';
import Checks from '../../../components/bootstrap/forms/Checks';
import Popovers from '../../../components/bootstrap/Popovers';
import data from '../../../common/data/dummyEventsData';
import USERS from '../../../common/data/userDummyData';
import EVENT_STATUS, { IEventStatus } from '../../../common/data/enumEventStatus';
import Avatar from '../../../components/Avatar';
import PaginationButtons, {
	dataPagination,
	PER_COUNT,
} from '../../../components/PaginationButtons';
import useSortableData from '../../../hooks/useSortableData';
import useDarkMode from '../../../hooks/useDarkMode';
import NovoTrabalho from './novoTrabalho';
import Logs from './Logs';
import { TColor } from '../../../type/color-type';
import { func } from 'prop-types';
import {
	putUpdateProjetoSeccaoZonaTrabalho,
	putUpdateProjetoSendEmail,
	postSendUpdateEmail,
} from '../../../api/routes';
import { Calendar as DatePicker } from 'react-date-range';

import { addDays, set } from 'date-fns';

import pt from 'date-fns/locale/pt';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
interface ICommonUpcomingEventsProps {
	isFluid?: boolean;
	projeto: ProjetosSeccaoZonaTrabalho | null;
	codigoProjeto: string;
	setRefresh: (refresh: boolean) => void;
	funcionario: UserApp;
	nomeProjeto: string;
	projetoCompleto: Projeto | null;
	sendEmail: boolean;
}
const CommonUpcomingEvents: FC<ICommonUpcomingEventsProps> = ({
	isFluid,
	projeto,
	codigoProjeto,
	setRefresh,
	funcionario,
	nomeProjeto,
	projetoCompleto,
	sendEmail,
}) => {
	const { themeStatus, darkModeStatus } = useDarkMode();

	// BEGIN :: Upcoming Events
	const [upcomingEventsInfoOffcanvas, setUpcomingEventsInfoOffcanvas] = useState(false);
	const handleUpcomingDetails = () => {
		setUpcomingEventsInfoOffcanvas(!upcomingEventsInfoOffcanvas);
	};
	const [comentariosTrabalhos, setComentariosTrabalhos] = useState<string>('');
	const [upcomingEventsEditOffcanvas, setUpcomingEventsEditOffcanvas] = useState(false);
	const handleUpcomingEdit = () => {
		setUpcomingEventsEditOffcanvas(!upcomingEventsEditOffcanvas);
	};
	const [selectedTrabalho, setSelectedTrabalho] = useState<Trabalhos | null>(null);
	// END :: Upcoming Events

	const formik = useFormik({
		onSubmit<Values>(
			values: Values,
			formikHelpers: FormikHelpers<Values>,
		): void | Promise<any> {
			return undefined;
		},
		initialValues: {
			customerName: 'Alison Berry',
			service: 'Exercise Bike',
			employee: `${USERS.GRACE.name} ${USERS.GRACE.surname}`,
			location: 'Maryland',
			date: dayjs().add(1, 'days').format('YYYY-MM-DD'),
			time: '10:30',
			note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ut nisi odio. Nam sit amet pharetra enim. Nulla facilisi. Nunc dictum felis id massa mattis pretium. Mauris at blandit orci. Nunc vulputate vulputate turpis vitae cursus. In sit amet turpis tincidunt, interdum ex vitae, sollicitudin massa. Maecenas eget dui molestie, ullamcorper ante vel, tincidunt nisi. Donec vitae pulvinar risus. In ultricies nisl ac massa malesuada, vel tempus neque placerat.',
			notify: true,
		},
	});

	const [currentPage, setCurrentPage] = useState(1);

	const [perPage, setPerPage] = useState(PER_COUNT['5']);
	const { items, requestSort, getClassNamesFor } = useSortableData(data);
	const [dataPrevista, setDataPrevista] = useState<{ [key: string]: string }>({});
	const [dataIntervencao, setDataIntervencao] = useState<{ [key: string]: string }>({});

	const handleInputChangeDataFase = (e: React.ChangeEvent<HTMLInputElement>) => {
		const codigo = e.target.id; // ID único do trabalho
		const value = e.target.value; // Novo valor da data
		setDataPrevista((prevData) => ({
			...prevData,
			[codigo]: value, // Atualiza a data para o trabalho específico
		}));
		putUpdateProjetoSeccaoZonaTrabalho({
			data: {
				codigoProjetoSeccoesZonaTrabalho: Number(codigo),
				dataPrevista: value,
			},
		})
			.then((res) => {
				console.log(res);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const handleInputChangeDataFase2 = (codigo: string, value: string) => {
		console.log(codigo, value);
		setDataIntervencao((prevData) => ({
			...prevData,
			[codigo]: value, // Atualiza a data para o trabalho específico
		}));
		putUpdateProjetoSeccaoZonaTrabalho({
			data: {
				codigoProjetoSeccoesZonaTrabalho: Number(codigo),
				dataIntervencao: value,
			},
		})
			.then((res) => {
				console.log(res);
			})
			.catch((err) => {
				console.log(err);
			});
	};
	const formatDate = (dateString: string) => {
		if (!dateString) return '';
		const date = new Date(dateString);
		return date.toLocaleDateString('pt-PT', {
			day: '2-digit',
			month: 'long',
			year: 'numeric',
		});
	};
	const [hoveredEmpresaSecao, setHoveredEmpresaSecao] = useState({
		empresa: null,
		secao: null,
		zona: null,
	});

	const handleMouseEnter = (empresa: any, secao: any, zona: any) => {
		setHoveredEmpresaSecao({ empresa, secao, zona });
	};

	const handleMouseLeave = () => {
		setHoveredEmpresaSecao({ empresa: null, secao: null, zona: null });
	};

	const [canvasStatus, setCanvasStatus] = useState<boolean>(false);
	const [email, setEmail] = useState<{ seccao: Seccao; trabalho: Trabalhos; Status: string }[]>(
		[],
	);
	const [comentariosEmail, setComentariosEmail] = useState<string>('');
	const handleStatusChange = (seccao: Seccao, trabalho: Trabalhos, status: string) => {
		console.log(trabalho, status);
		// Atualizar o status do trabalho no backend
		const data: any = {
			codigoProjetoSeccoesZonaTrabalho:
				trabalho.detalhes.projetoSeccaoZonaTrabalho.codigoProjetoSeccoesZonaTrabalho,
			status: status,
		};
		console.log(data);
		putUpdateProjetoSeccaoZonaTrabalho({
			data,
		})
			.then((res) => {
				console.log(res);
				setRefresh(true);
			})
			.catch((err) => {
				console.log(err);
			});

		// Verificar se o trabalho já existe no estado 'email'
		setEmail((prevEmail) => {
			// Procurar pelo trabalho no array
			const existingWorkIndex = prevEmail.findIndex(
				(entry) => entry.seccao.codigoSeccao == seccao.codigoSeccao,
			);

			if (existingWorkIndex !== -1) {
				// Se o trabalho já existe, atualizamos o status
				const updatedEmail = [...prevEmail];
				updatedEmail[existingWorkIndex] = {
					seccao,
					trabalho,
					Status: status,
				};
				return updatedEmail;
			} else {
				// Se o trabalho não existe, adicionamos um novo item ao array
				return [...prevEmail, { seccao, trabalho, Status: status }];
			}
		});
	};

	const handleNotify = () => {
		// Gerar a string para cada trabalho no estado email
		const notificationStrings = email.map((entry) => {
			const { seccao, trabalho, Status } = entry;
			const trabalhoNome = seccao.codigoSeccao;

			const empresaNome = trabalho.detalhes.empresa.nome;

			// Gerar a string formatada
			return `Houve uma alteração referente ao Projeto ${nomeProjeto} na secção ${entry.seccao.nome} do Fornecedor ${empresaNome} `;
		});

		// Juntar todas as strings em uma só (se precisar de uma string única)
		const emailContent = notificationStrings.join('\n');
		const emailContentWithComments = [...notificationStrings, comentariosEmail].join('\n');
		// Mostrar as strings no console ou preparar para enviar por email
		console.log(emailContentWithComments);
		console.log(comentariosTrabalhos);
		const comentariosArray = comentariosTrabalhos.split('-');
		comentariosArray.forEach((comentario) => {
			postSendUpdateEmail({
				codigoProjetoSeccoesZonaTrabalho: Number(comentario),
				codigoProjeto: Number(codigoProjeto),
				bodyEmail: emailContentWithComments,
			})
				.then((res) => {
					console.log(res);
					toast.success('Notificação enviada com sucesso!');
				})
				.catch((err) => {
					console.log(err);
				});
		});

		// Enviar email ou fazer qualquer outra coisa com o conteúdo
		// EnviarEmail(emailContent);
	};

	useEffect(() => {
		// Only run if projeto exists
		if (!projeto) return;
		setNoti(sendEmail);
		const initialDatas: { [key: number]: string } = {};
		const initialDatasIntervencao: { [key: number]: string } = {};
		projeto.empresas.forEach((empresa) =>
			empresa.seccoes.forEach((seccao) =>
				seccao.zonas.forEach((zona) =>
					zona.trabalhos.forEach((trabalho) => {
						const codigo =
							trabalho.detalhes.projetoSeccaoZonaTrabalho
								.codigoProjetoSeccoesZonaTrabalho;

						if (!dataPrevista[codigo]) {
							console.log(trabalho.detalhes.projetoSeccaoZonaTrabalho.dataPrevista);
							initialDatas[codigo] =
								trabalho.detalhes.projetoSeccaoZonaTrabalho.dataPrevista || '';
						}
						if (!dataIntervencao) {
							initialDatasIntervencao[codigo] =
								trabalho.detalhes.projetoSeccaoZonaTrabalho.dataIntervencao || '';
						}
					}),
				),
			),
		);

		// Only update state if we have new values to add
		if (Object.keys(initialDatas).length > 0) {
			setDataPrevista((prevData) => ({
				...prevData,
				...initialDatas,
			}));
		}
	}, [projeto]);
	const formatDateForInput = (isoString: string) => {
		if (!isoString) return '';

		// Criar objeto Date a partir da string ISO
		const date = new Date(isoString);

		// Formatar para YYYY-MM-DDThh:mm
		return date.toISOString().slice(0, 16);
	};
	const [noti, setNoti] = useState(false);

	const handleDecNotify = () => {
		const data = {
			codigoProjeto: Number(projetoCompleto?.codigoProjeto),
		};
		putUpdateProjetoSendEmail(data)
			.then((res) => {
				console.log(res);
			})
			.catch((err) => {
				console.log(err);
			});
		setNoti(!noti);
	};
	return (
		<>
			<Card stretch={isFluid}>
				<CardHeader borderSize={1}>
					<CardLabel icon='Alarm' iconColor='info'>
						<CardTitle>Trabalhos referentes a {nomeProjeto}</CardTitle>
					</CardLabel>
					<CardActions className='d-flex justify-content-between align-items-center'>
						{funcionario?.role === 'Dec' ||
							(funcionario?.responsavelEmpresa && (
								<Checks
									id='notify'
									label='Receber notificações'
									type='switch'
									checked={noti}
									onChange={handleDecNotify}
								/>
							))}
						<Button
							color='info'
							icon='Notifications'
							isLight
							tag='a'
							target='_blank'
							onClick={handleNotify}>
							{funcionario?.role === 'Dec' && 'Notificar Fiscais e Fornecedores'}
							{funcionario?.role === 'Fornecedor' && 'Notificar Fiscais e Dec'}
							{funcionario?.role === 'Fiscal' && 'Notificar Fornecedores e Dec'}
						</Button>
					</CardActions>
				</CardHeader>
				<CardBody className='table-responsive' isScrollable={isFluid}>
					<div className='table-container' style={{ height: '90%' }}>
						<table
							className='table table-modern'
							style={{
								border: '1px solid black',
								borderCollapse: 'collapse',
								
							}}
							cellSpacing="0"
							cellPadding="0">
							<thead className='sticky-header'>
								<tr>
									{/* Cabeçalho principal com duas linhas */}
									<th rowSpan={2} style={{ border: '1px solid #d3d3d3' }}></th>
									<th rowSpan={2} style={{ border: '1px solid #d3d3d3' }}>
										Secções <br /> Zonas
									</th>
									<th rowSpan={2} style={{ border: '1px solid #d3d3d3' }}>
										Trabalhos
									</th>

									{/* Fornecedor */}
									<th
										colSpan={3}
										className='text-center'
										style={{
											backgroundColor: 'rgba(255, 218, 185, 0.6)',
											border: '1px solid #d3d3d3',
										}}>
										Fornecedor
									</th>

									{/* Fiscal */}
									<th
										colSpan={2}
										className='text-center'
										style={{
											backgroundColor: 'rgba(173, 216, 230, 0.6)',
											border: '1px solid #d3d3d3',
										}}>
										Fiscal
									</th>

									{/* DEC */}
									<th
										colSpan={2}
										className='text-center'
										style={{
											backgroundColor: 'rgba(144, 238, 144, 0.6)',
											border: '1px solid #d3d3d3',
										}}>
										Dec
									</th>
								</tr>
								<tr>
									{/* Cabeçalhos das colunas secundárias */}
									<th
										className='text-center'
										style={{
											backgroundColor: 'rgba(255, 218, 185, 0.6)',
											border: '1px solid #d3d3d3',
										}}>
										Status
									</th>
									<th
										className='text-center'
										style={{
											backgroundColor: 'rgba(255, 218, 185, 0.6)',
											border: '1px solid #d3d3d3',
										}}>
										Observações
									</th>
									<th
										className='text-center'
										style={{
											backgroundColor: 'rgba(255, 218, 185, 0.6)',
											border: '1px solid #d3d3d3',
										}}>
										Data de Intervenção
									</th>

									{/* Fiscal */}
									<th
										className='text-center'
										style={{
											backgroundColor: 'rgba(173, 216, 230, 0.6)',
											border: '1px solid #d3d3d3',
										}}>
										Data prevista
									</th>
									<th
										className='text-center'
										style={{
											backgroundColor: 'rgba(173, 216, 230, 0.6)',
											border: '1px solid #d3d3d3',
										}}>
										Observações
									</th>

									{/* DEC */}
									<th
										className='text-center'
										style={{
											backgroundColor: 'rgba(144, 238, 144, 0.6)',
											border: '1px solid #d3d3d3',
										}}>
										Observações
									</th>
								</tr>
							</thead>

							<tbody>
								{projeto?.empresas.map(
									(empresa: EmpresasSeccoes, empresaIndex: number) => {
										const trabalhosPorCodigo: Record<string, number> = {};

										empresa.seccoes.forEach((seccao) =>
											seccao.zonas.forEach((zona) =>
												zona.trabalhos.forEach((trabalho: Trabalhos) => {
													const codigo = empresa.empresa.nome;
													if (!trabalhosPorCodigo[codigo]) {
														trabalhosPorCodigo[codigo] = 0;
													}
													trabalhosPorCodigo[codigo] += 1;
												}),
											),
										);

										const renderizados: Record<string, boolean> = {};

										return empresa.seccoes.map((seccao, seccaoIndex) =>
											seccao.zonas.map((zona, zonaIndex) => {
												// Check if this is the last zone of the section
												const isLastZoneOfSection =
													zonaIndex === seccao.zonas.length - 1;

												return zona.trabalhos.map(
													(
														trabalho: Trabalhos,
														trabalhoIndex: number,
													) => {
														const nomeEmpresa = empresa.empresa.nome;
														const nomeSecao = seccao.seccao.nome;
														const nomeZona = zona.zona.nome;

														// Check if this is the last work item of the zone
														const isLastWorkOfZone =
															trabalhoIndex ===
															zona.trabalhos.length - 1;

														const isHovered =
															hoveredEmpresaSecao.empresa ===
																nomeEmpresa &&
															hoveredEmpresaSecao.secao ===
																nomeSecao &&
															hoveredEmpresaSecao.zona === nomeZona;

														// Status do trabalho
														let status = {
															name: 'Sem Status',
															color: 'gray',
														}; // Status padrão
														let dataStatus = trabalho.detalhes
															.projetoSeccaoZonaTrabalho
															.dataAlteracaoStatus
															? new Date(
																	trabalho.detalhes.projetoSeccaoZonaTrabalho.dataAlteracaoStatus,
																).toLocaleString('pt-PT', {
																	day: '2-digit',
																	month: 'long',
																	year: 'numeric',
																	hour: '2-digit',
																	minute: '2-digit',
																})
															: '';

														let dataPrevistaString = trabalho.detalhes
															.projetoSeccaoZonaTrabalho
															.dataAlteracaoDataPrevista
															? new Date(
																	trabalho.detalhes.projetoSeccaoZonaTrabalho.dataAlteracaoDataPrevista,
																).toLocaleString('pt-PT', {
																	day: '2-digit',
																	month: 'long',
																	year: 'numeric',
																	hour: '2-digit',
																	minute: '2-digit',
																})
															: '';
														console.log(dataPrevistaString);

														if (
															trabalho.detalhes
																.projetoSeccaoZonaTrabalho
																.status === 'Em Curso'
														) {
															status = EVENT_STATUS.EmAndamento;
														} else if (
															trabalho.detalhes
																.projetoSeccaoZonaTrabalho
																.status === 'Concluído'
														) {
															status = EVENT_STATUS.Concluido;
														} else if (
															trabalho.detalhes
																.projetoSeccaoZonaTrabalho
																.status === 'Pendente'
														) {
															status = EVENT_STATUS.Pendente;
														}

														// Calculate border style based on position
														const borderBottomStyle = isLastWorkOfZone
															? '3px solid #a0a0a0' // Thick border for last work item of last zone in section
															: '1px solid #d3d3d3'; // Normal border for other items

														return (
															<tr
																key={
																	trabalho.trabalho.codigoTrabalho
																}
																className={`table-row ${isHovered ? 'hovered' : ''}`}
																onMouseEnter={() =>
																	handleMouseEnter(
																		nomeEmpresa,
																		nomeSecao,
																		nomeZona,
																	)
																}
																onMouseLeave={handleMouseLeave}>
																{/* Primeira ocorrência do código, aplicando o rowSpan */}
																{!renderizados[nomeEmpresa] && (
																	<td
																		rowSpan={
																			trabalhosPorCodigo[
																				nomeEmpresa
																			]
																		}
																		style={{
																			borderRight:
																				'1px solid #a0a0a0',
																			borderLeft:
																				'1px solid #a0a0a0',

																			borderBottom:
																				'3px solid #a0a0a0',
																			backgroundColor:
																				hoveredEmpresaSecao.empresa ===
																				nomeEmpresa
																					? '#f2f2f2'
																					: 'transparent',
																		}}>
																		<div
																			style={{
																				display: 'flex',
																				alignItems:
																					'center',
																				justifyContent:
																					'center',
																				transform:
																					'rotate(-90deg)',
																				transformOrigin:
																					'center',
																				height: '100px',
																			}}>
																			<b>{nomeEmpresa}</b>
																		</div>
																	</td>
																)}

																{/* Marca o código como renderizado para não exibi-lo novamente */}
																{(renderizados[nomeEmpresa] = true)}

																{/* Exibe a secção e a zona apenas na primeira linha de cada zona */}
																{trabalhoIndex === 0 && (
																	<td
																		rowSpan={
																			zona.trabalhos.length
																		}
																		style={{
																			backgroundColor:
																				isHovered
																					? '#f2f2f2'
																					: 'rgba(255, 218, 185, 0)',
																			borderRight:
																				'1px solid #a0a0a0',
																			borderBottom:
																				'3px solid #a0a0a0',
																		}}>
																		<b>{seccao.seccao.nome}</b>{' '}
																		<br />
																		{zona.zona.nome}
																	</td>
																)}

																{/* Columns with consistent bottom border */}
																<td
																	className='bg-gray-100'
																	style={{
																		backgroundColor:
																			'rgba(255, 218, 185, 0)',
																		border: '1px solid #d3d3d3',
																		borderBottom:
																			borderBottomStyle,
																	}}>
																	{trabalho.trabalho.nome}
																</td>

																<td
																	className='text-center'
																	style={{
																		backgroundColor:
																			'rgba(255, 218, 185, 0.2)',
																		border: '1px solid #d3d3d3',
																		borderBottom:
																			borderBottomStyle,
																	}}>
																	{funcionario?.role ===
																	'Fornecedor' ? (
																		<>
																			<Dropdown>
																				<DropdownToggle
																					hasIcon={false}>
																					<Button
																						isLink
																						color={
																							status.color as TColor
																						}
																						icon='Circle'
																						className='text-nowrap'>
																						{
																							status.name
																						}
																					</Button>
																				</DropdownToggle>

																				<DropdownMenu>
																					{Object.keys(
																						EVENT_STATUS,
																					).map((key) => (
																						<DropdownItem
																							key={
																								key
																							}
																							onClick={() => {
																								handleStatusChange(
																									seccao.seccao,
																									trabalho,
																									EVENT_STATUS[
																										key
																									]
																										.name as string,
																								);
																							}}>
																							<div>
																								<Icon
																									icon='Circle'
																									color={
																										EVENT_STATUS[
																											key
																										]
																											.color
																									}
																								/>
																								{
																									EVENT_STATUS[
																										key
																									]
																										.name
																								}
																							</div>
																						</DropdownItem>
																					))}
																				</DropdownMenu>
																			</Dropdown>
																			{dataStatus}
																		</>
																	) : (
																		<Button
																			isLink
																			color={
																				status.color as TColor
																			}
																			icon='Circle'
																			className='text-nowrap'>
																			{status.name}
																		</Button>
																	)}
																</td>

																<td
																	onClick={() => {
																		setCanvasStatus(true);
																		setSelectedTrabalho(
																			trabalho,
																		);
																	}}
																	className='text-center'
																	style={{
																		backgroundColor:
																			'rgba(255, 218, 185, 0.2)',
																		border: '1px solid #d3d3d3',
																		borderBottom:
																			borderBottomStyle,
																	}}>
																	{trabalho.logs.trabalhoLog
																		?.comentario || ''}
																</td>

																<td
																	className='text-center'
																	style={{
																		backgroundColor:
																			'rgba(255, 218, 185, 0.2)',
																		border: '1px solid #d3d3d3',
																		borderBottom:
																			borderBottomStyle,
																	}}>
																	{funcionario?.role ===
																	'Fornecedor' ? (
																		<FormGroup
																			key={
																				trabalho.detalhes
																					.projetoSeccaoZonaTrabalho
																					.codigoProjetoSeccoesZonaTrabalho
																			}>
																			<div className='d-flex align-items-center justify-content-center'>
																				<input
																					type='text'
																					id={`${trabalho.detalhes.projetoSeccaoZonaTrabalho.codigoProjetoSeccoesZonaTrabalho}`}
																					className='form-control flex-1'
																					placeholder='Data de Intervenção'
																					value={
																						dataIntervencao[
																							trabalho
																								.detalhes
																								.projetoSeccaoZonaTrabalho
																								.codigoProjetoSeccoesZonaTrabalho
																						] ===
																						undefined
																							? trabalho
																									.detalhes
																									.projetoSeccaoZonaTrabalho
																									.dataIntervencao ||
																								''
																							: dataIntervencao[
																									trabalho
																										.detalhes
																										.projetoSeccaoZonaTrabalho
																										.codigoProjetoSeccoesZonaTrabalho
																								]
																					}
																					onChange={(e) =>
																						setDataIntervencao(
																							(
																								prevData,
																							) => ({
																								...prevData,
																								[trabalho
																									.detalhes
																									.projetoSeccaoZonaTrabalho
																									.codigoProjetoSeccoesZonaTrabalho]:
																									e
																										.target
																										.value,
																							}),
																						)
																					}
																				/>
																				<div className='px-3'>
																					<Button
																						color='success'
																						size='lg'
																						isLight
																						icon='AddTask'
																						onClick={() => {
																							handleInputChangeDataFase2(
																								trabalho.detalhes.projetoSeccaoZonaTrabalho.codigoProjetoSeccoesZonaTrabalho.toString(),
																								dataIntervencao[
																									trabalho
																										.detalhes
																										.projetoSeccaoZonaTrabalho
																										.codigoProjetoSeccoesZonaTrabalho
																								] ||
																									'',
																							);
																						}}
																					/>
																				</div>
																			</div>
																		</FormGroup>
																	) : (
																		trabalho.detalhes
																			.projetoSeccaoZonaTrabalho
																			.dataIntervencao
																	)}
																</td>

																<td
																	className='text-center'
																	style={{
																		backgroundColor:
																			'rgba(173, 216, 230, 0.2)',
																		border: '1px solid #d3d3d3',
																		borderBottom:
																			borderBottomStyle,
																	}}>
																	{funcionario?.role ===
																	'Fiscal' ? (
																		<FormGroup
																			key={
																				trabalho.detalhes
																					.projetoSeccaoZonaTrabalho
																					.codigoProjetoSeccoesZonaTrabalho
																			}>
																			<Input
																				type='datetime-local'
																				id={`${trabalho.detalhes.projetoSeccaoZonaTrabalho.codigoProjetoSeccoesZonaTrabalho}`}
																				value={formatDateForInput(
																					dataPrevista[
																						trabalho
																							.detalhes
																							.projetoSeccaoZonaTrabalho
																							.codigoProjetoSeccoesZonaTrabalho
																					] ||
																						trabalho
																							.detalhes
																							.projetoSeccaoZonaTrabalho
																							.dataPrevista ||
																						'',
																				)}
																				onChange={(
																					e: React.ChangeEvent<HTMLInputElement>,
																				) =>
																					handleInputChangeDataFase(
																						e,
																					)
																				}
																			/>
																			<span>
																				{dataPrevistaString}
																			</span>
																		</FormGroup>
																	) : (
																		formatDate(
																			trabalho.detalhes
																				.projetoSeccaoZonaTrabalho
																				.dataPrevista || '',
																		)
																	)}
																</td>

																<td
																	className='text-center'
																	onClick={() => {
																		setCanvasStatus(true);
																		setSelectedTrabalho(
																			trabalho,
																		);
																	}}
																	style={{
																		backgroundColor:
																			'rgba(173, 216, 230, 0.2)',
																		border: '1px solid #d3d3d3',
																		borderBottom:
																			borderBottomStyle,
																	}}>
																	{trabalho.logs.fiscalizacaoLog
																		?.comentario || ''}
																</td>

																<td
																	className='text-center'
																	onClick={() => {
																		setCanvasStatus(true);
																		setSelectedTrabalho(
																			trabalho,
																		);
																	}}
																	style={{
																		backgroundColor:
																			'rgba(144, 238, 144, 0.2)',
																		border: '1px solid #d3d3d3',
																		borderBottom:
																			borderBottomStyle,
																	}}>
																	{trabalho.logs.decLog
																		?.comentario || ''}
																</td>
															</tr>
														);
													},
												);
											}),
										);
									},
								)}
							</tbody>
						</table>
					</div>
					<br />
					{funcionario?.role === 'Fornecedor' && (
						<Button
							color='info'
							size='lg'
							isLight
							className='w-30'
							style={{ display: 'block', margin: '0 auto' }}
							icon='AddCircle'
							onClick={() => {
								setUpcomingEventsEditOffcanvas(true);
							}}>
							Adicionar Novo Trabalho
						</Button>
					)}
	<style>
	{`
		.table-row:hover {
			background-color: #f2f2f2; /* Cor de fundo ao passar o mouse */
		}
		.table-container {
			max-height: 80vh;
			overflow-y: auto;
			overflow-x: hidden;
			position: relative;
			width: 100%;
		}
		.header-row th {
			border: 1px solid #d3d3d3 !important;
		}
		.table-container::after {
			content: '';
			position: absolute;
			top: 79px; /* Ajuste conforme necessário para cobrir exatamente após o header */
			left: 0;
			right: 0;
			height: 2px;
			background-color: #d3d3d3;
			z-index: 9;
		}
		
		/* Garantir que todas as bordas horizontais sejam visíveis */
		.table-modern tbody tr td {
			border-bottom: 1px solid #d3d3d3 !important;
		}
		
		/* Reforçar a borda entre as duas linhas do cabeçalho */
		.sticky-header tr:first-child th {
			border-bottom: 1px solid #d3d3d3 !important;
		}
		.sticky-header {
			position: sticky;
			top: 0;
			z-index: 10;
			box-shadow: 0 1px 0 0 #d3d3d3;
		}
		.sticky-header th {
			background-color: white !important;
			box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.3);
			border-bottom: 2px solid #d3d3d3 !important;
			position: relative;
			z-index: 10;
		}
		/* Preservar as cores específicas de cada coluna no cabeçalho */
		.sticky-header th[style*="background-color: rgba(255, 218, 185, 0.6)"] {
			background-color: rgba(255, 218, 185, 1) !important;
			box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.3);
			border-bottom: 2px solid #d3d3d3 !important;
		}
		.sticky-header th[style*="background-color: rgba(173, 216, 230, 0.6)"] {
			background-color: rgba(173, 216, 230, 1) !important;
			box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.3);
			border-bottom: 2px solid #d3d3d3 !important;
		}
		.sticky-header th[style*="background-color: rgba(144, 238, 144, 0.6)"] {
			background-color: rgba(144, 238, 144, 1) !important;
			box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.3);
			border-bottom: 2px solid #d3d3d3 !important;
		}
		`}
	</style>
				</CardBody>
			</Card>

			<NovoTrabalho
				setUpcomingEventsEditOffcanvas={setUpcomingEventsEditOffcanvas}
				upcomingEventsEditOffcanvas={upcomingEventsEditOffcanvas}
				codigoProjeto={codigoProjeto}
				setRefresh={setRefresh}
			/>
			<Logs
				setCanvasStatus={setCanvasStatus}
				canvasStatus={canvasStatus}
				trabalho={selectedTrabalho || null}
				setRefresh={setRefresh}
				setComentariosEmail={setComentariosEmail}
				comentariosEmail={comentariosEmail}
				nomeProjeto={nomeProjeto}
				comentariosTrabalhos={comentariosTrabalhos}
				setComentariosTrabalhos={setComentariosTrabalhos}
			/>
		</>
	);
};

export default CommonUpcomingEvents;
