import React from 'react';
import classNames from 'classnames';
import Header, { HeaderLeft, HeaderRight } from '../../../layout/Header/Header';
import CommonHeaderChat from './CommonHeaderChat';
import useDarkMode from '../../../hooks/useDarkMode';

import { useEffect, useState } from 'react';
import { getUserInfo } from '../../../api/routes';
const DashboardBookingHeader = () => {

	const { darkModeStatus } = useDarkMode();


	const [funcionario, setFuncionario] = useState<UserApp>();

    useEffect(() => {
        // Chama a função para buscar as informações do funcionário
        getUserInfo().then((res) => {
            setFuncionario(res);
        });
    }, []);

	return (
		<Header>
			<HeaderLeft>
				<div className='d-flex align-items-center'>
					<div className='row g-4'>
						<div className='col-md-auto'>
							<div
								className={classNames('fs-3', 'fw-bold', {
									'text-dark': !darkModeStatus,
								})}>
								Olá, {funcionario?.nome}!
							</div>
						</div>
					</div>
				</div>
			</HeaderLeft>
			<HeaderRight>
				<CommonHeaderChat />
			</HeaderRight>
		</Header>
	);
};

export default DashboardBookingHeader;
