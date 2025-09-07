import { Skill, Currency } from './base';

export interface Price {
  currency: Currency;
  price: number;
}

export interface Course {
  id: string;
  name: string;
  link: string;
  description: string;
  skills: Skill[];
  price: Price;
  time_consumption: string;
}
