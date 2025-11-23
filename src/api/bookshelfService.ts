// src/api/bookshelfService.ts
import { api } from './config';
import type { BookshelfEntry, BookshelfCreateDto, BookshelfUpdateDto, BookRecommendation, BookshelfStatus } from '../types';

export interface BookshelfQueryParams {
  tipas?: BookshelfStatus;
}

export const bookshelfService = {
  // GET /api/irasai
  getAll: async (params?: BookshelfQueryParams): Promise<BookshelfEntry[]> => {
    const response = await api.get<BookshelfEntry[]>('/irasai', { params });
    return response.data;
  },

  // GET /api/irasai/rekomendacijos
  getRecommendations: async (): Promise<BookRecommendation[]> => {
    const response = await api.get<BookRecommendation[]>('/irasai/rekomendacijos');
    return response.data;
  },

  // POST /api/irasai
  create: async (data: BookshelfCreateDto): Promise<BookshelfEntry> => {
    const response = await api.post<BookshelfEntry>('/irasai', data);
    return response.data;
  },

  // PUT /api/irasai/{id}
  update: async (id: string, data: BookshelfUpdateDto): Promise<BookshelfEntry> => {
    const response = await api.put<BookshelfEntry>(`/irasai/${id}`, data);
    return response.data;
  },

  // DELETE /api/irasai/{id}
  delete: async (id: string): Promise<void> => {
    await api.delete(`/irasai/${id}`);
  },
};
