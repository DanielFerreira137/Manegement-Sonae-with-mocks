import React from 'react';
import type { NextPage } from 'next';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import useDarkMode from '../../../hooks/useDarkMode';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import router from 'next/router';
import { getUserInfo, getAllImages, getAllDocs } from '../../../api/routes';
import { useEffect, useState } from 'react';
import Button from '../../../components/bootstrap/Button';
import FileUploadModal from './FileUploadModal';
import DateFilter, { DateFilterState } from './DateFilter';
import _ from 'lodash';


interface PhotoData {
  codigoDocumentoImagem: number;
  url: string;
  createdAt: string;
  nomeEmpresa?: string | null;
}




const Index: NextPage = () => {
  const { themeStatus } = useDarkMode();
  const [funcionario, setFuncionario] = useState<UserApp>();
  const { id } = router.query;
  const [refresh, setRefresh] = useState<boolean>(false);
  const [fotos, setFotos] = useState<GroupedImages>();
  const [documentos, setDocumentos] = useState<DocumentsResponse>();
  const [dateFilter, setDateFilter] = useState<DateFilterState>({ startDate: '', endDate: '' });
  const [secao, setSecao] = useState<'fotos' | 'documentos' | 'ambos'>('ambos');
  const [folderPhotos, setFolderPhotos] = useState<boolean>(true);
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!id) {
      return;
    }
  }, [id]);

  useEffect(() => {
    if (refresh) {
      const fetchData = async () => {
        try {
          const funcData = await getUserInfo();
          setFuncionario(funcData);

          const imagesData = await getAllImages(Number(id));
          setFotos(imagesData);

          const docsData = await getAllDocs(Number(id));
          setDocumentos(docsData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
      setRefresh(false);
    }
  }, [refresh, id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const funcData = await getUserInfo();
        setFuncionario(funcData);

        const imagesData = await getAllImages(Number(id));
        setFotos(imagesData);

        const docsData = await getAllDocs(Number(id));
        setDocumentos(docsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [id]);

  const filterPhotosByDate = (photos: PhotoData[]): PhotoData[] => {
    if (!dateFilter.startDate && !dateFilter.endDate) return photos;
    console.log('photos', photos);
    
    return photos.filter(photo => {
      // Converter data do formato DD/MM/YYYY para YYYY-MM-DD
      const [day, month, year] = photo.createdAt.split('/');
      const photoDate = new Date(`${year}-${month}-${day}`);
      
      // Verificar se a data é válida
      if (isNaN(photoDate.getTime())) {
        console.log('Data inválida:', photo.createdAt);
        return false;
      }
      
      console.log('photoDate', photoDate);
      const start = dateFilter.startDate ? new Date(dateFilter.startDate) : null;
      const end = dateFilter.endDate ? new Date(dateFilter.endDate) : null;
     
      if (start && end) {
        return photoDate >= start && photoDate <= end;
      } else if (start) {
        return photoDate >= start;
      } else if (end) {
        return photoDate <= end;
      }
      return true;
    });
  };
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

 
  const renderPhotos = (
    <div className='col-12'>
      <div className='card mb-4'>
        <div className='card-header'>Fotos</div>
        <div className='card-body'>
          <DateFilter onFilterChange={setDateFilter} />
          <div className='row'>
            {fotos?.Fornecedor &&
              _.chain(filterPhotosByDate(fotos.Fornecedor))
                .groupBy(foto => {
                  const [day, month, year] = foto.createdAt.split('/');
                  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                                    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
                  return `${monthNames[parseInt(month) - 1]} ${year}`;
                })
                .map((photos, monthYear) => (
                  selectedFolder === 'Fornecedor' && (
                    <div key={monthYear} className="w-100">
                      <div className='display-4 fw-bold py-3'>{monthYear}</div>
                      <div className='row'>
                        {photos.map((foto) => (
                          <div
                            className='col-md-3 mb-3'
                            key={foto.codigoDocumentoImagem}>
                            <div className='card h-100'>
                              <div
                                className='card-body'
                                onClick={() => window.open(foto.url, '_blank')}>
                                <img
                                  src={foto.url}
                                  className='img-fluid rounded'
                                  style={{
                                    height: '250px',
                                    width: '100%',
                                    objectFit: 'cover',
                                  }}
                                  alt="Foto"
                                />
                              </div>
                              <div className='text-center'>
                                {funcionario?.role !== 'Fornecedor'
                                  ? `${foto.nomeEmpresa} - ${foto.createdAt}`
                                  : foto.createdAt}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ))
                .value()}
  
            {fotos?.Fiscal &&
              _.chain(filterPhotosByDate(fotos.Fiscal))
                .groupBy(foto => {
                  const [day, month, year] = foto.createdAt.split('/');
                  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                                    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
                  return `${monthNames[parseInt(month) - 1]} ${year}`;
                })
                .map((photos, monthYear) => (
                  selectedFolder === 'Fiscal' && (
                    <div key={monthYear} className="w-100">
                      <div className='display-4 fw-bold py-3'>{monthYear}</div>
                      <div className='row'>
                        {photos.map((foto) => (
                          <div
                            className='col-md-3 mb-3'
                            key={foto.codigoDocumentoImagem}>
                            <div className='card h-100'>
                              <div
                                className='card-body'
                                onClick={() => window.open(foto.url, '_blank')}>
                                <img
                                  src={foto.url}
                                  className='img-fluid rounded'
                                  style={{
                                    height: '250px',
                                    width: '100%',
                                    objectFit: 'cover',
                                  }}
                                  alt="Foto"
                                />
                              </div>
                              <div className='text-center'>{foto.createdAt}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ))
                .value()}
  
            {fotos?.Dec &&
              _.chain(filterPhotosByDate(fotos.Dec))
                .groupBy(foto => {
                  const [day, month, year] = foto.createdAt.split('/');
                  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                                    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
                  return `${monthNames[parseInt(month) - 1]} ${year}`;
                })
                .map((photos, monthYear) => (
                  selectedFolder === 'Dec' && (
                    <div key={monthYear} className="w-100">
                      <div className='display-4 fw-bold py-3'>{monthYear}</div>
                      <div className='row'>
                        {photos.map((foto) => (
                          <div
                            className='col-md-3 mb-3'
                            key={foto.codigoDocumentoImagem}>
                            <div className='card h-100'>
                              <div
                                className='card-body'
                                onClick={() => window.open(foto.url, '_blank')}>
                                <img
                                  src={foto.url}
                                  className='img-fluid rounded'
                                  style={{
                                    height: '250px',
                                    width: '100%',
                                    objectFit: 'cover',
                                  }}
                                  alt="Foto"
                                />
                              </div>
                              <div className='text-center'>{foto.createdAt}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ))
                .value()}
          </div>
  
          {selectedFolder === funcionario?.role && (
            <>
              <Button
                color='secondary'
                onClick={() => setIsOpen(true)}
                style={{ marginRight: '12px' }}>
                Adicionar Ficheiro
              </Button>
              <FileUploadModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onUploadComplete={() => setIsOpen(false)}
                folder={'image'}
                codigoProjeto={typeof id === 'string' ? id : ''}
                setRefresh={setRefresh}
              />
            </>
          )}
          <Button color='secondary' onClick={() => setFolderPhotos(true)}>
            Voltar
          </Button>
        </div>
      </div>
    </div>
  );

  const renderFolders = (
    <div className='col-12'>
      <div className='card mb-4'>
        <div className='card-header'>Fotos</div>
        <div className='card-body'>
          <div className='row'>
            {/* Fornecedor */}
            <div
              className='col-md-4 mb-3'
              onClick={() => {
                setFolderPhotos(false);
                setSelectedFolder('Fornecedor');
              }}>
              <div className='card h-100'>
                <div className='card-body d-flex justify-content-center align-items-center'>
                  <div className='text-center'>
                    <img
                      src='https://i.imgur.com/zvuyPXm.png'
                      className='img-fluid rounded'
                      style={{
                        maxHeight: '200px',
                        objectFit: 'cover',
                      }}
                      alt="Fornecedor folder"
                    />
                    <p className='mt-2'>
                      {funcionario?.role !== 'Fornecedor'
                        ? 'Fornecedores'
                        : funcionario.empresa?.nome}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fiscalização */}
            <div
              className='col-md-4 mb-3'
              onClick={() => {
                setFolderPhotos(false);
                setSelectedFolder('Fiscal');
              }}>
              <div className='card h-100'>
                <div className='card-body d-flex justify-content-center align-items-center'>
                  <div className='text-center'>
                    <img
                      src='https://i.imgur.com/zvuyPXm.png'
                      className='img-fluid rounded'
                      style={{
                        maxHeight: '200px',
                        objectFit: 'cover',
                      }}
                      alt="Fiscal folder"
                    />
                    <p className='mt-2'>Fiscalização</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dec */}
            <div
              className='col-md-4 mb-3'
              onClick={() => {
                setFolderPhotos(false);
                setSelectedFolder('Dec');
              }}>
              <div className='card h-100'>
                <div className='card-body d-flex justify-content-center align-items-center'>
                  <div className='text-center'>
                    <img
                      src='https://i.imgur.com/zvuyPXm.png'
                      className='img-fluid rounded'
                      style={{
                        maxHeight: '200px',
                        objectFit: 'cover',
                      }}
                      alt="Dec folder"
                    />
                    <p className='mt-2'>Dec</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <PageWrapper>
      <Head>
        <title>Fotos e Documentação</title>
      </Head>

      <Page container='fluid'>
        <div className='row'>
          <div className='col-12'>
            <div className='display-4 fw-bold py-3'>Fotos e Documentação</div>
          </div>

          <div className='col-12 mb-3'>
            <Button
              className='me-2'
              color={secao === 'fotos' ? 'primary' : 'secondary'}
              onClick={() => setSecao('fotos')}>
              Fotos
            </Button>
            <Button
              className='me-2'
              color={secao === 'documentos' ? 'primary' : 'secondary'}
              onClick={() => setSecao('documentos')}>
              Documentação
            </Button>
            <Button
              color={secao === 'ambos' ? 'primary' : 'secondary'}
              onClick={() => setSecao('ambos')}>
              Ambos
            </Button>
          </div>

          {secao === 'fotos' ? (folderPhotos ? renderFolders : renderPhotos) : null}

          {secao === 'documentos' && (
            <div className='col-12'>
              <div className='card'>
                <div className='card-header'>
                  Documentação
                  {funcionario?.role === 'Dec' && (
                    <>
                      <Button
                        color='secondary'
                        onClick={() => setIsOpen(true)}>
                        Adicionar Ficheiro
                      </Button>
                      <FileUploadModal
                        isOpen={isOpen}
                        onClose={() => setIsOpen(false)}
                        onUploadComplete={() => setIsOpen(false)}
                        folder={'doc'}
                        codigoProjeto={typeof id === 'string' ? id : ''}
                        setRefresh={setRefresh}
                      />
                    </>
                  )}
                </div>
                <div className='card-body'>
                  {documentos?.docs.map((doc) => (
                    <div key={doc.codigoDocumentoImagem} className='mb-3'>
                      <a
                        href={doc.url}
                        target='_blank'
                        rel='noreferrer'
                        className='text-decoration-none'>
                        {`${doc.nomeFicheiro} - ${doc.createdAt}`}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
					{secao === 'ambos' && (
						<>
							{folderPhotos ? renderFolders : renderPhotos}
							<div className='col-12'>
								<div className='card'>
									<div className='card-header'>
										Documentação
										{funcionario?.role === 'Dec' && (
											<>
												<Button
													color='secondary'
													onClick={() => setIsOpen(true)}>
													Adicionar Ficheiro
												</Button>
												<FileUploadModal
													isOpen={isOpen}
													onClose={() => setIsOpen(false)}
													onUploadComplete={() => setIsOpen(false)}
													folder={'*'}
													codigoProjeto={typeof id === 'string' ? id : ''}
													setRefresh={setRefresh}
												/>
											</>
										)}
									</div>
									<div className='card-body'>
										{documentos?.docs.map((doc) => (
											<div key={doc.codigoDocumentoImagem} className='mb-3'>
												<a
													href={doc.url}
													target='_blank'
													rel='noreferrer'
													className='text-decoration-none'>
													{`${doc.nomeFicheiro}`}
												</a>
												<span className='ms-2'>
												- {new Date(doc.createdAt).toLocaleDateString('pt-PT')}
												<span className='ms-2'>
													
												</span>
												</span>
												
											</div>
										))}
									</div>
								</div>
							</div>
						</>
					)}
				</div>
			</Page>
		</PageWrapper>
	);
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
	props: {
		...(await serverSideTranslations(locale!, ['common', 'menu'])),
	},
});

export async function getStaticPaths() {
	return {
		paths: ['/fotosProj/fotosDocumentacao/1', { params: { id: '1' } }],
		fallback: true,
	};
}

export default Index;
