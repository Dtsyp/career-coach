import { apiClient } from '../lib/api';
import { Interview, InterviewCreate, InterviewUpdate } from '@/types';

// eslint-disable-next-line import/no-unused-modules
export const interviewsService = {
  getInterview: async (interviewId: string): Promise<Interview> => {
    const response = await apiClient.get(`/interviews/${interviewId}`);
    return response.data;
  },

  getInterviews: async (limit?: number): Promise<Interview[]> => {
    const params = limit ? { limit } : {};
    const response = await apiClient.get('/interviews', { params });
    return response.data;
  },

  createInterview: async (data: InterviewCreate): Promise<Interview> => {
    const response = await apiClient.post('/interviews', data);
    return response.data;
  },

  updateInterview: async (data: InterviewUpdate): Promise<Interview> => {
    const response = await apiClient.put('/interviews', data);
    return response.data;
  },
};
