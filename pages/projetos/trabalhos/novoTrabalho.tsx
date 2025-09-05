import React, { FC, useEffect, useState } from 'react';

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
import Collapse from '../../../components/bootstrap/Collapse';
import {
	getAllSeccoesZonas,
	getUserInfo,
	postCreateProjetoSeccaoZonaTrabalho,
} from '../../../api/routes';

interface SeccaoData {
	codigoSeccao: string;
	nomeSeccao: string;
	zonas: ZonaData[];
}

interface ZonaData {
	codigoZona: string;
	nomeZona: string;
	trabalhos: TrabalhoData[];
}

interface TrabalhoData {
	codigoTrabalho: string;
	nomeTrabalho: string;
}

interface ICommonUpcomingEventsProps {
	setUpcomingEventsEditOffcanvas: (isOpen: boolean) => void;
	upcomingEventsEditOffcanvas: boolean;
	codigoProjeto: string;
	setRefresh: (refresh: boolean) => void;
}

const NovoTrabalho: FC<ICommonUpcomingEventsProps> = ({
	setUpcomingEventsEditOffcanvas,
	upcomingEventsEditOffcanvas,
	codigoProjeto,
	setRefresh,
}) => {
	const [seccoes, setSeccoes] = useState<SeccaoData[]>([]);
	const [activeSeccao, setActiveSeccao] = useState<number | null>(null); // Índice da seção ativa
	const [activeZona, setActiveZona] = useState<number | null>(null); // Índice da zona ativa
	const [selectedTrabalhos, setSelectedTrabalhos] = useState<
		Array<{ codigoSeccao: string; codigoZona: string; codigoTrabalho: string }>
	>([]); // Estado para guardar seleção (seção, zona e trabalho)
	const [codigoEmpresa, setCodigoEmpresa] = useState<number | null>(null);
	useEffect(() => {
		const fetchData = async () => {
			const [seccoesData, userInfo] = await Promise.all([
				getAllSeccoesZonas(),
				getUserInfo(),
			]);
			setSeccoes(seccoesData);
			setCodigoEmpresa(userInfo.codigoEmpresa);
			console.log(seccoesData);
		};
		fetchData();
	}, []);

	const toggleSeccao = (index: number) => {
		setActiveSeccao(activeSeccao === index ? null : index);
		setActiveZona(null); // Reseta zona ativa ao abrir/fechar uma seção
	};

	const toggleZona = (index: number) => {
		setActiveZona(activeZona === index ? null : index);
	};

	const handleTrabalhoSelection = (
		codigoSeccao: string,
		codigoZona: string,
		codigoTrabalho: string,
	) => {
		setSelectedTrabalhos((prevState) => {
			const isAlreadySelected = prevState.some(
				(item) =>
					item.codigoSeccao === codigoSeccao &&
					item.codigoZona === codigoZona &&
					item.codigoTrabalho === codigoTrabalho,
			);

			if (isAlreadySelected) {
				// Remove trabalho se já estiver selecionado
				return prevState.filter(
					(item) =>
						!(
							item.codigoSeccao === codigoSeccao &&
							item.codigoZona === codigoZona &&
							item.codigoTrabalho === codigoTrabalho
						),
				);
			} else {
				// Adiciona novo trabalho
				return [...prevState, { codigoSeccao, codigoZona, codigoTrabalho }];
			}
		});
	};
	const handleSaveSelectedTrabalhos = (
		selectedTrabalhos: Array<{
			codigoSeccao: string;
			codigoZona: string;
			codigoTrabalho: string;
		}>,
	) => {
		console.log(selectedTrabalhos);
		selectedTrabalhos.forEach((trabalho) => {
			const data = {
				codigoProjeto: Number(codigoProjeto),
				codigoSeccao: Number(trabalho.codigoSeccao),
				codigoZona: Number(trabalho.codigoZona),
				codigoTrabalho: Number(trabalho.codigoTrabalho),
				codigoEmpresa: Number(codigoEmpresa),
				dataIntervencao: null,
			};
			console.log("aaaaaaaaaaaaaaaaaaaaa");
			console.log(data);
			postCreateProjetoSeccaoZonaTrabalho({
				codigoProjeto: Number(codigoProjeto),
				codigoSeccao: Number(trabalho.codigoSeccao),
				codigoZona: Number(trabalho.codigoZona),
				codigoTrabalho: Number(trabalho.codigoTrabalho),
				codigoEmpresa: Number(codigoEmpresa),
				dataIntervencao: '',
			});
		});
		setRefresh(true);
	};
	return (
		<>
			<OffCanvas
				setOpen={setUpcomingEventsEditOffcanvas}
				isOpen={upcomingEventsEditOffcanvas}
				titleId='upcomingEdit'
				isBodyScroll
				placement='end'>
				<OffCanvasHeader setOpen={setUpcomingEventsEditOffcanvas}>
					<OffCanvasTitle id='upcomingEdit'>Gerenciar Trabalhos</OffCanvasTitle>
				</OffCanvasHeader>
				<OffCanvasBody>
					<div className='row'>
						<div className='col-12'>
							{seccoes.map((seccao, seccaoIndex) => (
								<Card
									key={seccao.codigoSeccao}
									isCompact
									borderSize={2}
									shadow='none'
									className='mb-3'>
									<CardHeader
										onClick={() => toggleSeccao(seccaoIndex)}
										className='cursor-pointer'>
										<CardLabel>
											<CardTitle>{seccao.nomeSeccao}</CardTitle>
										</CardLabel>
									</CardHeader>
									<CardBody>
										<Collapse isOpen={activeSeccao === seccaoIndex}>
											{seccao.zonas.map((zona, zonaIndex) => (
												<Card
													key={zona.codigoZona}
													isCompact
													borderSize={2}
													shadow='none'
													className='mb-3'>
													<CardHeader
														onClick={() => toggleZona(zonaIndex)}
														className='cursor-pointer'>
														<CardLabel>
															<CardTitle>{zona.nomeZona}</CardTitle>
														</CardLabel>
													</CardHeader>
													<CardBody>
														<Collapse isOpen={activeZona === zonaIndex}>
															<div className='row'>
																{zona.trabalhos.map((trabalho) => (
																	<div
																		key={
																			trabalho.codigoTrabalho
																		}
																		className='col-12 form-check mb-2'>
																		<input
																			type='checkbox'
																			className='form-check-input'
																			id={`trabalho-${trabalho.codigoTrabalho}`}
																			checked={selectedTrabalhos.some(
																				(item) =>
																					item.codigoSeccao ===
																						String(
																							seccao.codigoSeccao,
																						) &&
																					item.codigoZona ===
																						String(
																							zona.codigoZona,
																						) &&
																					item.codigoTrabalho ===
																						String(
																							trabalho.codigoTrabalho,
																						),
																			)}
																			onChange={() =>
																				handleTrabalhoSelection(
																					String(
																						seccao.codigoSeccao,
																					),
																					String(
																						zona.codigoZona,
																					),
																					String(
																						trabalho.codigoTrabalho,
																					),
																				)
																			}
																		/>
																		<label
																			className='form-check-label ms-2'
																			htmlFor={`trabalho-${trabalho.codigoTrabalho}`}>
																			{trabalho.nomeTrabalho}
																		</label>
																	</div>
																))}
															</div>
														</Collapse>
													</CardBody>
												</Card>
											))}
										</Collapse>
									</CardBody>
								</Card>
							))}
						</div>
					</div>
				</OffCanvasBody>
				<div className='row m-0'>
					<div className='col-12 p-3'>
						<Button
							color='info'
							className='w-100'
							onClick={() => {
								handleSaveSelectedTrabalhos(selectedTrabalhos);

								setUpcomingEventsEditOffcanvas(false);
							}}>
							Save
						</Button>
					</div>
				</div>
			</OffCanvas>
		</>
	);
};

export default NovoTrabalho;
