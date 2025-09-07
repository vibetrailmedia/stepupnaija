import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from './useAuth';

interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
  userId?: string;
  userName?: string;
}

interface UseWebSocketReturn {
  ws: WebSocket | null;
  isConnected: boolean;
  messages: WebSocketMessage[];
  connectedUsers: Array<{ userId: string; userName: string }>;
  sendMessage: (type: string, data: any) => void;
  clearMessages: () => void;
}

export function useWebSocket(): UseWebSocketReturn {
  const { user, isAuthenticated } = useAuth();
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [connectedUsers, setConnectedUsers] = useState<Array<{ userId: string; userName: string }>>([]);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    if (!isAuthenticated || !user) return;

    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      const newWs = new WebSocket(wsUrl);

      newWs.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        reconnectAttempts.current = 0;

        // Authenticate
        try {
          newWs.send(JSON.stringify({
            type: 'auth',
            data: {
              userId: user.id,
              userName: user.firstName || user.email || 'Anonymous'
            }
          }));
        } catch (error) {
          console.error('Failed to send WebSocket auth message:', error);
        }
      };

      newWs.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          
          if (message.type === 'auth_success') {
            console.log('WebSocket authentication successful');
          } else if (message.type === 'user_joined') {
            setConnectedUsers(prev => {
              const exists = prev.some(u => u.userId === message.data.userId);
              if (!exists) {
                return [...prev, { userId: message.data.userId, userName: message.data.userName }];
              }
              return prev;
            });
          } else if (message.type === 'user_left') {
            setConnectedUsers(prev => prev.filter(u => u.userName !== message.data.userName));
          } else {
            setMessages(prev => [...prev.slice(-99), message]); // Keep last 100 messages
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
          // Silently ignore malformed messages to prevent cascading errors
        }
      };

      newWs.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        setWs(null);

        // Attempt to reconnect
        if (reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current++;
            connect();
          }, delay);
        }
      };

      newWs.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      setWs(newWs);
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }
  }, [isAuthenticated, user]);

  const sendMessage = useCallback((type: string, data: any) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify({ type, data }));
      } catch (error) {
        console.error('Failed to send WebSocket message:', error);
      }
    }
  }, [ws]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      connect();
    }

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (ws) {
        ws.close();
      }
    };
  }, [isAuthenticated, user, connect]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (ws) {
        ws.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [ws]);

  return {
    ws,
    isConnected,
    messages,
    connectedUsers,
    sendMessage,
    clearMessages
  };
}