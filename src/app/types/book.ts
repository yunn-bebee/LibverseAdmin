export interface Book {
  id: number;
  library_book_id?: string | null;
  isbn?: string | null;
  title: string;
  
  author: string;
  

  cover_image?: string | null;
  description?: string | null;
  genres?: string[] | null;
  added_by: {
    id: number;
    name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

export interface GoogleBookSearchResult {
  google_books_id: string;
  title: string;
  author: string;
  cover_image: string | null;
  description: string | null;
  isbn: string | null;
  publication_year: number | null;
  exists_in_db: boolean;
}

export interface GoogleBookSearchResponse {
  items: GoogleBookSearchResult[];
  total: number;
  page: number;
  per_page: number;
}
export interface GoogleBookResult {
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

export interface GoogleBookResultItem {
  google_books_id: string;
  title: string;
  author: string;
  cover_image: string | null;
  description: string | null;
  isbn: string | null;
  publication_year: number | null;
  exists_in_db: boolean;
}