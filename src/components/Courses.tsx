import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { ExternalLink, BookOpen } from 'lucide-react';
import { usePublicCourses } from '../hooks/useCourses';

export default function Courses() {
  const { data: courses = [], isLoading } = usePublicCourses();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1>Курсы</h1>
          <p className="text-muted-foreground">
            Развивайте свои навыки с помощью лучших образовательных курсов
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-muted-foreground">
            {isLoading ? 'Загрузка...' : `Найдено ${courses.length} курсов`}
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
          ) : courses.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3>Курсы не найдены</h3>
                <p className="text-muted-foreground">Попробуйте позже</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => (
                <Card
                  key={course.id}
                  className="hover:shadow-md cursor-pointer flex flex-col h-full"
                >
                  <CardContent className="p-6 flex flex-col flex-1">
                    <div className="space-y-4 flex-1">
                      <div>
                        <div className="mb-2">
                          <h3 className="line-clamp-2">{course.name}</h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary" className="font-medium">
                          {course.price.price === 0
                            ? 'Бесплатно'
                            : `${course.price.price}${course.price.currency === 'RUB' ? '₽' : '$'}`}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {course.description}
                      </p>

                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1 min-h-7 items-start">
                          {course.skills.slice(0, 4).map(skill => (
                            <Badge
                              key={skill.id}
                              variant="outline"
                              className="text-xs"
                            >
                              {skill.name}
                            </Badge>
                          ))}
                          {course.skills.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{course.skills.length - 4}
                            </Badge>
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
