// src/api/booksService.ts
import { api } from './config';
import type { PaginatedResponse } from './config';
import type { Book, BookCreateDto, BookUpdateDto, BookSearchDto } from '../types';

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
};
