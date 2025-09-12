import { apiClient } from '../lib/api';

export interface ReviewCard {
  id: string;
  role: string;
  date: string;
  status: string;
  progress: number;
  skills_count: number;
  completed_skills: number;
}

export interface ReviewSkill {
  name: string;
  current: string;
  required: string;
  importance: string;
  status: 'completed' | 'warning' | 'critical';
}

export interface ReviewCourse {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  link: string;
  skills: string[];
}

export interface ReviewVacancy {
  id: string;
  name: string;
  company: string;
  location: string;
  salary_min?: number;
  salary_max?: number;
  currency: string;
  description: string;
  link: string;
  skills: string[];
}

export interface ReviewDetail {
  id: string;
  role: string;
  date: string;
  status: string;
  progress: number;
  overall_score: number;
  skills: ReviewSkill[];
  development_plan: string;
  courses: ReviewCourse[];
  vacancies: ReviewVacancy[];
  recommendations: string;
}

export const reviewsService = {
  getReviews: async (): Promise<ReviewCard[]> => {
    const response = await apiClient.get('/reviews');
    return response.data;
  },

  getReview: async (reviewId: string): Promise<ReviewDetail> => {
    const response = await apiClient.get(`/review/${reviewId}`);
    return response.data;
  },
};
