import {
  users,
  wallets,
  transactions,
  engagementTasks,
  engagementEvents,
  rounds,
  entries,
  prizes,
  projects,
  votes,
  donations,
  projectUpdates,
  auditLogs,
  securityAlerts,
  systemSettings,
  challengeCandidates,
  challengeNominations,
  challengeEndorsements,
  challengeVotes,
  challengeProgress,
  leaderConnections,
  regionalGroups,
  regionalGroupMembers,
  forumCategories,
  forumThreads,
  forumReplies,
  candidateEndorsements,
  achievementBadges,
  userAchievements,
  networkingEvents,
  eventRegistrations,
  mentorshipPrograms,
  mentorshipMatches,
  progressMilestones,
  userMilestones,
  citizenshipStats,
  candidateQuestions,
  candidateAnswers,
  trainingModules,
  userTrainingProgress,
  trainingQuizzes,
  userQuizAnswers,
  challengeTrainingModules,
  challengeTrainingProgress,
  passwordResetTokens,
  notifications,
  pushSubscriptions,
  type User,
  type UpsertUser,
  type Wallet,
  type Transaction,
  type EngagementTask,
  type EngagementEvent,
  type Round,
  type Entry,
  type Prize,
  type Project,
  type Vote,
  type Donation,
  type InsertDonation,
  type ProjectUpdate,
  type InsertProjectUpdate,
  type SecurityAlert,
  type InsertSecurityAlert,
  type SystemSetting,
  type InsertSystemSetting,
  type InsertTransaction,
  type InsertEngagementTask,
  type InsertProject,
  type InsertVote,
  type ChallengeCandidate,
  type InsertChallengeCandidate,
  type ChallengeNomination,
  type InsertChallengeNomination,
  type LeaderConnection,
  type InsertLeaderConnection,
  type RegionalGroup,
  type InsertRegionalGroup,
  type RegionalGroupMember,
  type InsertRegionalGroupMember,
  type ForumCategory,
  type InsertForumCategory,
  type ForumThread,
  type InsertForumThread,
  type ForumReply,
  type InsertForumReply,
  type CandidateEndorsement,
  type InsertCandidateEndorsement,
  type AchievementBadge,
  type InsertAchievementBadge,
  type UserAchievement,
  type InsertUserAchievement,
  type NetworkingEvent,
  type InsertNetworkingEvent,
  type EventRegistration,
  type InsertEventRegistration,
  type MentorshipProgram,
  type InsertMentorshipProgram,
  type MentorshipMatch,
  type InsertMentorshipMatch,
  type ProgressMilestone,
  type InsertProgressMilestone,
  type UserMilestone,
  type InsertUserMilestone,
  type CitizenshipStats,
  type InsertCitizenshipStats,
  type CandidateQuestion,
  type InsertCandidateQuestion,
  type CandidateAnswer,
  type InsertCandidateAnswer,
  type TrainingModule,
  type InsertTrainingModule,
  type UserTrainingProgress,
  type InsertUserTrainingProgress,
  type TrainingQuiz,
  type InsertTrainingQuiz,
  type UserQuizAnswer,
  type InsertUserQuizAnswer,
  type ChallengeTrainingModule,
  type InsertChallengeTrainingModule,
  type ChallengeTrainingProgress,
  type InsertChallengeTrainingProgress,
  type PasswordResetToken,
  type InsertPasswordResetToken,
  // Volunteer system imports
  volunteerProfiles,
  volunteerOpportunities,
  volunteerAssignments,
  communityProjects,
  mentorshipRequests,
  impactReports,
  type VolunteerProfile,
  type InsertVolunteerProfile,
  type VolunteerOpportunity,
  type InsertVolunteerOpportunity,
  type VolunteerAssignment,
  type InsertVolunteerAssignment,
  type CommunityProject,
  type InsertCommunityProject,
  type MentorshipRequest,
  type InsertMentorshipRequest,
  type ImpactReport,
  type InsertImpactReport,
  // Campus system imports
  institutions,
  campusCommunities,
  institutionMemberships,
  type Institution,
  type CampusCommunity,
  type InstitutionMembership,
  type InsertInstitution,
  type InsertCampusCommunity,
  type InsertInstitutionMembership,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, sql, sum, asc, count, ilike, gte, lte } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserPassword(userId: string, hashedPassword: string): Promise<void>;
  getUsers(filters: { search?: string; state?: string; kycStatus?: string; limit?: number; offset?: number }): Promise<User[]>;
  updateUser(userId: string, updateData: Partial<User>): Promise<void>;
  
  // Password reset operations
  createPasswordResetToken(userId: string, token: string, expiresAt: Date): Promise<void>;
  getPasswordResetToken(token: string): Promise<{userId: string, expiresAt: Date, used: boolean} | undefined>;
  markPasswordResetTokenAsUsed(token: string): Promise<void>;
  cleanupExpiredPasswordResetTokens(): Promise<void>;
  
  // Wallet operations
  getWallet(userId: string): Promise<Wallet | undefined>;
  createWallet(userId: string): Promise<Wallet>;
  updateWalletBalance(userId: string, supBalance: string, ngnEscrow: string): Promise<void>;
  
  // Transaction operations
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransactions(userId: string, limit?: number): Promise<Transaction[]>;
  
  // Engagement operations
  getActiveTasks(): Promise<EngagementTask[]>;
  createTask(task: Partial<InsertEngagementTask>): Promise<EngagementTask>;
  ensureDefaultTasks(): Promise<void>;
  createEngagementEvent(userId: string, taskId: string, data?: any): Promise<EngagementEvent>;
  approveEngagementEvent(eventId: string): Promise<void>;
  hasUserCompletedTask(userId: string, taskId: string): Promise<boolean>;
  getActiveTasksForUser(userId: string): Promise<EngagementTask[]>;

  // Forum operations
  getForumCategories(): Promise<ForumCategory[]>;
  createForumCategory(category: InsertForumCategory): Promise<ForumCategory>;
  getForumThreads(categoryId?: string, limit?: number): Promise<ForumThread[]>;
  createForumThread(thread: InsertForumThread): Promise<ForumThread>;
  getForumThread(threadId: string): Promise<ForumThread | undefined>;
  getForumReplies(threadId: string): Promise<ForumReply[]>;
  createForumReply(reply: InsertForumReply): Promise<ForumReply>;
  updateThreadStats(threadId: string): Promise<void>;

  // Enhanced verification system
  getCandidateEndorsements(candidateId: string): Promise<CandidateEndorsement[]>;
  createEndorsement(endorsement: InsertCandidateEndorsement): Promise<CandidateEndorsement>;
  getAchievementBadges(): Promise<AchievementBadge[]>;
  getUserAchievements(userId: string): Promise<UserAchievement[]>;
  awardAchievement(userId: string, badgeId: string, supEarned: string, notes?: string): Promise<UserAchievement>;
  
  // Events and meetups
  getNetworkingEvents(state?: string, eventType?: string): Promise<NetworkingEvent[]>;
  createNetworkingEvent(event: InsertNetworkingEvent): Promise<NetworkingEvent>;
  getEventRegistrations(eventId: string): Promise<EventRegistration[]>;
  registerForEvent(registration: InsertEventRegistration): Promise<EventRegistration>;
  updateEventAttendance(registrationId: string, attended: boolean): Promise<void>;
  updateEventStatus(eventId: string, status: string): Promise<void>;

  // Mentorship system
  getMentorshipPrograms(): Promise<MentorshipProgram[]>;
  createMentorshipProgram(program: InsertMentorshipProgram): Promise<MentorshipProgram>;
  getMentorshipMatches(userId: string): Promise<MentorshipMatch[]>;
  createMentorshipMatch(match: InsertMentorshipMatch): Promise<MentorshipMatch>;
  updateMentorshipStatus(matchId: string, status: string): Promise<void>;

  // Progress tracking
  getProgressMilestones(category?: string, state?: string): Promise<ProgressMilestone[]>;
  updateMilestoneProgress(milestoneId: string, currentNumber: number): Promise<void>;
  
  // User milestones and citizenship tracking
  getCitizenshipStats(): Promise<CitizenshipStats | undefined>;
  updateCitizenshipStats(stats: Partial<CitizenshipStats>): Promise<void>;
  getUserMilestones(): Promise<UserMilestone[]>;
  checkAndAwardMilestones(citizenNumber: number): Promise<void>;
  
  // Candidate Q&A system
  getCandidateQuestions(candidateId: string): Promise<CandidateQuestion[]>;
  createCandidateQuestion(question: InsertCandidateQuestion): Promise<CandidateQuestion>;
  getCandidateAnswers(questionId: string): Promise<CandidateAnswer[]>;
  createCandidateAnswer(answer: InsertCandidateAnswer): Promise<CandidateAnswer>;
  
  // Round operations
  getCurrentRound(): Promise<Round | undefined>;
  getAllRounds(): Promise<Round[]>;
  createRound(prizeNGN: number, durationDays: number): Promise<Round>;
  createRoundWithPrize(prizeNGN: number, durationDays: number): Promise<Round>;
  updateRoundStatus(roundId: string, status: string): Promise<void>;
  selectWinnerAndCloseRound(roundId: string): Promise<void>;
  deleteRound(roundId: string): Promise<void>;
  
  // Entry operations
  createEntry(userId: string, roundId: string, tickets: number, source: 'BUY' | 'EARNED'): Promise<Entry>;
  getUserEntries(userId: string, roundId: string): Promise<Entry[]>;
  
  // Prize operations
  createPrize(roundId: string, userId: string, amountSUP: string, tier: number): Promise<Prize>;
  getRecentWinners(limit?: number): Promise<(Prize & { user: User; round: Round })[]>;
  
  // Project operations
  getProjects(filters: { status?: string; state?: string; limit?: number; offset?: number } | number): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  ensureDefaultProjects(): Promise<void>;
  voteOnProject(vote: InsertVote): Promise<Vote>;
  updateProject(projectId: string, updateData: Partial<Project>): Promise<void>;
  deleteProject(projectId: string): Promise<void>;
  
  // Enhanced voting analytics methods
  getProjectVotes(projectId: string): Promise<(Vote & { user: User })[]>;
  getUserVoteHistory(userId: string): Promise<(Vote & { project: Project })[]>;
  getProjectVotingAnalytics(projectId: string): Promise<any>;
  
  // Enhanced leaderboard methods
  getTopEngagedUsers(limit?: number): Promise<any[]>;
  getTopVoters(limit?: number): Promise<any[]>;
  getCombinedLeaderboard(limit?: number): Promise<any[]>;
  getRegionalLeaderboard(state?: string, limit?: number): Promise<any[]>;
  getUserLeaderboardPosition(userId: string, type: 'donations' | 'engagement' | 'voting' | 'combined'): Promise<{ position: number; total: number }>;
  
  // Analytics
  getTotalPoolAmount(): Promise<string>;
  getTotalProjectsFunded(): Promise<number>;
  getActiveUsersCount(): Promise<number>;
  
  // Profile operations
  updateUserProfile(userId: string, profileData: Partial<User>): Promise<User>;
  verifyUserAge(userId: string): Promise<void>;
  getUserEngagementHistory(userId: string, limit?: number): Promise<(EngagementEvent & { task: EngagementTask })[]>;
  getUserCivicStats(userId: string): Promise<any>;
  
  // KYC operations
  getKYCStatus(userId: string): Promise<{status: string, submittedAt?: Date, reviewedAt?: Date} | null>;
  submitKYC(userId: string, kycData: any): Promise<void>;
  updateKYCStatus(userId: string, status: string, reason?: string): Promise<void>;
  
  // Admin operations
  getAdminStats(): Promise<any>;
  getPendingKYCSubmissions(): Promise<any[]>;
  getRecentUsers(limit?: number): Promise<any[]>;
  getPendingEngagementSubmissions(): Promise<any[]>;
  getFinancialOverview(): Promise<any>;
  
  // Treasury management operations
  getTreasuryOverview(): Promise<any>;
  getSecurityAlerts(): Promise<any[]>;
  activateEmergencyFreeze(adminId: string): Promise<void>;
  createAuditLog(log: any): Promise<void>;
  executeTreasuryTransfer(transfer: any): Promise<void>;
  resolveSecurityAlert(alertId: string, adminId: string): Promise<void>;
  
  // Challenge operations
  createChallengeCandidate(candidate: Partial<InsertChallengeCandidate>): Promise<ChallengeCandidate>;
  getChallengeCandidate(userId: string): Promise<ChallengeCandidate | undefined>;
  getChallengeCandidates(options: { page: number; limit: number; filters: any }): Promise<any>;
  createChallengeNomination(nomination: Partial<InsertChallengeNomination>): Promise<ChallengeNomination>;
  getChallengeStats(): Promise<any>;

  // Enhanced Training and Learning Management methods
  getTrainingModules(): Promise<TrainingModule[]>;
  getTrainingModule(moduleId: string): Promise<TrainingModule | undefined>;
  getTrainingProgress(userId: string, moduleId: string): Promise<UserTrainingProgress | undefined>;
  updateTrainingProgress(userId: string, moduleId: string, progressData: Partial<InsertUserTrainingProgress>): Promise<UserTrainingProgress>;
  submitQuiz(userId: string, moduleId: string, quizData: any): Promise<any>;
  getUserCertificates(userId: string): Promise<any[]>;
  generateCertificate(userId: string, moduleId: string): Promise<any>;
  getUserLearningAnalytics(userId: string): Promise<any>;
  getTrainingRecommendations(userId: string): Promise<TrainingModule[]>;
  addSupTokens(userId: string, amount: number, reason: string, referenceId?: string): Promise<void>;

  // Geography methods
  getLGAData(filters: { state?: string; zone?: string; status?: string }): Promise<any[]>;
  getGeographyStats(): Promise<any>;

  // User migration methods
  ensureAllUsersHaveCitizenNumbers(): Promise<void>;
  updateUserPassword(userId: string, hashedPassword: string): Promise<void>;

  // Enhanced forum methods
  voteOnForumReply(replyId: string, userId: string, voteType: 'up' | 'down'): Promise<void>;

  // Events methods
  getEvents(filters: { eventType?: string; state?: string; status?: string }): Promise<any[]>;
  createEvent(event: any): Promise<any>;
  getEvent(eventId: string): Promise<any>;
  registerForEvent(eventId: string, userId: string): Promise<any>;
  updateEvent(eventId: string, updateData: any): Promise<void>;
  deleteEvent(eventId: string): Promise<void>;
  markEventAttendance(eventId: string, userId: string, data: { rating?: number; feedback?: string }): Promise<void>;

  // Leader Networking operations
  createConnectionRequest(connection: Partial<InsertLeaderConnection>): Promise<LeaderConnection>;
  getConnectionRequests(userId: string): Promise<LeaderConnection[]>;
  getConnections(userId: string): Promise<LeaderConnection[]>;
  respondToConnectionRequest(connectionId: string, status: string): Promise<void>;
  getRegionalGroups(state?: string): Promise<RegionalGroup[]>;
  createRegionalGroup(group: Partial<InsertRegionalGroup>): Promise<RegionalGroup>;
  joinRegionalGroup(groupId: string, userId: string): Promise<void>;
  
  // User Discovery and Follow System
  discoverUsers(filters: { search?: string; state?: string; currentUserId?: string; limit?: number; offset?: number }): Promise<Array<User & { isFollowing?: boolean; followersCount?: number; followingCount?: number }>>;
  followUser(followerId: string, userId: string): Promise<void>;
  unfollowUser(followerId: string, userId: string): Promise<void>;
  getUserRecommendations(userId: string): Promise<Array<User & { reason?: string }>>;
  getActivityFeed(userId: string, limit?: number): Promise<Array<any>>;
  
  // Donation operations
  createDonation(donation: InsertDonation): Promise<Donation>;
  getDonationsForProject(projectId: string): Promise<Donation[]>;
  getDonationsByUser(userId: string): Promise<Donation[]>;
  getTopDonors(limit?: number): Promise<Array<{userId: string, totalDonated: string, donationCount: number}>>;
  updateProjectFunding(projectId: string, amount: string): Promise<void>;
  processDonation(donationId: string, paymentReference: string): Promise<void>;
  
  // Project update operations
  createProjectUpdate(update: InsertProjectUpdate): Promise<ProjectUpdate>;
  getProjectUpdates(projectId: string): Promise<ProjectUpdate[]>;
  
  // Enhanced project operations
  getProjectById(projectId: string): Promise<Project | undefined>;
  getProjectsByStatus(status: string): Promise<Project[]>;
  updateProject(projectId: string, data: Partial<InsertProject>): Promise<Project>;
  deleteProject(projectId: string): Promise<void>;
  getFundingAnalytics(): Promise<{totalRaised: string, projectsFunded: number, averageDonation: string}>;
  
  // ================================
  // VOLUNTEER AND CIVIC ENGAGEMENT SYSTEM
  // ================================
  
  // Volunteer Profile operations
  createVolunteerProfile(profile: InsertVolunteerProfile): Promise<VolunteerProfile>;
  getVolunteerProfile(userId: string): Promise<VolunteerProfile | undefined>;
  updateVolunteerProfile(userId: string, updateData: Partial<VolunteerProfile>): Promise<void>;
  
  // Volunteer Opportunity operations
  createVolunteerOpportunity(opportunity: InsertVolunteerOpportunity): Promise<VolunteerOpportunity>;
  getVolunteerOpportunities(filters?: { 
    state?: string; 
    lga?: string; 
    type?: string; 
    status?: string; 
    skills?: string[]; 
    limit?: number; 
    offset?: number 
  }): Promise<VolunteerOpportunity[]>;
  getVolunteerOpportunity(opportunityId: string): Promise<VolunteerOpportunity | undefined>;
  updateVolunteerOpportunity(opportunityId: string, updateData: Partial<VolunteerOpportunity>): Promise<void>;
  deleteVolunteerOpportunity(opportunityId: string): Promise<void>;
  
  // Volunteer Assignment operations
  assignVolunteer(assignment: InsertVolunteerAssignment): Promise<VolunteerAssignment>;
  getVolunteerAssignments(volunteerId: string): Promise<VolunteerAssignment[]>;
  getOpportunityAssignments(opportunityId: string): Promise<VolunteerAssignment[]>;
  updateAssignmentStatus(assignmentId: string, status: string, data?: any): Promise<void>;
  completeVolunteerAssignment(assignmentId: string, hoursCompleted: number, feedback?: string, performanceRating?: number): Promise<void>;
  
  // Community Project operations
  createCommunityProject(project: InsertCommunityProject): Promise<CommunityProject>;
  getCommunityProjects(filters?: { 
    state?: string; 
    lga?: string; 
    category?: string; 
    status?: string; 
    limit?: number; 
    offset?: number 
  }): Promise<CommunityProject[]>;
  getCommunityProject(projectId: string): Promise<CommunityProject | undefined>;
  updateCommunityProject(projectId: string, updateData: Partial<CommunityProject>): Promise<void>;
  joinCommunityProject(projectId: string, volunteerId: string): Promise<void>;
  
  // Mentorship operations
  createMentorshipRequest(request: InsertMentorshipRequest): Promise<MentorshipRequest>;
  getMentorshipRequests(filters?: { menteeId?: string; mentorId?: string; status?: string }): Promise<MentorshipRequest[]>;
  matchMentor(requestId: string, mentorId: string): Promise<void>;
  updateMentorshipStatus(requestId: string, status: string): Promise<void>;
  rateMentorship(requestId: string, rating: number, isFromMentee: boolean): Promise<void>;
  
  // Impact tracking operations
  createImpactReport(report: InsertImpactReport): Promise<ImpactReport>;
  getImpactReports(filters?: { opportunityId?: string; projectId?: string; reportedBy?: string }): Promise<ImpactReport[]>;
  verifyImpactReport(reportId: string, verifiedBy: string): Promise<void>;
  
  // Volunteer matching and recommendations
  getMatchedOpportunities(volunteerId: string, limit?: number): Promise<VolunteerOpportunity[]>;
  getVolunteerRecommendations(opportunityId: string, limit?: number): Promise<Array<VolunteerProfile & { score: number; reason: string }>>;
  
  // Volunteer analytics and statistics
  getVolunteerStats(volunteerId: string): Promise<{
    totalHours: number;
    opportunitiesCompleted: number;
    impactScore: number;
    averageRating: number;
    badges: string[];
  }>;
  getVolunteerLeaderboard(filters?: { state?: string; timeframe?: 'week' | 'month' | 'year' }): Promise<Array<{
    volunteerId: string;
    firstName: string;
    lastName: string;
    totalHours: number;
    impactScore: number;
    rank: number;
  }>>;
  getCivicImpactMetrics(): Promise<{
    totalVolunteers: number;
    activeOpportunities: number;
    totalVolunteerHours: number;
    votersRegistered: number;
    communityMeetingsHeld: number;
    projectsCompleted: number;
  }>;
  
  // ================================
  // CAMPUS PROFILE SYSTEM
  // ================================
  
  // Campus profile operations
  createCampusProfile(userId: string, profileData: {
    institutionType: string;
    institutionName: string;
    customInstitutionName?: string;
    state: string;
    leadershipPosition: string;
    faculty?: string;
    department?: string;
    yearOfStudy?: string;
    graduationYear?: string;
    leadership_experience: string;
    civic_interests: string;
    phone: string;
    whatsapp?: string;
    social_media?: string;
    goals: string;
  }): Promise<void>;
  getCampusProfile(userId: string): Promise<any | undefined>;
  updateCampusProfile(userId: string, profileData: any): Promise<void>;
  getInstitutions(filters?: { type?: string; state?: string }): Promise<Institution[]>;
  getCampusCommunities(institutionId: string): Promise<CampusCommunity[]>;
  getCampusLeaders(filters?: { institutionType?: string; state?: string; position?: string }): Promise<Array<User & { institutionName?: string; position?: string }>>;
  
  // Session Management
  getActiveSession(userId: string): Promise<ActiveSession | undefined>;
  createActiveSession(session: InsertActiveSession): Promise<ActiveSession>;
  updateSessionActivity(userId: string, extensionMs?: number): Promise<void>;
  updateSessionWarning(userId: string, warningShown: boolean): Promise<void>;
  deactivateSession(userId: string): Promise<void>;
  
  // Enhanced Audit Logging
  createAuditLog(log: { userId: string; action: string; details: string; ipAddress?: string; userAgent?: string; metadata?: any }): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.phone, phone));
    return user;
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.googleId, googleId));
    return user;
  }
  
  // Credible Nigerian Badge System
  async upgradeCredibleLevel(userId: string, newLevel: number): Promise<User> {
    let rewardSUP = 0;
    let message = '';
    
    switch (newLevel) {
      case 1:
        rewardSUP = 500;
        message = 'Verified Credible Nigerian badge earned';
        break;
      case 2:
        message = 'Trained Credible Nigerian badge earned';
        break;
      case 3:
        message = 'Civic Leader badge earned';
        break;
    }
    
    const [user] = await db
      .update(users)
      .set({
        credibleLevel: newLevel,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    
    // Award SUP bonus for level 1
    if (rewardSUP > 0) {
      const wallet = await this.getWallet(userId);
      if (wallet) {
        await this.updateWalletBalance(
          userId, 
          (parseFloat(wallet.supBalance || '0') + rewardSUP).toString(),
          wallet.ngnEscrow || '0'
        );
        
        await this.createTransaction({
          userId,
          type: 'PRIZE',
          amountSUP: rewardSUP.toString(),
          meta: { 
            type: 'CREDIBLE_BADGE_BONUS',
            level: newLevel,
            message 
          },
        });
      }
    }
    
    return user;
  }
  
  // Get users on founders wall (first 10,000)
  async getFoundersWallUsers(limit = 50, offset = 0): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .where(eq(users.onFoundersWall, true))
      .orderBy(asc(users.citizenNumber))
      .limit(limit)
      .offset(offset);
  }

  // Ensure all existing users have citizen numbers assigned
  async updateUserPassword(userId: string, hashedPassword: string): Promise<void> {
    await db
      .update(users)
      .set({ 
        password: hashedPassword,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
  }

  async getUsers(filters: { search?: string; state?: string; kycStatus?: string; limit?: number; offset?: number }): Promise<User[]> {
    let query = db.select().from(users);
    
    const conditions: any[] = [];
    
    if (filters.search) {
      conditions.push(
        or(
          ilike(users.firstName, `%${filters.search}%`),
          ilike(users.lastName, `%${filters.search}%`),
          ilike(users.email, `%${filters.search}%`)
        )
      );
    }
    
    if (filters.state) {
      conditions.push(eq(users.state, filters.state));
    }
    
    if (filters.kycStatus) {
      conditions.push(eq(users.kycStatus, filters.kycStatus));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    query = query.orderBy(desc(users.createdAt));
    
    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    
    if (filters.offset) {
      query = query.offset(filters.offset);
    }
    
    return await query;
  }

  async updateUser(userId: string, updateData: Partial<User>): Promise<void> {
    await db
      .update(users)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  // Two-Factor Authentication methods
  async enable2FA(userId: string, secret: string, backupCodes: string[]): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        twoFactorEnabled: true,
        twoFactorSecret: secret,
        twoFactorBackupCodes: JSON.stringify(backupCodes),
        twoFactorSetupAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async disable2FA(userId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        twoFactorEnabled: false,
        twoFactorSecret: null,
        twoFactorBackupCodes: JSON.stringify([]),
        twoFactorSetupAt: null,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateBackupCodes(userId: string, backupCodes: string[]): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        twoFactorBackupCodes: JSON.stringify(backupCodes),
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async ensureAllUsersHaveCitizenNumbers(): Promise<void> {
    console.log('🔍 Checking for users without citizen numbers...');
    
    // Find users without citizen numbers
    const usersWithoutCitizenNumbers = await db
      .select()
      .from(users)
      .where(sql`${users.citizenNumber} IS NULL`)
      .orderBy(asc(users.createdAt)); // Assign numbers based on registration order
    
    if (usersWithoutCitizenNumbers.length === 0) {
      console.log('✅ All users already have citizen numbers');
      return;
    }
    
    console.log(`🔢 Found ${usersWithoutCitizenNumbers.length} users without citizen numbers. Assigning...`);
    
    // Get the highest existing citizen number
    const highestCitizenNumberResult = await db
      .select({ maxCitizenNumber: sql`MAX(${users.citizenNumber})` })
      .from(users);
    
    let nextCitizenNumber = Number(highestCitizenNumberResult[0]?.maxCitizenNumber || 0) + 1;
    
    // Assign citizen numbers to users without them
    for (const user of usersWithoutCitizenNumbers) {
      const isFoundingCitizen = nextCitizenNumber <= 10000;
      
      await db
        .update(users)
        .set({ 
          citizenNumber: nextCitizenNumber,
          onFoundersWall: isFoundingCitizen,
          updatedAt: new Date()
        })
        .where(eq(users.id, user.id as string));
      
      console.log(`✅ Assigned citizen number ${nextCitizenNumber} to user ${user.email}`);
      
      // Award founding citizen bonus if applicable
      if (nextCitizenNumber <= 10000) {
        const wallet = await this.getWallet(user.id as string);
        if (wallet) {
          const foundingBonus = 5;
          await this.updateWalletBalance(
            user.id as string,
            (parseFloat(wallet.supBalance || '0') + foundingBonus).toString(),
            wallet.ngnEscrow || '0'
          );
          
          await this.createTransaction({
            userId: user.id as string,
            type: 'PRIZE',
            amountSUP: foundingBonus.toString(),
            meta: { 
              type: 'RETROACTIVE_FOUNDING_CITIZEN_BONUS',
              citizenNumber: nextCitizenNumber,
              message: 'Retroactive Founding Citizen bonus'
            },
          });
          
          console.log(`🎁 Awarded founding citizen bonus to citizen #${nextCitizenNumber}`);
        }
      }
      
      nextCitizenNumber++;
    }
    
    // Update citizenship stats
    const totalUsers = await db.select({ count: sql`count(*)` }).from(users);
    await this.updateCitizenshipStats({
      totalUsers: Number(totalUsers[0]?.count || 0),
      updatedAt: new Date(),
    });
    
    console.log('✅ Citizen number assignment completed');
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    // Check if user already exists
    const existingUser = await this.getUser(userData.id || '');
    
    if (!existingUser) {
      // New user - assign citizen number based on actual database count (more reliable than stats)
      const userCount = await db.select({ count: sql`count(*)` }).from(users);
      const newCitizenNumber = Number(userCount[0]?.count || 0) + 1;
      
      // Special rewards for founding citizens (first 10,000)
      const foundingCitizenBonus = newCitizenNumber <= 10000 ? 5 : 0;
      const isFoundingCitizen = newCitizenNumber <= 10000;
      
      // Create user with citizen number and founding citizen benefits
      const [user] = await db
        .insert(users)
        .values({
          ...userData,
          citizenNumber: newCitizenNumber,
          onFoundersWall: isFoundingCitizen,
        })
        .returning();

      // Create wallet if doesn't exist and add founding citizen bonus
      let wallet = await this.getWallet(user.id);
      if (!wallet) {
        wallet = await this.createWallet(user.id);
      }
      
      if (foundingCitizenBonus > 0) {
        // Award founding citizen bonus
        await this.updateWalletBalance(
          user.id, 
          (parseFloat(wallet.supBalance || '0') + foundingCitizenBonus).toString(),
          wallet.ngnEscrow || '0'
        );
        
        // Log the founding citizen bonus transaction
        await this.createTransaction({
          userId: user.id,
          type: 'PRIZE',
          amountSUP: foundingCitizenBonus.toString(),
          meta: { 
            type: 'FOUNDING_CITIZEN_BONUS',
            citizenNumber: newCitizenNumber,
            message: 'Founding Citizen welcome bonus' 
          },
        });
      }

      // Update citizenship stats
      await this.updateCitizenshipStats({
        totalUsers: newCitizenNumber,
        updatedAt: new Date(),
      });

      // Check and award milestones
      await this.checkAndAwardMilestones(newCitizenNumber);

      return user;
    } else {
      // Existing user - update without changing citizen number
      const [user] = await db
        .update(users)
        .set({
          ...userData,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userData.id!))
        .returning();
      return user;
    }
  }

  // Wallet operations
  async getWallet(userId: string): Promise<Wallet | undefined> {
    const [wallet] = await db.select().from(wallets).where(eq(wallets.userId, userId));
    return wallet;
  }

  async createWallet(userId: string): Promise<Wallet> {
    const [wallet] = await db
      .insert(wallets)
      .values({ userId })
      .returning();
    return wallet;
  }

  async updateWalletBalance(userId: string, supBalance: string, ngnEscrow: string): Promise<void> {
    await db
      .update(wallets)
      .set({ supBalance, ngnEscrow })
      .where(eq(wallets.userId, userId));
  }

  // Transaction operations
  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    // Check KYC earning limits for EARNED transactions
    if (transaction.type === 'EARNED' && transaction.amountSUP) {
      const user = await this.getUser(transaction.userId);
      if (!user) {
        throw new Error('User not found');
      }
      
      // Non-KYC users are limited to 100 SUP total earnings
      const KYC_EARNING_LIMIT = '100.00';
      const isKycVerified = user.kycStatus === 'VERIFIED';
      
      if (!isKycVerified) {
        // Get current wallet balance
        const wallet = await this.getWallet(user.id);
        const currentBalance = parseFloat(wallet?.supBalance || '0');
        const newTransactionAmount = parseFloat(transaction.amountSUP);
        
        // Check if this transaction would exceed the KYC limit
        if (currentBalance + newTransactionAmount > parseFloat(KYC_EARNING_LIMIT)) {
          const remainingLimit = Math.max(0, parseFloat(KYC_EARNING_LIMIT) - currentBalance);
          throw new Error(`KYC_LIMIT_EXCEEDED: You can only earn ${remainingLimit.toFixed(2)} more SUP tokens. Complete KYC verification to earn unlimited SUP.`);
        }
      }
    }
    
    const [result] = await db
      .insert(transactions)
      .values(transaction)
      .returning();
    return result;
  }

  async getTransactions(userId: string, limit = 10): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.createdAt))
      .limit(limit);
  }

  // Engagement operations
  async getActiveTasks(): Promise<EngagementTask[]> {
    // Get active events to check which event-based tasks should be shown
    const activeEvents = await this.getActiveEvents();
    const activeEventTypes = Array.from(new Set(activeEvents.map(event => event.eventType)));
    
    // Get all active tasks based on time
    const allActiveTasks = await db
      .select()
      .from(engagementTasks)
      .where(
        and(
          sql`${engagementTasks.activeFrom} <= NOW()`,
          sql`${engagementTasks.activeTo} >= NOW() OR ${engagementTasks.activeTo} IS NULL`
        )
      );

    // Check if tasks exist in database, if not, create default tasks
    if (allActiveTasks.length === 0) {
      console.log('No tasks found in database, seeding default tasks...');
      
      const defaultTasks = [
        {
          id: 'daily-quiz',
          kind: 'QUIZ' as const,
          title: 'Daily Civic Quiz',
          description: 'Test your knowledge of Nigerian civics and governance',
          rewardSUP: '25',
          requiresVerification: false,
          eventRequired: false,
        },
        {
          id: 'nomination',
          kind: 'NOMINATION' as const,
          title: 'Nominate a Community Hero',
          description: 'Recognize someone making a positive impact in your community',
          rewardSUP: '15',
          requiresVerification: false,
          eventRequired: false,
        },
        {
          id: 'share-progress',
          kind: 'SHARE' as const,
          title: 'Share Community Impact',
          description: 'Share Step Up Naija progress on your social media',
          rewardSUP: '10',
          requiresVerification: false,
          eventRequired: false,
        },
        {
          id: 'town-hall-attendance',
          kind: 'PHOTO_UPLOAD' as const,
          title: 'Town Hall Meeting Attendance',
          description: 'Upload a photo showing your attendance at a local town hall or community meeting',
          rewardSUP: '50',
          requiresVerification: true,
          eventRequired: true,
        },
        {
          id: 'community-cleanup',
          kind: 'PHOTO_UPLOAD' as const,
          title: 'Community Cleanup Participation',
          description: 'Participate in a community cleanup exercise and upload photo evidence',
          rewardSUP: '25',
          requiresVerification: false,
          eventRequired: true,
        },
        {
          id: 'share-voter-education',
          kind: 'SHARE' as const,
          title: 'Share Voter Education Content',
          description: 'Help spread voter education by sharing our civic awareness content on social media',
          rewardSUP: '20',
          requiresVerification: false,
          eventRequired: false,
        },
      ];

      for (const task of defaultTasks) {
        try {
          await db.insert(engagementTasks).values({
            id: task.id,
            kind: task.kind,
            title: task.title,
            description: task.description,
            rewardSUP: task.rewardSUP,
            requiresVerification: task.requiresVerification,
            eventRequired: (task as any).eventRequired || false,
          }).onConflictDoNothing();
        } catch (error) {
          console.log(`Task ${task.id} already exists or error inserting:`, error);
        }
      }
      
      // Re-fetch after seeding
      const seededTasks = await db
        .select()
        .from(engagementTasks)
        .where(
          and(
            sql`${engagementTasks.activeFrom} <= NOW()`,
            sql`${engagementTasks.activeTo} >= NOW() OR ${engagementTasks.activeTo} IS NULL`
          )
        );
        
      return this.filterTasksByEvents(seededTasks, activeEventTypes);
    }
    
    return this.filterTasksByEvents(allActiveTasks, activeEventTypes);
  }

  // Get currently active events (ongoing or upcoming within 24 hours)
  async getActiveEvents() {
    const result = await db.execute(sql.raw(`
      SELECT 
        id,
        organizer_user_id,
        title,
        description,
        event_type,
        state,
        location,
        start_time,
        end_time,
        max_attendees,
        current_attendees,
        status,
        created_at
      FROM networking_events
      WHERE status = 'UPCOMING' 
      AND start_time >= NOW() 
      AND start_time <= NOW() + INTERVAL '24 hours'
    `));
    return result.rows;
  }

  // Filter tasks based on event requirements
  private filterTasksByEvents(tasks: any[], activeEventTypes: string[]): any[] {
    return tasks.filter((task: any) => {
      // If task doesn't require an event, always show it
      if (!task.eventRequired) {
        return true;
      }
      
      // For event-required tasks, check if there's a matching active event
      if (task.id === 'town-hall-attendance') {
        return activeEventTypes.includes('TOWNHALL');
      }
      if (task.id === 'community-cleanup') {
        return activeEventTypes.includes('CLEANUP');
      }
      
      // Default: don't show event-required tasks without matching events
      return false;
    });
  }

  async createTask(task: Partial<InsertEngagementTask>): Promise<EngagementTask> {
    const [result] = await db
      .insert(engagementTasks)
      .values(task)
      .returning();
    return result;
  }

  async ensureDefaultTasks(): Promise<void> {
    // Check if we already have tasks
    const existingTasks = await this.getActiveTasks();
    
    // If we have fewer than 20 tasks, add the missing defaults
    if (existingTasks.length < 20) {
      const defaultTasks = [
        {
          id: 'daily-quiz',
          kind: 'QUIZ' as const,
          title: 'Daily Civic Quiz',
          description: 'Test your knowledge of Nigerian civics and governance',
          rewardSUP: '25',
          requiresVerification: false,
        },
        {
          id: 'nomination',
          kind: 'NOMINATION' as const,
          title: 'Nominate a Community Hero',
          description: 'Recognize someone making a positive impact in your community',
          rewardSUP: '15',
          requiresVerification: false,
        },
        {
          id: 'share-progress',
          kind: 'SHARE' as const,
          title: 'Share Community Impact',
          description: 'Share Step Up Naija progress on your social media',
          rewardSUP: '10',
          requiresVerification: false,
        },
        {
          id: 'fact-check',
          kind: 'QUIZ' as const,
          title: 'Nigerian Constitution Facts',
          description: 'Help verify facts about the Nigerian Constitution',
          rewardSUP: '30',
          requiresVerification: false,
        },
        {
          id: 'town-hall-attendance',
          kind: 'PHOTO_UPLOAD' as const,
          title: 'Town Hall Meeting Attendance',
          description: 'Upload a photo showing your attendance at a local town hall or community meeting',
          rewardSUP: '50',
          requiresVerification: true,
          eventRequired: true, // This task only appears when there's an active town hall event
        },
        {
          id: 'community-cleanup',
          kind: 'PHOTO_UPLOAD' as const,
          title: 'Community Cleanup Participation',
          description: 'Participate in a community cleanup exercise and upload photo evidence',
          rewardSUP: '25',
          requiresVerification: false,
          eventRequired: true, // This task only appears when there's an active cleanup event
        },
        {
          id: 'volunteer-photo',
          kind: 'PHOTO_UPLOAD' as const,
          title: 'Community Volunteer Work',
          description: 'Share photo evidence of volunteer work in your community (cleanup, helping elderly, etc.)',
          rewardSUP: '40',
          requiresVerification: true,
        },
        {
          id: 'civic-education-photo',
          kind: 'PHOTO_UPLOAD' as const,
          title: 'Civic Education Event',
          description: 'Upload photo from attending a civic education workshop, seminar, or training',
          rewardSUP: '35',
          requiresVerification: true,
        },
        {
          id: 'local-governance-survey',
          kind: 'SURVEY' as const,
          title: 'Local Governance Feedback Survey',
          description: 'Share your feedback on local government services and community needs',
          rewardSUP: '20',
          requiresVerification: false,
        },
        {
          id: 'youth-civic-survey',
          kind: 'SURVEY' as const,
          title: 'Youth Civic Engagement Survey',
          description: 'Help improve civic participation opportunities for young Nigerians',
          rewardSUP: '15',
          requiresVerification: false,
        },
        {
          id: 'education-funding-petition',
          kind: 'PETITION' as const,
          title: 'Sign Education Funding Petition',
          description: 'Support increased funding for public schools across Nigeria',
          rewardSUP: '25',
          requiresVerification: false,
        },
        {
          id: 'infrastructure-petition',
          kind: 'PETITION' as const,
          title: 'Rural Infrastructure Petition',
          description: 'Advocate for improved rural road infrastructure and connectivity',
          rewardSUP: '25',
          requiresVerification: false,
        },
        {
          id: 'healthcare-petition',
          kind: 'PETITION' as const,
          title: 'Healthcare Access Petition',
          description: 'Support strengthening primary healthcare centers in underserved areas',
          rewardSUP: '25',
          requiresVerification: false,
        },
        {
          id: 'share-voter-education',
          kind: 'SHARE' as const,
          title: 'Share Voter Education Content',
          description: 'Help spread voter education by sharing our civic awareness content on social media',
          rewardSUP: '20',
          requiresVerification: false,
        },
        {
          id: 'share-civic-participation',
          kind: 'SHARE' as const,
          title: 'Share Civic Participation Message',
          description: 'Promote civic engagement by sharing content about community participation',
          rewardSUP: '20',
          requiresVerification: false,
        },
        // NEW INNOVATIVE CIVIC ENGAGEMENT TASKS
        {
          id: 'community-issue-report',
          kind: 'PHOTO_UPLOAD' as const,
          title: 'Report Community Issue',
          description: 'Document and report local infrastructure problems, sanitation issues, or community concerns with photo evidence',
          rewardSUP: '35',
          requiresVerification: true,
        },
        {
          id: 'government-service-rating',
          kind: 'SURVEY' as const,
          title: 'Rate Public Service Experience',
          description: 'Rate your recent experience with public services (hospital, school, local government office)',
          rewardSUP: '25',
          requiresVerification: false,
        },
        {
          id: 'budget-transparency-review',
          kind: 'QUIZ' as const,
          title: 'Local Budget Knowledge Quiz',
          description: 'Test your understanding of how local government budgets work and public fund allocation',
          rewardSUP: '40',
          requiresVerification: false,
        },
        {
          id: 'civic-innovation-idea',
          kind: 'SURVEY' as const,
          title: 'Propose Civic Innovation Solution',
          description: 'Suggest innovative solutions for improving governance or community services in your area',
          rewardSUP: '45',
          requiresVerification: false,
        },
        {
          id: 'electoral-education-quiz',
          kind: 'QUIZ' as const,
          title: 'Electoral Process Knowledge',
          description: 'Learn about Nigeria\'s electoral system, voting processes, and democratic rights',
          rewardSUP: '35',
          requiresVerification: false,
        },
        {
          id: 'inter-community-collaboration',
          kind: 'PHOTO_UPLOAD' as const,
          title: 'Cross-Community Partnership',
          description: 'Document collaboration between different communities, ethnic groups, or religious groups',
          rewardSUP: '50',
          requiresVerification: true,
        },
        {
          id: 'public-meeting-feedback',
          kind: 'SURVEY' as const,
          title: 'Public Meeting Feedback',
          description: 'Provide feedback on local government meetings, community forums, or public consultations',
          rewardSUP: '30',
          requiresVerification: false,
        },
        {
          id: 'community-safety-report',
          kind: 'PHOTO_UPLOAD' as const,
          title: 'Community Safety Documentation',
          description: 'Report safety concerns or document community security initiatives (street lights, roads, etc.)',
          rewardSUP: '30',
          requiresVerification: true,
        },
      ];

      for (const task of defaultTasks) {
        // Check if this specific task already exists
        const existing = existingTasks.find(t => t.id === task.id);
        if (!existing) {
          try {
            await this.createTask(task);
            console.log(`Created default task: ${task.title}`);
          } catch (error) {
            // Ignore duplicate errors (task might exist but not be active)
            const errorMessage = error instanceof Error ? error.message : String(error);
            if (!errorMessage.includes('duplicate key')) {
              console.error(`Error creating task ${task.id}:`, error);
            }
          }
        }
      }
    }
  }

  async createEngagementEvent(userId: string, taskId: string, data?: any): Promise<EngagementEvent> {
    const [event] = await db
      .insert(engagementEvents)
      .values({
        userId,
        taskId,
        data,
      })
      .returning();
    return event;
  }

  async approveEngagementEvent(eventId: string): Promise<void> {
    await db
      .update(engagementEvents)
      .set({ status: 'APPROVED' })
      .where(eq(engagementEvents.id, eventId));
  }

  async hasUserCompletedTask(userId: string, taskId: string): Promise<boolean> {
    const [event] = await db
      .select()
      .from(engagementEvents)
      .where(
        and(
          eq(engagementEvents.userId, userId),
          eq(engagementEvents.taskId, taskId),
          eq(engagementEvents.status, 'APPROVED')
        )
      )
      .limit(1);
    return !!event;
  }

  async getActiveTasksForUser(userId: string): Promise<EngagementTask[]> {
    const allTasks = await this.getActiveTasks();
    const tasksWithCompletion = await Promise.all(
      allTasks.map(async (task) => {
        const completed = await this.hasUserCompletedTask(userId, task.id);
        return { ...task, completed };
      })
    );
    return tasksWithCompletion;
  }

  // Round operations
  async getCurrentRound(): Promise<Round | undefined> {
    const [round] = await db
      .select()
      .from(rounds)
      .where(eq(rounds.status, 'OPEN'))
      .orderBy(desc(rounds.openedAt))
      .limit(1);
    return round;
  }

  async createRound(prizeNGN: number, durationDays: number): Promise<Round> {
    const closedAt = new Date();
    closedAt.setDate(closedAt.getDate() + durationDays);
    
    const [round] = await db
      .insert(rounds)
      .values({ 
        status: 'OPEN',
        poolSUP: '0',
        closedAt
      } as any)
      .returning();
    return round;
  }

  async getAllRounds(): Promise<Round[]> {
    return await db
      .select()
      .from(rounds)
      .orderBy(desc(rounds.openedAt));
  }

  async createRoundWithPrize(prizeNGN: number, durationDays: number): Promise<Round> {
    const closedAt = new Date();
    closedAt.setDate(closedAt.getDate() + durationDays);
    
    const [round] = await db
      .insert(rounds)
      .values({ 
        status: 'OPEN',
        poolSUP: '0',
        closedAt
      } as any)
      .returning();
    return round;
  }

  async updateRoundStatus(roundId: string, status: string): Promise<void> {
    await db
      .update(rounds)
      .set({ status: status as any })
      .where(eq(rounds.id, roundId));
  }

  async selectWinnerAndCloseRound(roundId: string): Promise<void> {
    // Get all entries for this round
    const roundEntries = await db
      .select()
      .from(entries)
      .where(eq(entries.roundId, roundId));

    if (roundEntries.length > 0) {
      // Select random winner
      const randomIndex = Math.floor(Math.random() * roundEntries.length);
      const winner = roundEntries[randomIndex];

      // Create prize for winner
      const round = await db
        .select()
        .from(rounds)
        .where(eq(rounds.id, roundId))
        .limit(1);

      if (round[0]) {
        const prizeAmount = (round[0] as any).prizeNGN || '0';
        await this.createPrize(roundId, winner.userId, prizeAmount, 1);
      }
    }
  }

  async deleteRound(roundId: string): Promise<void> {
    // First delete all entries for this round
    await db
      .delete(entries)
      .where(eq(entries.roundId, roundId));
      
    // Then delete the round itself
    await db
      .delete(rounds)
      .where(eq(rounds.id, roundId));
  }

  // Entry operations
  async createEntry(userId: string, roundId: string, tickets: number, source: 'BUY' | 'EARNED'): Promise<Entry> {
    const [entry] = await db
      .insert(entries)
      .values({
        userId,
        roundId,
        tickets,
        source,
      })
      .returning();
    return entry;
  }

  async getUserEntries(userId: string, roundId: string): Promise<Entry[]> {
    return await db
      .select()
      .from(entries)
      .where(
        and(
          eq(entries.userId, userId),
          eq(entries.roundId, roundId)
        )
      );
  }

  // Prize operations
  async createPrize(roundId: string, userId: string, amountSUP: string, tier: number): Promise<Prize> {
    const [prize] = await db
      .insert(prizes)
      .values({
        roundId,
        userId,
        amountSUP,
        tier,
      })
      .returning();
    return prize;
  }

  async getRecentWinners(limit = 10): Promise<(Prize & { user: User; round: Round })[]> {
    return await db
      .select({
        id: prizes.id,
        roundId: prizes.roundId,
        userId: prizes.userId,
        amountSUP: prizes.amountSUP,
        tier: prizes.tier,
        paidAt: prizes.paidAt,
        createdAt: prizes.createdAt,
        user: users,
        round: rounds,
      })
      .from(prizes)
      .innerJoin(users, eq(prizes.userId, users.id))
      .innerJoin(rounds, eq(prizes.roundId, rounds.id))
      .orderBy(desc(prizes.createdAt))
      .limit(limit);
  }

  // Project operations
  async getProjects(filters: { status?: string; state?: string; limit?: number; offset?: number } | number = 10): Promise<Project[]> {
    // Handle legacy call with just a number
    if (typeof filters === 'number') {
      return await db
        .select()
        .from(projects)
        .where(or(eq(projects.status, 'APPROVED'), eq(projects.status, 'FUNDED')))
        .orderBy(desc(projects.createdAt))
        .limit(filters);
    }

    let query = db.select().from(projects);
    const conditions: any[] = [];

    if (filters.status) {
      conditions.push(eq(projects.status, filters.status));
    } else {
      // Default: show approved or funded projects
      conditions.push(or(eq(projects.status, 'APPROVED'), eq(projects.status, 'FUNDED')));
    }

    if (filters.state) {
      conditions.push(eq(projects.state, filters.state));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    query = query.orderBy(desc(projects.createdAt));

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.offset(filters.offset);
    }

    return await query;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [result] = await db
      .insert(projects)
      .values(project)
      .returning();
    return result;
  }

  async ensureDefaultProjects(): Promise<void> {
    // Get all existing projects to check for specific default project IDs
    const existingProjects = await db.select().from(projects);
    const existingIds = new Set(existingProjects.map(p => p.id));
    
    // Only add default projects that don't already exist
    const defaultProjects = [
        {
          id: 'lagos-clean-water',
          title: 'Lagos Clean Water Initiative',
          description: 'Providing clean water access to 500 families in Makoko community through borehole drilling and water treatment systems.',
          category: 'Water & Sanitation',
          lga: 'Lagos Mainland',
          status: 'APPROVED' as const,
          targetNGN: '1000000',
          raisedNGN: '650000',
          imageUrl: '/public-objects/Lagos_clean_water_project_9ec1332a.png',
        },
        {
          id: 'abuja-school-tech',
          title: 'Abuja School Technology Lab',
          description: 'Computer lab setup for 200 students in FCT primary school with internet connectivity and digital literacy training.',
          category: 'Education',
          lga: 'AMAC',
          status: 'APPROVED' as const,
          targetNGN: '500000',
          raisedNGN: '200000',
          imageUrl: '/public-objects/Abuja_school_computer_lab_07a47229.png',
        },
        {
          id: 'kano-solar-clinic',
          title: 'Kano Solar Health Clinic',
          description: 'Solar power installation for rural health clinic serving 1000+ residents in Kano State.',
          category: 'Healthcare',
          lga: 'Bebeji',
          status: 'APPROVED' as const,
          targetNGN: '750000',
          raisedNGN: '480000',
          imageUrl: '/public-objects/Kano_solar_health_clinic_d465f05d.png',
        },
        {
          id: 'rivers-youth-center',
          title: 'Rivers Youth Skill Center',
          description: 'Vocational training center for unemployed youth in Port Harcourt, offering welding, carpentry, and digital skills.',
          category: 'Youth Development',
          lga: 'Port Harcourt',
          status: 'APPROVED' as const,
          targetNGN: '800000',
          raisedNGN: '320000',
          imageUrl: '/public-objects/Rivers_youth_skill_center_71d0f8c0.png',
        },
        {
          id: 'ogun-farm-cooperative',
          title: 'Ogun Farmers Cooperative',
          description: 'Agricultural equipment and storage facility for 50 smallholder farmers in Ogun State.',
          category: 'Agriculture',
          lga: 'Abeokuta North',
          status: 'APPROVED' as const,
          targetNGN: '600000',
          raisedNGN: '150000',
          imageUrl: '/public-objects/Realistic_Ogun_farmers_cooperative_69615424.png',
        },
        {
          id: 'cross-river-roads',
          title: 'Cross River Community Roads',
          description: 'Road rehabilitation project connecting 3 rural communities in Cross River State.',
          category: 'Infrastructure',
          lga: 'Calabar South',
          status: 'FUNDED' as const,
          targetNGN: '1200000',
          raisedNGN: '900000',
          imageUrl: '/public-objects/Cross_River_roads_project_e0c68b19.png',
        }
      ];

    for (const project of defaultProjects) {
      // Only insert if this project ID doesn't already exist
      if (!existingIds.has(project.id)) {
        try {
          await db
            .insert(projects)
            .values({
              ...project,
              createdAt: new Date(Date.now() - Math.random() * 45 * 24 * 60 * 60 * 1000), // Random date within last 45 days
            });
        } catch (error) {
          // Ignore duplicate errors (project might already exist)
          const errorMessage = error instanceof Error ? error.message : String(error);
          if (!errorMessage.includes('duplicate key')) {
            console.error(`Error creating project ${project.id}:`, error);
          }
        }
      }
    }
  }

  async voteOnProject(vote: InsertVote): Promise<Vote> {
    const [result] = await db
      .insert(votes)
      .values(vote)
      .returning();
    return result;
  }

  // Enhanced voting analytics methods
  async getProjectVotes(projectId: string): Promise<(Vote & { user: User })[]> {
    return await db
      .select({
        id: votes.id,
        projectId: votes.projectId,
        userId: votes.userId,
        amountSUP: votes.amountSUP,
        createdAt: votes.createdAt,
        user: users,
      })
      .from(votes)
      .innerJoin(users, eq(votes.userId, users.id))
      .where(eq(votes.projectId, projectId))
      .orderBy(desc(votes.createdAt));
  }

  async getUserVoteHistory(userId: string): Promise<(Vote & { project: Project })[]> {
    return await db
      .select({
        id: votes.id,
        projectId: votes.projectId,
        userId: votes.userId,
        amountSUP: votes.amountSUP,
        createdAt: votes.createdAt,
        project: projects,
      })
      .from(votes)
      .innerJoin(projects, eq(votes.projectId, projects.id))
      .where(eq(votes.userId, userId))
      .orderBy(desc(votes.createdAt));
  }

  async getProjectVotingAnalytics(projectId: string): Promise<any> {
    const [voteStats] = await db
      .select({
        totalVotes: sql<number>`count(*)`,
        totalSupAmount: sql<number>`sum(${votes.amountSUP})`,
        avgVoteAmount: sql<number>`avg(${votes.amountSUP})`,
        uniqueVoters: sql<number>`count(distinct ${votes.userId})`,
      })
      .from(votes)
      .where(eq(votes.projectId, projectId));

    const recentVotes = await db
      .select({
        id: votes.id,
        userId: votes.userId,
        amountSUP: votes.amountSUP,
        createdAt: votes.createdAt,
        userFirstName: users.firstName,
        userLastName: users.lastName,
        userProfileImageUrl: users.profileImageUrl,
      })
      .from(votes)
      .innerJoin(users, eq(votes.userId, users.id))
      .where(eq(votes.projectId, projectId))
      .orderBy(desc(votes.createdAt))
      .limit(10);

    return {
      totalVotes: Number(voteStats?.totalVotes) || 0,
      totalSupAmount: Number(voteStats?.totalSupAmount) || 0,
      avgVoteAmount: Number(voteStats?.avgVoteAmount) || 0,
      uniqueVoters: Number(voteStats?.uniqueVoters) || 0,
      recentVotes,
    };
  }

  // Enhanced leaderboard implementations
  async getTopEngagedUsers(limit = 10): Promise<any[]> {
    const topUsers = await db
      .select({
        userId: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        profileImageUrl: users.profileImageUrl,
        state: users.state,
        lga: users.lga,
        totalEngagements: users.totalEngagements,
        engagementStreak: users.engagementStreak,
        credibilityScore: users.credibilityScore,
      })
      .from(users)
      .where(sql`${users.totalEngagements} > 0`)
      .orderBy(desc(users.totalEngagements), desc(users.engagementStreak))
      .limit(limit);

    return topUsers.map(user => ({
      userId: user.userId,
      name: `${user.firstName} ${user.lastName}`.trim(),
      profileImageUrl: user.profileImageUrl,
      state: user.state,
      lga: user.lga,
      totalEngagements: user.totalEngagements,
      engagementStreak: user.engagementStreak,
      credibilityScore: user.credibilityScore,
      score: Number(user.totalEngagements) + (Number(user.engagementStreak) * 5),
    }));
  }

  async getTopVoters(limit = 10): Promise<any[]> {
    const topVoters = await db
      .select({
        userId: votes.userId,
        totalVotes: sql<number>`count(*)`,
        totalSupVoted: sql<number>`sum(${votes.amountSUP})`,
        avgVoteAmount: sql<number>`avg(${votes.amountSUP})`,
      })
      .from(votes)
      .groupBy(votes.userId)
      .orderBy(sql`sum(${votes.amountSUP}) desc`, sql`count(*) desc`)
      .limit(limit);

    // Get user details for each voter
    const leaderboard = await Promise.all(
      topVoters.map(async (voter) => {
        const user = await db
          .select()
          .from(users)
          .where(eq(users.id, voter.userId))
          .limit(1);

        const userData = user[0];
        
        return {
          userId: voter.userId,
          name: userData ? `${userData.firstName} ${userData.lastName}`.trim() : 'Anonymous',
          profileImageUrl: userData?.profileImageUrl,
          state: userData?.state,
          totalVotes: Number(voter.totalVotes),
          totalSupVoted: Number(voter.totalSupVoted),
          avgVoteAmount: Number(voter.avgVoteAmount),
          score: Number(voter.totalSupVoted) + (Number(voter.totalVotes) * 10),
        };
      })
    );

    return leaderboard;
  }

  async getCombinedLeaderboard(limit = 10): Promise<any[]> {
    // Get combined stats using SQL subqueries
    const combinedStats = await db.execute(sql`
      WITH user_donations AS (
        SELECT 
          u.id as user_id,
          COALESCE(SUM(t.amount_ngn::numeric), 0) as total_donated
        FROM users u
        LEFT JOIN transactions t ON u.id = t.user_id AND t.type = 'DONATION'
        GROUP BY u.id
      ),
      user_votes AS (
        SELECT 
          u.id as user_id,
          COALESCE(COUNT(v.id), 0) as vote_count,
          COALESCE(SUM(v.amount_sup::numeric), 0) as total_sup_voted
        FROM users u
        LEFT JOIN votes v ON u.id = v.user_id
        GROUP BY u.id
      )
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.profile_image_url,
        u.state,
        u.lga,
        u.total_engagements,
        u.engagement_streak,
        u.credibility_score,
        COALESCE(ud.total_donated, 0) as total_donated,
        COALESCE(uv.vote_count, 0) as vote_count,
        COALESCE(uv.total_sup_voted, 0) as total_sup_voted,
        (
          COALESCE(u.total_engagements, 0) * 10 +
          COALESCE(u.engagement_streak, 0) * 5 +
          COALESCE(ud.total_donated::numeric, 0) / 1000 +
          COALESCE(uv.total_sup_voted::numeric, 0) * 2 +
          COALESCE(uv.vote_count, 0) * 15
        ) as combined_score
      FROM users u
      LEFT JOIN user_donations ud ON u.id = ud.user_id
      LEFT JOIN user_votes uv ON u.id = uv.user_id
      WHERE (
        COALESCE(u.total_engagements, 0) > 0 OR
        COALESCE(ud.total_donated, 0) > 0 OR
        COALESCE(uv.vote_count, 0) > 0
      )
      ORDER BY combined_score DESC
      LIMIT ${limit}
    `);

    return combinedStats.rows.map((row: any) => ({
      userId: row.id,
      name: `${row.first_name} ${row.last_name}`.trim(),
      profileImageUrl: row.profile_image_url,
      state: row.state,
      lga: row.lga,
      totalEngagements: Number(row.total_engagements) || 0,
      engagementStreak: Number(row.engagement_streak) || 0,
      credibilityScore: Number(row.credibility_score) || 0,
      totalDonated: Number(row.total_donated) || 0,
      voteCount: Number(row.vote_count) || 0,
      totalSupVoted: Number(row.total_sup_voted) || 0,
      combinedScore: Number(row.combined_score) || 0,
    }));
  }

  async getRegionalLeaderboard(state?: string, limit = 10): Promise<any[]> {
    let query = db
      .select({
        userId: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        profileImageUrl: users.profileImageUrl,
        state: users.state,
        lga: users.lga,
        totalEngagements: users.totalEngagements,
        credibilityScore: users.credibilityScore,
      })
      .from(users);

    if (state && state !== 'All States') {
      query = query.where(eq(users.state, state));
    }

    const regionalUsers = await query
      .where(sql`${users.totalEngagements} > 0`)
      .orderBy(desc(users.totalEngagements), desc(users.credibilityScore))
      .limit(limit);

    return regionalUsers.map(user => ({
      userId: user.userId,
      name: `${user.firstName} ${user.lastName}`.trim(),
      profileImageUrl: user.profileImageUrl,
      state: user.state,
      lga: user.lga,
      totalEngagements: user.totalEngagements,
      credibilityScore: user.credibilityScore,
      score: Number(user.totalEngagements) + Number(user.credibilityScore) * 2,
    }));
  }

  async getUserLeaderboardPosition(userId: string, type: 'donations' | 'engagement' | 'voting' | 'combined'): Promise<{ position: number; total: number }> {
    let position = 0;
    let total = 0;

    switch (type) {
      case 'donations':
        const donationRank = await db.execute(sql`
          WITH ranked_donors AS (
            SELECT 
              u.id,
              ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(t.amount_ngn::numeric), 0) DESC) as rank
            FROM users u
            LEFT JOIN transactions t ON u.id = t.user_id AND t.type = 'DONATION'
            GROUP BY u.id
            HAVING COALESCE(SUM(t.amount_ngn::numeric), 0) > 0
          )
          SELECT rank FROM ranked_donors WHERE id = ${userId}
        `);
        position = donationRank.rows[0]?.rank || 0;
        
        const donationTotal = await db.execute(sql`
          SELECT COUNT(DISTINCT u.id) as total
          FROM users u
          JOIN transactions t ON u.id = t.user_id AND t.type = 'DONATION'
        `);
        total = donationTotal.rows[0]?.total || 0;
        break;

      case 'engagement':
        const engagementRank = await db.execute(sql`
          WITH ranked_users AS (
            SELECT 
              id,
              ROW_NUMBER() OVER (ORDER BY total_engagements DESC, engagement_streak DESC) as rank
            FROM users
            WHERE total_engagements > 0
          )
          SELECT rank FROM ranked_users WHERE id = ${userId}
        `);
        position = engagementRank.rows[0]?.rank || 0;
        
        const engagementTotal = await db.execute(sql`
          SELECT COUNT(*) as total FROM users WHERE total_engagements > 0
        `);
        total = engagementTotal.rows[0]?.total || 0;
        break;

      case 'voting':
        const votingRank = await db.execute(sql`
          WITH ranked_voters AS (
            SELECT 
              user_id,
              ROW_NUMBER() OVER (ORDER BY SUM(amount_sup::numeric) DESC, COUNT(*) DESC) as rank
            FROM votes
            GROUP BY user_id
          )
          SELECT rank FROM ranked_voters WHERE user_id = ${userId}
        `);
        position = votingRank.rows[0]?.rank || 0;
        
        const votingTotal = await db.execute(sql`
          SELECT COUNT(DISTINCT user_id) as total FROM votes
        `);
        total = votingTotal.rows[0]?.total || 0;
        break;

      case 'combined':
        const combinedRank = await db.execute(sql`
          WITH user_scores AS (
            SELECT 
              u.id,
              (
                COALESCE(u.total_engagements, 0) * 10 +
                COALESCE(u.engagement_streak, 0) * 5 +
                COALESCE(donations.total_donated, 0) / 1000 +
                COALESCE(votes.total_sup_voted, 0) * 2 +
                COALESCE(votes.vote_count, 0) * 15
              ) as combined_score
            FROM users u
            LEFT JOIN (
              SELECT user_id, SUM(amount_ngn::numeric) as total_donated
              FROM transactions
              WHERE type = 'DONATION'
              GROUP BY user_id
            ) donations ON u.id = donations.user_id
            LEFT JOIN (
              SELECT user_id, COUNT(*) as vote_count, SUM(amount_sup::numeric) as total_sup_voted
              FROM votes
              GROUP BY user_id
            ) votes ON u.id = votes.user_id
          ),
          ranked_users AS (
            SELECT 
              id,
              ROW_NUMBER() OVER (ORDER BY combined_score DESC) as rank
            FROM user_scores
            WHERE combined_score > 0
          )
          SELECT rank FROM ranked_users WHERE id = ${userId}
        `);
        position = combinedRank.rows[0]?.rank || 0;
        
        const combinedTotal = await db.execute(sql`
          WITH user_scores AS (
            SELECT 
              u.id,
              (
                COALESCE(u.total_engagements, 0) * 10 +
                COALESCE(u.engagement_streak, 0) * 5 +
                COALESCE(donations.total_donated, 0) / 1000 +
                COALESCE(votes.total_sup_voted, 0) * 2 +
                COALESCE(votes.vote_count, 0) * 15
              ) as combined_score
            FROM users u
            LEFT JOIN (
              SELECT user_id, SUM(amount_ngn::numeric) as total_donated
              FROM transactions
              WHERE type = 'DONATION'
              GROUP BY user_id
            ) donations ON u.id = donations.user_id
            LEFT JOIN (
              SELECT user_id, COUNT(*) as vote_count, SUM(amount_sup::numeric) as total_sup_voted
              FROM votes
              GROUP BY user_id
            ) votes ON u.id = votes.user_id
          )
          SELECT COUNT(*) as total FROM user_scores WHERE combined_score > 0
        `);
        total = combinedTotal.rows[0]?.total || 0;
        break;
    }

    return { position: Number(position), total: Number(total) };
  }

  // Analytics
  async getTotalPoolAmount(): Promise<string> {
    const [result] = await db
      .select({ total: sum(rounds.poolSUP) })
      .from(rounds);
    return result?.total || '0';
  }

  async getTotalProjectsFunded(): Promise<number> {
    const [result] = await db
      .select({ count: sql`count(*)` })
      .from(projects)
      .where(eq(projects.status, 'FUNDED'));
    return Number(result?.count) || 0;
  }

  async getActiveUsersCount(): Promise<number> {
    const [result] = await db
      .select({ count: sql`count(DISTINCT ${transactions.userId})` })
      .from(transactions)
      .where(sql`${transactions.createdAt} >= NOW() - INTERVAL '30 days'`);
    return Number(result?.count) || 0;
  }
  
  // Profile operations
  async updateUserProfile(userId: string, profileData: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...profileData, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async verifyUserAge(userId: string): Promise<void> {
    await db
      .update(users)
      .set({ 
        ageVerified: true, 
        ageVerifiedAt: new Date(), 
        updatedAt: new Date() 
      } as any)
      .where(eq(users.id, userId));
  }
  
  async getUserEngagementHistory(userId: string, limit = 20): Promise<(EngagementEvent & { task: EngagementTask })[]> {
    return await db
      .select({
        id: engagementEvents.id,
        userId: engagementEvents.userId,
        taskId: engagementEvents.taskId,
        status: engagementEvents.status,
        rewardSUP: engagementEvents.rewardSUP,
        data: engagementEvents.data,
        createdAt: engagementEvents.createdAt,
        task: engagementTasks,
      })
      .from(engagementEvents)
      .innerJoin(engagementTasks, eq(engagementEvents.taskId, engagementTasks.id))
      .where(eq(engagementEvents.userId, userId))
      .orderBy(desc(engagementEvents.createdAt))
      .limit(limit);
  }
  
  async getUserCivicStats(userId: string): Promise<any> {
    // Get total tasks completed
    const [tasksCompleted] = await db
      .select({ count: sql`count(*)` })
      .from(engagementEvents)
      .where(and(
        eq(engagementEvents.userId, userId),
        eq(engagementEvents.status, 'APPROVED')
      ));
    
    // Get projects supported (votes cast)
    const [votesCast] = await db
      .select({ count: sql`count(*)` })
      .from(votes)
      .where(eq(votes.userId, userId));
    
    // Get unique projects supported
    const [projectsSupported] = await db
      .select({ count: sql`count(DISTINCT ${votes.projectId})` })
      .from(votes)
      .where(eq(votes.userId, userId));
    
    // Get total SUP earned from engagement
    const [totalSupEarned] = await db
      .select({ total: sum(engagementEvents.rewardSUP) })
      .from(engagementEvents)
      .where(and(
        eq(engagementEvents.userId, userId),
        eq(engagementEvents.status, 'APPROVED')
      ));
    
    // Get prize wins
    const [prizeWins] = await db
      .select({ count: sql`count(*)` })
      .from(prizes)
      .where(eq(prizes.userId, userId));
    
    return {
      tasksCompleted: Number(tasksCompleted?.count) || 0,
      votesCast: Number(votesCast?.count) || 0,
      projectsSupported: Number(projectsSupported?.count) || 0,
      totalSupEarned: totalSupEarned?.total || '0',
      prizeWins: Number(prizeWins?.count) || 0,
      referrals: 0, // TODO: Implement referral system
    };
  }
  
  // KYC operations
  async getKYCStatus(userId: string): Promise<{status: string, submittedAt?: Date, reviewedAt?: Date} | null> {
    const user = await this.getUser(userId);
    if (!user) return null;
    
    return {
      status: (user as any).kycStatus || 'NOT_STARTED',
      submittedAt: (user as any).kycSubmittedAt || undefined,
      reviewedAt: (user as any).kycReviewedAt || undefined
    };
  }
  
  async submitKYC(userId: string, kycData: any): Promise<void> {
    await db
      .update(users)
      .set({
        kycStatus: 'PENDING',
        kycData: JSON.stringify(kycData),
        kycSubmittedAt: new Date(),
        updatedAt: new Date()
      } as any)
      .where(eq(users.id, userId));
  }
  
  async updateKYCStatus(userId: string, status: string, reason?: string): Promise<void> {
    await db
      .update(users)
      .set({
        kycStatus: status,
        kycReviewedAt: new Date(),
        updatedAt: new Date(),
        ...(reason && { kycData: JSON.stringify({ reason }) })
      } as any)
      .where(eq(users.id, userId));
  }
  
  // Admin operations
  async getAdminStats(): Promise<any> {
    const [totalUsers] = await db.select({ count: sql`count(*)` }).from(users);
    const [totalSUPDistributed] = await db.select({ total: sum(transactions.amountSUP) }).from(transactions).where(eq(transactions.type, 'ENGAGE'));
    const [activeThisWeek] = await db.select({ count: sql`count(DISTINCT ${engagementEvents.userId})` }).from(engagementEvents).where(sql`${engagementEvents.createdAt} >= NOW() - INTERVAL '7 days'`);
    const [newUsersToday] = await db.select({ count: sql`count(*)` }).from(users).where(sql`DATE(${users.createdAt}) = CURRENT_DATE`);
    const [tasksCompletedToday] = await db.select({ count: sql`count(*)` }).from(engagementEvents).where(and(eq(engagementEvents.status, 'APPROVED'), sql`DATE(${engagementEvents.createdAt}) = CURRENT_DATE`));
    
    return {
      totalUsers: Number(totalUsers?.count) || 0,
      totalSUPDistributed: totalSUPDistributed?.total || '0',
      activeThisWeek: Number(activeThisWeek?.count) || 0,
      newUsersToday: Number(newUsersToday?.count) || 0,
      tasksCompletedToday: Number(tasksCompletedToday?.count) || 0
    };
  }
  
  async getPendingKYCSubmissions(): Promise<any[]> {
    const submissions = await db
      .select({
        userId: users.id,
        status: users.kycStatus,
        submittedAt: users.kycSubmittedAt,
        kycData: users.kycData,
        user: {
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email
        }
      })
      .from(users)
      .where(eq(users.kycStatus, 'PENDING'))
      .orderBy(users.kycSubmittedAt);
    
    return submissions.map(sub => ({
      ...sub,
      documents: sub.kycData ? JSON.parse(sub.kycData as string)?.documents : null
    }));
  }
  
  async getRecentUsers(limit = 20): Promise<any[]> {
    const users_with_wallets = await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        kycStatus: users.kycStatus,
        totalEngagements: users.totalEngagements,
        createdAt: users.createdAt,
        wallet: {
          supBalance: wallets.supBalance
        }
      })
      .from(users)
      .leftJoin(wallets, eq(users.id, wallets.userId))
      .orderBy(desc(users.createdAt))
      .limit(limit);
    
    return users_with_wallets;
  }
  
  async getPendingEngagementSubmissions(): Promise<any[]> {
    const submissions = await db
      .select({
        id: engagementEvents.id,
        userId: engagementEvents.userId,
        taskId: engagementEvents.taskId,
        data: engagementEvents.data,
        rewardSUP: engagementEvents.rewardSUP,
        createdAt: engagementEvents.createdAt,
        user: {
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email
        },
        task: {
          title: engagementTasks.title,
          description: engagementTasks.description,
          kind: engagementTasks.kind
        }
      })
      .from(engagementEvents)
      .leftJoin(users, eq(engagementEvents.userId, users.id))
      .leftJoin(engagementTasks, eq(engagementEvents.taskId, engagementTasks.id))
      .where(eq(engagementEvents.status, 'PENDING'))
      .orderBy(engagementEvents.createdAt);
    
    return submissions;
  }
  
  async getFinancialOverview(): Promise<any> {
    const [totalSUPIssued] = await db.select({ total: sum(transactions.amountSUP) }).from(transactions);
    const [totalNGNEscrow] = await db.select({ total: sum(wallets.ngnEscrow) }).from(wallets);
    const [prizesDistributed] = await db.select({ count: sql`count(*)` }).from(prizes);
    
    const recentTransactions = await db
      .select({
        id: transactions.id,
        type: transactions.type,
        amountSUP: transactions.amountSUP,
        amountNGN: transactions.amountNGN,
        createdAt: transactions.createdAt,
        user: {
          firstName: users.firstName,
          lastName: users.lastName
        }
      })
      .from(transactions)
      .leftJoin(users, eq(transactions.userId, users.id))
      .orderBy(desc(transactions.createdAt))
      .limit(10);
    
    return {
      totalSUPIssued: totalSUPIssued?.total || '0',
      totalNGNEscrow: totalNGNEscrow?.total || '0',
      prizesDistributed: Number(prizesDistributed?.count) || 0,
      recentTransactions
    };
  }
  
  // Treasury management operations
  async getTreasuryOverview(): Promise<any> {
    // Calculate total SUP pool from all wallets
    const [totalSUPResult] = await db.select({ total: sum(wallets.supBalance) }).from(wallets);
    const [totalEscrowResult] = await db.select({ total: sum(wallets.ngnEscrow) }).from(wallets);
    
    // Get recent transactions for flow calculation
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const [weeklyInflow] = await db
      .select({ total: sum(transactions.amountNGN) })
      .from(transactions)
      .where(and(
        eq(transactions.type, 'CASHOUT'),
        sql`${transactions.createdAt} >= ${weekAgo}`
      ));
    
    const [weeklyOutflow] = await db
      .select({ total: sum(transactions.amountNGN) })
      .from(transactions)
      .where(and(
        eq(transactions.type, 'TRANSFER'),
        sql`${transactions.createdAt} >= ${weekAgo}`
      ));
    
    const [activeUsersResult] = await db
      .select({ count: sql`count(DISTINCT ${transactions.userId})` })
      .from(transactions)
      .where(sql`${transactions.createdAt} >= NOW() - INTERVAL '30 days'`);
    
    const [pendingWithdrawalsResult] = await db
      .select({ count: sql`count(*)` })
      .from(transactions)
      .where(and(
        eq(transactions.type, 'TRANSFER'),
        sql`${transactions.meta}->>'status' = 'PENDING'`
      ));
    
    const totalSUP = parseFloat(totalSUPResult?.total || '0');
    const totalEscrow = parseFloat(totalEscrowResult?.total || '0');
    const reserveRatio = totalEscrow > 0 ? Math.round((totalEscrow * 0.2 / totalEscrow) * 100) : 25;
    
    return {
      totalPoolSUP: totalSUP.toString(),
      totalEscrowNGN: totalEscrow.toString(),
      weeklyInflow: weeklyInflow?.total || '0',
      weeklyOutflow: weeklyOutflow?.total || '0',
      reserveRatio,
      activeUsers: Number(activeUsersResult?.count) || 0,
      pendingWithdrawals: Number(pendingWithdrawalsResult?.count) || 0,
      lastAuditDate: new Date().toISOString()
    };
  }
  
  async getSecurityAlerts(): Promise<SecurityAlert[]> {
    return await db
      .select()
      .from(securityAlerts)
      .orderBy(desc(securityAlerts.createdAt))
      .limit(50);
  }
  
  async activateEmergencyFreeze(adminId: string): Promise<void> {
    // Set emergency freeze flag in system settings
    await db
      .insert(systemSettings)
      .values({
        key: 'EMERGENCY_FREEZE',
        value: 'true',
        description: 'Emergency fund freeze activated',
        updatedBy: adminId
      })
      .onConflictDoUpdate({
        target: systemSettings.key,
        set: {
          value: 'true',
          updatedBy: adminId,
          updatedAt: new Date()
        }
      });
    
    // Create security alert
    await db
      .insert(securityAlerts)
      .values({
        type: 'EMERGENCY_FREEZE',
        severity: 'critical',
        message: 'Emergency fund freeze has been activated by admin',
        metadata: JSON.stringify({ activatedBy: adminId })
      });
  }
  
  async createAuditLog(log: any): Promise<void> {
    await db
      .insert(auditLogs)
      .values({
        actor: log.userId,
        action: log.action,
        payloadJson: JSON.stringify({
          details: log.details,
          ipAddress: log.ipAddress,
          userAgent: log.userAgent,
          ...log.metadata
        })
      });
  }
  
  async executeTreasuryTransfer(transfer: any): Promise<void> {
    const { adminId, amount, reason, type, ipAddress } = transfer;
    
    // Create audit log for transfer
    await this.createAuditLog({
      userId: adminId,
      action: 'TREASURY_TRANSFER',
      details: `${type} transfer of ₦${amount}: ${reason}`,
      ipAddress,
      metadata: { amount, reason, type }
    });
    
    // Create security alert for large transfers
    if (parseFloat(amount) > 100000) {
      await db
        .insert(securityAlerts)
        .values({
          type: 'LARGE_WITHDRAWAL',
          severity: 'high',
          message: `Large treasury transfer: ₦${amount} for ${reason}`,
          metadata: JSON.stringify({ amount, reason, type, adminId })
        });
    }
  }
  
  async resolveSecurityAlert(alertId: string, adminId: string): Promise<void> {
    await db
      .update(securityAlerts)
      .set({
        resolved: true,
        resolvedBy: adminId,
        resolvedAt: new Date()
      })
      .where(eq(securityAlerts.id, alertId));
    
    await this.createAuditLog({
      userId: adminId,
      action: 'RESOLVE_ALERT',
      details: `Resolved security alert ${alertId}`,
      metadata: { alertId }
    });
  }

  // Challenge operations
  async createChallengeCandidate(candidate: Partial<InsertChallengeCandidate>): Promise<ChallengeCandidate> {
    try {
      const [createdCandidate] = await db
        .insert(challengeCandidates)
        .values(candidate)
        .returning();
      return createdCandidate;
    } catch (error) {
      console.error("Error creating challenge candidate:", error);
      throw error;
    }
  }

  async getChallengeCandidate(userId: string): Promise<ChallengeCandidate | undefined> {
    try {
      const [candidate] = await db
        .select()
        .from(challengeCandidates)
        .where(eq(challengeCandidates.userId, userId));
      return candidate;
    } catch (error) {
      console.error("Error getting challenge candidate:", error);
      throw error;
    }
  }

  async getChallengeCandidates(options: { page: number; limit: number; filters: any }): Promise<any> {
    try {
      const { page, limit, filters } = options;
      const offset = (page - 1) * limit;

      // Build where conditions
      const whereConditions = [];
      if (filters.state) {
        whereConditions.push(eq(challengeCandidates.stateTarget, filters.state));
      }
      if (filters.lga) {
        whereConditions.push(eq(challengeCandidates.lgaTarget, filters.lga));
      }
      if (filters.role) {
        whereConditions.push(eq(challengeCandidates.targetRole, filters.role));
      }
      if (filters.stage) {
        whereConditions.push(eq(challengeCandidates.currentStage, filters.stage));
      }

      const baseQuery = db.select().from(challengeCandidates);
      
      const query = whereConditions.length > 0 
        ? baseQuery.where(and(...whereConditions))
        : baseQuery;

      const candidates = await query
        .orderBy(desc(challengeCandidates.credibilityScore))
        .limit(limit)
        .offset(offset);

      const [countResult] = await db
        .select({ count: sql<number>`count(*)` })
        .from(challengeCandidates);

      return {
        candidates,
        total: countResult.count,
        page,
        totalPages: Math.ceil(countResult.count / limit),
      };
    } catch (error) {
      console.error("Error getting challenge candidates:", error);
      throw error;
    }
  }

  async createChallengeNomination(nomination: Partial<InsertChallengeNomination>): Promise<ChallengeNomination> {
    try {
      const [createdNomination] = await db
        .insert(challengeNominations)
        .values(nomination)
        .returning();
      return createdNomination;
    } catch (error) {
      console.error("Error creating challenge nomination:", error);
      throw error;
    }
  }

  async getChallengeStats(): Promise<any> {
    try {
      // Get total candidates count
      const [candidatesResult] = await db
        .select({ count: sql<number>`count(*)` })
        .from(challengeCandidates);

      // Get candidates by stage
      const [nominatedResult] = await db
        .select({ count: sql<number>`count(*)` })
        .from(challengeCandidates)
        .where(eq(challengeCandidates.currentStage, 'NOMINATED'));

      const [vettingResult] = await db
        .select({ count: sql<number>`count(*)` })
        .from(challengeCandidates)
        .where(eq(challengeCandidates.currentStage, 'VETTING'));

      const [shortlistedResult] = await db
        .select({ count: sql<number>`count(*)` })
        .from(challengeCandidates)
        .where(eq(challengeCandidates.currentStage, 'SHORTLISTED'));

      const [trainingResult] = await db
        .select({ count: sql<number>`count(*)` })
        .from(challengeCandidates)
        .where(eq(challengeCandidates.currentStage, 'TRAINING'));

      const [deployedResult] = await db
        .select({ count: sql<number>`count(*)` })
        .from(challengeCandidates)
        .where(eq(challengeCandidates.currentStage, 'DEPLOYED'));

      // Get LGA and state coverage
      const lgasResult = await db
        .select({ lga: challengeCandidates.lgaTarget })
        .from(challengeCandidates)
        .groupBy(challengeCandidates.lgaTarget);

      const statesResult = await db
        .select({ state: challengeCandidates.stateTarget })
        .from(challengeCandidates)
        .groupBy(challengeCandidates.stateTarget);

      return {
        totalCandidates: candidatesResult.count,
        candidatesNominated: nominatedResult.count,
        candidatesInVetting: vettingResult.count,
        candidatesShortlisted: shortlistedResult.count,
        candidatesInTraining: trainingResult.count,
        candidatesDeployed: deployedResult.count,
        lgasCovered: lgasResult.length,
        statesCovered: statesResult.length,
        progressToGoal: Math.round((candidatesResult.count / 13000) * 100),
        lastUpdated: new Date(),
      };
    } catch (error) {
      console.error("Error getting challenge stats:", error);
      throw error;
    }
  }

  // Leader Networking Methods
  async createConnectionRequest(connection: Partial<InsertLeaderConnection>): Promise<LeaderConnection> {
    try {
      const [created] = await db
        .insert(leaderConnections)
        .values({
          requesterUserId: connection.requesterUserId!,
          recipientUserId: connection.recipientUserId!,
          message: connection.message,
          connectionType: connection.connectionType
        })
        .returning();
      return created;
    } catch (error) {
      console.error("Error creating connection request:", error);
      throw error;
    }
  }

  async getConnectionRequests(userId: string): Promise<LeaderConnection[]> {
    try {
      return await db
        .select()
        .from(leaderConnections)
        .where(and(
          eq(leaderConnections.recipientUserId, userId),
          eq(leaderConnections.status, "PENDING")
        ))
        .orderBy(desc(leaderConnections.createdAt));
    } catch (error) {
      console.error("Error getting connection requests:", error);
      throw error;
    }
  }

  async getConnections(userId: string): Promise<LeaderConnection[]> {
    try {
      return await db
        .select()
        .from(leaderConnections)
        .where(and(
          sql`(${leaderConnections.requesterUserId} = ${userId} OR ${leaderConnections.recipientUserId} = ${userId})`,
          eq(leaderConnections.status, "ACCEPTED")
        ))
        .orderBy(desc(leaderConnections.createdAt));
    } catch (error) {
      console.error("Error getting connections:", error);
      throw error;
    }
  }

  // User Discovery and Follow System Implementation - OPTIMIZED
  async discoverUsers(filters: { search?: string; state?: string; currentUserId?: string; limit?: number; offset?: number }): Promise<Array<User & { isFollowing?: boolean; followersCount?: number; followingCount?: number }>> {
    try {
      // Single optimized query with JOINs and aggregations to eliminate N+1 problem
      const query = sql`
        SELECT 
          u.*,
          COALESCE(followers.count, 0) as followers_count,
          COALESCE(following.count, 0) as following_count,
          CASE WHEN current_follow.id IS NOT NULL THEN true ELSE false END as is_following
        FROM ${users} u
        LEFT JOIN (
          SELECT 
            recipient_user_id, 
            COUNT(*) as count 
          FROM ${leaderConnections} 
          WHERE status = 'ACCEPTED' 
          GROUP BY recipient_user_id
        ) followers ON u.id = followers.recipient_user_id
        LEFT JOIN (
          SELECT 
            requester_user_id, 
            COUNT(*) as count 
          FROM ${leaderConnections} 
          WHERE status = 'ACCEPTED' 
          GROUP BY requester_user_id
        ) following ON u.id = following.requester_user_id
        ${filters.currentUserId ? sql`
        LEFT JOIN ${leaderConnections} current_follow ON (
          current_follow.requester_user_id = ${filters.currentUserId} 
          AND current_follow.recipient_user_id = u.id 
          AND current_follow.status = 'ACCEPTED'
        )` : sql``}
        WHERE 1=1
        ${filters.currentUserId ? sql`AND u.id != ${filters.currentUserId}` : sql``}
        ${filters.search ? sql`AND (
          u.first_name ILIKE ${`%${filters.search}%`} OR 
          u.last_name ILIKE ${`%${filters.search}%`} OR 
          u.email ILIKE ${`%${filters.search}%`} OR 
          u.profile_bio ILIKE ${`%${filters.search}%`}
        )` : sql``}
        ${filters.state && filters.state !== "All States" ? sql`AND u.state = ${filters.state}` : sql``}
        ORDER BY u.created_at DESC
        LIMIT ${filters.limit || 50}
        ${filters.offset ? sql`OFFSET ${filters.offset}` : sql``}
      `;
      
      const result = await db.execute(query);
      
      // Transform the result to match our expected format
      return result.rows.map((row: any) => ({
        id: row.id,
        email: row.email,
        password: row.password,
        firstName: row.first_name,
        lastName: row.last_name,
        profileImageUrl: row.profile_image_url,
        phone: row.phone,
        citizenNumber: row.citizen_number,
        onFoundersWall: row.on_founders_wall,
        credibleLevel: row.credible_level,
        state: row.state,
        lga: row.lga,
        profileBio: row.profile_bio,
        kycStatus: row.kyc_status,
        supBalance: row.sup_balance,
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        isFollowing: row.is_following,
        followersCount: Number(row.followers_count || 0),
        followingCount: Number(row.following_count || 0),
      }));
    } catch (error) {
      console.error("Error discovering users:", error);
      return [];
    }
  }

  async followUser(followerId: string, userId: string): Promise<void> {
    try {
      // Check if already following
      const existingConnection = await db
        .select()
        .from(leaderConnections)
        .where(and(
          eq(leaderConnections.requesterUserId, followerId),
          eq(leaderConnections.recipientUserId, userId)
        ))
        .limit(1);
      
      if (existingConnection.length > 0) {
        // Update status to ACCEPTED if exists
        await db
          .update(leaderConnections)
          .set({ 
            status: "ACCEPTED",
            respondedAt: new Date()
          })
          .where(eq(leaderConnections.id, existingConnection[0].id));
      } else {
        // Create new follow connection (auto-accepted for Twitter-style follow)
        await db
          .insert(leaderConnections)
          .values({
            requesterUserId: followerId,
            recipientUserId: userId,
            status: "ACCEPTED",
            connectionType: "PROFESSIONAL",
            message: "Following",
            respondedAt: new Date()
          });
      }
    } catch (error) {
      console.error("Error following user:", error);
      throw error;
    }
  }

  async unfollowUser(followerId: string, userId: string): Promise<void> {
    try {
      // Remove the follow connection
      await db
        .delete(leaderConnections)
        .where(and(
          eq(leaderConnections.requesterUserId, followerId),
          eq(leaderConnections.recipientUserId, userId)
        ));
    } catch (error) {
      console.error("Error unfollowing user:", error);
      throw error;
    }
  }

  async getUserRecommendations(userId: string): Promise<Array<User & { reason?: string }>> {
    try {
      // Smart recommendations based on mutual connections and location
      const query = sql`
        WITH user_info AS (
          SELECT state, lga FROM ${users} WHERE id = ${userId}
        ),
        mutual_connections AS (
          -- People followed by people you follow
          SELECT DISTINCT 
            lc2.recipient_user_id as recommended_user_id,
            COUNT(*) as mutual_count,
            'Followed by people you follow' as reason
          FROM ${leaderConnections} lc1
          JOIN ${leaderConnections} lc2 ON lc1.recipient_user_id = lc2.requester_user_id
          WHERE lc1.requester_user_id = ${userId} 
            AND lc1.status = 'ACCEPTED'
            AND lc2.status = 'ACCEPTED'
            AND lc2.recipient_user_id != ${userId}
            AND lc2.recipient_user_id NOT IN (
              SELECT recipient_user_id FROM ${leaderConnections} 
              WHERE requester_user_id = ${userId} AND status = 'ACCEPTED'
            )
          GROUP BY lc2.recipient_user_id
        ),
        location_based AS (
          -- People from same state/LGA
          SELECT 
            u.id as recommended_user_id,
            1 as mutual_count,
            CASE 
              WHEN u.lga = ui.lga THEN 'From your LGA: ' || u.lga
              ELSE 'From your state: ' || u.state
            END as reason
          FROM ${users} u
          CROSS JOIN user_info ui
          WHERE (u.state = ui.state OR u.lga = ui.lga)
            AND u.id != ${userId}
            AND u.kyc_status = 'APPROVED'
            AND u.id NOT IN (
              SELECT recipient_user_id FROM ${leaderConnections} 
              WHERE requester_user_id = ${userId} AND status = 'ACCEPTED'
            )
          ORDER BY 
            CASE WHEN u.lga = ui.lga THEN 1 ELSE 2 END,
            u.created_at DESC
          LIMIT 10
        ),
        verified_users AS (
          -- Verified users with high credible levels
          SELECT 
            u.id as recommended_user_id,
            1 as mutual_count,
            'Verified Nigerian Leader' as reason
          FROM ${users} u
          WHERE u.kyc_status = 'APPROVED'
            AND u.credible_level >= 2
            AND u.id != ${userId}
            AND u.id NOT IN (
              SELECT recipient_user_id FROM ${leaderConnections} 
              WHERE requester_user_id = ${userId} AND status = 'ACCEPTED'
            )
          ORDER BY u.credible_level DESC, u.created_at DESC
          LIMIT 5
        )
        SELECT 
          u.*,
          COALESCE(mc.reason, lb.reason, vu.reason) as reason
        FROM (
          SELECT recommended_user_id, reason FROM mutual_connections
          UNION ALL
          SELECT recommended_user_id, reason FROM location_based
          UNION ALL
          SELECT recommended_user_id, reason FROM verified_users
        ) recommendations
        JOIN ${users} u ON u.id = recommendations.recommended_user_id
        ORDER BY 
          CASE 
            WHEN recommendations.reason LIKE 'Followed by%' THEN 1
            WHEN recommendations.reason LIKE 'From your LGA%' THEN 2
            WHEN recommendations.reason LIKE 'From your state%' THEN 3
            ELSE 4
          END,
          u.created_at DESC
        LIMIT 10
      `;
      
      const result = await db.execute(query);
      
      return result.rows.map((row: any) => ({
        id: row.id,
        email: row.email,
        password: row.password,
        firstName: row.first_name,
        lastName: row.last_name,
        profileImageUrl: row.profile_image_url,
        phone: row.phone,
        citizenNumber: row.citizen_number,
        onFoundersWall: row.on_founders_wall,
        credibleLevel: row.credible_level,
        state: row.state,
        lga: row.lga,
        profileBio: row.profile_bio,
        kycStatus: row.kyc_status,
        supBalance: row.sup_balance,
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        reason: row.reason,
      }));
    } catch (error) {
      console.error("Error getting user recommendations:", error);
      return [];
    }
  }

  async getActivityFeed(userId: string, limit: number = 20): Promise<Array<any>> {
    try {
      // Activity feed showing recent follows in user's network
      const query = sql`
        SELECT 
          'follow' as activity_type,
          lc.created_at as activity_time,
          follower.first_name as follower_first_name,
          follower.last_name as follower_last_name,
          follower.id as follower_id,
          followed.first_name as followed_first_name,
          followed.last_name as followed_last_name,
          followed.id as followed_id,
          followed.state as followed_state
        FROM ${leaderConnections} lc
        JOIN ${users} follower ON lc.requester_user_id = follower.id
        JOIN ${users} followed ON lc.recipient_user_id = followed.id
        WHERE lc.status = 'ACCEPTED'
          AND lc.created_at >= NOW() - INTERVAL '7 days'
          AND (
            -- Either the follower is someone current user follows
            lc.requester_user_id IN (
              SELECT recipient_user_id FROM ${leaderConnections} 
              WHERE requester_user_id = ${userId} AND status = 'ACCEPTED'
            )
            -- Or the followed person is someone current user follows
            OR lc.recipient_user_id IN (
              SELECT recipient_user_id FROM ${leaderConnections} 
              WHERE requester_user_id = ${userId} AND status = 'ACCEPTED'
            )
            -- Or it's from the same state as current user
            OR (
              follower.state = (SELECT state FROM ${users} WHERE id = ${userId})
              AND followed.state = (SELECT state FROM ${users} WHERE id = ${userId})
            )
          )
          -- Exclude user's own follows
          AND lc.requester_user_id != ${userId}
        ORDER BY lc.created_at DESC
        LIMIT ${limit}
      `;
      
      const result = await db.execute(query);
      
      return result.rows.map((row: any) => ({
        activityType: row.activity_type,
        activityTime: row.activity_time,
        follower: {
          id: row.follower_id,
          firstName: row.follower_first_name,
          lastName: row.follower_last_name,
        },
        followed: {
          id: row.followed_id,
          firstName: row.followed_first_name,
          lastName: row.followed_last_name,
          state: row.followed_state,
        },
      }));
    } catch (error) {
      console.error("Error getting activity feed:", error);
      return [];
    }
  }

  async respondToConnectionRequest(connectionId: string, status: string): Promise<void> {
    try {
      await db
        .update(leaderConnections)
        .set({ 
          status, 
          respondedAt: new Date() 
        })
        .where(eq(leaderConnections.id, connectionId));
    } catch (error) {
      console.error("Error responding to connection request:", error);
      throw error;
    }
  }

  async getRegionalGroups(state?: string): Promise<RegionalGroup[]> {
    try {
      let query = db.select().from(regionalGroups);
      
      const conditions = [eq(regionalGroups.isActive, true)];
      if (state) {
        conditions.push(eq(regionalGroups.state, state));
      }
      
      query = query.where(and(...conditions));
      
      return await query.orderBy(desc(regionalGroups.memberCount));
    } catch (error) {
      console.error("Error getting regional groups:", error);
      throw error;
    }
  }

  async createRegionalGroup(group: Partial<InsertRegionalGroup>): Promise<RegionalGroup> {
    try {
      const [created] = await db
        .insert(regionalGroups)
        .values({
          name: group.name!,
          state: group.state!,
          description: group.description,
          lga: group.lga,
          type: group.type,
          leaderUserId: group.leaderUserId
        })
        .returning();
      return created;
    } catch (error) {
      console.error("Error creating regional group:", error);
      throw error;
    }
  }

  async joinRegionalGroup(groupId: string, userId: string): Promise<void> {
    try {
      await db.insert(regionalGroupMembers).values({
        groupId,
        userId
      });
      
      // Update member count
      await db
        .update(regionalGroups)
        .set({ 
          memberCount: sql`${regionalGroups.memberCount} + 1` 
        })
        .where(eq(regionalGroups.id, groupId));
    } catch (error) {
      console.error("Error joining regional group:", error);
      throw error;
    }
  }

  // Forum operations
  async getForumCategories(): Promise<ForumCategory[]> {
    try {
      return await db
        .select()
        .from(forumCategories)
        .where(eq(forumCategories.isActive, true))
        .orderBy(forumCategories.name);
    } catch (error) {
      console.error("Error getting forum categories:", error);
      throw error;
    }
  }

  async createForumCategory(category: InsertForumCategory): Promise<ForumCategory> {
    try {
      const [created] = await db
        .insert(forumCategories)
        .values(category)
        .returning();
      return created;
    } catch (error) {
      console.error("Error creating forum category:", error);
      throw error;
    }
  }

  async getForumThreads(categoryId?: string, limit: number = 20): Promise<ForumThread[]> {
    try {
      let conditions = [];
      
      if (categoryId) {
        conditions.push(eq(forumThreads.categoryId, categoryId));
      }
      
      const query = db.select().from(forumThreads);
      
      if (conditions.length > 0) {
        return await query
          .where(and(...conditions))
          .orderBy(desc(forumThreads.isPinned), desc(forumThreads.lastReplyAt))
          .limit(limit);
      } else {
        return await query
          .orderBy(desc(forumThreads.isPinned), desc(forumThreads.lastReplyAt))
          .limit(limit);
      }
    } catch (error) {
      console.error("Error getting forum threads:", error);
      throw error;
    }
  }

  async createForumThread(thread: InsertForumThread): Promise<ForumThread> {
    try {
      const [created] = await db
        .insert(forumThreads)
        .values(thread)
        .returning();
      return created;
    } catch (error) {
      console.error("Error creating forum thread:", error);
      throw error;
    }
  }

  async getForumThread(threadId: string): Promise<ForumThread | undefined> {
    try {
      const [thread] = await db
        .select()
        .from(forumThreads)
        .where(eq(forumThreads.id, threadId));
      return thread;
    } catch (error) {
      console.error("Error getting forum thread:", error);
      throw error;
    }
  }

  async getForumReplies(threadId: string): Promise<ForumReply[]> {
    try {
      const replies = await db
        .select()
        .from(forumReplies)
        .where(eq(forumReplies.threadId, threadId))
        .orderBy(forumReplies.createdAt);
      return replies;
    } catch (error) {
      console.error("Error getting forum replies:", error);
      throw error;
    }
  }

  async createForumReply(reply: InsertForumReply): Promise<ForumReply> {
    try {
      const [created] = await db
        .insert(forumReplies)
        .values(reply)
        .returning();
      
      // Update thread stats
      await this.updateThreadStats(reply.threadId);
      
      return created;
    } catch (error) {
      console.error("Error creating forum reply:", error);
      throw error;
    }
  }

  async updateThreadStats(threadId: string): Promise<void> {
    try {
      const replyCount = await db
        .select({ count: sql`count(*)` })
        .from(forumReplies)
        .where(eq(forumReplies.threadId, threadId));

      const lastReplyResult = await db
        .select()
        .from(forumReplies)
        .where(eq(forumReplies.threadId, threadId))
        .orderBy(desc(forumReplies.createdAt))
        .limit(1);
      
      const lastReply = lastReplyResult[0];

      await db
        .update(forumThreads)
        .set({
          replyCount: replyCount[0].count as number,
          lastReplyAt: lastReply?.createdAt || null,
          lastReplyUserId: lastReply?.authorUserId || null,
        })
        .where(eq(forumThreads.id, threadId));
    } catch (error) {
      console.error("Error updating thread stats:", error);
      throw error;
    }
  }

  // Enhanced verification system
  async getCandidateEndorsements(candidateId: string): Promise<CandidateEndorsement[]> {
    try {
      return await db
        .select()
        .from(candidateEndorsements)
        .where(eq(candidateEndorsements.candidateId, candidateId))
        .orderBy(desc(candidateEndorsements.createdAt));
    } catch (error) {
      console.error("Error getting candidate endorsements:", error);
      throw error;
    }
  }

  async createEndorsement(endorsement: InsertCandidateEndorsement): Promise<CandidateEndorsement> {
    try {
      const [created] = await db
        .insert(candidateEndorsements)
        .values(endorsement)
        .returning();
      return created;
    } catch (error) {
      console.error("Error creating endorsement:", error);
      throw error;
    }
  }

  async getAchievementBadges(): Promise<AchievementBadge[]> {
    try {
      return await db
        .select()
        .from(achievementBadges)
        .where(eq(achievementBadges.isActive, true))
        .orderBy(achievementBadges.category, achievementBadges.rarity);
    } catch (error) {
      console.error("Error getting achievement badges:", error);
      throw error;
    }
  }

  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    try {
      return await db
        .select()
        .from(userAchievements)
        .where(eq(userAchievements.userId, userId))
        .orderBy(desc(userAchievements.earnedAt));
    } catch (error) {
      console.error("Error getting user achievements:", error);
      throw error;
    }
  }

  async awardAchievement(userId: string, badgeId: string, supEarned: string, notes?: string): Promise<UserAchievement> {
    try {
      const [achievement] = await db
        .insert(userAchievements)
        .values({
          userId,
          badgeId,
          supEarned,
          notes,
        })
        .returning();
      return achievement;
    } catch (error) {
      console.error("Error awarding achievement:", error);
      throw error;
    }
  }

  // Events and meetups
  async getNetworkingEvents(state?: string, eventType?: string): Promise<NetworkingEvent[]> {
    try {
      // Use raw SQL with proper formatting for the actual database columns
      let query = `
        SELECT 
          id,
          organizer_user_id,
          title,
          description,
          event_type,
          state,
          location,
          start_time,
          end_time,
          max_attendees,
          current_attendees,
          status,
          created_at
        FROM networking_events
      `;
      
      const conditions = [];
      if (state) conditions.push(`state = '${state}'`);
      if (eventType) conditions.push(`event_type = '${eventType}'`);
      
      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
      }
      
      query += ` ORDER BY start_time`;
      
      const result = await db.execute(sql.raw(query));
      
      // Map the raw results to expected format
      return (result.rows as any[]).map(row => ({
        id: row.id,
        organizerUserId: row.organizer_user_id,
        title: row.title,
        description: row.description,
        eventType: row.event_type,
        state: row.state,
        location: row.location,
        startTime: row.start_time,
        endTime: row.end_time,
        maxAttendees: row.max_attendees,
        attendeeCount: row.current_attendees,
        status: row.status,
        createdAt: row.created_at,
        // Add default values for missing fields the UI expects
        isVirtual: row.location === 'Virtual' || row.location?.includes('Virtual'),
        lga: row.location
      }));
    } catch (error) {
      console.error("Error getting networking events:", error);
      throw error;
    }
  }

  async createNetworkingEvent(event: InsertNetworkingEvent): Promise<NetworkingEvent> {
    try {
      const [created] = await db
        .insert(networkingEvents)
        .values(event)
        .returning();
      return created;
    } catch (error) {
      console.error("Error creating networking event:", error);
      throw error;
    }
  }

  async getEventRegistrations(eventId: string): Promise<EventRegistration[]> {
    try {
      return await db
        .select()
        .from(eventRegistrations)
        .where(eq(eventRegistrations.eventId, eventId))
        .orderBy(eventRegistrations.registeredAt);
    } catch (error) {
      console.error("Error getting event registrations:", error);
      throw error;
    }
  }

  async registerForEvent(registration: InsertEventRegistration): Promise<EventRegistration> {
    try {
      const [created] = await db
        .insert(eventRegistrations)
        .values(registration)
        .returning();
      return created;
    } catch (error) {
      console.error("Error registering for event:", error);
      throw error;
    }
  }

  async updateEventAttendance(registrationId: string, attended: boolean): Promise<void> {
    try {
      await db
        .update(eventRegistrations)
        .set({
          status: attended ? "ATTENDED" : "NO_SHOW",
          attendedAt: attended ? new Date() : null,
        })
        .where(eq(eventRegistrations.id, registrationId));
    } catch (error) {
      console.error("Error updating event attendance:", error);
      throw error;
    }
  }

  async updateEventStatus(eventId: string, status: string): Promise<void> {
    try {
      await db
        .update(networkingEvents)
        .set({ status: status as any })
        .where(eq(networkingEvents.id, eventId));
    } catch (error) {
      console.error("Error updating event status:", error);
      throw error;
    }
  }

  // Mentorship system
  async getMentorshipPrograms(): Promise<MentorshipProgram[]> {
    try {
      return await db
        .select()
        .from(mentorshipPrograms)
        .where(eq(mentorshipPrograms.isActive, true))
        .orderBy(mentorshipPrograms.name);
    } catch (error) {
      console.error("Error getting mentorship programs:", error);
      throw error;
    }
  }

  async createMentorshipProgram(program: InsertMentorshipProgram): Promise<MentorshipProgram> {
    try {
      const [created] = await db
        .insert(mentorshipPrograms)
        .values(program)
        .returning();
      return created;
    } catch (error) {
      console.error("Error creating mentorship program:", error);
      throw error;
    }
  }

  async getMentorshipMatches(userId: string): Promise<MentorshipMatch[]> {
    try {
      return await db
        .select()
        .from(mentorshipMatches)
        .where(
          sql`(${mentorshipMatches.mentorUserId} = ${userId} OR ${mentorshipMatches.menteeUserId} = ${userId})`
        )
        .orderBy(desc(mentorshipMatches.createdAt));
    } catch (error) {
      console.error("Error getting mentorship matches:", error);
      throw error;
    }
  }

  async createMentorshipMatch(match: InsertMentorshipMatch): Promise<MentorshipMatch> {
    try {
      const [created] = await db
        .insert(mentorshipMatches)
        .values(match)
        .returning();
      return created;
    } catch (error) {
      console.error("Error creating mentorship match:", error);
      throw error;
    }
  }

  async updateMentorshipStatus(matchId: string, status: string): Promise<void> {
    try {
      await db
        .update(mentorshipMatches)
        .set({ status })
        .where(eq(mentorshipMatches.id, matchId));
    } catch (error) {
      console.error("Error updating mentorship status:", error);
      throw error;
    }
  }

  // Progress tracking
  async getProgressMilestones(category?: string, state?: string): Promise<ProgressMilestone[]> {
    try {
      const conditions = [];
      if (category) conditions.push(eq(progressMilestones.category, category));
      if (state) conditions.push(eq(progressMilestones.state, state));
      
      const query = db.select().from(progressMilestones);
      
      if (conditions.length > 0) {
        return await query
          .where(and(...conditions))
          .orderBy(progressMilestones.createdAt);
      } else {
        return await query.orderBy(progressMilestones.createdAt);
      }
    } catch (error) {
      console.error("Error getting progress milestones:", error);
      throw error;
    }
  }

  async updateMilestoneProgress(milestoneId: string, currentNumber: number): Promise<void> {
    try {
      await db
        .update(progressMilestones)
        .set({ currentNumber })
        .where(eq(progressMilestones.id, milestoneId));
    } catch (error) {
      console.error("Error updating milestone progress:", error);
      throw error;
    }
  }

  // Candidate Q&A system
  async getCandidateQuestions(candidateId: string): Promise<CandidateQuestion[]> {
    try {
      return await db
        .select()
        .from(candidateQuestions)
        .where(eq(candidateQuestions.candidateId, candidateId))
        .orderBy(desc(candidateQuestions.upvotes), desc(candidateQuestions.createdAt));
    } catch (error) {
      console.error("Error getting candidate questions:", error);
      throw error;
    }
  }

  async createCandidateQuestion(question: InsertCandidateQuestion): Promise<CandidateQuestion> {
    try {
      const [created] = await db
        .insert(candidateQuestions)
        .values(question)
        .returning();
      return created;
    } catch (error) {
      console.error("Error creating candidate question:", error);
      throw error;
    }
  }

  async getCandidateAnswers(questionId: string): Promise<CandidateAnswer[]> {
    try {
      return await db
        .select()
        .from(candidateAnswers)
        .where(eq(candidateAnswers.questionId, questionId))
        .orderBy(desc(candidateAnswers.upvotes), candidateAnswers.createdAt);
    } catch (error) {
      console.error("Error getting candidate answers:", error);
      throw error;
    }
  }

  async createCandidateAnswer(answer: InsertCandidateAnswer): Promise<CandidateAnswer> {
    try {
      const [created] = await db
        .insert(candidateAnswers)
        .values(answer)
        .returning();
      return created;
    } catch (error) {
      console.error("Error creating candidate answer:", error);
      throw error;
    }
  }

  // Training implementations
  async getTrainingPrograms(): Promise<any[]> {
    // Mock training programs for now - this would come from database
    return [
      {
        id: "leadership-fundamentals",
        title: "Leadership Fundamentals",
        description: "Essential leadership skills for community organizers and civic leaders",
        category: "Leadership",
        level: "beginner",
        totalModules: 8,
        completedModules: 0,
        estimatedHours: 12,
        enrolledCount: 245,
        completionRate: 78,
        modules: [
          {
            id: "mod-1",
            title: "Introduction to Leadership",
            description: "Understanding different leadership styles",
            type: "video",
            duration: 45,
            orderIndex: 1,
            isCompleted: false
          },
          {
            id: "mod-2", 
            title: "Communication Skills",
            description: "Effective communication for leaders",
            type: "reading",
            duration: 60,
            orderIndex: 2,
            isCompleted: false
          }
        ],
        isEnrolled: false,
        progress: 0,
        certificate: {
          isEligible: false,
          isIssued: false
        }
      },
      {
        id: "governance-accountability",
        title: "Governance & Accountability",
        description: "Understanding democratic governance and accountability mechanisms",
        category: "Governance",
        level: "intermediate",
        totalModules: 10,
        completedModules: 0,
        estimatedHours: 16,
        enrolledCount: 189,
        completionRate: 65,
        modules: [],
        isEnrolled: false,
        progress: 0,
        certificate: {
          isEligible: false,
          isIssued: false
        }
      },
      {
        id: "community-organizing",
        title: "Community Organizing",
        description: "Building grassroots movements and community engagement",
        category: "Community Development",
        level: "intermediate",
        totalModules: 6,
        completedModules: 0,
        estimatedHours: 10,
        enrolledCount: 156,
        completionRate: 82,
        modules: [],
        isEnrolled: false,
        progress: 0,
        certificate: {
          isEligible: false,
          isIssued: false
        }
      }
    ];
  }

  async getUserTrainingProgress(userId: string): Promise<any> {
    // Mock user progress - this would come from database
    return {
      enrolledPrograms: 2,
      completedModules: 8,
      totalHours: 15,
      certificates: 1
    };
  }

  async enrollInTrainingProgram(userId: string, programId: string): Promise<any> {
    // Mock enrollment - this would insert into database
    return {
      id: `enrollment-${Date.now()}`,
      userId,
      programId,
      enrolledAt: new Date(),
      progress: 0
    };
  }

  async completeTrainingModule(userId: string, programId: string, moduleId: string, score?: number): Promise<any> {
    // Mock module completion - this would update database
    return {
      id: `completion-${Date.now()}`,
      userId,
      programId,
      moduleId,
      score: score || 85,
      completedAt: new Date()
    };
  }

  // Geography implementations
  async getLGAData(filters: { state?: string; zone?: string; status?: string }): Promise<any[]> {
    // Mock LGA data for all 774 LGAs - this would come from database
    const mockLGAs = [
      {
        id: "ng-lagos-alimosho",
        name: "Alimosho",
        state: "Lagos",
        zone: "South West",
        candidates: 45,
        deployed: 23,
        population: 1288714,
        coverage: 68,
        status: "ACTIVE",
        keyMetrics: {
          integrity: 85,
          competence: 78,
          commitment: 92
        }
      },
      {
        id: "ng-lagos-ikeja",
        name: "Ikeja",
        state: "Lagos",
        zone: "South West",
        candidates: 38,
        deployed: 19,
        population: 313196,
        coverage: 56,
        status: "ACTIVE",
        keyMetrics: {
          integrity: 82,
          competence: 88,
          commitment: 76
        }
      },
      {
        id: "ng-kano-municipal",
        name: "Kano Municipal",
        state: "Kano",
        zone: "North West",
        candidates: 52,
        deployed: 31,
        population: 365525,
        coverage: 89,
        status: "COMPLETE",
        keyMetrics: {
          integrity: 91,
          competence: 85,
          commitment: 94
        }
      },
      {
        id: "ng-rivers-portharcourt",
        name: "Port Harcourt",
        state: "Rivers",
        zone: "South South",
        candidates: 41,
        deployed: 15,
        population: 541115,
        coverage: 43,
        status: "ACTIVE",
        keyMetrics: {
          integrity: 73,
          competence: 81,
          commitment: 87
        }
      },
      {
        id: "ng-kaduna-kaduna-north",
        name: "Kaduna North",
        state: "Kaduna",
        zone: "North Central",
        candidates: 27,
        deployed: 8,
        population: 364575,
        coverage: 29,
        status: "PENDING",
        keyMetrics: {
          integrity: 68,
          competence: 72,
          commitment: 79
        }
      },
      {
        id: "ng-anambra-awka-south",
        name: "Awka South",
        state: "Anambra",
        zone: "South East",
        candidates: 33,
        deployed: 18,
        population: 189320,
        coverage: 64,
        status: "ACTIVE",
        keyMetrics: {
          integrity: 87,
          competence: 83,
          commitment: 89
        }
      },
      {
        id: "ng-sokoto-sokoto-north",
        name: "Sokoto North",
        state: "Sokoto",
        zone: "North West",
        candidates: 12,
        deployed: 3,
        population: 214299,
        coverage: 18,
        status: "PENDING",
        keyMetrics: {
          integrity: 65,
          competence: 58,
          commitment: 71
        }
      },
      {
        id: "ng-borno-maiduguri",
        name: "Maiduguri",
        state: "Borno",
        zone: "North East",
        candidates: 0,
        deployed: 0,
        population: 1112449,
        coverage: 0,
        status: "NO_COVERAGE",
        keyMetrics: {
          integrity: 0,
          competence: 0,
          commitment: 0
        }
      }
    ];

    // Apply filters
    return mockLGAs.filter(lga => {
      if (filters.state && filters.state !== "All States" && lga.state !== filters.state) return false;
      if (filters.zone && filters.zone !== "All Zones" && lga.zone !== filters.zone) return false;
      if (filters.status && filters.status !== "All Status" && lga.status !== filters.status) return false;
      return true;
    });
  }

  async getGeographyStats(): Promise<any> {
    // Mock geography statistics - this would come from database
    return {
      totalLGAs: 774,
      lgasWithCandidates: 234,
      lgasWithDeployedLeaders: 156,
      deployedLeaders: 2847,
      overallCoverage: 22
    };
  }







  async voteOnForumReply(replyId: string, userId: string, voteType: 'up' | 'down'): Promise<void> {
    // Mock voting - this would update database
    console.log(`User ${userId} voted ${voteType} on reply ${replyId}`);
  }

  // Events implementations
  async getEvents(filters: { eventType?: string; state?: string; status?: string }): Promise<any[]> {
    // Mock events - this would come from database
    const allEvents = [
      {
        id: "event-1",
        organizerUserId: "user-1",
        title: "Lagos State Healthcare Town Hall",
        description: "Community discussion on improving healthcare infrastructure and services across Lagos State. We'll discuss current challenges, proposed solutions, and how citizens can contribute to better healthcare outcomes.",
        eventType: "TOWNHALL",
        venue: "Lagos State University Auditorium",
        state: "Lagos",
        lga: "Ojo",
        isVirtual: false,
        virtualLink: null,
        startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(), // 3 hours later
        maxAttendees: 500,
        attendeeCount: 127,
        registrationDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: "UPCOMING",
        tags: ["healthcare", "infrastructure", "community"],
        supReward: "10",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        organizer: {
          firstName: "Dr. Adebayo",
          lastName: "Ogundimu"
        }
      },
      {
        id: "event-2",
        organizerUserId: "user-2",
        title: "Digital Leadership Workshop",
        description: "Learn essential digital skills for modern civic leadership including social media engagement, online community building, and digital campaign strategies.",
        eventType: "WORKSHOP",
        venue: null,
        state: "FCT",
        lga: null,
        isVirtual: true,
        virtualLink: "https://zoom.us/j/123456789",
        startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
        endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(), // 4 hours later
        maxAttendees: 100,
        attendeeCount: 78,
        registrationDeadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: "UPCOMING",
        tags: ["digital-skills", "leadership", "workshop"],
        supReward: "15",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        organizer: {
          firstName: "Chioma",
          lastName: "Okwu"
        }
      },
      {
        id: "event-3",
        organizerUserId: "user-3",
        title: "Youth in Politics Training",
        description: "Comprehensive training program for young Nigerians interested in political participation. Covers electoral processes, policy development, and grassroots organizing.",
        eventType: "TRAINING",
        venue: "University of Nigeria, Nsukka",
        state: "Enugu",
        lga: "Nsukka",
        isVirtual: false,
        virtualLink: null,
        startTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
        endTime: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000).toISOString(), // 3 days program
        maxAttendees: 150,
        attendeeCount: 89,
        registrationDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        status: "UPCOMING",
        tags: ["youth", "politics", "training", "electoral-process"],
        supReward: "25",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        organizer: {
          firstName: "Fatima",
          lastName: "Ahmad"
        }
      },
      {
        id: "event-4",
        organizerUserId: "user-4",
        title: "Northern Nigeria Leaders Network",
        description: "Networking event for civic leaders from northern Nigeria to share experiences, build connections, and coordinate regional initiatives.",
        eventType: "NETWORKING",
        venue: "Arewa House, Kaduna",
        state: "Kaduna",
        lga: "Kaduna North",
        isVirtual: false,
        virtualLink: null,
        startTime: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 3 weeks from now
        endTime: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(), // 6 hours event
        maxAttendees: 200,
        attendeeCount: 145,
        registrationDeadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
        status: "UPCOMING",
        tags: ["networking", "northern-nigeria", "leaders"],
        supReward: "12",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        organizer: {
          firstName: "Ibrahim",
          lastName: "Musa"
        }
      },
      {
        id: "event-5",
        organizerUserId: "user-5",
        title: "Community Development Forum",
        description: "Completed forum on community-driven development projects. Great discussions on sustainable development and local empowerment.",
        eventType: "TOWNHALL",
        venue: "Port Harcourt Community Center",
        state: "Rivers",
        lga: "Port Harcourt",
        isVirtual: false,
        virtualLink: null,
        startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
        endTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
        maxAttendees: 300,
        attendeeCount: 267,
        registrationDeadline: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        status: "COMPLETED",
        tags: ["community-development", "sustainable-development"],
        supReward: "8",
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        organizer: {
          firstName: "Blessing",
          lastName: "Ezeh"
        },
        userRegistration: {
          status: "ATTENDED",
          rating: 5
        }
      }
    ];

    // Apply filters
    return allEvents.filter(event => {
      if (filters.eventType && filters.eventType !== "ALL" && event.eventType !== filters.eventType) return false;
      if (filters.state && filters.state !== "ALL" && event.state !== filters.state) return false;
      if (filters.status && filters.status !== "ALL" && event.status !== filters.status) return false;
      return true;
    });
  }

  async createEvent(event: any): Promise<any> {
    const [result] = await db
      .insert(networkingEvents)
      .values({
        title: event.title,
        description: event.description,
        eventType: event.eventType,
        state: event.state,
        location: event.location,
        startTime: new Date(event.startTime),
        endTime: new Date(event.endTime),
        maxAttendees: event.maxAttendees || 100,
        currentAttendees: 0,
        status: 'UPCOMING'
      })
      .returning();
    return result;
  }

  async updateEvent(eventId: string, updateData: any): Promise<void> {
    await db
      .update(networkingEvents)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(networkingEvents.id, eventId));
  }

  async deleteEvent(eventId: string): Promise<void> {
    await db
      .delete(networkingEvents)
      .where(eq(networkingEvents.id, eventId));
  }

  async getEvent(eventId: string): Promise<any> {
    // Mock event retrieval - this would come from database
    const events = await this.getEvents({});
    return events.find(event => event.id === eventId);
  }


  async markEventAttendance(eventId: string, userId: string, data: { rating?: number; feedback?: string }): Promise<void> {
    // Mock attendance marking - this would update database
    console.log(`User ${userId} attended event ${eventId} with rating ${data.rating}`);
  }
  // User milestones and citizenship tracking
  async getCitizenshipStats(): Promise<CitizenshipStats | undefined> {
    const [stats] = await db.select().from(citizenshipStats);
    return stats;
  }

  async updateCitizenshipStats(updates: Partial<CitizenshipStats>): Promise<void> {
    await db
      .update(citizenshipStats)
      .set({ ...updates, updatedAt: new Date() })
      .where(sql`true`); // Update the single row
  }

  async getUserMilestones(): Promise<UserMilestone[]> {
    return await db.select().from(userMilestones).orderBy(userMilestones.milestoneNumber);
  }

  async checkAndAwardMilestones(citizenNumber: number): Promise<void> {
    // Get all milestones that this citizen number has reached
    const milestones = await db
      .select()
      .from(userMilestones)
      .where(
        and(
          eq(userMilestones.milestoneNumber, citizenNumber),
          sql`achieved_at IS NULL`
        )
      );

    // Award each milestone
    for (const milestone of milestones) {
      await db
        .update(userMilestones)
        .set({ achievedAt: new Date() })
        .where(eq(userMilestones.id, milestone.id));

      console.log(`🎉 MILESTONE ACHIEVED! Citizen #${citizenNumber} reached: ${milestone.title}`);
    }
  }

  // Enhanced Training and Learning Management methods
  async getTrainingModules(): Promise<TrainingModule[]> {
    return await db.select().from(trainingModules)
      .where(eq(trainingModules.isActive, true))
      .orderBy(trainingModules.order);
  }

  async getTrainingModule(moduleId: string): Promise<TrainingModule | undefined> {
    const [module] = await db.select().from(trainingModules)
      .where(eq(trainingModules.id, moduleId));
    return module;
  }

  async getTrainingProgress(userId: string, moduleId: string): Promise<UserTrainingProgress | undefined> {
    const [progress] = await db.select().from(userTrainingProgress)
      .where(
        and(
          eq(userTrainingProgress.userId, userId),
          eq(userTrainingProgress.moduleId, moduleId)
        )
      );
    return progress;
  }

  async updateTrainingProgress(userId: string, moduleId: string, progressData: Partial<InsertUserTrainingProgress>): Promise<UserTrainingProgress> {
    // Check if progress record exists
    const existingProgress = await this.getTrainingProgress(userId, moduleId);
    
    if (existingProgress) {
      // Update existing progress
      await db.update(userTrainingProgress)
        .set({
          ...progressData,
          // Set completedAt if status is COMPLETED and not already set
          completedAt: progressData.status === 'COMPLETED' && !existingProgress.completedAt 
            ? new Date() 
            : existingProgress.completedAt
        })
        .where(eq(userTrainingProgress.id, existingProgress.id));
      
      return await this.getTrainingProgress(userId, moduleId) as UserTrainingProgress;
    } else {
      // Create new progress record
      const [newProgress] = await db.insert(userTrainingProgress)
        .values({
          userId,
          moduleId,
          status: 'IN_PROGRESS',
          startedAt: new Date(),
          ...progressData,
          completedAt: progressData.status === 'COMPLETED' ? new Date() : undefined
        })
        .returning();
      
      return newProgress;
    }
  }

  async submitQuiz(userId: string, moduleId: string, quizData: any): Promise<any> {
    const { answers, score } = quizData;
    
    // Update training progress with quiz score
    await this.updateTrainingProgress(userId, moduleId, { 
      score,
      status: score >= 70 ? 'COMPLETED' : 'IN_PROGRESS'
    });

    // Store individual quiz answers for analysis
    const module = await this.getTrainingModule(moduleId);
    if (module) {
      // Get quiz questions for this module
      const quizQuestions = await db.select().from(trainingQuizzes)
        .where(eq(trainingQuizzes.moduleId, moduleId))
        .orderBy(trainingQuizzes.order);

      // Store answers
      for (const [questionId, answer] of Object.entries(answers)) {
        const question = quizQuestions.find(q => q.id === questionId);
        if (question) {
          await db.insert(userQuizAnswers).values({
            userId,
            quizId: question.id,
            selectedAnswer: typeof answer === 'string' ? parseInt(answer) : answer as number,
            isCorrect: answer === question.correctAnswer
          });
        }
      }
    }

    return { score, passed: score >= 70 };
  }

  async getUserCertificates(userId: string): Promise<any[]> {
    // Get completed training modules with their details
    const completedModules = await db
      .select({
        moduleId: userTrainingProgress.moduleId,
        score: userTrainingProgress.score,
        completedAt: userTrainingProgress.completedAt,
        moduleTitle: trainingModules.title,
        moduleDifficulty: trainingModules.difficulty,
        supReward: trainingModules.supReward
      })
      .from(userTrainingProgress)
      .innerJoin(trainingModules, eq(userTrainingProgress.moduleId, trainingModules.id))
      .where(
        and(
          eq(userTrainingProgress.userId, userId),
          eq(userTrainingProgress.status, 'COMPLETED')
        )
      );

    return completedModules.map(module => ({
      id: `cert-${module.moduleId}`,
      moduleId: module.moduleId,
      moduleTitle: module.moduleTitle,
      difficulty: module.moduleDifficulty,
      score: module.score,
      supEarned: module.supReward,
      issuedAt: module.completedAt,
      certificateUrl: `/api/training/certificates/${module.moduleId}/download`
    }));
  }

  async generateCertificate(userId: string, moduleId: string): Promise<any> {
    const progress = await this.getTrainingProgress(userId, moduleId);
    const module = await this.getTrainingModule(moduleId);
    const user = await this.getUser(userId);

    if (!progress?.completedAt || !module || !user) {
      throw new Error('Certificate not available');
    }

    return {
      id: `cert-${moduleId}-${userId}`,
      userId,
      moduleId,
      userName: `${user.firstName} ${user.lastName}`.trim() || user.email,
      moduleTitle: module.title,
      difficulty: module.difficulty,
      score: progress.score,
      supEarned: module.supReward,
      issuedAt: progress.completedAt,
      certificateNumber: `SUN-CERT-${moduleId.slice(-6).toUpperCase()}-${userId.slice(-6).toUpperCase()}`,
      downloadUrl: `/api/training/certificates/${moduleId}/download`
    };
  }

  async getUserLearningAnalytics(userId: string): Promise<any> {
    // Get user's training progress
    const progressRecords = await db
      .select({
        moduleId: userTrainingProgress.moduleId,
        status: userTrainingProgress.status,
        score: userTrainingProgress.score,
        timeSpent: userTrainingProgress.timeSpent,
        completedAt: userTrainingProgress.completedAt,
        moduleTitle: trainingModules.title,
        moduleDifficulty: trainingModules.difficulty,
        moduleType: trainingModules.type
      })
      .from(userTrainingProgress)
      .innerJoin(trainingModules, eq(userTrainingProgress.moduleId, trainingModules.id))
      .where(eq(userTrainingProgress.userId, userId));

    const totalModules = await db.select().from(trainingModules)
      .where(eq(trainingModules.isActive, true));

    const completedModules = progressRecords.filter(p => p.status === 'COMPLETED');
    const inProgressModules = progressRecords.filter(p => p.status === 'IN_PROGRESS');
    
    const totalTimeSpent = progressRecords.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
    const averageScore = completedModules.length > 0 
      ? completedModules.reduce((sum, p) => sum + (p.score || 0), 0) / completedModules.length 
      : 0;

    return {
      totalModulesAvailable: totalModules.length,
      completedModules: completedModules.length,
      inProgressModules: inProgressModules.length,
      totalTimeSpent, // in minutes
      averageScore: Math.round(averageScore),
      completionRate: Math.round((completedModules.length / totalModules.length) * 100),
      strongestArea: this.getStrongestLearningArea(completedModules),
      recentActivity: completedModules
        .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
        .slice(0, 5)
        .map(module => ({
          moduleTitle: module.moduleTitle,
          score: module.score,
          completedAt: module.completedAt
        }))
    };
  }

  private getStrongestLearningArea(completedModules: any[]): string {
    if (completedModules.length === 0) return 'None yet';
    
    const areaScores: Record<string, { total: number; count: number }> = {};
    
    completedModules.forEach(module => {
      const area = module.moduleType || 'General';
      if (!areaScores[area]) {
        areaScores[area] = { total: 0, count: 0 };
      }
      areaScores[area].total += module.score || 0;
      areaScores[area].count += 1;
    });

    const areas = Object.entries(areaScores).map(([area, data]) => ({
      area,
      average: data.total / data.count
    }));

    const strongest = areas.reduce((max, current) => 
      current.average > max.average ? current : max
    );

    return strongest.area;
  }

  async getTrainingRecommendations(userId: string): Promise<TrainingModule[]> {
    // Get user's completed modules and learning patterns
    const userProgress = await db
      .select({
        moduleId: userTrainingProgress.moduleId,
        score: userTrainingProgress.score,
        moduleType: trainingModules.type,
        moduleDifficulty: trainingModules.difficulty
      })
      .from(userTrainingProgress)
      .innerJoin(trainingModules, eq(userTrainingProgress.moduleId, trainingModules.id))
      .where(
        and(
          eq(userTrainingProgress.userId, userId),
          eq(userTrainingProgress.status, 'COMPLETED')
        )
      );

    const completedModuleIds = userProgress.map(p => p.moduleId);
    
    // Get all available modules that user hasn't completed
    const availableModules = await db
      .select()
      .from(trainingModules)
      .where(
        and(
          eq(trainingModules.isActive, true),
          sql`${trainingModules.id} NOT IN ${completedModuleIds.length > 0 ? completedModuleIds : ['']}`
        )
      )
      .orderBy(trainingModules.order);

    // Simple recommendation logic - recommend next modules in sequence
    // and modules matching user's strongest learning areas
    const strongestArea = this.getStrongestLearningArea(userProgress);
    
    return availableModules
      .filter(module => {
        // Recommend modules in user's strongest area or next in sequence
        return module.type === strongestArea || 
               !module.prerequisiteModuleId || 
               completedModuleIds.includes(module.prerequisiteModuleId);
      })
      .slice(0, 5); // Return top 5 recommendations
  }

  async addSupTokens(userId: string, amount: number, reason: string, referenceId?: string): Promise<void> {
    const wallet = await this.getWallet(userId);
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    // Update wallet balance
    const newBalance = (parseFloat(wallet.supBalance || '0') + amount).toString();
    await this.updateWalletBalance(userId, newBalance, wallet.ngnEscrow || '0');

    // Create transaction record
    await this.createTransaction({
      userId,
      type: 'EARNED',
      amountSUP: amount.toString(),
      amountNGN: '0',
      meta: JSON.stringify({
        description: reason,
        referenceId,
        status: 'COMPLETED'
      })
    });
  }
  
  // Donation operations
  async createDonation(donation: InsertDonation): Promise<Donation> {
    const [result] = await db
      .insert(donations)
      .values(donation)
      .returning();
    return result;
  }
  
  async getDonationsForProject(projectId: string): Promise<Donation[]> {
    return await db
      .select()
      .from(donations)
      .where(and(
        eq(donations.projectId, projectId),
        eq(donations.status, 'COMPLETED')
      ))
      .orderBy(desc(donations.createdAt));
  }
  
  async getDonationsByUser(userId: string): Promise<Donation[]> {
    return await db
      .select()
      .from(donations)
      .where(eq(donations.userId, userId))
      .orderBy(desc(donations.createdAt));
  }
  
  async getTopDonors(limit = 10): Promise<Array<{userId: string, totalDonated: string, donationCount: number}>> {
    // Use raw SQL to handle the varchar to numeric conversion
    const result = await db.execute(sql`
      SELECT 
        user_id,
        COALESCE(SUM(amount_ngn::numeric), 0) as total_donated,
        COUNT(*) as donation_count
      FROM donations
      WHERE status = 'COMPLETED'
      GROUP BY user_id
      ORDER BY SUM(amount_ngn::numeric) DESC
      LIMIT ${limit}
    `);
    
    return result.rows.map((row: any) => ({
      userId: row.user_id,
      totalDonated: row.total_donated?.toString() || '0',
      donationCount: Number(row.donation_count) || 0
    }));
  }
  
  async updateProjectFunding(projectId: string, amount: string): Promise<void> {
    await db
      .update(projects)
      .set({
        raisedNGN: sql`${projects.raisedNGN} + ${amount}`,
        donorCount: sql`${projects.donorCount} + 1`
      })
      .where(eq(projects.id, projectId));
  }
  
  async processDonation(donationId: string, paymentReference: string): Promise<void> {
    const donation = await db
      .select()
      .from(donations)
      .where(eq(donations.id, donationId))
      .limit(1);
    
    if (!donation[0]) {
      throw new Error('Donation not found');
    }
    
    // Update donation status
    await db
      .update(donations)
      .set({
        status: 'COMPLETED',
        paymentReference,
        processedAt: new Date()
      })
      .where(eq(donations.id, donationId));
    
    // Update project funding
    await this.updateProjectFunding(donation[0].projectId!, donation[0].amountNGN!);
    
    // Update user donor stats
    await db
      .update(users)
      .set({
        totalDonated: sql`${users.totalDonated} + ${donation[0].amountNGN}`,
        donationCount: sql`${users.donationCount} + 1`
      })
      .where(eq(users.id, donation[0].userId!));
    
    // Create transaction record
    await this.createTransaction({
      userId: donation[0].userId!,
      type: 'DONATION',
      amountNGN: donation[0].amountNGN!,
      amountSUP: '0',
      meta: JSON.stringify({
        projectId: donation[0].projectId,
        donationId,
        paymentReference
      })
    });
  }
  
  // Project update operations
  async createProjectUpdate(update: InsertProjectUpdate): Promise<ProjectUpdate> {
    const [result] = await db
      .insert(projectUpdates)
      .values(update)
      .returning();
    return result;
  }
  
  async getProjectUpdates(projectId: string): Promise<ProjectUpdate[]> {
    return await db
      .select()
      .from(projectUpdates)
      .where(eq(projectUpdates.projectId, projectId))
      .orderBy(desc(projectUpdates.createdAt));
  }
  
  // Enhanced project operations
  async getProjectById(projectId: string): Promise<Project | undefined> {
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);
    return project;
  }
  
  async getProjectsByStatus(status: string): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.status, status))
      .orderBy(desc(projects.createdAt));
  }
  
  async updateProject(projectId: string, data: Partial<InsertProject>): Promise<Project> {
    const [result] = await db
      .update(projects)
      .set(data)
      .where(eq(projects.id, projectId))
      .returning();
    return result;
  }
  
  async deleteProject(projectId: string): Promise<void> {
    await db
      .delete(projects)
      .where(eq(projects.id, projectId));
  }
  
  async getFundingAnalytics(): Promise<{totalRaised: string, projectsFunded: number, averageDonation: string}> {
    const [fundingStats] = await db
      .select({
        totalRaised: sql<string>`COALESCE(SUM(CAST(${donations.amountNGN} AS DECIMAL)), 0)::text`,
        donationCount: count(donations.id)
      })
      .from(donations)
      .where(eq(donations.status, 'COMPLETED'));
    
    const [projectStats] = await db
      .select({
        projectsFunded: count(projects.id)
      })
      .from(projects)
      .where(eq(projects.status, 'FUNDED'));
    
    const totalRaised = fundingStats?.totalRaised || '0';
    const donationCount = Number(fundingStats?.donationCount) || 0;
    const averageDonation = donationCount > 0 ? (parseFloat(totalRaised) / donationCount).toString() : '0';
    
    return {
      totalRaised,
      projectsFunded: Number(projectStats?.projectsFunded) || 0,
      averageDonation
    };
  }

  // Password reset operations
  async createPasswordResetToken(userId: string, token: string, expiresAt: Date): Promise<void> {
    await db
      .insert(passwordResetTokens)
      .values({
        userId,
        token,
        expiresAt,
        used: false
      });
  }

  async getPasswordResetToken(token: string): Promise<{userId: string, expiresAt: Date, used: boolean} | undefined> {
    const [result] = await db
      .select({
        userId: passwordResetTokens.userId,
        expiresAt: passwordResetTokens.expiresAt,
        used: passwordResetTokens.used
      })
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token));
    return result ? {
      userId: result.userId,
      expiresAt: result.expiresAt,
      used: result.used || false
    } : undefined;
  }

  async markPasswordResetTokenAsUsed(token: string): Promise<void> {
    await db
      .update(passwordResetTokens)
      .set({ used: true })
      .where(eq(passwordResetTokens.token, token));
  }

  async cleanupExpiredPasswordResetTokens(): Promise<void> {
    await db
      .delete(passwordResetTokens)
      .where(sql`${passwordResetTokens.expiresAt} < NOW()`);
  }

  // ================================
  // CAMPUS PROFILE SYSTEM IMPLEMENTATION
  // ================================
  
  async createCampusProfile(userId: string, profileData: {
    institutionType: string;
    institutionName: string;
    customInstitutionName?: string;
    state: string;
    leadershipPosition: string;
    faculty?: string;
    department?: string;
    yearOfStudy?: string;
    graduationYear?: string;
    leadership_experience: string;
    civic_interests: string;
    phone: string;
    whatsapp?: string;
    social_media?: string;
    goals: string;
  }): Promise<void> {
    // First, update user profile with campus information
    await db
      .update(users)
      .set({
        phone: profileData.phone,
        state: profileData.state,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));

    // Find or create institution
    const institutionName = profileData.customInstitutionName || profileData.institutionName;
    let [institution] = await db
      .select()
      .from(institutions)
      .where(and(
        eq(institutions.name, institutionName),
        eq(institutions.state, profileData.state)
      ));

    if (!institution) {
      [institution] = await db
        .insert(institutions)
        .values({
          name: institutionName,
          shortName: institutionName.split(' ').map(word => word.charAt(0)).join(''),
          type: profileData.institutionType.toUpperCase() as any,
          state: profileData.state,
          lga: 'TBD', // To be determined later
          isActive: true
        })
        .returning();
    }

    // Find or create campus community (faculty/department)
    let communityId = null;
    if (profileData.faculty) {
      let [community] = await db
        .select()
        .from(campusCommunities)
        .where(and(
          eq(campusCommunities.institutionId, institution.id),
          eq(campusCommunities.name, profileData.faculty),
          eq(campusCommunities.type, 'FACULTY')
        ));

      if (!community) {
        [community] = await db
          .insert(campusCommunities)
          .values({
            institutionId: institution.id,
            name: profileData.faculty,
            type: 'FACULTY',
            isActive: true
          })
          .returning();
      }
      communityId = community.id;
    }

    // Create institution membership
    await db
      .insert(institutionMemberships)
      .values({
        userId,
        institutionId: institution.id,
        communityId,
        position: profileData.leadershipPosition.toUpperCase().replace(' ', '_') as any,
        graduationYear: profileData.graduationYear ? parseInt(profileData.graduationYear) : null,
        isVerified: false // Will be verified later
      })
      .onConflictDoUpdate({
        target: [institutionMemberships.userId, institutionMemberships.institutionId],
        set: {
          communityId,
          position: profileData.leadershipPosition.toUpperCase().replace(' ', '_') as any,
          graduationYear: profileData.graduationYear ? parseInt(profileData.graduationYear) : null
        }
      });

    // Add SUP tokens reward for creating campus profile
    await this.addSupTokens(userId, 500, 'Campus Profile Creation', `profile-${userId}`);
  }

  async getCampusProfile(userId: string): Promise<any | undefined> {
    const [membership] = await db
      .select({
        membership: institutionMemberships,
        institution: institutions,
        community: campusCommunities,
        user: users
      })
      .from(institutionMemberships)
      .leftJoin(institutions, eq(institutionMemberships.institutionId, institutions.id))
      .leftJoin(campusCommunities, eq(institutionMemberships.communityId, campusCommunities.id))
      .leftJoin(users, eq(institutionMemberships.userId, users.id))
      .where(eq(institutionMemberships.userId, userId));

    return membership ? {
      ...membership.membership,
      institution: membership.institution,
      community: membership.community,
      user: membership.user
    } : undefined;
  }

  async updateCampusProfile(userId: string, profileData: any): Promise<void> {
    // Update user information
    await db
      .update(users)
      .set({
        phone: profileData.phone,
        state: profileData.state,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));

    // Update institution membership if needed
    if (profileData.leadershipPosition || profileData.graduationYear) {
      await db
        .update(institutionMemberships)
        .set({
          position: profileData.leadershipPosition?.toUpperCase().replace(' ', '_') as any,
          graduationYear: profileData.graduationYear ? parseInt(profileData.graduationYear) : null
        })
        .where(eq(institutionMemberships.userId, userId));
    }
  }

  async getInstitutions(filters?: { type?: string; state?: string }): Promise<Institution[]> {
    let query = db.select().from(institutions).where(eq(institutions.isActive, true));

    const conditions = [];
    if (filters?.type) {
      conditions.push(eq(institutions.type, filters.type as any));
    }
    if (filters?.state) {
      conditions.push(eq(institutions.state, filters.state));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(asc(institutions.name));
  }

  async getCampusCommunities(institutionId: string): Promise<CampusCommunity[]> {
    return await db
      .select()
      .from(campusCommunities)
      .where(and(
        eq(campusCommunities.institutionId, institutionId),
        eq(campusCommunities.isActive, true)
      ))
      .orderBy(asc(campusCommunities.name));
  }

  async getCampusLeaders(filters?: { 
    institutionType?: string; 
    state?: string; 
    position?: string; 
  }): Promise<Array<User & { institutionName?: string; position?: string }>> {
    let query = db
      .select({
        user: users,
        institutionName: institutions.name,
        position: institutionMemberships.position
      })
      .from(users)
      .innerJoin(institutionMemberships, eq(users.id, institutionMemberships.userId))
      .innerJoin(institutions, eq(institutionMemberships.institutionId, institutions.id))
      .where(eq(institutionMemberships.isVerified, true));

    const conditions = [];
    if (filters?.institutionType) {
      conditions.push(eq(institutions.type, filters.institutionType as any));
    }
    if (filters?.state) {
      conditions.push(eq(institutions.state, filters.state));
    }
    if (filters?.position) {
      conditions.push(eq(institutionMemberships.position, filters.position as any));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query.orderBy(asc(users.firstName), asc(users.lastName));
    
    return results.map(result => ({
      ...result.user,
      institutionName: result.institutionName,
      position: result.position
    }));
  }
  
  // Session Management Implementation
  async getActiveSession(userId: string): Promise<ActiveSession | undefined> {
    const [session] = await db.select().from(activeSessions).where(eq(activeSessions.userId, userId));
    return session;
  }
  
  async createActiveSession(sessionData: InsertActiveSession): Promise<ActiveSession> {
    // Remove any existing session first
    await db.delete(activeSessions).where(eq(activeSessions.userId, sessionData.userId));
    
    const [session] = await db.insert(activeSessions).values({
      ...sessionData,
      lastActivity: new Date(),
      warningShown: false
    }).returning();
    return session;
  }
  
  async updateSessionActivity(userId: string, extensionMs = 0): Promise<void> {
    const now = new Date();
    const updateTime = extensionMs > 0 ? new Date(now.getTime() + extensionMs) : now;
    
    await db
      .update(activeSessions)
      .set({ 
        lastActivity: updateTime,
        warningShown: false // Reset warning when activity is updated
      })
      .where(eq(activeSessions.userId, userId));
  }
  
  async updateSessionWarning(userId: string, warningShown: boolean): Promise<void> {
    await db
      .update(activeSessions)
      .set({ warningShown })
      .where(eq(activeSessions.userId, userId));
  }
  
  async deactivateSession(userId: string): Promise<void> {
    await db.delete(activeSessions).where(eq(activeSessions.userId, userId));
  }
  
  // Enhanced Audit Logging Implementation
  async createAuditLog(log: { userId: string; action: string; details: string; ipAddress?: string; userAgent?: string; metadata?: any }): Promise<void> {
    await db
      .insert(auditLogs)
      .values({
        actor: log.userId,
        action: log.action,
        payloadJson: JSON.stringify({
          details: log.details,
          ipAddress: log.ipAddress,
          userAgent: log.userAgent,
          ...log.metadata
        })
      });
  }

  // Notification operations
  async createNotification(notification: any): Promise<any> {
    const [newNotification] = await db
      .insert(notifications)
      .values(notification)
      .returning();
    return newNotification;
  }

  async getUserNotifications(userId: string, limit: number = 50): Promise<any[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(limit);
  }

  async markNotificationRead(notificationId: string): Promise<void> {
    await db
      .update(notifications)
      .set({ readAt: new Date() })
      .where(eq(notifications.id, notificationId));
  }

  async getUnreadNotificationCount(userId: string): Promise<number> {
    const [result] = await db
      .select({ count: sql`count(*)` })
      .from(notifications)
      .where(and(
        eq(notifications.userId, userId),
        isNull(notifications.readAt)
      ));
    return Number(result?.count) || 0;
  }

  // Push subscription operations
  async createPushSubscription(subscription: any): Promise<any> {
    const [newSubscription] = await db
      .insert(pushSubscriptions)
      .values(subscription)
      .returning();
    return newSubscription;
  }

  async getUserPushSubscriptions(userId: string): Promise<any[]> {
    return await db
      .select()
      .from(pushSubscriptions)
      .where(and(
        eq(pushSubscriptions.userId, userId),
        eq(pushSubscriptions.isActive, true)
      ));
  }

  async deletePushSubscription(userId: string, endpoint: string): Promise<void> {
    await db
      .update(pushSubscriptions)
      .set({ isActive: false })
      .where(and(
        eq(pushSubscriptions.userId, userId),
        eq(pushSubscriptions.endpoint, endpoint)
      ));
  }

  async getAllActivePushSubscriptions(): Promise<any[]> {
    return await db
      .select({
        id: pushSubscriptions.id,
        userId: pushSubscriptions.userId,
        endpoint: pushSubscriptions.endpoint,
        p256dh: pushSubscriptions.p256dh,
        auth: pushSubscriptions.auth
      })
      .from(pushSubscriptions)
      .where(eq(pushSubscriptions.isActive, true));
  }
}

export const storage = new DatabaseStorage();
