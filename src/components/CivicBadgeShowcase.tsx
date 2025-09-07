import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Star, 
  Trophy, 
  Target, 
  Zap,
  CheckCircle,
  Award,
  Users,
  Heart,
  BookOpen,
  Vote,
  Shield,
  Crown,
  Flame,
  TrendingUp
} from "lucide-react";

interface CivicBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: string;
  category: string;
  tier: number;
  color: string;
  isEarned: boolean;
  earnedAt?: string;
  progress?: number;
  maxProgress?: number;
}

interface CivicBadgeShowcaseProps {
  badges: CivicBadge[];
  user?: any;
  className?: string;
}

export function CivicBadgeShowcase({ badges, user, className = "" }: CivicBadgeShowcaseProps) {
  const iconMap: Record<string, any> = {
    Star,
    Trophy,
    Target,
    Zap,
    CheckCircle,
    Award,
    Users,
    Heart,
    BookOpen,
    Vote,
    Shield,
    Crown,
    Flame,
    TrendingUp,
  };

  const getBadgeIcon = (iconName: string) => {
    return iconMap[iconName] || Star;
  };

  const getTierName = (tier: number) => {
    switch (tier) {
      case 1: return "Bronze";
      case 2: return "Silver";
      case 3: return "Gold";
      case 4: return "Platinum";
      default: return "Bronze";
    }
  };

  const getTierColor = (tier: number) => {
    switch (tier) {
      case 1: return "text-amber-600 bg-amber-50 border-amber-200";
      case 2: return "text-gray-600 bg-gray-50 border-gray-200";
      case 3: return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case 4: return "text-purple-600 bg-purple-50 border-purple-200";
      default: return "text-amber-600 bg-amber-50 border-amber-200";
    }
  };

  const earnedBadges = badges.filter(b => b.isEarned);
  const availableBadges = badges.filter(b => !b.isEarned);

  // Group badges by category
  const badgesByCategory = badges.reduce((acc, badge) => {
    if (!acc[badge.category]) acc[badge.category] = [];
    acc[badge.category].push(badge);
    return acc;
  }, {} as Record<string, CivicBadge[]>);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Achievement Summary */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Trophy className="h-6 w-6 text-blue-600" />
            Civic Achievement Badges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{earnedBadges.length}</div>
              <div className="text-sm text-gray-600">Badges Earned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{availableBadges.length}</div>
              <div className="text-sm text-gray-600">Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {earnedBadges.filter(b => b.tier >= 3).length}
              </div>
              <div className="text-sm text-gray-600">Elite Badges</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round((earnedBadges.length / badges.length) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Completion</div>
            </div>
          </div>
          
          <Progress 
            value={(earnedBadges.length / badges.length) * 100} 
            className="h-2"
          />
        </CardContent>
      </Card>

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-green-600" />
              Your Earned Badges ({earnedBadges.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {earnedBadges.map((badge) => {
                const IconComponent = getBadgeIcon(badge.icon);
                return (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    className="relative"
                  >
                    <Card className={`border-2 ${getTierColor(badge.tier)} hover:shadow-md transition-shadow`}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${getTierColor(badge.tier)}`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-sm truncate">{badge.name}</h3>
                              <Badge variant="outline" className="text-xs">
                                {getTierName(badge.tier)}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">{badge.description}</p>
                            {badge.earnedAt && (
                              <div className="text-xs text-green-600 font-medium">
                                Earned {new Date(badge.earnedAt).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                        <CheckCircle className="absolute top-2 right-2 h-4 w-4 text-green-500" />
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Badges by Category */}
      {Object.entries(badgesByCategory).map(([category, categoryBadges]) => {
        const availableCategoryBadges = categoryBadges.filter(b => !b.isEarned);
        if (availableCategoryBadges.length === 0) return null;

        return (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="text-lg">
                {category.replace('_', ' ')} Badges ({availableCategoryBadges.length} available)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableCategoryBadges.map((badge) => {
                  const IconComponent = getBadgeIcon(badge.icon);
                  const progressPercentage = badge.progress && badge.maxProgress 
                    ? (badge.progress / badge.maxProgress) * 100 
                    : 0;

                  return (
                    <motion.div
                      key={badge.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Card className="border border-gray-200 hover:border-gray-300 transition-colors opacity-75 hover:opacity-100">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-gray-100">
                              <IconComponent className="h-5 w-5 text-gray-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-sm truncate text-gray-700">{badge.name}</h3>
                                <Badge variant="outline" className="text-xs">
                                  {getTierName(badge.tier)}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-600 mb-2">{badge.description}</p>
                              
                              {badge.progress !== undefined && badge.maxProgress && (
                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span>Progress</span>
                                    <span>{badge.progress}/{badge.maxProgress}</span>
                                  </div>
                                  <Progress value={progressPercentage} className="h-1" />
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}