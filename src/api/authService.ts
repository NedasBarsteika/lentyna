// src/api/authService.ts
import { api } from './config';
import type { AuthResponse, LoginDto, RegisterDto, UpdateProfileDto, User } from '../types';

export const authService = {
  // POST /api/auth/prisijungti
  login: async (data: LoginDto): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/prisijungti', data);
    return response.data;
  },

  // POST /api/auth/registruotis
  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/registruotis', data);
    return response.data;
  },

  // GET /api/auth/profilis
  getProfile: async (): Promise<User> => {
    const response = await api.get<User>('/auth/profilis');
    return response.data;
  },

  // PUT /api/auth/profilis
  updateProfile: async (data: UpdateProfileDto): Promise<User> => {
    const response = await api.put<User>('/auth/profilis', data);
    return response.data;
  },

  // DELETE /api/auth/profilis
  deleteProfile: async (): Promise<void> => {
    await api.delete('/auth/profilis');
  },

  // PUT /api/auth/naudotojai/{id}/role (admin only)
  changeUserRole: async (userId: string, roleNumber: number): Promise<void> => {
    await api.put(`/auth/naudotojai/${userId}/role`, { role: roleNumber });
  },

  // GET /api/auth/naudotojai (admin only)
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/auth/naudotojai');
    return response.data;
  },

  // DELETE /api/auth/naudotojai/{id} (admin only)
  deleteUser: async (userId: string): Promise<void> => {
    await api.delete(`/auth/naudotojai/${userId}`);
  },
};
