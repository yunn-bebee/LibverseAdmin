import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ReadingChallenge as Challenge,ChallengeFilters } from '../app/types/readingChallenge';
import { challengeService } from '../services/ChallengeServices';

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