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
  has_joined?: boolean;
  badge?: {
    id: string;
    name: string;
    image_url: string;
  };
  creator?: {
    id: string;
    name: string;
  };
  suggested_books?: Array<{
    id: string;
    title: string;
    author: string;
    cover_image: string;
  }>;
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

export interface LeaderboardEntry {
  user: {
    id: string;
    name: string;
    username: string;
  };
  books_read: number;
}

export interface ChallengeFilters {
  active?: boolean;
  current?: boolean;
  search?: string;
}