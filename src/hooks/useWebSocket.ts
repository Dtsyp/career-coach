{
  /* eslint-disable import/no-unused-modules */
}
import { useEffect, useRef, useState } from 'react';

export interface ChatMessage {
  type: 'user_message' | 'ai_message';
  text: string;
  status?: 'typing' | 'complete';
  timestamp?: string;
}

interface UseWebSocketProps {
  interviewId: string;
  enabled?: boolean;
}

const WS_BASE_URL =
  import.meta.env.VITE_WS_BASE_URL?.replace('http', 'ws') ||
  'ws://localhost:8000/v1';

export const useWebSocket = ({
  interviewId,
  enabled = true,
}: UseWebSocketProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const connect = () => {
    if (!enabled || wsRef.current?.readyState === WebSocket.OPEN) return;

    const token = localStorage.getItem('access_token');
    if (!token) return;

    setIsConnecting(true);
    const wsUrl = `${WS_BASE_URL}/interviews/${interviewId}/chat?token=${token}`;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setIsConnecting(false);
      };

      ws.onmessage = event => {
        try {
          const data = JSON.parse(event.data);
          setMessages(prev => [...prev, data]);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        setIsConnecting(false);
      };

      ws.onerror = error => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
        setIsConnecting(false);
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setIsConnecting(false);
    }
  };

  const sendMessage = (text: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const message: ChatMessage = {
        type: 'user_message',
        text,
        timestamp: new Date().toISOString(),
      };

      wsRef.current.send(JSON.stringify(message));
      setMessages(prev => [...prev, message]);
    }
  };

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
  };

  useEffect(() => {
    if (enabled && interviewId) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [interviewId, enabled]);

  return {
    messages,
    isConnected,
    isConnecting,
    sendMessage,
    connect,
    disconnect,
  };
};
