import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { 
  Crown, 
  Users, 
  Award, 
  Target,
  TrendingUp,
  MessageSquare,
  Calendar,
  BookOpen,
  Star,
  CheckCircle,
  AlertCircle,
  BarChart3,
  FileText,
  Megaphone
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function LeadershipPortalPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Helper function to handle coming soon features
  const handleComingSoon = (featureName: string) => {
    toast({
      title: "Coming Soon!",
      description: `${featureName} will be available in a future update. Thank you for your patience!`,
      variant: "default",
    });
  };

  // Helper function to navigate to existing pages or show coming soon
  const navigateOrComingSoon = (path: string, featureName: string) => {
    const existingRoutes = [
      '/dashboard', '/wallet', '/engage', '/projects', '/transparency', '/profile', 
      '/kyc', '/admin', '/treasury', '/education', '/geography', '/notifications', 
      '/challenge', '/nominate', '/candidates', '/training', '/network', '/voting', 
      '/forum', '/events', '/verification', '/progress', '/founders-wall', 
      '/quiz-center', '/sup-dashboard', '/campus', '/nysc-camps', '/leadership-portal', 
      '/top-schools', '/methodology', '/data-submission', '/feedback', '/feedback/view', 
      '/committee', '/volunteer-onboarding', '/volunteer-dashboard', '/about', 
      '/faq', '/contact', '/help', '/terms', '/privacy', '/security'
    ];
    
    if (existingRoutes.includes(path)) {
      setLocation(path);
    } else {
      handleComingSoon(featureName);
    }
  };

  // Mock leadership data - will be replaced with real API calls
  const leadershipStats = {
    totalMembers: 2500,
    activeProjects: 8,
    monthlyEngagement: 85,
    supEarned: 450,
    leadershipRank: "Campus Governor",
    institution: "University of Lagos",
    faculty: "Engineering",
    termStart: "2024-08-01",
    termEnd: "2025-07-31"
  };

  const leadershipActivities = [
    {
      id: "monthly-report",
      title: "Submit Monthly Leadership Report",
      description: "Report on community projects and member engagement",
      deadline: "2025-01-31",
      rewardSUP: 50,
      status: "pending",
      priority: "high"
    },
    {
      id: "budget-proposal",
      title: "Submit Student Activity Budget Proposal",
      description: "Outline budget requirements for next semester activities",
      deadline: "2025-02-15",
      rewardSUP: 75,
      status: "pending",
      priority: "medium"
    },
    {
      id: "town-hall",
      title: "Organize Campus Town Hall Meeting",
      description: "Host quarterly student engagement meeting",
      deadline: "2025-02-28",
      rewardSUP: 100,
      status: "in_progress",
      priority: "high"
    },
    {
      id: "leadership-training",
      title: "Complete Advanced Leadership Module",
      description: "Finish conflict resolution and governance training",
      deadline: "2025-03-15",
      rewardSUP: 80,
      status: "available",
      priority: "medium"
    }
  ];

  const leadershipResources = [
    {
      id: "governance-guide",
      title: "Student Government Best Practices",
      description: "Comprehensive guide to effective student leadership",
      type: "handbook",
      pages: 45,
      category: "Governance"
    },
    {
      id: "conflict-resolution",
      title: "Campus Conflict Resolution Toolkit", 
      description: "Tools and strategies for resolving student disputes",
      type: "toolkit",
      pages: 28,
      category: "Leadership Skills"
    },
    {
      id: "budget-management",
      title: "Student Union Budget Management",
      description: "Financial planning and oversight for student organizations",
      type: "course",
      pages: 32,
      category: "Finance"
    },
    {
      id: "event-planning",
      title: "Large-Scale Campus Event Planning",
      description: "Step-by-step guide to organizing successful campus events",
      type: "handbook",
      pages: 38,
      category: "Event Management"
    }
  ];

  const achievements = [
    {
      id: "first-term",
      title: "First Term Completion",
      description: "Successfully completed first term as student leader",
      earned: true,
      date: "2024-12-15"
    },
    {
      id: "high-engagement",
      title: "High Engagement Leader",
      description: "Maintained 80%+ student engagement for 3 months",
      earned: true,
      date: "2024-11-20"
    },
    {
      id: "project-success",
      title: "Project Success Champion",
      description: "Led 5+ successful community projects",
      earned: false,
      progress: 3
    },
    {
      id: "mentor",
      title: "Leadership Mentor",
      description: "Mentored 10+ emerging student leaders",
      earned: false,
      progress: 6
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600 bg-red-50 border-red-200";
      case "medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low": return "text-green-600 bg-green-50 border-green-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in_progress": return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "pending": return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <CheckCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 to-indigo-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6">
              <Badge className="bg-yellow-500 text-black px-4 py-2 text-sm font-semibold">
                👑 LEADERSHIP PORTAL
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Welcome, <span className="text-yellow-400">{user?.firstName || 'Leader'}</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed opacity-90">
              Your dedicated portal for campus leadership, student governance, and community impact tracking.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">{leadershipStats.totalMembers.toLocaleString()}</div>
                <div className="text-sm opacity-80">Students Represented</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">{leadershipStats.activeProjects}</div>
                <div className="text-sm opacity-80">Active Projects</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">{leadershipStats.monthlyEngagement}%</div>
                <div className="text-sm opacity-80">Engagement Rate</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">{leadershipStats.supEarned}</div>
                <div className="text-sm opacity-80">SUP Tokens Earned</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Leadership Overview */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-purple-600" />
                  Leadership Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Position</label>
                    <p className="text-lg font-semibold text-gray-900">{leadershipStats.leadershipRank}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Institution</label>
                    <p className="text-lg font-semibold text-gray-900">{leadershipStats.institution}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Faculty/Department</label>
                    <p className="text-lg font-semibold text-gray-900">{leadershipStats.faculty}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Term Duration</label>
                    <p className="text-lg font-semibold text-gray-900">Aug 2024 - Jul 2025</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Term Progress</span>
                    <span className="text-sm text-gray-500">65% Complete</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Student Engagement</span>
                    <Badge variant="secondary">{leadershipStats.monthlyEngagement}%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Projects Delivered</span>
                    <Badge variant="secondary">{leadershipStats.activeProjects}/10</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">SUP Earned</span>
                    <Badge className="bg-green-100 text-green-700">{leadershipStats.supEarned}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Leadership Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-semibold">4.7/5</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Leadership Tabs */}
        <Tabs defaultValue="activities" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="activities" className="flex items-center gap-2" data-testid="tab-activities">
              <CheckCircle className="h-4 w-4" />
              Activities
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2" data-testid="tab-resources">
              <BookOpen className="h-4 w-4" />
              Resources
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2" data-testid="tab-achievements">
              <Award className="h-4 w-4" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="communication" className="flex items-center gap-2" data-testid="tab-communication">
              <MessageSquare className="h-4 w-4" />
              Communication
            </TabsTrigger>
          </TabsList>

          <TabsContent value="activities" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {leadershipActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`border-l-4 ${getPriorityColor(activity.priority)}`}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                          {getStatusIcon(activity.status)}
                          {activity.title}
                        </CardTitle>
                        <Badge className="bg-green-100 text-green-700">
                          +{activity.rewardSUP} SUP
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{activity.description}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Due: {new Date(activity.deadline).toLocaleDateString()}
                        </div>
                        <Badge variant="outline" className={getPriorityColor(activity.priority)}>
                          {activity.priority.toUpperCase()} PRIORITY
                        </Badge>
                      </div>

                      <Button 
                        className="w-full" 
                        data-testid={`button-start-activity-${activity.id}`}
                        variant={activity.status === "completed" ? "outline" : "default"}
                        disabled={activity.status === "completed"}
                      >
                        {activity.status === "completed" ? "Completed" : 
                         activity.status === "in_progress" ? "Continue" : "Start Activity"}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {leadershipResources.map((resource, index) => (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        {resource.title}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{resource.category}</Badge>
                        <Badge variant="secondary">{resource.pages} pages</Badge>
                        <Badge className="bg-blue-100 text-blue-700">{resource.type}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{resource.description}</p>
                      <Button className="w-full" data-testid={`button-access-resource-${resource.id}`} onClick={() => navigateOrComingSoon(`/resources/${resource.id}`, resource.title)}>
                        Access Resource
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`${achievement.earned ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {achievement.earned ? (
                          <Award className="h-5 w-5 text-green-600" />
                        ) : (
                          <Target className="h-5 w-5 text-gray-400" />
                        )}
                        {achievement.title}
                        {achievement.earned && (
                          <Badge className="bg-green-100 text-green-700 ml-auto">Earned</Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{achievement.description}</p>
                      
                      {achievement.earned ? (
                        <div className="text-sm text-green-600 font-medium">
                          Earned on {achievement.date ? new Date(achievement.date).toLocaleDateString() : 'Unknown date'}
                        </div>
                      ) : achievement.progress !== undefined ? (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{achievement.progress}/10</span>
                          </div>
                          <Progress value={(achievement.progress / 10) * 100} className="h-2" />
                        </div>
                      ) : (
                        <Badge variant="outline">Not Started</Badge>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="communication" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Megaphone className="h-5 w-5 text-blue-600" />
                    Announcements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Create and send announcements to your student community.
                  </p>
                  <Button className="w-full" data-testid="button-create-announcement" onClick={() => navigateOrComingSoon('/announcements/create', 'Announcement Creation')}>
                    Create Announcement
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-green-600" />
                    Student Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Review feedback and suggestions from your student community.
                  </p>
                  <Button className="w-full" data-testid="button-view-feedback" onClick={() => navigateOrComingSoon('/feedback/view', 'Student Feedback Dashboard')}>
                    View Feedback
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    Town Hall Meetings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Schedule and manage student town hall meetings and forums.
                  </p>
                  <Button className="w-full" data-testid="button-schedule-townhall" onClick={() => navigateOrComingSoon('/events', 'Town Hall Meeting Scheduler')}>
                    Schedule Meeting
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-orange-600" />
                    Reports & Documentation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Generate and submit official leadership reports and documentation.
                  </p>
                  <Button className="w-full" data-testid="button-generate-reports" onClick={() => navigateOrComingSoon('/reports/generate', 'Leadership Report Generator')}>
                    Generate Reports
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Leadership Portal Resources Section */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 rounded-3xl p-8 border border-gray-200 mt-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Leadership Portal Resources & Quick Access</h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Essential tools and resources for effective student leadership and governance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-indigo-200 hover:border-indigo-400 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-indigo-700 text-lg">
                  <Crown className="h-5 w-5" />
                  Leadership Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li><Button variant="ghost" className="p-0 h-auto text-gray-600 hover:text-indigo-600" onClick={() => navigateOrComingSoon('/tools/activity-management', 'Activity Management Tools')}>Activity Management</Button></li>
                  <li><Button variant="ghost" className="p-0 h-auto text-gray-600 hover:text-indigo-600" onClick={() => navigateOrComingSoon('/forum', 'Student Communication Portal')}>Student Communication</Button></li>
                  <li><Button variant="ghost" className="p-0 h-auto text-gray-600 hover:text-indigo-600" onClick={() => navigateOrComingSoon('/progress', 'Performance Analytics Dashboard')}>Performance Analytics</Button></li>
                  <li><Button variant="ghost" className="p-0 h-auto text-gray-600 hover:text-indigo-600" onClick={() => navigateOrComingSoon('/education', 'Leadership Resource Library')}>Resource Library</Button></li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-blue-200 hover:border-blue-400 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-blue-700 text-lg">
                  <BookOpen className="h-5 w-5" />
                  Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li><Button variant="ghost" className="p-0 h-auto text-gray-600 hover:text-blue-600" onClick={() => navigateOrComingSoon('/education', 'Governance Guides Library')}>Governance Guides</Button></li>
                  <li><Button variant="ghost" className="p-0 h-auto text-gray-600 hover:text-blue-600" onClick={() => navigateOrComingSoon('/training', 'Leadership Training Programs')}>Leadership Training</Button></li>
                  <li><Button variant="ghost" className="p-0 h-auto text-gray-600 hover:text-blue-600" onClick={() => navigateOrComingSoon('/education', 'Best Practices Library')}>Best Practices</Button></li>
                  <li><Button variant="ghost" className="p-0 h-auto text-gray-600 hover:text-blue-600" onClick={() => navigateOrComingSoon('/education', 'Leadership Case Studies')}>Case Studies</Button></li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-green-200 hover:border-green-400 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-green-700 text-lg">
                  <Users className="h-5 w-5" />
                  Community
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li><Button variant="ghost" className="p-0 h-auto text-gray-600 hover:text-green-600" onClick={() => navigateOrComingSoon('/network?type=leaders', 'Leader Network Portal')}>Leader Network</Button></li>
                  <li><Button variant="ghost" className="p-0 h-auto text-gray-600 hover:text-green-600" onClick={() => navigateOrComingSoon('/network', 'Peer Mentorship Program')}>Peer Mentorship</Button></li>
                  <li><Button variant="ghost" className="p-0 h-auto text-gray-600 hover:text-green-600" onClick={() => navigateOrComingSoon('/forum', 'Experience Sharing Platform')}>Experience Sharing</Button></li>
                  <li><Button variant="ghost" className="p-0 h-auto text-gray-600 hover:text-green-600" onClick={() => navigateOrComingSoon('/forum', 'Support Forums')}>Support Forums</Button></li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-purple-200 hover:border-purple-400 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-purple-700 text-lg">
                  <MessageSquare className="h-5 w-5" />
                  Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li><Button variant="ghost" className="p-0 h-auto text-gray-600 hover:text-purple-600" onClick={() => navigateOrComingSoon('/help', 'Leadership Help Center')}>Leadership Help Center</Button></li>
                  <li><Button variant="ghost" className="p-0 h-auto text-gray-600 hover:text-purple-600" onClick={() => navigateOrComingSoon('/help', 'Technical Support Center')}>Technical Support</Button></li>
                  <li><Button variant="ghost" className="p-0 h-auto text-gray-600 hover:text-purple-600" onClick={() => navigateOrComingSoon('/training', 'Training Materials Library')}>Training Materials</Button></li>
                  <li><Button variant="ghost" className="p-0 h-auto text-gray-600 hover:text-purple-600" onClick={() => navigateOrComingSoon('/contact', 'Contact Administration')}>Contact Administration</Button></li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}