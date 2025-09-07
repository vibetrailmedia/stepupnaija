// Shared type definitions for the application

export interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  isAgeVerified: boolean;
  isActive: boolean;
  kycStatus?: KYCStatus;
}

export interface KYCStatus {
  id: string;
  userId: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'NOT_STARTED';
  submittedAt?: Date;
  verifiedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
  personalInfo?: any;
  documents?: any;
}

export interface Wallet {
  id: string;
  userId: string;
  supBalance: string;
  ngnBalance: string;
  lockedBalance: string;
  totalEarned: string;
  totalSpent: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationPreferences {
  id: string;
  userId: string;
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
  preferences: {
    taskReminders: boolean;
    prizeDraws: boolean;
    projectUpdates: boolean;
    communityMessages: boolean;
    systemUpdates: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationHistory {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  channel: 'EMAIL' | 'SMS' | 'PUSH';
  status: 'SENT' | 'DELIVERED' | 'FAILED';
  sentAt: Date;
  deliveredAt?: Date;
  readAt?: Date;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  success?: boolean;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Task {
  id: string;
  kind: 'QUIZ' | 'PETITION' | 'PHOTO_UPLOAD' | 'SURVEY' | 'VIDEO_WATCH';
  title: string;
  description: string;
  supReward: string;
  pointsReward: number;
  isActive: boolean;
  category?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  estimatedTime?: number;
  requirements?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  fundingGoal: string;
  currentFunding: string;
  ownerUserId?: string;
  category: string;
  status: 'DRAFT' | 'ACTIVE' | 'FUNDED' | 'COMPLETED' | 'CANCELLED';
  votesFor: number;
  votesAgainst: number;
  createdAt: Date;
  updatedAt: Date;
  endDate?: Date;
}