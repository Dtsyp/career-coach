{
  /* eslint-disable import/no-unused-modules */
}
import { useQuery } from '@tanstack/react-query';
import { coursesService } from '../services/courses';
import { vacanciesService } from '../services/vacancies';
import { rolesService } from '../services/roles';
import { interviewsService } from '../services/interviews';

export const useCourses = (limit?: number) => {
  return useQuery({
    queryKey: ['courses', { limit }],
    queryFn: () => coursesService.getCourses(limit),
  });
};

export const useVacancies = (limit?: number) => {
  return useQuery({
    queryKey: ['vacancies', { limit }],
    queryFn: () => vacanciesService.getVacancies(limit),
  });
};

export const useVacancy = (vacancyId: string) => {
  return useQuery({
    queryKey: ['vacancies', vacancyId],
    queryFn: () => vacanciesService.getVacancy(vacancyId),
    enabled: !!vacancyId,
  });
};

export const useRoles = () => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: rolesService.getRoles,
  });
};

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
