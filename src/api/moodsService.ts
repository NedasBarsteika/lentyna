// src/api/moodsService.ts
import { api } from './config';
import type { Mood } from '../types';

export const moodsService = {
  // GET /api/nuotaikos
  getAll: async (): Promise<Mood[]> => {
    const response = await api.get<Mood[]>('/nuotaikos');
    return response.data;
  },

  // POST /api/nuotaikos (editor/admin)
  create: async (pavadinimas: string): Promise<Mood> => {
    const response = await api.post<Mood>('/nuotaikos', { pavadinimas });
    return response.data;
  },

  // DELETE /api/nuotaikos/{id} (editor/admin)
  delete: async (id: string): Promise<void> => {
    await api.delete(`/nuotaikos/${id}`);
  },
};
