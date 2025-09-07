// Frontend role permission utilities
export type AdminRole = 'SUPER_ADMIN' | 'FINANCIAL_ADMIN' | 'COMMUNITY_MANAGER' | 'CONTENT_MODERATOR' | 'ANALYST' | null;

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

// Role-based permission mapping (must match backend)
const ROLE_PERMISSIONS: Record<Exclude<AdminRole, null>, Permission[]> = {
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
export function hasPermission(userRole: AdminRole, permission: Permission): boolean {
  if (!userRole) return false;
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false;
}

// Check if user has any of the specified permissions
export function hasAnyPermission(userRole: AdminRole, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(userRole, permission));
}

// Get user's role display name
export function getRoleDisplayName(role: AdminRole): string {
  if (!role) return 'No Admin Role';
  
  const roleNames: Record<Exclude<AdminRole, null>, string> = {
    'SUPER_ADMIN': 'Super Admin',
    'FINANCIAL_ADMIN': 'Financial Admin', 
    'COMMUNITY_MANAGER': 'Community Manager',
    'CONTENT_MODERATOR': 'Content Moderator',
    'ANALYST': 'Analyst'
  };
  return roleNames[role] || role;
}

// Get user's permissions list
export function getUserPermissions(role: AdminRole): Permission[] {
  if (!role) return [];
  return ROLE_PERMISSIONS[role] || [];
}

// Get role color for UI display
export function getRoleColor(role: AdminRole): string {
  if (!role) return 'gray';
  
  const roleColors: Record<Exclude<AdminRole, null>, string> = {
    'SUPER_ADMIN': 'red',
    'FINANCIAL_ADMIN': 'green',
    'COMMUNITY_MANAGER': 'blue',
    'CONTENT_MODERATOR': 'yellow',
    'ANALYST': 'purple'
  };
  return roleColors[role] || 'gray';
}

// Get role description
export function getRoleDescription(role: AdminRole): string {
  if (!role) return 'No administrative privileges';
  
  const roleDescriptions: Record<Exclude<AdminRole, null>, string> = {
    'SUPER_ADMIN': 'Full system access with ability to manage other admins and emergency controls',
    'FINANCIAL_ADMIN': 'Manages tokens, transactions, treasury operations and financial reporting',
    'COMMUNITY_MANAGER': 'Oversees user management, events, communications and community engagement',
    'CONTENT_MODERATOR': 'Reviews and moderates content, projects, events and user submissions',
    'ANALYST': 'View-only access to analytics, reports, metrics and audit logs'
  };
  return roleDescriptions[role] || 'Unknown role';
}