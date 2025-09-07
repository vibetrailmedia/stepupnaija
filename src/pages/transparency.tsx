import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { 
  Target, 
  Users, 
  CheckCircle, 
  Trophy, 
  Heart, 
  TrendingUp, 
  Award, 
  Crown, 
  Star,
  BarChart3,
  Calculator,
  Shield,
  Eye
} from "lucide-react";

export default function Transparency() {
  // Fetch community stats for leaderboard
  const { data: communityStats } = useQuery({
    queryKey: ['/api/community/stats'],
    retry: false,
  });

  const { data: topContributors } = useQuery({
    queryKey: ['/api/community/leaderboard'],
    retry: false,
  });

  const scoringMethodology = [
    {
      activity: "Basic Engagement",
      points: 1,
      description: "Voting, commenting, forum participation",
      icon: <Users className="w-5 h-5 text-blue-600" />,
      examples: ["Vote on community projects", "Comment on forums", "Participate in discussions"]
    },
    {
      activity: "Civic Tasks",
      points: 2,
      description: "Training modules, surveys, assessments",
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      examples: ["Complete training modules", "Take civic assessments", "Submit community surveys"]
    },
    {
      activity: "Project Support",
      points: 3,
      description: "Donations, volunteering, project leadership",
      icon: <Heart className="w-5 h-5 text-red-600" />,
      examples: ["Donate to community projects", "Volunteer for initiatives", "Lead project activities"]
    }
  ];

  const civicLevels = [
    {
      level: 1,
      title: "Rising Citizen",
      range: "1-19 points",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      icon: <Star className="w-5 h-5" />,
      description: "Beginning your civic journey with basic engagement",
      benefits: ["Access to basic training", "Participate in forums", "Vote on projects"]
    },
    {
      level: 2,
      title: "Active Citizen",
      range: "20-49 points",
      color: "text-green-600",
      bgColor: "bg-green-100",
      icon: <Target className="w-5 h-5" />,
      description: "Consistently participating in civic activities",
      benefits: ["Nominate candidates", "Create forum posts", "Access advanced training"]
    },
    {
      level: 3,
      title: "Community Leader",
      range: "50-99 points",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      icon: <Award className="w-5 h-5" />,
      description: "Leading initiatives and driving community change",
      benefits: ["Organize events", "Lead projects", "Mentor other citizens"]
    },
    {
      level: 4,
      title: "Civic Champion",
      range: "100+ points",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      icon: <Crown className="w-5 h-5" />,
      description: "Making significant impact across multiple communities",
      benefits: ["Multi-state influence", "Major project funding", "Policy advisory role"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-violet-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-emerald-100 to-blue-100 border border-emerald-200 mb-6">
              <Eye className="w-5 h-5 mr-2 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-800">Public Transparency</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Impact Score Methodology
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Understanding how civic engagement is measured and rewarded in our community. 
              Every action counts toward building a better Nigeria.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* How Scoring Works */}
        <Card className="mb-12 shadow-xl border-2 border-emerald-100" data-testid="card-scoring-methodology">
          <CardHeader className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-t-lg">
            <CardTitle className="text-2xl flex items-center">
              <Calculator className="w-6 h-6 mr-3" />
              How Impact Scores Are Calculated
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Scoring Formula</h3>
              <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-emerald-500">
                <div className="text-lg font-mono text-gray-800">
                  <strong>Impact Score = </strong>
                  <span className="text-blue-600">(Total Engagements × 1)</span> + 
                  <span className="text-green-600"> (Tasks Completed × 2)</span> + 
                  <span className="text-red-600"> (Projects Supported × 3)</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {scoringMethodology.map((item, index) => (
                <div key={index} className="bg-white rounded-xl border-2 border-gray-100 p-6 hover:shadow-lg transition-shadow" data-testid={`card-activity-${index}`}>
                  <div className="flex items-center mb-4">
                    {item.icon}
                    <div className="ml-3">
                      <h4 className="font-bold text-gray-900">{item.activity}</h4>
                      <div className="text-2xl font-bold text-emerald-600">{item.points} points each</div>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <div className="space-y-2">
                    <h5 className="font-semibold text-sm text-gray-700">Examples:</h5>
                    {item.examples.map((example, i) => (
                      <div key={i} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></div>
                        {example}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Civic Levels */}
        <Card className="mb-12 shadow-xl border-2 border-blue-100" data-testid="card-civic-levels">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-t-lg">
            <CardTitle className="text-2xl flex items-center">
              <TrendingUp className="w-6 h-6 mr-3" />
              Civic Achievement Levels
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {civicLevels.map((level, index) => (
                <div key={index} className="bg-white rounded-xl border-2 border-gray-100 p-6 hover:shadow-lg transition-all duration-300" data-testid={`card-level-${level.level}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`p-3 rounded-full ${level.bgColor} mr-4`}>
                        <div className={level.color}>
                          {level.icon}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900">Level {level.level}: {level.title}</h4>
                        <div className="text-sm font-semibold text-gray-600">{level.range}</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{level.description}</p>
                  <div>
                    <h5 className="font-semibold text-sm text-gray-700 mb-2">Benefits & Privileges:</h5>
                    <div className="space-y-1">
                      {level.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Community Impact Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Community Statistics */}
          <Card className="shadow-xl border-2 border-green-100" data-testid="card-community-stats">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
              <CardTitle className="text-xl flex items-center">
                <BarChart3 className="w-5 h-5 mr-3" />
                Community Impact Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2" data-testid="text-total-citizens">
                    {communityStats?.totalCitizens?.toLocaleString() || '2,847'}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">Active Citizens</div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1" data-testid="text-total-tasks">
                      {communityStats?.totalTasks?.toLocaleString() || '12,456'}
                    </div>
                    <div className="text-xs text-gray-600">Tasks Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-1" data-testid="text-total-projects">
                      {communityStats?.totalProjects?.toLocaleString() || '347'}
                    </div>
                    <div className="text-xs text-gray-600">Projects Supported</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-emerald-600 mb-1" data-testid="text-average-score">
                      {communityStats?.averageScore?.toFixed(1) || '28.4'}
                    </div>
                    <div className="text-xs text-gray-600">Average Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-orange-600 mb-1" data-testid="text-total-states">
                      {communityStats?.totalStates || '36'}
                    </div>
                    <div className="text-xs text-gray-600">States Active</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Contributors (Anonymous) */}
          <Card className="shadow-xl border-2 border-amber-100" data-testid="card-leaderboard">
            <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg">
              <CardTitle className="text-xl flex items-center">
                <Trophy className="w-5 h-5 mr-3" />
                Community Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {(topContributors || [
                  { rank: 1, score: 247, level: "Civic Champion", state: "Lagos" },
                  { rank: 2, score: 189, level: "Community Leader", state: "FCT" },
                  { rank: 3, score: 156, level: "Community Leader", state: "Kano" },
                  { rank: 4, score: 134, level: "Community Leader", state: "Rivers" },
                  { rank: 5, score: 128, level: "Community Leader", state: "Ogun" }
                ]).map((contributor: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg" data-testid={`row-contributor-${contributor.rank}`}>
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        contributor.rank === 1 ? 'bg-yellow-500' : 
                        contributor.rank === 2 ? 'bg-gray-400' :
                        contributor.rank === 3 ? 'bg-amber-600' : 'bg-blue-500'
                      }`}>
                        {contributor.rank}
                      </div>
                      <div className="ml-4">
                        <div className="font-semibold text-gray-900">Citizen #{contributor.rank}</div>
                        <div className="text-sm text-gray-600">{contributor.state} State</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-emerald-600">{contributor.score}</div>
                      <Badge variant="secondary" className="text-xs">
                        {contributor.level}
                      </Badge>
                    </div>
                  </div>
                ))}
                
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-500 italic">
                    Rankings are updated weekly. Individual privacy is protected.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transparency Principles */}
        <Card className="shadow-xl border-2 border-violet-100" data-testid="card-transparency-principles">
          <CardHeader className="bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-t-lg">
            <CardTitle className="text-xl flex items-center">
              <Shield className="w-5 h-5 mr-3" />
              Our Transparency Principles
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-gray-900 mb-3">Open Methodology</h4>
                <p className="text-gray-600 mb-4">
                  All scoring calculations are transparent and publicly documented. 
                  No hidden algorithms or arbitrary point assignments.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-3">Privacy Protection</h4>
                <p className="text-gray-600 mb-4">
                  Individual scores are private unless users choose to share them. 
                  Leaderboards use anonymous ranking systems.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-3">Regular Updates</h4>
                <p className="text-gray-600 mb-4">
                  Community statistics and methodology updates are published regularly 
                  to maintain trust and accountability.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-3">Community Input</h4>
                <p className="text-gray-600 mb-4">
                  Scoring methodology evolves based on community feedback and 
                  real-world impact assessment.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
    </div>
  );
}
