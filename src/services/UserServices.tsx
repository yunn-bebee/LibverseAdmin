// services/userService.ts
import { url } from "../app/url";
import type { PaginatedResponse, User, UserStats } from "../app/types/user";
import { getDatawithMetaData, postData, putData, deleteData, getData } from "../app/api";

export const userService = {
  getUsers: async (
    page: number = 1,
    perPage: number = 20,
    filters: { search?: string; role?: string; status?: string } = {}
  ): Promise<PaginatedResponse<User>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('per_page', perPage.toString());
    
    if (filters.search) params.append('search', filters.search);
    if (filters.role) params.append('role', filters.role);
    if (filters.status) params.append('status', filters.status);

    const response = await getDatawithMetaData<User[]>(`${url.user.index}?${params.toString()}`);
    return response;
  },

  getUser: async (id: string): Promise<User> => {
    const response = await getDatawithMetaData<User>(url.user.show(id));
    return response.data;
  },

  createUser: async (data: Partial<User>): Promise<User> => {
    const response = await postData<User>(url.user.store, data);
    return response.data;
  },

  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await putData<User>(url.user.update(id), data);
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await deleteData(url.user.destroy(id));
  },

  banUser: async (id: string): Promise<void> => {
    await putData(url.user.ban(id), {});
  },
  
  disableUser: async (id: string): Promise<void> => {
    await deleteData(`/admin/users/${id}/disable`);
  },
  
  updateUserRole: async (id: string, role: string): Promise<User> => {
    const response = await putData<User>(`/admin/users/${id}/role`, { role });
    return response.data;
  },

  ApproveUser: async (id: string): Promise<User> => {
    const response = await putData<User>(url.auth.admin.approveUser(id), {});
    return response.data;
  },
  
  getUserStats: async (id: string):Promise<UserStats>=> {
    const response = await getData(`users/${id}/stats`);
    console.log('User stats response:', response.data);
    return response.data;
  }

};