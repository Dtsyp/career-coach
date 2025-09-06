import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Skeleton } from './ui/skeleton';
import { Search, ExternalLink, MapPin, Coins, Heart } from 'lucide-react';
import { toast } from 'sonner';

interface Job {
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

const mockJobs: Job[] = [
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

const roles = [
  'ML-разработчик',
  'Data Scientist',
  'ML Engineer',
  'Frontend-разработчик',
  'Backend-разработчик',
  'Все роли',
];

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    role: searchParams.get('role') || 'Все роли',
  });
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set(['2']));

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setJobs(mockJobs.map(job => ({ ...job, saved: savedJobs.has(job.id) })));
      setLoading(false);
    }, 1000);
  }, [savedJobs]);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      filters.search === '' ||
      job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.company.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.skills.some(skill =>
        skill.toLowerCase().includes(filters.search.toLowerCase())
      );

    const matchesRole =
      filters.role === 'Все роли' ||
      job.title.toLowerCase().includes(filters.role.toLowerCase());

    return matchesSearch && matchesRole;
  });

  const handleSaveJob = (jobId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const newSavedJobs = new Set(savedJobs);
    if (newSavedJobs.has(jobId)) {
      newSavedJobs.delete(jobId);
      toast.success('Вакансия удалена из сохраненных');
    } else {
      newSavedJobs.add(jobId);
      toast.success('Вакансия сохранена');
    }
    setSavedJobs(newSavedJobs);
  };

  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    if (key === 'role' && value !== 'Все роли') {
      setSearchParams({ role: value });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1>Вакансии</h1>
          <p className="text-muted-foreground">
            Найдите идеальную работу в области машинного обучения и разработки
          </p>
        </div>

        <Card className="sticky top-20 z-10 bg-background/95 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Поиск по вакансиям, компаниям, навыкам..."
                    value={filters.search}
                    onChange={e => updateFilter('search', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select
                value={filters.role}
                onValueChange={(value: string) => updateFilter('role', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Роль" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(role => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <p className="text-muted-foreground">
            {loading
              ? 'Загрузка...'
              : `Найдено ${filteredJobs.length} вакансий`}
          </p>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                      <Skeleton className="h-20 w-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredJobs.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3>Вакансии не найдены</h3>
                <p className="text-muted-foreground">
                  Попробуйте изменить фильтры или поисковый запрос
                </p>
                <Button
                  variant="outline"
                  onClick={() =>
                    setFilters({
                      search: '',
                      role: 'Все роли',
                    })
                  }
                  className="mt-4"
                >
                  Сбросить фильтры
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map(job => (
                <Card
                  key={job.id}
                  className="hover:shadow-md cursor-pointer flex flex-col h-full"
                >
                  <CardContent className="p-6 flex flex-col flex-1">
                    <div className="space-y-4 flex-1">
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2 flex-wrap flex-1 pr-2">
                            <h3 className="line-clamp-2">{job.title}</h3>
                            {job.postedDays <= 3 && (
                              <Badge
                                variant="secondary"
                                className="flex-shrink-0"
                              >
                                Новая
                              </Badge>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={e => handleSaveJob(job.id, e)}
                            className={`p-1 flex-shrink-0 ${
                              savedJobs.has(job.id)
                                ? 'text-red-600'
                                : 'text-muted-foreground'
                            }`}
                          >
                            <Heart
                              className={`w-4 h-4 ${savedJobs.has(job.id) ? 'fill-current' : ''}`}
                            />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {job.company}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Coins className="w-4 h-4 text-muted-foreground" />
                          <span>{job.salary}</span>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap gap-1 min-h-7 items-start">
                        {job.skills.slice(0, 4).map(skill => (
                          <Badge
                            key={skill}
                            variant="outline"
                            className="text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {job.skills.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{job.skills.length - 4}
                          </Badge>
                        )}
                      </div>

                      <div className="text-xs text-muted-foreground h-4 flex items-center">
                        Опубликовано {job.postedDays}{' '}
                        {job.postedDays === 1 ? 'день' : 'дня'} назад
                      </div>
                    </div>

                    <Button className="w-full flex items-center gap-2 mt-4">
                      <ExternalLink className="w-4 h-4" />
                      Подробнее
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
