import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { interviewsService } from '../services/interviews';
import { Interview, InterviewCreate, InterviewUpdate } from '@/types';
import { toast } from 'sonner';

// Query keys для лучшего кэширования
export const interviewKeys = {
  all: ['interviews'] as const,
  lists: () => [...interviewKeys.all, 'list'] as const,
  list: (limit?: number) => [...interviewKeys.lists(), { limit }] as const,
  details: () => [...interviewKeys.all, 'detail'] as const,
  detail: (id: string) => [...interviewKeys.details(), id] as const,
};

export const useInterviews = (limit?: number) => {
  return useQuery({
    queryKey: interviewKeys.list(limit),
    queryFn: () => interviewsService.getInterviews(limit),
    staleTime: 5 * 60 * 1000, // 5 минут
    retry: (failureCount, error: any) => {
      // Не повторяем запрос при 404 (нет интервью)
      if (error?.response?.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
    // Возвращаем пустой массив при ошибке 404
    select: data => data || [],
  });
};

export const useInterview = (interviewId: string) => {
  return useQuery({
    queryKey: interviewKeys.detail(interviewId),
    queryFn: () => interviewsService.getInterview(interviewId),
    enabled: !!interviewId,
    staleTime: 5 * 60 * 1000, // 5 минут
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

export const useCreateInterview = () => {
  const queryClient = useQueryClient();
  return useMutation<Interview, Error, InterviewCreate>({
    mutationFn: interviewsService.createInterview,
    onSuccess: (newInterview: Interview) => {
      queryClient.invalidateQueries({ queryKey: interviewKeys.lists() });
      queryClient.setQueryData(
        interviewKeys.detail(newInterview.id),
        newInterview
      );
      toast.success('Интервью успешно создано!');
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.detail || 'Ошибка при создании интервью';
      toast.error(message);
      console.error('Error creating interview:', error);
    },
  });
};

export const useUpdateInterview = () => {
  const queryClient = useQueryClient();
  return useMutation<Interview, Error, InterviewUpdate>({
    mutationFn: interviewsService.updateInterview,
    onSuccess: (updatedInterview: Interview) => {
      queryClient.setQueryData(
        interviewKeys.detail(updatedInterview.id),
        updatedInterview
      );
      queryClient.invalidateQueries({ queryKey: interviewKeys.lists() });
      toast.success('Интервью успешно обновлено!');
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.detail || 'Ошибка при обновлении интервью';
      toast.error(message);
      console.error('Error updating interview:', error);
    },
  });
};
