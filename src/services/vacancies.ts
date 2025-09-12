import { apiClient } from '../lib/api';
import { Vacancy } from '@/types';

// eslint-disable-next-line import/no-unused-modules
export const vacanciesService = {
  getVacancy: async (vacancyId: string): Promise<Vacancy> => {
    const response = await apiClient.get(`/vacancies/${vacancyId}`);
    return response.data;
  },

  getVacancies: async (
    limit: number = 20,
    interviewId?: string
  ): Promise<Vacancy[]> => {
    if (interviewId) {
      const response = await apiClient.get('/vacancies', {
        params: { limit, interview_id: interviewId },
      });
      return response.data;
    }
    const response = await apiClient.get('/vacancies/public', {
      params: { limit },
    });
    return response.data;
  },

  getPublicVacancies: async (limit: number = 20): Promise<Vacancy[]> => {
    const response = await apiClient.get('/vacancies/public', {
      params: { limit },
    });
    return response.data;
  },
};
