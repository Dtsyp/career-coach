import React from 'react';
import { Brain, Code, BarChart, Palette, Database, Users } from 'lucide-react';

export interface Role {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: React.ReactNode;
  skills: string[];
}

export const roles: Role[] = [
  {
    id: 'ml-developer',
    name: 'ML-разработчик',
    category: 'Data Science',
    description: 'Разработка и внедрение алгоритмов машинного обучения',
    icon: <Brain className="w-6 h-6" />,
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Sklearn'],
  },
  {
    id: 'frontend-developer',
    name: 'Frontend-разработчик',
    category: 'Development',
    description: 'Создание пользовательских интерфейсов веб-приложений',
    icon: <Code className="w-6 h-6" />,
    skills: ['React', 'TypeScript', 'CSS', 'JavaScript'],
  },
  {
    id: 'data-scientist',
    name: 'Data Scientist',
    category: 'Data Science',
    description: 'Анализ данных и построение предиктивных моделей',
    icon: <BarChart className="w-6 h-6" />,
    skills: ['Python', 'SQL', 'Statistics', 'Pandas'],
  },
  {
    id: 'ui-ux-designer',
    name: 'UI/UX Дизайнер',
    category: 'Design',
    description: 'Проектирование пользовательского опыта и интерфейсов',
    icon: <Palette className="w-6 h-6" />,
    skills: ['Figma', 'Sketch', 'Prototyping', 'User Research'],
  },
  {
    id: 'backend-developer',
    name: 'Backend-разработчик',
    category: 'Development',
    description: 'Разработка серверной логики и API',
    icon: <Database className="w-6 h-6" />,
    skills: ['Node.js', 'Python', 'PostgreSQL', 'REST API'],
  },
  {
    id: 'product-manager',
    name: 'Product Manager',
    category: 'Management',
    description: 'Управление продуктом и координация команды',
    icon: <Users className="w-6 h-6" />,
    skills: ['Analytics', 'Roadmapping', 'Agile', 'Stakeholder Management'],
  },
];
