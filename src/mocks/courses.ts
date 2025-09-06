export interface Course {
  id: string;
  title: string;
  platform: string;
  instructor: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  language: string;
  rating: number;
  reviews: number;
  price: string;
  skills: string[];
  description: string;
  gapsAddressed: string[];
  saved: boolean;
}

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Machine Learning Specialization',
    platform: 'Coursera',
    instructor: 'Andrew Ng',
    level: 'Beginner',
    duration: '3 месяца',
    language: 'Английский',
    rating: 4.9,
    reviews: 45230,
    price: 'Бесплатно',
    skills: ['Machine Learning', 'Python', 'Neural Networks', 'TensorFlow'],
    description:
      'Comprehensive introduction to machine learning, neural networks, and deep learning...',
    gapsAddressed: ['TensorFlow', 'Neural Networks'],
    saved: false,
  },
  {
    id: '2',
    title: 'Deep Learning Specialization',
    platform: 'Coursera',
    instructor: 'Andrew Ng',
    level: 'Intermediate',
    duration: '4 месяца',
    language: 'Английский',
    rating: 4.8,
    reviews: 38420,
    price: '49$/месяц',
    skills: ['Deep Learning', 'CNN', 'RNN', 'TensorFlow', 'PyTorch'],
    description:
      'Master deep learning and break into AI. This is the path for you to become an AI expert...',
    gapsAddressed: ['PyTorch', 'Deep Learning'],
    saved: true,
  },
  {
    id: '3',
    title: 'Машинное обучение',
    platform: 'Яндекс Практикум',
    instructor: 'Команда ЯП',
    level: 'Beginner',
    duration: '8 месяцев',
    language: 'Русский',
    rating: 4.7,
    reviews: 2340,
    price: '140 000₽',
    skills: ['Python', 'Pandas', 'Sklearn', 'SQL', 'Statistics'],
    description:
      'Полный курс по машинному обучению с практическими проектами...',
    gapsAddressed: ['Statistics', 'SQL'],
    saved: false,
  },
  {
    id: '4',
    title: 'MLOps Engineering',
    platform: 'Udemy',
    instructor: 'DataTalks.Club',
    level: 'Advanced',
    duration: '6 недель',
    language: 'Английский',
    rating: 4.6,
    reviews: 1850,
    price: '5 990₽',
    skills: ['MLOps', 'Docker', 'Kubernetes', 'CI/CD', 'Monitoring'],
    description:
      'Learn how to deploy, monitor, and maintain ML models in production...',
    gapsAddressed: ['Docker', 'MLOps'],
    saved: false,
  },
  {
    id: '5',
    title: 'Анализ данных на Python',
    platform: 'Stepik',
    instructor: 'Биоинформатика',
    level: 'Beginner',
    duration: '2 месяца',
    language: 'Русский',
    rating: 4.5,
    reviews: 5680,
    price: 'Бесплатно',
    skills: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Data Analysis'],
    description:
      'Основы анализа данных с использованием Python и популярных библиотек...',
    gapsAddressed: ['Data Analysis'],
    saved: false,
  },
];

export const courseRoles = [
  'ML-разработчик',
  'Data Scientist',
  'Frontend-разработчик',
  'Backend-разработчик',
  'Все роли',
];
