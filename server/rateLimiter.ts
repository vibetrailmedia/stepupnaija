import { Request, Response, NextFunction } from 'express';

// In-memory rate limiting store (in production, use Redis)
interface RateLimit {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private store: Map<string, RateLimit> = new Map();
  private cleanup: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every minute
    this.cleanup = setInterval(() => {
      const now = Date.now();
      for (const [key, limit] of this.store.entries()) {
        if (now > limit.resetTime) {
          this.store.delete(key);
        }
      }
    }, 60000);
  }

  limit(maxRequests: number, windowMs: number, keyGenerator?: (req: Request) => string) {
    return (req: Request, res: Response, next: NextFunction) => {
      const key = keyGenerator ? keyGenerator(req) : req.ip;
      const now = Date.now();
      const windowStart = now - windowMs;

      let limit = this.store.get(key);
      
      if (!limit || now > limit.resetTime) {
        // Create new window
        limit = {
          count: 1,
          resetTime: now + windowMs
        };
        this.store.set(key, limit);
        return next();
      }

      if (limit.count >= maxRequests) {
        // Rate limit exceeded
        const timeRemaining = Math.ceil((limit.resetTime - now) / 1000);
        
        res.status(429).json({
          message: 'Rate limit exceeded',
          retryAfter: timeRemaining,
          limit: maxRequests,
          remaining: 0
        });
        
        // Log security alert for excessive requests
        this.logSecurityAlert(key, maxRequests, windowMs);
        return;
      }

      // Increment counter
      limit.count++;
      this.store.set(key, limit);
      
      // Add rate limit headers
      res.set({
        'X-RateLimit-Limit': maxRequests.toString(),
        'X-RateLimit-Remaining': (maxRequests - limit.count).toString(),
        'X-RateLimit-Reset': Math.ceil(limit.resetTime / 1000).toString()
      });

      next();
    };
  }

  private async logSecurityAlert(identifier: string, maxRequests: number, windowMs: number) {
    try {
      // Import storage dynamically to avoid circular dependencies
      const { storage } = await import('./storage');
      
      await storage.createAuditLog({
        userId: 'SYSTEM',
        action: 'RATE_LIMIT_EXCEEDED',
        details: `Rate limit exceeded for ${identifier}: ${maxRequests} requests in ${windowMs}ms`,
        metadata: { identifier, maxRequests, windowMs }
      });

      // Create security alert for excessive rate limiting
      const { db } = await import('./db');
      const { securityAlerts } = await import('@shared/schema');
      
      await db.insert(securityAlerts).values({
        type: 'RATE_LIMIT_HIT',
        severity: 'medium',
        message: `Excessive requests detected from ${identifier}`,
        metadata: JSON.stringify({ identifier, maxRequests, windowMs, timestamp: new Date() })
      });
    } catch (error) {
      console.error('Failed to log security alert:', error);
    }
  }

  destroy() {
    if (this.cleanup) {
      clearInterval(this.cleanup);
    }
  }
}

// Create rate limiter instance
export const rateLimiter = new RateLimiter();

// Preset rate limiting middlewares
export const rateLimits = {
  // General API calls - 100 requests per minute
  general: rateLimiter.limit(100, 60 * 1000),
  
  // Draw entries - 5 entries per minute per user
  drawEntry: rateLimiter.limit(5, 60 * 1000, (req: Request) => {
    const userId = (req as any).user?.claims?.sub || req.ip;
    return `draw_entry:${userId}`;
  }),
  
  // Financial transactions - 10 per hour per user
  financial: rateLimiter.limit(10, 60 * 60 * 1000, (req: Request) => {
    const userId = (req as any).user?.claims?.sub || req.ip;
    return `financial:${userId}`;
  }),
  
  // Voting - 20 votes per hour per user
  voting: rateLimiter.limit(20, 60 * 60 * 1000, (req: Request) => {
    const userId = (req as any).user?.claims?.sub || req.ip;
    return `voting:${userId}`;
  }),
  
  // Authentication - More permissive in development
  auth: rateLimiter.limit(process.env.NODE_ENV === 'development' ? 50 : 5, 15 * 60 * 1000),
  
  // Admin operations - 50 per hour
  admin: rateLimiter.limit(50, 60 * 60 * 1000, (req: Request) => {
    const userId = (req as any).user?.claims?.sub || req.ip;
    return `admin:${userId}`;
  }),
  
  // Profile updates - 5 per hour
  profile: rateLimiter.limit(5, 60 * 60 * 1000, (req: Request) => {
    const userId = (req as any).user?.claims?.sub || req.ip;
    return `profile:${userId}`;
  })
};

export default rateLimiter;