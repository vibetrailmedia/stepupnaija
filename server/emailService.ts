import { MailService } from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY!);

interface EmailParams {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  templateData?: any;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  // In development mode, log email content instead of sending
  const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
  console.log(`🔧 Environment check - NODE_ENV: ${process.env.NODE_ENV}, isDevelopment: ${isDevelopment}`);
  
  if (isDevelopment) {
    console.log('📧 [DEV MODE] Email would be sent:');
    console.log(`To: ${params.to}`);
    console.log(`Subject: ${params.subject}`);
    if (params.text) console.log(`Text: ${params.text}`);
    if (params.html) {
      // Extract reset link from HTML for easy access
      const linkMatch = params.html.match(/href="([^"]*reset-password[^"]*)"/) || params.html.match(/https?:\/\/[^\s<>]+reset-password[^\s<>]*/);
      if (linkMatch) {
        console.log(`🔗 Reset Link: ${linkMatch[1] || linkMatch[0]}`);
      }
    }
    console.log('💡 Check console for reset link in development mode');
    return true;
  }

  try {
    await mailService.send({
      to: params.to,
      from: 'noreply@stepupnaija.org', // Replace with your verified sender
      subject: params.subject,
      text: params.text,
      html: params.html || '',
    });
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

// Email templates for different notification types
export const EmailTemplates = {
  kycApproved: (userName: string) => ({
    subject: 'KYC Verification Approved - Step Up Naija',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #16a34a; margin: 0;">KYC Verification Approved!</h1>
        </div>
        
        <p>Dear ${userName},</p>
        
        <p>Congratulations! Your Know Your Customer (KYC) verification has been successfully approved.</p>
        
        <div style="background-color: #f0fdf4; border: 1px solid #16a34a; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #16a34a; margin-top: 0;">What's Next?</h3>
          <ul style="margin: 10px 0;">
            <li>Access premium civic engagement tasks</li>
            <li>Higher SUP token rewards</li>
            <li>🏆 Exclusive Civic Rewards Draws and opportunities</li>
            <li>Advanced analytics and insights</li>
          </ul>
        </div>
        
        <p>Ready to step up your civic participation? <a href="https://stepupnaija.org/engage" style="color: #16a34a; text-decoration: none; font-weight: bold;">Start engaging now!</a></p>
        
        <p>Best regards,<br>The Step Up Naija Team</p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="font-size: 12px; color: #6b7280; text-align: center;">
          Step Up Naija - Empowering Nigerian Civic Participation
        </p>
      </div>
    `,
    text: `Dear ${userName},\n\nCongratulations! Your KYC verification has been approved.\n\nYou now have access to:\n- Premium civic engagement tasks\n- Higher SUP token rewards\n- Exclusive Civic Rewards Draws\n- Advanced analytics\n\nStart engaging: https://stepupnaija.org/engage\n\nBest regards,\nThe Step Up Naija Team`
  }),

  kycRejected: (userName: string, reason?: string) => ({
    subject: 'KYC Verification Update - Step Up Naija',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #dc2626; margin: 0;">KYC Verification Update</h1>
        </div>
        
        <p>Dear ${userName},</p>
        
        <p>We've reviewed your KYC verification submission. Unfortunately, we need additional information before we can approve your verification.</p>
        
        ${reason ? `
        <div style="background-color: #fef2f2; border: 1px solid #dc2626; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #dc2626; margin-top: 0;">Reason for Review:</h3>
          <p style="margin: 10px 0;">${reason}</p>
        </div>
        ` : ''}
        
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #0ea5e9; margin-top: 0;">Next Steps:</h3>
          <ul style="margin: 10px 0;">
            <li>Review your submitted documents</li>
            <li>Update any incorrect information</li>
            <li>Resubmit your KYC verification</li>
          </ul>
        </div>
        
        <p>Ready to resubmit? <a href="https://stepupnaija.org/kyc" style="color: #0ea5e9; text-decoration: none; font-weight: bold;">Update your KYC here!</a></p>
        
        <p>Best regards,<br>The Step Up Naija Team</p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="font-size: 12px; color: #6b7280; text-align: center;">
          Step Up Naija - Empowering Nigerian Civic Participation
        </p>
      </div>
    `,
    text: `Dear ${userName},\n\nYour KYC verification needs additional review.\n\n${reason ? `Reason: ${reason}\n\n` : ''}Please update your information and resubmit: https://stepupnaija.org/kyc\n\nBest regards,\nThe Step Up Naija Team`
  }),

  prizeWon: (userName: string, prizeAmount: string, prizeTier: number) => ({
    subject: '🏆 Congratulations! You Won a Prize - Step Up Naija',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #f59e0b; margin: 0;">🎉 YOU WON! 🎉</h1>
        </div>
        
        <p>Dear ${userName},</p>
        
        <p>Fantastic news! You've won a prize in this week's Step Up Naija Civic Rewards Draw!</p>
        
        <div style="background-color: #fffbeb; border: 2px solid #f59e0b; border-radius: 12px; padding: 30px; margin: 20px 0; text-align: center;">
          <h2 style="color: #f59e0b; margin: 0 0 10px 0;">Prize Details</h2>
          <div style="font-size: 24px; font-weight: bold; color: #92400e;">
            ₦${parseInt(prizeAmount).toLocaleString()} SUP
          </div>
          <div style="font-size: 14px; color: #92400e; margin-top: 5px;">
            Tier ${prizeTier} Prize Winner
          </div>
        </div>
        
        <div style="background-color: #f0fdf4; border: 1px solid #16a34a; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #16a34a; margin-top: 0;">What's Next?</h3>
          <ul style="margin: 10px 0;">
            <li>💰 Your prize has been added to your wallet</li>
            <li>Keep engaging to enter next week's Civic Rewards Draw</li>
            <li>Check your updated balance on the dashboard</li>
            <li>Convert SUP to NGN for cashout</li>
          </ul>
        </div>
        
        <p>Keep up the great civic engagement! <a href="https://stepupnaija.org" style="color: #16a34a; text-decoration: none; font-weight: bold;">View your dashboard</a></p>
        
        <p>Congratulations again,<br>The Step Up Naija Team</p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="font-size: 12px; color: #6b7280; text-align: center;">
          Step Up Naija - Empowering Nigerian Civic Participation
        </p>
      </div>
    `,
    text: `Dear ${userName},\n\nCongratulations! You won ₦${parseInt(prizeAmount).toLocaleString()} SUP in this week's Step Up Naija Civic Rewards Draw!\n\nTier ${prizeTier} Prize Winner\n\nYour prize has been added to your wallet. Keep engaging to enter next week's Civic Rewards Draw!\n\nView your dashboard: https://stepupnaija.org\n\nCongratulations,\nThe Step Up Naija Team`
  }),

  taskCompleted: (userName: string, taskTitle: string, rewardAmount: string) => ({
    subject: 'Task Completed & SUP Earned - Step Up Naija',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #16a34a; margin: 0;">Task Completed Successfully!</h1>
        </div>
        
        <p>Dear ${userName},</p>
        
        <p>Great job! Your civic engagement task has been reviewed and approved.</p>
        
        <div style="background-color: #f0fdf4; border: 1px solid #16a34a; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #16a34a; margin-top: 0;">Task Details</h3>
          <p style="margin: 5px 0;"><strong>Task:</strong> ${taskTitle}</p>
          <p style="margin: 5px 0;"><strong>Reward Earned:</strong> ${rewardAmount} SUP</p>
          <p style="margin: 5px 0;"><strong>Status:</strong> ✅ Approved</p>
        </div>
        
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #0ea5e9; margin-top: 0;">Keep Going!</h3>
          <ul style="margin: 10px 0;">
            <li>Complete more tasks for additional SUP</li>
            <li>Your SUP automatically enters you in Civic Rewards Draws</li>
            <li>🏆 Build your civic engagement profile</li>
            <li>Unlock achievement badges</li>
          </ul>
        </div>
        
        <p>Ready for your next civic challenge? <a href="https://stepupnaija.org/engage" style="color: #16a34a; text-decoration: none; font-weight: bold;">Browse available tasks!</a></p>
        
        <p>Keep stepping up,<br>The Step Up Naija Team</p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="font-size: 12px; color: #6b7280; text-align: center;">
          Step Up Naija - Empowering Nigerian Civic Participation
        </p>
      </div>
    `,
    text: `Dear ${userName},\n\nGreat job! Your task "${taskTitle}" has been approved.\n\nReward Earned: ${rewardAmount} SUP\n\nYour SUP automatically enters you in Civic Rewards Draws. Keep completing tasks to earn more!\n\nBrowse tasks: https://stepupnaija.org/engage\n\nKeep stepping up,\nThe Step Up Naija Team`
  }),

  welcomeEmail: (userName: string) => ({
    subject: '🇳🇬 Welcome to Step Up Naija - Start Your Civic Journey!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #16a34a; margin: 0;">Welcome to Step Up Naija!</h1>
          <p style="color: #6b7280; font-size: 18px;">Empowering Nigerian Civic Participation</p>
        </div>
        
        <p>Dear ${userName},</p>
        
        <p>Welcome to Nigeria's premier civic engagement platform! We're excited to have you join our community of citizens working together to build a better Nigeria.</p>
        
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #0ea5e9; margin-top: 0;">Getting Started</h3>
          <ol style="margin: 10px 0;">
            <li><strong>Complete your profile</strong> - Add your information</li>
            <li><strong>Verify your identity</strong> - Complete KYC for premium features</li>
            <li><strong>Start engaging</strong> - Complete civic tasks and earn SUP tokens</li>
            <li>🏆 <strong>Enter Civic Rewards Draws</strong> - Your SUP automatically enters you to win prizes</li>
          </ol>
        </div>
        
        <div style="background-color: #fffbeb; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #f59e0b; margin-top: 0;">How Step Up Naija Works</h3>
          <ul style="margin: 10px 0;">
            <li>🎯 Complete civic engagement tasks (quizzes, surveys, community actions)</li>
            <li>🪙 Earn SUP tokens for each completed task</li>
            <li>🎟️ Every SUP token gives you entries in Civic Rewards Draws</li>
            <li>🏆 Win real cash prizes while building a better Nigeria</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://stepupnaija.org/engage" style="background-color: #16a34a; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Start Your First Task</a>
        </div>
        
        <p>Questions? Our team is here to help. Together, we're building a more engaged Nigeria!</p>
        
        <p>Welcome aboard,<br>The Step Up Naija Team</p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="font-size: 12px; color: #6b7280; text-align: center;">
          Step Up Naija - Empowering Nigerian Civic Participation
        </p>
      </div>
    `,
    text: `Dear ${userName},\n\nWelcome to Step Up Naija - Nigeria's premier civic engagement platform!\n\nGetting Started:\n1. Complete your profile\n2. Verify your identity (KYC)\n3. Start engaging with civic tasks\n4. Earn SUP tokens and enter Civic Rewards Draws\n\nHow it works:\n- Complete civic tasks (quizzes, surveys, community actions)\n- Earn SUP tokens for each task\n- SUP tokens automatically enter you in Civic Rewards Draws\n- Win real cash prizes while building a better Nigeria\n\nStart your first task: https://stepupnaija.org/engage\n\nWelcome aboard,\nThe Step Up Naija Team`
  }),

  milestoneAchieved: (userName: string, milestone: string, reward: string) => ({
    subject: `🎯 Milestone Achieved: ${milestone}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #f59e0b; margin: 0;">🏆 Milestone Achieved!</h1>
        </div>
        
        <p>Dear ${userName},</p>
        
        <p>Outstanding achievement! You've reached a significant milestone in your civic engagement journey.</p>
        
        <div style="background-color: #fffbeb; border: 2px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
          <h3 style="color: #f59e0b; margin: 0 0 10px 0;">🎯 ${milestone}</h3>
          <p style="color: #92400e; margin: 0; font-size: 18px; font-weight: bold;">Reward: ${reward}</p>
        </div>
        
        <p>Your dedication to building a better Nigeria is making a real difference!</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://stepupnaija.org/progress" style="background-color: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">View Your Progress</a>
        </div>
        
        <p>Keep stepping up,<br>The Step Up Naija Team</p>
      </div>
    `,
    text: `Dear ${userName},\n\nOutstanding achievement! You've reached the milestone: ${milestone}\n\nReward: ${reward}\n\nYour dedication to building a better Nigeria is making a real difference!\n\nView your progress: https://stepupnaija.org/progress\n\nKeep stepping up,\nThe Step Up Naija Team`
  }),

  passwordReset: (userName: string, resetLink: string) => ({
    subject: '🔐 Password Reset Request - Step Up Naija',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #dc2626; margin: 0;">🔐 Password Reset</h1>
        </div>
        
        <p>Dear ${userName},</p>
        
        <p>We received a request to reset your password for your Step Up Naija account.</p>
        
        <div style="background-color: #fef2f2; border: 1px solid #dc2626; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #dc2626; margin-top: 0;">Reset Your Password</h3>
          <p style="margin: 10px 0;">Click the button below to reset your password. This link will expire in 1 hour for security.</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${resetLink}" style="background-color: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
          </div>
        </div>
        
        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0;">
          <p style="color: #92400e; margin: 0; font-size: 14px;">
            <strong>Security Notice:</strong> If you didn't request this password reset, please ignore this email and your password will remain unchanged.
          </p>
        </div>
        
        <p>For account security, this reset link will expire in 1 hour.</p>
        
        <p>Best regards,<br>The Step Up Naija Security Team</p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="font-size: 12px; color: #6b7280; text-align: center;">
          Step Up Naija - Empowering Nigerian Civic Participation
        </p>
      </div>
    `,
    text: `Dear ${userName},\n\nWe received a request to reset your password for your Step Up Naija account.\n\nReset your password: ${resetLink}\n\nThis link will expire in 1 hour for security.\n\nIf you didn't request this reset, please ignore this email.\n\nBest regards,\nThe Step Up Naija Security Team`
  }),

  credibleBadgeEarned: (userName: string, badgeLevel: number) => ({
    subject: `🏅 Credible Nigerian Badge Level ${badgeLevel} Earned!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #7c3aed; margin: 0;">🏅 Credible Badge Earned!</h1>
        </div>
        
        <p>Dear ${userName},</p>
        
        <p>Exceptional work! You've earned your Level ${badgeLevel} Credible Nigerian Badge.</p>
        
        <div style="background-color: #f3e8ff; border: 2px solid #7c3aed; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #7c3aed; margin: 0 0 10px 0; text-align: center;">
            Level ${badgeLevel} Credible Nigerian Badge
          </h3>
          <p style="color: #6b21a8; margin: 0; text-align: center;">
            ${badgeLevel === 1 ? 'Verified Credible Nigerian' : badgeLevel === 2 ? 'Trained Credible Nigerian' : 'Civic Leader'}
          </p>
        </div>
        
        ${badgeLevel === 3 ? `
          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #92400e; margin: 0; text-align: center; font-weight: bold;">
              🎯 You're now eligible for the #13kCredibleChallenge leadership opportunities!
            </p>
          </div>
        ` : ''}
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://stepupnaija.org/verification" style="background-color: #7c3aed; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">View Your Badge</a>
        </div>
        
        <p>Leading by example,<br>The Step Up Naija Team</p>
      </div>
    `,
    text: `Dear ${userName},\n\nExceptional work! You've earned your Level ${badgeLevel} Credible Nigerian Badge.\n\n${badgeLevel === 1 ? 'Verified Credible Nigerian' : badgeLevel === 2 ? 'Trained Credible Nigerian' : 'Civic Leader'}\n\n${badgeLevel === 3 ? 'You\'re now eligible for the #13kCredibleChallenge leadership opportunities!\n\n' : ''}View your badge: https://stepupnaija.org/verification\n\nLeading by example,\nThe Step Up Naija Team`
  }),

  weeklyReminder: (userName: string) => ({
    subject: '🇳🇬 Your Weekly Civic Action Reminder',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #16a34a; margin: 0;">🇳🇬 Time for Action!</h1>
        </div>
        
        <p>Dear ${userName},</p>
        
        <p>It's time for your weekly civic engagement! Small actions create big changes for Nigeria.</p>
        
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #0ea5e9; margin: 0 0 15px 0;">This Week's Opportunities:</h3>
          <ul style="color: #075985; margin: 0; padding-left: 20px;">
            <li>Complete civic engagement tasks (5-10 SUP each)</li>
            <li>Vote on community projects</li>
            <li>Join forum discussions</li>
            <li>Enter the weekly prize draw</li>
            <li>Share your achievements</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://stepupnaija.org/dashboard" style="background-color: #16a34a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Take Action Now</a>
        </div>
        
        <p>Every civic action counts. Together, we are the change Nigeria needs!</p>
        
        <p>Stay engaged,<br>The Step Up Naija Team</p>
      </div>
    `,
    text: `Dear ${userName},\n\n🇳🇬 Time for your weekly civic engagement! Small actions create big changes for Nigeria.\n\nThis Week's Opportunities:\n- Complete civic engagement tasks (5-10 SUP each)\n- Vote on community projects\n- Join forum discussions\n- Enter the weekly prize draw\n- Share your achievements\n\nTake action now: https://stepupnaija.org/dashboard\n\nEvery civic action counts. Together, we are the change Nigeria needs!\n\nStay engaged,\nThe Step Up Naija Team`
  })
};

// Notification service for different events
export class NotificationService {
  static async sendKYCApprovalEmail(userEmail: string, userName: string): Promise<boolean> {
    const template = EmailTemplates.kycApproved(userName);
    return await sendEmail({
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text
    });
  }

  static async sendKYCRejectionEmail(userEmail: string, userName: string, reason?: string): Promise<boolean> {
    const template = EmailTemplates.kycRejected(userName, reason);
    return await sendEmail({
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text
    });
  }

  static async sendPrizeWinEmail(userEmail: string, userName: string, prizeAmount: string, prizeTier: number): Promise<boolean> {
    const template = EmailTemplates.prizeWon(userName, prizeAmount, prizeTier);
    return await sendEmail({
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text
    });
  }

  static async sendTaskCompletionEmail(userEmail: string, userName: string, taskTitle: string, rewardAmount: string): Promise<boolean> {
    const template = EmailTemplates.taskCompleted(userName, taskTitle, rewardAmount);
    return await sendEmail({
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text
    });
  }

  static async sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean> {
    const template = EmailTemplates.welcomeEmail(userName);
    return await sendEmail({
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text
    });
  }

  static async sendMilestoneEmail(userEmail: string, userName: string, milestone: string, reward: string): Promise<boolean> {
    const template = EmailTemplates.milestoneAchieved(userName, milestone, reward);
    return await sendEmail({
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text
    });
  }

  static async sendCredibleBadgeEmail(userEmail: string, userName: string, badgeLevel: number): Promise<boolean> {
    const template = EmailTemplates.credibleBadgeEarned(userName, badgeLevel);
    return await sendEmail({
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text
    });
  }

  static async sendWeeklyReminderEmail(userEmail: string, userName: string): Promise<boolean> {
    const template = EmailTemplates.weeklyReminder(userName);
    return await sendEmail({
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text
    });
  }
}