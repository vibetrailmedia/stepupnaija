import { Request, Response, NextFunction } from 'express';

// HTTPS enforcement middleware
export const enforceHTTPS = (req: Request, res: Response, next: NextFunction) => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction && !req.secure && req.get('X-Forwarded-Proto') !== 'https') {
    // Force HTTPS redirect in production
    const httpsUrl = `https://${req.get('Host')}${req.url}`;
    return res.redirect(301, httpsUrl);
  }
  
  next();
};

// Environment validation for production
export const validateProductionEnvironment = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (!isProduction) return;
  
  const requiredSecrets = [
    'SESSION_SECRET',
    'DATABASE_URL',
  ];
  
  const missing = requiredSecrets.filter(secret => !process.env[secret]);
  
  if (missing.length > 0) {
    throw new Error(`Production environment missing required secrets: ${missing.join(', ')}`);
  }
  
  // Validate session secret strength in production
  const sessionSecret = process.env.SESSION_SECRET;
  if (sessionSecret && sessionSecret.length < 32) {
    throw new Error('SESSION_SECRET must be at least 32 characters long in production');
  }
  
  console.log('✅ Production environment validation passed');
};

// Security audit logging
export const auditSecurityEvent = async (
  userId: string | null,
  event: string,
  details: string,
  metadata?: any
) => {
  try {
    // Import storage dynamically to avoid circular dependencies
    const { storage } = await import('../storage');
    
    await storage.createAuditLog({
      userId: userId || 'ANONYMOUS',
      action: event,
      details,
      metadata: metadata ? JSON.stringify(metadata) : null
    });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
};

// Enhanced request logging for security monitoring
export const securityLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const isSecurityEndpoint = req.path.includes('/api/auth/') || 
                              req.path.includes('/login') || 
                              req.path.includes('/register');
    
    if (isSecurityEndpoint || res.statusCode >= 400) {
      const logData = {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        userId: (req.user as any)?.id || null,
        timestamp: new Date().toISOString()
      };
      
      // Log suspicious activity
      if (res.statusCode === 401 || res.statusCode === 429) {
        auditSecurityEvent(
          (req.user as any)?.id || null,
          `HTTP_${res.statusCode}`,
          `${req.method} ${req.path} - ${res.statusCode}`,
          logData
        );
      }
      
      console.log(`[SECURITY] ${JSON.stringify(logData)}`);
    }
  });
  
  next();
};

export default {
  enforceHTTPS,
  validateProductionEnvironment,
  auditSecurityEvent,
  securityLogger
};