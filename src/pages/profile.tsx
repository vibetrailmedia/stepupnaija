// Navigation provided by App.tsx - removed duplicate import
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { User, MapPin, Calendar, Trophy, Target, Flame, CheckCircle, Edit, Shield, Phone, Mail, Star, TrendingUp, Award, BookOpen, Users, Heart, Zap, Crown, Gift } from "lucide-react";
import { useState } from "react";
import { ProfileEditModal } from "@/components/ProfileEditModal";

export default function Profile() {
  const { user } = useAuth();
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Fetch user's wallet data
  const { data: wallet } = useQuery({
    queryKey: ['/api/wallet'],
    enabled: !!user,
  });

  // Fetch user's engagement history
  const { data: engagementHistory } = useQuery({
    queryKey: ['/api/engagement/history'],
    enabled: !!user,
  });

  // Fetch user's achievements
  const { data: achievements } = useQuery({
    queryKey: ['/api/achievements/user'],
    enabled: !!user,
  });

  // Fetch user's civic stats
  const { data: civicStats } = useQuery({
    queryKey: ['/api/stats/civic'],
    enabled: !!user,
  });

  if (!user) {
    return <div>Loading...</div>;
  }

  const joinDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'Unknown';

  const getKycStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'UNDER_REVIEW': return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getKycStatusText = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'Verified';
      case 'UNDER_REVIEW': return 'Under Review';
      case 'REJECTED': return 'Rejected';
      default: return 'Pending';
    }
  };

  // Calculate civic impact score
  const calculateCivicLevel = () => {
    const score = (user?.totalEngagements || 0) + (civicStats?.tasksCompleted || 0) * 2 + (civicStats?.projectsSupported || 0) * 3;
    if (score >= 100) return { level: 4, title: "Civic Champion", color: "text-purple-600", bgColor: "bg-purple-100" };
    if (score >= 50) return { level: 3, title: "Community Leader", color: "text-blue-600", bgColor: "bg-blue-100" };
    if (score >= 20) return { level: 2, title: "Active Citizen", color: "text-green-600", bgColor: "bg-green-100" };
    return { level: 1, title: "Rising Citizen", color: "text-yellow-600", bgColor: "bg-yellow-100" };
  };

  const civicLevel = calculateCivicLevel();
  const nextLevelRequirement = civicLevel.level === 4 ? null : [20, 50, 100][civicLevel.level];
  const currentScore = (user?.totalEngagements || 0) + (civicStats?.tasksCompleted || 0) * 2 + (civicStats?.projectsSupported || 0) * 3;
  const progressToNext = nextLevelRequirement ? Math.min((currentScore / nextLevelRequirement) * 100, 100) : 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-violet-50">
      {/* Your Civic Journey Card - Clean & Elegant */}
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 mb-10 relative overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-amber-400 via-orange-400 to-red-400 opacity-15 rounded-bl-full"></div>
        <div className="absolute top-4 left-4 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-400 opacity-10 rounded-full"></div>
        <div className="relative">
          {/* Header Banner */}
          <div className="h-28 bg-gradient-to-r from-emerald-500 via-blue-500 to-violet-500 rounded-t-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20"></div>
            <div className="absolute bottom-4 left-6 text-white">
              <div className="text-2xl font-bold tracking-wide">Your Civic Journey</div>
              <div className="text-sm opacity-90 font-medium">Every action you take helps build a better Nigeria 🇳🇬</div>
            </div>
          </div>
          
          {/* Clean Content Section */}
          <div className="relative px-8 py-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">
                Making Nigeria Better, One Action at a Time
              </h2>
              <p className="text-lg text-gray-600 font-medium mb-6 max-w-2xl mx-auto">
                Join thousands of Nigerians working together to build a better future for our nation
              </p>
              
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200 mb-8">
                <Trophy className="w-5 h-5 mr-2 text-amber-600" />
                <span className="text-sm font-bold text-amber-800">Building Tomorrow's Leaders Today</span>
              </div>
              
              {/* Simple Stats Row */}
              <div className="flex flex-wrap justify-center gap-8 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">{currentScore}</div>
                  <div className="text-sm text-gray-600 font-medium">Impact Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{civicStats?.tasksCompleted || 0}</div>
                  <div className="text-sm text-gray-600 font-medium">Tasks Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-violet-600">{civicStats?.projectsSupported || 0}</div>
                  <div className="text-sm text-gray-600 font-medium">Projects Supported</div>
                </div>
              </div>
              
              <div className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-emerald-100 to-blue-100 border border-emerald-200 hover:shadow-lg transition-all duration-300">
                <Heart className="w-5 h-5 mr-3 text-emerald-600" />
                <span className="text-base font-semibold text-emerald-800">Your Impact Matters</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-8">
        {/* Premium Profile Header with Enhanced Civic Level */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 mb-10 relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-amber-400 via-orange-400 to-red-400 opacity-15 rounded-bl-full"></div>
          <div className="absolute top-4 left-4 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-400 opacity-10 rounded-full"></div>
          <div className="relative">
            {/* Premium Civic Achievement Banner */}
            <div className={`h-28 bg-gradient-to-r from-emerald-500 via-blue-500 to-violet-500 rounded-t-2xl relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20"></div>
              <div className="absolute top-4 right-6 text-center">
                <div className={`inline-flex items-center px-4 py-2 rounded-full ${civicLevel.bgColor} ${civicLevel.color} text-sm font-bold shadow-lg backdrop-blur-sm border border-white/20`}>
                  <Crown className="w-4 h-4 mr-2" />
                  Level {civicLevel.level}: {civicLevel.title}
                </div>
              </div>
              <div className="absolute bottom-4 left-6 text-white">
                <div className="text-2xl font-bold tracking-wide">Citizen #{user?.citizenNumber || '---'}</div>
                <div className="text-sm opacity-90 font-medium">Making Nigeria better, one action at a time</div>
              </div>
            </div>
            
            {/* Premium Profile Info Section */}
            <div className="relative px-8 py-6">
              <div className="flex items-start space-x-6">
                {/* Clean Profile Picture with Achievement Ring */}
                <div className="relative">
                  {/* Main Profile Picture Container */}
                  <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-2xl flex items-center justify-center overflow-hidden">
                    {user?.profileImageUrl ? (
                      <img 
                        src={user.profileImageUrl} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover"
                        data-testid="img-profile-large"
                      />
                    ) : (
                      <User className="w-10 h-10 text-gray-400" data-testid="icon-profile-large" />
                    )}
                  </div>
                  
                  {/* Achievement Ring */}
                  <div className={`absolute -inset-2 rounded-full border-3 ${civicLevel.level >= 3 ? 'border-amber-400 shadow-amber-400/30' : 'border-emerald-400 shadow-emerald-400/30'} ${civicLevel.level >= 4 ? 'animate-pulse' : ''} shadow-lg pointer-events-none`}></div>
                  
                  {/* Civic Badge */}
                  <div className={`absolute -bottom-1 -right-1 w-8 h-8 ${civicLevel.bgColor} rounded-full flex items-center justify-center border-3 border-white shadow-lg`}>
                    {civicLevel.level >= 4 ? <Crown className={`w-4 h-4 ${civicLevel.color}`} /> : <Star className={`w-4 h-4 ${civicLevel.color}`} />}
                  </div>
                </div>
                
                {/* Enhanced Profile Information */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight" data-testid="text-profile-name">
                          {user?.firstName || ''} {user?.lastName || ''}
                        </h1>
                        {user?.credibilityBadge && (
                          <Badge className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 text-white px-3 py-1 text-sm font-semibold shadow-lg">
                            <Award className="w-4 h-4 mr-2" />
                            {user.credibilityBadge.replace('_', ' ')}
                          </Badge>
                        )}
                      </div>
                      
                      {/* Civic Impact Score */}
                      <div className="mb-4">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-emerald-100 to-blue-100 border border-emerald-200">
                          <Target className="w-4 h-4 mr-2 text-emerald-600" />
                          <span className="text-sm font-semibold text-emerald-800">Civic Impact Score: {currentScore}</span>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2 mt-3">
                        {user?.email && (
                          <div className="flex items-center text-sm text-gray-600" data-testid="text-profile-email">
                            <Mail className="w-4 h-4 mr-2" />
                            {user.email}
                          </div>
                        )}
                        {(user?.state || user?.lga) && (
                          <div className="flex items-center text-sm text-gray-600" data-testid="text-profile-location">
                            <MapPin className="w-4 h-4 mr-2" />
                            {user.lga ? `${user.lga}, ${user.state}` : user.state}
                          </div>
                        )}
                        <div className="flex items-center text-sm text-gray-600" data-testid="text-profile-join-date">
                          <Calendar className="w-4 h-4 mr-2" />
                          Joined {joinDate}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                      <Badge className={getKycStatusColor(user?.kycStatus || 'PENDING')} data-testid="badge-kyc-status">
                        <Shield className="w-3 h-3 mr-1" />
                        {getKycStatusText(user?.kycStatus || 'PENDING')}
                      </Badge>
                      <Button 
                        onClick={() => setEditModalOpen(true)}
                        variant="outline"
                        size="sm"
                        data-testid="button-edit-profile"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                  
                  {user?.bio && (
                    <p className="mt-4 text-gray-700" data-testid="text-profile-bio">
                      {user.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Civic Progress Card */}
        {nextLevelRequirement && (
          <div className="relative bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white mb-10 overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-black bg-opacity-10"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/20 to-transparent rounded-bl-full"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Next Civic Level</h3>
                  <p className="text-violet-100 text-lg font-medium">You're {Math.round(100 - progressToNext)}% away from {[null, "Active Citizen", "Community Leader", "Civic Champion"][civicLevel.level]}!</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Progress</span>
                  <span>{currentScore}/{nextLevelRequirement} points</span>
                </div>
                <div className="relative">
                  <div className="w-full bg-white/20 backdrop-blur-sm rounded-full h-4">
                    <div 
                      className="bg-gradient-to-r from-amber-400 to-orange-400 h-4 rounded-full transition-all duration-1000 shadow-lg" 
                      style={{ width: `${progressToNext}%` }}
                    ></div>
                  </div>
                  <div className="absolute -top-1 left-0 w-full h-6 bg-gradient-to-r from-amber-400/30 to-orange-400/30 rounded-full blur-sm"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Premium Stats Cards with Enhanced Visual Hierarchy */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <Card className="group bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 font-semibold tracking-wide uppercase mb-2">Total Engagements</p>
                  <p className="text-3xl font-bold text-blue-900 mb-1" data-testid="text-total-engagements">
                    {user?.totalEngagements || 0}
                  </p>
                  <p className="text-xs text-blue-600 font-medium">Every action counts! 🎯</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                  <Target className="w-8 h-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="group bg-gradient-to-br from-orange-50 to-red-100 border-orange-200 hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-700 font-semibold tracking-wide uppercase mb-2">Current Streak</p>
                  <p className="text-3xl font-bold text-orange-900 mb-1" data-testid="text-engagement-streak">
                    {user?.engagementStreak || 0} days
                  </p>
                  <p className="text-xs text-orange-600 font-medium">{(user?.engagementStreak || 0) > 0 ? "You're on fire! 🔥" : "Start your streak today!"}</p>
                </div>
                <div className={`p-4 rounded-xl shadow-lg transition-all duration-300 ${(user?.engagementStreak || 0) > 0 ? 'bg-gradient-to-br from-orange-500 to-red-500 animate-pulse group-hover:shadow-orange-500/25' : 'bg-gradient-to-br from-gray-400 to-gray-500'}`}>
                  <Flame className="w-8 h-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="group bg-gradient-to-br from-emerald-50 to-green-100 border-emerald-200 hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-700 font-semibold tracking-wide uppercase mb-2">SUP Balance</p>
                  <p className="text-3xl font-bold text-emerald-900 mb-1" data-testid="text-sup-balance">
                    {parseFloat(wallet?.supBalance || '0').toLocaleString()}
                  </p>
                  <p className="text-xs text-emerald-600 font-medium">Your civic rewards! 💰</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-4 rounded-xl shadow-lg group-hover:shadow-emerald-500/25 transition-all duration-300">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="group bg-gradient-to-br from-violet-50 to-purple-100 border-violet-200 hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-violet-700 font-semibold tracking-wide uppercase mb-2">Achievements</p>
                  <p className="text-3xl font-bold text-violet-900 mb-1" data-testid="text-achievements-count">
                    {Array.isArray(achievements) ? achievements.length : 0}
                  </p>
                  <p className="text-xs text-violet-600 font-medium">Unlock more badges! 🏆</p>
                </div>
                <div className="bg-gradient-to-br from-violet-500 to-purple-600 p-4 rounded-xl shadow-lg group-hover:shadow-violet-500/25 transition-all duration-300">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Premium Motivational Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Enhanced Daily Challenge */}
          <Card className="group bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-white border-0 shadow-2xl hover:shadow-orange-500/25 transition-all duration-500 overflow-hidden relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-bl-full"></div>
            <CardContent className="p-8 relative">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold tracking-tight">Today's Civic Challenge</h3>
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                  <Gift className="w-8 h-8" />
                </div>
              </div>
              <p className="mb-6 text-lg font-medium opacity-95">Complete 1 civic task today to maintain your streak!</p>
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold border border-white/30">
                  +25 SUP Reward
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                  <Zap className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Civic Impact */}
          <Card className="group bg-gradient-to-r from-emerald-500 via-blue-500 to-violet-500 text-white border-0 shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 overflow-hidden relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-bl-full"></div>
            <CardContent className="p-8 relative">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold tracking-tight">Your Civic Impact</h3>
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                  <Heart className="w-8 h-8" />
                </div>
              </div>
              <p className="mb-4 text-lg font-medium">You've contributed to {civicStats?.projectsSupported || 0} community projects</p>
              <p className="text-sm font-medium opacity-90 italic">"Small acts, when multiplied by millions of people, can transform the world."</p>
            </CardContent>
          </Card>
        </div>

        {/* Premium Quick Actions Hub */}
        <Card className="mb-12 border-2 border-dashed border-blue-300 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 shadow-xl">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                Recommended Next Steps
              </h3>
              <p className="text-gray-600 font-medium">Choose your path to civic excellence</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group flex items-center space-x-4 p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border border-blue-100">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl group-hover:shadow-blue-500/25 transition-all duration-300">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">Complete Training</p>
                  <p className="text-sm text-gray-600 font-medium">Level up your civic skills</p>
                </div>
              </div>
              <div className="group flex items-center space-x-4 p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border border-green-100">
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl group-hover:shadow-green-500/25 transition-all duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">Join a Project</p>
                  <p className="text-sm text-gray-600 font-medium">Make a real difference</p>
                </div>
              </div>
              <div className="group flex items-center space-x-4 p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border border-yellow-100">
                <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-3 rounded-xl group-hover:shadow-yellow-500/25 transition-all duration-300">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">Invite Friends</p>
                  <p className="text-sm text-gray-600 font-medium">Grow the movement</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Information Tabs */}
        <Tabs defaultValue="activity" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="activity" data-testid="tab-activity">Activity</TabsTrigger>
            <TabsTrigger value="achievements" data-testid="tab-achievements">Achievements</TabsTrigger>
            <TabsTrigger value="stats" data-testid="tab-stats">Statistics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {Array.isArray(engagementHistory) && engagementHistory.length > 0 ? (
                  <div className="space-y-4">
                    {engagementHistory.map((activity: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                          <div>
                            <p className="font-medium">{activity.task?.title}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(activity.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge variant={activity.status === 'APPROVED' ? 'default' : 'secondary'}>
                          +{activity.rewardSUP} SUP
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-12 border border-blue-100 shadow-xl">
                      <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-full w-20 h-20 mx-auto mb-6 shadow-lg">
                        <Target className="w-12 h-12 text-white mx-auto" />
                      </div>
                      <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">Ready to Make Your Mark?</h3>
                      <p className="text-gray-700 mb-8 text-lg font-medium max-w-md mx-auto">Your civic journey starts with a single step. Every task you complete brings positive change to Nigeria!</p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                          <BookOpen className="w-5 h-5 mr-3" />
                          Start with Training
                        </Button>
                        <Button variant="outline" className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg font-semibold">
                          <Users className="w-5 h-5 mr-3" />
                          Explore Civic Tasks
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                {Array.isArray(achievements) && achievements.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.map((achievement: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4 flex items-center space-x-4">
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                          <Trophy className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{achievement.name}</h3>
                          <p className="text-sm text-gray-500">{achievement.description}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            Earned {new Date(achievement.earnedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-3xl p-12 border border-yellow-200 shadow-xl">
                      <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-4 rounded-full w-20 h-20 mx-auto mb-6 shadow-lg">
                        <Trophy className="w-12 h-12 text-white mx-auto" />
                      </div>
                      <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600 mb-4">Your Trophy Case Awaits!</h3>
                      <p className="text-gray-700 mb-8 text-lg font-medium max-w-md mx-auto">Complete civic activities to unlock achievements and show off your dedication to Nigeria's progress.</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
                        <div className="text-center p-6 bg-white rounded-xl shadow-lg opacity-60 hover:opacity-80 transition-opacity duration-300 border border-gray-100">
                          <div className="bg-gray-100 p-3 rounded-full w-12 h-12 mx-auto mb-3">
                            <Star className="w-6 h-6 mx-auto text-gray-400" />
                          </div>
                          <p className="text-sm text-gray-600 font-semibold">First Steps</p>
                        </div>
                        <div className="text-center p-6 bg-white rounded-xl shadow-lg opacity-60 hover:opacity-80 transition-opacity duration-300 border border-gray-100">
                          <div className="bg-gray-100 p-3 rounded-full w-12 h-12 mx-auto mb-3">
                            <Flame className="w-6 h-6 mx-auto text-gray-400" />
                          </div>
                          <p className="text-sm text-gray-600 font-semibold">Streak Master</p>
                        </div>
                        <div className="text-center p-6 bg-white rounded-xl shadow-lg opacity-60 hover:opacity-80 transition-opacity duration-300 border border-gray-100">
                          <div className="bg-gray-100 p-3 rounded-full w-12 h-12 mx-auto mb-3">
                            <Users className="w-6 h-6 mx-auto text-gray-400" />
                          </div>
                          <p className="text-sm text-gray-600 font-semibold">Team Player</p>
                        </div>
                        <div className="text-center p-6 bg-white rounded-xl shadow-lg opacity-60 hover:opacity-80 transition-opacity duration-300 border border-gray-100">
                          <div className="bg-gray-100 p-3 rounded-full w-12 h-12 mx-auto mb-3">
                            <Crown className="w-6 h-6 mx-auto text-gray-400" />
                          </div>
                          <p className="text-sm text-gray-600 font-semibold">Civic Champion</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Civic Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tasks Completed</span>
                      <span className="font-semibold">{civicStats?.tasksCompleted || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Projects Supported</span>
                      <span className="font-semibold">{civicStats?.projectsSupported || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Votes Cast</span>
                      <span className="font-semibold">{civicStats?.votesCast || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Rewards Earned</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total SUP Earned</span>
                      <span className="font-semibold">{civicStats?.totalSupEarned || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Prize Wins</span>
                      <span className="font-semibold">{civicStats?.prizeWins || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Referrals</span>
                      <span className="font-semibold">{civicStats?.referrals || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <ProfileEditModal 
        open={editModalOpen} 
        onOpenChange={setEditModalOpen}
        user={user}
      />
    </div>
  );
}