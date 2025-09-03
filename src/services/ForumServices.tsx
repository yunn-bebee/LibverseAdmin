import { url } from "../app/url";
import type { Forum, Post, Thread } from "../app/types/forum";
import { getData, postData, putData, deleteData, getDatawithMetaData, uploadMultimedia } from "../app/api";


export const forumService = {
  getForums: async (
    filters: { category?: string; search?: string } = {},
    perPage: number = 20
  ) => {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);
    params.append('per_page', perPage.toString());
    
    const response = await getData(`${url.forum.index}?${params.toString()}`);
    console.log(response);
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
 getThread: async (threadId: string ): Promise<Thread> => {
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

  togglePublic: async (forumId: string): Promise<Forum> => {
    const response = await postData<Forum>(url.forum.togglePublic(forumId), {});
    return response.data;
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
  getPosts: async (threadId: string, filters: { search?: string; is_flagged?: boolean } = {}, perPage: number = 20) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.is_flagged !== undefined) params.append('is_flagged', filters.is_flagged.toString());
    params.append('per_page', perPage.toString());

    const response = await getDatawithMetaData<Post[]>(`${url.forum.threads.posts(threadId)}?${params.toString()}`);
    console.log(response);
    return response;
  },

  createPost: async (threadId: string, data: Partial<Post>): Promise<Post> => {
    const response = await postData<Post>(url.forum.threads.posts(threadId), data);
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

  toggleFlag: async (postId: string): Promise<Post> => {
    const response = await postData<Post>(url.posts.flag(postId), {});
    return response.data;
  },

  uploadMedia: async (postId: string, formData: FormData) => {
    const response = await uploadMultimedia(url.posts.uploadMedia(postId), formData);
    return response.data;
  },
};