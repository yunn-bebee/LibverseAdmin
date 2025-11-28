import { url } from "../app/url";
import type { Forum, Post, Thread, User } from "../app/types/forum";
import { getData, postData, putData, deleteData, getDatawithMetaData, uploadMultimedia,  } from "../app/api";

export const forumService = {
  // Forum methods
  getForums: async (
    filters: { category?: string; search?: string } = {},
    perPage: number = 20
  ) => {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);
    params.append('per_page', perPage.toString());
    
    const response = await getData(`${url.forum.index}?${params.toString()}`);
    return response;
  },

  getForum: async (id: string): Promise<Forum> => {
    const response = await getDatawithMetaData<Forum>(url.forum.show(id));
    return response.data;
  },

  createForum: async (data: Partial<Forum>): Promise<Forum> => {
    const response = await postData<Forum>(url.forum.store, data);
    return response.data;
  },

  updateForum: async (id: string, data: Partial<Forum>): Promise<Forum> => {
    const response = await putData<Forum>(url.forum.update(id), data);
    return response.data;
  },

  deleteForum: async (id: string): Promise<void> => {
    await deleteData(url.forum.destroy(id));
  },

  togglePublic: async (forumId: string): Promise<Forum> => {
    const response = await postData<Forum>(url.forum.togglePublic(forumId), {});
    return response.data;
  },

  joinForum: async (forumId: string): Promise<void> => {
    await postData(url.forum.join(forumId), {});
  },

  leaveForum: async (forumId: string): Promise<void> => {
    await postData(url.forum.leave(forumId), {});
  },

  getForumMembers: async (forumId: string , filters: { page: number; per_page: number })=> {
    const params = new URLSearchParams();
    params.append('page', filters.page.toString());
    params.append('per_page', filters.per_page.toString());

    const response = await getDatawithMetaData<User[]>(url.forum.members(forumId)+`?${params.toString()}`);
    return response;
  },

  approveJoinRequest: async (forumId: string, userId: string): Promise<void> => {
    await postData(url.forum.approveJoin(forumId), { user_id: userId });
  },

  rejectJoinRequest: async (forumId: string, userId: string): Promise<void> => {
    await postData(url.forum.rejectJoin(forumId), { user_id: userId });
  },

  getActivityFeed: async () => {
    const response = await getData(url.forum.activityFeed);
    return response.data;
  },

  // Thread methods
  getThreads: async (
    forumId: string,
    filters: { search?: string } = {},
    perPage: number = 20
  ) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    params.append('per_page', perPage.toString());
    
    const response = await getData(
      `${url.forum.threads.index(forumId)}?${params.toString()}`
    );
    return response;
  },

  getThread: async (threadId: string): Promise<Thread> => {
    const response = await getData(url.forum.threads.show(threadId));
    return response.data;
  },

  createThread: async (
    forumId: string,
    data: Partial<Thread>
  ): Promise<Thread> => {
    const response = await postData<Thread>(
      url.forum.threads.store(forumId),
      data
    );
    return response.data;
  },

  updateThread: async (threadId: string, data: Partial<Thread>): Promise<Thread> => {
    const response = await putData<Thread>(url.forum.threads.update(threadId), data);
    return response.data;
  },

  deleteThread: async (threadId: string): Promise<void> => {
    await deleteData(url.forum.threads.destroy(threadId));
  },
  toggleThreadPin: async (forumId: string, threadId: string): Promise<Thread> => {
    const response = await postData<Thread>(
      url.forum.threads.togglePin(forumId, threadId),
      {}
    );
    return response.data;
  },

  toggleThreadLock: async (forumId: string, threadId: string): Promise<Thread> => {
    const response = await postData<Thread>(
      url.forum.threads.toggleLock(forumId, threadId),
      {}
    );
    return response.data;
  },

  // Post methods
  getPosts: async (threadId: string, filters: { search?: string; is_flagged?: boolean } = {}, perPage: number = 20) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.is_flagged !== undefined) params.append('is_flagged', filters.is_flagged.toString());
    params.append('per_page', perPage.toString());

    const response = await getDatawithMetaData<Post[]>(`${url.posts.index(threadId)}?${params.toString()}`);
    return response;
  },

  createPost: async (threadId: string, data: FormData): Promise<Post> => {
    const response = await uploadMultimedia<Post>(url.posts.store(threadId), data);
    return response.data;
  },

  getPost: async (postId: string): Promise<Post> => {
    const response = await getData(url.posts.show(postId));
    return response.data;
  },

  updatePost: async (postId: string, data: Partial<Post>): Promise<Post> => {
    const response = await putData<Post>(url.posts.update(postId), data);
    return response.data;
  },

  deletePost: async (postId: string): Promise<void> => {
    await deleteData(url.posts.destroy(postId));
  },

  toggleLike: async (postId: string, action: 'like' | 'unlike'): Promise<void> => {
    await postData(url.posts.like(postId), { action });
  },

  toggleSave: async (postId: string, action: 'save' | 'unsave'): Promise<void> => {
    await postData(url.posts.save(postId), { action });
  },

  createComment: async (postId: string, data: Partial<Post>): Promise<Post> => {
    const response = await postData<Post>(url.posts.comment(postId), data);
    return response.data;
  },

  reportPost: async (postId: string): Promise<void> => {
    await postData(url.posts.report(postId), {});
  },

  uploadMedia: async (postId: string, formData: FormData) => {
    const response = await uploadMultimedia(url.posts.uploadMedia(postId), formData);
    return response.data;
  },
  updateMedia: async (postId: string, mediaId: string , formData: FormData) => {
  const response = await uploadMultimedia(url.posts.updateMedia(postId, mediaId), formData);
    return response.data;
  },
  deleteMedia: async (postId: string, mediaId: string) => {
    const response = await deleteData(url.posts.deleteMedia(postId, mediaId));
    return response.data;
  },

  // Admin post methods
  getReportedPosts: async (): Promise<Post[]> => {
    const response = await getData(url.posts.reported);
    return response.data;
  },

  unflagPost: async (postId: string): Promise<void> => {
    await postData(url.posts.unflag(postId), {});
  },

  flagPost: async (postId: string): Promise<void> => {
    await postData(url.posts.flag(postId), {});
  },
};