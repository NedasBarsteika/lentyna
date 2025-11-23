// src/api/forumService.ts
import { api } from './config';
import type { PaginatedResponse } from './config';
import type { ForumTopic, ForumTopicCreateDto, ForumTopicUpdateDto, ForumComment, ForumCommentCreateDto } from '../types';

export interface TopicsQueryParams {
  page?: number;
  pageSize?: number;
}

export const forumService = {
  // GET /api/temos
  getAllTopics: async (params?: TopicsQueryParams): Promise<PaginatedResponse<ForumTopic>> => {
    const response = await api.get<PaginatedResponse<ForumTopic>>('/temos', { params });
    return response.data;
  },

  // GET /api/temos/{id}
  getTopicById: async (id: string): Promise<ForumTopic> => {
    const response = await api.get<ForumTopic>(`/temos/${id}`);
    return response.data;
  },

  // GET /api/temos/{id}/komentarai
  getTopicComments: async (topicId: string): Promise<ForumComment[]> => {
    const response = await api.get<ForumComment[]>(`/temos/${topicId}/komentarai`);
    return response.data;
  },

  // POST /api/temos
  createTopic: async (data: ForumTopicCreateDto): Promise<ForumTopic> => {
    const response = await api.post<ForumTopic>('/temos', data);
    return response.data;
  },

  // PUT /api/temos/{id}
  updateTopic: async (id: string, data: ForumTopicUpdateDto): Promise<ForumTopic> => {
    const response = await api.put<ForumTopic>(`/temos/${id}`, data);
    return response.data;
  },

  // DELETE /api/temos/{id}
  deleteTopic: async (id: string): Promise<void> => {
    await api.delete(`/temos/${id}`);
  },

  // PUT /api/temos/{id}/prikabinti (moderator/admin)
  togglePinTopic: async (id: string): Promise<void> => {
    await api.put(`/temos/${id}/prikabinti`);
  },

  // POST /api/temos/{id}/komentarai
  addComment: async (topicId: string, data: ForumCommentCreateDto): Promise<ForumComment> => {
    const response = await api.post<ForumComment>(`/temos/${topicId}/komentarai`, data);
    return response.data;
  },
};
