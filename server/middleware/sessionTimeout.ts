import type { RequestHandler } from 'express';
import { storage } from '../storage';

export interface SessionTimeoutConfig {
  adminTimeout: number; // in minutes
  userTimeout: number; // in minutes
  warningThreshold: number; // in minutes before timeout
}

const DEFAULT_CONFIG: SessionTimeoutConfig = {
  adminTimeout: 30, // 30 minutes for admin sessions
  userTimeout: 120, // 2 hours for regular users
  warningThreshold: 5, // warn 5 minutes before timeout
};

export class SessionTimeoutManager {
  private config: SessionTimeoutConfig;

  constructor(config: SessionTimeoutConfig = DEFAULT_CONFIG) {
    this.config = config;
  }

  // Middleware to check session timeout
  checkTimeout(requireAdmin = false): RequestHandler {
    return async (req, res, next) => {
      if (!req.isAuthenticated() || !req.user) {
        return next();
      }

      const user = req.user as any;
      const userId = user.claims?.sub || user.id;
      const isAdmin = user.role === 'admin' || user.isAdmin;
      
      try {
        const session = await storage.getActiveSession(userId);
        
        if (!session) {
          // Create new session
          await storage.createActiveSession({
            userId,
            lastActivity: new Date(),
            isAdmin,
            ipAddress: req.ip || '',
            userAgent: req.headers['user-agent'] || ''
          });
          return next();
        }

        const timeoutMinutes = isAdmin ? this.config.adminTimeout : this.config.userTimeout;
        const lastActivity = new Date(session.lastActivity);
        const now = new Date();
        const minutesSinceLastActivity = (now.getTime() - lastActivity.getTime()) / (1000 * 60);

        // Check if session has timed out
        if (minutesSinceLastActivity > timeoutMinutes) {
          await storage.deactivateSession(userId);
          
          // Log timeout event
          await storage.createAuditLog({
            userId,
            action: 'SESSION_TIMEOUT',
            details: `Session timed out after ${Math.floor(minutesSinceLastActivity)} minutes of inactivity`,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            metadata: { timeoutMinutes, isAdmin }
          });

          // Destroy the session
          req.logout(() => {
            return res.status(401).json({ 
              error: 'Session expired', 
              code: 'SESSION_TIMEOUT',
              timeoutMinutes: Math.floor(minutesSinceLastActivity)
            });
          });
          return;
        }

        // Check if warning should be sent
        const minutesUntilTimeout = timeoutMinutes - minutesSinceLastActivity;
        if (minutesUntilTimeout <= this.config.warningThreshold && !session.warningShown) {
          // Mark warning as shown
          await storage.updateSessionWarning(userId, true);
          
          // Add warning to response headers
          res.set('X-Session-Warning', 'true');
          res.set('X-Session-Timeout', Math.ceil(minutesUntilTimeout).toString());
        }

        // Update last activity
        await storage.updateSessionActivity(userId);
        
        next();
      } catch (error) {
        console.error('Session timeout check error:', error);
        next();
      }
    };
  }

  // Extend session timeout for critical operations
  async extendSession(userId: string, extensionMinutes = 15): Promise<void> {
    try {
      await storage.updateSessionActivity(userId, extensionMinutes * 60 * 1000);
      
      await storage.createAuditLog({
        userId,
        action: 'SESSION_EXTENDED',
        details: `Session extended by ${extensionMinutes} minutes for critical operation`,
        metadata: { extensionMinutes }
      });
    } catch (error) {
      console.error('Error extending session:', error);
    }
  }

  // Force logout all sessions for a user
  async forceLogout(userId: string, reason = 'Security measure'): Promise<void> {
    try {
      await storage.deactivateSession(userId);
      
      await storage.createAuditLog({
        userId,
        action: 'FORCED_LOGOUT',
        details: `All sessions terminated: ${reason}`,
        metadata: { reason }
      });
    } catch (error) {
      console.error('Error forcing logout:', error);
    }
  }

  // Get session info
  async getSessionInfo(userId: string): Promise<{
    isActive: boolean;
    lastActivity: Date | null;
    timeoutMinutes: number;
    minutesUntilTimeout: number | null;
    warningThreshold: number;
    shouldWarn: boolean;
  }> {
    try {
      const session = await storage.getActiveSession(userId);
      const user = await storage.getUser(userId);
      const isAdmin = user?.role === 'admin';
      
      if (!session) {
        return {
          isActive: false,
          lastActivity: null,
          timeoutMinutes: isAdmin ? this.config.adminTimeout : this.config.userTimeout,
          minutesUntilTimeout: null,
          warningThreshold: this.config.warningThreshold,
          shouldWarn: false
        };
      }

      const timeoutMinutes = isAdmin ? this.config.adminTimeout : this.config.userTimeout;
      const lastActivity = new Date(session.lastActivity);
      const now = new Date();
      const minutesSinceLastActivity = (now.getTime() - lastActivity.getTime()) / (1000 * 60);
      const minutesUntilTimeout = timeoutMinutes - minutesSinceLastActivity;
      
      return {
        isActive: true,
        lastActivity,
        timeoutMinutes,
        minutesUntilTimeout: minutesUntilTimeout > 0 ? minutesUntilTimeout : 0,
        warningThreshold: this.config.warningThreshold,
        shouldWarn: minutesUntilTimeout <= this.config.warningThreshold && !session.warningShown
      };
    } catch (error) {
      console.error('Error getting session info:', error);
      throw error;
    }
  }
}

export const sessionTimeout = new SessionTimeoutManager();