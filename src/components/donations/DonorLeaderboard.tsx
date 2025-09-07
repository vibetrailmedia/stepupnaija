import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Trophy, 
  Crown, 
  Medal, 
  Star, 
  Heart, 
  TrendingUp,
  Users,
  Award,
  Gift
} from "lucide-react";

interface DonorLeaderboardProps {
  limit?: number;
  showTitle?: boolean;
  compact?: boolean;
  className?: string;
}

interface DonorData {
  userId: string;
  name: string;
  totalDonated: string;
  donationCount: number;
  state: string | null;
}

export function DonorLeaderboard({ 
  limit = 10, 
  showTitle = true, 
  compact = false,
  className = "" 
}: DonorLeaderboardProps) {
  const { data: leaderboard, isLoading } = useQuery<DonorData[]>({
    queryKey: ["/api/donors/leaderboard", { limit }],
  });

  const formatAmount = (amount: string) => {
    const numAmount = parseFloat(amount);
    if (numAmount >= 1000000) {
      return `₦${(numAmount / 1000000).toFixed(1)}M`;
    } else if (numAmount >= 1000) {
      return `₦${(numAmount / 1000).toFixed(1)}K`;
    }
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(numAmount);
  };

  const getDonorLevel = (totalDonated: string, donationCount: number) => {
    const amount = parseFloat(totalDonated);
    
    if (amount >= 1000000) return { level: 'Champion', color: 'purple', icon: Crown };
    if (amount >= 500000) return { level: 'Hero', color: 'blue', icon: Trophy };
    if (amount >= 100000) return { level: 'Leader', color: 'green', icon: Medal };
    if (amount >= 50000) return { level: 'Advocate', color: 'orange', icon: Star };
    if (donationCount >= 5) return { level: 'Supporter', color: 'pink', icon: Heart };
    return { level: 'Friend', color: 'gray', icon: Gift };
  };

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1: return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2: return <Trophy className="h-5 w-5 text-gray-400" />;
      case 3: return <Medal className="h-5 w-5 text-amber-600" />;
      default: return <div className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-500">#{position}</div>;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <Card className={`border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 ${className}`}>
        <CardHeader className="pb-4">
          {showTitle && (
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-600" />
              Community Champions
            </CardTitle>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-yellow-200">
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
                </div>
                <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!leaderboard || leaderboard.length === 0) {
    return (
      <Card className={`border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 ${className}`}>
        <CardHeader className="pb-4">
          {showTitle && (
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-600" />
              Community Champions
            </CardTitle>
          )}
        </CardHeader>
        <CardContent className="text-center py-8">
          <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No donations yet. Be the first to support a project!</p>
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    return (
      <motion.div className={className}>
        <div className="space-y-2">
          {leaderboard.slice(0, 3).map((donor, index) => {
            const donorLevel = getDonorLevel(donor.totalDonated, donor.donationCount);
            
            return (
              <motion.div
                key={donor.userId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 bg-white rounded-lg border border-yellow-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2">
                  {getRankIcon(index + 1)}
                </div>
                
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs bg-gradient-to-br from-yellow-400 to-orange-500 text-white">
                    {getInitials(donor.name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 truncate text-sm">
                    {donor.name}
                  </div>
                  <div className="text-xs text-gray-600">
                    {donor.donationCount} donation{donor.donationCount !== 1 ? 's' : ''}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-bold text-green-600 text-sm">
                    {formatAmount(donor.totalDonated)}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className="border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
        <CardHeader className="pb-4">
          {showTitle && (
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-600" />
              Community Champions
            </CardTitle>
          )}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {leaderboard.length} active donors
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              Building Nigeria together
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Top 3 Special Display */}
          {leaderboard.length >= 3 && (
            <div className="grid grid-cols-3 gap-2 mb-6">
              {/* 2nd Place */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className="bg-gradient-to-br from-gray-300 to-gray-500 p-4 rounded-lg border-2 border-gray-400 relative">
                  <div className="absolute -top-2 -right-2">
                    <Trophy className="h-6 w-6 text-gray-400" />
                  </div>
                  <Avatar className="h-12 w-12 mx-auto mb-2">
                    <AvatarFallback className="bg-gradient-to-br from-gray-400 to-gray-600 text-white">
                      {getInitials(leaderboard[1].name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="font-bold text-white text-sm truncate">
                    {leaderboard[1].name}
                  </div>
                  <div className="text-white text-xs">
                    {formatAmount(leaderboard[1].totalDonated)}
                  </div>
                </div>
              </motion.div>

              {/* 1st Place - Elevated */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center -mt-4"
              >
                <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-4 rounded-lg border-2 border-yellow-500 relative">
                  <div className="absolute -top-3 -right-2">
                    <Crown className="h-8 w-8 text-yellow-600" />
                  </div>
                  <Avatar className="h-16 w-16 mx-auto mb-2">
                    <AvatarFallback className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white text-lg">
                      {getInitials(leaderboard[0].name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="font-bold text-white truncate">
                    {leaderboard[0].name}
                  </div>
                  <div className="text-white text-sm">
                    {formatAmount(leaderboard[0].totalDonated)}
                  </div>
                  <Badge className="mt-1 bg-white text-yellow-600 text-xs">
                    Champion
                  </Badge>
                </div>
              </motion.div>

              {/* 3rd Place */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <div className="bg-gradient-to-br from-amber-500 to-amber-700 p-4 rounded-lg border-2 border-amber-600 relative">
                  <div className="absolute -top-2 -right-2">
                    <Medal className="h-6 w-6 text-amber-600" />
                  </div>
                  <Avatar className="h-12 w-12 mx-auto mb-2">
                    <AvatarFallback className="bg-gradient-to-br from-amber-500 to-amber-700 text-white">
                      {getInitials(leaderboard[2].name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="font-bold text-white text-sm truncate">
                    {leaderboard[2].name}
                  </div>
                  <div className="text-white text-xs">
                    {formatAmount(leaderboard[2].totalDonated)}
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Full Leaderboard */}
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2 border-t pt-4">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Full Leaderboard
            </h4>
            
            {leaderboard.map((donor, index) => {
              const donorLevel = getDonorLevel(donor.totalDonated, donor.donationCount);
              const LevelIcon = donorLevel.icon;
              
              return (
                <motion.div
                  key={donor.userId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all hover:shadow-md ${
                    index < 3 
                      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300' 
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {getRankIcon(index + 1)}
                  </div>
                  
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className={`text-white ${
                      index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                      index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-600' :
                      index === 2 ? 'bg-gradient-to-br from-amber-500 to-amber-700' :
                      'bg-gradient-to-br from-blue-400 to-blue-600'
                    }`}>
                      {getInitials(donor.name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold text-gray-900 truncate">
                        {donor.name}
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${
                          donorLevel.color === 'purple' ? 'bg-purple-100 text-purple-700' :
                          donorLevel.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                          donorLevel.color === 'green' ? 'bg-green-100 text-green-700' :
                          donorLevel.color === 'orange' ? 'bg-orange-100 text-orange-700' :
                          donorLevel.color === 'pink' ? 'bg-pink-100 text-pink-700' :
                          'bg-gray-100 text-gray-700'
                        }`}
                      >
                        <LevelIcon className="h-3 w-3 mr-1" />
                        {donorLevel.level}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      {donor.donationCount} donation{donor.donationCount !== 1 ? 's' : ''}
                      {donor.state && ` • ${donor.state}`}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-bold text-green-600">
                      {formatAmount(donor.totalDonated)}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Recognition Message */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200 text-center">
            <Award className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-blue-700 font-medium">
              Thank you to all our champions building a better Nigeria! 🇳🇬
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}