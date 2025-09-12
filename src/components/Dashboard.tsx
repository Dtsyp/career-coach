import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { useAuth } from '../contexts/AuthContext';
import { useReviews } from '../hooks/useReviews';
import { Plus, Calendar, Target, Star, Clock, CheckCircle } from 'lucide-react';
import ProgressChart from './ProgressChart';

export default function Dashboard() {
  const { user } = useAuth();
  const { data: reviews = [], isLoading: reviewsLoading } = useReviews();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
    });
  };

  const getOverallProgress = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.progress, 0);
    return Math.round(total / reviews.length);
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

            {reviewsLoading ? (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Загружаем обзоры...</p>
                </CardContent>
              </Card>
            ) : reviews.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3>Нет доступных обзоров</h3>
                  <p className="text-muted-foreground mb-4">
                    Завершите интервью, чтобы увидеть результаты здесь
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map(review => (
                  <Card
                    key={review.id}
                    className="cursor-pointer transition-all hover:shadow-md"
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <h3 className="font-medium text-sm line-clamp-2">
                            {review.role}
                          </h3>
                          <Badge
                            variant={
                              review.status === 'Рекомендации готовы'
                                ? 'default'
                                : review.status === 'Завершено'
                                ? 'secondary'
                                : 'outline'
                            }
                            className="text-xs ml-2"
                          >
                            {review.status === 'Рекомендации готовы' ? (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            ) : review.status === 'В процессе' ? (
                              <Clock className="w-3 h-3 mr-1" />
                            ) : null}
                            {review.status}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Прогресс</span>
                            <span>{review.progress}%</span>
                          </div>
                          <Progress value={review.progress} className="h-1" />
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {formatDate(review.date)}
                            </span>
                          </div>
                          <span className="text-muted-foreground">
                            {review.completed_skills}/{review.skills_count} навыков
                          </span>
                        </div>

                        <Link to={`/reviews/${review.id}`} className="block">
                          <Button size="sm" className="w-full text-xs">
                            Открыть обзор
                          </Button>
                        </Link>
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
                Общий прогресс
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <ProgressChart progress={getOverallProgress()} size={120} />
                  <h4 className="mt-4">Карьерный рост</h4>
                  <p className="text-sm text-muted-foreground">
                    Средний прогресс по всем интервью: {getOverallProgress()}%
                  </p>
                </div>
                {reviews.length > 0 && (
                  <div className="space-y-3">
                    <h4>По ролям:</h4>
                    {reviews.slice(0, 3).map(review => (
                      <div
                        key={review.id}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm">{review.role}</span>
                        <Badge variant="outline">{review.progress}%</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
