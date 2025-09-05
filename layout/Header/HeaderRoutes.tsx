	import React from 'react';
	import { useRouter } from 'next/router';
	import headers from '../../routes/headerRoutes';
	import { pathToRoute } from '../../helpers/helpers';
	import Mounted from '../../components/Mounted';

	const HeaderRoutes = () => {
	const router = useRouter();

	// Encontre a página que corresponde ao caminho da rota
	const PAGE = headers.find((key) => {
		if (!key?.path) return false; // Verifica se 'key' e 'key.path' existem

		const isWildcard = key.path.substring(key.path.length - 2) === '/*'; // Verifica se o path é um wildcard (/*)
		
		if (isWildcard) {
		// Se for um wildcard, verifica se o caminho da rota começa com o prefixo da 'key.path'
		return router.pathname.includes(key.path.substring(0, key.path.length - 2));
		}

		// Caso contrário, compara diretamente a rota com o path
		return key.path === pathToRoute(router.pathname);
	});

	// Renderiza o elemento da página encontrada ou retorna null se não houver correspondência
	if (PAGE) return <Mounted>{PAGE.element}</Mounted>;
	return null;
	};

	export default HeaderRoutes;
