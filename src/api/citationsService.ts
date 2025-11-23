// src/api/citationsService.ts
import { api } from './config';
import type { Citation, CitationCreateDto } from '../types';

export const citationsService = {
  // GET /api/citatos/autorius/{autoriusId}
  getByAuthorId: async (authorId: string): Promise<Citation[]> => {
    const response = await api.get<Citation[]>(`/citatos/autorius/${authorId}`);
    return response.data;
  },

  // POST /api/citatos (editor/admin)
  create: async (data: CitationCreateDto): Promise<Citation> => {
    const response = await api.post<Citation>('/citatos', data);
    return response.data;
  },

  // DELETE /api/citatos/{id} (editor/admin)
  delete: async (id: string): Promise<void> => {
    await api.delete(`/citatos/${id}`);
  },
};
