import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { useInterview } from '../../hooks/useInterviews';
import { InterviewStatus } from '@/types';
import { 
  ArrowLeft, 
  Calendar, 
  Target, 
  User, 
  Briefcase, 
  BookOpen,
  ExternalLink,
  Clock,
  CheckCircle
} from 'lucide-react';

const getStatusText = (status: InterviewStatus) => {
  switch (status) {
    case 'preference_interview':
      return 'Сбор предпочтений';
    case 'hard_skills_interview':
      return 'Техническое интервью';
    case 'recommendation':
      return 'Рекомендации готовы';
    default:
      return 'Неизвестный статус';
  }
};

const getStatusVariant = (status: InterviewStatus): 'default' | 'secondary' | 'outline' => {
  switch (status) {
    case 'recommendation':
      return 'default';
    case 'hard_skills_interview':
      return 'secondary';
    default:
      return 'outline';
  }
};

const getInterviewProgress = (status: InterviewStatus) => {
  switch (status) {
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

export default function InterviewDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: interview, isLoading, error } = useInterview(id!);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Загружаем интервью...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-12">
            <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="mb-2">Интервью не найдено</h3>
            <p className="text-muted-foreground mb-4">
              Возможно, интервью было удалено или у вас нет доступа к нему
            </p>
            <Button onClick={() => navigate('/')}>
              Вернуться на главную
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!interview) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          К интервью
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Детали интервью</h1>
          <p className="text-muted-foreground">
            Полная информация о прохождении интервью
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Основная информация */}
        <div className="lg:col-span-2 space-y-6">
          {/* Общая информация */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Основная информация
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Роль
                  </label>
                  <p className="text-lg">{interview.job?.name || 'Не указана'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Статус
                  </label>
                  <div className="mt-1">
                    <Badge variant={getStatusVariant(interview.status)}>
                      {getStatusText(interview.status)}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Прогресс
                </label>
                <div className="mt-2">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Завершено</span>
                    <span>{getInterviewProgress(interview.status)}%</span>
                  </div>
                  <Progress
                    value={getInterviewProgress(interview.status)}
                    className="h-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Создано
                  </label>
                  <p>{formatDate(interview.created_at)}</p>
                </div>
                {interview.last_update && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Последнее обновление
                    </label>
                    <p>{formatDate(interview.last_update)}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Навыки */}
          {interview.skills && interview.skills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Навыки
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {interview.skills.map((skill) => (
                    <Badge key={skill.id} variant="secondary">
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Действия */}
          <Card>
            <CardHeader>
              <CardTitle>Действия</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {interview.status === 'recommendation' ? (
                  <Link to={`/interviews/${interview.id}/results`}>
                    <Button className="w-full">
                      <Target className="w-4 h-4 mr-2" />
                      Посмотреть результаты
                    </Button>
                  </Link>
                ) : (
                  <Link to={`/interviews/${interview.id}/chat`}>
                    <Button className="w-full">
                      <Target className="w-4 h-4 mr-2" />
                      Продолжить интервью
                    </Button>
                  </Link>
                )}
                
                <Button variant="outline" disabled className="w-full">
                  <BookOpen className="w-4 h-4 mr-2" />
                  История чата (скоро)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Боковая панель */}
        <div className="space-y-6">
          {/* Информация о пользователе */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Кандидат
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{interview.user.name}</p>
              <p className="text-sm text-muted-foreground">{interview.user.email}</p>
            </CardContent>
          </Card>

          {/* Рекомендованные вакансии */}
          {interview.vacancies && interview.vacancies.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Рекомендованные вакансии</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {interview.vacancies.slice(0, 3).map((vacancy) => (
                  <div key={vacancy.id} className="border rounded p-3">
                    <h4 className="font-medium text-sm line-clamp-2">
                      {vacancy.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {vacancy.company}
                    </p>
                    {vacancy.salary && (
                      <p className="text-xs text-primary font-medium mt-1">
                        {vacancy.salary}
                      </p>
                    )}
                  </div>
                ))}
                
                {interview.vacancies.length > 3 && (
                  <Link 
                    to={`/jobs?role=${encodeURIComponent(interview.job?.name || '')}`}
                    className="block"
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Все вакансии ({interview.vacancies.length})
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          )}

          {/* Рекомендованные курсы */}
          {interview.courses && interview.courses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Рекомендованные курсы</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {interview.courses.slice(0, 3).map((course) => (
                  <div key={course.id} className="border rounded p-3">
                    <h4 className="font-medium text-sm line-clamp-2">
                      {course.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {course.provider}
                    </p>
                    {course.duration && (
                      <p className="text-xs text-primary font-medium mt-1">
                        {course.duration}
                      </p>
                    )}
                  </div>
                ))}
                
                {interview.courses.length > 3 && (
                  <Link 
                    to={`/courses?role=${encodeURIComponent(interview.job?.name || '')}`}
                    className="block"
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Все курсы ({interview.courses.length})
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}