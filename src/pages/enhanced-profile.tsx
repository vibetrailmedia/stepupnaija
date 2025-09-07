import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  User,
  MapPin,
  Calendar,
  Mail,
  Phone,
  Award,
  TrendingUp,
  Users,
  Target,
  Edit,
  Shield,
  Crown,
  Star,
  Heart,
  Clock
} from "lucide-react";
import { CivicBadgeShowcase } from "@/components/CivicBadgeShowcase";
import { CommunityForumCard } from "@/components/CommunityForumCard";
import { CitizenReportingCard } from "@/components/CitizenReportingCard";
import { RealTimeNotifications } from "@/components/RealTimeNotifications";
import { motion } from "framer-motion";

export default function EnhancedProfile() {
  const { user } = useAuth();

  // Fetch enhanced user data
  const { data: profileData } = useQuery({
    queryKey: ['/api/profile/enhanced'],
    enabled: !!user,
  });

  // Fetch user badges
  const { data: userBadges = [] } = useQuery({
    queryKey: ['/api/badges/user'],
    enabled: !!user,
  });

  // Fetch community forums
  const { data: forumCategories = [] } = useQuery({
    queryKey: ['/api/forum/categories'],
    enabled: !!user,
  });

  // Fetch user reports
  const { data: userReports = [] } = useQuery({
    queryKey: ['/api/reports/user'],
    enabled: !!user,
  });

  // Fetch community reports for area
  const { data: communityReports = [] } = useQuery({
    queryKey: ['/api/reports/community', user?.state, user?.lga],
    enabled: !!user && !!user.state,
  });

  // Fetch notifications
  const { data: notifications = [] } = useQuery({
    queryKey: ['/api/notifications'],
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">Loading your profile...</div>
      </div>
    );
  }

  const joinDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'Unknown';

  const getCivicLevelInfo = () => {
    switch (user.credibleLevel || 0) {
      case 3: return { level: "Civic Leader", color: "text-purple-600", bgColor: "bg-purple-50", icon: Crown };
      case 2: return { level: "Trained Leader", color: "text-blue-600", bgColor: "bg-blue-50", icon: Award };
      case 1: return { level: "Verified Citizen", color: "text-green-600", bgColor: "bg-green-50", icon: Shield };
      default: return { level: "Rising Citizen", color: "text-gray-600", bgColor: "bg-gray-50", icon: User };
    }
  };

  const levelInfo = getCivicLevelInfo();
  const LevelIcon = levelInfo.icon;

  // Mock data for demonstration - in production, this would come from the API
  const mockBadges = [
    {
      id: '1',
      name: 'First Steps',
      description: 'Completed your first civic task',
      icon: 'Star',
      type: 'ENGAGEMENT',
      category: 'FIRST_STEPS',
      tier: 1,
      color: 'blue',
      isEarned: true,
      earnedAt: '2025-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'Community Helper',
      description: 'Helped resolve 5 community issues',
      icon: 'Users',
      type: 'COMMUNITY',
      category: 'COMMUNITY_BUILDER',
      tier: 2,
      color: 'green',
      isEarned: true,
      earnedAt: '2025-01-10T00:00:00Z'
    },
    {
      id: '3',
      name: 'Civic Champion',
      description: 'Complete 50 civic engagement tasks',
      icon: 'Trophy',
      type: 'ENGAGEMENT',
      category: 'SUPER_CITIZEN',
      tier: 3,
      color: 'gold',
      isEarned: false,
      progress: 23,
      maxProgress: 50
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-8 border-2 border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                
                {/* Avatar and Basic Info */}
                <div className="text-center md:text-left">
                  <Avatar className="w-32 h-32 mx-auto md:mx-0 mb-4">
                    <AvatarImage src={user.profileImageUrl} alt={`${user.firstName} ${user.lastName}`} />
                    <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                      {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {user.firstName} {user.lastName}
                    </h1>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${levelInfo.bgColor} ${levelInfo.color}`}>
                      <LevelIcon className="h-4 w-4" />
                      <span className="font-medium">{levelInfo.level}</span>
                    </div>
                    {user.citizenNumber && (
                      <div className="text-sm text-gray-600">
                        Citizen #{user.citizenNumber}
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">
                      {user.credibilityScore || 0}
                    </div>
                    <div className="text-sm text-gray-600">Credibility Score</div>
                  </div>
                  
                  <div className="text-center p-4 bg-white rounded-lg border border-green-200">
                    <div className="text-2xl font-bold text-green-600">
                      {user.totalEngagements || 0}
                    </div>
                    <div className="text-sm text-gray-600">Civic Actions</div>
                  </div>
                  
                  <div className="text-center p-4 bg-white rounded-lg border border-purple-200">
                    <div className="text-2xl font-bold text-purple-600">
                      {userBadges.filter((b: any) => b.isEarned).length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Badges Earned</div>
                  </div>
                  
                  <div className="text-center p-4 bg-white rounded-lg border border-orange-200">
                    <div className="text-2xl font-bold text-orange-600">
                      {user.engagementStreak || 0}
                    </div>
                    <div className="text-sm text-gray-600">Day Streak</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </Button>
                </div>
              </div>

              {/* Contact Information */}
              <Separator className="my-6" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {user.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{user.email}</span>
                  </div>
                )}
                {user.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{user.phone}</span>
                  </div>
                )}
                {user.state && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{user.lga ? `${user.lga}, ` : ''}{user.state}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Joined {joinDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Civic Achievement Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <CivicBadgeShowcase 
                badges={mockBadges} 
                user={user}
              />
            </motion.div>

            {/* Community Forums */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <CommunityForumCard 
                categories={forumCategories}
              />
            </motion.div>

            {/* Citizen Reporting */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <CitizenReportingCard 
                reports={communityReports}
                userReports={userReports}
              />
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            
            {/* Real-time Notifications */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <RealTimeNotifications 
                notifications={notifications}
                maxDisplay={5}
              />
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="/engage">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Complete Civic Tasks
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="/projects">
                      <Heart className="h-4 w-4 mr-2" />
                      Support Projects
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="/network">
                      <Users className="h-4 w-4 mr-2" />
                      Connect with Leaders
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="/events">
                      <Calendar className="h-4 w-4 mr-2" />
                      Join Events
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Activity Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-purple-600" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    {user.lastEngagementDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Engagement</span>
                        <span>{new Date(user.lastEngagementDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Streak</span>
                      <span className="font-medium">{user.engagementStreak || 0} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Donations</span>
                      <span className="font-medium">₦{user.totalDonated || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}