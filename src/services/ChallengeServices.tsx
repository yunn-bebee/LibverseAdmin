import { url } from "../app/url";
import type { ReadingChallenge as Challenge , ChallengeProgress, LeaderboardEntry, ChallengeFilters } from "../app/types/readingChallenge";
import { getData, postData, putData, deleteData, getDatawithMetaData } from "../app/api";

export const challengeService = {
  getChallenges: async (
    filters: ChallengeFilters = {},
    perPage: number = 20
  ) => {
    const params = new URLSearchParams();
    if (filters.active !== undefined) params.append('active', filters.active.toString());
    if (filters.current !== undefined) params.append('current', filters.current.toString());
    if (filters.search) params.append('search', filters.search);
    params.append('per_page', perPage.toString());

    const response = await getData(`${url.challenge.index}?${params.toString()}`);
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
};