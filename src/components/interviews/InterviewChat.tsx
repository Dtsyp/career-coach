import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { useInterview } from '../../contexts/InterviewContext';
import { ArrowLeft, Send, Save, User, Bot } from 'lucide-react';
import { toast } from 'sonner';

interface ChatStep {
  id: number;
  title: string;
  questions: string[];
  quickReplies?: string[];
}

interface Message {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface TypingIndicatorProps {
  isVisible: boolean;
}

const interviewSteps: ChatStep[] = [
  {
    id: 1,
    title: 'Знакомство',
    questions: [
      'Привет! Меня зовут Анна, я буду проводить с вами интервью сегодня. Давайте начнем с небольшого знакомства — расскажите немного о себе!',
      'Интересно! А сколько у вас опыта работы в IT-сфере?',
      'Понятно. А над какими проектами вы работали в последние 1-2 года? Расскажите о самом интересном.',
      'Отлично! А что вас больше всего мотивирует в работе?',
    ],
    quickReplies: ['Менее года', '1-2 года', '3-5 лет', 'Более 5 лет'],
  },
  {
    id: 2,
    title: 'Ваши цели',
    questions: [
      'Теперь давайте поговорим о ваших карьерных планах. Какую позицию или роль вы рассматриваете как следующий шаг?',
      'Хорошо! А какая сфера деятельности вас больше всего привлекает?',
      'Понимаю. Скажите, в какой команде или проекте вам было бы интересно работать?',
      'А какие ожидания у вас от зарплаты на новой позиции?',
    ],
    quickReplies: [
      'Продукт',
      'Исследования',
      'Аналитика',
      'Команда',
      'Менеджмент',
    ],
  },
  {
    id: 3,
    title: 'Ваши навыки',
    questions: [
      'Отлично! Теперь давайте оценим ваши технические навыки. Как бы вы оценили свой уровень владения ключевыми технологиями?',
      'Хорошо! А как дела с soft skills? Как вы работаете в команде?',
      'Понятно. Какие инструменты и фреймворки вы используете в ежедневной работе?',
      'И последний вопрос — есть ли у вас какие-то сертификации или курсы, которыми вы гордитесь?',
    ],
    quickReplies: ['Начинающий', 'Средний', 'Продвинутый', 'Эксперт'],
  },
];

function TypingIndicator({ isVisible }: TypingIndicatorProps) {
  if (!isVisible) return null;

  return (
    <div className="flex items-center gap-2 text-muted-foreground text-sm">
      <Bot className="w-4 h-4" />
      <span>Анна печатает</span>
      <div className="flex space-x-1">
        <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce"></div>
      </div>
    </div>
  );
}

export default function InterviewChat() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getInterview, updateInterview } = useInterview();

  const [interview, setInterview] = useState(getInterview(id!));
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [isAIOnline, setIsAIOnline] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!interview) {
      navigate('/');
      return;
    }
    setResponses({});

    if (messages.length === 0) {
      setTimeout(() => {
        addAIMessage(getCurrentQuestion());
      }, 300);
    }
  }, [interview, navigate]);

  const getCurrentQuestion = () => {
    const step = interviewSteps[currentStep - 1];
    return step?.questions[currentQuestion] || '';
  };

  const addAIMessage = (content: string) => {
    setIsTyping(true);

    const typingTime = 1500;

    setTimeout(() => {
      const newMessage: Message = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        content,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
    }, typingTime);
  };

  const addUserMessage = (content: string) => {
    const newMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setCurrentInput('');

    const responseKey = `step${currentStep}_q${currentQuestion}`;
    const newResponses = { ...responses, [responseKey]: content };
    setResponses(newResponses);
  };

  const step = interviewSteps[currentStep - 1];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAIOnline(true);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleQuickReply = (reply: string) => {
    setCurrentInput(prev => (prev ? `${prev} ${reply}` : reply));
  };

  const handleSendMessage = () => {
    if (!currentInput.trim()) {
      toast.error('Пожалуйста, введите сообщение');
      return;
    }

    addUserMessage(currentInput);

    setTimeout(() => {
      if (currentQuestion < (step?.questions.length ?? 0) - 1) {
        setCurrentQuestion(prev => prev + 1);
        setTimeout(() => addAIMessage(getCurrentQuestion()), 800);
      } else if (interview && currentStep < interviewSteps.length) {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        setCurrentQuestion(0);
        setInterview(getInterview(id!));

        setTimeout(() => {
          const nextStepQuestions = interviewSteps[nextStep - 1];
          if (nextStepQuestions) {
            addAIMessage(nextStepQuestions.questions[0]);
          }
        }, 800);
      } else {
        setTimeout(() => {
          addAIMessage(
            'Отлично! Спасибо за интересную беседу. Сейчас я обработаю ваши ответы и подготовлю персональные рекомендации.'
          );

          setTimeout(() => {
            if (interview) {
              updateInterview(interview.id, {
                status: 'recommendation',
              });
            }
            toast.success('Собеседование завершено!');
            navigate(`/interviews/${id}/results`);
          }, 1200);
        }, 600);
      }
    }, 400);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!interview || !step) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p>Собеседование не найдено</p>
      </div>
    );
  }

  const totalQuestions = interviewSteps.reduce(
    (sum, step) => sum + step.questions.length,
    0
  );
  const answeredQuestions = messages.filter(m => m.type === 'user').length;
  const overallProgress = Math.round(
    (answeredQuestions / totalQuestions) * 100
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <div className="flex items-center justify-between mb-6">
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
              <h1>{interview?.job?.name || 'Unknown Role'}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div
                  className={`w-2 h-2 rounded-full ${isAIOnline ? 'bg-green-500' : 'bg-gray-400'}`}
                ></div>
                <span>
                  {isAIOnline
                    ? 'Анна сейчас онлайн'
                    : 'Анна недавно была в сети'}
                </span>
              </div>
            </div>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <Save className="w-3 h-3" />
            {overallProgress}%
          </Badge>
        </div>

        <div className="mb-4">
          <Progress value={overallProgress} className="h-2" />
        </div>

        <div className="flex-1 overflow-y-auto bg-background border rounded-lg p-4 space-y-4 mb-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex items-start gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'ai'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {message.type === 'ai' ? (
                    <Bot className="w-4 h-4" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>

                <div
                  className={`rounded-lg p-3 ${
                    message.type === 'ai'
                      ? 'bg-muted/50 border'
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.type === 'ai'
                        ? 'text-muted-foreground'
                        : 'text-primary-foreground/70'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <TypingIndicator isVisible={isTyping} />

          {!isTyping &&
            step?.quickReplies &&
            messages.length > 0 &&
            messages[messages.length - 1]?.type === 'ai' && (
              <div className="flex flex-wrap gap-2 justify-start ml-11">
                {step?.quickReplies?.map(reply => (
                  <Button
                    key={reply}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickReply(reply)}
                    className="text-xs"
                  >
                    {reply}
                  </Button>
                ))}
              </div>
            )}

          <div ref={messagesEndRef} />
        </div>

        <div className="border rounded-lg p-4 bg-card">
          <div className="flex items-end gap-2">
            <Textarea
              placeholder="Напишите ответ..."
              value={currentInput}
              onChange={e => setCurrentInput(e.target.value)}
              onKeyPress={handleKeyPress}
              rows={2}
              className="resize-none flex-1"
              disabled={isTyping}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!currentInput.trim() || isTyping}
              size="sm"
              className="flex items-center gap-1"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
