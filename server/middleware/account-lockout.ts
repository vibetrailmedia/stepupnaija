import { Request, Response, NextFunction } from 'express';

interface LockoutInfo {
  failedAttempts: number;
  lockedUntil?: number;
  lastFailedAttempt: number;
}

// In-memory store for lockout tracking (in production, use Redis or database)
const lockoutStore = new Map<string, LockoutInfo>();

// Lockout configuration
const LOCKOUT_CONFIG = {
  // Progressive lockout thresholds
  maxFailedAttempts: [3, 5, 10], // Attempts before each lockout level
  lockoutDurations: [5, 15, 60], // Minutes for each lockout level (5m, 15m, 1h)
  
  // Reset failed attempts after successful login or this many minutes
  resetAfterMinutes: 30,
  
  // Maximum lockout duration (24 hours)
  maxLockoutHours: 24,
  
  // Cleanup old entries after this many hours
  cleanupAfterHours: 48
};

// Get lockout key for user identification
const getLockoutKey = (email: string, ip: string): string => {
  // Combine email and IP for more granular control
  return `${email.toLowerCase()}:${ip}`;
};

// Determine lockout level based on failed attempts
const getLockoutLevel = (failedAttempts: number): number => {
  for (let i = LOCKOUT_CONFIG.maxFailedAttempts.length - 1; i >= 0; i--) {
    if (failedAttempts >= LOCKOUT_CONFIG.maxFailedAttempts[i]) {
      return i;
    }
  }
  return -1; // No lockout
};

// Calculate lockout duration
const calculateLockoutDuration = (failedAttempts: number): number => {
  const level = getLockoutLevel(failedAttempts);
  if (level === -1) return 0;
  
  return LOCKOUT_CONFIG.lockoutDurations[level] * 60 * 1000; // Convert to milliseconds
};

// Clean up expired entries
const cleanupExpiredEntries = (): void => {
  const now = Date.now();
  const cleanupThreshold = LOCKOUT_CONFIG.cleanupAfterHours * 60 * 60 * 1000;
  
  for (const [key, info] of lockoutStore.entries()) {
    if (now - info.lastFailedAttempt > cleanupThreshold) {
      lockoutStore.delete(key);
    }
  }
};

// Run cleanup every hour
setInterval(cleanupExpiredEntries, 60 * 60 * 1000);

// Check if account is currently locked
export const isAccountLocked = (email: string, ip: string): {
  locked: boolean;
  remainingLockoutMs?: number;
  failedAttempts: number;
} => {
  const key = getLockoutKey(email, ip);
  const info = lockoutStore.get(key);
  
  if (!info) {
    return { locked: false, failedAttempts: 0 };
  }
  
  const now = Date.now();
  
  // Check if lockout has expired
  if (info.lockedUntil && now >= info.lockedUntil) {
    // Reset failed attempts after lockout expires
    lockoutStore.delete(key);
    return { locked: false, failedAttempts: 0 };
  }
  
  // Check if we should reset due to time passage
  const resetThreshold = LOCKOUT_CONFIG.resetAfterMinutes * 60 * 1000;
  if (now - info.lastFailedAttempt > resetThreshold && !info.lockedUntil) {
    lockoutStore.delete(key);
    return { locked: false, failedAttempts: 0 };
  }
  
  const isLocked = info.lockedUntil ? now < info.lockedUntil : false;
  const remainingLockoutMs = info.lockedUntil ? Math.max(0, info.lockedUntil - now) : undefined;
  
  return {
    locked: isLocked,
    remainingLockoutMs,
    failedAttempts: info.failedAttempts
  };
};

