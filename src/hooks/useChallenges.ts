import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ReadingChallenge as Challenge, ChallengeFilters } from '../app/types/readingChallenge';

import { challengeService } from '../services/ChallengeServices';




// Existing hooks (kept as provided)
export function useChallenges(filters: ChallengeFilters = {}, perPage: number = 20) {
  return useQuery({
    queryKey: ['challenges', filters, perPage],
    queryFn: () => challengeService.getChallenges(filters, perPage),
  });
}

export function useChallenge(id: string) {
  return useQuery({
    queryKey: ['challenge', id],
    queryFn: () => challengeService.getChallenge(id),
    enabled: !!id,
  });
}

export function useCreateChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: challengeService.createChallenge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
    },
  });
}

export function useUpdateChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Challenge> }) =>
      challengeService.updateChallenge(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      queryClient.invalidateQueries({ queryKey: ['challenge', id] });
    },
  });
}

export function useDeleteChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => challengeService.deleteChallenge(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
    },
  });
}

export function useJoinChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => challengeService.joinChallenge(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      queryClient.invalidateQueries({ queryKey: ['challenge', id] });
    },
  });
}

export function useChallengeProgress(challengeId: string) {
  return useQuery({
    queryKey: ['challenge-progress', challengeId],
    queryFn: () => challengeService.getProgress(challengeId),
    enabled: !!challengeId,
  });
}

export function useChallengeLeaderboard(challengeId: string) {
  return useQuery({
    queryKey: ['challenge-leaderboard', challengeId],
    queryFn: () => challengeService.getLeaderboard(challengeId),
    enabled: !!challengeId,
  });
}

export const useChallengeParticipants = (challengeId: string, params: { page?: number; per_page?: number }) => {
  return useQuery({
    queryKey: ['challengeParticipants', challengeId, params.page, params.per_page],
    queryFn: () => challengeService.getParticipants(challengeId, params),
  });
};

export function useBulkUpdateChallenges() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ challengeIds, updates }: { challengeIds: string[]; updates: Partial<Challenge> }) =>
      challengeService.bulkUpdate(challengeIds, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
    },
  });
}

export function useRemoveParticipant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ challengeId, userId }: { challengeId: string; userId: string }) =>
      challengeService.removeParticipant(challengeId, userId),
    onSuccess: (_, { challengeId }) => {
      queryClient.invalidateQueries({ queryKey: ['challenge-participants', challengeId] });
    },
  });
}

export function useResetParticipantProgress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ challengeId, userId }: { challengeId: string; userId: string }) =>
      challengeService.resetParticipantProgress(challengeId, userId),
    onSuccess: (_, { challengeId }) => {
      queryClient.invalidateQueries({ queryKey: ['challenge-participants', challengeId] });
    },
  });
}

export function useAwardBadge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ challengeId, userId, badgeId }: { challengeId: string; userId: string; badgeId: string }) =>
      challengeService.awardBadge(challengeId, userId, badgeId),
    onSuccess: (_, { challengeId }) => {
      queryClient.invalidateQueries({ queryKey: ['challenge-participants', challengeId] });
    },
  });
}

export function useRevokeBadge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ challengeId, userId, badgeId }: { challengeId: string; userId: string; badgeId: string }) =>
      challengeService.revokeBadge(challengeId, userId, badgeId),
    onSuccess: (_, { challengeId }) => {
      queryClient.invalidateQueries({ queryKey: ['challenge-participants', challengeId] });
    },
  });
}

export function useChallengeStats() {
  return useQuery({
    queryKey: ['challenge-stats'],
    queryFn: () => challengeService.getChallengeStats(),
  });
}


// Badge-related hooks
export function useBadges(perPage: number = 20) {
  return useQuery({
    queryKey: ['badges', perPage],
    queryFn: () => challengeService.getBadges(perPage),
  });
}

export function useBadge(id: string) {
  return useQuery({
    queryKey: ['badge', id],
    queryFn: () => challengeService.getBadge(id),
    enabled: !!id,
  });
}

export function useCreateBadge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => challengeService.createBadge(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['badges'] });
    },
  });
}

export function useUpdateBadge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      challengeService.updateBadge(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['badges'] });
      queryClient.invalidateQueries({ queryKey: ['badge', id] });
    },
  });
}

export function useDeleteBadge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => challengeService.deleteBadge(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['badges'] });
    },
  });
  
}
export function useChallengeBooks(challengeId: string, params: { page?: number; per_page?: number } = {}) {
  return useQuery({
    queryKey: ['challengeBooks', challengeId, params.page, params.per_page],
    queryFn: () => challengeService.getBooks(challengeId, params),
    enabled: !!challengeId,
  });
}
export function useAddBookToChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ challengeId, bookId }: { challengeId: string; bookId: string }) =>
      challengeService.addBookToChallenge(challengeId, bookId),
    onSuccess: (_, { challengeId }) => {
      queryClient.invalidateQueries({ queryKey: ['challengeBooks', challengeId] });
    },
  });
}

export function useRemoveBookFromChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ challengeId, bookId }: { challengeId: string; bookId: string }) =>
      challengeService.removeBookFromChallenge(challengeId, bookId),
    onSuccess: (_, { challengeId }) => {
      queryClient.invalidateQueries({ queryKey: ['challengeBooks', challengeId] });
    },
  });
}

export function useAddUserBookToChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ challengeId, userId, bookId, status }: { challengeId: string; userId: string; bookId: string; status: string }) =>
      challengeService.addUserBookToChallenge(challengeId, userId, bookId, status),
    onSuccess: (_, { challengeId, userId }) => {
      queryClient.invalidateQueries({ queryKey: ['challengeParticipants', challengeId] });
      queryClient.invalidateQueries({ queryKey: ['challenge-progress', challengeId] });
      queryClient.invalidateQueries({ queryKey: ['userProgress', challengeId, userId] });
    },
  });
}

export function useRemoveUserBookFromChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ challengeId, userId, bookId }: { challengeId: string; userId: string; bookId: string }) =>
      challengeService.removeUserBookFromChallenge(challengeId, userId, bookId),
    onSuccess: (_, { challengeId, userId }) => {
      queryClient.invalidateQueries({ queryKey: ['challengeParticipants', challengeId] });
      queryClient.invalidateQueries({ queryKey: ['challenge-progress', challengeId] });
      queryClient.invalidateQueries({ queryKey: ['userProgress', challengeId, userId] });
    },
  });
}