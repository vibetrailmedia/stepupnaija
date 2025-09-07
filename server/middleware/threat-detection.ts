import { Request, Response, NextFunction } from 'express';

interface ThreatMetrics {
  suspiciousIPs: Set<string>;
  bruteForceAttempts: Map<string, number>;
  rapidRequests: Map<string, number[]>;
  unusualPatterns: Map<string, any>;
  lastUpdated: number;
}

// Threat detection store
const threatMetrics: ThreatMetrics = {
  suspiciousIPs: new Set(),
  bruteForceAttempts: new Map(),
  rapidRequests: new Map(),
  unusualPatterns: new Map(),
  lastUpdated: Date.now()
};

// Threat detection configuration
const THREAT_CONFIG = {
  // Rate-based detection - more permissive in development
  rapidRequestThreshold: process.env.NODE_ENV === 'development' ? 500 : 50, // Requests per minute
  bruteForceThreshold: process.env.NODE_ENV === 'development' ? 50 : 10, // Failed attempts per hour
  
  // Pattern-based detection
  suspiciousUserAgents: [
    'sqlmap', 'nmap', 'nikto', 'burpsuite', 'metasploit',
    'masscan', 'zap', 'dirb', 'dirbuster', 'gobuster'
  ],
  
  suspiciousPaths: [
    '/admin', '/.env', '/wp-admin', '/phpmyadmin', '/config',
    '/.git', '/backup', '/sql', '/database', '/phpinfo',
    '/shell', '/cmd', '/eval', '/exec', '/wp-config'
  ],
  
  // Geo-based detection (simplified)
  highRiskCountries: ['CN', 'RU', 'KP', 'IR'], // Based on common attack origins
  
  // Cleanup intervals
  cleanupIntervalMs: 60 * 60 * 1000, // 1 hour
  metricsRetentionMs: 24 * 60 * 60 * 1000, // 24 hours
};

// Threat severity levels
enum ThreatSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

interface ThreatAlert {
  id: string;
  severity: ThreatSeverity;
  type: string;
  source: string;
  description: string;
  metadata: any;
  timestamp: number;
}

// Store recent alerts
const recentAlerts: ThreatAlert[] = [];
const MAX_RECENT_ALERTS = 100;

