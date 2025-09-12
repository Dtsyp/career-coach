import { apiClient } from '../lib/api';
import { Course } from '@/types';

// eslint-disable-next-line import/no-unused-modules
export const coursesService = {
  getCourses: async (limit: number = 20, interviewId?: string): Promise<Course[]> => {
    if (interviewId) {
      const response = await apiClient.get('/courses', {
        params: { limit, interview_id: interviewId },
      });
      return response.data;
    }
    const response = await apiClient.get('/courses/public', {
      params: { limit },
    });
    return response.data;
  },

  getPublicCourses: async (limit: number = 20): Promise<Course[]> => {
    const response = await apiClient.get('/courses/public', {
      params: { limit },
    });
    return response.data;
  },
};
