import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Forum, Post, Thread } from '../app/types/forum';
import { forumService } from '../services/ForumServices';

// Forum hooks
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

export function useJoinForum() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (forumId: string) => forumService.joinForum(forumId),
    onSuccess: (_, forumId) => {
      queryClient.invalidateQueries({ queryKey: ['forum', forumId] });
    },
  });
}

export function useLeaveForum() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (forumId: string) => forumService.leaveForum(forumId),
    onSuccess: (_, forumId) => {
      queryClient.invalidateQueries({ queryKey: ['forum', forumId] });
    },
  });
}

export function useForumMembers(forumId: string, filters = { page: 1, per_page: 20 }) {
  return useQuery({
    queryKey: ['forum-members', forumId, filters],
    queryFn: () => forumService.getForumMembers(forumId , filters),
    enabled: !!forumId,
  });
}

export function useApproveJoinRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ forumId, userId }: { forumId: string; userId: string }) => 
      forumService.approveJoinRequest(forumId, userId),
    onSuccess: (_, { forumId }) => {
      queryClient.invalidateQueries({ queryKey: ['forum-members', forumId] });
    },
  });
}

export function useRejectJoinRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ forumId, userId }: { forumId: string; userId: string }) => 
      forumService.rejectJoinRequest(forumId, userId),
    onSuccess: (_, { forumId }) => {
      queryClient.invalidateQueries({ queryKey: ['forum-members', forumId] });
    },
  });
}

export function useActivityFeed() {
  return useQuery({
    queryKey: ['activity-feed'],
    queryFn: () => forumService.getActivityFeed(),
  });
}

// Thread hooks
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

export function useUpdateThread() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ threadId, data }: { threadId: string; data: Partial<Thread> }) => 
      forumService.updateThread(threadId, data),  
    onSuccess: (_, { threadId }) => {
      queryClient.invalidateQueries({ queryKey: ['threads'] });
      queryClient.invalidateQueries({ queryKey: ['thread', threadId] });
    },
  });
}




export function useDeleteThread() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (threadId: string) => forumService.deleteThread(threadId),
    onSuccess: (_, threadId) => {
      queryClient.invalidateQueries({ queryKey: ['threads'] });
      queryClient.invalidateQueries({ queryKey: ['thread', threadId] });
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

// Post hooks
export function usePosts(threadId: string, filters = {}, perPage = 20) {
  return useQuery({
    queryKey: ['posts', threadId, filters, perPage],
    queryFn: () => forumService.getPosts(threadId, filters, perPage),
    enabled: !!threadId,
  });
}

export function usePost(postId: string) {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: () => forumService.getPost(postId),
    enabled: !!postId,
  });
}

export function useCreatePost(threadId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ForumData) => 
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
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => forumService.deletePost(postId),
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });
}

export function useTogglePostLike() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, action }: { postId: string; action: 'like' | 'unlike' }) => 
      forumService.toggleLike(postId, action),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });
}

export function useTogglePostSave() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, action }: { postId: string; action: 'save' | 'unsave' }) => 
      forumService.toggleSave(postId, action),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, data }: { postId: string; data: Partial<Post> }) => 
      forumService.createComment(postId, data),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });
}

export function useReportPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => forumService.reportPost(postId),
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });
}

export function useUploadMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, formData }: { postId: string; formData: FormData }) => 
      forumService.uploadMedia(postId, formData),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });
}
export function useUpdateMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, mediaId, formData }: { postId: string; mediaId: string; formData: FormData }) => 
      forumService.updateMedia(postId, mediaId, formData),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });
}
export function useDeleteMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, mediaId }: { postId: string; mediaId: string }) => 
      forumService.deleteMedia(postId, mediaId),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });
}

// Admin post hooks
export function useReportedPosts() {
  return useQuery({
    queryKey: ['reported-posts'],
    queryFn: () => forumService.getReportedPosts(),
  });
}

export function useUnflagPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => forumService.unflagPost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reported-posts'] });
    },
  });
}

export function useFlagPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => forumService.flagPost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reported-posts'] });
    },
  });
}