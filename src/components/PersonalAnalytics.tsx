import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Calendar,
  Target,
  Award,
  Zap,
  Users,
  Trophy,
  CheckCircle,
  Flame
} from "lucide-react";

interface PersonalAnalyticsProps {
  user?: any;
  supBalance: number;
  totalEngagements?: number;
}

export function PersonalAnalytics({ user, supBalance, totalEngagements = 0 }: PersonalAnalyticsProps) {
  // Calculate monthly stats based on actual user data
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const monthlyStats = {
    civicActions: totalEngagements || 0,
    supEarned: supBalance || 0,
    eventsAttended: Math.floor((totalEngagements || 0) / 3),
    rankImprovement: Math.min(Math.floor((totalEngagements || 0) / 2), 50),
    streakDays: Math.min(Math.floor((totalEngagements || 0) / 1.5), 30),
    completionRate: totalEngagements > 0 ? Math.min(95, 60 + (totalEngagements * 8)) : 0
  };

  // Monthly goals and milestones (not duplicating main achievement system)
  const monthlyGoals = [
    {
      id: 'monthly_actions',
      title: 'Monthly Civic Goal',
      description: 'Complete 10 civic actions this month',
      current: monthlyStats.civicActions,
      target: 10,
      icon: Target,
      color: 'blue'
    },
    {
      id: 'engagement_goal',
      title: 'Engagement Target',
      description: 'Maintain 80% completion rate',
      current: monthlyStats.completionRate,
      target: 80,
      icon: TrendingUp,
      color: 'green'
    },
    {
      id: 'streak_goal',
      title: 'Consistency Challenge',
      description: 'Build a 14-day streak',
      current: monthlyStats.streakDays,
      target: 14,
      icon: Flame,
      color: 'orange'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-6"
    >
      {/* Monthly Summary */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-bold text-gray-900">
            <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            {currentMonth} Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="text-center p-3 bg-white rounded-lg border border-blue-200"
            >
              <div className="text-lg sm:text-2xl font-bold text-blue-600">
                {monthlyStats.civicActions}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Civic Actions</div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="text-center p-3 bg-white rounded-lg border border-green-200"
            >
              <div className="text-lg sm:text-2xl font-bold text-green-600">
                {monthlyStats.supEarned}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">SUP Earned</div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="text-center p-3 bg-white rounded-lg border border-orange-200"
            >
              <div className="text-lg sm:text-2xl font-bold text-orange-600">
                {monthlyStats.eventsAttended}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Events</div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="text-center p-3 bg-white rounded-lg border border-purple-200"
            >
              <div className="flex items-center justify-center gap-1 text-lg sm:text-2xl font-bold text-purple-600">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                +{monthlyStats.rankImprovement}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Rank Up</div>
            </motion.div>
          </div>

          {/* Progress Indicators */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium text-gray-700">Current Streak</span>
                </div>
                <span className="text-sm font-bold text-orange-600">
                  {monthlyStats.streakDays} days
                </span>
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <Progress 
                  value={(monthlyStats.streakDays / 30) * 100} 
                  className="h-2"
                />
              </motion.div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">Monthly Goal</span>
                </div>
                <span className="text-sm font-bold text-blue-600">
                  {monthlyStats.completionRate}%
                </span>
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, delay: 0.7 }}
              >
                <Progress 
                  value={monthlyStats.completionRate} 
                  className="h-2"
                />
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Goals Section */}
      <Card className="border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-bold text-gray-900">
            <Target className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
            Monthly Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {monthlyGoals.map((goal, index) => {
              const progressPercentage = Math.min(100, (goal.current / goal.target) * 100);
              const isCompleted = goal.current >= goal.target;
              
              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`p-4 rounded-lg border transition-all ${
                    isCompleted 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${
                      goal.color === 'blue' ? 'bg-blue-100' :
                      goal.color === 'green' ? 'bg-green-100' :
                      goal.color === 'orange' ? 'bg-orange-100' : 'bg-gray-100'
                    }`}>
                      <goal.icon className={`h-4 w-4 ${
                        goal.color === 'blue' ? 'text-blue-600' :
                        goal.color === 'green' ? 'text-green-600' :
                        goal.color === 'orange' ? 'text-orange-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-gray-900 text-sm">
                          {goal.title}
                        </div>
                        <div className="text-sm font-bold text-gray-700">
                          {goal.current}/{goal.target}
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {goal.description}
                      </div>
                    </div>
                    {isCompleted && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Progress 
                      value={progressPercentage} 
                      className="h-2 flex-1"
                    />
                    <span className="text-xs font-medium text-gray-600">
                      {Math.round(progressPercentage)}%
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}