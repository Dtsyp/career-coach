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
import { Search, ExternalLink, MapPin, Coins } from 'lucide-react';
import { jobRoles } from '../constants/roles';
import { useVacancies } from '../hooks/useData';
import { Vacancy } from '../types';

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: '',
    role: searchParams.get('role') || 'Все роли',
  });
  
  const { data: vacancies = [], isLoading, error } = useVacancies();
  

  const filteredJobs = vacancies.filter(job => {
    const matchesSearch =
      filters.search === '' ||
      job.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.company.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.skills.some(skill =>
        skill.name.toLowerCase().includes(filters.search.toLowerCase())
      );

    const matchesRole =
      filters.role === 'Все роли' ||
      job.name.toLowerCase().includes(filters.role.toLowerCase());

    return matchesSearch && matchesRole;
  });

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
                  {jobRoles.map(role => (
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
            {isLoading
              ? 'Загрузка...'
              : `Найдено ${filteredJobs.length} вакансий`}
          </p>

          {isLoading ? (
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
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <h3 className="line-clamp-2">{job.name}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {job.company.name}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{job.city ? job.city.name : 'Remote'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Coins className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {job.salary.min_salary && job.salary.max_salary
                              ? `${job.salary.min_salary / 1000}-${job.salary.max_salary / 1000}k ${job.salary.currency === 'RUB' ? '₽' : '$'}`
                              : 'Зп не указана'}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap gap-1 min-h-7 items-start">
                        {job.skills.slice(0, 4).map(skill => (
                          <Badge
                            key={skill.id}
                            variant="outline"
                            className="text-xs"
                          >
                            {skill.name}
                          </Badge>
                        ))}
                        {job.skills.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{job.skills.length - 4}
                          </Badge>
                        )}
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
