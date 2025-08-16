import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import type { Forum, Thread } from '../app/types/forum';
import { forumService } from '../services/ForumServices';

export function useForums(filters = {}, perPage = 20) {
  return useQuery({
    queryKey: ['forums', filters, perPage],
    queryFn: () => forumService.getForums(filters, perPage),
  });
}

export function useForum(id: string) {
  return useQuery({
    queryKey: ['forum', id],
    queryFn: () => forumService.getForum(id),
    enabled: !!id,
  });
}

export function useCreateForum() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: forumService.createForum,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forums'] });
    },
  });
}

export function useUpdateForum() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Forum> }) => 
      forumService.updateForum(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forums'] });
    },
  });
}

export function useDeleteForum() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => forumService.deleteForum(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forums'] });
    },
  });
}

export function useThreads(forumId: string, filters = {}, perPage = 20) {
  return useQuery({
    queryKey: ['threads', forumId, filters, perPage],
    queryFn: () => forumService.getThreads(forumId, filters, perPage),
    enabled: !!forumId,
  });
}

export function useCreateThread(forumId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Thread>) => 
      forumService.createThread(forumId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['threads', forumId] });
    },
  });
}

export function useToggleForumPublic() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (forumId: string) => forumService.togglePublic(forumId),
    onSuccess: (_, forumId) => {
      queryClient.invalidateQueries({ queryKey: ['forums'] });
      queryClient.invalidateQueries({ queryKey: ['forum', forumId] });
    },
  });
}

export function useToggleThreadPin(forumId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (threadId: string) => 
      forumService.toggleThreadPin(forumId, threadId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['threads', forumId] });
    },
  });
}

export function useToggleThreadLock(forumId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (threadId: string) => 
      forumService.toggleThreadLock(forumId, threadId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['threads', forumId] });
    },
  });
}