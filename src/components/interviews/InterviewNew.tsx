import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Badge } from '../ui/badge';
import { useInterview } from '../../contexts/InterviewContext';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { type Role, roles } from '../../mocks/interviewRoles';

export default function InterviewNew() {
  const navigate = useNavigate();
  const { createInterview } = useInterview();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const handleStartInterview = () => {
    if (!selectedRole) return;

    const interviewId = createInterview(selectedRole.name);
    toast.success(`Собеседование на роль "${selectedRole.name}" начато`);
    navigate(`/interviews/${interviewId}/chat`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        </div>

        <div className="space-y-2">
          <h1>Выберите роль для собеседования</h1>
          <p className="text-muted-foreground">
            Выберите позицию, на которую хотите пройти собеседование, чтобы
            получить персональные рекомендации
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map(role => (
            <Card
              key={role.id}
              className={`cursor-pointer transition-all duration-150 hover:shadow-md flex flex-col h-full ${
                selectedRole?.id === role.id
                  ? 'ring-2 ring-primary border-primary/50'
                  : ''
              }`}
              onClick={() => setSelectedRole(role)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {role.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{role.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {role.category}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 flex-1 flex flex-col">
                <p className="text-sm text-muted-foreground mb-3">
                  {role.description}
                </p>
                <div className="flex flex-wrap gap-1 min-h-7 items-start mt-auto">
                  {role.skills.slice(0, 4).map(skill => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {role.skills.length > 4 && (
                    <Badge variant="secondary" className="text-xs">
                      +{role.skills.length - 4}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedRole && (
          <div className="sticky bottom-4 bg-background/80 backdrop-blur-sm p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <h3>Выбрана роль: {selectedRole.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedRole.description}
                </p>
              </div>
              <Button onClick={handleStartInterview} className="ml-4">
                Начать собеседование
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
