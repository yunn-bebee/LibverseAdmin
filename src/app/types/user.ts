// types/user.ts
export interface UserProfile {
  id: string;
  bio: string | null;
  profilePicture: string | null;
  website: string | null;
  location: string | null;
  readingPreferences: string[] | null;
  lastActive: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  uuid: string;
  memberId: string;
  username: string;
  email: string;
  role: 'admin' | 'moderator' | 'member';
  dateOfBirth: string | null;
  approvalStatus: 'pending' | 'approved' | 'rejected' | 'banned';
  approvedAt: string | null;
  rejectedAt: string | null;
  bannedAt: string | null;
  isDisabled: boolean;
  disabledAt: string | null;
  profile: UserProfile | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: {
    pagination: {
      total: number;
      count: number;
      per_page: number;
      current_page: number;
      total_pages: number;
      links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
      };
    };
    status: number;
    timestamp: string;
  };
}


export interface UserStats{
  books_read: number;
  badges_earned: number;
  posts_created: number;
  threads_created: number;
  comments_created: number;
}