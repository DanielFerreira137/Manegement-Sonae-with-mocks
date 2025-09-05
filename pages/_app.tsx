import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { parseCookies, setCookie } from 'nookies'; // Importa o nookies
import '../styles/styles.scss';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'react-jss';
import { ToastContainer } from 'react-toastify';
import { TourProvider } from '@reactour/tour';
import { ReactNotifications } from 'react-notifications-component';
import { appWithTranslation } from 'next-i18next';
import { ThemeContextProvider } from '../context/themeContext';
import useDarkMode from '../hooks/useDarkMode';
import COLORS from '../common/data/enumColors';
import steps, { styles } from '../steps';
import Portal from '../layout/Portal/Portal';
import Wrapper from '../layout/Wrapper/Wrapper';
import App from '../layout/App/App';
import AsideRoutes from '../layout/Aside/AsideRoutes';
import { ToastCloseButton } from '../components/bootstrap/Toasts';
import { LoginContextProvider } from '../context/loginContext';
import { EdgeStoreProvider } from '../lib/edgestore';
const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const { themeStatus } = useDarkMode();

  // Estado de carregamento
  const [loading, setLoading] = useState(true);


  // Configuração do tema com base no Dark Mode
  const theme = {
    theme: themeStatus,
    primary: COLORS.PRIMARY.code,
    secondary: COLORS.SECONDARY.code,
    success: COLORS.SUCCESS.code,
    info: COLORS.INFO.code,
    warning: COLORS.WARNING.code,
    danger: COLORS.DANGER.code,
    dark: COLORS.DARK.code,
    light: COLORS.LIGHT.code,
  };

  return (
    <LoginContextProvider>
      <ThemeContextProvider>
        <ThemeProvider theme={theme}>
          <TourProvider
            steps={steps}
            styles={styles}
            showNavigation={false}
            showBadge={false}
          >
            <App>
              <AsideRoutes />
              <Wrapper>
              <EdgeStoreProvider>
                <Component {...pageProps} />
              </EdgeStoreProvider>
              </Wrapper>
            </App>
            <Portal id="portal-notification">
              <ReactNotifications />
            </Portal>
            <ToastContainer closeButton={ToastCloseButton} toastClassName="toast show" />
          </TourProvider>
        </ThemeProvider>
      </ThemeContextProvider>
    </LoginContextProvider>
  );
};

export default appWithTranslation(MyApp);
