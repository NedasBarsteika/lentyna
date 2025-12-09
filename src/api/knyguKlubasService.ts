// src/api/knyguKlubasService.ts
import { api } from './config';
import type { Voting, VotingCreateDto, VoteDto, WeatherForecast, UserVoteStatus } from '../types';

export const knyguKlubasService = {
  // GET /api/knygu-klubas/dabartinis
  getCurrent: async (): Promise<Voting | null> => {
    const response = await api.get<Voting>('/knygu-klubas/dabartinis');
    return response.data;
  },

  // GET /api/knygu-klubas/{id}
  getById: async (id: string): Promise<Voting> => {
    const response = await api.get<Voting>(`/knygu-klubas/${id}`);
    return response.data;
  },

  // POST /api/knygu-klubas (admin only)
  create: async (data: VotingCreateDto): Promise<Voting> => {
    const response = await api.post<Voting>('/knygu-klubas', data);
    return response.data;
  },

  // GET /api/knygu-klubas/{id}/oro-prognoze
  getWeatherForecast: async (votingId: string): Promise<WeatherForecast> => {
    const response = await api.get<WeatherForecast>(`/knygu-klubas/${votingId}/oro-prognoze`);
    return response.data;
  },

  // POST /api/knygu-klubas/balsai
  vote: async (data: VoteDto): Promise<void> => {
    await api.post('/knygu-klubas/balsai', data);
  },

  // DELETE /api/knygu-klubas/balsai/{id}
  removeVote: async (id: string): Promise<void> => {
    await api.delete(`/knygu-klubas/balsai/${id}`);
  },

  // GET /api/knygu-klubas/{id}/mano-balsas
  getMyVote: async (votingId: string): Promise<UserVoteStatus> => {
    const response = await api.get<UserVoteStatus>(`/knygu-klubas/${votingId}/mano-balsas`);
    return response.data;
  },
};
