
export interface User {
  id: number;
  name: string | null;
  email: string;
}

export interface Book {
  
  id: string;
  library_book_id: string;
  isbn: string;
  title: string;
  author: string;
  cover_image: string;
  description: string;
  verified: boolean;
  added_by: User;
  created_at: string;
  updated_at: string;
  forums_count?: number;
  threads_count?: number;
  posts_count?: number;
}
