import { useState } from 'react';

export type FileState = {
  file: File | string;
  key: string;
  progress: 'PENDING' | 'COMPLETE' | 'ERROR' | number;
};

type MultiImageProps = {
  value?: FileState[];
  onChange?: (files: FileState[]) => void;
  onFilesAdded?: (addedFiles: FileState[]) => void;
  maxFiles?: number;
  folder?: string;
};

export default function MultiImage({
  value = [],
  onChange,
  onFilesAdded,
  maxFiles = 4,
  folder 
}: MultiImageProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      if (value.length + files.length > maxFiles) {
        alert(`You can only upload up to ${maxFiles} files`);
        return;
      }

      const addedFiles = files.map<FileState>((file) => ({
        file,
        key: Math.random().toString(36).slice(2),
        progress: 'PENDING',
      }));

      onFilesAdded?.(addedFiles);
      onChange?.([...value, ...addedFiles]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const files = Array.from(e.target.files);
      if (value.length + files.length > maxFiles) {
        alert(`You can only upload up to ${maxFiles} files`);
        return;
      }

      const addedFiles = files.map<FileState>((file) => ({
        file,
        key: Math.random().toString(36).slice(2),
        progress: 'PENDING',
      }));

      onFilesAdded?.(addedFiles);
      onChange?.([...value, ...addedFiles]);
    }
  };

  const removeFile = (index: number) => {
    onChange?.(value.filter((_, i) => i !== index));
  };

  const renderFilePreview = (fileState: FileState) => {
    if (fileState.file instanceof File) {
      // Se for uma imagem, mostra a visualização normal
      if (fileState.file.type.startsWith('image/')) {
        return (
          <img
            src={URL.createObjectURL(fileState.file)}
            alt="upload preview"
            style={{
              width: '200px',
              height: '200px',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
        );
      }
      // Se for PDF, mostra o ícone do PDF e o nome do arquivo
      if (fileState.file.type === 'application/pdf') {
        return (
          <div
            style={{
              width: '200px',
              height: '200px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#f3f4f6',
              borderRadius: '8px',
              position: 'relative',
            }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/337/337946.png"
              alt="PDF icon"
              style={{
                width: '50px',
                height: '50px',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                fontSize: '0.875rem',
                color: '#4b5563',
                textAlign: 'center',
                width: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {fileState.file.name}
            </div>
          </div>
        );
      }
    }
    return null;
  };
  

  return (
    <div
      style={{
        width: '100%',
        padding: '1rem',
      }}
    >
      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        style={{
          marginBottom: '1rem',
          padding: '1.5rem',
          border: '2px dashed',
          borderRadius: '0.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'background-color 0.3s, border-color 0.3s',
          backgroundColor: dragActive ? '#e0f2fe' : '',
          borderColor: dragActive ? '#3b82f6' : '#d1d5db',
        }}
      >
        <input
          type="file"
          multiple
          accept={ 
            folder === '*' ? 'image/*, application/pdf' :
            folder === 'image' ? 'image/*' :
            folder === 'pdf' ? 'application/pdf' : ''
          }
          onChange={handleFileInput}
          style={{
            position: 'absolute',
            opacity: 0,
            cursor: 'pointer',
            width: '100%',
            height: '100px',
          }}
        />
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#9ca3af',
              marginBottom: '0.5rem',
            }}
          >
            +
          </div>
          <div style={{ fontSize: '0.875rem', color: '#4b5563' }}>
            Drop images or PDF files here or click to upload
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
            {maxFiles - value.length} files remaining
          </div>
        </div>
      </div>

      {/* Image Previews */}
      {value.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.75rem',
          }}
        >
          {value.slice(0, maxFiles).map((fileState, index) => (
            <div key={fileState.key} style={{ position: 'relative', width: '200px' }}>
              <div
                className="text-center"
                style={{
                  flexBasis: '50%',
                  marginBottom: '12px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '200px',
                  width: '200px',
                  overflow: 'hidden',
                  borderRadius: '8px',
                }}
              >
                {renderFilePreview(fileState)}
              </div>

              {/* Progress Overlay */}
              {typeof fileState.progress === 'number' && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {Math.round(fileState.progress)}%
                  </span>
                </div>
              )}

              {/* Remove Button */}
              {fileState.progress === 'PENDING' && (
                <button
                  onClick={() => removeFile(index)}
                  style={{
                    position: 'absolute',
                    top: '0.25rem',
                    right: '0.25rem',
                    backgroundColor: 'white',
                    color: '#4b5563',
                    borderRadius: '9999px',
                    width: '1.5rem',
                    height: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.875rem',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s',
                  }}
                >
                  ×
                </button>
              )}

              {/* Status Indicator */}
              {fileState.progress === 'COMPLETE' && (
                <div className="absolute bottom-1 right-1 bg-green-500 rounded-full w-3 h-3 border-2 border-white" />
              )}
              {fileState.progress === 'ERROR' && (
                <div className="absolute bottom-1 right-1 bg-red-500 rounded-full w-3 h-3 border-2 border-white" />
              )}
            </div>
          ))}

          {/* Message for extra files */}
          {value.length > maxFiles && (
            <div className="col-span-3 text-center text-sm text-red-500 font-semibold">
              Maximum of {maxFiles} files allowed.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
