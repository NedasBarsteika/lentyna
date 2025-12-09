// src/api/followingService.ts
import { api } from "./config";
import type { Following, FollowDto } from "../types";

export const followingService = {
  // GET /api/sekimai
  getAll: async (): Promise<Following[]> => {
    const response = await api.get<Following[]>("/autoriai/sekimai");
    return response.data;
  },

  // GET /api/sekimai/tikrinti/{autoriusId}
  isFollowing: async (authorId: string): Promise<boolean> => {
    const response = await api.get<{ isFollowing: boolean }>(
      `/autoriai/sekimai/tikrinti/${authorId}`,
    );
    return response.data.isFollowing;
  },

  // POST /api/sekimai
  follow: async (data: FollowDto): Promise<{ isFollowing: boolean }> => {
    const response = await api.post<{ isFollowing: boolean }>(
      "/autoriai/sekimai",
      data,
    );
    return response.data;
  },

  // DELETE /api/sekimai/{autoriusId}
  unfollow: async (authorId: string): Promise<void> => {
    await api.delete(`/autoriai/sekimai/${authorId}`);
  },
};
