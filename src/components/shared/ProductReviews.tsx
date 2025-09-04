'use client';

import { Star, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';

import type {
  Review,
  ReviewPagination,
  ReviewsApiResponse,
} from '@/lib/reviewTypes';
import { toast } from 'sonner';

interface ProductReviewsProps {
  initialReviews: Review[];
  initialPagination: ReviewPagination;
  productId: string;
  averageRating: number;
  totalReviews: number;
}

const fetchReviews = async (
  productId: string,
  page = 1,
  limit = 5
): Promise<ReviewsApiResponse> => {
  const response = await fetch(
    `${
      import.meta.env.VITE_BACKEND_URL
    }/reviews/${productId}?page=${page}&limit=${limit}`
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || 'An error occurred while fetching reviews.'
    );
  }
  return response.json();
};

const ProductReviews = ({
  initialReviews,
  initialPagination,
  productId,
  averageRating,
  totalReviews,
}: ProductReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [pagination, setPagination] =
    useState<ReviewPagination>(initialPagination);
  const [loadingMore, setLoadingMore] = useState(false);

  const handleLoadMore = async () => {
    if (!pagination.hasNext) return;
    setLoadingMore(true);
    try {
      const nextPage = pagination.currentPage + 1;
      const data = await fetchReviews(productId, nextPage);
      setReviews((prev) => [...prev, ...data.reviews]);
      setPagination(data.reviewsPagination);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to load more reviews'
      );
    } finally {
      setLoadingMore(false);
    }
  };

  if (!reviews || reviews.length === 0) {
    return (
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold tracking-tight">Customer Reviews</h2>
        <p className="mt-4 text-muted-foreground">
          No reviews for this product yet.
        </p>
      </div>
    );
  }

  const ratingDistribution = [
    { star: 5, count: 0 },
    { star: 4, count: 0 },
    { star: 3, count: 0 },
    { star: 2, count: 0 },
    { star: 1, count: 0 },
  ];
  reviews.forEach((r) => {
    if (r.rating >= 1 && r.rating <= 5) {
      ratingDistribution[5 - r.rating].count++;
    }
  });

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold tracking-tight">Customer Reviews</h2>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Overall Rating */}
        <div className="md:col-span-1 flex flex-col items-center justify-center bg-muted p-6 rounded-lg">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-xl text-muted-foreground">/ 5</span>
          </div>
          <div className="flex mt-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-6 w-6 ${
                  i < Math.round(averageRating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Based on {totalReviews} reviews
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="md:col-span-2">
          {ratingDistribution.map(({ star, count }) => (
            <div key={star} className="flex items-center gap-4 mb-2">
              <div className="flex items-center">
                <span className="text-sm font-medium">{star}</span>
                <Star className="h-4 w-4 text-yellow-400 fill-current ml-1" />
              </div>
              <Progress
                value={(count / totalReviews) * 100}
                className="w-full h-2"
              />
              <span className="text-sm text-muted-foreground w-12 text-right">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-8" />

      {/* Individual Reviews */}
      <div className="space-y-8">
        {reviews.map((review) => (
          <div key={review._id} className="flex gap-4">
            <Avatar>
              <AvatarImage
                src={review.user.avatar || undefined}
                alt={`${review.user.firstName} ${review.user.lastName}`}
              />
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{`${review.user.firstName} ${review.user.lastName}`}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="mt-3 text-muted-foreground">{review.comment}</p>
            </div>
          </div>
        ))}
      </div>

      {pagination.hasNext && (
        <div className="mt-8 text-center">
          <Button variant="outline" onClick={handleLoadMore} disabled={loadingMore}>
            {loadingMore ? 'Loading...' : 'Load More Reviews'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
