export interface Forum {
  id: number;
  name: string;
  slug: string;
  description?: string;
  category: string;
  is_public: boolean;
  created_by: { id: number; name: string };
  book?: { id: number; title: string };
  threads_count: number;
  created_at: string;
  updated_at: string;
}

export interface Thread {
  id: number;
  title: string;
  content: string;
  post_type: string;
  is_pinned: boolean;
  is_locked: boolean;
  user: { id: number; name: string };
  book?: { id: number; title: string };
  posts_count: number;
  created_at: string;
  updated_at: string;
}