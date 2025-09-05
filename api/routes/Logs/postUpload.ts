// In your api/routes/upload.ts file:
import api from '../../api';

// Change to default export
const postUpload = async (files: File[], codigoProjeto: string) => {
    try {
        const formData = new FormData();
        
        files.forEach((file) => {
            formData.append('files', file);
        });
        
        formData.append('codigoProjeto', codigoProjeto);
        
        const res = await api.post('/logs/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        
        return res.data;
    } catch (err: any) {
        if (err.response) {
            throw new Error(err.response.data.message || 'Error uploading files');
        }
        throw new Error('Network error while uploading files');
    }
};

export default postUpload;