import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, MapPin, Target, TrendingUp, Award, Globe, 
  Building, Calendar, Zap, Crown, CheckCircle, Clock,
  BarChart3, PieChart, Map, Activity, Star, DollarSign, ArrowLeft
} from "lucide-react";
import { Link } from "wouter";

// Nigerian States for filtering
const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo',
  'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers',
  'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT'
];

// Geopolitical Zones
const GEOPOLITICAL_ZONES = {
  'North Central': { states: ['Benue', 'Kogi', 'Kwara', 'Nasarawa', 'Niger', 'Plateau', 'FCT'], color: 'bg-blue-100 text-blue-800' },
  'North East': { states: ['Adamawa', 'Bauchi', 'Borno', 'Gombe', 'Taraba', 'Yobe'], color: 'bg-green-100 text-green-800' },
  'North West': { states: ['Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Sokoto', 'Zamfara'], color: 'bg-purple-100 text-purple-800' },
  'South East': { states: ['Abia', 'Anambra', 'Ebonyi', 'Enugu', 'Imo'], color: 'bg-orange-100 text-orange-800' },
  'South South': { states: ['Akwa Ibom', 'Bayelsa', 'Cross River', 'Delta', 'Edo', 'Rivers'], color: 'bg-pink-100 text-pink-800' },
  'South West': { states: ['Ekiti', 'Lagos', 'Ogun', 'Ondo', 'Osun', 'Oyo'], color: 'bg-yellow-100 text-yellow-800' }
};

interface ProgressStats {
  totalCandidates: number;
  verifiedCandidates: number;
  lgasCovered: number;
  activeStates: number;
  totalSUPDistributed: number;
  totalNGNValue: number;
  weeklyGrowth: number;
  completionRate: number;
}

interface LGAProgress {
  id: string;
  name: string;
  state: string;
  zone: string;
  candidateCount: number;
  verifiedCount: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'TARGET_REACHED' | 'COMPLETED';
  lastActivity: string;
  supEarned: number;
}

interface StateMetrics {
  state: string;
  lgaCount: number;
  lgaCompleted: number;
  candidateCount: number;
  verifiedCount: number;
  supDistributed: number;
  completionRate: number;
  rank: number;
}

