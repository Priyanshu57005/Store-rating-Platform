export type Role = 'ADMIN' | 'USER' | 'STORE_OWNER';

export interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  role: Role;
  createdAt: string;
  ownerRating?: {
    averageRating: number;
    totalRatings: number;
    storeCount?: number;
    stores?: Array<{
      id: string;
      name: string;
      ratingsCount: number;
      avgRating: number;
    }>;
    breakdown?: Record<number, number>;
  } | null;
}

export interface UserPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserListResponse {
  success: boolean;
  users: User[];
  pagination: UserPagination;
}
