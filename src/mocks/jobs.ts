export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  skills: string[];
  requirements: string[];
  description: string;
  postedDays: number;
  saved: boolean;
}

export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior ML Engineer',
    company: 'Яндекс',
    location: 'Москва',
    salary: '300-500k ₽',
    type: 'Полная занятость',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'MLOps'],
    requirements: [
      'Опыт 5+ лет',
      'Знание ML алгоритмов',
      'Опыт с облачными платформами',
    ],
    description: 'Разработка и внедрение ML решений для поисковых систем...',
    postedDays: 2,
    saved: false,
  },
  {
    id: '2',
    title: 'ML Developer',
    company: 'Сбер',
    location: 'Москва / Remote',
    salary: '200-350k ₽',
    type: 'Полная занятость',
    skills: ['Python', 'Sklearn', 'TensorFlow', 'SQL'],
    requirements: [
      'Опыт 3+ лет',
      'Высшее техническое образование',
      'Знание статистики',
    ],
    description: 'Создание предиктивных моделей для банковских продуктов...',
    postedDays: 5,
    saved: true,
  },
  {
    id: '3',
    title: 'Junior ML Engineer',
    company: 'VK',
    location: 'Санкт-Петербург',
    salary: '150-250k ₽',
    type: 'Полная занятость',
    skills: ['Python', 'Pandas', 'Numpy', 'ML'],
    requirements: ['Опыт 1+ год', 'Знание Python', 'Портфолио проектов'],
    description: 'Участие в разработке рекомендательных систем...',
    postedDays: 1,
    saved: false,
  },
  {
    id: '4',
    title: 'Senior Data Scientist',
    company: 'Тинькофф',
    location: 'Remote',
    salary: '400-600k ₽',
    type: 'Полная занятость',
    skills: ['Python', 'R', 'SQL', 'Deep Learning', 'Statistics'],
    requirements: ['Опыт 5+ лет', 'PhD желательно', 'Публикации в области ML'],
    description: 'Исследования в области финтеха и риск-менеджмента...',
    postedDays: 3,
    saved: false,
  },
];

export const jobRoles = [
  'ML-разработчик',
  'Data Scientist',
  'ML Engineer',
  'Frontend-разработчик',
  'Backend-разработчик',
  'Все роли',
];
