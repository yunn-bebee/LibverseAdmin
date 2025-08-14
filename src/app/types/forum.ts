export interface Forum {
  is_public?: boolean;
  posts_count: number;
  id: string;
  name: string;
  description: string;
  category: string;
  created_by: {
    id: string;
    username: string;
  };
  threads_count: number;
  created_at: string;
  updated_at: string;
}

export interface Thread {
  replies_count: ReactNode;
  added_by: any;
  id: string;
  title: string;
  content: string;
  user_id: string;
  forum_id: string;
  posts_count: number;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
}