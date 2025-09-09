import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { useAuth } from '../contexts/AuthContext';
import { useInterviews } from '../hooks/useData';
import { Interview } from '@/types';
import { Plus, Calendar, Target, ExternalLink } from 'lucide-react';
import ProgressChart from './ProgressChart';

export default function Dashboard() {
  const { user } = useAuth();
  const { data: interviews = [], isLoading } = useInterviews();
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(
    null
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
    });
  };

  const getInterviewProgress = (interview: Interview) => {
    switch (interview.status) {
      case 'preference_interview':
        return 20;
      case 'hard_skills_interview':
        return 60;
      case 'recommendation':
        return 100;
      default:
        return 0;
    }
  };

  const getInterviewRole = (interview: Interview) => {
    return interview.job?.name || 'Unknown Role';
  };

  const getInterviewDate = (interview: Interview) => {
    return interview.created_at;
  };

  const getOverallProgress = () => {
    if (interviews.length === 0) return 0;
    const total = interviews.reduce(
      (sum, interview) => sum + getInterviewProgress(interview),
      0
    );
    return Math.round(total / interviews.length);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-2 no-transition">
            <h1 className="text-3xl font-bold main-greeting dashboard-title">
              Привет, {user?.name}!
            </h1>
            <p className="text-muted-foreground dashboard-greeting">
              Продолжайте развивать свою карьеру с помощью персонализированных
              собеседований
            </p>
          </div>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3>Готовы к новому вызову?</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Пройдите собеседование для новой роли и получите
                    персональные рекомендации
                  </p>
                </div>
                <Link to="/interviews/new" className="self-start sm:self-auto">
                  <Button className="flex items-center gap-2 w-full sm:w-auto">
                    <Plus className="w-4 h-4" />
                    <span className="sm:inline">Начать собеседование</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4 no-transition">
            <h2 className="dashboard-title">Мои собеседования</h2>

            {isLoading ? (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">
                    Загружаем собеседования...
                  </p>
                </CardContent>
              </Card>
            ) : interviews.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3>Пока нет собеседований</h3>
                  <p className="text-muted-foreground mb-4">
                    Начните со списка ролей — ML, Frontend, DS…
                  </p>
                  <Link to="/interviews/new">
                    <Button>Создать первое собеседование</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {interviews.map(interview => (
                  <Card
                    key={interview.id}
                    className={`cursor-pointer transition-all hover:shadow-md h-full ${
                      selectedInterview?.id === interview.id
                        ? 'ring-2 ring-primary border-primary/50'
                        : ''
                    }`}
                    onClick={() => setSelectedInterview(interview)}
                  >
                    <CardContent className="p-6 h-full flex flex-col">
                      <div className="space-y-4 flex-1">
                        <div>
                          <h3 className="line-clamp-2 mb-2">
                            {getInterviewRole(interview)}
                          </h3>
                          <div className="flex items-center justify-between">
                            <Badge
                              variant={
                                interview.status === 'recommendation'
                                  ? 'default'
                                  : 'secondary'
                              }
                            >
                              {interview.status === 'recommendation'
                                ? 'Завершено'
                                : 'В процессе'}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              {formatDate(getInterviewDate(interview))}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Прогресс</span>
                            <span>{getInterviewProgress(interview)}%</span>
                          </div>
                          <Progress
                            value={getInterviewProgress(interview)}
                            className="h-2"
                          />
                        </div>

                        <div className="flex gap-2">
                          <Link
                            to={`/jobs?role=${encodeURIComponent(getInterviewRole(interview))}`}
                            className="flex-1"
                          >
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-xs w-full"
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Вакансии
                            </Button>
                          </Link>
                          <Link
                            to={`/courses?role=${encodeURIComponent(getInterviewRole(interview))}`}
                            className="flex-1"
                          >
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-xs w-full"
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Курсы
                            </Button>
                          </Link>
                        </div>
                      </div>

                      <div className="mt-4">
                        {interview.status === 'recommendation' ? (
                          <Link
                            to={`/interviews/${interview.id}/results`}
                            className="block"
                          >
                            <Button
                              size="sm"
                              variant="ghost"
                              className="w-full"
                            >
                              Открыть результаты
                            </Button>
                          </Link>
                        ) : (
                          <Link
                            to={`/interviews/${interview.id}/chat`}
                            className="block"
                          >
                            <Button size="sm" className="w-full">
                              Продолжить
                            </Button>
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                До цели
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedInterview ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <ProgressChart
                      progress={getInterviewProgress(selectedInterview)}
                      size={120}
                    />
                    <h4 className="mt-4">
                      {getInterviewRole(selectedInterview)}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Закрыто{' '}
                      {Math.round(
                        getInterviewProgress(selectedInterview) * 0.1
                      )}{' '}
                      из 10 ключевых навыков
                    </p>
                  </div>
                  {selectedInterview.status === 'recommendation' && (
                    <Link to={`/interviews/${selectedInterview.id}/results`}>
                      <Button variant="outline" className="w-full">
                        Посмотреть детали
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    Выберите собеседование для просмотра детального прогресса
                  </p>
                  {interviews.length > 0 && (
                    <div className="space-y-3">
                      <h4>Общий прогресс:</h4>
                      {interviews.map(interview => (
                        <div
                          key={interview.id}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm">
                            {getInterviewRole(interview)}
                          </span>
                          <Badge variant="outline">
                            {getInterviewProgress(interview)}%
                          </Badge>
                        </div>
                      ))}
                      <div className="pt-2 border-t">
                        <div className="flex items-center justify-between">
                          <span>Средний прогресс</span>
                          <Badge>{getOverallProgress()}%</Badge>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
