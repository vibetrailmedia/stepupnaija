import { storage } from './storage';
import webpush from 'web-push';

// Configure web-push (you'll need to set these environment variables)
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:support@stepupnaija.org',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: any;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

export class ServerPushNotificationService {
  
  /**
   * Send a push notification to a specific user
   */
  async sendNotificationToUser(userId: string, payload: NotificationPayload): Promise<boolean> {
    try {
      // First, save the notification to the database
      await storage.createNotification({
        userId,
        type: payload.data?.type || 'GENERAL',
        channel: 'IN_APP',
        title: payload.title,
        message: payload.body,
        data: payload.data,
        sentAt: new Date()
      });

      // Get user's push subscriptions
      const subscriptions = await storage.getUserPushSubscriptions(userId);
      
      if (subscriptions.length === 0) {
        console.log(`No push subscriptions found for user ${userId}`);
        return false;
      }

      // Send push notification to all user's devices
      const promises = subscriptions.map(async (subscription) => {
        try {
          const pushPayload = {
            notification: {
              title: payload.title,
              body: payload.body,
              icon: payload.icon || '/icon-192x192.png',
              badge: payload.badge || '/badge-72x72.png',
              data: {
                ...payload.data,
                actionUrl: payload.data?.actionUrl || '/'
              }
            }
          };

          await webpush.sendNotification(
            {
              endpoint: subscription.endpoint,
              keys: {
                p256dh: subscription.p256dh,
                auth: subscription.auth
              }
            },
            JSON.stringify(pushPayload)
          );
          
          return true;
        } catch (error: any) {
          console.error(`Failed to send push notification to subscription ${subscription.id}:`, error);
          
          // If subscription is invalid, deactivate it
          if (error?.statusCode === 410) {
            await storage.deletePushSubscription(userId, subscription.endpoint);
          }
          
          return false;
        }
      });

      const results = await Promise.allSettled(promises);
      const successCount = results.filter(r => r.status === 'fulfilled' && r.value).length;
      
      return successCount > 0;
    } catch (error) {
      console.error('Error sending push notification:', error);
      return false;
    }
  }

  /**
   * Send a push notification to multiple users
   */
  async sendNotificationToUsers(userIds: string[], payload: NotificationPayload): Promise<number> {
    const promises = userIds.map(userId => this.sendNotificationToUser(userId, payload));
    const results = await Promise.allSettled(promises);
    return results.filter(r => r.status === 'fulfilled' && r.value).length;
  }

  /**
   * Broadcast a notification to all users with active subscriptions
   */
  async broadcastNotification(payload: NotificationPayload): Promise<number> {
    try {
      const subscriptions = await storage.getAllActivePushSubscriptions();
      
      if (subscriptions.length === 0) {
        console.log('No active push subscriptions found for broadcast');
        return 0;
      }

      // Group subscriptions by user to avoid creating duplicate notifications
      const userSubscriptions = new Map<string, any[]>();
      subscriptions.forEach(sub => {
        if (!userSubscriptions.has(sub.userId)) {
          userSubscriptions.set(sub.userId, []);
        }
        userSubscriptions.get(sub.userId)!.push(sub);
      });

      // Send notifications to each user
      let successCount = 0;
      for (const userId of Array.from(userSubscriptions.keys())) {
        const sent = await this.sendNotificationToUser(userId, payload);
        if (sent) successCount++;
      }

      return successCount;
    } catch (error) {
      console.error('Error broadcasting push notification:', error);
      return 0;
    }
  }

  /**
   * Send notification for civic engagement activities
   */
  async sendEngagementNotification(userId: string, type: 'TASK_COMPLETED' | 'PRIZE_WON' | 'BADGE_EARNED', data: any): Promise<boolean> {
    let payload: NotificationPayload;

    switch (type) {
      case 'TASK_COMPLETED':
        payload = {
          title: '🎉 Task Completed!',
          body: `Great job! You've earned ${data.reward} SUP tokens.`,
          icon: '/icons/task-complete.png',
          data: {
            type,
            actionUrl: '/dashboard',
            ...data
          }
        };
        break;
      
      case 'PRIZE_WON':
        payload = {
          title: '🏆 Congratulations!',
          body: `You won ₦${data.amount?.toLocaleString()} in the weekly draw!`,
          icon: '/icons/prize-won.png',
          data: {
            type,
            actionUrl: '/prizes',
            ...data
          }
        };
        break;
      
      case 'BADGE_EARNED':
        payload = {
          title: '🏅 Badge Earned!',
          body: `You earned the "${data.badgeName}" badge!`,
          icon: '/icons/badge-earned.png',
          data: {
            type,
            actionUrl: '/profile',
            ...data
          }
        };
        break;
      
      default:
        return false;
    }

    return await this.sendNotificationToUser(userId, payload);
  }

