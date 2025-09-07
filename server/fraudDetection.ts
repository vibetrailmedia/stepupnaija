import { db } from "./db";
import { eq, and, sql, gte } from "drizzle-orm";
import { transactions, entries, securityAlerts, auditLogs } from "@shared/schema";

interface FraudCheck {
  isBlocked: boolean;
  reason?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface SuspiciousActivity {
  userId: string;
  type: string;
  details: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  metadata?: any;
}

export class FraudDetectionService {
  
  /**
   * Check for duplicate draw entries in the same round
   */
  async checkDuplicateEntry(userId: string, roundId: string): Promise<FraudCheck> {
    const existingEntries = await db
      .select({ count: sql`count(*)` })
      .from(entries)
      .where(and(
        eq(entries.userId, userId),
        eq(entries.roundId, roundId)
      ));
    
    const entryCount = Number(existingEntries[0]?.count) || 0;
    
    if (entryCount >= 10) {
      return {
        isBlocked: true,
        reason: 'Maximum entries per round exceeded',
        severity: 'high'
      };
    }
    
    if (entryCount >= 5) {
      await this.logSuspiciousActivity({
        userId,
        type: 'EXCESSIVE_ENTRIES',
        details: `User has ${entryCount} entries in round ${roundId}`,
        severity: 'medium',
        metadata: { roundId, entryCount }
      });
    }
    
    return { isBlocked: false, severity: 'low' };
  }

  /**
   * Check for rapid-fire transactions that might indicate automation
   */
  async checkTransactionVelocity(userId: string): Promise<FraudCheck> {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    const recentTransactions = await db
      .select({ count: sql`count(*)` })
      .from(transactions)
      .where(and(
        eq(transactions.userId, userId),
        gte(transactions.createdAt, fiveMinutesAgo)
      ));
    
    const transactionCount = Number(recentTransactions[0]?.count) || 0;
    
    if (transactionCount >= 20) {
      return {
        isBlocked: true,
        reason: 'Suspicious transaction velocity detected',
        severity: 'critical'
      };
    }
    
    if (transactionCount >= 10) {
      await this.logSuspiciousActivity({
        userId,
        type: 'HIGH_TRANSACTION_VELOCITY',
        details: `${transactionCount} transactions in 5 minutes`,
        severity: 'high',
        metadata: { transactionCount, timeframe: '5 minutes' }
      });
      
      return {
        isBlocked: false,
        severity: 'high'
      };
    }
    
    return { isBlocked: false, severity: 'low' };
  }

  /**
   * Check for unusual voting patterns
   */
  async checkVotingPattern(userId: string, projectId: string, amount: number): Promise<FraudCheck> {
    // Check if user is voting on their own project
    const { projects } = await import('@shared/schema');
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId));
    
    if (project?.ownerUserId === userId) {
      return {
        isBlocked: true,
        reason: 'Cannot vote on own project',
        severity: 'medium'
      };
    }
    
    // Check for excessive voting amounts
    if (amount > 1000) {
      await this.logSuspiciousActivity({
        userId,
        type: 'LARGE_VOTE',
        details: `Large vote of ${amount} SUP on project ${projectId}`,
        severity: 'medium',
        metadata: { projectId, amount }
      });
    }
    
