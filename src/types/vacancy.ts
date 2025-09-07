import { Job, Skill, Currency } from './base';

// eslint-disable-next-line import/no-unused-modules
export type EmploymentFormat = 'office' | 'remote' | 'hybrid';
// eslint-disable-next-line import/no-unused-modules
export type EmploymentType =
  | 'full_time'
  | 'part_time'
  | 'contract'
  | 'internship'
  | 'project';

// eslint-disable-next-line import/no-unused-modules
export interface Company {
  id: string;
  name: string;
}

// eslint-disable-next-line import/no-unused-modules
export interface City {
  id: string;
  name: string;
}

// eslint-disable-next-line import/no-unused-modules
export interface SalaryRange {
  currency: Currency;
  min_salary?: number;
  max_salary?: number;
}

// eslint-disable-next-line import/no-unused-modules
export interface ExperienceRange {
  min_years?: number;
  max_years?: number;
}

// eslint-disable-next-line import/no-unused-modules
export interface Vacancy {
  id: string;
  name: string;
  job: Job;
  skills: Skill[];
  company: Company;
  employment_format: EmploymentFormat;
  employment_type: EmploymentType;
  city?: City;
  description: string;
  link: string;
  experience: ExperienceRange;
  salary: SalaryRange;
  scraped_at: string;
}
