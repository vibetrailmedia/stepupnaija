import { Request, Response, NextFunction } from 'express';

// Admin role hierarchy and permissions
export type AdminRole = 'SUPER_ADMIN' | 'FINANCIAL_ADMIN' | 'COMMUNITY_MANAGER' | 'CONTENT_MODERATOR' | 'ANALYST';

// Permission categories
export type Permission = 
  // Financial permissions
  | 'CREATE_TOKENS' | 'MANUAL_TRANSACTIONS' | 'TREASURY_OPERATIONS' | 'ESCROW_MANAGEMENT' | 'FINANCIAL_REPORTS'
  // User management permissions  
  | 'MANAGE_USERS' | 'PROMOTE_ADMINS' | 'KYC_PROCESSING' | 'USER_ANALYTICS'
  // Content management permissions
  | 'MODERATE_CONTENT' | 'MANAGE_PROJECTS' | 'MANAGE_EVENTS' | 'APPROVE_SUBMISSIONS'
  // System administration permissions
  | 'SYSTEM_HEALTH' | 'AUDIT_LOGS' | 'DATA_EXPORT' | 'EMERGENCY_CONTROLS'
  // Communication permissions
  | 'BROADCAST_NOTIFICATIONS' | 'BULK_MESSAGING' | 'COMMUNITY_ENGAGEMENT'
  // Analytics permissions (read-only)
  | 'VIEW_ANALYTICS' | 'GENERATE_REPORTS' | 'PERFORMANCE_METRICS';

// Role-based permission mapping
const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  SUPER_ADMIN: [
    // Full access to everything
    'CREATE_TOKENS', 'MANUAL_TRANSACTIONS', 'TREASURY_OPERATIONS', 'ESCROW_MANAGEMENT', 'FINANCIAL_REPORTS',
    'MANAGE_USERS', 'PROMOTE_ADMINS', 'KYC_PROCESSING', 'USER_ANALYTICS', 
    'MODERATE_CONTENT', 'MANAGE_PROJECTS', 'MANAGE_EVENTS', 'APPROVE_SUBMISSIONS',
    'SYSTEM_HEALTH', 'AUDIT_LOGS', 'DATA_EXPORT', 'EMERGENCY_CONTROLS',
    'BROADCAST_NOTIFICATIONS', 'BULK_MESSAGING', 'COMMUNITY_ENGAGEMENT',
    'VIEW_ANALYTICS', 'GENERATE_REPORTS', 'PERFORMANCE_METRICS'
  ],
  
  FINANCIAL_ADMIN: [
    'CREATE_TOKENS', 'MANUAL_TRANSACTIONS', 'TREASURY_OPERATIONS', 'ESCROW_MANAGEMENT', 'FINANCIAL_REPORTS',
    'VIEW_ANALYTICS', 'GENERATE_REPORTS', 'PERFORMANCE_METRICS'
  ],
  
  COMMUNITY_MANAGER: [
    'MANAGE_USERS', 'KYC_PROCESSING', 'USER_ANALYTICS',
    'MANAGE_EVENTS', 'BROADCAST_NOTIFICATIONS', 'BULK_MESSAGING', 'COMMUNITY_ENGAGEMENT',
    'VIEW_ANALYTICS', 'GENERATE_REPORTS'
  ],
  
  CONTENT_MODERATOR: [
    'MODERATE_CONTENT', 'MANAGE_PROJECTS', 'MANAGE_EVENTS', 'APPROVE_SUBMISSIONS',
    'VIEW_ANALYTICS', 'GENERATE_REPORTS'
  ],
  
  ANALYST: [
    'VIEW_ANALYTICS', 'GENERATE_REPORTS', 'PERFORMANCE_METRICS', 'AUDIT_LOGS'
  ]
};

// Check if user has specific permission
export function hasPermission(userRole: AdminRole | null | undefined, permission: Permission): boolean {
  if (!userRole) return false;
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false;
}

// Check if user has any of the specified permissions
export function hasAnyPermission(userRole: AdminRole | null | undefined, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(userRole, permission));
}

// Middleware factory for role-based access control
export function requirePermission(...permissions: Permission[]) {
  return (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    // First check if user is authenticated
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Legacy admin check - if user has isAdmin = true but no role, treat as SUPER_ADMIN
    let userRole: AdminRole | null = user.adminRole;
    if (!userRole && user.isAdmin) {
      userRole = 'SUPER_ADMIN';
    }

    // Check if user has required permissions
    if (!userRole || !hasAnyPermission(userRole, permissions)) {
      return res.status(403).json({ 
        message: 'Insufficient permissions', 
        required: permissions,
        userRole: userRole || 'none'
      });
    }

    next();
  };
}

// Convenience middleware for common admin checks
export const requireSuperAdmin = requirePermission('PROMOTE_ADMINS', 'EMERGENCY_CONTROLS');
export const requireFinancialAdmin = requirePermission('CREATE_TOKENS', 'MANUAL_TRANSACTIONS');
export const requireContentModerator = requirePermission('MODERATE_CONTENT', 'APPROVE_SUBMISSIONS');
export const requireCommunityManager = requirePermission('MANAGE_USERS', 'COMMUNITY_ENGAGEMENT');
export const requireAnalyst = requirePermission('VIEW_ANALYTICS', 'GENERATE_REPORTS');

// Any admin role access (backward compatible)
export function requireAnyAdmin(req: Request & { user?: any }, res: Response, next: NextFunction) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: 'User not found' });
  }

  // Check either new role system or legacy isAdmin
  if (!user.adminRole && !user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }

  next();
}

// Get user's role display name
export function getRoleDisplayName(role: AdminRole): string {
  const roleNames: Record<AdminRole, string> = {
    'SUPER_ADMIN': 'Super Admin',
    'FINANCIAL_ADMIN': 'Financial Admin', 
    'COMMUNITY_MANAGER': 'Community Manager',
    'CONTENT_MODERATOR': 'Content Moderator',
    'ANALYST': 'Analyst'
  };
  return roleNames[role] || role;
}

// Get user's permissions list
export function getUserPermissions(role: AdminRole | null | undefined): Permission[] {
  if (!role) return [];
  return ROLE_PERMISSIONS[role] || [];
}