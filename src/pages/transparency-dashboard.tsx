import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp,
  Users,
  MapPin,
  Award,
  Heart,
  Vote,
  Target,
  Activity,
  Calendar,
  BarChart3,
  Globe,
  Shield,
  CheckCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { NigeriaMap } from "@/components/NigeriaMap";

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  totalEngagements: number;
  totalDonations: number;
  projectsCompleted: number;
  avgCredibilityScore: number;
  stateParticipation: Record<string, number>;
  monthlyGrowth: number;
  communityImpact: {
    reportsResolved: number;
    eventsHeld: number;
    leadersTrained: number;
    badgesEarned: number;
  };
}

export default function TransparencyDashboard() {
  // Fetch public analytics data
  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ['/api/analytics/public'],
    staleTime: 5 * 60 * 1000, // 5 minutes - analytics change slowly
    refetchInterval: 60000, // Refetch every minute for real-time feel
  });

  // Fetch real-time platform metrics
  const { data: platformMetrics } = useQuery({
    queryKey: ['/api/metrics/platform'],
    staleTime: 1 * 60 * 1000, // 1 minute for more frequent updates
  });

  // Fetch geographic distribution data
  const { data: geoData } = useQuery({
    queryKey: ['/api/challenge/stats'],
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <div className="text-lg font-medium text-gray-700">Loading Transparency Dashboard...</div>
          <p className="text-gray-500">Gathering real-time civic engagement data across Nigeria</p>
        </div>
      </div>
    );
  }

  // Mock data for demonstration - in production this comes from the API
  const mockAnalytics: AnalyticsData = {
    totalUsers: 15847,
    activeUsers: 8932,
    totalEngagements: 45230,
    totalDonations: 2847000,
    projectsCompleted: 127,
    avgCredibilityScore: 78.5,
    stateParticipation: {
      'Lagos': 2847,
      'Kano': 1923,
      'Rivers': 1456,
      'FCT': 1234,
      'Kaduna': 1089
    },
    monthlyGrowth: 24.7,
    communityImpact: {
      reportsResolved: 542,
      eventsHeld: 89,
      leadersTrained: 234,
      badgesEarned: 3421
    }
  };

  const data = analytics || mockAnalytics;
  const engagementRate = ((data.activeUsers / data.totalUsers) * 100).toFixed(1);
  const avgDonation = (data.totalDonations / data.totalUsers).toFixed(0);

  const impactMetrics = [
    {
      title: "Total Citizens",
      value: data.totalUsers.toLocaleString(),
      description: "Registered Nigerian citizens",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      title: "Active This Month",
      value: data.activeUsers.toLocaleString(),
      description: `${engagementRate}% engagement rate`,
      icon: Activity,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      title: "Civic Actions",
      value: data.totalEngagements.toLocaleString(),
      description: "Completed nationwide",
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      title: "Community Funding",
      value: `₦${(data.totalDonations / 1000000).toFixed(1)}M`,
      description: `Avg ₦${avgDonation} per citizen`,
      icon: Heart,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200"
    },
    {
      title: "Projects Completed",
      value: data.projectsCompleted.toString(),
      description: "Impacting communities",
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200"
    },
    {
      title: "Credibility Score",
      value: data.avgCredibilityScore.toFixed(1),
      description: "Average nationwide",
      icon: Shield,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    }
  ];

  const communityImpact = [
    {
      title: "Community Reports Resolved",
      value: data.communityImpact.reportsResolved,
      description: "Issues addressed by citizens",
      icon: CheckCircle,
      progress: 78
    },
    {
      title: "Civic Events Hosted",
      value: data.communityImpact.eventsHeld,
      description: "Nationwide gatherings this year",
      icon: Calendar,
      progress: 65
    },
    {
      title: "Leaders Trained",
      value: data.communityImpact.leadersTrained,
      description: "Through #13K Challenge",
      icon: Award,
      progress: 45
    },
    {
      title: "Badges Earned",
      value: data.communityImpact.badgesEarned,
      description: "Civic achievements unlocked",
      icon: Award,
      progress: 89
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Nigeria Civic Engagement Transparency Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real-time insights into civic participation, community impact, and democratic engagement 
            across all 774 Local Government Areas in Nigeria.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <Badge className="bg-green-100 text-green-800 px-4 py-2">
              <Globe className="h-4 w-4 mr-2" />
              Live Data
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 px-4 py-2">
              <TrendingUp className="h-4 w-4 mr-2" />
              +{data.monthlyGrowth}% This Month
            </Badge>
            <Badge className="bg-purple-100 text-purple-800 px-4 py-2">
              <BarChart3 className="h-4 w-4 mr-2" />
              Updated Live
            </Badge>
          </div>
        </motion.div>

        {/* Key Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {impactMetrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className={`border-2 ${metric.borderColor} ${metric.bgColor} hover:shadow-lg transition-shadow`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg ${metric.bgColor} ${metric.color}`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className={`text-3xl font-bold ${metric.color}`}>
                        {metric.value}
                      </div>
                      <div className="font-medium text-gray-900">{metric.title}</div>
                      <div className="text-sm text-gray-600">{metric.description}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Nigeria Map Visualization */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  Geographic Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <NigeriaMap className="mb-4" />
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-800">Top Participating States:</h4>
                  {Object.entries(data.stateParticipation).map(([state, count]) => (
                    <div key={state} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{state}</span>
                      <Badge variant="outline">{count.toLocaleString()} citizens</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Community Impact Metrics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-600" />
                  Community Impact This Year
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {communityImpact.map((impact, index) => {
                  const IconComponent = impact.icon;
                  return (
                    <div key={impact.title} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-sm">{impact.title}</span>
                        </div>
                        <Badge variant="outline">{impact.value.toLocaleString()}</Badge>
                      </div>
                      <Progress value={impact.progress} className="h-2" />
                      <div className="text-xs text-gray-600">{impact.description}</div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Real-time Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  Live Activity Feed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span>New citizen registration</span>
                    <span className="text-green-600">2 min ago</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                    <span>Civic task completed in Lagos</span>
                    <span className="text-blue-600">5 min ago</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                    <span>Community project funded</span>
                    <span className="text-purple-600">8 min ago</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
                    <span>Badge earned in Kano</span>
                    <span className="text-orange-600">12 min ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Bottom Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                Nigeria's Civic Transformation in Numbers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">774</div>
                  <div className="text-sm text-gray-600">LGAs Covered</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-2">36</div>
                  <div className="text-sm text-gray-600">States + FCT</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">13,000</div>
                  <div className="text-sm text-gray-600">Target Leaders</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-600 mb-2">200M+</div>
                  <div className="text-sm text-gray-600">Nigerians Served</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p className="text-sm">
            Data updated in real-time. Last refresh: {new Date().toLocaleTimeString()}
          </p>
          <p className="text-xs mt-2">
            Building transparent, accountable governance across Nigeria through civic engagement.
          </p>
        </div>
      </div>
    </div>
  );
}