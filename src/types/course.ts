import { Skill, Currency } from './base';

// eslint-disable-next-line import/no-unused-modules
export interface Price {
  currency: Currency;
  price: number;
}

// eslint-disable-next-line import/no-unused-modules
export interface Course {
  id: string;
  name: string;
  link: string;
  description: string;
  skills: Skill[];
  price: Price;
  time_consumption: string;
}
