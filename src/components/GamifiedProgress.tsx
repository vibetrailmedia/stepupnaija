import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Star, 
  Trophy, 
  Target, 
  Zap,
  CheckCircle,
  Gift
} from "lucide-react";
import type { User } from "@shared/schema";

interface GamifiedProgressProps {
  user: User;
  supBalance: number;
  totalEntries: number;
}

export function GamifiedProgress({ user, supBalance, totalEntries }: GamifiedProgressProps) {
  const credibilityScore = user.credibilityScore || 0;
  const totalEngagements = user.totalEngagements || 0;
  const engagementStreak = user.engagementStreak || 0;
  
  // Calculate achievements
  const achievements = [
    {
      id: 'first_sup',
      title: 'First SUP Earned',
      description: 'Earned your first SUP token',
      unlocked: supBalance > 0,
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 border-yellow-200'
    },
    {
      id: 'prize_ready',
      title: 'Prize Draw Ready',
      description: 'Earned 50+ SUP tokens',
      unlocked: supBalance >= 50,
      icon: Trophy,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 border-orange-200'
    },
    {
      id: 'civic_hero',
      title: 'Civic Hero',
      description: 'Completed 5+ civic tasks',
      unlocked: totalEngagements >= 5,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-200'
    },
    {
      id: 'streak_master',
      title: 'Streak Master',
      description: '7-day engagement streak',
      unlocked: engagementStreak >= 7,
      icon: Zap,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 border-purple-200'
    }
  ];

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const nextAchievement = achievements.find(a => !a.unlocked);

  // Quick stats for bite-sized progress
  const quickStats = [
    {
      label: 'SUP Balance',
      value: supBalance.toFixed(0),
      max: 100,
      current: Math.min(supBalance, 100),
      color: 'bg-green-500',
      icon: Gift
    },
    {
      label: 'Credibility',
      value: credibilityScore,
      max: 100,
      current: credibilityScore,
      color: 'bg-blue-500',
      icon: Star
    },
    {
      label: 'Streak Days',
      value: engagementStreak,
      max: 30,
      current: Math.min(engagementStreak, 30),
      color: 'bg-purple-500',
      icon: Zap
    }
  ];

  return (
    <div className="space-y-4">
      {/* Quick Progress Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {quickStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <stat.icon className="h-4 w-4 text-gray-600" />
                </div>
                <div className="text-xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-xs text-gray-600 mb-2">{stat.label}</div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`${stat.color} h-1.5 rounded-full transition-all duration-500`}
                    style={{ width: `${(stat.current / stat.max) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold text-gray-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              Achievements
            </div>
            <Badge className="bg-yellow-100 text-yellow-800">
              {unlockedAchievements.length}/{achievements.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          
          {/* Unlocked Achievements */}
          <div className="grid grid-cols-2 gap-2">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id}
                className={`p-3 rounded-lg border transition-all ${
                  achievement.unlocked 
                    ? achievement.bgColor
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {achievement.unlocked ? (
                    <CheckCircle className={`h-4 w-4 ${achievement.color}`} />
                  ) : (
                    <achievement.icon className="h-4 w-4 text-gray-400" />
                  )}
                  <span className={`text-sm font-medium ${
                    achievement.unlocked ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {achievement.title}
                  </span>
                </div>
                <p className={`text-xs ${
                  achievement.unlocked ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {achievement.description}
                </p>
              </div>
            ))}
          </div>

          {/* Next Achievement */}
          {nextAchievement && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-semibold text-yellow-800">Next Achievement</span>
              </div>
              <div className="text-sm text-yellow-700">
                <strong>{nextAchievement.title}</strong> - {nextAchievement.description}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}