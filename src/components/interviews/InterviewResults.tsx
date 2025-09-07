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
import { useInterview } from '../../hooks/useData';
import { ArrowLeft, ExternalLink, HelpCircle } from 'lucide-react';
import ProgressChart from '../ProgressChart';

export default function InterviewResults() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: interview, isLoading, error } = useInterview(id!);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p>Интервью не найдено</p>
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
            <h1>Результаты — {interview.job?.name || 'Unknown Role'}</h1>
            <p className="text-muted-foreground text-sm">
              {new Date(interview.created_at).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="courses" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="courses">Курсы</TabsTrigger>
                <TabsTrigger value="jobs">Вакансии</TabsTrigger>
              </TabsList>

              <TabsContent value="courses" className="space-y-4">
                <div className="grid gap-4">
                  {interview.courses?.map(course => (
                    <Card key={course.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <h3>{course.name}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{course.time_consumption}</span>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Перейти
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )) ?? (
                    <div className="p-8 text-center">
                      <p className="text-muted-foreground">
                        Рекомендации по курсам будут доступны после завершения
                        интервью
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="jobs" className="space-y-4">
                <div className="grid gap-4">
                  {interview.vacancies?.map(vacancy => (
                    <Card key={vacancy.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <h3>{vacancy.name}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{vacancy.company.name}</span>
                              <span>
                                {vacancy.city ? vacancy.city.name : 'Remote'}
                              </span>
                              <span className="font-medium text-foreground">
                                {vacancy.salary.min_salary &&
                                vacancy.salary.max_salary
                                  ? `${vacancy.salary.min_salary / 1000}-${vacancy.salary.max_salary / 1000}k ${vacancy.salary.currency === 'RUB' ? '₽' : '$'}`
                                  : 'Зп не указана'}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Подробнее
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )) ?? (
                    <div className="p-8 text-center">
                      <p className="text-muted-foreground">
                        Рекомендации по вакансиям будут доступны после
                        завершения интервью
                      </p>
                    </div>
                  )}
                </div>
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
                        <p>
                          Показывает ваш прогресс в развитии навыков для
                          достижения цели
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <ProgressChart progress={0} />
                <p className="text-sm text-muted-foreground mt-4">
                  Прогресс будет отслеживаться после завершения интервью
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Быстрые действия</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link
                  to={`/jobs?role=${encodeURIComponent(interview.job?.name || '')}`}
                >
                  <Button variant="outline" className="w-full justify-start">
                    Посмотреть все вакансии
                  </Button>
                </Link>
                <Link
                  to={`/courses?role=${encodeURIComponent(interview.job?.name || '')}`}
                >
                  <Button variant="outline" className="w-full justify-start">
                    Все курсы по роли
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
