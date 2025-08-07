import { getData, postData, putData, deleteData } from "../app/api";
import type { Book } from "../app/types/book";
import { url } from "../app/url";


interface GoogleBookResult {
  items: Array<{
    google_books_id: string;
    title: string;
    author: string;
    cover_image: string | null;
    description: string | null;
    isbn: string | null;
    publication_year: number | null;
    exists_in_db: boolean;
  }>;
  total: number;
  page: number;
  per_page: number;
}

export const bookService = {
  getBooks: async (
    filters: { search?: string; author?: string } = {}
  ): Promise<Book[]> => {
    const queryFilters: Record<string, string> = {};
    
    if (filters.search) queryFilters.search = filters.search;
    if (filters.author) queryFilters.author = filters.author;

    const queryParams = new URLSearchParams(queryFilters).toString();
    const response = await getData(`${url.book.index}?${queryParams}`);
    if (!response) {
      throw new Error('Failed to fetch books');
    }
    if (!response?.data) {
      throw new Error('No books returned from API');
    }
    return response.data;
  },

  getBook: async (id: string): Promise<Book> => {
    const response = await getData(`${url.book.show(id)}`);
    if (!response.data) {
      throw new Error('Book not found');
    }
    return response.data;
  },

  createBook: async (data: Partial<Book>): Promise<Book> => {
    const response = await postData<Book>(`${url.book.store}`, data);
    if (!response.data) {
      throw new Error('Failed to create book');
    }
    return response.data;
  },

  updateBook: async (id: string, data: Partial<Book> | FormData): Promise<Book> => {
    const response = await putData<Book>(`${url.book.update(id)}`, data);
    if (!response.data) {
      throw new Error('Failed to update book');
    }
    return response.data;
  },

  deleteBook: async (id: string): Promise<void> => {
    await deleteData(url.book.destroy(id));
  },

  searchGoogleBooks: async (
    query: string,
    page: number = 1,
    perPage: number = 20
  ): Promise<GoogleBookResult> => {
    const response = await getData(
      `${url.book.searchGoogle}?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`
    );
    if (!response.data) {
      throw new Error('Failed to search Google Books');
    }
    return response.data;
  },

  createFromGoogleBooks: async (
    googleBooksId: string,
    additionalData: { description?: string; genres?: string[] } = {}
  ): Promise<Book> => {
    const response = await postData<Book>(`${url.book.createFromGoogle}`, {
      google_books_id: googleBooksId,
      ...additionalData
    });
    if (!response.data) {
      throw new Error('Failed to create book from Google Books');
    }
    return response.data;
  },
};