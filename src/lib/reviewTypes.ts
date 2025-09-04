export interface ReviewUser {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface Review {
  _id: string;
  comment: string;
  rating: number;
  user: ReviewUser;
  createdAt: string;
}

export interface ReviewPagination {
  currentPage: number;
  totalPages: number;
  totalReviews: number;
  hasNext: boolean;
  hasPrev: boolean;
  pageSize: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface ProductRating {
  averageRating: number;
  totalReviews: number;
}

export interface ReviewsApiResponse {
  success: boolean;
  reviews: Review[];
  reviewsPagination: ReviewPagination;
  productRating: ProductRating;
}
