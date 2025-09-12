import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { interviewsService } from '../services/interviews';
import { Interview, InterviewCreate, InterviewUpdate } from '@/types';
import { toast } from 'sonner';

// eslint-disable-next-line import/no-unused-modules
export const interviewKeys = {
  all: ['interviews'] as const,
  lists: () => [...interviewKeys.all, 'list'] as const,
  list: (limit?: number) => [...interviewKeys.lists(), { limit }] as const,
  details: () => [...interviewKeys.all, 'detail'] as const,
  detail: (id: string) => [...interviewKeys.details(), id] as const,
};

// eslint-disable-next-line import/no-unused-modules
export const useInterviews = (limit?: number) => {
  return useQuery({
    queryKey: interviewKeys.list(limit),
    queryFn: () => interviewsService.getInterviews(limit),
    staleTime: 5 * 60 * 1000, // 5 минут
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
export const useInterview = (interviewId: string) => {
  return useQuery({
    queryKey: interviewKeys.detail(interviewId),
    queryFn: () => interviewsService.getInterview(interviewId),
    enabled: !!interviewId,
    staleTime: 5 * 60 * 1000, // 5 минут
    // eslint-disable-next-line
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

// eslint-disable-next-line import/no-unused-modules
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
    // eslint-disable-next-line
    onError: (error: any) => {
      const message =
        error?.response?.data?.detail || 'Ошибка при создании интервью';
      toast.error(message);
      console.error('Error creating interview:', error);
    },
  });
};

// eslint-disable-next-line import/no-unused-modules
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
    // eslint-disable-next-line
    onError: (error: any) => {
      const message =
        error?.response?.data?.detail || 'Ошибка при обновлении интервью';
      toast.error(message);
      console.error('Error updating interview:', error);
    },
  });
};
