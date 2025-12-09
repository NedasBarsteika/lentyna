// src/api/nuomoniuForumasService.ts
import { api } from "./config";
import type { PaginatedResponse } from "./config";
import type {
  ForumTopic,
  ForumTopicCreateDto,
  ForumTopicUpdateDto,
} from "../types";

export interface TopicsQueryParams {
  page?: number;
  pageSize?: number;
}

export const nuomoniuForumasService = {
  // GET /api/nuomoniu-forumas
  getAllTopics: async (
    params?: TopicsQueryParams,
  ): Promise<PaginatedResponse<ForumTopic>> => {
    const response = await api.get<PaginatedResponse<ForumTopic>>("/nuomoniu-forumas", {
      params,
    });
    return response.data;
  },

  // GET /api/nuomoniu-forumas/{id}
  getTopicById: async (id: string): Promise<ForumTopic> => {
    const response = await api.get<ForumTopic>(`/nuomoniu-forumas/${id}`);
    return response.data;
  },

  // POST /api/nuomoniu-forumas
  createTopic: async (data: ForumTopicCreateDto): Promise<ForumTopic> => {
    const response = await api.post<ForumTopic>("/nuomoniu-forumas", data);
    return response.data;
  },

  // PUT /api/nuomoniu-forumas/{id}
  updateTopic: async (
    id: string,
    data: ForumTopicUpdateDto,
  ): Promise<ForumTopic> => {
    const response = await api.put<ForumTopic>(`/nuomoniu-forumas/${id}`, data);
    return response.data;
  },

  // DELETE /api/nuomoniu-forumas/{id}
  deleteTopic: async (id: string): Promise<void> => {
    await api.delete(`/nuomoniu-forumas/${id}`);
  },

  // PUT /api/nuomoniu-forumas/{id}/prikabinti (moderator/admin)
  togglePinTopic: async (id: string): Promise<void> => {
    await api.put(`/nuomoniu-forumas/${id}/prikabinti`);
  },
};
