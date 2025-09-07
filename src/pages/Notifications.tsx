import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Bell, Settings, Check, Trash2, Filter, Eye, BellRing, Smartphone } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { pushNotificationService } from '@/services/pushNotifications';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  readAt: string | null;
  createdAt: string;
  data?: any;
}

export default function Notifications() {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushSupported, setPushSupported] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if push notifications are supported
  useEffect(() => {
    const checkPushSupport = async () => {
      const supported = await pushNotificationService.isSupported();
      setPushSupported(supported);
      
      if (supported) {
        const initialized = pushNotificationService.isInitializedStatus();
        setPushEnabled(initialized);
      }
    };
    
    checkPushSupport();
  }, []);

  // Fetch notifications
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['/api/notifications'],
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  // Fetch unread count
  const { data: unreadData } = useQuery({
    queryKey: ['/api/notifications/unread-count'],
    refetchInterval: 10000 // Check more frequently
  });

  const unreadCount = (unreadData as any)?.count || 0;

  // Mark notification as read
  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: string) =>
      apiRequest(`/api/notifications/${notificationId}/read`, 'POST'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      queryClient.invalidateQueries({ queryKey: ['/api/notifications/unread-count'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to mark notification as read',
        variant: 'destructive'
      });
    }
  });

  // Mark all as read
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const unreadNotifications = (notifications as Notification[]).filter((n: Notification) => !n.readAt);
      await Promise.all(
        unreadNotifications.map((n: Notification) => 
          apiRequest(`/api/notifications/${n.id}/read`, 'POST')
        )
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      queryClient.invalidateQueries({ queryKey: ['/api/notifications/unread-count'] });
      toast({
        title: 'Success',
        description: 'All notifications marked as read'
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to mark notifications as read',
        variant: 'destructive'
      });
    }
  });

  // Enable/disable push notifications
  const togglePushNotifications = async (enabled: boolean) => {
    if (enabled) {
      try {
        const success = await pushNotificationService.initialize();
        if (success) {
          setPushEnabled(true);
          toast({
            title: 'Push Notifications Enabled',
            description: 'You will now receive push notifications for important updates'
          });
        } else {
          toast({
            title: 'Permission Denied',
            description: 'Please allow notifications in your browser settings',
            variant: 'destructive'
          });
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to enable push notifications',
          variant: 'destructive'
        });
      }
    } else {
      setPushEnabled(false);
      toast({
        title: 'Push Notifications Disabled',
        description: 'You will no longer receive push notifications'
      });
    }
  };

  // Filter notifications
  const filteredNotifications = (notifications as Notification[]).filter((notification: Notification) => 
    filter === 'all' || (filter === 'unread' && !notification.readAt)
  );

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'TASK_COMPLETED':
        return '🎉';
      case 'PRIZE_WON':
        return '🏆';
      case 'PROJECT_FUNDED':
        return '🚀';
      case 'KYC_APPROVED':
        return '✅';
      case 'KYC_REJECTED':
        return '❌';
      case 'BADGE_EARNED':
        return '🏅';
      default:
        return '📢';
    }
  };

  // Get notification color based on type
  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'TASK_COMPLETED':
      case 'KYC_APPROVED':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'PRIZE_WON':
      case 'BADGE_EARNED':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'PROJECT_FUNDED':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'KYC_REJECTED':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600">
                {unreadCount > 0 ? `${unreadCount} unread notifications` : 'You are all caught up!'}
              </p>
            </div>
          </div>
          
          {unreadCount > 0 && (
            <Button
              onClick={() => markAllAsReadMutation.mutate()}
              disabled={markAllAsReadMutation.isPending}
              variant="outline"
              className="flex items-center space-x-2"
              data-testid="button-mark-all-read"
            >
              <Check className="w-4 h-4" />
              <span>Mark All Read</span>
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Notifications */}
          <div className="lg:col-span-3 space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <BellRing className="w-5 h-5" />
                    <span>Recent Notifications</span>
                  </CardTitle>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={filter === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilter('all')}
                      data-testid="button-filter-all"
                    >
                      All
                    </Button>
                    <Button
                      variant={filter === 'unread' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilter('unread')}
                      data-testid="button-filter-unread"
                    >
                      Unread ({unreadCount})
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <ScrollArea className="h-96 pr-4">
                  {isLoading ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse flex space-x-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : filteredNotifications.length === 0 ? (
                    <div className="text-center py-12">
                      <Bell className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                      </h3>
                      <p className="text-gray-500">
                        {filter === 'unread' 
                          ? 'You are all caught up! Check back later for updates.'
                          : 'We will notify you when there is something new.'
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredNotifications.map((notification: Notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                            notification.readAt 
                              ? 'bg-white border-gray-100' 
                              : 'bg-blue-50/50 border-blue-200 shadow-sm'
                          }`}
                          onClick={() => !notification.readAt && markAsReadMutation.mutate(notification.id)}
                          data-testid={`notification-item-${notification.id}`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center text-lg flex-shrink-0">
                              {getNotificationIcon(notification.type)}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className={`font-semibold truncate ${
                                  notification.readAt ? 'text-gray-700' : 'text-gray-900'
                                }`}>
                                  {notification.title}
                                </h3>
                                
                                <div className="flex items-center space-x-2">
                                  <Badge 
                                    variant="secondary" 
                                    className={`text-xs ${getNotificationColor(notification.type)}`}
                                  >
                                    {notification.type.replace('_', ' ').toLowerCase()}
                                  </Badge>
                                  
                                  {!notification.readAt && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  )}
                                </div>
                              </div>
                              
                              <p className={`text-sm mb-2 ${
                                notification.readAt ? 'text-gray-500' : 'text-gray-700'
                              }`}>
                                {notification.message}
                              </p>
                              
                              <div className="flex items-center justify-between text-xs text-gray-400">
                                <span>{formatRelativeTime(notification.createdAt)}</span>
                                
                                {!notification.readAt && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2 text-xs"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      markAsReadMutation.mutate(notification.id);
                                    }}
                                    data-testid={`button-mark-read-${notification.id}`}
                                  >
                                    <Eye className="w-3 h-3 mr-1" />
                                    Mark read
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Notification Settings */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </CardTitle>
                <CardDescription>
                  Manage your notification preferences
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Push Notifications */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="w-4 h-4" />
                      <span className="font-medium">Push Notifications</span>
                    </div>
                    
                    <Switch
                      checked={pushEnabled}
                      onCheckedChange={togglePushNotifications}
                      disabled={!pushSupported}
                      data-testid="switch-push-notifications"
                    />
                  </div>
                  
                  <p className="text-sm text-gray-500">
                    {!pushSupported 
                      ? 'Not supported on this device/browser'
                      : pushEnabled 
                        ? 'Receive instant notifications' 
                        : 'Enable to get real-time alerts'
                    }
                  </p>
                </div>

                <Separator />

                {/* Statistics */}
                <div>
                  <h4 className="font-medium mb-3">Notification Stats</h4>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total notifications</span>
                      <span className="font-medium">{(notifications as Notification[]).length}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Unread</span>
                      <span className="font-medium text-blue-600">{unreadCount}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Read today</span>
                      <span className="font-medium text-green-600">
                        {(notifications as Notification[]).filter((n: Notification) => 
                          n.readAt && 
                          new Date(n.readAt).toDateString() === new Date().toDateString()
                        ).length}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  asChild
                  data-testid="button-notification-settings"
                >
                  <a href="/settings">
                    <Settings className="w-4 h-4 mr-2" />
                    Notification Settings
                  </a>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  asChild
                  data-testid="button-privacy-settings"
                >
                  <a href="/privacy">
                    <Eye className="w-4 h-4 mr-2" />
                    Privacy Settings
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}