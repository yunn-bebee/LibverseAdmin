import type { Book } from "./book";

export interface ReadingChallenge {
  id: string;
  name: string;
  slug: string;
  description: string;
  start_date: string;
  end_date: string;
  target_count: number;
  badge_id: string;
  created_by: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  participants_count?: number;
  book_ids: string[];
  has_joined?: boolean;
  badge?: {
    id: string;
    name: string;
    icon_url: string;
  };
  creator?: {
    id: string;
    name: string;
  };    
  suggested_books?: Book[];
}
export interface Badge {
        id: string;
        name: string;
        description: string;
        icon_url: string;
        type: string;
      }
export interface ChallengeProgress {
  challenge_id: string;
  challenge_name: string;
  start_date: string;
  end_date: string;
  target_count: number;
  books_read: number;
  books_remaining: number;
  percentage: number;
  is_completed: boolean;
}
export interface UserProgress {
  user_id: string;
  username: string;
  email: string;
  progress: {
    books_completed: number;
    target_count: number;
    percentage: number;
    has_badge: boolean;
  };
  joined_at: string;
}

export interface LeaderboardEntry {
  user: {
    id: string;
    name: string;
    username: string;
  };
  books_read: number;
}

export interface ChallengeFilters {
  per_page?: number;
  page?: number;
  active?: boolean;
  current?: boolean;
  search?: string;
}