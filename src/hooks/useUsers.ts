// hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { User } from '../app/types/user';
import { userService } from '../services/UserServices';

export function useUsers(
  page: number = 1, 
  perPage: number = 20,
  filters: { search?: string; role?: string; status?: string } = {}
) {
  return useQuery({
    queryKey: ['users', page, perPage, filters],
    queryFn: () => userService.getUsers(page, perPage, filters),
   
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getUser(id),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      userService.updateUser(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', id] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useBanUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userService.banUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useDisableUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userService.disableUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      userService.updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
export function useApproveUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userService.ApproveUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
export function useUserStats(id: string) {
  return useQuery({
    queryKey: ['userStats', id],
    queryFn: async () => {
      console.log('Fetching stats for user ID:', id);
      try {
        const stats = await userService.getUserStats(id);
        console.log('Stats received:', stats);
        return stats;
      } catch (error) {
        console.error('Error in useUserStats:', error);
        throw error;
      }
    },
    enabled: !!id,
  });
}