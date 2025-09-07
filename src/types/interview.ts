import { Job, Skill } from './base';
import { UserPublic } from './user';
import { Course } from './course';
import { Vacancy } from './vacancy';

// eslint-disable-next-line import/no-unused-modules
export type InterviewStatus =
  | 'preference_interview'
  | 'hard_skills_interview'
  | 'recommendation';

// eslint-disable-next-line import/no-unused-modules
export interface Interview {
  id: string;
  user: UserPublic;
  job?: Job;
  skills?: Skill[];
  vacancies?: Vacancy[];
  courses?: Course[];
  status: InterviewStatus;
  created_at: string; // ISO date string
  last_update?: string; // ISO date string
}

// eslint-disable-next-line import/no-unused-modules
export interface InterviewCreate {
  user: UserPublic;
  status: InterviewStatus;
  created_at: string;
  last_update?: string;
}

// eslint-disable-next-line import/no-unused-modules
export interface InterviewUpdate {
  id: string;
  job?: Job;
  skills?: Skill[];
  vacancies?: Vacancy[];
  courses?: Course[];
  status?: InterviewStatus;
  last_update: string;
}
