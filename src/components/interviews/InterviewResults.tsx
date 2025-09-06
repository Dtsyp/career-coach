import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Checkbox } from '../ui/checkbox';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { useInterview } from '../../contexts/InterviewContext';
import {
  ArrowLeft,
  ExternalLink,
  HelpCircle,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import ProgressChart from '../ProgressChart';
import { toast } from 'sonner';

import {
  mockSkills,
  mockResultsCourses,
  mockResultsJobs,
  developmentPlan,
} from '../../mocks/interviewResults';

export default function InterviewResults() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getInterview } = useInterview();
  const [skillFilter, setSkillFilter] = useState<string>('all');
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  const interview = getInterview(id!);

  if (!interview) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p>Интервью не найдено</p>
      </div>
    );
  }

  const filteredSkills =
    skillFilter === 'all'
      ? mockSkills
      : mockSkills.filter(skill => {
          if (skillFilter === 'gaps') return skill.status !== 'completed';
          if (skillFilter === 'high') return skill.importance === 'High';
          return true;
        });

  const completedSkills = mockSkills.filter(
    s => s.status === 'completed'
  ).length;
  const totalSkills = mockSkills.length;
  const skillProgress = Math.round((completedSkills / totalSkills) * 100);

  const toggleTask = (taskId: string) => {
    const newCompleted = new Set(completedTasks);
    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId);
    } else {
      newCompleted.add(taskId);
    }
    setCompletedTasks(newCompleted);
    toast.success(
      newCompleted.has(taskId)
        ? 'Задача отмечена как выполненная'
        : 'Задача снята с выполнения'
    );
  };

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
            <h1>Результаты — {interview.role}</h1>
            <p className="text-muted-foreground text-sm">
              {new Date(interview.date).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ближайшая позиция</CardTitle>
                </CardHeader>
                <CardContent>
                  <h3>Middle ML-разработчик</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Вы выполняете 80% функций Middle-уровня. Основной фокус на
                    углублении знаний в DL-фреймворках.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Рекомендуемая позиция
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <h3>Senior ML-разработчик</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Соответствует вашим амбициям. Потребует развития в области
                    MLOps и лидерских навыков.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="skills" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="skills">Компетенции</TabsTrigger>
                <TabsTrigger value="plan">План развития</TabsTrigger>
                <TabsTrigger value="courses">Курсы</TabsTrigger>
                <TabsTrigger value="jobs">Вакансии</TabsTrigger>
              </TabsList>

              <TabsContent value="skills" className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <span className="text-sm">Фильтр:</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={skillFilter === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSkillFilter('all')}
                    >
                      Все
                    </Button>
                    <Button
                      variant={skillFilter === 'gaps' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSkillFilter('gaps')}
                    >
                      Пробелы
                    </Button>
                    <Button
                      variant={skillFilter === 'high' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSkillFilter('high')}
                    >
                      Важные
                    </Button>
                  </div>
                </div>

                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Навык</TableHead>
                        <TableHead>Текущий</TableHead>
                        <TableHead>Требуемый</TableHead>
                        <TableHead>Важность</TableHead>
                        <TableHead className="text-center">Статус</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSkills.map(skill => (
                        <TableRow key={skill.name}>
                          <TableCell className="font-medium">
                            {skill.name}
                          </TableCell>
                          <TableCell>{skill.current}</TableCell>
                          <TableCell>{skill.required}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                skill.importance === 'High'
                                  ? 'destructive'
                                  : 'secondary'
                              }
                              className={
                                skill.importance === 'Medium'
                                  ? 'bg-blue-100 text-blue-800 hover:bg-blue-100'
                                  : ''
                              }
                            >
                              {skill.importance === 'High'
                                ? 'Высокая'
                                : skill.importance === 'Medium'
                                  ? 'Средняя'
                                  : 'Низкая'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center">
                              {skill.status === 'completed' ? (
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-success/10">
                                  <CheckCircle2 className="w-5 h-5 text-success" />
                                </div>
                              ) : skill.status === 'warning' ? (
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-warning/10">
                                  <AlertTriangle className="w-5 h-5 text-warning" />
                                </div>
                              ) : (
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-destructive/10">
                                  <XCircle className="w-5 h-5 text-destructive" />
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>

                <div className="flex items-center justify-center gap-6 p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-success/10">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Освоено
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-warning/10">
                      <AlertTriangle className="w-4 h-4 text-warning" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Требует внимания
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-destructive/10">
                      <XCircle className="w-4 h-4 text-destructive" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Необходимо изучить
                    </span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="plan" className="space-y-4">
                {developmentPlan.map((phase, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{phase.period}</CardTitle>
                      <CardDescription>{phase.title}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {phase.tasks.map((task, taskIndex) => {
                          const taskId = `${index}-${taskIndex}`;
                          return (
                            <div
                              key={taskIndex}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={taskId}
                                checked={completedTasks.has(taskId)}
                                onCheckedChange={() => toggleTask(taskId)}
                              />
                              <label
                                htmlFor={taskId}
                                className={`text-sm cursor-pointer ${
                                  completedTasks.has(taskId)
                                    ? 'line-through text-muted-foreground'
                                    : ''
                                }`}
                              >
                                {task}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="courses" className="space-y-4">
                <div className="grid gap-4">
                  {mockResultsCourses.map(course => (
                    <Card key={course.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <h3>{course.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{course.platform}</span>
                              <span>{course.level}</span>
                              <span>{course.duration}</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {course.skills.map(skill => (
                                <Badge
                                  key={skill}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {skill}
                                </Badge>
                              ))}
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
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="jobs" className="space-y-4">
                <div className="grid gap-4">
                  {mockResultsJobs.map(job => (
                    <Card key={job.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <h3>{job.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{job.company}</span>
                              <span>{job.location}</span>
                              <span className="font-medium text-foreground">
                                {job.salary}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {job.requirements.map(req => (
                                <Badge
                                  key={req}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {req}
                                </Badge>
                              ))}
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
                  ))}
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
                <ProgressChart progress={skillProgress} />
                <p className="text-sm text-muted-foreground mt-4">
                  Закрыто {completedSkills} из {totalSkills} ключевых навыков
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Быстрые действия</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to={`/jobs?role=${encodeURIComponent(interview.role)}`}>
                  <Button variant="outline" className="w-full justify-start">
                    Посмотреть все вакансии
                  </Button>
                </Link>
                <Link
                  to={`/courses?role=${encodeURIComponent(interview.role)}`}
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
