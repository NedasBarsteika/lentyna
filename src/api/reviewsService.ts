// src/api/reviewsService.ts
import { api } from './config';
import type { Review, ReviewCreateDto, ReviewUpdateDto, AIComment } from '../types';

export const reviewsService = {
  // GET /api/komentarai/knyga/{knygaId}
  getByBookId: async (bookId: string): Promise<Review[]> => {
    const response = await api.get<Review[]>(`/komentarai/knyga/${bookId}`);
    return response.data;
  },

  // POST /api/komentarai
  create: async (data: ReviewCreateDto): Promise<Review> => {
    const response = await api.post<Review>('/komentarai', data);
    return response.data;
  },

  // PUT /api/komentarai/{id}
  update: async (id: string, data: ReviewUpdateDto): Promise<Review> => {
    const response = await api.put<Review>(`/komentarai/${id}`, data);
    return response.data;
  },

  // DELETE /api/komentarai/{id}
  delete: async (id: string): Promise<void> => {
    await api.delete(`/komentarai/${id}`);
  },

   // GET /api/knygos/{id}/komentarai
    getBookReviews: async (bookId: string): Promise<Review[]> => {
      const response = await api.get<Review[]>(`/komentarai/komentarai/${bookId}`);
      return response.data;
    },

     // GET /api/komentarai/knyga/{knygaId}
    getDIComment: async (bookId: string): Promise<AIComment> => {
    const response = await api.get<AIComment>(`/komentarai/dikomentaras/${bookId}`);
    return response.data;
  },


};
