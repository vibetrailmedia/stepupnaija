import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bell,
  X,
  CheckCircle,
  AlertTriangle,
  Info,
  Trophy,
  Users,
  Vote,
  Heart,
  Clock,
  MessageCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  readAt?: string;
  createdAt: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

interface RealTimeNotificationsProps {
  notifications: Notification[];
  onMarkAsRead?: (notificationId: string) => void;
  onMarkAllAsRead?: () => void;
  onNotificationClick?: (notification: Notification) => void;
  className?: string;
  maxDisplay?: number;
}

export function RealTimeNotifications({ 
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onNotificationClick,
  className = "",
  maxDisplay = 5
}: RealTimeNotificationsProps) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [showAll, setShowAll] = useState(false);

  // WebSocket connection for real-time notifications
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('Connected to notification WebSocket');
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'notification') {
          // Handle new notification
          console.log('New notification received:', data.notification);
          // You would typically update your notifications state here
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    ws.onclose = () => {
      console.log('Disconnected from notification WebSocket');
    };
    
    return () => {
      ws.close();
    };
  }, []);

  // Update unread count
  useEffect(() => {
    const unread = notifications.filter(n => !n.readAt).length;
    setUnreadCount(unread);
  }, [notifications]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'TASK_COMPLETED': return CheckCircle;
      case 'PRIZE_WON': return Trophy;
      case 'PROJECT_FUNDED': return Heart;
      case 'KYC_APPROVED': return CheckCircle;
      case 'KYC_REJECTED': return AlertTriangle;
      case 'DRAW_RESULT': return Trophy;
      case 'FORUM_REPLY': return MessageCircle;
      case 'VOTE_REMINDER': return Vote;
      case 'EVENT_REMINDER': return Clock;
      case 'CONNECTION_REQUEST': return Users;
      default: return Info;
    }
  };

  const getNotificationColor = (type: string, priority?: string) => {
    if (priority === 'urgent') return 'text-red-600 bg-red-50 border-red-200';
    if (priority === 'high') return 'text-orange-600 bg-orange-50 border-orange-200';
    
    switch (type) {
      case 'TASK_COMPLETED': return 'text-green-600 bg-green-50 border-green-200';
      case 'PRIZE_WON': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'PROJECT_FUNDED': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'KYC_APPROVED': return 'text-green-600 bg-green-50 border-green-200';
      case 'KYC_REJECTED': return 'text-red-600 bg-red-50 border-red-200';
      case 'DRAW_RESULT': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const handleNotificationClick = (notification: Notification) => {
    if (onMarkAsRead && !notification.readAt) {
      onMarkAsRead(notification.id);
    }
    
    if (onNotificationClick) {
      onNotificationClick(notification);
    } else {
      // Default navigation based on notification type
      switch (notification.type) {
        case 'TASK_COMPLETED':
          window.location.href = '/engage';
          break;
        case 'PRIZE_WON':
        case 'DRAW_RESULT':
          window.location.href = '/dashboard';
          break;
        case 'PROJECT_FUNDED':
          window.location.href = '/projects';
          break;
        case 'KYC_APPROVED':
        case 'KYC_REJECTED':
          window.location.href = '/kyc';
          break;
        case 'FORUM_REPLY':
          window.location.href = '/forums';
          break;
        case 'CONNECTION_REQUEST':
          window.location.href = '/network';
          break;
        default:
          break;
      }
    }
  };

  const handleMarkAsRead = (notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (onMarkAsRead) {
      onMarkAsRead(notificationId);
    }
  };

  const displayNotifications = showAll ? notifications : notifications.slice(0, maxDisplay);

  if (notifications.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <Bell className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="font-semibold text-gray-700 mb-2">No Notifications</h3>
          <p className="text-gray-500 text-sm">
            Your civic activity notifications will appear here. Stay engaged to receive updates!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            Notifications
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white text-xs px-2 py-1">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          {unreadCount > 0 && (
            <Button 
              onClick={onMarkAllAsRead} 
              variant="ghost" 
              size="sm"
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              Mark all read
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {displayNotifications.map((notification) => {
            const IconComponent = getNotificationIcon(notification.type);
            const colorClasses = getNotificationColor(notification.type, notification.priority);
            const isUnread = !notification.readAt;
            
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onClick={() => handleNotificationClick(notification)}
                className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                  isUnread ? 'bg-blue-50 border-blue-200' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-1.5 rounded-lg ${colorClasses}`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`text-sm font-medium ${isUnread ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                      </h3>
                      {isUnread && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                      {notification.priority && notification.priority !== 'low' && (
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            notification.priority === 'urgent' ? 'border-red-300 text-red-600' :
                            notification.priority === 'high' ? 'border-orange-300 text-orange-600' :
                            'border-yellow-300 text-yellow-600'
                          }`}
                        >
                          {notification.priority}
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(notification.createdAt)}
                      </span>
                      
                      {isUnread && (
                        <Button
                          onClick={(e) => handleMarkAsRead(notification.id, e)}
                          variant="ghost"
                          size="sm"
                          className="text-xs text-blue-600 hover:text-blue-700 p-1"
                        >
                          Mark as read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {notifications.length > maxDisplay && (
          <Button 
            variant="ghost" 
            className="w-full mt-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Less' : `View All (${notifications.length - maxDisplay} more)`}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}