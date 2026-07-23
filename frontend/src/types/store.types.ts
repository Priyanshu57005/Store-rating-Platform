export interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  overallRating: number;
  totalRatings: number;
  userRating?: number | null;
  owner?: {
    id: string;
    name: string;
    email: string;
  } | null;
  createdAt: string;
}

export interface StorePagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface StoreListResponse {
  success: boolean;
  stores: Store[];
  pagination: StorePagination;
}
