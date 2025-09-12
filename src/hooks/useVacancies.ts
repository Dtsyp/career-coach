import { useQuery, useQueryClient } from '@tanstack/react-query';
import { vacanciesService } from '../services/vacancies';

// eslint-disable-next-line import/no-unused-modules
export const vacancyKeys = {
  all: ['vacancies'] as const,
  lists: () => [...vacancyKeys.all, 'list'] as const,
  list: (interviewId?: string, limit?: number) =>
    [...vacancyKeys.lists(), { interviewId, limit }] as const,
  details: () => [...vacancyKeys.all, 'detail'] as const,
  detail: (id: string) => [...vacancyKeys.details(), id] as const,
  public: (limit?: number) =>
    [...vacancyKeys.all, 'public', { limit }] as const,
};

// eslint-disable-next-line import/no-unused-modules
export const useVacancies = (interviewId?: string, limit: number = 20) => {
  return useQuery({
    queryKey: vacancyKeys.list(interviewId, limit),
    queryFn: () => vacanciesService.getVacancies(limit, interviewId),
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
export const useVacancy = (vacancyId: string) => {
  return useQuery({
    queryKey: vacancyKeys.detail(vacancyId),
    queryFn: () => vacanciesService.getVacancy(vacancyId),
    enabled: !!vacancyId,
    staleTime: 5 * 60 * 1000,
    // eslint-disable-next-line
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

// eslint-disable-next-line import/no-unused-modules
export const usePublicVacancies = (limit: number = 20) => {
  return useQuery({
    queryKey: vacancyKeys.public(limit),
    queryFn: () => vacanciesService.getPublicVacancies(limit),
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
export const usePrefetchVacancies = () => {
  const queryClient = useQueryClient();

  return (interviewId?: string, limit: number = 20) => {
    queryClient.prefetchQuery({
      queryKey: vacancyKeys.list(interviewId, limit),
      queryFn: () => vacanciesService.getVacancies(limit, interviewId),
      staleTime: 5 * 60 * 1000,
    });
  };
};

// eslint-disable-next-line import/no-unused-modules
export const usePrefetchVacancy = () => {
  const queryClient = useQueryClient();

  return (vacancyId: string) => {
    queryClient.prefetchQuery({
      queryKey: vacancyKeys.detail(vacancyId),
      queryFn: () => vacanciesService.getVacancy(vacancyId),
      staleTime: 5 * 60 * 1000,
    });
  };
};
