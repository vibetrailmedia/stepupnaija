import twilio from 'twilio';

interface SMSConfig {
  accountSid: string;
  authToken: string;
  phoneNumber: string;
}

export interface SMSMessage {
  to: string;
  message: string;
  type?: 'verification' | 'notification' | 'reminder' | 'alert';
}

export interface SMSCommand {
  keyword: string;
  action: string;
  userId?: string;
  parameters?: string[];
}

export class SMSService {
  private client: twilio.Twilio | null = null;
  private config: SMSConfig | null = null;

  constructor() {
    this.initializeClient();
  }

  private initializeClient(): void {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

    if (accountSid && authToken && phoneNumber) {
      this.config = { accountSid, authToken, phoneNumber };
      this.client = twilio(accountSid, authToken);
      console.log('✅ SMS service initialized successfully');
    } else {
      console.log('⚠️ SMS service not configured - missing Twilio credentials');
    }
  }

  async sendSMS(message: SMSMessage): Promise<boolean> {
    if (!this.client || !this.config) {
      console.error('SMS service not configured');
      return false;
    }

    try {
      const result = await this.client.messages.create({
        body: message.message,
        from: this.config.phoneNumber,
        to: message.to
      });

      console.log(`✅ SMS sent to ${message.to}: ${result.sid}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to send SMS:', error);
      return false;
    }
  }

  // Parse incoming SMS commands for civic engagement
  parseIncomingSMS(body: string, from: string): SMSCommand | null {
    const text = body.trim().toUpperCase();
    const parts = text.split(' ');
    const keyword = parts[0];

    switch (keyword) {
      case 'REGISTER':
        return {
          keyword: 'REGISTER',
          action: 'register_citizen',
          parameters: parts.slice(1) // Additional registration info
        };

      case 'BALANCE':
        return {
          keyword: 'BALANCE',
          action: 'check_sup_balance'
        };

      case 'VOTE':
        return {
          keyword: 'VOTE',
          action: 'cast_vote',
          parameters: parts.slice(1) // Project ID and vote (YES/NO)
        };

      case 'EVENTS':
        return {
          keyword: 'EVENTS',
          action: 'list_events',
          parameters: parts.slice(1) // State filter if provided
        };

      case 'JOIN':
        return {
          keyword: 'JOIN',
          action: 'join_event',
          parameters: parts.slice(1) // Event ID
        };

      case 'TASKS':
        return {
          keyword: 'TASKS',
          action: 'list_tasks'
        };

      case 'COMPLETE':
        return {
          keyword: 'COMPLETE',
          action: 'complete_task',
          parameters: parts.slice(1) // Task ID
        };

      case 'HELP':
        return {
          keyword: 'HELP',
          action: 'show_help'
        };

      case 'STATUS':
        return {
          keyword: 'STATUS',
          action: 'show_status'
        };

      case 'LEADERS':
        return {
          keyword: 'LEADERS',
          action: 'list_leaders',
          parameters: parts.slice(1) // LGA filter if provided
        };

      default:
        return null;
    }
  }

  // Generate appropriate SMS responses for civic engagement actions
  generateResponse(command: SMSCommand, result: any): string {
    switch (command.action) {
      case 'register_citizen':
        if (result.success) {
          return `Welcome to Step Up Naija! Your citizen number is ${result.citizenNumber}. Reply HELP for commands.`;
        }
        return 'Registration failed. Please ensure you provided valid information. Reply HELP for assistance.';

      case 'check_sup_balance':
        return `Your SUP token balance: ${result.balance} tokens. You've earned ${result.totalEarned} tokens through civic engagement.`;

      case 'cast_vote':
        if (result.success) {
          return `Vote recorded! You voted ${result.vote} on project "${result.projectTitle}". Thank you for participating in democracy.`;
        }
        return `Vote failed: ${result.error}. Format: VOTE [PROJECT_ID] YES/NO`;

      case 'list_events':
        if (result.events && result.events.length > 0) {
          const eventList = result.events
            .slice(0, 3) // Limit to 3 events for SMS
            .map((event: any, index: number) => 
              `${index + 1}. ${event.title} - ${event.date} (ID: ${event.id})`
            )
            .join('\n');
          return `Upcoming civic events:\n${eventList}\n\nReply JOIN [ID] to register.`;
        }
        return 'No upcoming events in your area. Check back later or visit our website.';

      case 'join_event':
        if (result.success) {
          return `Successfully registered for "${result.eventTitle}" on ${result.date}. Location: ${result.location}`;
        }
        return `Failed to register: ${result.error}`;

      case 'list_tasks':
        if (result.tasks && result.tasks.length > 0) {
          const taskList = result.tasks
            .slice(0, 3)
            .map((task: any, index: number) => 
              `${index + 1}. ${task.title} - ${task.reward} SUP (ID: ${task.id})`
            )
            .join('\n');
          return `Available civic tasks:\n${taskList}\n\nReply COMPLETE [ID] when done.`;
        }
        return 'No tasks available right now. Check back later for new opportunities.';

      case 'complete_task':
        if (result.success) {
          return `Task completed! You earned ${result.reward} SUP tokens. Your new balance: ${result.newBalance} SUP.`;
        }
        return `Task completion failed: ${result.error}`;

      case 'list_leaders':
        if (result.leaders && result.leaders.length > 0) {
          const leaderList = result.leaders
            .slice(0, 3)
            .map((leader: any, index: number) => 
              `${index + 1}. ${leader.name} - ${leader.position} (${leader.lga})`
            )
            .join('\n');
          return `Credible leaders in your area:\n${leaderList}`;
        }
        return 'No credible leaders found in your area. Be the first to earn credible status!';

      case 'show_status':
        return `Your Step Up Naija status:
Credible Level: ${result.credibleLevel}
SUP Balance: ${result.balance} tokens
Tasks Completed: ${result.tasksCompleted}
Events Attended: ${result.eventsAttended}
Civic Score: ${result.civicScore}/100`;

      case 'show_help':
        return `Step Up Naija SMS Commands:
REGISTER - Sign up as citizen
BALANCE - Check SUP tokens  
VOTE [ID] YES/NO - Vote on projects
EVENTS - List civic events
JOIN [ID] - Register for event
TASKS - List available tasks
COMPLETE [ID] - Mark task done
LEADERS - List credible leaders
STATUS - Your civic profile
HELP - Show this menu`;

      default:
        return 'Invalid command. Reply HELP for available commands.';
    }
  }

  // Civic engagement specific SMS notifications
  async sendVotingReminder(phoneNumber: string, projectTitle: string, deadline: Date): Promise<void> {
    const deadlineStr = deadline.toLocaleDateString('en-NG');
    await this.sendSMS({
      to: phoneNumber,
      message: `🗳️ Voting reminder: "${projectTitle}" voting ends ${deadlineStr}. Reply VOTE [ID] YES/NO to participate.`,
      type: 'reminder'
    });
  }

  async sendEventNotification(phoneNumber: string, eventTitle: string, location: string, date: Date): Promise<void> {
    const dateStr = date.toLocaleDateString('en-NG');
    await this.sendSMS({
      to: phoneNumber,
      message: `📅 New civic event: "${eventTitle}" on ${dateStr} at ${location}. Reply JOIN [ID] to register.`,
      type: 'notification'
    });
  }

  async sendTaskReward(phoneNumber: string, taskTitle: string, reward: number, newBalance: number): Promise<void> {
    await this.sendSMS({
      to: phoneNumber,
      message: `🎉 Task completed: "${taskTitle}". You earned ${reward} SUP tokens! New balance: ${newBalance} SUP.`,
      type: 'notification'
    });
  }

  async sendCredibleUpgrade(phoneNumber: string, newLevel: number): Promise<void> {
    const levelNames = ['Citizen', 'Verified Credible Nigerian', 'Trained Credible Nigerian', 'Civic Leader'];
    const levelName = levelNames[newLevel] || `Level ${newLevel}`;
    
    await this.sendSMS({
      to: phoneNumber,
      message: `🏆 Congratulations! You've been upgraded to ${levelName}. Keep up your civic engagement!`,
      type: 'alert'
    });
  }

  async sendElectionAlert(phoneNumber: string, electionTitle: string, date: Date): Promise<void> {
    const dateStr = date.toLocaleDateString('en-NG');
    await this.sendSMS({
      to: phoneNumber,
      message: `🚨 ELECTION ALERT: ${electionTitle} on ${dateStr}. Make sure you're registered to vote! Visit your local INEC office.`,
      type: 'alert'
    });
  }

  isConfigured(): boolean {
    return this.client !== null && this.config !== null;
  }
}

// Export singleton instance
export const smsService = new SMSService();