function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  color = "text-gray-900" 
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: any;
  trend?: { value: number; label: string };
  color?: string;
}) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className={`text-3xl font-bold ${color}`} data-testid={`metric-${title.toLowerCase().replace(/\s+/g, '-')}`}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
            {trend && (
              <div className="flex items-center space-x-1 mt-2">
                <TrendingUp className={`w-4 h-4 ${trend.value >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                <span className={`text-sm font-medium ${trend.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {trend.value >= 0 ? '+' : ''}{trend.value}%
                </span>
                <span className="text-sm text-muted-foreground">{trend.label}</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full ${color.includes('blue') ? 'bg-blue-100' : color.includes('green') ? 'bg-green-100' : 'bg-orange-100'}`}>
            <Icon className={`w-6 h-6 ${color.includes('blue') ? 'text-blue-600' : color.includes('green') ? 'text-green-600' : 'text-orange-600'}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ChallengeProgress({ stats }: { stats: ProgressStats }) {
  const progressPercentage = Math.round((stats.verifiedCandidates / 13000) * 100);
  const lgaProgressPercentage = Math.round((stats.lgasCovered / 774) * 100);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Crown className="w-6 h-6 text-yellow-500" />
          <span>#13kCredibleChallenge Progress</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Overall Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">Credible Candidates Verified</h3>
              <span className="text-2xl font-bold text-primary">
                {stats.verifiedCandidates.toLocaleString()} / 13,000
              </span>
            </div>
            <Progress value={progressPercentage} className="h-4 mb-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{progressPercentage}% Complete</span>
              <span>{(13000 - stats.verifiedCandidates).toLocaleString()} remaining</span>
            </div>
          </div>

          {/* LGA Coverage */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">Local Government Areas Covered</h3>
              <span className="text-2xl font-bold text-green-600">
                {stats.lgasCovered} / 774
              </span>
            </div>
            <Progress value={lgaProgressPercentage} className="h-4 mb-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{lgaProgressPercentage}% of Nigeria Covered</span>
              <span>{(774 - stats.lgasCovered)} LGAs remaining</span>
            </div>
          </div>

          {/* Challenge Milestones */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                stats.verifiedCandidates >= 1000 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
                <CheckCircle className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium">1K Milestone</p>
              <p className="text-xs text-muted-foreground">Foundation</p>
            </div>
            <div className="text-center">
              <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                stats.verifiedCandidates >= 5000 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
                <Target className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium">5K Milestone</p>
              <p className="text-xs text-muted-foreground">Momentum</p>
            </div>
            <div className="text-center">
              <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                stats.verifiedCandidates >= 10000 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
                <Award className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium">10K Milestone</p>
              <p className="text-xs text-muted-foreground">Scale</p>
            </div>
            <div className="text-center">
              <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                stats.verifiedCandidates >= 13000 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
                <Crown className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium">13K Target</p>
              <p className="text-xs text-muted-foreground">Victory</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function GeopoliticalZonesOverview({ stateMetrics }: { stateMetrics: StateMetrics[] }) {
  const zoneStats = Object.entries(GEOPOLITICAL_ZONES).map(([zoneName, zoneData]) => {
    const zoneStates = stateMetrics.filter(state => zoneData.states.includes(state.state));
    const totalLGAs = zoneStates.reduce((sum, state) => sum + state.lgaCount, 0);
    const completedLGAs = zoneStates.reduce((sum, state) => sum + state.lgaCompleted, 0);
    const totalCandidates = zoneStates.reduce((sum, state) => sum + state.candidateCount, 0);
    const verifiedCandidates = zoneStates.reduce((sum, state) => sum + state.verifiedCount, 0);
    const totalSUP = zoneStates.reduce((sum, state) => sum + state.supDistributed, 0);
    
    return {
      zone: zoneName,
      color: zoneData.color,
      stateCount: zoneData.states.length,
      lgaProgress: totalLGAs > 0 ? Math.round((completedLGAs / totalLGAs) * 100) : 0,
      candidateCount: totalCandidates,
      verifiedCount: verifiedCandidates,
      supDistributed: totalSUP,
      completionRate: totalCandidates > 0 ? Math.round((verifiedCandidates / totalCandidates) * 100) : 0
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Map className="w-5 h-5" />
          <span>Geopolitical Zones Progress</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {zoneStats.map((zone) => (
            <Card key={zone.zone} className="border-2 hover:shadow-lg transition-all">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm">{zone.zone}</h3>
                  <Badge className={zone.color}>
                    {zone.stateCount} States
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>LGA Coverage</span>
                      <span className="font-medium">{zone.lgaProgress}%</span>
                    </div>
                    <Progress value={zone.lgaProgress} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Candidates</p>
                      <p className="font-semibold" data-testid={`zone-candidates-${zone.zone.toLowerCase().replace(/\s+/g, '-')}`}>
                        {zone.candidateCount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Verified</p>
                      <p className="font-semibold text-green-600" data-testid={`zone-verified-${zone.zone.toLowerCase().replace(/\s+/g, '-')}`}>
                        {zone.verifiedCount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-1 text-xs">
                      <DollarSign className="w-3 h-3 text-green-500" />
                      <span className="text-muted-foreground">SUP Earned:</span>
                    </div>
                    <span className="font-medium text-green-600">
                      {zone.supDistributed.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function TopPerformingStates({ stateMetrics }: { stateMetrics: StateMetrics[] }) {
  const topStates = stateMetrics
    .sort((a, b) => b.completionRate - a.completionRate)
    .slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5" />
          <span>Top Performing States</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topStates.map((state, index) => (
            <div key={state.state} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                ${index < 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'}
              `}>
                {index + 1}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{state.state}</h3>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">
                      {state.completionRate}% Complete
                    </Badge>
                    {index < 3 && <Star className="w-4 h-4 text-yellow-500" />}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground mt-1">
                  <span>{state.verifiedCount} verified of {state.candidateCount} candidates</span>
                  <span>{state.lgaCompleted}/{state.lgaCount} LGAs covered</span>
                </div>
                
                <Progress value={state.completionRate} className="h-2 mt-2" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function LiveActivityFeed() {
  // Mock recent activities - in real app this would come from API
  const activities = [
    { id: 1, type: 'NEW_CANDIDATE', message: 'New candidate verified in Lagos LGA', time: '2 minutes ago', state: 'Lagos' },
    { id: 2, type: 'MILESTONE', message: 'Kano State reached 500 verified candidates', time: '15 minutes ago', state: 'Kano' },
    { id: 3, type: 'LGA_COMPLETE', message: 'Ikeja LGA target reached (17 candidates)', time: '1 hour ago', state: 'Lagos' },
    { id: 4, type: 'NEW_CANDIDATE', message: 'New candidate verified in Enugu LGA', time: '2 hours ago', state: 'Enugu' },
    { id: 5, type: 'NEW_CANDIDATE', message: 'New candidate verified in Kaduna LGA', time: '3 hours ago', state: 'Kaduna' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'NEW_CANDIDATE': return Users;
      case 'MILESTONE': return Award;
      case 'LGA_COMPLETE': return CheckCircle;
      default: return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'NEW_CANDIDATE': return 'text-blue-600';
      case 'MILESTONE': return 'text-yellow-600';
      case 'LGA_COMPLETE': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="w-5 h-5" />
          <span>Live Activity Feed</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const IconComponent = getActivityIcon(activity.type);
            const iconColor = getActivityColor(activity.type);
            
            return (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className={`p-2 rounded-full bg-muted ${iconColor}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.message}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {activity.state}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {activity.time}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProgressDashboard() {
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedZone, setSelectedZone] = useState<string>("");

  // Mock data - in real app these would be actual API calls
  const { data: stats, isLoading: statsLoading } = useQuery<ProgressStats>({
    queryKey: ['/api/progress/stats'],
    queryFn: async () => ({
      totalCandidates: 8247,
      verifiedCandidates: 6853,
      lgasCovered: 482,
      activeStates: 35,
      totalSUPDistributed: 342650,
      totalNGNValue: 34265000, // SUP * 100
      weeklyGrowth: 12.5,
      completionRate: 83.1
    })
  });

  const { data: stateMetrics = [] } = useQuery<StateMetrics[]>({
    queryKey: ['/api/progress/states'],
    queryFn: async () => 
      NIGERIAN_STATES.map((state, index) => ({
        state,
        lgaCount: Math.floor(Math.random() * 30) + 10,
        lgaCompleted: Math.floor(Math.random() * 20) + 5,
        candidateCount: Math.floor(Math.random() * 500) + 100,
        verifiedCount: Math.floor(Math.random() * 400) + 80,
        supDistributed: Math.floor(Math.random() * 10000) + 2000,
        completionRate: Math.floor(Math.random() * 40) + 60,
        rank: index + 1
      }))
  });

  if (statsLoading || !stats) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="h-64 bg-muted rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Back Navigation */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          asChild 
          className="text-gray-600 hover:text-primary-600 p-2"
          data-testid="button-back-dashboard"
        >
          <Link href="/" className="flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2" data-testid="progress-dashboard-title">
            Progress Dashboard
          </h1>
          <p className="text-muted-foreground">
            Real-time tracking of the #13kCredibleChallenge across Nigeria's 774 LGAs
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Badge className="bg-green-100 text-green-800 px-3 py-1">
            <Activity className="w-4 h-4 mr-1" />
            Live Updates
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Total Candidates"
          value={stats.totalCandidates}
          subtitle="Identified & Nominated"
          icon={Users}
          trend={{ value: stats.weeklyGrowth, label: "this week" }}
          color="text-blue-600"
        />
        <MetricCard
          title="Verified Credible"
          value={stats.verifiedCandidates}
          subtitle={`${Math.round((stats.verifiedCandidates / 13000) * 100)}% of 13K target`}
          icon={CheckCircle}
          color="text-green-600"
        />
        <MetricCard
          title="LGAs Covered"
          value={stats.lgasCovered}
          subtitle={`${Math.round((stats.lgasCovered / 774) * 100)}% of Nigeria`}
          icon={MapPin}
          color="text-purple-600"
        />
        <MetricCard
          title="SUP Distributed"
          value={`${Math.round(stats.totalSUPDistributed / 1000)}K`}
          subtitle={`₦${Math.round(stats.totalNGNValue / 1000000)}M equivalent`}
          icon={DollarSign}
          color="text-orange-600"
        />
      </div>

      {/* Challenge Progress */}
      <ChallengeProgress stats={stats} />

      {/* Tabs for different views */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full lg:w-[400px] grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="states">State Rankings</TabsTrigger>
          <TabsTrigger value="zones">Zones & Regions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TopPerformingStates stateMetrics={stateMetrics} />
            <LiveActivityFeed />
          </div>
          <GeopoliticalZonesOverview stateMetrics={stateMetrics} />
        </TabsContent>

        <TabsContent value="states" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className="w-full sm:w-[200px]" data-testid="select-state-filter">
                <SelectValue placeholder="Filter by state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All States</SelectItem>
                {NIGERIAN_STATES.map((state) => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>State Performance Rankings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stateMetrics
                  .filter(state => !selectedState || state.state === selectedState)
                  .sort((a, b) => b.completionRate - a.completionRate)
                  .map((state, index) => (
                    <div key={state.state} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <span className="w-8 text-center font-bold text-muted-foreground">
                          #{index + 1}
                        </span>
                        <div>
                          <h3 className="font-semibold">{state.state}</h3>
                          <p className="text-sm text-muted-foreground">
                            {state.verifiedCount}/{state.candidateCount} candidates verified
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          {state.completionRate}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {state.supDistributed.toLocaleString()} SUP
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="zones">
          <GeopoliticalZonesOverview stateMetrics={stateMetrics} />
        </TabsContent>
      </Tabs>
      
    </div>
  );
}