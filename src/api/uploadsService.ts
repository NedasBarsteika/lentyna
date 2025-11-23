// src/api/uploadsService.ts
import { api } from './config';

interface UploadResponse {
  url: string;
}

const uploadFile = async (endpoint: string, file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post<UploadResponse>(endpoint, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.url;
};

export const uploadsService = {
  // Bendra nuotrauka (visi prisijungę)
  uploadImage: (file: File): Promise<string> => {
    return uploadFile('/uploads/image', file);
  },

  // Knygos viršelis (redaktorius, admin)
  uploadBookCover: (file: File): Promise<string> => {
    return uploadFile('/uploads/knygos/virselis', file);
  },

  // Autoriaus nuotrauka (redaktorius, admin)
  uploadAuthorPhoto: (file: File): Promise<string> => {
    return uploadFile('/uploads/autoriai/nuotrauka', file);
  },

  // Profilio nuotrauka (visi prisijungę)
  uploadProfilePhoto: (file: File): Promise<string> => {
    return uploadFile('/uploads/profilis/nuotrauka', file);
  },

  // Ištrinti nuotrauką (redaktorius, admin)
  deleteImage: async (url: string): Promise<void> => {
    await api.delete('/uploads', { params: { url } });
  },
};
