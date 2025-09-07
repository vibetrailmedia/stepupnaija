import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  Star, 
  Users, 
  Trophy, 
  CheckCircle, 
  ArrowRight,
  Clock,
  Zap
} from "lucide-react";
import type { User, Wallet } from "@shared/schema";

interface PrimaryActionCardProps {
  user: User;
  wallet: Wallet;
  supBalance: number;
  totalEntries: number;
  currentRound?: any;
  onOpenDrawModal?: () => void;
}

interface ActionItem {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  buttonAction: () => void;
  urgency: 'high' | 'medium' | 'low';
  reward: string;
  icon: React.ComponentType<any>;
  progress?: {
    current: number;
    total: number;
    label: string;
  };
}

export function PrimaryActionCard({ 
  user, 
  wallet, 
  supBalance, 
  totalEntries, 
  currentRound,
  onOpenDrawModal 
}: PrimaryActionCardProps) {
  
  // Determine user's next best action based on their state
  const getNextBestAction = (): ActionItem => {
    const credibilityScore = user.credibilityScore || 0;
    const kycCompleted = user.kycStatus === 'APPROVED';
    const ageVerified = user.ageVerified;
    const totalEngagements = user.totalEngagements || 0;
    const engagementStreak = user.engagementStreak || 0;

    // Priority 1: Enter prize draw if eligible and haven't entered
    if (supBalance >= 50 && totalEntries === 0 && currentRound) {
      return {
        id: 'enter_draw',
        title: '🎯 Enter Today\'s Prize Draw',
        description: `You have ${supBalance.toFixed(0)} SUP tokens! Enter today's community prize draw.`,
        buttonText: 'Enter Prize Draw',
        buttonAction: () => onOpenDrawModal?.(),
        urgency: 'high',
        reward: 'Chance to win ₦1M+',
        icon: Trophy,
      };
    }

    // Priority 2: Age verification if not done
    if (!ageVerified) {
      return {
        id: 'age_verify',
        title: '⚡ Quick Age Verification',
        description: 'Complete your age verification in under 2 minutes to unlock civic features and earn 20 credibility points.',
        buttonText: 'Verify Age Now',
        buttonAction: () => window.location.href = '/verify-age',
        urgency: 'high',
        reward: '+20 credibility points',
        icon: Zap,
      };
    }

    // Priority 3: KYC if age verified but KYC not done
    if (ageVerified && !kycCompleted) {
      return {
        id: 'kyc_verify',
        title: '✅ Get Verified',
        description: 'Unlock voting, prize entries, and leadership tools.',
        buttonText: 'Verify Identity',
        buttonAction: () => window.location.href = '/kyc',
        urgency: 'medium',
        reward: '+30 credibility points',
        icon: CheckCircle,
      };
    }

    // Priority 4: Civic engagement if verifications done but low engagement
    if (kycCompleted && totalEngagements < 5) {
      return {
        id: 'civic_tasks',
        title: '🎯 Complete Civic Tasks',
        description: 'Earn SUP tokens and build your credibility by participating in community activities.',
        buttonText: 'Browse Tasks',
        buttonAction: () => window.location.href = '/engage',
        urgency: 'medium',
        reward: '+25 credibility points',
        icon: Target,
        progress: {
          current: totalEngagements,
          total: 5,
          label: 'civic tasks completed'
        }
      };
    }

    // Priority 5: Build engagement streak
    if (totalEngagements >= 5 && engagementStreak < 7) {
      return {
        id: 'engagement_streak',
        title: '🔥 Build Your Engagement Streak',
        description: 'Maintain daily civic participation to unlock Verified Leader status.',
        buttonText: 'Continue Streak',
        buttonAction: () => window.location.href = '/engage',
        urgency: 'medium',
        reward: '+25 credibility points',
        icon: Star,
        progress: {
          current: engagementStreak,
          total: 7,
          label: 'day streak'
        }
      };
    }

    // Priority 6: Earn SUP tokens if low balance
    if (supBalance < 50) {
      return {
        id: 'earn_sup',
        title: '💰 Earn SUP Tokens',
        description: 'Complete civic tasks to earn SUP tokens for prize draws and community voting.',
        buttonText: 'Earn Tokens',
        buttonAction: () => window.location.href = '/engage',
        urgency: 'medium',
        reward: 'SUP tokens + credibility',
        icon: Star,
        progress: {
          current: Math.floor(supBalance),
          total: 50,
          label: 'SUP for prize entry'
        }
      };
    }

    // Default: Connect with community
    return {
      id: 'connect_community',
      title: '🌟 Connect with Local Leaders',
      description: 'Network with verified leaders in your area and join community projects.',
      buttonText: 'Explore Community',
      buttonAction: () => window.location.href = '/community',
      urgency: 'low',
      reward: 'Leadership connections',
      icon: Users,
    };
  };

  const action = getNextBestAction();
  
  const urgencyColors = {
    high: 'bg-blue-500',
    medium: 'bg-green-500', 
    low: 'bg-gray-500'
  };

  const urgencyLabels = {
    high: 'Action Needed',
    medium: 'Recommended',
    low: 'Optional'
  };

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <action.icon className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-gray-900">{action.title}</h2>
              <Badge 
                className={`${urgencyColors[action.urgency]} text-white text-xs px-2 py-1`}
              >
                {urgencyLabels[action.urgency]}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-green-700 font-medium">
              <Star className="h-4 w-4" />
              {action.reward}
            </div>
          </div>
        </div>
        
        <p className="text-gray-700 mb-4 leading-relaxed">
          {action.description}
        </p>

        {action.progress && (
          <div className="mb-4 p-3 bg-white rounded-lg border border-blue-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-blue-600 font-semibold">
                {action.progress.current}/{action.progress.total}
              </span>
            </div>
            <Progress 
              value={(action.progress.current / action.progress.total) * 100} 
              className="h-2 mb-2" 
            />
            <p className="text-xs text-gray-600">
              {action.progress.current} of {action.progress.total} {action.progress.label}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={action.buttonAction}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all flex-1"
            data-testid={`button-${action.id}`}
          >
            {action.buttonText}
          </Button>
          
          {action.urgency === 'high' && (
            <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
              <Clock className="h-4 w-4" />
              Complete today for maximum impact
            </div>
          )}
          {action.urgency === 'medium' && action.id === 'kyc_verify' && (
            <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
              <CheckCircle className="h-4 w-4" />
              Quick 3-minute process
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}