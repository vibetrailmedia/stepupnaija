import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Admin role system
export const adminRoleEnum = pgEnum('admin_role', [
  'SUPER_ADMIN', 'FINANCIAL_ADMIN', 'COMMUNITY_MANAGER', 'CONTENT_MODERATOR', 'ANALYST'
]);

// Achievement types for civic engagement badges
export const achievementTypeEnum = pgEnum('achievement_type', [
  'ENGAGEMENT', 'LEADERSHIP', 'COMMUNITY', 'LEARNING', 'PARTICIPATION', 'MILESTONE', 'SPECIAL'
]);

// Achievement categories
export const achievementCategoryEnum = pgEnum('achievement_category', [
  'FIRST_STEPS', 'CIVIC_HERO', 'LEADER_TRACK', 'COMMUNITY_BUILDER', 'KNOWLEDGE_SEEKER', 'SUPER_CITIZEN'
]);

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  password: varchar("password"), // For local authentication
  // OAuth provider fields
  googleId: varchar("google_id").unique(),
  authProvider: varchar("auth_provider").default('LOCAL'), // 'LOCAL', 'GOOGLE', 'FACEBOOK'
  providerAccountId: varchar("provider_account_id"), // External provider ID
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  phone: varchar("phone"),
  citizenNumber: integer("citizen_number"), // Sequential user number (Citizen #X)
  credibilityBadge: varchar("credibility_badge"), // CREDIBLE_VERIFIED, COMMUNITY_LEADER, etc.
  credibilityScore: integer("credibility_score").default(0),
  credibilityBadgeEarnedAt: timestamp("credibility_badge_earned_at"),
  credibleLevel: integer("credible_level").default(0), // 0=none, 1=verified, 2=trained, 3=civic leader
  onFoundersWall: boolean("on_founders_wall").default(false), // For first 10,000 citizens
  kycStatus: varchar("kyc_status").default('NOT_STARTED'),
  kycData: text("kyc_data"),
  kycSubmittedAt: timestamp("kyc_submitted_at"),
  kycReviewedAt: timestamp("kyc_reviewed_at"),
  referralCode: varchar("referral_code"),
  state: varchar("state"), // Nigerian state
  lga: varchar("lga"), // Local Government Area
  bio: text("bio"),
  isAdmin: boolean("is_admin").default(false),
  adminRole: adminRoleEnum("admin_role"), // New role-based admin system
  adminRoleAssignedAt: timestamp("admin_role_assigned_at"),
  adminRoleAssignedBy: varchar("admin_role_assigned_by"),
  ageVerified: boolean("age_verified").default(false),
  ageVerifiedAt: timestamp("age_verified_at"),
  // Two-Factor Authentication fields
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
  twoFactorSecret: varchar("two_factor_secret"), // TOTP secret key
  twoFactorBackupCodes: jsonb("two_factor_backup_codes").default('[]'), // Array of backup codes
  twoFactorSetupAt: timestamp("two_factor_setup_at"),
  achievements: jsonb("achievements").default('[]'),
  totalEngagements: integer("total_engagements").default(0),
  engagementStreak: integer("engagement_streak").default(0),
  lastEngagementDate: timestamp("last_engagement_date"),
  totalDonated: decimal("total_donated", { precision: 18, scale: 2 }).default('0'),
  donationCount: integer("donation_count").default(0),
  donorLevel: varchar("donor_level"), // 'bronze', 'silver', 'gold', 'platinum'
  // New volunteer and user type fields
  userType: varchar("user_type").default("CITIZEN"), // CITIZEN, VOLUNTEER, ASPIRING_LEADER, STUDENT, ACTIVIST, ENTREPRENEUR, LEADER
  volunteerStatus: varchar("volunteer_status").default("INACTIVE"), // INACTIVE, ONBOARDING, ACTIVE, VETERAN
  onboardingCompleted: boolean("onboarding_completed").default(false), // Track if user completed onboarding
  onboardingCompletedAt: timestamp("onboarding_completed_at"),
  profileBio: text("profile_bio"), // Replaces bio field with more descriptive name
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const wallets = pgTable("wallets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  supBalance: decimal("sup_balance", { precision: 18, scale: 2 }).default('0'),
  ngnEscrow: decimal("ngn_escrow", { precision: 18, scale: 2 }).default('0'),
  createdAt: timestamp("created_at").defaultNow(),
});

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  token: varchar("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const transactionTypeEnum = pgEnum('transaction_type', [
  'BUY', 'CASHOUT', 'TRANSFER', 'PRIZE', 'ENGAGE', 'VOTE', 'FEE', 'ENTRY', 'EARNED', 'DONATION'
]);

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  type: transactionTypeEnum("type"),
  amountSUP: decimal("amount_sup", { precision: 18, scale: 2 }),
  amountNGN: decimal("amount_ngn", { precision: 18, scale: 2 }),
  meta: jsonb("meta"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const engagementTaskKindEnum = pgEnum('engagement_task_kind', [
  'QUIZ', 'NOMINATION', 'SHARE', 'VOLUNTEER', 'PHOTO_UPLOAD', 'SURVEY', 'PETITION', 'MEETING_ATTENDANCE'
]);

export const engagementTasks = pgTable("engagement_tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  kind: engagementTaskKindEnum("kind"),
  title: text("title"),
  description: text("description"),
  rewardSUP: decimal("reward_sup", { precision: 18, scale: 2 }),
  state: varchar("state"), // Nigerian state filter
  lga: varchar("lga"), // LGA filter
  requiresVerification: boolean("requires_verification").default(false),
  maxCompletions: integer("max_completions"), // null = unlimited
  completionCount: integer("completion_count").default(0),
  activeFrom: timestamp("active_from").defaultNow(),
  activeTo: timestamp("active_to"),
  linkedEventId: varchar("linked_event_id").references(() => networkingEvents.id), // Link task to specific event
  eventRequired: boolean("event_required").default(false), // Task only appears when linked event is active
  createdAt: timestamp("created_at").defaultNow(),
});

export const engagementEventStatusEnum = pgEnum('engagement_event_status', [
  'PENDING', 'APPROVED', 'REJECTED'
]);

