import { PrimaryActionCard } from "@/components/PrimaryActionCard";
import { GamifiedProgress } from "@/components/GamifiedProgress";
import { CommunityActivity } from "@/components/CommunityActivity";
import { MotivationalPrizeCard } from "@/components/MotivationalPrizeCard";
import { PersonalAnalytics } from "@/components/PersonalAnalytics";
import { FundingProgress } from "@/components/donations/FundingProgress";
import { DonorLeaderboard } from "@/components/donations/DonorLeaderboard";
import type { User, Wallet } from "@shared/schema";

interface CandidateDashboardProps {
  user: User;
  wallet: Wallet;
  supBalance: number;
  totalEntries: number;
  currentRound?: any;
  onOpenDrawModal?: () => void;
}

export function CandidateDashboard({ user, wallet, supBalance, totalEntries, currentRound, onOpenDrawModal }: CandidateDashboardProps) {
  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Primary Action - Most Important Thing to Do Next */}
      <PrimaryActionCard 
        user={user}
        wallet={wallet}
        supBalance={supBalance}
        totalEntries={totalEntries}
        currentRound={currentRound}
        onOpenDrawModal={onOpenDrawModal}
      />

      {/* Mobile-First Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Left Column - Progress & Motivation */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          
          {/* Motivational Prize System */}
          <MotivationalPrizeCard 
            currentRound={currentRound}
            userEntries={totalEntries}
            supBalance={supBalance}
            user={user}
            onOpenDrawModal={onOpenDrawModal}
          />

          {/* Gamified Progress */}
          <GamifiedProgress 
            user={user}
            supBalance={supBalance}
            totalEntries={totalEntries}
          />
          
          {/* Personal Analytics */}
          <PersonalAnalytics 
            user={user}
            supBalance={supBalance}
            totalEngagements={user.totalEngagements || 0}
          />
        </div>

        {/* Right Column - Community & Activity */}
        <div className="space-y-4 sm:space-y-6 order-first lg:order-last">
          <CommunityActivity />
          
          {/* Community Funding Overview */}
          <FundingProgress 
            showAllProjects={true}
            className="block"
          />
          
          {/* Community Champions */}
          <DonorLeaderboard 
            limit={5}
            compact={true}
            className="block"
          />
        </div>
      </div>
    </div>
  );
}