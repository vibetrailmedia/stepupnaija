import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  // WebSocket connection for real-time notifications
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('Notifications WebSocket connected');
      setIsConnected(true);
      
      // Send authentication if user is logged in
      const authToken = localStorage.getItem('authToken');
      if (authToken) {
        ws.send(JSON.stringify({
          type: 'authenticate',
          token: authToken
        }));
      }
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      console.log('Notifications WebSocket disconnected');
      setIsConnected(false);
      
      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        console.log('Attempting to reconnect...');
      }, 5000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleWebSocketMessage = (data: any) => {
    switch (data.type) {
      case 'notification':
        addNotification(data.notification);
        break;
      case 'notification_read':
        markAsRead(data.notificationId);
        break;
      case 'bulk_notifications':
        setNotifications(data.notifications);
        updateUnreadCount(data.notifications);
        break;
      default:
        console.log('Unknown WebSocket message type:', data.type);
    }
  };

  const addNotification = useCallback((notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Show toast for important notifications
    if (notification.type === 'error' || notification.type === 'warning') {
      toast({
        title: notification.title,
        description: notification.message,
        variant: notification.type === 'error' ? 'destructive' : 'default',
        duration: 5000,
      });
    }

    // Show browser notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/icons/icon-192x192.png',
        tag: notification.id,
        requireInteraction: notification.type === 'error',
      });
    }
  }, [toast]);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));

    // Send read status to server
    fetch('/api/notifications/read', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ notificationId }),
    }).catch(error => {
      console.error('Failed to mark notification as read:', error);
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);

    // Send bulk read status to server
    fetch('/api/notifications/read-all', {
      method: 'POST',
    }).catch(error => {
      console.error('Failed to mark all notifications as read:', error);
    });
  }, []);

  const deleteNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    
    fetch('/api/notifications/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ notificationId }),
    }).catch(error => {
      console.error('Failed to delete notification:', error);
    });
  }, []);

  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }, []);

  const updateUnreadCount = (notifications: Notification[]) => {
    const unread = notifications.filter(notif => !notif.read).length;
    setUnreadCount(unread);
  };

  // Load initial notifications
  useEffect(() => {
    fetch('/api/notifications')
      .then(response => response.json())
      .then(data => {
        setNotifications(data);
        updateUnreadCount(data);
      })
      .catch(error => {
        console.error('Failed to load notifications:', error);
      });
  }, []);

  return {
    notifications,
    unreadCount,
    isConnected,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    requestNotificationPermission,
  };
}

export default useNotifications;