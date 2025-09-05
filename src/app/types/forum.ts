export interface UserProfile {
  bio?: string;
  profilePicture?: string;
  website?: string;
  location?: string;
  readingPreferences?: string[]; // can refine if known
  lastActive?: string;
}

export interface User {
  id: number;
  memberId: string;
  username: string;
  email: string;
  role: string;
  dateOfBirth?: string;
  approvedAt?: string | null;
  profile: UserProfile;
  createdAt: string;
  updatedAt: string;
}

export interface Book {
  id?: number;
  library_book_id?: string;
  isbn?: string;
  title: string;
  author?: string;
  cover_image?: string;
  description?: string;
  genres?: string[]; // can refine if known
  verified?: boolean | null;
  added_by?: { id: number; name: string | null; email: string };
  created_at?: string;
  updated_at?: string;
}

export interface Report {
  id: number;
  user: User;
  reason: string;
  status: string;
  reviewed_at: string | null;
  reviewed_by: User | null;
  created_at: string;
}

export interface Post {
  id: number;
  uuid: string;
  content: string;
  is_flagged: boolean | number; // matches backend (tinyint/bool)
  user: User;
  book?: {
    uuid?: string | null;
    title: string;
    cover_image?: string | null;
  };
  parent_post_id?: number | null;
  replies: Post[];
  media: Media[];
  likes_count: number;
  saves_count: number;
  replies_count: number;
  is_liked: boolean;
  is_saved: boolean;
  created_at: string;
  updated_at: string;

  // Only present if user has admin/moderator role
  reports?: Report[];
}


export interface Thread {
  forum_id: number;
  id: number;
  title: string;
  content: string;
  post_type: string;
  is_pinned: number;
  is_locked: number;
  user: User;
  book?: Book;
  posts_count: number;
  posts?: Post[]; // thread can include posts
  created_at: string;
  updated_at: string;
}

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

export interface Media {
  id: number;
  file_url: string;
  file_type: string;
  thumbnail_url: string;
  caption: string;
}