    return { isBlocked: false, severity: 'low' };
  }

  /**
   * Check for financial transaction anomalies
   */
  async checkFinancialAnomaly(userId: string, amount: number, type: string): Promise<FraudCheck> {
    // Check for unusually large amounts
    const largeAmountThreshold = type === 'CASHOUT' ? 100000 : 50000; // NGN
    
    if (amount > largeAmountThreshold) {
      await this.logSuspiciousActivity({
        userId,
        type: 'LARGE_TRANSACTION',
        details: `Large ${type} transaction of ₦${amount}`,
        severity: 'high',
        metadata: { amount, transactionType: type }
      });
      
      // Block extremely large transactions for manual review
      if (amount > 500000) {
        return {
          isBlocked: true,
          reason: 'Transaction amount requires manual review',
          severity: 'critical'
        };
      }
    }
    
    // Check daily transaction volume
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [dailyVolume] = await db
      .select({ total: sql`sum(CAST(${transactions.amountNGN} AS DECIMAL))` })
      .from(transactions)
      .where(and(
        eq(transactions.userId, userId),
        gte(transactions.createdAt, today),
        eq(transactions.type, type as any)
      ));
    
    const totalVolume = parseFloat(dailyVolume?.total as string || '0') + amount;
    
    if (totalVolume > 200000) { // ₦200,000 daily limit
      return {
        isBlocked: true,
        reason: 'Daily transaction limit exceeded',
        severity: 'high'
      };
    }
    
    return { isBlocked: false, severity: 'low' };
  }

  /**
   * Check for account takeover indicators
   */
  async checkAccountSecurity(userId: string, ipAddress?: string, userAgent?: string): Promise<FraudCheck> {
    if (!ipAddress) return { isBlocked: false, severity: 'low' };
    
    // Check for login from new location (simplified - in production use geolocation)
    const recentAudits = await db
      .select()
      .from(auditLogs)
      .where(and(
        eq(auditLogs.actor, userId),
        gte(auditLogs.createdAt, new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) // Last 7 days
      ))
      .limit(10);
    
    const knownIPs = new Set(
      recentAudits
        .map(log => {
          try {
            const payload = JSON.parse(log.payloadJson as string);
            return payload.ipAddress;
          } catch {
            return null;
          }
        })
        .filter(Boolean)
    );
    
    if (knownIPs.size > 0 && !knownIPs.has(ipAddress)) {
      await this.logSuspiciousActivity({
        userId,
        type: 'NEW_IP_ADDRESS',
        details: `Login from new IP address: ${ipAddress}`,
        severity: 'medium',
        metadata: { ipAddress, userAgent, knownIPs: Array.from(knownIPs) }
      });
    }
    
    return { isBlocked: false, severity: 'low' };
  }

  /**
   * Comprehensive fraud check for any user action
   */
  async performComprehensiveCheck(
    userId: string, 
    action: string, 
    metadata?: any
  ): Promise<FraudCheck> {
    const checks: FraudCheck[] = [];
    
    // Run velocity check
    checks.push(await this.checkTransactionVelocity(userId));
    
    // Run account security check
    checks.push(await this.checkAccountSecurity(
      userId, 
      metadata?.ipAddress, 
      metadata?.userAgent
    ));
    
    // Check specific action types
    if (action === 'DRAW_ENTRY' && metadata?.roundId) {
      checks.push(await this.checkDuplicateEntry(userId, metadata.roundId));
    }
    
    if (action === 'VOTE' && metadata?.projectId && metadata?.amount) {
      checks.push(await this.checkVotingPattern(userId, metadata.projectId, metadata.amount));
    }
    
    if (['CASHOUT', 'TRANSFER'].includes(action) && metadata?.amount) {
      checks.push(await this.checkFinancialAnomaly(userId, metadata.amount, action));
    }
    
    // Find the highest severity check that blocks
    const blockingCheck = checks.find(check => check.isBlocked);
    if (blockingCheck) return blockingCheck;
    
    // Find the highest severity level
    const maxSeverity = checks.reduce((max, check) => {
      const severityOrder = { low: 0, medium: 1, high: 2, critical: 3 };
      return severityOrder[check.severity] > severityOrder[max] ? check.severity : max;
    }, 'low' as any);
    
    return { isBlocked: false, severity: maxSeverity };
  }

  /**
   * Log suspicious activity
   */
  private async logSuspiciousActivity(activity: SuspiciousActivity): Promise<void> {
    try {
      await db.insert(securityAlerts).values({
        type: activity.type,
        severity: activity.severity,
        message: activity.details,
        metadata: JSON.stringify({
          userId: activity.userId,
          ...activity.metadata,
          timestamp: new Date()
        })
      });
      
      // Also create audit log
      await db.insert(auditLogs).values({
        actor: 'FRAUD_DETECTION',
        action: 'SUSPICIOUS_ACTIVITY',
        payloadJson: JSON.stringify({
          type: activity.type,
          userId: activity.userId,
          details: activity.details,
          severity: activity.severity,
          metadata: activity.metadata
        })
      });
    } catch (error) {
      console.error('Failed to log suspicious activity:', error);
    }
  }

  /**
   * Block user temporarily for suspicious activity
   */
  async blockUser(userId: string, reason: string, durationHours: number = 24): Promise<void> {
    const { systemSettings } = await import('@shared/schema');
    
    const blockUntil = new Date(Date.now() + durationHours * 60 * 60 * 1000);
    
    await db.insert(systemSettings).values({
      key: `USER_BLOCK_${userId}`,
      value: blockUntil.toISOString(),
      description: reason,
      updatedBy: 'FRAUD_DETECTION'
    }).onConflictDoUpdate({
      target: systemSettings.key,
      set: {
        value: blockUntil.toISOString(),
        description: reason,
        updatedAt: new Date()
      }
    });
    
    await this.logSuspiciousActivity({
      userId,
      type: 'USER_BLOCKED',
      details: `User blocked for ${durationHours} hours: ${reason}`,
      severity: 'critical',
      metadata: { durationHours, blockUntil }
    });
  }

  /**
   * Check if user is currently blocked
   */
  async isUserBlocked(userId: string): Promise<{ blocked: boolean; reason?: string; until?: Date }> {
    const { systemSettings } = await import('@shared/schema');
    
    const [blockSetting] = await db
      .select()
      .from(systemSettings)
      .where(eq(systemSettings.key, `USER_BLOCK_${userId}`));
    
    if (!blockSetting?.value) {
      return { blocked: false };
    }
    
    const blockUntil = new Date(blockSetting.value);
    const now = new Date();
    
    if (now < blockUntil) {
      return {
        blocked: true,
        reason: blockSetting.description || 'Account temporarily suspended',
        until: blockUntil
      };
    }
    
    // Block has expired, clean up
    await db.delete(systemSettings).where(eq(systemSettings.key, `USER_BLOCK_${userId}`));
    return { blocked: false };
  }
}

export const fraudDetection = new FraudDetectionService();