import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import type { Forum, Post, Thread } from '../app/types/forum';
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

export function useThread(threadId: string) {
  return useQuery({
    queryKey: ['thread', threadId],
    queryFn: () => forumService.getThread(threadId),
    enabled: !!threadId,
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


export function usePosts(threadId: string, filters = {}, perPage = 20) {
  return useQuery({
    queryKey: ['posts', threadId, filters, perPage],
    queryFn: () => forumService.getPosts(threadId, filters, perPage),
    enabled: !!threadId,
  });
}

export function useCreatePost(threadId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Post>) => 
      forumService.createPost(threadId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', threadId] });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, data }: { postId: string; data: Partial<Post> }) => 
      forumService.updatePost(postId, data),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['posts', postId] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => forumService.deletePost(postId),
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: ['posts', postId] });
    },
  });
}

export function useTogglePostLike() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, action }: { postId: string; action: 'like' | 'unlike' }) => 
      forumService.toggleLike(postId, action),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['posts', postId] });
    },
  });
}

export function useTogglePostSave() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, action }: { postId: string; action: 'save' | 'unsave' }) => 
      forumService.toggleSave(postId, action),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['posts', postId] });
    },
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, data }: { postId: string; data: Partial<Post> }) => 
      forumService.createComment(postId, data),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['posts', postId] });
    },
  });
}

export function useTogglePostFlag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => forumService.toggleFlag(postId),
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: ['posts', postId] });
    },
  });
}

export function useUploadMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, formData }: { postId: string; formData: FormData }) => 
      forumService.uploadMedia(postId, formData),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['posts', postId] });
    },
  });
}