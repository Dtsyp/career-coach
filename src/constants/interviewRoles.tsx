import { Brain, Database, Globe, Server } from 'lucide-react';
import React from 'react';

export interface RoleWithIcon {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  skills: string[];
  category: string;
}

export const roles: RoleWithIcon[] = [
  {
    id: '1',
    name: 'ML-разработчик',
    icon: <Brain className="h-8 w-8" />,
    description: 'Разработка и внедрение моделей машинного обучения',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'scikit-learn'],
    category: 'ML',
  },
  {
    id: '2',
    name: 'Data Scientist',
    icon: <Database className="h-8 w-8" />,
    description: 'Анализ данных и построение предиктивных моделей',
    skills: ['Python', 'R', 'SQL', 'Statistics', 'Pandas'],
    category: 'Data',
  },
  {
    id: '3',
    name: 'Frontend-разработчик',
    icon: <Globe className="h-8 w-8" />,
    description: 'Создание пользовательских интерфейсов',
    skills: ['React', 'TypeScript', 'CSS', 'HTML'],
    category: 'Development',
  },
  {
    id: '4',
    name: 'Backend-разработчик',
    icon: <Server className="h-8 w-8" />,
    description: 'Разработка серверной логики и API',
    skills: ['Python', 'FastAPI', 'PostgreSQL', 'Redis'],
    category: 'Development',
  },
];
