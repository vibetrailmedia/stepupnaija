import { PushNotifications } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export interface NotificationPayload {
  title: string;
  body: string;
  data?: any;
  actionUrl?: string;
}

export class PushNotificationService {
  private isInitialized = false;

  async initialize(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) {
      console.log('Push notifications not available on web platform');
      return false;
    }

    try {
      // Request permission for push notifications
      const permission = await PushNotifications.requestPermissions();
      if (permission.receive === 'granted') {
        await this.setupListeners();
        await PushNotifications.register();
        this.isInitialized = true;
        return true;
      } else {
        console.log('Push notification permission denied');
        return false;
      }
    } catch (error) {
      console.error('Failed to initialize push notifications:', error);
      return false;
    }
  }

  private async setupListeners(): Promise<void> {
    // Called when the app receives a push notification
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push notification received:', notification);
      
      // Show local notification if app is in foreground
      this.showLocalNotification({
        title: notification.title || 'Step Up Naija',
        body: notification.body || 'New notification',
        data: notification.data
      });
    });

    // Called when user taps on a push notification
    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log('Push notification action performed:', notification);
      
      // Handle notification tap - navigate to specific page if needed
      const actionUrl = notification.notification.data?.actionUrl;
      if (actionUrl) {
        // Use your router to navigate
        window.location.href = actionUrl;
      }
    });

    // Called when registration is successful
    PushNotifications.addListener('registration', (token) => {
      console.log('Push registration success, token: ' + token.value);
      this.savePushToken(token.value);
    });

    // Called when registration fails
    PushNotifications.addListener('registrationError', (error) => {
      console.error('Push registration failed:', error);
    });
  }

  private async savePushToken(token: string): Promise<void> {
    try {
      // Save the push token to your backend
      const response = await fetch('/api/push-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token })
      });
      
      if (!response.ok) {
        throw new Error('Failed to save push token');
      }
      
      console.log('Push token saved successfully');
    } catch (error) {
      console.error('Failed to save push token:', error);
    }
  }

  async showLocalNotification(payload: NotificationPayload): Promise<void> {
    try {
      // Request permission for local notifications
      const permission = await LocalNotifications.requestPermissions();
      if (permission.display !== 'granted') {
        console.log('Local notification permission not granted');
        return;
      }

      await LocalNotifications.schedule({
        notifications: [
          {
            title: payload.title,
            body: payload.body,
            id: Date.now(),
            extra: payload.data,
            actionTypeId: 'OPEN_ACTION',
            attachments: undefined,
            schedule: undefined,
          }
        ]
      });
    } catch (error) {
      console.error('Failed to show local notification:', error);
    }
  }

  // Civic engagement specific notifications
  async scheduleEventReminder(eventTitle: string, eventDate: Date): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;

    try {
      const permission = await LocalNotifications.requestPermissions();
      if (permission.display !== 'granted') return;

      const notificationTime = new Date(eventDate.getTime() - 24 * 60 * 60 * 1000); // 24 hours before
      
      await LocalNotifications.schedule({
        notifications: [
          {
            title: '📅 Civic Event Reminder',
            body: `Don't forget: ${eventTitle} is tomorrow!`,
            id: Date.now(),
            schedule: { at: notificationTime },
            extra: { 
              type: 'EVENT_REMINDER',
              eventTitle,
              eventDate: eventDate.toISOString()
            }
          }
        ]
      });
    } catch (error) {
      console.error('Failed to schedule event reminder:', error);
    }
  }

  async scheduleVotingReminder(deadline: Date): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;

    try {
      const permission = await LocalNotifications.requestPermissions();
      if (permission.display !== 'granted') return;

      const reminderTime = new Date(deadline.getTime() - 2 * 60 * 60 * 1000); // 2 hours before
      
      await LocalNotifications.schedule({
        notifications: [
          {
            title: '🗳️ Voting Reminder',
            body: 'Voting closes in 2 hours. Make your voice heard!',
            id: Date.now(),
            schedule: { at: reminderTime },
            extra: { 
              type: 'VOTING_REMINDER',
              deadline: deadline.toISOString()
            }
          }
        ]
      });
    } catch (error) {
      console.error('Failed to schedule voting reminder:', error);
    }
  }

  async notifyEngagementReward(supTokens: number): Promise<void> {
    await this.showLocalNotification({
      title: '🎉 SUP Tokens Earned!',
      body: `You've earned ${supTokens} SUP tokens for your civic engagement!`,
      data: { type: 'REWARD_EARNED', amount: supTokens }
    });
  }

  async notifyNewProject(projectTitle: string): Promise<void> {
    await this.showLocalNotification({
      title: '🏗️ New Community Project',
      body: `Check out the new project: ${projectTitle}`,
      data: { type: 'NEW_PROJECT', projectTitle },
      actionUrl: '/projects'
    });
  }

  isSupported(): boolean {
    return Capacitor.isNativePlatform();
  }

  isInitializedStatus(): boolean {
    return this.isInitialized;
  }
}

// Export singleton instance
export const pushNotificationService = new PushNotificationService();