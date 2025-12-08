// src/api/booksService.ts
import { api } from './config';
import type { PaginatedResponse } from './config';
import type { Book, BookCreateDto, BookUpdateDto, BookSearchDto, Review, Genre, Mood, MoodCreateDto } from '../types';

export interface BooksQueryParams {
  page?: number;
  pageSize?: number;
  paieska?: string;
  zanrasId?: string;
  autoriusId?: string;
  bestseleris?: boolean;
  sortBy?: 'pavadinimas' | 'leidimo_metai';
  descending?: boolean;
}

export const booksService = {
  // GET /api/knygos
  getAll: async (params?: BooksQueryParams): Promise<PaginatedResponse<Book>> => {
    const response = await api.get<PaginatedResponse<Book>>('/knygos', { params });
    return response.data;
  },

  // GET /api/knygos/{id}
  getById: async (id: string): Promise<Book> => {
    const response = await api.get<Book>(`/knygos/${id}`);
    return response.data;
  },

  // GET /api/knygos/{id}/komentarai
  getBookReviews: async (bookId: string): Promise<Review[]> => {
    const response = await api.get<Review[]>(`/knygos/${bookId}/komentarai`);
    return response.data;
  },

  // POST /api/knygos (editor/admin)
  create: async (data: BookCreateDto): Promise<Book> => {
    const response = await api.post<Book>('/knygos', data);
    return response.data;
  },

  // PUT /api/knygos/{id} (editor/admin)
  update: async (id: string, data: BookUpdateDto): Promise<Book> => {
    const response = await api.put<Book>(`/knygos/${id}`, data);
    return response.data;
  },

  // DELETE /api/knygos/{id} (editor/admin)
  delete: async (id: string): Promise<void> => {
    await api.delete(`/knygos/${id}`);
  },

  // POST /api/knygos/isplestine-paieska
  advancedSearch: async (data: BookSearchDto): Promise<Book[]> => {
    const response = await api.post<Book[]>('/knygos/isplestine-paieska', data);
    return response.data;
  },

  // GET /api/knygos/zanrai
  getGenres: async (): Promise<Genre[]> => {
    const response = await api.get<Genre[]>('/knygos/zanrai');
    return response.data;
  },

  // POST /api/knygos/zanrai (editor/admin)
  createGenre: async (pavadinimas: string): Promise<Genre> => {
    const response = await api.post<Genre>('/knygos/zanrai', { pavadinimas });
    return response.data;
  },

  // DELETE /api/knygos/zanrai/{id} (editor/admin)
  deleteGenre: async (id: string): Promise<void> => {
    await api.delete(`/knygos/zanrai/${id}`);
  },

  // GET /api/knygos/nuotaikos
  getMoods: async (): Promise<Mood[]> => {
    const response = await api.get<Mood[]>('/knygos/nuotaikos');
    return response.data;
  },

  // POST /api/knygos/nuotaikos (editor/admin)
  createMood: async (data: MoodCreateDto): Promise<Mood> => {
    const response = await api.post<Mood>('/knygos/nuotaikos', data);
    return response.data;
  },

  // DELETE /api/knygos/nuotaikos/{id} (editor/admin)
  deleteMood: async (id: string): Promise<void> => {
    await api.delete(`/knygos/nuotaikos/${id}`);
  },
};
