// src/api/votingService.ts
import { api } from './config';
import type { Voting, VotingCreateDto, VoteDto, WeatherForecast } from '../types';

export const votingService = {
  // GET /api/balsavimai/dabartinis
  getCurrent: async (): Promise<Voting | null> => {
    const response = await api.get<Voting>('/balsavimai/dabartinis');
    return response.data;
  },

  // GET /api/balsavimai/{id}
  getById: async (id: string): Promise<Voting> => {
    const response = await api.get<Voting>(`/balsavimai/${id}`);
    return response.data;
  },

  // POST /api/balsavimai (admin only)
  create: async (data: VotingCreateDto): Promise<Voting> => {
    const response = await api.post<Voting>('/balsavimai', data);
    return response.data;
  },

  // GET /api/balsavimai/{id}/oro-prognoze
  getWeatherForecast: async (votingId: string): Promise<WeatherForecast> => {
    const response = await api.get<WeatherForecast>(`/balsavimai/${votingId}/oro-prognoze`);
    return response.data;
  },

  // POST /api/balsai
  vote: async (data: VoteDto): Promise<void> => {
    await api.post('/balsai', data);
  },

  // DELETE /api/balsai/{id}
  removeVote: async (id: string): Promise<void> => {
    await api.delete(`/balsai/${id}`);
  },
};