  /**
   * Send KYC status notification
   */
  async sendKYCNotification(userId: string, status: 'APPROVED' | 'REJECTED', reason?: string): Promise<boolean> {
    const payload: NotificationPayload = {
      title: status === 'APPROVED' ? '✅ KYC Approved!' : '❌ KYC Rejected',
      body: status === 'APPROVED' 
        ? 'Your identity verification has been approved. You now have access to premium features!'
        : `Your KYC submission was rejected. ${reason || 'Please review and resubmit with correct documents.'}`,
      icon: status === 'APPROVED' ? '/icons/kyc-approved.png' : '/icons/kyc-rejected.png',
      data: {
        type: status === 'APPROVED' ? 'KYC_APPROVED' : 'KYC_REJECTED',
        actionUrl: '/kyc',
        reason
      }
    };

    return await this.sendNotificationToUser(userId, payload);
  }

  /**
   * Send challenge-related notifications
   */
  async sendChallengeNotification(userId: string, type: 'NOMINATION_RECEIVED' | 'ENDORSEMENT_RECEIVED' | 'VOTING_OPEN', data: any): Promise<boolean> {
    let payload: NotificationPayload;

    switch (type) {
      case 'NOMINATION_RECEIVED':
        payload = {
          title: '🗳️ #13k Challenge Nomination',
          body: `You've been nominated for the ${data.position} position in ${data.location}!`,
          icon: '/icons/nomination.png',
          data: {
            type,
            actionUrl: '/challenge',
            ...data
          }
        };
        break;
      
      case 'ENDORSEMENT_RECEIVED':
        payload = {
          title: '👍 New Endorsement!',
          body: `Someone endorsed your candidacy for ${data.position}!`,
          icon: '/icons/endorsement.png',
          data: {
            type,
            actionUrl: '/challenge/profile',
            ...data
          }
        };
        break;
      
      case 'VOTING_OPEN':
        payload = {
          title: '🗳️ Voting is Now Open!',
          body: `Cast your vote for ${data.position} in ${data.location}`,
          icon: '/icons/voting-open.png',
          data: {
            type,
            actionUrl: '/voting',
            ...data
          }
        };
        break;
      
      default:
        return false;
    }

    return await this.sendNotificationToUser(userId, payload);
  }

  /**
   * Send project-related notifications
   */
  async sendProjectNotification(userId: string, type: 'PROJECT_FUNDED' | 'PROJECT_UPDATE' | 'VOTING_REMINDER', data: any): Promise<boolean> {
    let payload: NotificationPayload;

    switch (type) {
      case 'PROJECT_FUNDED':
        payload = {
          title: '🚀 Project Funded!',
          body: `"${data.projectName}" has been successfully funded!`,
          icon: '/icons/project-funded.png',
          data: {
            type,
            actionUrl: `/projects/${data.projectId}`,
            ...data
          }
        };
        break;
      
      case 'PROJECT_UPDATE':
        payload = {
          title: '📈 Project Update',
          body: `New update from "${data.projectName}": ${data.updateTitle}`,
          icon: '/icons/project-update.png',
          data: {
            type,
            actionUrl: `/projects/${data.projectId}`,
            ...data
          }
        };
        break;
      
      case 'VOTING_REMINDER':
        payload = {
          title: '⏰ Voting Reminder',
          body: `Don't forget to vote on community projects! Voting closes soon.`,
          icon: '/icons/voting-reminder.png',
          data: {
            type,
            actionUrl: '/projects',
            ...data
          }
        };
        break;
      
      default:
        return false;
    }

    return await this.sendNotificationToUser(userId, payload);
  }

  /**
   * Get notification statistics
   */
  async getNotificationStats(): Promise<{
    totalNotifications: number;
    activeSubscriptions: number;
    deliveredToday: number;
  }> {
    try {
      const [subscriptions] = await Promise.all([
        storage.getAllActivePushSubscriptions()
      ]);

      // For now, return basic stats. In production, you'd want to track delivery rates
      return {
        totalNotifications: 0, // Would need a count from notifications table
        activeSubscriptions: subscriptions.length,
        deliveredToday: 0 // Would need to track this
      };
    } catch (error) {
      console.error('Error getting notification stats:', error);
      return {
        totalNotifications: 0,
        activeSubscriptions: 0,
        deliveredToday: 0
      };
    }
  }
}

// Export singleton instance
export const pushNotificationService = new ServerPushNotificationService();