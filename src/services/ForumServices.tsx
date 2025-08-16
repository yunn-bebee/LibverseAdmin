import { url } from "../app/url";
import type { Forum, Thread } from "../app/types/forum";
import { getData, postData, putData, deleteData, getDatawithMetaData } from "../app/api";

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
};