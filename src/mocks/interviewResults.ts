export interface Skill {
  name: string;
  current: string;
  required: string;
  importance: 'High' | 'Medium' | 'Low';
  status: 'completed' | 'warning' | 'missing';
}

export interface Course {
  id: string;
  title: string;
  platform: string;
  level: string;
  duration: string;
  skills: string[];
  url: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  requirements: string[];
  url: string;
}

export const mockSkills: Skill[] = [
  {
    name: 'Python',
    current: 'Advanced',
    required: 'Advanced',
    importance: 'High',
    status: 'completed',
  },
  {
    name: 'TensorFlow',
    current: 'Intermediate',
    required: 'Advanced',
    importance: 'High',
    status: 'warning',
  },
  {
    name: 'PyTorch',
    current: 'Novice',
    required: 'Intermediate',
    importance: 'Medium',
    status: 'missing',
  },
  {
    name: 'SQL',
    current: 'Intermediate',
    required: 'Intermediate',
    importance: 'Medium',
    status: 'completed',
  },
  {
    name: 'Docker',
    current: 'Novice',
    required: 'Intermediate',
    importance: 'Low',
    status: 'missing',
  },
  {
    name: 'Git',
    current: 'Advanced',
    required: 'Intermediate',
    importance: 'Medium',
    status: 'completed',
  },
];

export const mockResultsCourses: Course[] = [
  {
    id: '1',
    title: 'Deep Learning Specialization',
    platform: 'Coursera',
    level: 'Intermediate',
    duration: '4 месяца',
    skills: ['TensorFlow', 'PyTorch', 'Deep Learning'],
    url: '#',
  },
  {
    id: '2',
    title: 'MLOps Engineering',
    platform: 'Udemy',
    level: 'Advanced',
    duration: '6 недель',
    skills: ['Docker', 'MLOps', 'CI/CD'],
    url: '#',
  },
];

export const mockResultsJobs: Job[] = [
  {
    id: '1',
    title: 'ML Engineer',
    company: 'Tech Corp',
    location: 'Москва / Remote',
    salary: '200-300k',
    requirements: ['Python', 'TensorFlow', 'MLOps'],
    url: '#',
  },
  {
    id: '2',
    title: 'Senior ML Developer',
    company: 'AI Startup',
    location: 'Remote',
    salary: '250-400k',
    requirements: ['PyTorch', 'Python', 'Research'],
    url: '#',
  },
];

export const developmentPlan = [
  {
    period: '0-3 мес',
    title: 'Быстрые выигрыши',
    tasks: [
      'Изучить основы PyTorch',
      'Пройти курс по Docker',
      'Создать pet-проект с TensorFlow',
    ],
  },
  {
    period: '3-6 мес',
    title: 'Углубление',
    tasks: [
      'Изучить продвинутые техники в TensorFlow',
      'Внедрить MLOps в рабочих проектах',
      'Получить сертификацию',
    ],
  },
  {
    period: '6-12 мес',
    title: 'Проекты и практика',
    tasks: [
      'Возглавить ML-проект в команде',
      'Публикация в техническом блоге',
      'Участие в конференциях',
    ],
  },
  {
    period: '12-24 мес',
    title: 'Карьерный рост',
    tasks: [
      'Получить повышение до Senior',
      'Менторство джуниоров',
      'Выход на целевую позицию',
    ],
  },
];
