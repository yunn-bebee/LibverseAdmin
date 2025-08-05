/* eslint-disable no-useless-catch */

import { getData, postData, putData, deleteData } from "../app/api";
import type { Book } from "../app/types/book";
import { url } from "../app/url";

interface UrlType {
  book: {
    index: string;
    show: (id: string) => string;
    store: string;
    update: (id: string) => string;
    destroy: (id: string) => string;
    verify: (id: string) => string;
  };
}

export const bookService = {
  getBooks: async (
    filters: { search?: string; author?: string; min_year?: number } = {}
  ): Promise<Book[]> => {
    try {
      const queryFilters: Record<string, string> = {};
      
      if (filters.search) queryFilters.search = filters.search;
      if (filters.author) queryFilters.author = filters.author;
      if (filters.min_year) queryFilters.min_year = filters.min_year.toString();

      const queryParams = new URLSearchParams(queryFilters).toString();
      const response = await getData(`${(url as UrlType).book.index}?${queryParams}`);
      
      if (!response || !response.data) {
        console.error('API Response Error:', response);
        throw new Error('No books returned from API');
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getBook: async (id: string): Promise<Book> => {
    try {
      const response = await getData((url as UrlType).book.show(id));
      if (!response.data) {
        throw new Error('Book not found');
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createBook: async (data: Partial<Book>): Promise<Book> => {
    try {
      const response = await postData<Book>((url as UrlType).book.store, data);
      if (!response.data) {
        throw new Error('Failed to create book');
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateBook: async (id: string, data: Partial<Book> | FormData): Promise<Book> => {
    try {
      const response = await putData<Book>((url as UrlType).book.update(id), data);
      if (!response.data) {
        throw new Error('Failed to update book');
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteBook: async (id: string): Promise<void> => {
    try {
      await deleteData((url as UrlType).book.destroy(id));
    } catch (error) {
      throw error;
    }
  },

  verifyBook: async (id: string): Promise<Book> => {
    try {
      const response = await putData<Book>((url as UrlType).book.verify(id), {});
      if (!response.data) {
        throw new Error('Failed to verify book');
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};