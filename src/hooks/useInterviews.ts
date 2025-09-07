{
  /* eslint-disable import/no-unused-modules */
}
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { interviewsService } from '../services/interviews';
import { Interview, InterviewCreate, InterviewUpdate } from '@/types';

export const useInterviews = (limit?: number) => {
  return useQuery({
    queryKey: ['interviews', { limit }],
    queryFn: () => interviewsService.getInterviews(limit),
  });
};

export const useInterview = (interviewId: string) => {
  return useQuery({
    queryKey: ['interviews', interviewId],
    queryFn: () => interviewsService.getInterview(interviewId),
    enabled: !!interviewId,
  });
};

export const useCreateInterview = () => {
  const queryClient = useQueryClient();
  return useMutation<Interview, Error, InterviewCreate>({
    mutationFn: interviewsService.createInterview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] });
    },
  });
};

export const useUpdateInterview = () => {
  const queryClient = useQueryClient();
  return useMutation<Interview, Error, InterviewUpdate>({
    mutationFn: interviewsService.updateInterview,
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] });
      queryClient.setQueryData(['interviews', data.id], data);
    },
  });
};
