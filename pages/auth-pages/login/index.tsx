import React, { FC, useCallback, useContext, useState } from 'react';
import type { NextPage } from 'next';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import classNames from 'classnames';
import Link from 'next/link';
import PropTypes from 'prop-types';
import AuthContext from '../../../context/authContext';
import useDarkMode from '../../../hooks/useDarkMode';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Card, { CardBody } from '../../../components/bootstrap/Card';
import Logo from '../../../components/Logo';
import Button from '../../../components/bootstrap/Button';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Spinner from '../../../components/bootstrap/Spinner';
import { LoginUser } from '../../../api/routes';

interface ILoginHeaderProps {
	isNewUser?: boolean;
}

const LoginHeader: FC<ILoginHeaderProps> = ({ isNewUser }) =>
	isNewUser ? (
		<>
			<div className='text-center h1 fw-bold mt-5'>Create Account,</div>
			<div className='text-center h4 text-muted mb-5'>Sign up to get started!</div>
		</>
	) : (
		<>
			<div className='text-center h1 fw-bold mt-5'>Bem-vindo,</div>
			<div className='text-center h4 text-muted mb-5'>Faça login para continuar!</div>
		</>
	);

interface ILoginProps {
	isSignUp?: boolean;
}

const Login: NextPage<ILoginProps> = ({ isSignUp }) => {
	const router = useRouter();
	const { setUser } = useContext(AuthContext);
	const { darkModeStatus } = useDarkMode();

	const [signInPassword, setSignInPassword] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
	const [loginError, setLoginError] = useState<boolean>(false);

	const resetForm = () => {
		setSignInPassword(false);
		setIsLoading(false);
		setIsAuthenticating(false);
		setLoginError(false);
		formik.resetForm();
	};

	const formik = useFormik({
		initialValues: {
			loginUsername: '',
			loginPassword: '',
		},
		onSubmit: async (values) => {
			setIsLoading(true);
			setIsAuthenticating(true);
			try {
				const success = await LoginUser({
					usr: values.loginUsername,
					pw: values.loginPassword,
				});
				
				if (success) {
					setTimeout(() => {
						router.reload();
						router.push('/');
					}, 2000);
				} else {
					setLoginError(true);
					resetForm(); // Reset to email input on login failure
				}
			} catch (error) {
				console.error('Erro ao fazer login:', error);
				setLoginError(true);
				resetForm(); // Reset to email input on error
			} finally {
				setIsLoading(false);
				setIsAuthenticating(false);
			}
		},
	});

	const handleContinue = () => {
		setIsLoading(true);
		setTimeout(() => {
			setSignInPassword(true);
			setIsLoading(false);
		}, 1000);
	};

	return (
		<PageWrapper
			isProtected={false}
			className={classNames({ 'bg-dark': !isSignUp, 'bg-light': isSignUp })}>
			<Head>
				<title>{isSignUp ? 'Sign Up' : 'Login'}</title>
			</Head>
			<div className='login-page-container p-0 d-flex justify-content-center align-items-center min-vh-100'>
				<div className='col-xl-4 col-lg-6 col-md-8 shadow-3d-container'>
					<Card className='shadow-3d-dark' data-tour='login-page'>
						<CardBody>
							<div className='text-center my-5'>
								<Link
									href='/'
									className={classNames(
										'text-decoration-none fw-bold display-2',
										{
											'text-dark': !darkModeStatus,
											'text-light': darkModeStatus,
										},
									)}>
									<Logo width={200} alt='black' />
								</Link>
							</div>
							<LoginHeader isNewUser={isSignUp} />

							

							<form className='row g-4' onSubmit={formik.handleSubmit}>
								{!signInPassword && (
									<>
										<FormGroup
											id='loginUsername'
											isFloating
											label='Your email or username'>
											<Input
												autoComplete='username'
												value={formik.values.loginUsername}
												onChange={formik.handleChange}
											/>
										</FormGroup>
										<Button
											color='warning'
											className='w-100 py-3'
											onClick={handleContinue}>
											{isLoading ? (
												<Spinner isSmall inButton isGrow />
											) : (
												'Continuar'
											)}
										</Button>
									</>
								)}
								{signInPassword && (
									<>
										<FormGroup id='loginPassword' isFloating label='Password'>
											<Input
												type='password'
												autoComplete='current-password'
												value={formik.values.loginPassword}
												onChange={formik.handleChange}
											/>
										</FormGroup>
										<Button
											color='warning'
											className='w-100 py-3'
											type='submit'
											>
											{isAuthenticating ? (
												<Spinner isSmall inButton isGrow />
											) : (
												'Login'
											)}
										</Button>
									</>
								)}
							</form>
						</CardBody>
					</Card>
				</div>
			</div>
		</PageWrapper>
	);
};

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => ({
	props: {
		...(await serverSideTranslations(locale, ['common', 'menu'])),
	},
});

export default Login;