import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Book } from '../app/types/book';
import { bookService } from '../services/BookServices';


export function useBooks(filters = {}) {
  return useQuery({
    queryKey: ['books', filters],
    queryFn: () => bookService.getBooks(filters),
  });
}

export function useBook(id: string) {
  return useQuery({
    queryKey: ['book', id],
    queryFn: () => bookService.getBook(id),
  });
}
export function useCreateBook() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Book>) => bookService.createBook(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
}

export function useUpdateBook() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Book> | FormData }) => 
      bookService.updateBook(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['book', variables.id] });
    },
  });
}

export function useDeleteBook() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => bookService.deleteBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
}

export function useVerifyBook() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => bookService.verifyBook(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['book', variables] });
    },
  });
}