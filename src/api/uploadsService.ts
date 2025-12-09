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
  // Profilio nuotrauka (visi prisijungę)
  uploadProfilePhoto: (file: File): Promise<string> => {
    return uploadFile('/auth/profilis/nuotrauka', file);
  },

  // Knygos viršelis (redaktorius, admin) - NOW REQUIRES book ID
  uploadBookCover: (bookId: string, file: File): Promise<string> => {
    return uploadFile(`/knygos/${bookId}/virselis`, file);
  },

  // Autoriaus nuotrauka (redaktorius, admin) - NOW REQUIRES author ID
  uploadAuthorPhoto: (authorId: string, file: File): Promise<string> => {
    return uploadFile(`/autoriai/${authorId}/nuotrauka`, file);
  },

  // Ištrinti profilio nuotrauką
  deleteProfilePhoto: async (): Promise<void> => {
    await api.delete('/auth/profilis/nuotrauka');
  },

  // Ištrinti knygos viršelį
  deleteBookCover: async (bookId: string): Promise<void> => {
    await api.delete(`/knygos/${bookId}/virselis`);
  },

  // Ištrinti autoriaus nuotrauką
  deleteAuthorPhoto: async (authorId: string): Promise<void> => {
    await api.delete(`/autoriai/${authorId}/nuotrauka`);
  },
};
