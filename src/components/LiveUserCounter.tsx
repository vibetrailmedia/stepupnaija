import { useState, useEffect } from "react";
import { Users, Trophy, Target, Zap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";

interface CitizenshipStats {
  totalUsers: number;
  targetUsers: number;
  credibleCitizens: number;
  activeCommunities: number;
  lastMilestoneReached: number;
}

interface UserMilestone {
  id: string;
  milestoneNumber: number;
  title: string;
  description: string;
  rewardSUP: number;
  specialBadge: string;
  celebrationMessage: string;
  achievedAt: string | null;
  isRepeating: boolean;
}

export function LiveUserCounter() {
  const { user } = useAuth();
  const [animatedCount, setAnimatedCount] = useState(0);



  const { data: stats } = useQuery<CitizenshipStats>({
    queryKey: ["/api/citizenship/stats"],
    staleTime: 2 * 60 * 1000, // 2 minutes - stats don't change that frequently
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes instead of 30 seconds
  });

  const { data: milestones } = useQuery<UserMilestone[]>({
    queryKey: ["/api/citizenship/milestones"],
  });

  // Animate counter to current value
  useEffect(() => {
    if (stats?.totalUsers) {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = stats.totalUsers / steps;
      const stepTime = duration / steps;

      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= stats.totalUsers) {
          setAnimatedCount(stats.totalUsers);
          clearInterval(timer);
        } else {
          setAnimatedCount(Math.floor(current));
        }
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [stats?.totalUsers]);

  if (!stats) return null;

  const progressPercentage = (stats.totalUsers / stats.targetUsers) * 100;
  const nextMilestone = milestones?.find(m => m.milestoneNumber > stats.totalUsers);
  const lastAchievedMilestone = milestones?.find(m => m.milestoneNumber <= stats.totalUsers && m.achievedAt);
  
  // Current phase based on user count
  const getCurrentPhase = () => {
    if (stats.totalUsers <= 10000) return "Founding Citizens Phase";
    if (stats.totalUsers <= 100000) return "Early Citizens Phase";
    return "Million March Phase";
  };
  
  const getPhaseProgress = () => {
    if (stats.totalUsers <= 10000) return (stats.totalUsers / 10000) * 100;
    if (stats.totalUsers <= 100000) return ((stats.totalUsers - 10000) / 90000) * 100;
    return ((stats.totalUsers - 100000) / 900000) * 100;
  };

  return (
    <div className="bg-gradient-to-br from-primary-50 to-yellow-50 border border-primary-200 rounded-xl p-6 mb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Step Up Naija Movement</h3>
            <p className="text-sm text-gray-600">{getCurrentPhase()}</p>
          </div>
        </div>
        {((user as any)?.citizenNumber || (user as any)?.citizen_number) && (
          <div className="text-center sm:text-right">
            <div className="text-xs text-gray-500">You are</div>
            <div className="text-lg font-bold text-primary-600" data-testid="text-citizen-number">
              Citizen #{((user as any)?.citizenNumber || (user as any)?.citizen_number)?.toLocaleString()}
            </div>
            
            {/* Citizen Milestone Badge */}
            {((user as any)?.citizenNumber || (user as any)?.citizen_number) <= 10000 && (
              <div className="text-xs text-green-600 font-medium" data-testid="badge-founding-citizen">
                🎖️ Founding Citizen
              </div>
            )}
            {((user as any)?.citizenNumber || (user as any)?.citizen_number) > 10000 && 
             ((user as any)?.citizenNumber || (user as any)?.citizen_number) <= 100000 && (
              <div className="text-xs text-blue-600 font-medium" data-testid="badge-early-citizen">
                🌟 Early Citizen
              </div>
            )}
            {((user as any)?.citizenNumber || (user as any)?.citizen_number) > 100000 && (
              <div className="text-xs text-purple-600 font-medium" data-testid="badge-citizen-builder">
                🏗️ Citizen Builder
              </div>
            )}
            
            {/* Credible Nigerian Badge */}
            {((user as any)?.credibleLevel || (user as any)?.credible_level) === 1 && (
              <div className="text-xs text-orange-600 font-medium" data-testid="badge-verified-credible">
                ✓ Verified Credible Nigerian
              </div>
            )}
            {((user as any)?.credibleLevel || (user as any)?.credible_level) === 2 && (
              <div className="text-xs text-red-600 font-medium" data-testid="badge-trained-credible">
                🎓 Trained Credible Nigerian
              </div>
            )}
            {((user as any)?.credibleLevel || (user as any)?.credible_level) === 3 && (
              <div className="text-xs text-indigo-600 font-medium" data-testid="badge-civic-leader">
                👑 Civic Leader
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Counter */}
      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-primary-600 mb-2" data-testid="text-user-counter">
          {animatedCount.toLocaleString()}
        </div>
        <div className="text-gray-600 mb-4">
          Citizens joined the movement • Target: {stats.targetUsers.toLocaleString()}
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div 
            className="bg-gradient-to-r from-primary-500 to-yellow-500 h-3 rounded-full transition-all duration-1000"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            data-testid="progress-bar"
          />
        </div>
        
        <div className="text-sm text-gray-600">
          {progressPercentage.toFixed(2)}% towards our goal
        </div>
      </div>

      {/* Milestones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Last Achievement */}
        {lastAchievedMilestone && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-800">Latest Milestone</span>
            </div>
            <div className="text-sm text-green-700 font-medium">
              {lastAchievedMilestone.title}
            </div>
            <div className="text-xs text-green-600">
              {lastAchievedMilestone.description}
            </div>
          </div>
        )}

        {/* Next Milestone */}
        {nextMilestone && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-semibold text-yellow-800">Next Milestone</span>
            </div>
            <div className="text-sm text-yellow-700 font-medium">
              {nextMilestone.title}
            </div>
            <div className="text-xs text-yellow-600">
              {(nextMilestone.milestoneNumber - stats.totalUsers).toLocaleString()} more citizens needed
            </div>
            {nextMilestone.milestoneNumber === 10000 && (
              <div className="text-xs text-green-600 mt-1">
                🎖️ Pioneer Badge + Founders Wall + 5 SUP bonus
              </div>
            )}
            {nextMilestone.milestoneNumber === 100000 && (
              <div className="text-xs text-blue-600 mt-1">
                🌟 Early Citizen Badge + Priority Access
              </div>
            )}
            {nextMilestone.milestoneNumber === 1000000 && (
              <div className="text-xs text-purple-600 mt-1 flex items-center gap-1">
                <Zap className="w-3 h-3" />
                🏗️ Citizen Builder + 10M SUP distributed!
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-primary-200">
        <div className="text-center">
          <div className="text-lg font-bold text-primary-600">
            {stats.credibleCitizens.toLocaleString()}
          </div>
          <div className="text-xs text-gray-600">Credible Nigerians</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-primary-600">
            {stats.activeCommunities.toLocaleString()}
          </div>
          <div className="text-xs text-gray-600">Active Communities</div>
        </div>
      </div>
    </div>
  );
}