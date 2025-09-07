import { Job, Skill, Currency } from './base';

export type EmploymentFormat = 'office' | 'remote' | 'hybrid';
export type EmploymentType =
  | 'full_time'
  | 'part_time'
  | 'contract'
  | 'internship'
  | 'project';

export interface Company {
  id: string;
  name: string;
}

export interface City {
  id: string;
  name: string;
}

export interface SalaryRange {
  currency: Currency;
  min_salary?: number;
  max_salary?: number;
}

export interface ExperienceRange {
  min_years?: number;
  max_years?: number;
}

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
