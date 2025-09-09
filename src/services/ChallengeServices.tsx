import { url } from "../app/url";
import type { ReadingChallenge as Challenge, ChallengeProgress, LeaderboardEntry, ChallengeFilters , Badge } from "../app/types/readingChallenge";
import type { PaginatedResponse, UserStats } from "../app/types/user";
import { getData, postData, putData, deleteData, getDatawithMetaData, uploadMultimedia, updateMultimedia } from "../app/api";



interface UserProgress {
  user_id: string;
  username: string;
  email: string;
  progress: {
    books_completed: number;
    target_count: number;
    percentage: number;
    has_badge: boolean;
  };
  joined_at: string;
}

interface BulkUpdateResult {
  success_count: number;
  failure_count: number;
  failed_ids: string[];
}

export const challengeService = {
  // Existing methods (kept as provided)
  getChallenges: async (filters: ChallengeFilters = {}, perPage: number = 20) => {
    const params = new URLSearchParams();
    if (filters.active !== undefined) params.append('active', filters.active.toString());
    if (filters.current !== undefined) params.append('current', filters.current.toString());
    if (filters.search) params.append('search', filters.search);
    params.append('per_page', perPage.toString());

    const response = await getDatawithMetaData<PaginatedResponse<Challenge>>(`${url.challenge.index}?${params.toString()}`);
    return response;
  },

  getChallenge: async (id: string): Promise<Challenge> => {
    const response = await getDatawithMetaData<Challenge>(url.challenge.show(id));
    return response.data;
  },

  createChallenge: async (data: Partial<Challenge>): Promise<Challenge> => {
    const response = await postData<Challenge>(url.challenge.store, data);
    return response.data;
  },

  updateChallenge: async (id: string, data: Partial<Challenge>): Promise<Challenge> => {
    const response = await putData<Challenge>(url.challenge.update(id), data);
    return response.data;
  },

  deleteChallenge: async (id: string): Promise<void> => {
    await deleteData(url.challenge.destroy(id));
  },

  joinChallenge: async (id: string): Promise<Challenge> => {
    const response = await postData<Challenge>(url.challenge.join(id), {});
    return response.data;
  },

  addBookToChallenge: async (challengeId: string, bookId: string, status: string): Promise<void> => {
    await postData(url.challenge.addBook(challengeId), { book_id: bookId, status });
  },

  updateBookStatus: async (recordId: string, status: string, rating?: number, review?: string): Promise<void> => {
    await putData(url.challenge.updateBook(recordId), { status, rating, review });
  },

  getProgress: async (challengeId: string): Promise<ChallengeProgress> => {
    const response = await getData(url.challenge.progress(challengeId));
    return response.data;
  },

  getLeaderboard: async (challengeId: string): Promise<LeaderboardEntry[]> => {
    const response = await getData(url.challenge.leaderboard(challengeId));
    return response.data;
  },

 getParticipants: async (challengeId: string, params: { page?: number; per_page?: number }) => {
    

  const response = await getDatawithMetaData<PaginatedResponse<UserProgress>>(`/admin/challenges/${challengeId}/users?${params.toString()}`);
  return response;
},

  bulkUpdate: async (challengeIds: string[], updates: Partial<Challenge>): Promise<BulkUpdateResult> => {
    const response = await postData<BulkUpdateResult>('/admin/challenges/bulk-update', {
      challenge_ids: challengeIds,
      updates,
    });
    return response.data;
  },

  removeParticipant: async (challengeId: string, userId: string): Promise<void> => {
    await postData(`/admin/challenges/${challengeId}/remove-user/${userId}`, {});
  },

  resetParticipantProgress: async (challengeId: string, userId: string): Promise<void> => {
    await postData(`/admin/challenges/${challengeId}/reset-progress/${userId}`, {});
  },

  awardBadge: async (challengeId: string, userId: string, badgeId: string): Promise<void> => {
    await postData(`/admin/challenges/${challengeId}/award-badge/${userId}`, { badge_id: badgeId });
  },

  revokeBadge: async (challengeId: string, userId: string, badgeId: string): Promise<void> => {
    await postData(`/admin/challenges/${challengeId}/revoke-badge/${badgeId}`, { user_id: userId });
  },

  getChallengeStats: async (): Promise<UserStats> => {
    const response = await getData('/admin/challenges/stats');
    return response.data; 
  },
  // Badge-related methods
  getBadges: async (perPage: number = 20) => {
    const params = new URLSearchParams();
    params.append('per_page', perPage.toString());
    const response = await getDatawithMetaData<PaginatedResponse<Badge>>(`/badge?${params.toString()}`);
    return response;
  },

  getBadge: async (id: string): Promise<Badge> => {
    const response = await getDatawithMetaData<Badge>(url.badge.show(id));
    return response.data;
  },

  createBadge: async (data: FormData): Promise<Badge> => {
    const response = await uploadMultimedia<Badge>(url.badge.store, data);
    return response.data;
  },

  updateBadge: async (id: string, data: FormData): Promise<Badge> => {
    data.append('_method', 'PUT'); // To simulate PUT request
    const response = await updateMultimedia<Badge>(url.badge.update(id), data);
    return response.data;
  },

  deleteBadge: async (id: string): Promise<void> => {
    await deleteData(url.badge.destroy(id));
  },
};