export const engagementEvents = pgTable("engagement_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  taskId: varchar("task_id").references(() => engagementTasks.id),
  status: engagementEventStatusEnum("status").default('PENDING'),
  rewardSUP: decimal("reward_sup", { precision: 18, scale: 2 }),
  data: jsonb("data"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const roundKindEnum = pgEnum('round_kind', ['DAILY', 'WEEKLY']);
export const roundStatusEnum = pgEnum('round_status', ['OPEN', 'LOCKED', 'DRAWN', 'PAID']);

export const rounds = pgTable("rounds", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  kind: roundKindEnum("kind"),
  status: roundStatusEnum("status").default('OPEN'),
  poolSUP: decimal("pool_sup", { precision: 18, scale: 2 }).default('0'),
  projectsPct: integer("projects_pct").default(20),
  prizesPct: integer("prizes_pct").default(70),
  platformPct: integer("platform_pct").default(10),
  commitHash: text("commit_hash"),
  revealSeed: text("reveal_seed"),
  openedAt: timestamp("opened_at").defaultNow(),
  lockedAt: timestamp("locked_at"),
  drawnAt: timestamp("drawn_at"),
});

export const entrySourceEnum = pgEnum('entry_source', ['BUY', 'EARNED']);

export const entries = pgTable("entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  roundId: varchar("round_id").references(() => rounds.id),
  userId: varchar("user_id").references(() => users.id),
  tickets: integer("tickets").default(1),
  source: entrySourceEnum("source"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const prizes = pgTable("prizes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  roundId: varchar("round_id").references(() => rounds.id),
  userId: varchar("user_id").references(() => users.id),
  amountSUP: decimal("amount_sup", { precision: 18, scale: 2 }),
  tier: integer("tier"),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const projectStatusEnum = pgEnum('project_status', [
  'PROPOSED', 'APPROVED', 'FUNDED', 'COMPLETED'
]);

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ownerUserId: varchar("owner_user_id").references(() => users.id),
  title: text("title"),
  lga: varchar("lga"),
  category: varchar("category"),
  description: text("description"),
  imageUrl: text("image_url"),
  status: projectStatusEnum("status").default('PROPOSED'),
  targetNGN: decimal("target_ngn", { precision: 18, scale: 2 }),
  raisedNGN: decimal("raised_ngn", { precision: 18, scale: 2 }).default('0'),
  donorCount: integer("donor_count").default(0),
  fundingDeadline: timestamp("funding_deadline"),
  impactDescription: text("impact_description"),
  updates: jsonb("updates").default('[]'),
  createdAt: timestamp("created_at").defaultNow(),
});

export const votes = pgTable("votes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id),
  userId: varchar("user_id").references(() => users.id),
  amountSUP: decimal("amount_sup", { precision: 18, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Donations table to track individual donations
export const donationStatusEnum = pgEnum('donation_status', [
  'PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'
]);

export const donations = pgTable("donations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id),
  userId: varchar("user_id").references(() => users.id),
  amountNGN: decimal("amount_ngn", { precision: 18, scale: 2 }),
  status: donationStatusEnum("status").default('PENDING'),
  paymentMethod: varchar("payment_method"), // 'card', 'bank_transfer', 'ussd', 'mobile_money'
  paymentReference: varchar("payment_reference"), // Paystack reference
  isAnonymous: boolean("is_anonymous").default(false),
  donorName: varchar("donor_name"), // For anonymous donations or gift donations
  message: text("message"), // Optional message from donor
  metadata: jsonb("metadata"), // Payment provider details, receipt info, etc.
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Project updates table for transparent impact reporting
export const projectUpdateTypeEnum = pgEnum('project_update_type', [
  'MILESTONE', 'EXPENSE', 'PROGRESS', 'COMPLETION'
]);

export const projectUpdates = pgTable("project_updates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id),
  authorId: varchar("author_id").references(() => users.id),
  type: projectUpdateTypeEnum("type"),
  title: text("title"),
  description: text("description"),
  imageUrl: text("image_url"),
  amountSpent: decimal("amount_spent", { precision: 18, scale: 2 }),
  receiptUrl: text("receipt_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const receipts = pgTable("receipts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id),
  fileUrl: text("file_url"),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  actor: varchar("actor"),
  action: varchar("action"),
  payloadJson: jsonb("payload_json"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Security alerts table
export const securityAlerts = pgTable("security_alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: varchar("type").notNull(), // 'LARGE_WITHDRAWAL' | 'UNUSUAL_ACTIVITY' | 'LOW_RESERVES' | 'RATE_LIMIT_HIT'
  severity: varchar("severity").notNull(), // 'low' | 'medium' | 'high' | 'critical'
  message: text("message").notNull(),
  resolved: boolean("resolved").default(false),
  resolvedBy: varchar("resolved_by"),
  resolvedAt: timestamp("resolved_at"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// System settings table for emergency controls
export const systemSettings = pgTable("system_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: varchar("key").notNull().unique(),
  value: text("value"),
  description: text("description"),
  updatedBy: varchar("updated_by"),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// KYC Documents
export const kycStatusEnum = pgEnum('kyc_status', ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED']);
export const kycDocumentTypeEnum = pgEnum('kyc_document_type', ['NIN', 'VOTERS_CARD', 'DRIVERS_LICENSE', 'PASSPORT']);

export const kycDocuments = pgTable("kyc_documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  documentType: kycDocumentTypeEnum("document_type"),
  documentNumber: varchar("document_number"),
  documentImageUrl: text("document_image_url"),
  status: kycStatusEnum("status").default('PENDING'),
  reviewedBy: varchar("reviewed_by").references(() => users.id),
  reviewNotes: text("review_notes"),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Notifications
export const notificationTypeEnum = pgEnum('notification_type', [
  'TASK_COMPLETED', 'PRIZE_WON', 'PROJECT_FUNDED', 'KYC_APPROVED', 'KYC_REJECTED', 'DRAW_RESULT', 'GENERAL'
]);
export const notificationChannelEnum = pgEnum('notification_channel', ['EMAIL', 'SMS', 'IN_APP']);

export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  type: notificationTypeEnum("type"),
  channel: notificationChannelEnum("channel"),
  title: text("title"),
  message: text("message"),
  data: jsonb("data"),
  readAt: timestamp("read_at"),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Educational Content
export const educationalContentTypeEnum = pgEnum('educational_content_type', [
  'ARTICLE', 'VIDEO', 'QUIZ', 'GUIDE', 'INFOGRAPHIC'
]);
export const educationalContentCategoryEnum = pgEnum('educational_content_category', [
  'CONSTITUTION', 'VOTING', 'GOVERNANCE', 'CIVIC_DUTY', 'RIGHTS', 'DEMOCRACY', 'LOCAL_GOVERNMENT'
]);

export const educationalContent = pgTable("educational_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title"),
  slug: varchar("slug").unique(),
  type: educationalContentTypeEnum("type"),
  category: educationalContentCategoryEnum("category"),
  content: text("content"),
  excerpt: text("excerpt"),
  imageUrl: text("image_url"),
  videoUrl: text("video_url"),
  estimatedReadTime: integer("estimated_read_time"), // minutes
  state: varchar("state"), // Nigerian state filter
  isPublished: boolean("is_published").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Nigerian States and LGAs Reference
export const nigerianStates = pgTable("nigerian_states", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").unique(),
  code: varchar("code", { length: 2 }).unique(),
  region: varchar("region"), // North Central, North East, North West, South East, South South, South West
  createdAt: timestamp("created_at").defaultNow(),
});

export const nigerianLgas = pgTable("nigerian_lgas", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name"),
  stateId: varchar("state_id").references(() => nigerianStates.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Civic Achievement Badges System
export const civicBadges = pgTable("civic_badges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull().unique(),
  slug: varchar("slug").notNull().unique(),
  description: text("description"),
  icon: varchar("icon").notNull(), // lucide icon name
  type: achievementTypeEnum("type").notNull(),
  category: achievementCategoryEnum("category").notNull(),
  tier: integer("tier").default(1), // 1=Bronze, 2=Silver, 3=Gold, 4=Platinum
  color: varchar("color").default("blue"), // badge color theme
  requirements: jsonb("requirements").notNull(), // JSON with achievement criteria
  supReward: decimal("sup_reward", { precision: 18, scale: 2 }).default('0'),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// User Achievement Badges - Many-to-Many relationship
export const userBadges = pgTable("user_badges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  badgeId: varchar("badge_id").references(() => civicBadges.id).notNull(),
  earnedAt: timestamp("earned_at").defaultNow(),
  progress: jsonb("progress"), // Track progress towards badge completion
  metadata: jsonb("metadata"), // Additional badge-specific data
  createdAt: timestamp("created_at").defaultNow(),
});

// Community Forums System
export const forumCategories = pgTable("forum_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  slug: varchar("slug").notNull().unique(),
  description: text("description"),
  icon: varchar("icon").default("MessageCircle"),
  color: varchar("color").default("blue"),
  state: varchar("state"), // Nigerian state filter (null for national)
  lga: varchar("lga"), // LGA filter (null for state-wide)
  postCount: integer("post_count").default(0),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const forumPosts = pgTable("forum_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  categoryId: varchar("category_id").references(() => forumCategories.id).notNull(),
  authorId: varchar("author_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  isPinned: boolean("is_pinned").default(false),
  isLocked: boolean("is_locked").default(false),
  viewCount: integer("view_count").default(0),
  replyCount: integer("reply_count").default(0),
  lastActivityAt: timestamp("last_activity_at").defaultNow(),
  tags: jsonb("tags").default('[]'), // Array of tags
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const forumReplies = pgTable("forum_replies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  threadId: varchar("thread_id").notNull().references(() => forumThreads.id),
  authorUserId: varchar("author_user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  parentReplyId: varchar("parent_reply_id"), // For nested replies
  isVerified: boolean("is_verified").default(false), // For candidate verified responses
  upvotes: integer("upvotes").default(0),
  downvotes: integer("downvotes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Citizen Reporting System
export const reportTypeEnum = pgEnum('report_type', [
  'INFRASTRUCTURE', 'SECURITY', 'CORRUPTION', 'SERVICE_DELIVERY', 'ENVIRONMENTAL', 'ELECTORAL', 'OTHER'
]);

export const reportStatusEnum = pgEnum('report_status', [
  'SUBMITTED', 'UNDER_REVIEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'DISMISSED'
]);

export const citizenReports = pgTable("citizen_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  reporterId: varchar("reporter_id").references(() => users.id).notNull(),
  type: reportTypeEnum("type").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location"), // Address or description
  state: varchar("state").notNull(),
  lga: varchar("lga").notNull(),
  geoLocation: jsonb("geo_location"), // {lat, lng}
  images: jsonb("images").default('[]'), // Array of image URLs
  status: reportStatusEnum("status").default('SUBMITTED'),
  priority: varchar("priority").default('MEDIUM'), // LOW, MEDIUM, HIGH, URGENT
  assignedTo: varchar("assigned_to").references(() => users.id),
  statusUpdatedAt: timestamp("status_updated_at").defaultNow(),
  publicId: varchar("public_id").unique(), // Public tracking ID for citizens
  upvotes: integer("upvotes").default(0),
  metadata: jsonb("metadata"), // Additional report data
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const reportUpdates = pgTable("report_updates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  reportId: varchar("report_id").references(() => citizenReports.id).notNull(),
  updatedBy: varchar("updated_by").references(() => users.id).notNull(),
  message: text("message").notNull(),
  newStatus: reportStatusEnum("new_status"),
  isPublic: boolean("is_public").default(true), // Visible to reporter
  createdAt: timestamp("created_at").defaultNow(),
});




// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type Wallet = typeof wallets.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type EngagementTask = typeof engagementTasks.$inferSelect;
export type EngagementEvent = typeof engagementEvents.$inferSelect;
export type Round = typeof rounds.$inferSelect;
export type Entry = typeof entries.$inferSelect;
export type Prize = typeof prizes.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Vote = typeof votes.$inferSelect;
export type KycDocument = typeof kycDocuments.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type EducationalContent = typeof educationalContent.$inferSelect;
export type NigerianState = typeof nigerianStates.$inferSelect;
export type NigerianLga = typeof nigerianLgas.$inferSelect;
export type CivicBadge = typeof civicBadges.$inferSelect;
export type UserBadge = typeof userBadges.$inferSelect;
export type ForumCategory = typeof forumCategories.$inferSelect;
export type ForumPost = typeof forumPosts.$inferSelect;
export type ForumReply = typeof forumReplies.$inferSelect;
export type CitizenReport = typeof citizenReports.$inferSelect;
export type ReportUpdate = typeof reportUpdates.$inferSelect;

// New Types
export type Message = typeof messages.$inferSelect;
export type MessageGroup = typeof messageGroups.$inferSelect;
export type MessageGroupMember = typeof messageGroupMembers.$inferSelect;
export type TrainingModule = typeof trainingModules.$inferSelect;
export type UserTrainingProgress = typeof userTrainingProgress.$inferSelect;
export type TrainingQuiz = typeof trainingQuizzes.$inferSelect;
export type UserQuizAnswer = typeof userQuizAnswers.$inferSelect;
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type DailyMetric = typeof dailyMetrics.$inferSelect;
export type PushSubscription = typeof pushSubscriptions.$inferSelect;
export type StripePlan = typeof stripePlans.$inferSelect;
export type StripePayment = typeof stripePayments.$inferSelect;
export type ForumMediaUpload = typeof forumMediaUploads.$inferSelect;

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWalletSchema = createInsertSchema(wallets).omit({
  id: true,
  createdAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const insertEngagementTaskSchema = createInsertSchema(engagementTasks).omit({
  id: true,
  createdAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  raisedNGN: true,
});

export const insertVoteSchema = createInsertSchema(votes).omit({
  id: true,
  createdAt: true,
});

// Additional insert schemas
export const insertKycDocumentSchema = createInsertSchema(kycDocuments).omit({
  id: true,
  createdAt: true,
  reviewedAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
  sentAt: true,
});

export const insertEducationalContentSchema = createInsertSchema(educationalContent).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  publishedAt: true,
});

export const insertCivicBadgeSchema = createInsertSchema(civicBadges).omit({
  id: true,
  createdAt: true,
});

export const insertUserBadgeSchema = createInsertSchema(userBadges).omit({
  id: true,
  createdAt: true,
  earnedAt: true,
});

export const insertForumCategorySchema = createInsertSchema(forumCategories).omit({
  id: true,
  createdAt: true,
  postCount: true,
});

export const insertForumPostSchema = createInsertSchema(forumPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  viewCount: true,
  replyCount: true,
  lastActivityAt: true,
});

export const insertForumReplySchema = createInsertSchema(forumReplies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCitizenReportSchema = createInsertSchema(citizenReports).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  statusUpdatedAt: true,
  publicId: true,
  upvotes: true,
});

export const insertReportUpdateSchema = createInsertSchema(reportUpdates).omit({
  id: true,
  createdAt: true,
});




export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertWallet = z.infer<typeof insertWalletSchema>;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type InsertEngagementTask = z.infer<typeof insertEngagementTaskSchema>;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type InsertVote = z.infer<typeof insertVoteSchema>;
export type InsertKycDocument = z.infer<typeof insertKycDocumentSchema>;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type InsertEducationalContent = z.infer<typeof insertEducationalContentSchema>;
export type InsertCivicBadge = z.infer<typeof insertCivicBadgeSchema>;
export type InsertUserBadge = z.infer<typeof insertUserBadgeSchema>;
export type InsertForumCategory = z.infer<typeof insertForumCategorySchema>;
export type InsertForumPost = z.infer<typeof insertForumPostSchema>;
export type InsertForumReply = z.infer<typeof insertForumReplySchema>;
export type InsertCitizenReport = z.infer<typeof insertCitizenReportSchema>;
export type InsertReportUpdate = z.infer<typeof insertReportUpdateSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type InsertMessageGroup = z.infer<typeof insertMessageGroupSchema>;
export type InsertTrainingModule = z.infer<typeof insertTrainingModuleSchema>;
export type InsertUserTrainingProgress = z.infer<typeof insertUserTrainingProgressSchema>;
export type InsertTrainingQuiz = typeof trainingQuizzes.$inferInsert;
export type InsertUserQuizAnswer = typeof userQuizAnswers.$inferInsert;
export type InsertChallengeTrainingModule = typeof challengeTrainingModules.$inferInsert;
export type InsertChallengeTrainingProgress = typeof challengeTrainingProgress.$inferInsert;
export type InsertStripePayment = z.infer<typeof insertStripePaymentSchema>;
export type InsertForumMediaUpload = z.infer<typeof insertForumMediaUploadSchema>;

// Messages and Chat System
export const messageTypeEnum = pgEnum('message_type', ['DIRECT', 'GROUP', 'SYSTEM']);
export const messageStatusEnum = pgEnum('message_status', ['SENT', 'DELIVERED', 'READ']);

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fromUserId: varchar("from_user_id").references(() => users.id),
  toUserId: varchar("to_user_id").references(() => users.id), // For direct messages
  groupId: varchar("group_id"), // For group messages
  type: messageTypeEnum("type").default('DIRECT'),
  content: text("content"),
  status: messageStatusEnum("status").default('SENT'),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messageGroups = pgTable("message_groups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name"),
  description: text("description"),
  ownerId: varchar("owner_id").references(() => users.id),
  isLGAGroup: boolean("is_lga_group").default(false),
  lga: varchar("lga"), // If LGA-specific group
  state: varchar("state"), // If state-specific group
  memberCount: integer("member_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messageGroupMembers = pgTable("message_group_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  groupId: varchar("group_id").references(() => messageGroups.id),
  userId: varchar("user_id").references(() => users.id),
  role: varchar("role").default('MEMBER'), // MEMBER, ADMIN, MODERATOR
  joinedAt: timestamp("joined_at").defaultNow(),
});

// Enhanced Training System
export const trainingModuleTypeEnum = pgEnum('training_module_type', ['VIDEO', 'QUIZ', 'READING', 'INTERACTIVE', 'ASSIGNMENT']);
export const trainingDifficultyEnum = pgEnum('training_difficulty', ['BEGINNER', 'INTERMEDIATE', 'ADVANCED']);

export const trainingModules = pgTable("training_modules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title"),
  description: text("description"),
  type: trainingModuleTypeEnum("type"),
  difficulty: trainingDifficultyEnum("difficulty"),
  content: text("content"), // Rich content (HTML/Markdown)
  videoUrl: text("videoUrl"),
  estimatedDuration: integer("estimatedDuration"), // minutes
  pointsReward: integer("pointsReward").default(0),
  supReward: decimal("supReward", { precision: 18, scale: 2 }).default('0'),
  prerequisiteModuleId: varchar("prerequisiteModuleId").references((): any => trainingModules.id),
  order: integer("order").default(0),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const userTrainingProgress = pgTable("user_training_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("userId").references(() => users.id),
  moduleId: varchar("moduleId").references(() => trainingModules.id),
  status: varchar("status").default('NOT_STARTED'), // NOT_STARTED, IN_PROGRESS, COMPLETED
  progressPercentage: integer("progress_percentage").default(0), // 0-100 percentage
  score: integer("score"), // Quiz/assessment score
  startedAt: timestamp("startedAt"),
  completedAt: timestamp("completedAt"),
  certificateUrl: varchar("certificate_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  timeSpent: integer("timeSpent").default(0), // minutes
  streakCount: integer("streak_count").default(0),
});

export const trainingQuizzes = pgTable("training_quizzes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  moduleId: varchar("moduleId").references(() => trainingModules.id),
  question: text("question"),
  options: jsonb("options"), // Array of options
  correctAnswer: integer("correct_answer"), // Index of correct option
  explanation: text("explanation"),
  order: integer("order").default(0),
});

export const userQuizAnswers = pgTable("user_quiz_answers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  quizId: varchar("quiz_id").references(() => trainingQuizzes.id),
  selectedAnswer: integer("selected_answer"),
  isCorrect: boolean("is_correct"),
  answeredAt: timestamp("answered_at").defaultNow(),
});

// Analytics and Tracking
export const analyticsEvents = pgTable("analytics_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  eventType: varchar("event_type"), // 'page_view', 'task_completed', 'vote_cast', etc.
  eventData: jsonb("event_data"),
  sessionId: varchar("session_id"),
  userAgent: text("user_agent"),
  ipAddress: varchar("ip_address"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const dailyMetrics = pgTable("daily_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: varchar("date"), // YYYY-MM-DD
  activeUsers: integer("active_users").default(0),
  newRegistrations: integer("new_registrations").default(0),
  tasksCompleted: integer("tasks_completed").default(0),
  supTokensDistributed: decimal("sup_tokens_distributed", { precision: 18, scale: 2 }).default('0'),
  messagesExchanged: integer("messages_exchanged").default(0),
  forumPosts: integer("forum_posts").default(0),
  votesCase: integer("votes_cast").default(0),
});

// PWA and Push Notifications
export const pushSubscriptions = pgTable("push_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  endpoint: text("endpoint"),
  p256dh: text("p256dh"),
  auth: text("auth"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Stripe Payment Integration
export const stripePlans = pgTable("stripe_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  stripePriceId: varchar("stripe_price_id").unique(),
  name: varchar("name"),
  description: text("description"),
  amountNGN: decimal("amount_ngn", { precision: 18, scale: 2 }),
  supTokens: integer("sup_tokens"), // How many SUP tokens this plan gives
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const stripePayments = pgTable("stripe_payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  stripePaymentIntentId: varchar("stripe_payment_intent_id").unique(),
  planId: varchar("plan_id").references(() => stripePlans.id),
  amountNGN: decimal("amount_ngn", { precision: 18, scale: 2 }),
  supTokensPurchased: integer("sup_tokens_purchased"),
  status: varchar("status").default('PENDING'), // PENDING, COMPLETED, FAILED, REFUNDED
  stripeStatus: varchar("stripe_status"), // From Stripe webhook
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Forum Media Uploads
export const forumMediaUploads = pgTable("forum_media_uploads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  threadId: varchar("thread_id").references(() => forumThreads.id),
  replyId: varchar("reply_id").references(() => forumReplies.id),
  fileName: varchar("file_name"),
  fileSize: integer("file_size"),
  fileType: varchar("file_type"), // image/jpeg, image/png, etc.
  fileUrl: text("file_url"),
  isApproved: boolean("is_approved").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// #13kCredibleChallenge Schema

// Challenge candidate stages
export const challengeStageEnum = pgEnum('challenge_stage', [
  'NOMINATED', 'VETTING', 'SHORTLISTED', 'PUBLIC_SELECTION', 'TRAINING', 'DEPLOYED', 'REJECTED'
]);

// Challenge candidates table
export const challengeCandidates = pgTable("challenge_candidates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id), // The candidate
  nominatedByUserId: varchar("nominated_by_user_id").references(() => users.id), // Who nominated them
  currentStage: challengeStageEnum("current_stage").default('NOMINATED'),
  credibilityScore: integer("credibility_score").default(0), // 0-100 based on integrity, competence, commitment
  applicationStatement: text("application_statement"), // Personal statement/video
  lgaTarget: varchar("lga_target"), // LGA they want to serve
  stateTarget: varchar("state_target"), // State they want to serve
  targetRole: varchar("target_role"), // councillor, chairman, accountability_cell_leader, etc.
  
  // Credibility factors
  integrityScore: integer("integrity_score").default(0), // 0-100
  competenceScore: integer("competence_score").default(0), // 0-100
  commitmentScore: integer("commitment_score").default(0), // 0-100
  
  // Vetting data
  backgroundCheckStatus: varchar("background_check_status").default('PENDING'), // PENDING, PASSED, FAILED
  backgroundCheckNotes: text("background_check_notes"),
  peerEndorsementCount: integer("peer_endorsement_count").default(0),
  communityEndorsementCount: integer("community_endorsement_count").default(0),
  
  // Public selection data
  publicVotesReceived: integer("public_votes_received").default(0),
  supVotesReceived: decimal("sup_votes_received", { precision: 18, scale: 2 }).default('0'),
  publicSelectionRank: integer("public_selection_rank"),
  
  // Training data
  trainingStartedAt: timestamp("training_started_at"),
  trainingCompletedAt: timestamp("training_completed_at"),
  trainingScore: integer("training_score"), // 0-100
  certificationUrl: text("certification_url"),
  
  // Deployment data
  deployedAt: timestamp("deployed_at"),
  deploymentRole: varchar("deployment_role"),
  accountabilityCellId: varchar("accountability_cell_id"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Challenge nominations (separate from candidates for tracking multiple nominations)
export const challengeNominations = pgTable("challenge_nominations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  candidateId: varchar("candidate_id").references(() => challengeCandidates.id),
  nominatorUserId: varchar("nominator_user_id").references(() => users.id),
  reason: text("reason"), // Why they nominated this person
  supReward: decimal("sup_reward", { precision: 18, scale: 2 }).default('0'), // Reward for valid nomination
  createdAt: timestamp("created_at").defaultNow(),
});

// Peer endorsements
export const challengeEndorsements = pgTable("challenge_endorsements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  candidateId: varchar("candidate_id").references(() => challengeCandidates.id),
  endorserUserId: varchar("endorser_user_id").references(() => users.id),
  endorsementType: varchar("endorsement_type").default('PEER'), // PEER, COMMUNITY_LEADER, PROFESSIONAL
  message: text("message"),
  verified: boolean("verified").default(false), // Admin verified the endorsement
  createdAt: timestamp("created_at").defaultNow(),
});

// Public selection voting
export const challengeVotes = pgTable("challenge_votes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  candidateId: varchar("candidate_id").references(() => challengeCandidates.id),
  voterUserId: varchar("voter_user_id").references(() => users.id),
  supAmount: decimal("sup_amount", { precision: 18, scale: 2 }).default('1'), // SUP spent on vote
  votingRound: varchar("voting_round").default('PRIMARY'), // PRIMARY, FINAL
  createdAt: timestamp("created_at").defaultNow(),
});

// Accountability cells (groups of citizens monitoring deployed leaders)
export const accountabilityCells = pgTable("accountability_cells", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name"), // e.g., "Surulere LGA Accountability Cell"
  lga: varchar("lga"),
  state: varchar("state"),
  description: text("description"),
  leaderUserId: varchar("leader_user_id").references(() => users.id), // Cell leader
  memberCount: integer("member_count").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Accountability cell memberships
export const accountabilityCellMembers = pgTable("accountability_cell_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cellId: varchar("cell_id").references(() => accountabilityCells.id),
  userId: varchar("user_id").references(() => users.id),
  role: varchar("role").default('MEMBER'), // MEMBER, LEADER, MODERATOR
  joinedAt: timestamp("joined_at").defaultNow(),
});

// Accountability reports (citizens reporting on deployed leaders)
export const accountabilityReports = pgTable("accountability_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  candidateId: varchar("candidate_id").references(() => challengeCandidates.id), // The deployed leader being reported on
  reporterUserId: varchar("reporter_user_id").references(() => users.id),
  cellId: varchar("cell_id").references(() => accountabilityCells.id),
  reportType: varchar("report_type"), // PERFORMANCE, PROJECT_UPDATE, MISCONDUCT, ACHIEVEMENT
  title: text("title"),
  description: text("description"),
  evidenceUrls: jsonb("evidence_urls").default('[]'), // Photos, documents, videos
  supReward: decimal("sup_reward", { precision: 18, scale: 2 }).default('0'), // Reward for valid report
  verified: boolean("verified").default(false),
  verifiedBy: varchar("verified_by").references(() => users.id),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Challenge progress tracking (overall metrics)
export const challengeProgress = pgTable("challenge_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  totalCandidates: integer("total_candidates").default(0),
  candidatesInVetting: integer("candidates_in_vetting").default(0),
  candidatesShortlisted: integer("candidates_shortlisted").default(0),
  candidatesInTraining: integer("candidates_in_training").default(0),
  candidatesDeployed: integer("candidates_deployed").default(0),
  lgasCovered: integer("lgas_covered").default(0), // How many of 774 LGAs have candidates
  statesCovered: integer("states_covered").default(0), // How many of 36 states + FCT
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Challenge training modules
export const challengeTrainingModules = pgTable("challenge_training_modules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title"),
  description: text("description"),
  content: text("content"), // Training content/curriculum
  videoUrl: text("video_url"),
  duration: integer("duration"), // minutes
  sequence: integer("sequence"), // order in curriculum
  isRequired: boolean("is_required").default(true),
  rewardSUP: decimal("reward_sup", { precision: 18, scale: 2 }).default('0'), // SUP for completion
  createdAt: timestamp("created_at").defaultNow(),
});

// Challenge training progress
export const challengeTrainingProgress = pgTable("challenge_training_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  candidateId: varchar("candidate_id").references(() => challengeCandidates.id),
  moduleId: varchar("module_id").references(() => challengeTrainingModules.id),
  status: varchar("status").default('NOT_STARTED'), // NOT_STARTED, IN_PROGRESS, COMPLETED
  score: integer("score"), // 0-100
  completedAt: timestamp("completed_at"),
  supEarned: decimal("sup_earned", { precision: 18, scale: 2 }).default('0'),
  createdAt: timestamp("created_at").defaultNow(),
});

// New types for treasury management
export type SecurityAlert = typeof securityAlerts.$inferSelect;
export type InsertSecurityAlert = typeof securityAlerts.$inferInsert;
export type SystemSetting = typeof systemSettings.$inferSelect;
export type InsertSystemSetting = typeof systemSettings.$inferInsert;

// Challenge types
export type ChallengeCandidate = typeof challengeCandidates.$inferSelect;
export type InsertChallengeCandidate = typeof challengeCandidates.$inferInsert;
export type ChallengeNomination = typeof challengeNominations.$inferSelect;
export type InsertChallengeNomination = typeof challengeNominations.$inferInsert;
export type ChallengeEndorsement = typeof challengeEndorsements.$inferSelect;
export type InsertChallengeEndorsement = typeof challengeEndorsements.$inferInsert;
export type ChallengeVote = typeof challengeVotes.$inferSelect;
export type InsertChallengeVote = typeof challengeVotes.$inferInsert;
export type AccountabilityCell = typeof accountabilityCells.$inferSelect;
export type InsertAccountabilityCell = typeof accountabilityCells.$inferInsert;
export type AccountabilityReport = typeof accountabilityReports.$inferSelect;
export type InsertAccountabilityReport = typeof accountabilityReports.$inferInsert;
export type ChallengeProgress = typeof challengeProgress.$inferSelect;
export type InsertChallengeProgress = typeof challengeProgress.$inferInsert;
export type ChallengeTrainingModule = typeof challengeTrainingModules.$inferSelect;
export type ChallengeTrainingProgress = typeof challengeTrainingProgress.$inferSelect;

// Leader Networking Tables
export const leaderConnections = pgTable("leader_connections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  requesterUserId: varchar("requester_user_id").notNull().references(() => users.id),
  recipientUserId: varchar("recipient_user_id").notNull().references(() => users.id),
  status: varchar("status").notNull().default("PENDING"), // PENDING, ACCEPTED, DECLINED, BLOCKED
  connectionType: varchar("connection_type").notNull().default("PROFESSIONAL"), // PROFESSIONAL, MENTORSHIP, COLLABORATION
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow(),
  respondedAt: timestamp("responded_at"),
});

export const leaderConversations = pgTable("leader_conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  connectionId: varchar("connection_id").notNull().references(() => leaderConnections.id),
  senderUserId: varchar("sender_user_id").notNull().references(() => users.id),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Regional Groups for collaboration
export const regionalGroups = pgTable("regional_groups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  state: varchar("state").notNull(),
  lga: varchar("lga"),
  type: varchar("type").notNull().default("STATE_CHAPTER"), // STATE_CHAPTER, LGA_CHAPTER, SPECIAL_INTEREST
  leaderUserId: varchar("leader_user_id").references(() => users.id),
  memberCount: integer("member_count").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const regionalGroupMembers = pgTable("regional_group_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  groupId: varchar("group_id").notNull().references(() => regionalGroups.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  role: varchar("role").notNull().default("MEMBER"), // LEADER, COORDINATOR, MEMBER
  joinedAt: timestamp("joined_at").defaultNow(),
});

// Community Discussion Forum Tables - using forumThreads instead of forumPosts
export const forumThreads = pgTable("forum_threads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  categoryId: varchar("category_id").notNull().references(() => forumCategories.id),
  authorUserId: varchar("author_user_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  content: text("content").notNull(),
  isPinned: boolean("is_pinned").default(false),
  isLocked: boolean("is_locked").default(false),
  viewCount: integer("view_count").default(0),
  replyCount: integer("reply_count").default(0),
  lastReplyAt: timestamp("last_reply_at"),
  lastReplyUserId: varchar("last_reply_user_id").references(() => users.id),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Enhanced Verification System
export const candidateEndorsements = pgTable("candidate_endorsements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  candidateId: varchar("candidate_id").notNull().references(() => challengeCandidates.id),
  endorserUserId: varchar("endorser_user_id").notNull().references(() => users.id),
  endorsementType: varchar("endorsement_type").notNull().default("CITIZEN"), // CITIZEN, ORGANIZATION, COMMUNITY_LEADER
  organizationName: varchar("organization_name"),
  position: varchar("position"),
  testimonial: text("testimonial"),
  verificationStatus: varchar("verification_status").default("PENDING"), // PENDING, VERIFIED, REJECTED
  supReward: decimal("sup_reward", { precision: 18, scale: 2 }).default('2'),
  createdAt: timestamp("created_at").defaultNow(),
});

export const achievementBadges = pgTable("achievement_badges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  iconUrl: varchar("icon_url"),
  badgeColor: varchar("badge_color").default("#059669"),
  criteria: text("criteria"), // JSON describing requirements
  supReward: decimal("sup_reward", { precision: 18, scale: 2 }).default('10'),
  category: varchar("category").default("ENGAGEMENT"), // ENGAGEMENT, LEADERSHIP, VERIFICATION, NETWORKING
  rarity: varchar("rarity").default("COMMON"), // COMMON, RARE, EPIC, LEGENDARY
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userAchievements = pgTable("user_achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  badgeId: varchar("badge_id").notNull().references(() => achievementBadges.id),
  earnedAt: timestamp("earned_at").defaultNow(),
  supEarned: decimal("sup_earned", { precision: 18, scale: 2 }).default('0'),
  notes: text("notes"), // Additional context about earning the badge
});

// Events and Meetups System
export const networkingEvents = pgTable("networking_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  organizerUserId: varchar("organizer_user_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  eventType: varchar("event_type").notNull().default("NETWORKING"), // NETWORKING, TRAINING, TOWNHALL, WORKSHOP, CLEANUP
  venue: varchar("venue"),
  state: varchar("state").notNull(),
  lga: varchar("lga"),
  isVirtual: boolean("is_virtual").default(false),
  virtualLink: varchar("virtual_link"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  maxAttendees: integer("max_attendees"),
  attendeeCount: integer("attendee_count").default(0),
  registrationDeadline: timestamp("registration_deadline"),
  status: varchar("status").default("UPCOMING"), // UPCOMING, ONGOING, COMPLETED, CANCELLED
  tags: text("tags").array(),
  supReward: decimal("sup_reward", { precision: 18, scale: 2 }).default('5'), // For attending
  createdAt: timestamp("created_at").defaultNow(),
});

export const eventRegistrations = pgTable("event_registrations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").notNull().references(() => networkingEvents.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  status: varchar("status").default("REGISTERED"), // REGISTERED, ATTENDED, NO_SHOW
  registeredAt: timestamp("registered_at").defaultNow(),
  attendedAt: timestamp("attended_at"),
  feedback: text("feedback"),
  rating: integer("rating"), // 1-5 stars
});

// Mentorship System
export const mentorshipPrograms = pgTable("mentorship_programs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  focusArea: varchar("focus_area").notNull(), // LEADERSHIP, GOVERNANCE, CAMPAIGN_MANAGEMENT, POLICY_DEVELOPMENT
  duration: integer("duration"), // weeks
  maxMentees: integer("max_mentees").default(5),
  supReward: decimal("sup_reward", { precision: 18, scale: 2 }).default('25'), // For completion
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const mentorshipMatches = pgTable("mentorship_matches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  programId: varchar("program_id").notNull().references(() => mentorshipPrograms.id),
  mentorUserId: varchar("mentor_user_id").notNull().references(() => users.id),
  menteeUserId: varchar("mentee_user_id").notNull().references(() => users.id),
  status: varchar("status").default("PENDING"), // PENDING, ACTIVE, COMPLETED, PAUSED, TERMINATED
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  goals: text("goals"),
  progress: text("progress"), // JSON tracking milestones
  mentorRating: integer("mentor_rating"), // 1-5 stars from mentee
  menteeRating: integer("mentor_rating"), // 1-5 stars from mentor
  createdAt: timestamp("created_at").defaultNow(),
});

// Enhanced Progress Tracking
export const progressMilestones = pgTable("progress_milestones", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  targetNumber: integer("target_number").notNull(), // e.g., 1000 for "1000 candidates"
  currentNumber: integer("current_number").default(0),
  category: varchar("category").notNull(), // CANDIDATES, ENDORSEMENTS, CONNECTIONS, EVENTS
  state: varchar("state"), // For state-specific milestones
  isNational: boolean("is_national").default(false),
  celebrationMessage: text("celebration_message"),
  rewardSUP: decimal("reward_sup", { precision: 18, scale: 2 }).default('0'),
  achievedAt: timestamp("achieved_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User Counter and Milestones System
export const userMilestones = pgTable("user_milestones", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  milestoneNumber: integer("milestone_number").notNull(), // 100, 1000, 10000, 100000, 1000000
  title: varchar("title").notNull(), // "First 100 Citizens", "Path to 1 Million"
  description: text("description").notNull(),
  rewardSUP: decimal("reward_sup", { precision: 18, scale: 2 }).default('0'),
  specialBadge: varchar("special_badge"), // Special recognition for milestone users
  celebrationMessage: text("celebration_message"),
  achievedAt: timestamp("achieved_at"),
  isRepeating: boolean("is_repeating").default(false), // For milestones like "every 10,000 users"
  createdAt: timestamp("created_at").defaultNow(),
});

// User citizenship tracking and live counter
export const citizenshipStats = pgTable("citizenship_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  totalUsers: integer("total_users").default(0),
  targetUsers: integer("target_users").default(1000000), // Goal: 1M users
  credibleCitizens: integer("credible_citizens").default(0),
  activeCommunities: integer("active_communities").default(0),
  lastMilestoneReached: integer("last_milestone_reached").default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Enhanced Candidate Q&A System
export const candidateQuestions = pgTable("candidate_questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  candidateId: varchar("candidate_id").notNull().references(() => challengeCandidates.id),
  askerUserId: varchar("asker_user_id").notNull().references(() => users.id),
  question: text("question").notNull(),
  isPublic: boolean("is_public").default(true),
  category: varchar("category").default("GENERAL"), // GENERAL, POLICY, EXPERIENCE, VISION
  upvotes: integer("upvotes").default(0),
  status: varchar("status").default("PENDING"), // PENDING, ANSWERED, ARCHIVED
  createdAt: timestamp("created_at").defaultNow(),
});

export const candidateAnswers = pgTable("candidate_answers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  questionId: varchar("question_id").notNull().references(() => candidateQuestions.id),
  candidateUserId: varchar("candidate_user_id").notNull().references(() => users.id),
  answer: text("answer").notNull(),
  isVerified: boolean("is_verified").default(true), // Verified as from actual candidate
  upvotes: integer("upvotes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Type exports for new features (removing duplicates)
export type ForumThread = typeof forumThreads.$inferSelect;
export type InsertForumThread = typeof forumThreads.$inferInsert;
export type CandidateEndorsement = typeof candidateEndorsements.$inferSelect;
export type InsertCandidateEndorsement = typeof candidateEndorsements.$inferInsert;
export type AchievementBadge = typeof achievementBadges.$inferSelect;
export type InsertAchievementBadge = typeof achievementBadges.$inferInsert;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = typeof userAchievements.$inferInsert;
export type NetworkingEvent = typeof networkingEvents.$inferSelect;
export type InsertNetworkingEvent = typeof networkingEvents.$inferInsert;
export type EventRegistration = typeof eventRegistrations.$inferSelect;
export type InsertEventRegistration = typeof eventRegistrations.$inferInsert;
export type MentorshipProgram = typeof mentorshipPrograms.$inferSelect;
export type InsertMentorshipProgram = typeof mentorshipPrograms.$inferInsert;
export type MentorshipMatch = typeof mentorshipMatches.$inferSelect;
export type InsertMentorshipMatch = typeof mentorshipMatches.$inferInsert;
export type ProgressMilestone = typeof progressMilestones.$inferSelect;
export type InsertProgressMilestone = typeof progressMilestones.$inferInsert;
export type UserMilestone = typeof userMilestones.$inferSelect;
export type InsertUserMilestone = typeof userMilestones.$inferInsert;
export type CitizenshipStats = typeof citizenshipStats.$inferSelect;
export type InsertCitizenshipStats = typeof citizenshipStats.$inferInsert;
export type CandidateQuestion = typeof candidateQuestions.$inferSelect;
export type InsertCandidateQuestion = typeof candidateQuestions.$inferInsert;
export type CandidateAnswer = typeof candidateAnswers.$inferSelect;
export type InsertCandidateAnswer = typeof candidateAnswers.$inferInsert;

// Type exports for networking
export type LeaderConnection = typeof leaderConnections.$inferSelect;
export type InsertLeaderConnection = typeof leaderConnections.$inferInsert;
export type LeaderConversation = typeof leaderConversations.$inferSelect;
export type InsertLeaderConversation = typeof leaderConversations.$inferInsert;
export type RegionalGroup = typeof regionalGroups.$inferSelect;
export type InsertRegionalGroup = typeof regionalGroups.$inferInsert;
export type RegionalGroupMember = typeof regionalGroupMembers.$inferSelect;
export type InsertRegionalGroupMember = typeof regionalGroupMembers.$inferInsert;

// INSERT SCHEMAS FOR NEW TABLES - AFTER ALL TABLE DEFINITIONS
export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
  readAt: true,
});

export const insertMessageGroupSchema = createInsertSchema(messageGroups).omit({
  id: true,
  createdAt: true,
});

export const insertTrainingModuleSchema = createInsertSchema(trainingModules).omit({
  id: true,
  createdAt: true,
});

export const insertUserTrainingProgressSchema = createInsertSchema(userTrainingProgress).omit({
  id: true,
  startedAt: true,
  completedAt: true,
});

export const insertStripePaymentSchema = createInsertSchema(stripePayments).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertForumMediaUploadSchema = createInsertSchema(forumMediaUploads).omit({
  id: true,
  createdAt: true,
});

// ALL RELATIONS - DEFINED AT THE END AFTER ALL TABLES
export const usersRelations = relations(users, ({ one, many }) => ({
  wallet: one(wallets, {
    fields: [users.id],
    references: [wallets.userId],
  }),
  transactions: many(transactions),
  entries: many(entries),
  prizes: many(prizes),
  projects: many(projects),
  votes: many(votes),
  engagementEvents: many(engagementEvents),
  kycDocuments: many(kycDocuments),
  notifications: many(notifications),
  messages: many(messages),
  sentMessages: many(messages),
  trainingProgress: many(userTrainingProgress),
  stripePayments: many(stripePayments),
}));

export const walletsRelations = relations(wallets, ({ one }) => ({
  user: one(users, {
    fields: [wallets.userId],
    references: [users.id],
  }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
}));

export const roundsRelations = relations(rounds, ({ many }) => ({
  entries: many(entries),
  prizes: many(prizes),
}));

export const entriesRelations = relations(entries, ({ one }) => ({
  round: one(rounds, {
    fields: [entries.roundId],
    references: [rounds.id],
  }),
  user: one(users, {
    fields: [entries.userId],
    references: [users.id],
  }),
}));

export const prizesRelations = relations(prizes, ({ one }) => ({
  round: one(rounds, {
    fields: [prizes.roundId],
    references: [rounds.id],
  }),
  user: one(users, {
    fields: [prizes.userId],
    references: [users.id],
  }),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  owner: one(users, {
    fields: [projects.ownerUserId],
    references: [users.id],
  }),
  votes: many(votes),
  receipts: many(receipts),
}));

export const votesRelations = relations(votes, ({ one }) => ({
  project: one(projects, {
    fields: [votes.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [votes.userId],
    references: [users.id],
  }),
}));

export const engagementTasksRelations = relations(engagementTasks, ({ many }) => ({
  events: many(engagementEvents),
}));

export const engagementEventsRelations = relations(engagementEvents, ({ one }) => ({
  user: one(users, {
    fields: [engagementEvents.userId],
    references: [users.id],
  }),
  task: one(engagementTasks, {
    fields: [engagementEvents.taskId],
    references: [engagementTasks.id],
  }),
}));

export const kycDocumentsRelations = relations(kycDocuments, ({ one }) => ({
  user: one(users, {
    fields: [kycDocuments.userId],
    references: [users.id],
  }),
  reviewer: one(users, {
    fields: [kycDocuments.reviewedBy],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const nigerianLgasRelations = relations(nigerianLgas, ({ one }) => ({
  state: one(nigerianStates, {
    fields: [nigerianLgas.stateId],
    references: [nigerianStates.id],
  }),
}));

export const nigerianStatesRelations = relations(nigerianStates, ({ many }) => ({
  lgas: many(nigerianLgas),
}));

// NEW FEATURE RELATIONS
export const messagesRelations = relations(messages, ({ one }) => ({
  fromUser: one(users, {
    fields: [messages.fromUserId],
    references: [users.id],
  }),
  toUser: one(users, {
    fields: [messages.toUserId],
    references: [users.id],
  }),
  group: one(messageGroups, {
    fields: [messages.groupId],
    references: [messageGroups.id],
  }),
}));

export const messageGroupsRelations = relations(messageGroups, ({ one, many }) => ({
  owner: one(users, {
    fields: [messageGroups.ownerId],
    references: [users.id],
  }),
  members: many(messageGroupMembers),
  messages: many(messages),
}));

export const messageGroupMembersRelations = relations(messageGroupMembers, ({ one }) => ({
  group: one(messageGroups, {
    fields: [messageGroupMembers.groupId],
    references: [messageGroups.id],
  }),
  user: one(users, {
    fields: [messageGroupMembers.userId],
    references: [users.id],
  }),
}));

export const trainingModulesRelations = relations(trainingModules, ({ one, many }) => ({
  prerequisite: one(trainingModules, {
    fields: [trainingModules.prerequisiteModuleId],
    references: [trainingModules.id],
  }),
  progress: many(userTrainingProgress),
  quizzes: many(trainingQuizzes),
}));

export const userTrainingProgressRelations = relations(userTrainingProgress, ({ one }) => ({
  user: one(users, {
    fields: [userTrainingProgress.userId],
    references: [users.id],
  }),
  module: one(trainingModules, {
    fields: [userTrainingProgress.moduleId],
    references: [trainingModules.id],
  }),
}));

export const trainingQuizzesRelations = relations(trainingQuizzes, ({ one, many }) => ({
  module: one(trainingModules, {
    fields: [trainingQuizzes.moduleId],
    references: [trainingModules.id],
  }),
  answers: many(userQuizAnswers),
}));

export const stripePaymentsRelations = relations(stripePayments, ({ one }) => ({
  user: one(users, {
    fields: [stripePayments.userId],
    references: [users.id],
  }),
  plan: one(stripePlans, {
    fields: [stripePayments.planId],
    references: [stripePlans.id],
  }),
}));

export const forumCategoriesRelations = relations(forumCategories, ({ many }) => ({
  threads: many(forumThreads),
}));

export const forumThreadsRelations = relations(forumThreads, ({ one, many }) => ({
  category: one(forumCategories, {
    fields: [forumThreads.categoryId],
    references: [forumCategories.id],
  }),
  author: one(users, {
    fields: [forumThreads.authorUserId],
    references: [users.id],
  }),
  replies: many(forumReplies),
}));

export const forumRepliesRelations = relations(forumReplies, ({ one }) => ({
  thread: one(forumThreads, {
    fields: [forumReplies.threadId],
    references: [forumThreads.id],
  }),
  author: one(users, {
    fields: [forumReplies.authorUserId],
    references: [users.id],
  }),
  parent: one(forumReplies, {
    fields: [forumReplies.parentReplyId],
    references: [forumReplies.id],
  }),
}));

// Donation system relations
export const donationsRelations = relations(donations, ({ one }) => ({
  project: one(projects, {
    fields: [donations.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [donations.userId],
    references: [users.id],
  }),
}));

export const projectUpdatesRelations = relations(projectUpdates, ({ one }) => ({
  project: one(projects, {
    fields: [projectUpdates.projectId],
    references: [projects.id],
  }),
  author: one(users, {
    fields: [projectUpdates.authorId],
    references: [users.id],
  }),
}));


// TypeScript types for donation system
export type Donation = typeof donations.$inferSelect;
export type InsertDonation = typeof donations.$inferInsert;
export type ProjectUpdate = typeof projectUpdates.$inferSelect;
export type InsertProjectUpdate = typeof projectUpdates.$inferInsert;


// Password reset types
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type InsertPasswordResetToken = typeof passwordResetTokens.$inferInsert;

// Donation insert schemas
export const insertDonationSchema = createInsertSchema(donations);
export const insertProjectUpdateSchema = createInsertSchema(projectUpdates);

// === CAMPUS COMMUNITY SYSTEM ===

// Institution types for targeting different educational sectors
export const institutionTypeEnum = pgEnum('institution_type', [
  'UNIVERSITY', 'POLYTECHNIC', 'COLLEGE_OF_EDUCATION', 'MONOTECHNIC', 
  'FEDERAL_UNIVERSITY', 'STATE_UNIVERSITY', 'PRIVATE_UNIVERSITY',
  'NYSC_CAMP', 'SECONDARY_SCHOOL', 'TEACHER_TRAINING_COLLEGE'
]);

// Institution ranking tiers for top schools targeting
export const institutionRankEnum = pgEnum('institution_rank', [
  'TOP_TIER', 'FIRST_CLASS', 'SECOND_CLASS', 'THIRD_CLASS', 'DEVELOPING'
]);

// Leadership positions in campus communities
export const leadershipPositionEnum = pgEnum('leadership_position', [
  'PRESIDENT', 'VICE_PRESIDENT', 'SECRETARY_GENERAL', 'TREASURER',
  'STUDENT_UNION_PRESIDENT', 'FACULTY_PRESIDENT', 'DEPARTMENT_PRESIDENT',
  'NYSC_CAMP_GOVERNOR', 'NYSC_LOCAL_INSPECTOR', 'NYSC_PLATOON_LEADER',
  'ACADEMIC_BOARD_REP', 'HOSTEL_GOVERNOR', 'SPORTS_DIRECTOR'
]);

// Institutions table - universities, colleges, NYSC camps
export const institutions = pgTable("institutions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  shortName: varchar("short_name"), // UI, UNIBEN, etc.
  type: institutionTypeEnum("type").notNull(),
  rank: institutionRankEnum("rank").default('DEVELOPING'),
  state: varchar("state").notNull(),
  lga: varchar("lga").notNull(),
  city: varchar("city"),
  establishedYear: integer("established_year"),
  studentPopulation: integer("student_population"),
  isActive: boolean("is_active").default(true),
  logoUrl: text("logo_url"),
  website: text("website"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Campus communities within institutions (faculties, departments, NYSC platoons)
export const campusCommunities = pgTable("campus_communities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  institutionId: varchar("institution_id").references(() => institutions.id).notNull(),
  name: text("name").notNull(),
  type: varchar("type").notNull(), // 'FACULTY', 'DEPARTMENT', 'SOCIETY', 'NYSC_PLATOON'
  memberCount: integer("member_count").default(0),
  leaderUserId: varchar("leader_user_id").references(() => users.id),
  isActive: boolean("is_active").default(true),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User memberships in institutions and communities
export const institutionMemberships = pgTable("institution_memberships", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  institutionId: varchar("institution_id").references(() => institutions.id).notNull(),
  communityId: varchar("community_id").references(() => campusCommunities.id),
  position: leadershipPositionEnum("position"),
  studentId: varchar("student_id"), // Matriculation number
  graduationYear: integer("graduation_year"),
  isVerified: boolean("is_verified").default(false),
  verifiedAt: timestamp("verified_at"),
  verifiedBy: varchar("verified_by").references(() => users.id),
  joinedAt: timestamp("joined_at").defaultNow(),
});

// Campus-specific projects extending the main projects table
export const campusProjects = pgTable("campus_projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id).notNull(),
  institutionId: varchar("institution_id").references(() => institutions.id),
  communityId: varchar("community_id").references(() => campusCommunities.id),
  targetAudience: varchar("target_audience"), // 'STUDENTS', 'NYSC_CORPS', 'FACULTY', 'ALL'
  requiresStudentId: boolean("requires_student_id").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// NYSC-specific features
export const nyscCampActivities = pgTable("nysc_camp_activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  campId: varchar("camp_id").references(() => institutions.id).notNull(),
  activityType: varchar("activity_type").notNull(), // 'CDS', 'SKILLS_TRAINING', 'ORIENTATION'
  title: text("title").notNull(),
  description: text("description"),
  rewardSUP: decimal("reward_sup", { precision: 18, scale: 2 }).default('0'),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Institution rankings and recognition system
export const institutionRankings = pgTable("institution_rankings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  institutionId: varchar("institution_id").references(() => institutions.id).notNull(),
  rankingYear: integer("ranking_year").notNull(),
  category: varchar("category").notNull(), // 'OVERALL', 'ENGINEERING', 'MEDICINE', etc.
  nationalRank: integer("national_rank"),
  score: decimal("score", { precision: 5, scale: 2 }),
  rankingBody: varchar("ranking_body"), // 'NUC', 'JAMB', 'TIMES_HIGHER_ED'
  isOfficial: boolean("is_official").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Campus community types
export type Institution = typeof institutions.$inferSelect;
export type CampusCommunity = typeof campusCommunities.$inferSelect;
export type InstitutionMembership = typeof institutionMemberships.$inferSelect;
export type CampusProject = typeof campusProjects.$inferSelect;
export type NyscCampActivity = typeof nyscCampActivities.$inferSelect;
export type InstitutionRanking = typeof institutionRankings.$inferSelect;

// Campus community insert schemas
export const insertInstitutionSchema = createInsertSchema(institutions);
export const insertCampusCommunitySchema = createInsertSchema(campusCommunities);
export const insertInstitutionMembershipSchema = createInsertSchema(institutionMemberships);
export const insertCampusProjectSchema = createInsertSchema(campusProjects);
export const insertNyscCampActivitySchema = createInsertSchema(nyscCampActivities);
export const insertInstitutionRankingSchema = createInsertSchema(institutionRankings);

// ================================
// VOLUNTEER AND CIVIC ENGAGEMENT SYSTEM
// ================================

// Volunteer Profiles and Skills
export const volunteerProfiles = pgTable("volunteer_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  availability: varchar("availability").notNull(), // WEEKENDS, EVENINGS, FLEXIBLE, FULL_TIME
  timeCommitment: varchar("time_commitment").notNull(), // 1-5_HOURS, 5-10_HOURS, 10-20_HOURS, 20+_HOURS per week
  transportationAccess: boolean("transportation_access").default(false),
  preferredActivities: text("preferred_activities").array(), // VOTER_REGISTRATION, COMMUNITY_OUTREACH, EVENT_ORGANIZATION, SOCIAL_MEDIA, DATA_COLLECTION, etc.
  skills: text("skills").array(), // COMMUNICATION, TECH_SAVVY, ORGANIZATION, LEADERSHIP, MARKETING, etc.
  languages: text("languages").array(), // ENGLISH, HAUSA, YORUBA, IGBO, etc.
  experience: text("experience"), // Previous volunteer/civic experience
  motivation: text("motivation"), // Why they want to volunteer
  emergencyContact: varchar("emergency_contact"),
  isBackgroundChecked: boolean("is_background_checked").default(false),
  onboardingCompleted: boolean("onboarding_completed").default(false),
  totalHoursVolunteered: integer("total_hours_volunteered").default(0),
  impactScore: integer("impact_score").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Real-World Activities and Projects
export const volunteerOpportunities = pgTable("volunteer_opportunities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  organizerId: varchar("organizer_id").notNull().references(() => users.id),
  type: varchar("type").notNull(), // VOTER_REGISTRATION, COMMUNITY_CLEANUP, AWARENESS_CAMPAIGN, ELECTION_MONITORING, etc.
  requiredSkills: text("required_skills").array(),
  location: varchar("location").notNull(),
  state: varchar("state").notNull(),
  lga: varchar("lga"),
  isRemote: boolean("is_remote").default(false),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  volunteersNeeded: integer("volunteers_needed").notNull(),
  volunteersAssigned: integer("volunteers_assigned").default(0),
  hoursPerVolunteer: integer("hours_per_volunteer").default(4),
  impactGoal: text("impact_goal"), // What real-world change this aims to achieve
  status: varchar("status").default("ACTIVE"), // ACTIVE, FULL, COMPLETED, CANCELLED
  priority: varchar("priority").default("MEDIUM"), // LOW, MEDIUM, HIGH, URGENT
  rewardSUP: varchar("reward_sup").default("0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Volunteer Assignments and Participation
export const volunteerAssignments = pgTable("volunteer_assignments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  opportunityId: varchar("opportunity_id").notNull().references(() => volunteerOpportunities.id),
  volunteerUserId: varchar("volunteer_user_id").notNull().references(() => users.id),
  assignedBy: varchar("assigned_by").notNull().references(() => users.id),
  status: varchar("status").default("ASSIGNED"), // ASSIGNED, CONFIRMED, IN_PROGRESS, COMPLETED, NO_SHOW, CANCELLED
  role: varchar("role"), // Team leader, coordinator, participant, etc.
  hoursCommitted: integer("hours_committed").default(0),
  hoursCompleted: integer("hours_completed").default(0),
  performanceRating: integer("performance_rating"), // 1-5 rating
  feedback: text("feedback"),
  impactAchieved: text("impact_achieved"), // Specific impact this volunteer contributed to
  assignedAt: timestamp("assigned_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Community Action Projects (Long-term initiatives)
export const communityProjects = pgTable("community_projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  leaderId: varchar("leader_id").notNull().references(() => users.id),
  category: varchar("category").notNull(), // EDUCATION, INFRASTRUCTURE, HEALTH, GOVERNANCE, ENVIRONMENT
  state: varchar("state").notNull(),
  lga: varchar("lga"),
  targetBeneficiaries: integer("target_beneficiaries"),
  volunteersNeeded: integer("volunteers_needed").notNull(),
  volunteersJoined: integer("volunteers_joined").default(0),
  budgetRequired: varchar("budget_required").default("0"),
  fundingGoal: varchar("funding_goal").default("0"),
  currentFunding: varchar("current_funding").default("0"),
  startDate: timestamp("start_date"),
  expectedEndDate: timestamp("expected_end_date"),
  actualEndDate: timestamp("actual_end_date"),
  status: varchar("status").default("PLANNING"), // PLANNING, RECRUITING, ACTIVE, COMPLETED, SUSPENDED
  impactMetrics: text("impact_metrics"), // How success will be measured
  actualImpact: text("actual_impact"), // Actual results achieved
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Mentorship System
export const mentorshipRequests = pgTable("mentorship_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  menteeId: varchar("mentee_id").notNull().references(() => users.id),
  mentorId: varchar("mentor_id").references(() => users.id),
  focusArea: varchar("focus_area").notNull(), // LEADERSHIP, CIVIC_ENGAGEMENT, CAREER, ENTREPRENEURSHIP, etc.
  goals: text("goals").notNull(), // What the mentee wants to achieve
  timeCommitment: varchar("time_commitment").notNull(), // Weekly time commitment expected
  duration: varchar("duration").notNull(), // 3_MONTHS, 6_MONTHS, 1_YEAR, ONGOING
  status: varchar("status").default("PENDING"), // PENDING, MATCHED, ACTIVE, COMPLETED, CANCELLED
  matchedAt: timestamp("matched_at"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  menteeRating: integer("mentee_rating"), // 1-5 rating of mentor
  mentorRating: integer("mentor_rating"), // 1-5 rating of mentee
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Impact Tracking and Real-World Activity Results
export const impactReports = pgTable("impact_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  opportunityId: varchar("opportunity_id").references(() => volunteerOpportunities.id),
  projectId: varchar("project_id").references(() => communityProjects.id),
  reportedBy: varchar("reported_by").notNull().references(() => users.id),
  participantsReached: integer("participants_reached"),
  materialsDistributed: integer("materials_distributed"),
  votersRegistered: integer("voters_registered"),
  communityMeetingsHeld: integer("community_meetings_held"),
  mediaReach: integer("media_reach"), // Social media impressions, news coverage
  fundingRaised: varchar("funding_raised").default("0"),
  policiesInfluenced: text("policies_influenced"), // Any policy changes achieved
  followUpActions: text("follow_up_actions"), // Next steps planned
  challengesFaced: text("challenges_faced"),
  lessonsLearned: text("lessons_learned"),
  evidenceLinks: text("evidence_links").array(), // Photos, videos, documents proving impact
  verifiedImpact: boolean("verified_impact").default(false),
  verifiedBy: varchar("verified_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Volunteer type definitions
export type VolunteerProfile = typeof volunteerProfiles.$inferSelect;
export type InsertVolunteerProfile = typeof volunteerProfiles.$inferInsert;
export type VolunteerOpportunity = typeof volunteerOpportunities.$inferSelect;
export type InsertVolunteerOpportunity = typeof volunteerOpportunities.$inferInsert;
export type VolunteerAssignment = typeof volunteerAssignments.$inferSelect;
export type InsertVolunteerAssignment = typeof volunteerAssignments.$inferInsert;
export type CommunityProject = typeof communityProjects.$inferSelect;
export type InsertCommunityProject = typeof communityProjects.$inferInsert;
export type MentorshipRequest = typeof mentorshipRequests.$inferSelect;
export type InsertMentorshipRequest = typeof mentorshipRequests.$inferInsert;
export type ImpactReport = typeof impactReports.$inferSelect;
export type InsertImpactReport = typeof impactReports.$inferInsert;

// Digital Petition System
export const petitions = pgTable("petitions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  targetAudience: varchar("target_audience", { length: 100 }).notNull(), // "Federal Government", "State Government", "LGA", "Institution"
  targetInstitution: varchar("target_institution", { length: 100 }), // Specific institution name
  category: varchar("category", { length: 50 }).notNull(), // "Governance", "Infrastructure", "Health", "Education", etc.
  state: varchar("state", { length: 50 }),
  lga: varchar("lga", { length: 100 }),
  createdBy: varchar("created_by").references(() => users.id).notNull(),
  signatureGoal: integer("signature_goal").notNull().default(1000),
  currentSignatures: integer("current_signatures").default(0),
  status: varchar("status", { length: 20 }).default("active"), // active, closed, successful, rejected
  isVerified: boolean("is_verified").default(false), // Verified by admins
  verifiedBy: varchar("verified_by").references(() => users.id),
  verificationNote: text("verification_note"),
  submittedToAuthority: boolean("submitted_to_authority").default(false),
  submissionDate: timestamp("submission_date"),
  responseReceived: boolean("response_received").default(false),
  authorityResponse: text("authority_response"),
  responseDate: timestamp("response_date"),
  deadlineDate: timestamp("deadline_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const petitionSignatures = pgTable("petition_signatures", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  petitionId: varchar("petition_id").references(() => petitions.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  firstName: varchar("first_name", { length: 50 }).notNull(),
  lastName: varchar("last_name", { length: 50 }).notNull(),
  email: varchar("email", { length: 100 }),
  phone: varchar("phone", { length: 20 }),
  state: varchar("state", { length: 50 }),
  lga: varchar("lga", { length: 100 }),
  isVerified: boolean("is_verified").default(false), // Phone or email verification
  comment: text("comment"), // Optional comment from signer
  signedAt: timestamp("signed_at").defaultNow(),
}, (table) => ({
  // Ensure one signature per user per petition
  uniqueSignature: index("unique_petition_signature").on(table.petitionId, table.userId),
}));

export const petitionUpdates = pgTable("petition_updates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  petitionId: varchar("petition_id").references(() => petitions.id).notNull(),
  title: varchar("title", { length: 150 }).notNull(),
  content: text("content").notNull(),
  updateType: varchar("update_type", { length: 30 }).notNull(), // progress, milestone, response, closure
  createdBy: varchar("created_by").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Petition type exports
export type Petition = typeof petitions.$inferSelect;
export type InsertPetition = typeof petitions.$inferInsert;
export type PetitionSignature = typeof petitionSignatures.$inferSelect;
export type InsertPetitionSignature = typeof petitionSignatures.$inferInsert;
export type PetitionUpdate = typeof petitionUpdates.$inferSelect;
export type InsertPetitionUpdate = typeof petitionUpdates.$inferInsert;

// Additional audit actions for enhanced logging
export const extendedAuditActionEnum = pgEnum('extended_audit_action', [
  'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'PROMOTE_ADMIN', 'EMERGENCY_FREEZE',
  'TOKEN_CREATION', 'MANUAL_TRANSACTION', 'KYC_APPROVAL', 'KYC_REJECTION', 'USER_BAN', 'USER_UNBAN',
  '2FA_ENABLED', '2FA_DISABLED', 'SESSION_TIMEOUT', 'SUSPICIOUS_ACTIVITY'
]);

// User Analytics and Engagement Tracking
export const userAnalytics = pgTable("user_analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  date: timestamp("date").defaultNow(),
  pageViews: integer("page_views").default(0),
  tasksCompleted: integer("tasks_completed").default(0),
  projectsViewed: integer("projects_viewed").default(0),
  votesPlaced: integer("votes_placed").default(0),
  timeSpentMinutes: integer("time_spent_minutes").default(0),
  sessionsCount: integer("sessions_count").default(0),
  deviceType: varchar("device_type"), // mobile, desktop, tablet
  createdAt: timestamp("created_at").defaultNow(),
});

// Session Management for Security
export const activeSessions = pgTable("active_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  sessionToken: varchar("session_token").notNull().unique(),
  deviceInfo: jsonb("device_info").default('{}'),
  ipAddress: varchar("ip_address"),
  lastActivity: timestamp("last_activity").defaultNow(),
  isActive: boolean("is_active").default(true),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Enhanced Task System with Challenges
export const taskChallengeEnum = pgEnum('task_challenge', [
  'DAILY', 'WEEKLY', 'MONTHLY', 'SPECIAL_EVENT', 'MILESTONE'
]);

export const enhancedTasks = pgTable("enhanced_tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category").notNull(), // civic, social, educational, community
  challengeType: taskChallengeEnum("challenge_type").default('DAILY'),
  supReward: integer("sup_reward").default(0),
  experiencePoints: integer("experience_points").default(0),
  difficultyLevel: integer("difficulty_level").default(1), // 1-5
  estimatedTimeMinutes: integer("estimated_time_minutes"),
  requirements: jsonb("requirements").default('{}'),
  isActive: boolean("is_active").default(true),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  completionCount: integer("completion_count").default(0),
  maxCompletions: integer("max_completions"), // null = unlimited
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Export types for new tables
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;
export type PushNotification = typeof pushNotifications.$inferSelect;
export type InsertPushNotification = typeof pushNotifications.$inferInsert;
// Push Notifications table (using existing notification schema)
export const pushNotifications = pgTable("push_notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  type: notificationTypeEnum("type").notNull(),
  title: varchar("title", { length: 100 }).notNull(),
  message: text("message").notNull(),
  data: jsonb("data").default('{}'),
  read: boolean("read").default(false),
  sent: boolean("sent").default(false),
  sentAt: timestamp("sent_at"),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Export types for new tables
export type UserAnalytics = typeof userAnalytics.$inferSelect;
export type InsertUserAnalytics = typeof userAnalytics.$inferInsert;
export type ActiveSession = typeof activeSessions.$inferSelect;
export type InsertActiveSession = typeof activeSessions.$inferInsert;
export type EnhancedTask = typeof enhancedTasks.$inferSelect;
export type InsertEnhancedTask = typeof enhancedTasks.$inferInsert;
export type PushNotification = typeof pushNotifications.$inferSelect;
export type InsertPushNotification = typeof pushNotifications.$inferInsert;
