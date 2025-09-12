import { useQuery, useQueryClient } from '@tanstack/react-query';
import { coursesService } from '../services/courses';
import { toast } from 'sonner';

// Query keys для кэширования
export const courseKeys = {
  all: ['courses'] as const,
  lists: () => [...courseKeys.all, 'list'] as const,
  list: (interviewId?: string, limit?: number) => 
    [...courseKeys.lists(), { interviewId, limit }] as const,
  public: (limit?: number) => [...courseKeys.all, 'public', { limit }] as const,
};

// Хук для получения курсов пользователя
export const useCourses = (interviewId?: string, limit: number = 20) => {
  return useQuery({
    queryKey: courseKeys.list(interviewId, limit),
    queryFn: () => coursesService.getCourses(limit, interviewId),
    staleTime: 5 * 60 * 1000, // 5 минут
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
    select: (data) => data || [],
    onError: (error: any) => {
      if (error?.response?.status !== 404) {
        const message = error?.response?.data?.detail || 'Ошибка при загрузке курсов';
        toast.error(message);
      }
    },
  });
};

// Хук для получения публичных курсов (без авторизации)
export const usePublicCourses = (limit: number = 20) => {
  return useQuery({
    queryKey: courseKeys.public(limit),
    queryFn: () => coursesService.getPublicCourses(limit),
    staleTime: 10 * 60 * 1000, // 10 минут (публичные данные можно кэшировать дольше)
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
    select: (data) => data || [],
  });
};

// Хук для префетчинга курсов (предзагрузка)
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