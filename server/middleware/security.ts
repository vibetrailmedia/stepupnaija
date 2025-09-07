import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

// Rate limiting middleware
export const createRateLimiter = (windowMs: number, max: number, message?: string) => {
  return rateLimit({
    windowMs,
    max,
    message: message || 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
      res.status(429).json({
        error: 'Rate limit exceeded',
        retryAfter: Math.round(windowMs / 1000),
      });
    },
  });
};

// General rate limiter for API endpoints - more permissive in development
export const apiRateLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  process.env.NODE_ENV === 'development' ? 1000 : 100, // Much higher limit in development
  'Too many API requests'
);

// Stricter rate limiter for authentication endpoints
export const authRateLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  process.env.NODE_ENV === 'development' ? 50 : 5, // More permissive in development
  'Too many authentication attempts'
);

// Rate limiter for password reset endpoints
export const passwordResetRateLimiter = createRateLimiter(
  60 * 60 * 1000, // 1 hour
  3, // limit each IP to 3 requests per hour
  'Too many password reset attempts'
);

// Security headers middleware
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://api.stripe.com https://www.google-analytics.com",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ')
  );

  // HTTP Strict Transport Security
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );

  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');

  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // XSS Protection
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions Policy
  res.setHeader(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=(), fullscreen=(self)'
  );

  next();
};

// Input sanitization middleware
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  const sanitizeValue = (value: any): any => {
    if (typeof value === 'string') {
      // Remove potentially dangerous characters and scripts
      return value
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim();
    }
    if (typeof value === 'object' && value !== null) {
      const sanitized: any = Array.isArray(value) ? [] : {};
      for (const key in value) {
        sanitized[key] = sanitizeValue(value[key]);
      }
      return sanitized;
    }
    return value;
  };

  if (req.body) {
    req.body = sanitizeValue(req.body);
  }
  if (req.query) {
    req.query = sanitizeValue(req.query);
  }
  if (req.params) {
    req.params = sanitizeValue(req.params);
  }

  next();
};

// CSRF protection middleware (simple token-based)
export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  // Skip CSRF for GET requests and specific endpoints
  if (req.method === 'GET' || req.path.startsWith('/api/auth/')) {
    return next();
  }

  const token = req.headers['x-csrf-token'] || req.body._csrf;
  const sessionToken = (req.session as any)?.csrfToken;

  if (!token || !sessionToken || token !== sessionToken) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }

  next();
};

// Generate CSRF token endpoint
export const generateCSRFToken = (req: Request, res: Response) => {
  const token = Math.random().toString(36).substring(2, 15) + 
                Math.random().toString(36).substring(2, 15);
  
  (req.session as any).csrfToken = token;
  res.json({ csrfToken: token });
};

export default {
  apiRateLimiter,
  authRateLimiter,
  passwordResetRateLimiter,
  securityHeaders,
  sanitizeInput,
  csrfProtection,
  generateCSRFToken,
};