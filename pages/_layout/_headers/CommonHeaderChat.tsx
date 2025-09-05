import React, { useEffect, useState } from 'react';
import OffCanvas, { OffCanvasBody, OffCanvasHeader } from '../../../components/bootstrap/OffCanvas';
import Chat, { ChatGroup, ChatHeader } from '../../../components/Chat';
import InputGroup from '../../../components/bootstrap/forms/InputGroup';
import Textarea from '../../../components/bootstrap/forms/Textarea';
import Button from '../../../components/bootstrap/Button';
import USERS from '../../../common/data/userDummyData';
import Avatar from '../../../components/Avatar';
import showNotification from '../../../components/extras/showNotification';
import CHATS from '../../../common/data/chatDummyData';
import { getUserInfo } from '../../../api/routes';
import defaultAvatar from '../../../assets/img/current/default.jpg';
const CommonHeaderChat = () => {
	const [state, setState] = useState<boolean>(false);
	const [msgCount, setMsgCount] = useState<number>(0);
	const [funcionario, setFuncionario] = useState<UserApp>();

    useEffect(() => {
        // Chama a função para buscar as informações do funcionário
        getUserInfo().then((res) => {
            setFuncionario(res);
        });
    }, []);

	return (
		<>
			<div
				className='col d-flex align-items-center cursor-pointer'
				onClick={() => setState(!state)}
				role='presentation'>
				<div className='me-3'>
					<div className='text-end'>
						<div className='fw-bold fs-6 mb-0'>
							{funcionario?.nome}
						</div>
						<div className='text-muted'>
						 	<small>{funcionario?.role}</small>
						</div>
					</div>
				</div>
				<div className='position-relative'>
					<Avatar src={funcionario?.foto ? funcionario?.foto : `https://ui-avatars.com/api/?name=${funcionario?.nome || 'User'}&background=random&color=fff`} size={48}  />
					
					<span className='position-absolute top-85 start-85 translate-middle badge border border-2 border-light rounded-circle bg-success p-2'>
						<span className='visually-hidden'>Online user</span>
					</span>
				</div>
			</div>
			
		</>
	);
};

export default CommonHeaderChat;
