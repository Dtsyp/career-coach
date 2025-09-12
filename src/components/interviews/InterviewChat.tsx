import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, Send, User, Bot, WifiOff, Wifi } from 'lucide-react';
import { toast } from 'sonner';
import wsService, { WSMessage } from '../../services/websocket';

interface Message {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: Date;
}

export default function InterviewChat() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [interviewStatus, setInterviewStatus] = useState<string>('');
  const [interviewId, setInterviewId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle WebSocket messages
  const handleWSMessage = useCallback(
    (message: WSMessage) => {
      console.log('Received WS message:', message);

      switch (message.type) {
        case 'ready':
          setIsLoading(false);
          if (message.interview_id) {
            setInterviewId(message.interview_id);
          }
          if (message.status) {
            setInterviewStatus(message.status);
          }
          // Add welcome message
          if (messages.length === 0) {
            const welcomeMsg: Message = {
              id: `ai-welcome-${Date.now()}`,
              type: 'ai',
              content:
                'Привет! Расскажи коротко о своём опыте и желаемой роли/позиции. Укажи ключевые навыки (стек).',
              timestamp: new Date(),
            };
            setMessages([welcomeMsg]);
          }
          break;

        case 'final':
          setIsTyping(false);
          if (message.answer) {
            const aiMessage: Message = {
              id: `ai-${Date.now()}`,
              type: 'ai',
              content: message.answer,
              timestamp: new Date(),
            };
            setMessages(prev => [...prev, aiMessage]);
          }
          if (message.status) {
            setInterviewStatus(message.status);

            // Check if interview is complete
            if (message.status === 'RECOMMENDATION') {
              setTimeout(() => {
                toast.success('Интервью завершено! Переход к результатам...');
                navigate(`/interviews/${interviewId || id}/results`);
              }, 2000);
            }
          }
          break;

        case 'error':
          setIsTyping(false);
          toast.error(message.error || 'Произошла ошибка');
          console.error('WebSocket error:', message.error);
          break;
      }
    },
    [messages.length, navigate, id, interviewId]
  );

  // Handle connection status changes
  const handleConnectionStatus = useCallback(
    (status: 'connected' | 'disconnected' | 'error') => {
      setIsConnected(status === 'connected');

      if (status === 'error') {
        toast.error('Ошибка подключения к серверу');
      } else if (status === 'disconnected') {
        toast.warning('Соединение потеряно. Попытка переподключения...');
      } else if (status === 'connected' && interviewId) {
        toast.success('Соединение восстановлено');
      }
    },
    [interviewId]
  );

  // Initialize WebSocket connection
  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
      return;
    }

    const initConnection = async () => {
      try {
        // Subscribe to events
        wsService.onMessage(handleWSMessage);
        wsService.onConnection(handleConnectionStatus);

        if (!interviewId) {
          if (id && id !== 'new') {
            try {
              if (!wsService.isConnected()) {
                await wsService.connectRaw();
              }
              await wsService.resume(id);
              setInterviewId(id);
              // eslint-disable-next-line unused-imports/no-unused-vars
            } catch (error) {
              wsService.disconnect();
              wsService.clearCurrentInterview();
              await new Promise(resolve => setTimeout(resolve, 100));
              const newInterviewId = await wsService.connect(user);
              setInterviewId(newInterviewId);
              navigate(`/interviews/${newInterviewId}/chat`, { replace: true });
            }
          } else {
            const newInterviewId = await wsService.connect(user);
            setInterviewId(newInterviewId);
            navigate(`/interviews/${newInterviewId}/chat`, { replace: true });
          }
        }
      } catch (error) {
        console.error('Failed to initialize WebSocket connection:', error);
        toast.error('Не удалось подключиться к серверу');
        setIsLoading(false);
      }
    };

    initConnection();

    // Cleanup
    return () => {
      wsService.offMessage(handleWSMessage);
      wsService.offConnection(handleConnectionStatus);
      // Don't disconnect if we're just navigating away - let the service handle it
    };
  }, [user, id, navigate, handleWSMessage, handleConnectionStatus]);

  const handleSendMessage = () => {
    if (!currentInput.trim()) {
      toast.error('Пожалуйста, введите сообщение');
      return;
    }

    if (!isConnected) {
      toast.error('Нет соединения с сервером');
      return;
    }

    // Add user message to chat
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: currentInput,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    // Send message via WebSocket
    try {
      wsService.sendUserMessage(currentInput);
      setCurrentInput('');
      setIsTyping(true);
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Не удалось отправить сообщение');
      setIsTyping(false);
    }
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

  const getStatusBadge = () => {
    const statusMap: Record<string, string> = {
      PREFERENCE_INTERVIEW: 'Сбор информации',
      FORMING_PROBLEMS: 'Подготовка задач',
      HARD_SKILLS_INTERVIEW: 'Техническое интервью',
      SCORING: 'Оценка навыков',
      RECOMMENDATION: 'Формирование рекомендаций',
    };

    return statusMap[interviewStatus] || interviewStatus;
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Подключение к интервью...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/interviews')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />К интервью
            </Button>
            <div>
              <h1 className="text-2xl font-bold">AI Карьерный коуч</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div
                  className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
                />
                <span>{isConnected ? 'Подключено' : 'Нет соединения'}</span>
                {isConnected ? (
                  <Wifi className="w-3 h-3" />
                ) : (
                  <WifiOff className="w-3 h-3" />
                )}
              </div>
            </div>
          </div>
          {interviewStatus && (
            <Badge variant="outline">{getStatusBadge()}</Badge>
          )}
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto bg-background border rounded-lg p-4 space-y-4 mb-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex items-start gap-3 max-w-[80%] ${
                  message.type === 'user' ? 'flex-row-reverse' : ''
                }`}
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

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Bot className="w-4 h-4" />
              <span>AI Коуч печатает</span>
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce"></div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="border rounded-lg p-4 bg-card">
          <div className="flex items-end gap-2">
            <Textarea
              placeholder={
                isConnected ? 'Напишите ваш ответ...' : 'Нет соединения...'
              }
              value={currentInput}
              onChange={e => setCurrentInput(e.target.value)}
              onKeyPress={handleKeyPress}
              rows={2}
              className="resize-none flex-1"
              disabled={!isConnected || isTyping}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!currentInput.trim() || !isConnected || isTyping}
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
