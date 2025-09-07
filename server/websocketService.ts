import { WebSocketServer, WebSocket } from 'ws';
import type { Server } from 'http';
import type { User } from '@shared/schema';

interface ClientInfo {
  ws: WebSocket;
  userId: string;
  userName: string;
}

interface MessageData {
  type: 'message' | 'notification' | 'user_joined' | 'user_left' | 'typing' | 'badge_earned' | 'milestone_achieved';
  data: any;
  timestamp: number;
  userId?: string;
  userName?: string;
}

export class WebSocketService {
  private clients = new Map<string, ClientInfo>();
  private wss: WebSocketServer | null = null;

  initialize(server: Server) {
    this.wss = new WebSocketServer({ 
      server,
      path: '/ws'
    });

    this.wss.on('connection', (ws: WebSocket, request) => {
      console.log('New WebSocket connection established');

      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleMessage(ws, message);
        } catch (error) {
          console.error('WebSocket message parsing error:', error);
        }
      });

      ws.on('close', () => {
        // Find and remove the client
        for (const [userId, client] of Array.from(this.clients.entries())) {
          if (client.ws === ws) {
            this.clients.delete(userId);
            this.broadcastUserLeft(client.userName);
            console.log(`User ${client.userName} disconnected`);
            break;
          }
        }
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });

    console.log('WebSocket server initialized on /ws path');
  }

  private handleMessage(ws: WebSocket, message: any) {
    switch (message.type) {
      case 'auth':
        this.handleAuth(ws, message.data);
        break;
      case 'message':
        this.handleChatMessage(ws, message.data);
        break;
      case 'typing':
        this.handleTyping(ws, message.data);
        break;
      case 'ping':
        this.sendToClient(ws, { type: 'pong', timestamp: Date.now() });
        break;
      default:
        console.log('Unknown message type:', message.type);
    }
  }

  private handleAuth(ws: WebSocket, data: { userId: string; userName: string }) {
    if (!data.userId || !data.userName) {
      this.sendToClient(ws, { 
        type: 'error', 
        data: { message: 'Invalid authentication data' } 
      });
      return;
    }

    // Store client info
    this.clients.set(data.userId, {
      ws,
      userId: data.userId,
      userName: data.userName
    });

    // Send auth success
    this.sendToClient(ws, { 
      type: 'auth_success', 
      data: { message: 'Authentication successful' } 
    });

    // Notify others that user joined
    this.broadcastUserJoined(data.userName, data.userId);

    console.log(`User ${data.userName} (${data.userId}) connected`);
  }

  private handleChatMessage(ws: WebSocket, data: { content: string; channelId?: string }) {
    const client = this.findClientByWs(ws);
    if (!client) {
      this.sendToClient(ws, { 
        type: 'error', 
        data: { message: 'Not authenticated' } 
      });
      return;
    }

    const messageData: MessageData = {
      type: 'message',
      data: {
        content: data.content,
        channelId: data.channelId || 'general',
        author: {
          id: client.userId,
          name: client.userName
        }
      },
      timestamp: Date.now(),
      userId: client.userId,
      userName: client.userName
    };

    // Broadcast message to all connected clients
    this.broadcast(messageData, client.userId);
  }

  private handleTyping(ws: WebSocket, data: { isTyping: boolean; channelId?: string }) {
    const client = this.findClientByWs(ws);
    if (!client) return;

    const typingData: MessageData = {
      type: 'typing',
      data: {
        isTyping: data.isTyping,
        channelId: data.channelId || 'general'
      },
      timestamp: Date.now(),
      userId: client.userId,
      userName: client.userName
    };

    // Broadcast typing status to others (not the sender)
    this.broadcast(typingData, client.userId);
  }

  private findClientByWs(ws: WebSocket): ClientInfo | null {
    for (const client of Array.from(this.clients.values())) {
      if (client.ws === ws) {
        return client;
      }
    }
    return null;
  }

  private sendToClient(ws: WebSocket, message: any) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  private broadcast(message: MessageData, excludeUserId?: string) {
    for (const [userId, client] of Array.from(this.clients.entries())) {
      if (excludeUserId && userId === excludeUserId) continue;
      
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify(message));
      }
    }
  }

  private broadcastUserJoined(userName: string, userId: string) {
    const message: MessageData = {
      type: 'user_joined',
      data: { userName, userId },
      timestamp: Date.now()
    };
    this.broadcast(message, userId);
  }

  private broadcastUserLeft(userName: string) {
    const message: MessageData = {
      type: 'user_left',
      data: { userName },
      timestamp: Date.now()
    };
    this.broadcast(message);
  }

  // Public methods for sending notifications
  public sendNotificationToUser(userId: string, notification: any) {
    const client = this.clients.get(userId);
    if (client && client.ws.readyState === WebSocket.OPEN) {
      const message: MessageData = {
        type: 'notification',
        data: notification,
        timestamp: Date.now()
      };
      this.sendToClient(client.ws, message);
    }
  }

  public broadcastNotification(notification: any, excludeUserId?: string) {
    const message: MessageData = {
      type: 'notification',
      data: notification,
      timestamp: Date.now()
    };
    this.broadcast(message, excludeUserId);
  }

  public sendBadgeEarnedNotification(userId: string, badgeInfo: any) {
    const client = this.clients.get(userId);
    if (client && client.ws.readyState === WebSocket.OPEN) {
      const message: MessageData = {
        type: 'badge_earned',
        data: badgeInfo,
        timestamp: Date.now()
      };
      this.sendToClient(client.ws, message);
    }
  }

  public sendMilestoneNotification(userId: string, milestoneInfo: any) {
    const client = this.clients.get(userId);
    if (client && client.ws.readyState === WebSocket.OPEN) {
      const message: MessageData = {
        type: 'milestone_achieved',
        data: milestoneInfo,
        timestamp: Date.now()
      };
      this.sendToClient(client.ws, message);
    }
  }

  public getConnectedUsers(): Array<{ userId: string; userName: string }> {
    return Array.from(this.clients.values()).map(client => ({
      userId: client.userId,
      userName: client.userName
    }));
  }

  public getConnectedUserCount(): number {
    return this.clients.size;
  }

  public isUserConnected(userId: string): boolean {
    return this.clients.has(userId);
  }
}

export const webSocketService = new WebSocketService();