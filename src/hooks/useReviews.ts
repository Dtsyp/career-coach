import { useQuery } from '@tanstack/react-query';
import { reviewsService } from '../services/reviews';

export const reviewKeys = {
  all: ['reviews'] as const,
  lists: () => [...reviewKeys.all, 'list'] as const,
  list: (filters: string) => [...reviewKeys.lists(), { filters }] as const,
  details: () => [...reviewKeys.all, 'detail'] as const,
  detail: (id: string) => [...reviewKeys.details(), id] as const,
};

export const useReviews = () => {
  return useQuery({
    queryKey: reviewKeys.lists(),
    queryFn: reviewsService.getReviews,
    staleTime: 5 * 60 * 1000,
  });
};

export const useReview = (reviewId: string) => {
  return useQuery({
    queryKey: reviewKeys.detail(reviewId),
    queryFn: () => reviewsService.getReview(reviewId),
    enabled: !!reviewId,
    staleTime: 5 * 60 * 1000,
  });
};
