import { UserPublic } from '@/types/user';

export interface WSMessage {
  type: 'init' | 'resume' | 'user_msg' | 'ready' | 'final' | 'error' | 'close';
  user?: { id: string; name: string };
  interview_id?: string;
  message?: string;
  answer?: string;
  status?: string;
  error?: string;
}

export type MessageHandler = (message: WSMessage) => void;
export type ConnectionHandler = (status: 'connected' | 'disconnected' | 'error') => void;

class InterviewWebSocket {
  private ws: WebSocket | null = null;
  private messageHandlers: Set<MessageHandler> = new Set();
  private connectionHandlers: Set<ConnectionHandler> = new Set();
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private currentInterviewId: string | null = null;
  private isIntentionallyClosed = false;

  constructor(private baseUrl: string = 'ws://localhost:8000') {}

  connectRaw(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.isIntentionallyClosed = false;
      
      try {
        if (this.ws) {
          this.ws.close();
        }

        const wsUrl = `${this.baseUrl}/ws/coach`;
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('WebSocket connected (raw)');
          this.reconnectAttempts = 0;
          this.notifyConnectionHandlers('connected');
          this.attachEventHandlers();
          resolve();
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.notifyConnectionHandlers('error');
          reject(new Error('WebSocket connection failed'));
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket closed:', event.code, event.reason);
          this.ws = null;
          this.notifyConnectionHandlers('disconnected');
        };
      } catch (error) {
        console.error('Failed to create WebSocket connection:', error);
        reject(error);
      }
    });
  }

  connect(user: UserPublic): Promise<string> {
    return new Promise((resolve, reject) => {
      this.isIntentionallyClosed = false;
      
      try {
        // Close existing connection if any
        if (this.ws) {
          this.ws.close();
        }

        const wsUrl = `${this.baseUrl}/ws/coach`;
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.reconnectAttempts = 0;
          this.notifyConnectionHandlers('connected');
          
          // Send init message
          const initMessage: WSMessage = {
            type: 'init',
            user: {
              id: user.id,
              name: user.name
            }
          };
          setTimeout(() => this.send(initMessage), 10);
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WSMessage = JSON.parse(event.data);
            console.log('WebSocket message received:', message);
            
            // Handle ready message specially to resolve the promise
            if (message.type === 'ready' && message.interview_id) {
              this.currentInterviewId = message.interview_id;
              resolve(message.interview_id);
            }
            
            // Notify all handlers
            this.notifyMessageHandlers(message);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.notifyConnectionHandlers('error');
          reject(new Error('WebSocket connection failed'));
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket closed:', event.code, event.reason);
          this.ws = null;
          this.notifyConnectionHandlers('disconnected');
          
          // Attempt reconnection if not intentionally closed
          if (!this.isIntentionallyClosed && this.currentInterviewId) {
            this.attemptReconnect();
          }
        };
      } catch (error) {
        console.error('Failed to create WebSocket connection:', error);
        reject(error);
      }
    });
  }

  resume(interviewId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        reject(new Error('WebSocket is not connected'));
        return;
      }

      this.currentInterviewId = interviewId;
      
      // Set up one-time handler for ready response
      const handleReady = (message: WSMessage) => {
        if (message.type === 'ready') {
          this.offMessage(handleReady);
          resolve();
        } else if (message.type === 'error') {
          this.offMessage(handleReady);
          reject(new Error(message.error || 'Failed to resume interview'));
        }
      };
      
      this.onMessage(handleReady);
      
      const resumeMessage: WSMessage = {
        type: 'resume',
        interview_id: interviewId
      };
      this.send(resumeMessage);
    });
  }

  sendUserMessage(message: string): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected');
    }

    const userMessage: WSMessage = {
      type: 'user_msg',
      message
    };
    this.send(userMessage);
  }

  private send(message: WSMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
      console.log('WebSocket message sent:', message);
    } else {
      console.error('Cannot send message - WebSocket is not open');
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    this.reconnectTimeout = setTimeout(async () => {
      if (this.currentInterviewId) {
        try {
          // Create new WebSocket connection
          const wsUrl = `${this.baseUrl}/ws/coach`;
          this.ws = new WebSocket(wsUrl);
          
          this.ws.onopen = () => {
            console.log('WebSocket reconnected');
            this.reconnectAttempts = 0;
            this.notifyConnectionHandlers('connected');
            
            // Resume the interview
            if (this.currentInterviewId) {
              this.resume(this.currentInterviewId);
            }
          };
          
          // Reattach event handlers
          this.attachEventHandlers();
        } catch (error) {
          console.error('Reconnection failed:', error);
          this.attemptReconnect();
        }
      }
    }, delay);
  }

  private attachEventHandlers(): void {
    if (!this.ws) return;

    this.ws.onmessage = (event) => {
      try {
        const message: WSMessage = JSON.parse(event.data);
        this.notifyMessageHandlers(message);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.notifyConnectionHandlers('error');
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason);
      this.ws = null;
      this.notifyConnectionHandlers('disconnected');
      
      if (!this.isIntentionallyClosed && this.currentInterviewId) {
        this.attemptReconnect();
      }
    };
  }

  onMessage(handler: MessageHandler): void {
    this.messageHandlers.add(handler);
  }

  offMessage(handler: MessageHandler): void {
    this.messageHandlers.delete(handler);
  }

  onConnection(handler: ConnectionHandler): void {
    this.connectionHandlers.add(handler);
  }

  offConnection(handler: ConnectionHandler): void {
    this.connectionHandlers.delete(handler);
  }

  private notifyMessageHandlers(message: WSMessage): void {
    this.messageHandlers.forEach(handler => {
      try {
        handler(message);
      } catch (error) {
        console.error('Message handler error:', error);
      }
    });
  }

  private notifyConnectionHandlers(status: 'connected' | 'disconnected' | 'error'): void {
    this.connectionHandlers.forEach(handler => {
      try {
        handler(status);
      } catch (error) {
        console.error('Connection handler error:', error);
      }
    });
  }

  disconnect(): void {
    this.isIntentionallyClosed = true;
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    if (this.ws) {
      // Send close message before disconnecting
      const closeMessage: WSMessage = {
        type: 'close'
      };
      this.send(closeMessage);
      
      this.ws.close();
      this.ws = null;
    }
    
    this.currentInterviewId = null;
    this.messageHandlers.clear();
    this.connectionHandlers.clear();
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  clearCurrentInterview(): void {
    this.currentInterviewId = null;
  }

  getCurrentInterviewId(): string | null {
    return this.currentInterviewId;
  }
}

// Create singleton instance
const wsService = new InterviewWebSocket(
  import.meta.env.VITE_WS_URL || 'ws://localhost:8000'
);

export default wsService;