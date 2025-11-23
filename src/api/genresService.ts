// src/api/genresService.ts
import { api } from './config';
import type { Genre } from '../types';

export const genresService = {
  // GET /api/zanrai
  getAll: async (): Promise<Genre[]> => {
    const response = await api.get<Genre[]>('/zanrai');
    return response.data;
  },

  // POST /api/zanrai (editor/admin)
  create: async (pavadinimas: string): Promise<Genre> => {
    const response = await api.post<Genre>('/zanrai', { pavadinimas });
    return response.data;
  },

  // DELETE /api/zanrai/{id} (editor/admin)
  delete: async (id: string): Promise<void> => {
    await api.delete(`/zanrai/${id}`);
  },
};
