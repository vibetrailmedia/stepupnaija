import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Crown, 
  Medal, 
  Star, 
  Heart,
  TrendingUp,
  Users,
  Award,
  Gift,
  Target,
  Activity,
  Vote,
  MapPin,
  Zap,
  BarChart3,
  Flame,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface LeaderboardEntry {
  userId: string;
  name: string;
  profileImageUrl?: string;
  state?: string;
  lga?: string;
  score?: number;
  totalDonated?: number;
  donationCount?: number;
  totalEngagements?: number;
  engagementStreak?: number;
  credibilityScore?: number;
  totalVotes?: number;
  totalSupVoted?: number;
  combinedScore?: number;
}

interface UserPosition {
  position: number;
  total: number;
}

export default function EnhancedLeaderboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('donations');
  const [selectedState, setSelectedState] = useState('All States');

  // Fetch different leaderboard types (starting with donors only)
  const { data: donorsLeaderboard, isLoading: loadingDonors } = useQuery<LeaderboardEntry[]>({
    queryKey: ['/api/donors/leaderboard', { limit: 20 }],
  });

  // Temporarily disabled until SQL issues are fixed
  // const { data: engagementLeaderboard, isLoading: loadingEngagement } = useQuery<LeaderboardEntry[]>({
  //   queryKey: ['/api/leaderboard/engagement', { limit: 20 }],
  // });

  // const { data: votingLeaderboard, isLoading: loadingVoting } = useQuery<LeaderboardEntry[]>({
  //   queryKey: ['/api/leaderboard/voting', { limit: 20 }],
  // });

  // const { data: combinedLeaderboard, isLoading: loadingCombined } = useQuery<LeaderboardEntry[]>({
  //   queryKey: ['/api/leaderboard/combined', { limit: 20 }],
  // });

  // const { data: regionalLeaderboard, isLoading: loadingRegional } = useQuery<LeaderboardEntry[]>({
  //   queryKey: ['/api/leaderboard/regional', { state: selectedState, limit: 20 }],
  // });

  // const { data: userPosition } = useQuery<UserPosition>({
  //   queryKey: ['/api/user/leaderboard-position', { type: activeTab }],
  //   enabled: !!user,
  // });

  // Nigerian states for regional filter
  const nigerianStates = [
    'All States', 'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa',
    'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
    'FCT', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi',
    'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun',
    'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1: return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2: return <Trophy className="h-6 w-6 text-gray-400" />;
      case 3: return <Medal className="h-6 w-6 text-amber-600" />;
      default: return (
        <div className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-600 bg-gray-100 rounded-full">
          {position}
        </div>
      );
    }
  };

  const getLeaderboardIcon = (type: string) => {
    switch (type) {
      case 'donations': return Heart;
      case 'engagement': return Activity;
      case 'voting': return Vote;
      case 'combined': return Trophy;
      case 'regional': return MapPin;
      default: return Star;
    }
  };

  const getScoreDisplay = (entry: LeaderboardEntry, type: string) => {
    switch (type) {
      case 'donations':
        return {
          primary: `₦${(Number(entry.totalDonated) / 1000).toFixed(1)}K`,
          secondary: `${entry.donationCount} donations`,
          color: 'text-green-600'
        };
      case 'engagement':
        return {
          primary: `${entry.totalEngagements} tasks`,
          secondary: `${entry.engagementStreak} day streak`,
          color: 'text-blue-600'
        };
      case 'voting':
        return {
          primary: `${entry.totalVotes} votes`,
          secondary: `${entry.totalSupVoted} SUP`,
          color: 'text-purple-600'
        };
      case 'combined':
        return {
          primary: `${Math.round(entry.combinedScore || 0)} pts`,
          secondary: 'Overall impact',
          color: 'text-orange-600'
        };
      case 'regional':
        return {
          primary: `${entry.totalEngagements} tasks`,
          secondary: `${entry.lga || entry.state}`,
          color: 'text-indigo-600'
        };
      default:
        return {
          primary: `${entry.score || 0}`,
          secondary: 'Points',
          color: 'text-gray-600'
        };
    }
  };

  const getCurrentLeaderboard = () => {
    switch (activeTab) {
      case 'donations': return donorsLeaderboard;
      default: return donorsLeaderboard;
    }
  };

  const getCurrentLoading = () => {
    switch (activeTab) {
      case 'donations': return loadingDonors;
      default: return loadingDonors;
    }
  };

  const leaderboard = getCurrentLeaderboard();
  const isLoading = getCurrentLoading();
  const LeaderboardIcon = getLeaderboardIcon(activeTab);

  return (
    <div className="space-y-6">
      {/* Promotional Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">🏆 Enhanced Leaderboards Coming Soon!</h3>
            <div className="text-sm opacity-90">
              We're building comprehensive rankings for civic engagement, voting activity, and regional competition. 
              For now, celebrate our top donors who are making real impact across Nigeria!
            </div>
          </div>
          <div className="text-right">
            <Flame className="h-8 w-8 mx-auto mb-2 opacity-90" />
            <div className="text-sm opacity-90">Stay tuned!</div>
          </div>
        </div>
      </motion.div>

      {/* Main Leaderboard */}
      <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-yellow-500 rounded-lg">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            Community Leaderboards
          </CardTitle>
          <p className="text-gray-600">
            Celebrating Nigerian leaders building a better future together
          </p>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="donations" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Top Donors</span>
              </TabsTrigger>
              <TabsTrigger value="coming-soon" className="flex items-center gap-2 opacity-50" disabled>
                <Trophy className="h-4 w-4" />
                <span className="hidden sm:inline">More Categories Coming Soon</span>
              </TabsTrigger>
            </TabsList>

            {/* Regional State Filter */}
            {activeTab === 'regional' && (
              <div className="mb-6">
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {nigerianStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            )}

            <TabsContent value={activeTab} className="mt-0">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-lg border">
                      <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
                      </div>
                      <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : !leaderboard || leaderboard.length === 0 ? (
                <div className="text-center py-12">
                  <LeaderboardIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No rankings yet</h3>
                  <p className="text-gray-600">Be the first to make an impact!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Top 3 Podium Display */}
                  {leaderboard.length >= 3 && (
                    <div className="grid grid-cols-3 gap-4 mb-8 p-6 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl">
                      {/* 2nd Place */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-center"
                      >
                        <div className="bg-gradient-to-br from-gray-300 to-gray-500 p-4 rounded-xl relative">
                          <div className="absolute -top-3 -right-3 bg-white p-1 rounded-full shadow-lg">
                            <Trophy className="h-5 w-5 text-gray-500" />
                          </div>
                          <Avatar className="h-14 w-14 mx-auto mb-3 ring-4 ring-white">
                            <AvatarImage src={leaderboard[1].profileImageUrl} />
                            <AvatarFallback className="bg-gradient-to-br from-gray-400 to-gray-600 text-white font-bold">
                              {getInitials(leaderboard[1].name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-white font-bold text-sm truncate">
                            {leaderboard[1].name}
                          </div>
                          <div className="text-white text-xs mt-1">
                            {getScoreDisplay(leaderboard[1], activeTab).primary}
                          </div>
                        </div>
                      </motion.div>

                      {/* 1st Place - Elevated */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-center -mt-6"
                      >
                        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-6 rounded-xl relative shadow-xl">
                          <div className="absolute -top-4 -right-4 bg-white p-2 rounded-full shadow-lg">
                            <Crown className="h-6 w-6 text-yellow-600" />
                          </div>
                          <Avatar className="h-20 w-20 mx-auto mb-4 ring-4 ring-white">
                            <AvatarImage src={leaderboard[0].profileImageUrl} />
                            <AvatarFallback className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white font-bold text-lg">
                              {getInitials(leaderboard[0].name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-white font-bold mb-1 truncate">
                            {leaderboard[0].name}
                          </div>
                          <div className="text-white text-sm">
                            {getScoreDisplay(leaderboard[0], activeTab).primary}
                          </div>
                          <Badge className="mt-2 bg-white text-yellow-600 font-bold">
                            🏆 Champion
                          </Badge>
                        </div>
                      </motion.div>

                      {/* 3rd Place */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-center"
                      >
                        <div className="bg-gradient-to-br from-amber-500 to-amber-700 p-4 rounded-xl relative">
                          <div className="absolute -top-3 -right-3 bg-white p-1 rounded-full shadow-lg">
                            <Medal className="h-5 w-5 text-amber-600" />
                          </div>
                          <Avatar className="h-14 w-14 mx-auto mb-3 ring-4 ring-white">
                            <AvatarImage src={leaderboard[2].profileImageUrl} />
                            <AvatarFallback className="bg-gradient-to-br from-amber-500 to-amber-700 text-white font-bold">
                              {getInitials(leaderboard[2].name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-white font-bold text-sm truncate">
                            {leaderboard[2].name}
                          </div>
                          <div className="text-white text-xs mt-1">
                            {getScoreDisplay(leaderboard[2], activeTab).primary}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  )}

                  {/* Full Leaderboard List */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2 border-t pt-6">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      Complete Rankings
                    </h4>
                    
                    <AnimatePresence mode="popLayout">
                      {leaderboard.map((entry, index) => {
                        const scoreData = getScoreDisplay(entry, activeTab);
                        
                        return (
                          <motion.div
                            key={entry.userId}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ delay: index * 0.05 }}
                            className={`flex items-center gap-4 p-4 rounded-xl border transition-all hover:shadow-lg ${
                              index < 3
                                ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300'
                                : 'bg-white border-gray-200'
                            } ${entry.userId === user?.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {getRankIcon(index + 1)}
                            </div>

                            <Avatar className="h-12 w-12">
                              <AvatarImage src={entry.profileImageUrl} />
                              <AvatarFallback className={`text-white font-bold ${
                                index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                                index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-600' :
                                index === 2 ? 'bg-gradient-to-br from-amber-500 to-amber-700' :
                                'bg-gradient-to-br from-blue-400 to-purple-500'
                              }`}>
                                {getInitials(entry.name)}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="font-semibold text-gray-900 truncate">
                                  {entry.name}
                                  {entry.userId === user?.id && (
                                    <Badge className="ml-2 text-xs bg-blue-500 text-white">You</Badge>
                                  )}
                                </div>
                              </div>
                              <div className="text-sm text-gray-600">
                                {scoreData.secondary}
                                {entry.state && ` • ${entry.state}`}
                              </div>
                            </div>

                            <div className="text-right">
                              <div className={`font-bold text-lg ${scoreData.color}`}>
                                {scoreData.primary}
                              </div>
                              {index <= 2 && (
                                <div className="flex items-center justify-end mt-1">
                                  <Star className="h-3 w-3 text-yellow-500 mr-1" />
                                  <span className="text-xs text-gray-500">Top 3</span>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Motivational Footer */}
          <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award className="h-6 w-6 text-green-600" />
                <div>
                  <div className="font-semibold text-green-800">Keep Building Nigeria!</div>
                  <div className="text-sm text-green-600">Every action counts towards our collective progress 🇳🇬</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-green-600 mb-1">Leaderboards reset</div>
                <div className="text-sm font-semibold text-green-800">Every Sunday</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}