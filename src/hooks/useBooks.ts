import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Book, GoogleBookResult } from '../app/types/book';
import { bookService } from '../services/BookServices';

export function useBooks(filters = {}) {
  return useQuery<Book[], Error>({
    queryKey: ['books', filters],
    queryFn: () => bookService.getBooks(filters),
  });
}

export function useBook(id: string) {
  return useQuery<Book, Error>({
    queryKey: ['book', id],
    queryFn: () => bookService.getBook(id),
    enabled: !!id, // Only run query if id exists
  });
}

export function useCreateBook() {
  const queryClient = useQueryClient();
  
  return useMutation<Book, Error, Partial<Book>>({
    mutationFn: bookService.createBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
}

export function useUpdateBook() {
  const queryClient = useQueryClient();
  
  return useMutation<Book, Error, { id: string; data: Partial<Book> | FormData }>({
    mutationFn: ({ id, data }) => bookService.updateBook(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.setQueryData(['book', variables.id], data);
    },
  });
}

export function useDeleteBook() {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: bookService.deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
}

export function useSearchGoogleBooks() {
  return useMutation<GoogleBookResult, Error, { 
    loading?: boolean;
    query: string; 
    page?: number; 
    perPage?: number 
  }>({
    mutationFn: ({ query, page = 1, perPage = 20 }) => 
      bookService.searchGoogleBooks(query, page, perPage),
  });
}

export function useCreateFromGoogleBooks() {
  const queryClient = useQueryClient();
  
  return useMutation<Book, Error, { 
    googleBooksId: string; 
    additionalData?: { 
      description?: string; 
      genres?: string[] 
    } 
  }>({
    mutationFn: ({ googleBooksId, additionalData }) => 
      bookService.createFromGoogleBooks(googleBooksId, additionalData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
}