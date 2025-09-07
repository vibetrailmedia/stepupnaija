import type { Request, Response, NextFunction } from 'express';
import { gzip } from 'zlib';
import { promisify } from 'util';

const gzipAsync = promisify(gzip);

/**
 * Performance Middleware for Nigerian Users
 * 
 * Implements caching, compression, and optimization strategies
 * specifically designed for slower connections and mobile usage.
 */

// Compression middleware with Nigerian network optimization
export function compressionMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    const acceptEncoding = req.headers['accept-encoding'] || '';
    
    // Only compress for requests that accept gzip
    if (!acceptEncoding.includes('gzip')) {
      return next();
    }
    
    // Skip compression for small responses or already compressed content
    const originalSend = res.send;
    res.send = function(body: any): Response {
      if (typeof body === 'string' && body.length > 1024) {
        res.setHeader('Content-Encoding', 'gzip');
        res.setHeader('Vary', 'Accept-Encoding');
        
        gzipAsync(Buffer.from(body)).then(compressed => {
          res.setHeader('Content-Length', compressed.length);
          originalSend.call(res, compressed);
        }).catch(() => {
          // Fallback to uncompressed
          originalSend.call(res, body);
        });
      } else {
        originalSend.call(res, body);
      }
      return res;
    };
    
    next();
  };
}

// Caching headers optimized for mobile usage
export function cacheHeaders() {
  return (req: Request, res: Response, next: NextFunction) => {
    const path = req.path;
    
    // Static assets - long-term caching
    if (path.match(/\.(js|css|png|jpg|jpeg|gif|webp|woff2|woff|ttf|eot|svg|ico)$/)) {
      // Cache static assets for 1 year
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      res.setHeader('Expires', new Date(Date.now() + 31536000 * 1000).toUTCString());
    }
    // API endpoints - short-term caching for frequently accessed data
    else if (path.startsWith('/api/')) {
      if (path.includes('dashboard') || path.includes('projects') || path.includes('leaderboard')) {
        // Cache dynamic data for 5 minutes
        res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=600');
      } else {
        // No cache for sensitive endpoints
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      }
    }
    // HTML pages - short-term caching
    else {
      res.setHeader('Cache-Control', 'public, max-age=300, must-revalidate');
    }
    
    next();
  };
}

// Request prioritization for critical resources
export function requestPrioritization() {
  return (req: Request, res: Response, next: NextFunction) => {
    const path = req.path;
    const userAgent = req.headers['user-agent'] || '';
    const isMobile = /Mobile|Android|iPhone|iPad/.test(userAgent);
    
    // Set priority hints for Nigerian mobile users
    if (isMobile) {
      // Critical resources get high priority
      if (path.includes('critical.css') || path.includes('main.js') || path.includes('logo')) {
        res.setHeader('Priority', 'high');
      }
      // Non-critical resources get low priority
      else if (path.includes('analytics') || path.includes('tracking')) {
        res.setHeader('Priority', 'low');
      }
    }
    
    next();
  };
}

// Connection-aware content serving
export function connectionAwareServing() {
  return (req: Request, res: Response, next: NextFunction) => {
    const saveData = req.headers['save-data'];
    const connection = req.headers['connection'];
    
    // Detect slow connections
    const isSlowConnection = saveData === 'on' || connection === 'slow-2g' || connection === '2g';
    
    if (isSlowConnection) {
      // Add headers to indicate lightweight version should be served
      res.locals.optimizeForSlowConnection = true;
      res.setHeader('Vary', 'Save-Data, Connection');
    }
    
    next();
  };
}

// Performance monitoring middleware
export function performanceMonitoring() {
  return (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const size = res.getHeader('content-length') || 0;
      
      // Log slow requests (>2 seconds for Nigerian context)
      if (duration > 2000) {
        console.warn(`🐌 Slow request detected: ${req.method} ${req.path} - ${duration}ms, ${size} bytes`);
      }
      
      // Log to performance metrics (in production, send to monitoring service)
      console.log(`📊 ${req.method} ${req.path} - ${duration}ms, ${size} bytes`);
    });
    
    next();
  };
}

// Resource hints injection
export function resourceHints() {
  return (req: Request, res: Response, next: NextFunction) => {
    // Inject resource hints for better performance
    if (req.path === '/' || req.path.endsWith('.html')) {
      const originalSend = res.send;
      res.send = function(body: any): Response {
        if (typeof body === 'string' && body.includes('</head>')) {
          const hints = `
            <!-- Performance optimizations for Nigerian users -->
            <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
            <link rel="dns-prefetch" href="//api.stepupnaija.ng">
            <link rel="preload" href="/assets/css/critical.css" as="style">
            <link rel="preload" href="/assets/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
            <!-- Data saving for mobile users -->
            <meta http-equiv="Accept-CH" content="Save-Data, Viewport-Width, Width">
          `;
          body = body.replace('</head>', hints + '</head>');
        }
        originalSend.call(res, body);
        return res;
      };
    }
    
    next();
  };
}

// Bundle optimization headers
export function bundleOptimization() {
  return (req: Request, res: Response, next: NextFunction) => {
    const path = req.path;
    
    // Enable HTTP/2 Server Push for critical resources
    if (path === '/' && req.httpVersion === '2.0') {
      // Push critical CSS
      res.setHeader('Link', '</assets/css/critical.css>; rel=preload; as=style');
      
      // Push critical JavaScript
      res.setHeader('Link', '</assets/js/main.js>; rel=preload; as=script');
    }
    
    next();
  };
}

// All performance middleware combined
export function performanceMiddlewareStack() {
  return [
    performanceMonitoring(),
    compressionMiddleware(),
    cacheHeaders(),
    requestPrioritization(),
    connectionAwareServing(),
    resourceHints(),
    bundleOptimization(),
  ];
}