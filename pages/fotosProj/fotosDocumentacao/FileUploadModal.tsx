// In your FileUploadModal.tsx:
import React, { useState } from 'react';
import Button from '../../../components/bootstrap/Button';
import MultiImage, { type FileState } from './MultiImage';
import { postUpload } from '../../../api/routes';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: (files: File[]) => void;
  folder: string;
  setRefresh: (value: boolean) => void;
  codigoProjeto: string;
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({
  isOpen,
  onClose,
  onUploadComplete,
  folder,
  setRefresh,
  codigoProjeto
}) => {
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  async function handleUpload() {
    setIsUploading(true);
    
    try {
      const files = fileStates
        .filter(state => state.file instanceof File)
        .map(state => state.file as File);

      // Use the imported postUpload function
      await postUpload(files, codigoProjeto);
      
      onUploadComplete(files);
      setFileStates([]);
      setRefresh(true);
      onClose();
    } catch (error) {
      console.error('Error processing files:', error);
      // Optionally add error handling UI here
    } finally {
      setIsUploading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Carrega Imagens ou PDFs</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Seleciona as Imagens ou PDFs</label>
              <MultiImage
                value={fileStates}
                maxFiles={4}
                folder={folder}
                onChange={(files: FileState[]) => {
                  setFileStates(files);
                }}
              />
            </div>
          </div>
          <div className="modal-footer">
            <Button color="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              color="primary" 
              onClick={handleUpload}
             
            >
              {isUploading ? 'Processando...' : 'Confirmar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploadModal;