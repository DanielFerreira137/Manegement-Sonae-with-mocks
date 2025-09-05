import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dayjs from 'dayjs';
import useDarkMode from '../../../hooks/useDarkMode';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import { demoPagesMenu } from '../../../menu';
import SubHeader, { SubHeaderLeft, SubHeaderRight } from '../../../layout/SubHeader/SubHeader';
import Icon from '../../../components/icon/Icon';
import Button from '../../../components/bootstrap/Button';
import Page from '../../../layout/Page/Page';
import CommonUpcomingEvents from './CommonUpcomingEvents';
import { useRouter } from 'next/router';
import useTourStep from '../../../hooks/useTourStep';
import {
	getUserInfo,
	getProjetosSeccaoZonaTrabalho,
	getProjeto,
	getResponsaveisProjetobyProjeto,
} from '../../../api/routes';
import { set } from 'lodash';

const Index: NextPage = () => {
	const { themeStatus } = useDarkMode();
	useTourStep(12);
	const router = useRouter();

	const { id } = router.query;

	const [funcionario, setFuncionario] = useState<UserApp>();
	const [projetos, setProjetos] = useState<ProjetosSeccaoZonaTrabalho | null>(null);
	const [refresh, setRefresh] = useState(false);
	const [projeto, setProjeto] = useState<Projeto | null>(null);

	// Status constants
	const EVENT_STATUS = {
		EmAndamento: 'Em Curso',
		Concluido: 'Concluído',
		Pendente: 'Pendente',
	};

	// Status colors mapping
	const STATUS_COLORS = {
		[EVENT_STATUS.EmAndamento]: 'info',
		[EVENT_STATUS.Concluido]: 'success',
		[EVENT_STATUS.Pendente]: 'warning',
	};

	// Add filter states
	const [selectedEmpresa, setSelectedEmpresa] = useState<number | ''>('');
	const [selectedSeccao, setSelectedSeccao] = useState<number | ''>('');
	const [selectedStatus, setSelectedStatus] = useState<string>('');

	// Helper function to get unique empresas from projetos
	const getUniqueEmpresas = () => {
		if (!projetos?.empresas) return [];
		return projetos.empresas;
	};

	// Helper function to get unique seccoes from projetos
	const getUniqueSeccoes = () => {
		if (!projetos?.empresas) return [];
		const allSeccoes: Seccao[] = [];
		projetos.empresas.forEach((empresa) => {
			empresa.seccoes.forEach((seccao) => {
				if (!allSeccoes.find((s) => s.codigoSeccao === seccao.seccao.codigoSeccao)) {
					allSeccoes.push(seccao.seccao);
				}
			});
		});
		return allSeccoes;
	};

	// Filter projects based on selected filters
	// Helper function to get unique status values
	const getUniqueStatus = () => {
		if (!projetos?.empresas) return [];
		const statusSet = new Set<string>();

		projetos.empresas.forEach((empresa) => {
			empresa.seccoes.forEach((seccao) => {
				seccao.zonas.forEach((zona) => {
					zona.trabalhos.forEach((trabalho) => {
						if (trabalho.detalhes.projetoSeccaoZonaTrabalho.status) {
							statusSet.add(trabalho.detalhes.projetoSeccaoZonaTrabalho.status);
						}
					});
				});
			});
		});

		return Array.from(statusSet);
	};

	const getFilteredProjetos = (): ProjetosSeccaoZonaTrabalho | null => {
		if (!projetos) return null;

		let filteredEmpresas = [...projetos.empresas];

		if (selectedEmpresa) {
			filteredEmpresas = filteredEmpresas.filter(
				(empresa) => empresa.empresa.codigoEmpresa === selectedEmpresa,
			);
		}

		if (selectedSeccao) {
			filteredEmpresas = filteredEmpresas
				.map((empresa) => ({
					...empresa,
					seccoes: empresa.seccoes.filter(
						(seccao) => seccao.seccao.codigoSeccao === selectedSeccao,
					),
				}))
				.filter((empresa) => empresa.seccoes.length > 0);
		}

		if (selectedStatus) {
			filteredEmpresas = filteredEmpresas
				.map((empresa) => ({
					...empresa,
					seccoes: empresa.seccoes
						.map((seccao) => ({
							...seccao,
							zonas: seccao.zonas
								.map((zona) => ({
									...zona,
									trabalhos: zona.trabalhos.filter(
										(trabalho) =>
											trabalho.detalhes.projetoSeccaoZonaTrabalho.status ===
											selectedStatus,
									),
								}))
								.filter((zona) => zona.trabalhos.length > 0),
						}))
						.filter((seccao) => seccao.zonas.length > 0),
				}))
				.filter((empresa) => empresa.seccoes.length > 0);
		}

		return {
			empresas: filteredEmpresas,
		};
	};
	const [reponsaveisProjeto, setReponsaveisProjeto] = useState<ResponsavelProjeto[] | null>(null);
	const [sendEmail, setSendEmail] = useState<boolean>(false);
	useEffect(() => {
		const fetchData = async () => {
			try {
				if (!id || isNaN(Number(id))) {
					return;
				}

				const [funcData, trabalhos, projetos, reponsaveisProjeto] = await Promise.all([
					getUserInfo(),
					getProjetosSeccaoZonaTrabalho(Number(id)),
					getProjeto(Number(id)),
					getResponsaveisProjetobyProjeto(Number(id)),
				]);
				setFuncionario(funcData);
				setProjetos(trabalhos);
				setProjeto(projetos);
				setReponsaveisProjeto(reponsaveisProjeto.responsaveisProjeto);
				const userResponsible = reponsaveisProjeto.responsaveisProjeto.find(
					(responsavel: any) => responsavel.nUtilizador === funcData.nUtilizador
				);
				
				console.log('userResponsible', userResponsible);
				setSendEmail(userResponsible?.sendEmail || false);
				} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchData();
	}, [id]);
	
	if (refresh) {
		const fetchData = async () => {
			try {
				const trabalhos = await getProjetosSeccaoZonaTrabalho(Number(id));
				setProjetos(trabalhos);
			} catch (error) {
				console.error('Erro ao atualizar projetos:', error);
				alert('Ocorreu um erro ao atualizar os dados. Tente novamente mais tarde.');
			}
		};

		fetchData();
		setRefresh(false);
	}

	return (
		<PageWrapper>
			<Page container='fluid'>
				<div className='card shadow-sm mb-4'>
					<div className='card-body'>
						<div className='d-flex flex-column flex-md-row gap-3 align-items-center justify-content-between'>
							<div className='d-flex align-items-center'>
								<Icon
									icon='FilterList'
									className='me-2'
									size='2x'
									color={themeStatus === 'dark' ? 'light' : 'dark'}
								/>
								<h5 className='card-title mb-0'>Filtros</h5>
							</div>

							<div className='d-flex flex-column flex-md-row gap-3 flex-grow-1 max-w-100'>
								<div className='flex-grow-1 position-relative'>
									<div className='position-absolute top-50 start-0 translate-middle-y ps-3'>
										<Icon icon='Business' className='text-muted' size='lg' />
									</div>
									<select
										className='form-select ps-5'
										value={selectedEmpresa}
										onChange={(e) =>
											setSelectedEmpresa(
												e.target.value ? Number(e.target.value) : '',
											)
										}>
										<option value=''>Todas as Empresas</option>
										{getUniqueEmpresas().map((empresa) => (
											<option
												key={empresa.empresa.codigoEmpresa}
												value={empresa.empresa.codigoEmpresa}>
												{empresa.empresa.nome}
											</option>
										))}
									</select>
								</div>

								<div className='flex-grow-1 position-relative'>
									<div className='position-absolute top-50 start-0 translate-middle-y ps-3'>
										<Icon icon='Category' className='text-muted' size='lg' />
									</div>
									<select
										className='form-select ps-5'
										value={selectedSeccao}
										onChange={(e) =>
											setSelectedSeccao(
												e.target.value ? Number(e.target.value) : '',
											)
										}>
										<option value=''>Todas as Secções</option>
										{getUniqueSeccoes().map((seccao) => (
											<option
												key={seccao.codigoSeccao}
												value={seccao.codigoSeccao}>
												{seccao.nome}
											</option>
										))}
									</select>
								</div>
							</div>

							<div className='flex-grow-1 position-relative'>
								<div className='position-absolute top-50 start-0 translate-middle-y ps-3'>
									<Icon icon='Assignment' className='text-muted' size='lg' />
								</div>
								<select
									className='form-select ps-5'
									value={selectedStatus}
									onChange={(e) => setSelectedStatus(e.target.value)}>
									<option value=''>Todos os Status</option>
									{Object.values(EVENT_STATUS).map((status) => (
										<option
											key={status}
											value={status}
											className={`text-${STATUS_COLORS[status as keyof typeof STATUS_COLORS]}`}>
											{status}
										</option>
									))}
								</select>
								{selectedStatus && (
									<div className='position-absolute top-50 end-0 translate-middle-y pe-3'>
										<span
											className={`badge bg-${STATUS_COLORS[selectedStatus as keyof typeof STATUS_COLORS]}`}>
											{selectedStatus}
										</span>
									</div>
								)}
							</div>

							<Button
								color='info'
								isLight
								icon='FilterAltOff'
								onClick={() => {
									setSelectedEmpresa('');
									setSelectedSeccao('');
									setSelectedStatus('');
								}}>
								Limpar Filtros
							</Button>
						</div>
					</div>
				</div>

				<div className='row h-100'>
					<div className='col-12'>
						<CommonUpcomingEvents
							isFluid
							projeto={getFilteredProjetos()}
							codigoProjeto={(id as string) || ''}
							setRefresh={setRefresh}
							funcionario={funcionario as UserApp}
							nomeProjeto={projeto?.nomeProjeto || ''}
							projetoCompleto={projeto}
							sendEmail={sendEmail || false}
						/>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
	props: {
		// @ts-ignore
		...(await serverSideTranslations(locale, ['common', 'menu'])),
	},
});

export async function getStaticPaths() {
	return {
		paths: ['/projetos/trabalhos/1', { params: { id: '1' } }],
		fallback: true,
	};
}

export default Index;
