import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from 'sonner';
import apiService from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

interface WebSocketMessage {
  type: 'violation' | 'device_status' | 'subscription_update' | 'sponsor_notification' | 'progress_update';
  data: any;
  timestamp: string;
}

interface WebSocketContextType {
  isConnected: boolean;
  lastMessage: WebSocketMessage | null;
  sendMessage: (message: WebSocketMessage) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const handleMessage = (message: WebSocketMessage) => {
      setLastMessage(message);
      
      switch (message.type) {
        case 'violation':
          toast.error('Violation detected! Your spiritual sponsor has been notified.', {
            duration: 5000,
          });
          break;
          
        case 'device_status':
          if (message.data.status === 'offline') {
            toast.warning('Device protection is offline. Please check your connection.', {
              duration: 4000,
            });
          } else if (message.data.status === 'online') {
            toast.success('Device protection is now active', {
              duration: 3000,
            });
          }
          break;
          
        case 'subscription_update':
          if (message.data.status === 'expired') {
            toast.error('Your subscription has expired. Please renew to continue protection.', {
              duration: 6000,
            });
          } else if (message.data.status === 'renewed') {
            toast.success('Subscription renewed successfully!', {
              duration: 3000,
            });
          }
          break;
          
        case 'sponsor_notification':
          toast.info('Your spiritual sponsor has sent you a message', {
            duration: 4000,
          });
          break;
          
        case 'progress_update':
          toast.success('Progress milestone achieved!', {
            duration: 3000,
          });
          break;
          
        default:
          console.log('Unknown WebSocket message type:', message.type);
      }
    };

    const handleError = (error: Event) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
      toast.error('Connection lost. Attempting to reconnect...', {
        duration: 3000,
      });
    };

    // Connect to WebSocket
    apiService.connectWebSocket(handleMessage, handleError);
    setIsConnected(true);

    return () => {
      apiService.disconnectWebSocket();
      setIsConnected(false);
    };
  }, [isAuthenticated]);

  const sendMessage = (message: WebSocketMessage) => {
    // This would be implemented if we need to send messages to the server
    console.log('Sending WebSocket message:', message);
  };

  const value: WebSocketContextType = {
    isConnected,
    lastMessage,
    sendMessage,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}; 