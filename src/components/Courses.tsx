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
import { Search, ExternalLink, Clock, Star, BookOpen } from 'lucide-react';
import { type Course, mockCourses, courseRoles } from '../mocks/courses';

export default function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    role: searchParams.get('role') || 'Все роли',
  });

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setCourses(mockCourses);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesSearch =
      filters.search === '' ||
      course.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      course.platform.toLowerCase().includes(filters.search.toLowerCase()) ||
      course.skills.some(skill =>
        skill.toLowerCase().includes(filters.search.toLowerCase())
      );

    const matchesRole =
      filters.role === 'Все роли' ||
      course.skills.some(skill => {
        if (filters.role === 'ML-разработчик') {
          return [
            'Machine Learning',
            'Deep Learning',
            'TensorFlow',
            'PyTorch',
            'Python',
          ].includes(skill);
        }
        if (filters.role === 'Data Scientist') {
          return ['Data Analysis', 'Statistics', 'Python', 'SQL'].includes(
            skill
          );
        }
        return true;
      });

    return matchesSearch && matchesRole;
  });

  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    if (key === 'role' && value !== 'Все роли') {
      setSearchParams({ role: value });
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1>Курсы</h1>
          <p className="text-muted-foreground">
            Развивайте свои навыки с помощью лучших образовательных курсов
          </p>
        </div>

        <Card className="sticky top-20 z-10 bg-background/95 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Поиск по курсам, навыкам, платформам..."
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
                  {courseRoles.map(role => (
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
              : `Найдено ${filteredCourses.length} курсов`}
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
          ) : filteredCourses.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3>Курсы не найдены</h3>
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
              {filteredCourses.map(course => (
                <Card
                  key={course.id}
                  className="hover:shadow-md cursor-pointer flex flex-col h-full"
                >
                  <CardContent className="p-6 flex flex-col flex-1">
                    <div className="space-y-4 flex-1">
                      <div>
                        <div className="mb-2">
                          <h3 className="line-clamp-2">{course.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {course.platform} • {course.instructor}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{course.rating}</span>
                          <span className="text-muted-foreground">
                            ({course.reviews})
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>{course.duration}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={getLevelColor(course.level)}>
                          {course.level}
                        </Badge>
                        <Badge variant="outline">{course.language}</Badge>
                        <Badge variant="secondary" className="font-medium">
                          {course.price}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {course.description}
                      </p>

                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1 min-h-7 items-start">
                          {course.skills.slice(0, 4).map(skill => (
                            <Badge
                              key={skill}
                              variant="outline"
                              className="text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                          {course.skills.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{course.skills.length - 4}
                            </Badge>
                          )}
                        </div>

                        <div className="text-xs h-8 flex items-start">
                          {course.gapsAddressed.length > 0 ? (
                            <>
                              <span className="text-muted-foreground">
                                Закрывает пробелы:{' '}
                              </span>
                              <span className="text-primary font-medium">
                                {course.gapsAddressed.join(', ')}
                              </span>
                            </>
                          ) : (
                            <span>&nbsp;</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <Button className="w-full flex items-center gap-2 mt-4">
                      <ExternalLink className="w-4 h-4" />
                      Перейти к курсу
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
