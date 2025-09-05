import React, { createContext, FC, ReactNode, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { getUserDataWithUsername, IUserProps } from '../common/data/userDummyData';
import { parseCookies } from 'nookies';  // Importa a função para ler cookies

export interface IAuthContextProps {
	user: string;
	setUser?(...args: unknown[]): unknown;
	userData: Partial<IUserProps>;
	isAuthenticated: boolean;
	setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}
const AuthContext = createContext<IAuthContextProps>({} as IAuthContextProps);

interface IAuthContextProviderProps {
	children: ReactNode;
}

export const AuthContextProvider: FC<IAuthContextProviderProps> = ({ children }) => {
	// Inicializa com base no localStorage ou um valor em branco
	const [user, setUser] = useState<string>(
		typeof window !== 'undefined' ? String(localStorage?.getItem('facit_authUsername')) : '',
	);
	const [userData, setUserData] = useState<Partial<IUserProps>>({});
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

	// Verificar o token no cookie
	useEffect(() => {
		const cookies = parseCookies();  // Lê os cookies
		if (cookies.token) {
			setIsAuthenticated(true);  // Se o token existir, define como autenticado
			localStorage.setItem('facit_authUsername', cookies.token);  // Armazena o username (ou token) no localStorage
		} else {
			setIsAuthenticated(false);
		}
	}, []);

	// Atualiza o usuário quando o username muda
	useEffect(() => {
		if (user !== '') {
			setUserData(getUserDataWithUsername(user));
		} else {
			setUserData({});
		}
	}, [user]);

	// Memoize para otimização de performance
	const value = useMemo(
		() => ({
			user,
			setUser,
			userData,
			isAuthenticated,
			setIsAuthenticated,
		}),
		[user, userData, isAuthenticated],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthContextProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export default AuthContext;
