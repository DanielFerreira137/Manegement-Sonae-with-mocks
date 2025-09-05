import React, { createContext, FC, ReactNode, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { parseCookies, destroyCookie } from 'nookies';
import { getUserDataWithUsername, IUserProps } from '../common/data/userDummyData';

export interface IAuthContextProps {
  user: string;
  setUser?(...args: unknown[]): unknown;
  userData: Partial<IUserProps>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginContext = createContext<IAuthContextProps>({} as IAuthContextProps);

interface IAuthContextProviderProps {
  children: ReactNode;
}

export const LoginContextProvider: FC<IAuthContextProviderProps> = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState<string>(
    typeof window !== 'undefined' ? String(localStorage?.getItem('facit_authUsername')) : '',
  );
  const [userData, setUserData] = useState<Partial<IUserProps>>({});
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true); // Adiciona o estado de carregamento

  // Função de verificação de autenticação
  const verifyAuth = async () => {
    try {
      const cookies = parseCookies();
      let token = cookies.token;

      // Se não há token, criar um mock para desenvolvimento
      if (!token) {
        // Para desenvolvimento com mocks, criar um token mock
        token = 'mock-token-' + Date.now();
        // Não definir cookie aqui para evitar problemas de SSR
      }

      // Autenticação válida, define estado de autenticação como verdadeiro
      setIsAuthenticated(true);
      setUser(token); // Salva o token (ou username) no estado `user`
      localStorage.setItem('facit_authUsername', token);
    } catch (err) {
      // Se o token não for válido ou não existir, redireciona para a página de login
      setIsAuthenticated(false);
      destroyCookie(null, 'token'); // Remove o cookie inválido
      router.push('/auth-pages/login'); // Redireciona para a página de login
    } finally {
      setLoading(false); // Define o carregamento como falso após a verificação
    }
  };

  // Chama a função `verifyAuth` na montagem do componente
  useEffect(() => {
    verifyAuth();
  }, []);

  // Atualiza o usuário quando o `user` muda
  useEffect(() => {
    if (user !== '') {
      setUserData(getUserDataWithUsername(user));
    } else {
      setUserData({});
    }
  }, [user]);

  // Memoiza o valor do contexto para otimizar o desempenho
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

  // Exibe um componente de carregamento enquanto a verificação está em andamento
  if (loading) {
    return <div>Loading...</div>;
  }

  return <LoginContext.Provider value={value}>{children}</LoginContext.Provider>;
};

LoginContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default LoginContext;