// Generate unique threat ID
const generateThreatId = (): string => {
  return `threat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Skip threat detection for development localhost
const isDevWhitelistedIP = (ip: string): boolean => {
  if (process.env.NODE_ENV !== 'development') {
    return false;
  }
  return ['127.0.0.1', '::1', 'localhost'].includes(ip);
};

// Log threat alert
const logThreatAlert = async (alert: ThreatAlert): Promise<void> => {
  // Skip alerts for whitelisted IPs in development
  if (isDevWhitelistedIP(alert.source)) {
    return;
  }
  
  // Add to recent alerts
  recentAlerts.unshift(alert);
  if (recentAlerts.length > MAX_RECENT_ALERTS) {
    recentAlerts.splice(MAX_RECENT_ALERTS);
  }
  
  // Log to console with severity indicator
  const severityIcon = {
    [ThreatSeverity.LOW]: '🟡',
    [ThreatSeverity.MEDIUM]: '🟠', 
    [ThreatSeverity.HIGH]: '🔴',
    [ThreatSeverity.CRITICAL]: '🚨'
  }[alert.severity];
  
  console.warn(`${severityIcon} [THREAT DETECTED] ${alert.type}: ${alert.description} (Source: ${alert.source})`);
  
  try {
    // Store in database
    const { storage } = await import('../storage');
    const { db } = await import('../db');
    const { securityAlerts } = await import('@shared/schema');
    
    // Log to audit trail
    await storage.createAuditLog({
      userId: 'SYSTEM',
      action: 'THREAT_DETECTED',
      details: `${alert.type}: ${alert.description}`,
      metadata: JSON.stringify(alert.metadata)
    });
    
    // Create security alert record
    await db.insert(securityAlerts).values({
      type: alert.type,
      severity: alert.severity,
      message: alert.description,
      metadata: JSON.stringify({
        ...alert.metadata,
        threatId: alert.id,
        source: alert.source
      })
    });
    
    // For critical threats, could trigger additional actions
    if (alert.severity === ThreatSeverity.CRITICAL) {
      console.error(`🚨 CRITICAL THREAT DETECTED: ${alert.description}`);
      // Could integrate with external alerting systems here
    }
    
  } catch (error) {
    console.error('Failed to log threat alert:', error);
  }
};

// Check if IP is suspicious
const checkSuspiciousIP = (ip: string): boolean => {
  return threatMetrics.suspiciousIPs.has(ip);
};

// Check for rapid requests (potential DDoS)
const checkRapidRequests = (ip: string): boolean => {
  // Skip rapid request detection for whitelisted IPs in development
  if (isDevWhitelistedIP(ip)) {
    return false;
  }
  
  const now = Date.now();
  const requests = threatMetrics.rapidRequests.get(ip) || [];
  
  // Clean old requests (older than 1 minute)
  const recentRequests = requests.filter(timestamp => now - timestamp < 60 * 1000);
  
  // Add current request
  recentRequests.push(now);
  threatMetrics.rapidRequests.set(ip, recentRequests);
  
  return recentRequests.length > THREAT_CONFIG.rapidRequestThreshold;
};

// Check for brute force attempts
const checkBruteForce = (ip: string): boolean => {
  const attempts = threatMetrics.bruteForceAttempts.get(ip) || 0;
  return attempts > THREAT_CONFIG.bruteForceThreshold;
};

// Check suspicious user agent
const checkSuspiciousUserAgent = (userAgent: string): boolean => {
  const ua = userAgent.toLowerCase();
  return THREAT_CONFIG.suspiciousUserAgents.some(suspicious => ua.includes(suspicious));
};

// Check suspicious path
const checkSuspiciousPath = (path: string): boolean => {
  return THREAT_CONFIG.suspiciousPaths.some(suspicious => 
    path.toLowerCase().includes(suspicious)
  );
};

// Record brute force attempt
export const recordBruteForceAttempt = (ip: string): void => {
  const current = threatMetrics.bruteForceAttempts.get(ip) || 0;
  threatMetrics.bruteForceAttempts.set(ip, current + 1);
  
  // Check if this triggers brute force detection
  if (current + 1 > THREAT_CONFIG.bruteForceThreshold) {
    threatMetrics.suspiciousIPs.add(ip);
    
    logThreatAlert({
      id: generateThreatId(),
      severity: ThreatSeverity.HIGH,
      type: 'BRUTE_FORCE_ATTACK',
      source: ip,
      description: `Brute force attack detected from ${ip}: ${current + 1} failed attempts`,
      metadata: {
        ip,
        attempts: current + 1,
        threshold: THREAT_CONFIG.bruteForceThreshold
      },
      timestamp: Date.now()
    });
  }
};

// Main threat detection middleware
export const threatDetectionMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const ip = req.ip || 'unknown';
  const userAgent = req.get('User-Agent') || '';
  const path = req.path;
  const method = req.method;
  
  let threatsDetected = 0;
  
  // Check for rapid requests
  if (checkRapidRequests(ip)) {
    threatsDetected++;
    logThreatAlert({
      id: generateThreatId(),
      severity: ThreatSeverity.MEDIUM,
      type: 'RAPID_REQUESTS',
      source: ip,
      description: `Rapid requests detected from ${ip}: ${threatMetrics.rapidRequests.get(ip)?.length || 0} requests/minute`,
      metadata: {
        ip,
        requestsPerMinute: threatMetrics.rapidRequests.get(ip)?.length || 0,
        threshold: THREAT_CONFIG.rapidRequestThreshold,
        path,
        method
      },
      timestamp: Date.now()
    });
  }
  
  // Check for suspicious user agent
  if (userAgent && checkSuspiciousUserAgent(userAgent)) {
    threatsDetected++;
    threatMetrics.suspiciousIPs.add(ip);
    
    logThreatAlert({
      id: generateThreatId(),
      severity: ThreatSeverity.HIGH,
      type: 'SUSPICIOUS_USER_AGENT',
      source: ip,
      description: `Suspicious user agent detected from ${ip}: ${userAgent}`,
      metadata: {
        ip,
        userAgent,
        path,
        method
      },
      timestamp: Date.now()
    });
  }
  
  // Check for suspicious path access
  if (checkSuspiciousPath(path)) {
    threatsDetected++;
    threatMetrics.suspiciousIPs.add(ip);
    
    logThreatAlert({
      id: generateThreatId(),
      severity: ThreatSeverity.MEDIUM,
      type: 'SUSPICIOUS_PATH_ACCESS',
      source: ip,
      description: `Suspicious path access from ${ip}: ${method} ${path}`,
      metadata: {
        ip,
        path,
        method,
        userAgent
      },
      timestamp: Date.now()
    });
  }
  
  // Check if IP is already flagged as suspicious (skip for dev whitelisted IPs)
  if (checkSuspiciousIP(ip) && threatsDetected === 0 && !isDevWhitelistedIP(ip)) {
    // Log continued activity from suspicious IP
    logThreatAlert({
      id: generateThreatId(),
      severity: ThreatSeverity.LOW,
      type: 'SUSPICIOUS_IP_ACTIVITY',
      source: ip,
      description: `Continued activity from flagged suspicious IP ${ip}: ${method} ${path}`,
      metadata: {
        ip,
        path,
        method,
        userAgent
      },
      timestamp: Date.now()
    });
  }
  
  // For critical threats, consider blocking the request (only in production)
  if (process.env.NODE_ENV === 'production' && (threatsDetected > 2 || (checkSuspiciousIP(ip) && threatsDetected > 0))) {
    return res.status(429).json({
      error: 'Request blocked due to suspicious activity',
      details: 'Multiple security threats detected from your IP address'
    });
  }
  
  next();
};

// Get threat statistics for monitoring dashboard
export const getThreatStats = (): {
  suspiciousIPCount: number;
  recentAlertsCount: number;
  threatsByType: Record<string, number>;
  threatsBySeverity: Record<string, number>;
  topThreats: Array<{ type: string; count: number; lastSeen: number }>;
} => {
  const now = Date.now();
  const last24Hours = now - (24 * 60 * 60 * 1000);
  
  const recentAlerts = recentAlerts.filter(alert => alert.timestamp > last24Hours);
  
  const threatsByType: Record<string, number> = {};
  const threatsBySeverity: Record<string, number> = {};
  
  recentAlerts.forEach(alert => {
    threatsByType[alert.type] = (threatsByType[alert.type] || 0) + 1;
    threatsBySeverity[alert.severity] = (threatsBySeverity[alert.severity] || 0) + 1;
  });
  
  const topThreats = Object.entries(threatsByType)
    .map(([type, count]) => ({
      type,
      count,
      lastSeen: Math.max(...recentAlerts.filter(a => a.type === type).map(a => a.timestamp))
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  return {
    suspiciousIPCount: threatMetrics.suspiciousIPs.size,
    recentAlertsCount: recentAlerts.length,
    threatsByType,
    threatsBySeverity,
    topThreats
  };
};

// Cleanup old threat data
const cleanupThreatData = (): void => {
  const now = Date.now();
  const retentionThreshold = now - THREAT_CONFIG.metricsRetentionMs;
  
  // Clean up rapid requests
  for (const [ip, requests] of threatMetrics.rapidRequests.entries()) {
    const recentRequests = requests.filter(timestamp => timestamp > retentionThreshold);
    if (recentRequests.length === 0) {
      threatMetrics.rapidRequests.delete(ip);
    } else {
      threatMetrics.rapidRequests.set(ip, recentRequests);
    }
  }
  
  // Reset brute force attempts periodically (they should be handled by account lockout)
  if (now - threatMetrics.lastUpdated > THREAT_CONFIG.cleanupIntervalMs) {
    threatMetrics.bruteForceAttempts.clear();
    threatMetrics.lastUpdated = now;
  }
  
  console.log(`🧹 Cleaned up threat detection data. Tracking ${threatMetrics.suspiciousIPs.size} suspicious IPs.`);
};

// Setup periodic cleanup
setInterval(cleanupThreatData, THREAT_CONFIG.cleanupIntervalMs);

export default {
  threatDetectionMiddleware,
  recordBruteForceAttempt,
  getThreatStats,
  logThreatAlert,
  ThreatSeverity
};