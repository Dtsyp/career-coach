import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { useAuth } from '../contexts/AuthContext';
import { User, Shield, Bell, Download, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Profile() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [preferences, setPreferences] = useState({
    defaultRole: 'ML-разработчик',
    emailNotifications: true,
    jobAlerts: false,
    courseRecommendations: true,
    weeklyDigest: true,
  });

  const handleSaveProfile = () => {
    if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      toast.error('Пароли не совпадают');
      return;
    }

    toast.success('Профиль сохранен');
    setIsEditing(false);
    setFormData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }));
  };

  const handleSavePreferences = () => {
    toast.success('Настройки сохранены');
  };

  const handleExportData = () => {
    const data = {
      profile: { username: user?.username, email: user?.email },
      interviews: [], // Would get from context
      preferences: preferences,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-pro-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Данные экспортированы');
  };

  const handleDeleteAccount = () => {
    toast.success('Аккаунт удален');
    logout();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePreferenceChange = (key: string, value: string | boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1>Профиль</h1>
          <p className="text-muted-foreground">
            Управляйте вашим аккаунтом и настройками
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Основное</TabsTrigger>
            <TabsTrigger value="preferences">Предпочтения</TabsTrigger>
            <TabsTrigger value="notifications">Уведомления</TabsTrigger>
            <TabsTrigger value="data">Данные</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Информация о профиле
                </CardTitle>
                <CardDescription>
                  Основная информация вашего аккаунта
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Имя пользователя</Label>
                  <Input
                    id="username"
                    value={user?.username || ''}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    Имя пользователя нельзя изменить
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                {isEditing && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Текущий пароль</Label>
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        placeholder="Введите текущий пароль"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Новый пароль</Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="Оставьте пустым, чтобы не менять"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Подтвердите пароль
                      </Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Повторите новый пароль"
                      />
                    </div>
                  </>
                )}

                <div className="flex gap-2 pt-4">
                  {isEditing ? (
                    <>
                      <Button onClick={handleSaveProfile}>Сохранить</Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData(prev => ({
                            ...prev,
                            email: user?.email || '',
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: '',
                          }));
                        }}
                      >
                        Отменить
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>
                      Редактировать
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Предпочтения</CardTitle>
                <CardDescription>
                  Настройте поведение приложения по умолчанию
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultRole">Роль по умолчанию</Label>
                  <Select
                    value={preferences.defaultRole}
                    onValueChange={value =>
                      handlePreferenceChange('defaultRole', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ML-разработчик">
                        ML-разработчик
                      </SelectItem>
                      <SelectItem value="Data Scientist">
                        Data Scientist
                      </SelectItem>
                      <SelectItem value="Frontend-разработчик">
                        Frontend-разработчик
                      </SelectItem>
                      <SelectItem value="Backend-разработчик">
                        Backend-разработчик
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Будет использоваться при поиске вакансий и курсов
                  </p>
                </div>

                <Button onClick={handleSavePreferences}>
                  Сохранить предпочтения
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Уведомления
                </CardTitle>
                <CardDescription>
                  Управляйте подписками на уведомления
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email уведомления</Label>
                    <p className="text-sm text-muted-foreground">
                      Получать общие уведомления на email
                    </p>
                  </div>
                  <Switch
                    checked={preferences.emailNotifications}
                    onCheckedChange={checked =>
                      handlePreferenceChange('emailNotifications', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Уведомления о вакансиях</Label>
                    <p className="text-sm text-muted-foreground">
                      Получать уведомления о новых подходящих вакансиях
                    </p>
                  </div>
                  <Switch
                    checked={preferences.jobAlerts}
                    onCheckedChange={checked =>
                      handlePreferenceChange('jobAlerts', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Рекомендации курсов</Label>
                    <p className="text-sm text-muted-foreground">
                      Получать персональные рекомендации курсов
                    </p>
                  </div>
                  <Switch
                    checked={preferences.courseRecommendations}
                    onCheckedChange={checked =>
                      handlePreferenceChange('courseRecommendations', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Еженедельная сводка</Label>
                    <p className="text-sm text-muted-foreground">
                      Получать еженедельный отчет о прогрессе
                    </p>
                  </div>
                  <Switch
                    checked={preferences.weeklyDigest}
                    onCheckedChange={checked =>
                      handlePreferenceChange('weeklyDigest', checked)
                    }
                  />
                </div>

                <Button onClick={handleSavePreferences}>
                  Сохранить настройки
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Управление данными
                </CardTitle>
                <CardDescription>
                  Экспорт и удаление ваших данных
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h4>Экспорт данных</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Скачайте все ваши данные в формате JSON
                    </p>
                    <Button
                      variant="outline"
                      onClick={handleExportData}
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Экспортировать данные
                    </Button>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="text-destructive">Удаление аккаунта</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Навсегда удалить ваш аккаунт и все связанные данные. Это
                      действие необратимо.
                    </p>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          className="flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Удалить аккаунт
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Удалить аккаунт?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Это действие навсегда удалит ваш аккаунт и все
                            связанные данные. Все ваши собеседования, результаты
                            и настройки будут потеряны. Это действие нельзя
                            отменить.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Отменить</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteAccount}>
                            Да, удалить аккаунт
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
