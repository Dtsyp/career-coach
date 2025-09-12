import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { Badge } from '../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { useReview } from '../../hooks/useReviews';
import {
  ArrowLeft,
  ExternalLink,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  MapPin,
  Coins,
} from 'lucide-react';
import ProgressChart from '../ProgressChart';

export default function ReviewDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: review, isLoading, error } = useReview(id!);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  if (error || !review) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p>Обзор не найден</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />К собеседованиям
          </Button>
          <div>
            <h1>Результаты — {review.role}</h1>
            <p className="text-muted-foreground text-sm">
              {new Date(review.date).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="competencies" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4 gap-1 h-auto">
                <TabsTrigger
                  value="competencies"
                  className="text-[10px] sm:text-sm px-1 sm:px-3 pt-1 pb-1 h-auto"
                >
                  Навыки
                </TabsTrigger>
                <TabsTrigger
                  value="development"
                  className="text-[10px] sm:text-sm px-1 sm:px-3 pt-1 pb-1 h-auto"
                >
                  План
                </TabsTrigger>
                <TabsTrigger
                  value="courses"
                  className="text-[10px] sm:text-sm px-1 sm:px-3 pt-1 pb-1 h-auto"
                >
                  Курсы
                </TabsTrigger>
                <TabsTrigger
                  value="jobs"
                  className="text-[10px] sm:text-sm px-1 sm:px-3 pt-1 pb-1 h-auto"
                >
                  Вакансии
                </TabsTrigger>
              </TabsList>

              <TabsContent value="competencies" className="space-y-4">
                <Card>
                  <div className="overflow-x-auto -mx-4 sm:mx-0">
                    <Table className="border-separate border-spacing-y-1 w-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs sm:text-sm px-2 sm:px-4">
                            Навык
                          </TableHead>
                          <TableHead className="text-xs sm:text-sm px-2 sm:px-4">
                            Текущий
                          </TableHead>
                          <TableHead className="text-xs sm:text-sm px-2 sm:px-4">
                            Требуемый
                          </TableHead>
                          <TableHead className="text-xs sm:text-sm px-2 sm:px-4">
                            Важность
                          </TableHead>
                          <TableHead className="text-xs sm:text-sm px-2 sm:px-4 text-center">
                            Статус
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {review.skills.map((skill, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium text-xs sm:text-sm px-2 sm:px-4">
                              {skill.name}
                            </TableCell>
                            <TableCell className="text-xs sm:text-sm px-2 sm:px-4">
                              {skill.current}
                            </TableCell>
                            <TableCell className="text-xs sm:text-sm px-2 sm:px-4">
                              {skill.required}
                            </TableCell>
                            <TableCell className="px-2 sm:px-4">
                              <Badge
                                variant={
                                  skill.importance === 'critical'
                                    ? 'destructive'
                                    : skill.importance === 'high'
                                      ? 'default'
                                      : 'secondary'
                                }
                                className="text-xs"
                              >
                                {skill.importance}
                              </Badge>
                            </TableCell>
                            <TableCell className="px-2 sm:px-4">
                              <div className="flex items-center justify-center">
                                {skill.status === 'completed' ? (
                                  <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-success/10">
                                    <CheckCircle2 className="w-3 h-3 sm:w-5 sm:h-5 text-success" />
                                  </div>
                                ) : skill.status === 'warning' ? (
                                  <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-warning/10">
                                    <AlertTriangle className="w-3 h-3 sm:w-5 sm:h-5 text-warning" />
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-destructive/10">
                                    <XCircle className="w-3 h-3 sm:w-5 sm:h-5 text-destructive" />
                                  </div>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </Card>

                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 p-3 sm:p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-success/10">
                      <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-success" />
                    </div>
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      Освоено
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-warning/10">
                      <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-warning" />
                    </div>
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      Требует внимания
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-destructive/10">
                      <XCircle className="w-3 h-3 sm:w-4 sm:h-4 text-destructive" />
                    </div>
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      Необходимо изучить
                    </span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="development" className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground">
                      {review.development_plan}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="courses" className="space-y-4">
                {review.courses && review.courses.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid gap-4">
                      {review.courses.slice(0, 2).map(course => (
                        <Card
                          key={course.id}
                          className="hover:shadow-md cursor-pointer flex flex-col h-full"
                        >
                          <CardContent className="p-6 flex flex-col flex-1">
                            <div className="space-y-4 flex-1">
                              <div>
                                <div className="mb-2">
                                  <h3 className="line-clamp-2">
                                    {course.name}
                                  </h3>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge
                                  variant="secondary"
                                  className="font-medium"
                                >
                                  {course.price === 0
                                    ? 'Бесплатно'
                                    : `${course.price}${course.currency === 'RUB' ? '₽' : '$'}`}
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
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
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
                    {review.courses.length > 2 && (
                      <div className="text-center">
                        <Link
                          to={`/courses?role=${encodeURIComponent(review.role)}`}
                          className="inline-block hover:opacity-80 transition-opacity"
                        >
                          <Button variant="outline">
                            Показать все курсы ({review.courses.length})
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">
                      Рекомендации по курсам будут доступны после завершения
                      интервью
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="jobs" className="space-y-4">
                {review.vacancies && review.vacancies.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid gap-4">
                      {review.vacancies.slice(0, 2).map(vacancy => (
                        <Card
                          key={vacancy.id}
                          className="hover:shadow-md cursor-pointer flex flex-col h-full"
                        >
                          <CardContent className="p-6 flex flex-col flex-1">
                            <div className="space-y-4 flex-1">
                              <div>
                                <div className="flex items-center gap-2 flex-wrap mb-2">
                                  <h3 className="line-clamp-2">
                                    {vacancy.name}
                                  </h3>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {vacancy.company}
                                </p>
                              </div>

                              <div className="flex flex-col gap-2 text-sm">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4 text-muted-foreground" />
                                  <span>
                                    {vacancy.location}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Coins className="w-4 h-4 text-muted-foreground" />
                                  <span>
                                    {vacancy.salary_min && vacancy.salary_max
                                      ? `${vacancy.salary_min / 1000}-${vacancy.salary_max / 1000}k ${vacancy.currency === 'RUB' ? '₽' : '$'}`
                                      : 'Зп не указана'}
                                  </span>
                                </div>
                              </div>

                              <p className="text-sm text-muted-foreground line-clamp-3">
                                {vacancy.description}
                              </p>

                              <div className="flex flex-wrap gap-1 min-h-7 items-start">
                                {vacancy.skills.slice(0, 4).map(skill => (
                                  <Badge
                                    key={skill}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                                {vacancy.skills.length > 4 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{vacancy.skills.length - 4}
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
                    {review.vacancies.length > 2 && (
                      <div className="text-center">
                        <Link
                          to={`/jobs?role=${encodeURIComponent(review.role)}`}
                          className="inline-block hover:opacity-80 transition-opacity"
                        >
                          <Button variant="outline">
                            Показать все вакансии ({review.vacancies.length})
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">
                      Рекомендации по вакансиям будут доступны после завершения
                      интервью
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Прогресс «До цели»
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Показывает ваш общий результат по всем навыкам</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <ProgressChart progress={review.overall_score} />
                <p className="text-sm text-muted-foreground mt-4">
                  Общий результат: {review.overall_score}%
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}