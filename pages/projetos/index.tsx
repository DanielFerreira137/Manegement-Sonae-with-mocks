import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

// Hooks e dados
import useDarkMode from '../../hooks/useDarkMode';
import useTourStep from '../../hooks/useTourStep';
import { getUserInfo, getTipoDeProjeto, getInsignias } from '../../api/routes';
import { demoPagesMenu } from '../../menu';

// Componentes reutilizáveis
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import SubHeader, { SubHeaderLeft } from '../../layout/SubHeader/SubHeader';
import Page from '../../layout/Page/Page';
import Card, {
  CardActions,
  CardBody,
  CardHeader,
  CardLabel,
  CardTitle,
} from '../../components/bootstrap/Card';
import Button from '../../components/bootstrap/Button';
import OffCanvas, {
  OffCanvasBody,
  OffCanvasHeader,
  OffCanvasTitle,
} from '../../components/bootstrap/OffCanvas';

const Index: NextPage = () => {
  // Passo do tour
  useTourStep(12);

  // Estado de modo escuro
  const { darkModeStatus } = useDarkMode();
  const router = useRouter();

  // Estados
  const [funcionario, setFuncionario] = useState<UserApp>();
  const [tipoDeProjeto, setTipoDeProjeto] = useState<TipoProjeto[]>([]);
  const [insignias, setInsignias] = useState<Insignia[]>([]);
  const [codigoProjeto, setCodigoProjeto] = useState<string>();
  const [showTipoProjeto, setShowTipoProjeto] = useState(true);
  const [selectedInsignia, setSelectedInsignia] = useState<number | null>(null);

  // Buscar informações do funcionário, projetos e insígnias ao carregar
  useEffect(() => {
    const fetchData = async () => {
      const [funcData, projetos, insigniasData] = await Promise.all([
        getUserInfo(),
        getTipoDeProjeto(),
        getInsignias(),
      ]);
      setFuncionario(funcData);
      setTipoDeProjeto(projetos);
      setInsignias(insigniasData);
    };
    fetchData();
  }, []);

  // Alternar visibilidade do tipo de projeto ou insígnias
  const handleOnClickToEmployeeListPage = (codigoProjeto: string) => {
    setShowTipoProjeto(false);
	setCodigoProjeto(codigoProjeto)
  };

  const handleInsigniaClick = (codigoInsignia: number) => {
    setSelectedInsignia(codigoInsignia);
   console.log(codigoInsignia);
   console.log(codigoProjeto);
   router.push(`/projetos/insignias/${codigoProjeto}/${codigoInsignia}`);
  };

  // Renderização da lista de tipos de projetos
  const renderTipoDeProjetos = () => (
    <>
      <div className="col-12">
        <div className="display-4 fw-bold py-3">Selecione Um Tipo De Projeto</div>
      </div>
      {tipoDeProjeto.map((item) => (
        <div className="col-md-4" key={item.codigoTipoProjeto}>
          <Card stretch>
            <CardHeader className="bg-transparent">
              <CardLabel>
                <CardTitle tag="h4" className="h5">
                  {item.tipo}
                </CardTitle>
              </CardLabel>
              <CardActions>
                <Button
                  icon="ArrowForwardIos"
                  aria-label="Read More"
                  hoverShadow="default"
                  color={darkModeStatus ? 'dark' : undefined}
                  onClick={() => handleOnClickToEmployeeListPage(item.codigoTipoProjeto.toString())}
                />
              </CardActions>
            </CardHeader>
          </Card>
        </div>
      ))}
    </>
  );

  // Renderização da lista de insígnias
  const renderInsignias = () => (
    <>
      <div className="col-12">
        <div className="display-4 fw-bold py-3">Selecione Uma Insígnia</div>
      </div>
      {insignias.map((insignia) => (
        <div
          className="col-md-4 cursor-pointer"
          key={insignia.codigoInsignia}
          onClick={() => handleInsigniaClick(insignia.codigoInsignia)}
        >
          <Card
            stretch
            style={{
              backgroundColor: selectedInsignia === insignia.codigoInsignia ? '#f0f0f0' : 'white',
            }}
          >
            <CardHeader
              className="bg-transparent d-flex align-items-center justify-content-center"
              style={{ height: '200px' }}
            >
              <CardLabel>
                <CardTitle tag="h4" className="h5">
                  <img src={insignia.logo} alt="Insígnia" width={300} />
                </CardTitle>
              </CardLabel>
            </CardHeader>
          </Card>
        </div>
      ))}
    </>
  );

  return (
    <PageWrapper>
      {/* Cabeçalho */}
      <Head>
        <title>{demoPagesMenu.projectManagement.subMenu.list.text}</title>
      </Head>

      {/* Subcabeçalho */}
   

      {/* Página principal */}
      <Page>
        <div className="row">{showTipoProjeto ? renderTipoDeProjetos() : renderInsignias()}</div>
      </Page>

      {/* OffCanvas para edição */}
      <OffCanvas
        setOpen={() => {}}
        isOpen={false}
        titleId="upcomingEdit"
        isBodyScroll
        placement="end"
      >
        <OffCanvasHeader setOpen={() => {}}>
          <OffCanvasTitle id="upcomingEdit">Criar Equipa</OffCanvasTitle>
        </OffCanvasHeader>
        <OffCanvasBody>
          <div className="row g-4">
            <div className="col-12">{/* Conteúdo adicional pode ser inserido aqui */}</div>
          </div>
        </OffCanvasBody>
      </OffCanvas>
    </PageWrapper>
  );
};

export default Index;
