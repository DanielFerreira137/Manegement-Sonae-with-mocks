import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import useDarkMode from '../hooks/useDarkMode';
import { set } from 'zod';
const Index: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/projetos'); // Redirect to /projetos
  }, [router]);
  const { darkModeStatus, setDarkModeStatus } = useDarkMode();
  setDarkModeStatus(false);
  return null; // Optional: You can show a loader or a blank page while redirecting
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    // @ts-ignore
    ...(await serverSideTranslations(locale, ['common', 'menu'])),
  },
});

export default Index;
