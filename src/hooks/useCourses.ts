import { useQuery, useQueryClient } from '@tanstack/react-query';
import { coursesService } from '../services/courses';

// eslint-disable-next-line import/no-unused-modules
export const courseKeys = {
  all: ['courses'] as const,
  lists: () => [...courseKeys.all, 'list'] as const,
  list: (interviewId?: string, limit?: number) =>
    [...courseKeys.lists(), { interviewId, limit }] as const,
  public: (limit?: number) => [...courseKeys.all, 'public', { limit }] as const,
};

// eslint-disable-next-line import/no-unused-modules
export const useCourses = (interviewId?: string, limit: number = 20) => {
  return useQuery({
    queryKey: courseKeys.list(interviewId, limit),
    queryFn: () => coursesService.getCourses(limit, interviewId),
    staleTime: 5 * 60 * 1000,
    // eslint-disable-next-line
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
    select: data => data || [],
  });
};

// eslint-disable-next-line import/no-unused-modules
export const usePublicCourses = (limit: number = 20) => {
  return useQuery({
    queryKey: courseKeys.public(limit),
    queryFn: () => coursesService.getPublicCourses(limit),
    staleTime: 10 * 60 * 1000,
    // eslint-disable-next-line
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
    select: data => data || [],
  });
};

// eslint-disable-next-line import/no-unused-modules
export const usePrefetchCourses = () => {
  const queryClient = useQueryClient();

  return (interviewId?: string, limit: number = 20) => {
    queryClient.prefetchQuery({
      queryKey: courseKeys.list(interviewId, limit),
      queryFn: () => coursesService.getCourses(limit, interviewId),
      staleTime: 5 * 60 * 1000,
    });
  };
};
