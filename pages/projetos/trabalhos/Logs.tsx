import { FC, useEffect, useState } from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import OffCanvas, { OffCanvasBody, OffCanvasHeader } from '../../../components/bootstrap/OffCanvas';
import InputGroup from '../../../components/bootstrap/forms/InputGroup';
import Textarea from '../../../components/bootstrap/forms/Textarea';
import Button from '../../../components/bootstrap/Button';
import Chat, { ChatGroup, ChatHeader } from '../../../components/Chat';
import { 
	getAllLogsByData, 
	getUserInfo,
	postCreateDecLog,
	postCreateTrabalhoLog,
	postCreateFiscalizacaoLog
} from '../../../api/routes';
import { set } from 'zod';

// Tipagem para dados da API e componente
interface LogsResponse {
	codigoTrabalhoLogs?: number;
	codigoFiscalizacaoLogs?: number;
	codigoDecLogs?: number;
	codigoProjetoSeccoesZonaTrabalho: number;
	nUtilizador: number;
	status?: string;
	comentario: string;
	createdAt?: string;
}

interface IChatGroupData {
	id: string | number;
	messages: { id: string | number; message: string; data: string; nome: string }[];
	user: {
		id: string | number;
		name: string;
		email?: string;
		phone?: string;
		photo?: string;
		role?: string;
	};
	isReply: boolean;
}

interface ICommonUpcomingEventsProps {
	canvasStatus: boolean;
	setCanvasStatus: (status: boolean) => void;
	trabalho: Trabalhos | null;
	setRefresh: (status: boolean) => void;
	setComentariosEmail: (comentario: string) => void;
	comentariosEmail: string;
	nomeProjeto: string;
	setComentariosTrabalhos:Function;
	comentariosTrabalhos: string;
}

const Logs: FC<ICommonUpcomingEventsProps> = ({ canvasStatus, setCanvasStatus, trabalho, setRefresh, setComentariosEmail, comentariosEmail ,
	nomeProjeto,setComentariosTrabalhos,comentariosTrabalhos}) => {
	const [chatData, setChatData] = useState<IChatGroupData[]>([]);
	const [role, setRole] = useState<string>('Unknown');
	const [fornecedor, setFornecedor] = useState<string>('Unknown');
	const handleResponse = (response: any[]) => {
		if (response) {
			const transformedData = response.map((log) => ({
				id:
					log.codigoTrabalhoLogs ||
					log.codigoFiscalizacaoLogs ||
					log.codigoDecLogs,
				messages: [
					{
						id:
							log.codigoTrabalhoLogs ||
							log.codigoFiscalizacaoLogs ||
							log.codigoDecLogs,
						message: log.comentario,
						data: new Date(log.createdAt || '').toLocaleDateString(),
						nome: `${log.acesso.nome} (${log.acesso.role})`,
					},
				],
				user: {
					id: log.nUtilizador,
					name: log.acesso.nome,
					email: log.acesso.email,
					phone: log.acesso.telemovel,
					src:
						log.acesso.foto ||
						`https://ui-avatars.com/api/?name=${log.acesso.nome || 'User'}&background=random&color=fff`,
					role: log.status || 'Unknown',
				},
				isReply: log.acesso.role == role,
			}));
			console.log('Transformed data:', transformedData);
			setChatData(transformedData);
		} else {
			setChatData([]);
			console.warn('No logs found for this project!');
		}
	};

	useEffect(() => {
		getUserInfo().then((response) => {setRole(response.role);setFornecedor(response.nome);});

		if (!canvasStatus) {
			setChatData([]);
			return;
		}

		const codigo = Number(
			trabalho?.detalhes.projetoSeccaoZonaTrabalho.codigoProjetoSeccoesZonaTrabalho
		);

		getAllLogsByData(codigo)
			.then((response) => {
				console.log('Response from API:', response);
				handleResponse(response);
			})
			.catch((error) => {
				console.error('Error fetching logs:', error);
				setChatData([]);
			});
	}, [canvasStatus, trabalho]);

	const [comentario, setComentario] = useState<string>('');

	const handleCometario = () => {
	
		const codigo = Number(
			trabalho?.detalhes.projetoSeccaoZonaTrabalho.codigoProjetoSeccoesZonaTrabalho
		);

		const logPayload = {
			codigoProjetoSeccoesZonaTrabalho: codigo,
			comentario,
		};

		const handleComentario = (comentario: string) => {
			// Verifique se o comentário já foi definido
			
			  setComentariosEmail(`${comentariosEmail}\n${comentario}`);
			  setComentariosTrabalhos(`${comentariosTrabalhos}-${trabalho?.detalhes.projetoSeccaoZonaTrabalho.codigoProjetoSeccoesZonaTrabalho}`);
			
		  };
		  
		  if (role === 'Fiscal') {
			postCreateFiscalizacaoLog(logPayload).then(() => {
			  getAllLogsByData(codigo).then(handleResponse);
			  handleComentario(`Houve um comentário no Trabalho ${trabalho?.trabalho.nome} no Projeto ${nomeProjeto}.`);
			});
		  } else if (role === 'Dec') {
			postCreateDecLog(logPayload).then(() => {
			  getAllLogsByData(codigo).then(handleResponse);
			  handleComentario(`Houve um comentário no Trabalho ${trabalho?.trabalho.nome} no Projeto ${nomeProjeto}.`);
			});
		  } else if (role === 'Fornecedor') {
			postCreateTrabalhoLog({ ...logPayload, status: 'teste' }).then(() => {
			  getAllLogsByData(codigo).then(handleResponse);
			  handleComentario(`Houve um comentário no Trabalho ${trabalho?.trabalho.nome} no Projeto ${nomeProjeto}.`);
			});
		  }
		setComentario('');
		setRefresh(true);
	};

	return (
		<OffCanvas
			id='chat'
			isOpen={canvasStatus}
			setOpen={setCanvasStatus}
			placement='end'
			isModalStyle
			isBackdrop={false}
			isBodyScroll>
			<OffCanvasHeader setOpen={setCanvasStatus} className='fs-5'>
				<ChatHeader to={trabalho?.trabalho.nome || 'Logs'} />
			</OffCanvasHeader>
			<OffCanvasBody>
				<Chat>
					{chatData.length > 0 ? (
						chatData.map((group) => (
							<ChatGroup
								key={group.id}
								messages={group.messages}
								user={group.user}
								isReply={group.isReply}
							/>
						))
					) : (
						<p>Sem Observações</p>
					)}
				</Chat>
			</OffCanvasBody>
			<div className='chat-send-message p-3'>
				<InputGroup>
					<Textarea
						onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComentario(e.target.value)} // Atualiza o estado com o valor digitado
						value={comentario} // Sincroniza o valor do Textarea com o estado
					/>

					<Button color='info' icon='Send' onClick={handleCometario}>
						Comentar
					</Button>
				</InputGroup>
			</div>
		</OffCanvas>
	);
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
	props: {
		...(await serverSideTranslations(locale!, ['common', 'menu'])),
	},
});

export default Logs;