// Record failed login attempt
export const recordFailedAttempt = async (email: string, ip: string): Promise<{
  failedAttempts: number;
  lockoutInfo?: {
    locked: boolean;
    lockoutDurationMs: number;
    nextAttemptAllowedAt: number;
  };
}> => {
  const key = getLockoutKey(email, ip);
  const now = Date.now();
  
  const existingInfo = lockoutStore.get(key);
  const newFailedAttempts = (existingInfo?.failedAttempts || 0) + 1;
  
  // Calculate if this triggers a lockout
  const lockoutDurationMs = calculateLockoutDuration(newFailedAttempts);
  const lockedUntil = lockoutDurationMs > 0 ? now + lockoutDurationMs : undefined;
  
  // Update store
  lockoutStore.set(key, {
    failedAttempts: newFailedAttempts,
    lockedUntil,
    lastFailedAttempt: now
  });
  
  // Log security event
  try {
    const { storage } = await import('../storage');
    const level = getLockoutLevel(newFailedAttempts);
    
    await storage.createAuditLog({
      userId: 'ANONYMOUS',
      action: lockedUntil ? 'ACCOUNT_LOCKED' : 'FAILED_LOGIN_ATTEMPT',
      details: `Failed login attempt for ${email} from ${ip}. ${newFailedAttempts} attempts. ${lockedUntil ? `Locked until ${new Date(lockedUntil).toISOString()}` : 'No lockout yet.'}`,
      metadata: JSON.stringify({
        email,
        ip,
        failedAttempts: newFailedAttempts,
        lockoutLevel: level,
        lockedUntil: lockedUntil ? new Date(lockedUntil).toISOString() : null
      })
    });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
  
  return {
    failedAttempts: newFailedAttempts,
    lockoutInfo: lockedUntil ? {
      locked: true,
      lockoutDurationMs,
      nextAttemptAllowedAt: lockedUntil
    } : undefined
  };
};

// Clear failed attempts (on successful login)
export const clearFailedAttempts = async (email: string, ip: string): Promise<void> => {
  const key = getLockoutKey(email, ip);
  const info = lockoutStore.get(key);
  
  if (info) {
    lockoutStore.delete(key);
    
    // Log successful recovery
    try {
      const { storage } = await import('../storage');
      await storage.createAuditLog({
        userId: email, // Will be updated with actual user ID later
        action: 'LOCKOUT_CLEARED',
        details: `Successfully logged in, cleared ${info.failedAttempts} failed attempts for ${email} from ${ip}`,
        metadata: JSON.stringify({ email, ip, clearedAttempts: info.failedAttempts })
      });
    } catch (error) {
      console.error('Failed to log lockout clear event:', error);
    }
  }
};

// Middleware to check account lockout before authentication
export const accountLockoutCheck = (req: Request, res: Response, next: NextFunction): void => {
  const email = req.body.email?.toLowerCase();
  const ip = req.ip || 'unknown';
  
  if (!email) {
    return next(); // Let the auth handler deal with missing email
  }
  
  const lockStatus = isAccountLocked(email, ip);
  
  if (lockStatus.locked && lockStatus.remainingLockoutMs) {
    const remainingMinutes = Math.ceil(lockStatus.remainingLockoutMs / (60 * 1000));
    const level = getLockoutLevel(lockStatus.failedAttempts);
    
    return res.status(429).json({
      error: 'Account temporarily locked due to multiple failed login attempts',
      details: `Account is locked for ${remainingMinutes} more minutes. This is lockout level ${level + 1}.`,
      retryAfter: Math.ceil(lockStatus.remainingLockoutMs / 1000),
      lockoutInfo: {
        level: level + 1,
        remainingMinutes,
        failedAttempts: lockStatus.failedAttempts
      }
    });
  }
  
  // Add lockout info to request for later use
  (req as any).lockoutInfo = lockStatus;
  next();
};

// Get lockout statistics for monitoring
export const getLockoutStats = (): {
  totalLockedAccounts: number;
  lockoutsByLevel: number[];
  recentFailedAttempts: number;
} => {
  const now = Date.now();
  const recentThreshold = 60 * 60 * 1000; // Last hour
  
  let totalLocked = 0;
  let recentFailed = 0;
  const lockoutsByLevel = [0, 0, 0];
  
  for (const [key, info] of lockoutStore.entries()) {
    // Count currently locked accounts
    if (info.lockedUntil && now < info.lockedUntil) {
      totalLocked++;
      const level = getLockoutLevel(info.failedAttempts);
      if (level >= 0) lockoutsByLevel[level]++;
    }
    
    // Count recent failed attempts
    if (now - info.lastFailedAttempt < recentThreshold) {
      recentFailed += info.failedAttempts;
    }
  }
  
  return {
    totalLockedAccounts: totalLocked,
    lockoutsByLevel,
    recentFailedAttempts: recentFailed
  };
};

export default {
  isAccountLocked,
  recordFailedAttempt,
  clearFailedAttempts,
  accountLockoutCheck,
  getLockoutStats
};