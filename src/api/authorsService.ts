// src/api/authorsService.ts
import { api } from "./config";
import type { PaginatedResponse } from "./config";
import type {
  Author,
  AuthorCreateDto,
  AuthorUpdateDto,
  Book,
  Citation,
  CitationCreateDto,
} from "../types";

export interface AuthorsQueryParams {
  page?: number;
  pageSize?: number;
}

export const authorsService = {
  // GET /api/autoriai
  getAll: async (
    params?: AuthorsQueryParams,
  ): Promise<PaginatedResponse<Author>> => {
    const response = await api.get<PaginatedResponse<Author>>("/autoriai", {
      params,
    });
    return response.data;
  },

  // GET /api/autoriai/{id}
  getById: async (id: string): Promise<Author> => {
    const response = await api.get<Author>(`/autoriai/${id}`);
    return response.data;
  },

  // GET /api/autoriai/{id}/knygos
  getAuthorBooks: async (authorId: string): Promise<Book[]> => {
    const response = await api.get<Book[]>(`/autoriai/${authorId}/knygos`);
    return response.data;
  },

  // GET /api/autoriai/{id}/citatos
  getAuthorCitations: async (authorId: string): Promise<Citation[]> => {
    const response = await api.get<Citation[]>(`/autoriai/${authorId}/citatos`);
    return response.data;
  },

  // POST /api/autoriai (editor/admin)
  create: async (data: AuthorCreateDto): Promise<Author> => {
    const response = await api.post<Author>("/autoriai", data);
    return response.data;
  },

  // PUT /api/autoriai/{id} (editor/admin)
  update: async (id: string, data: AuthorUpdateDto): Promise<Author> => {
    const response = await api.put<Author>(`/autoriai/${id}`, data);
    return response.data;
  },

  // DELETE /api/autoriai/{id} (editor/admin)
  delete: async (id: string): Promise<void> => {
    await api.delete(`/autoriai/${id}`);
  },

  // POST /api/citatos (editor/admin)
  createcitata: async (data: CitationCreateDto): Promise<Citation> => {
    const response = await api.post<Citation>("/autoriai/citatos", data);
    return response.data;
  },

  // POST /pranesimai/nauja-knyga/{knygaId}
  sendEmail: async (id: string): Promise<Citation> => {
    const response = await api.post(`/autoriai/pranesimai/nauja-knyga/${id}`);
    return response.data;
  },

  // DELETE /api/citatos/{id} (editor/admin)
  deletecitata: async (id: string): Promise<void> => {
    await api.delete(`/autoriai/citatos/${id}`);
  },
};
