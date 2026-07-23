export interface StoreRatingItem {
  id: string;
  userName: string;
  userEmail: string;
  userAddress: string;
  rating: number;
  comment?: string | null;
  storeName: string;
  createdAt: string;
}

export interface StoreOwnerRatingsResponse {
  success: boolean;
  averageRating: number;
  totalRatings: number;
  ratingBreakdown: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  ratings: StoreRatingItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
