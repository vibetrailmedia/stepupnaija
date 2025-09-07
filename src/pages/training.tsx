import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { InteractiveTrainingModule } from "@/components/InteractiveTrainingModule";
import { 
  BookOpen, 
  Clock, 
  Play, 
  ArrowLeft,
  Brain,
  Award,
  Target,
  CheckCircle2
} from "lucide-react";
import { useLocation } from "wouter";

export default function Training() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("learn");
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [showInteractiveModule, setShowInteractiveModule] = useState(false);

  // Fetch training modules from API
  const { data: modules = [], isLoading: modulesLoading } = useQuery({
    queryKey: ['/api/training/modules'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/training/modules');
      return response.json();
    }
  });

  // Fetch user's learning analytics
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['/api/training/analytics/user'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/training/analytics/user');
      return response.json();
    }
  });

  // Fetch training recommendations
  const { data: recommendations = [], isLoading: recommendationsLoading } = useQuery({
    queryKey: ['/api/training/recommendations'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/training/recommendations');
      return response.json();
    }
  });

  // Fetch user certificates
  const { data: certificates = [], isLoading: certificatesLoading } = useQuery({
    queryKey: ['/api/training/certificates'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/training/certificates');
      return response.json();
    }
  });

  // Get specific module for interactive view
  const { data: moduleDetails, isLoading: moduleDetailsLoading } = useQuery({
    queryKey: ['/api/training/modules', selectedModule],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/training/modules/${selectedModule}`);
      return response.json();
    },
    enabled: !!selectedModule
  });

  // Get user progress for selected module
  const { data: moduleProgress } = useQuery({
    queryKey: ['/api/training/progress', selectedModule],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/training/progress/${selectedModule}`);
      return response.json();
    },
    enabled: !!selectedModule
  });

  // Progress update mutation
  const updateProgressMutation = useMutation({
    mutationFn: ({ moduleId, progressData }: { moduleId: string; progressData: any }) =>
      apiRequest('POST', `/api/training/progress/${moduleId}`, progressData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/training/progress'] });
      queryClient.invalidateQueries({ queryKey: ['/api/training/analytics/user'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Quiz submission mutation
  const submitQuizMutation = useMutation({
    mutationFn: async ({ moduleId, answers, score }: { moduleId: string; answers: any; score: number }) => {
      const response = await apiRequest('POST', `/api/training/quiz/${moduleId}/submit`, { answers, score });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.passed) {
        toast({
          title: "🎉 Quiz Passed!",
          description: `Great job! You scored ${data.score}% and earned 10 SUP tokens.`,
        });
      }
      queryClient.invalidateQueries({ queryKey: ['/api/training/progress'] });
      queryClient.invalidateQueries({ queryKey: ['/api/training/analytics/user'] });
      queryClient.invalidateQueries({ queryKey: ['/api/training/certificates'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit quiz. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Handlers for interactive training module
  const handleModuleProgressUpdate = (progressData: any) => {
    if (selectedModule) {
      updateProgressMutation.mutate({ moduleId: selectedModule, progressData });
    }
  };

  const handleModuleComplete = (finalScore: number) => {
    toast({
      title: "🎓 Module Completed!",
      description: `Congratulations! You completed the training module with a score of ${finalScore}%.`,
    });
    
    setShowInteractiveModule(false);
    setSelectedModule(null);
    
    // Refresh data
    queryClient.invalidateQueries({ queryKey: ['/api/training'] });
  };

  const startInteractiveModule = (moduleId: string) => {
    setSelectedModule(moduleId);
    setShowInteractiveModule(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Show interactive module if selected
  if (showInteractiveModule && moduleDetails) {
    const transformedModule = {
      id: moduleDetails.id,
      title: moduleDetails.title,
      description: moduleDetails.description,
      duration: moduleDetails.estimatedDuration || 30,
      difficulty: moduleDetails.difficulty || 'beginner',
      category: moduleDetails.type || 'General',
      objectives: [
        'Understand key concepts and principles',
        'Apply knowledge in practical scenarios',
        'Complete hands-on activities',
        'Pass the assessment with 70% or higher'
      ],
      content: {
        videos: moduleDetails.videoUrl ? [{ 
          title: 'Main Video Lesson',
          url: moduleDetails.videoUrl,
          duration: Math.floor((moduleDetails.estimatedDuration || 30) * 0.6)
        }] : [],
        readings: moduleDetails.content ? [{ 
          title: 'Course Material',
          content: moduleDetails.content
        }] : [],
        activities: [
          {
            title: 'Reflection Exercise',
            description: 'Think about how this topic applies to your civic engagement activities.',
            type: 'reflection'
          }
        ]
      },
      quiz: [
        {
          id: 'q1',
          type: 'multiple_choice' as const,
          question: 'What is the main goal of civic engagement?',
          options: ['Personal gain', 'Community improvement', 'Political power', 'Economic profit'],
          correctAnswer: 'Community improvement',
          explanation: 'Civic engagement is fundamentally about improving communities and society.',
          points: 25
        },
        {
          id: 'q2',
          type: 'true_false' as const,
          question: 'Every citizen has a role to play in national development.',
          correctAnswer: 'true',
          explanation: 'Yes, every citizen can contribute to national development through various civic activities.',
          points: 25
        }
      ],
      passingScore: 70,
      certificateEligible: true
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Button 
            variant="ghost" 
            onClick={() => {
              setShowInteractiveModule(false);
              setSelectedModule(null);
            }}
            className="mb-6"
            data-testid="back-to-overview"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Training
          </Button>
          
          <InteractiveTrainingModule
            module={transformedModule}
            userProgress={moduleProgress}
            onProgressUpdate={handleModuleProgressUpdate}
            onComplete={handleModuleComplete}
          />
        </div>
        
      </div>
    );
  }

  if (modulesLoading || analyticsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header Section */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/")}
            className="mb-4"
            data-testid="button-back-to-dashboard"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Leadership Training Center
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Build the skills you need to drive real change in your community through structured learning paths
            </p>
          </div>
        </div>

        {/* Progress Overview */}
        {analytics && (
          <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Your Learning Journey</h3>
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <span>{analytics.completedModules} of {analytics.totalModulesAvailable} modules completed</span>
                  <span>{Math.round((analytics.totalTimeSpent || 0) / 60)}h total learning time</span>
                </div>
                <div className="mt-4">
                  <Progress value={analytics.completionRate} className="h-2" />
                </div>
              </div>
              
              <div className="text-center sm:text-right">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {analytics.completionRate}%
                </div>
                <div className="text-sm text-gray-500">Complete</div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-white" data-testid="training-tabs">
            <TabsTrigger value="learn" className="text-sm sm:text-base">Learn</TabsTrigger>
            <TabsTrigger value="progress" className="text-sm sm:text-base">Progress</TabsTrigger>
            <TabsTrigger value="certificates" className="text-sm sm:text-base">Certificates</TabsTrigger>
          </TabsList>

          {/* Learn Tab - Main Learning Experience */}
          <TabsContent value="learn" className="space-y-8">
            {/* Recommended for You */}
            {recommendations && recommendations.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Brain className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Recommended for You</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {recommendations.slice(0, 3).map((module: any) => (
                    <Card key={module.id} className="hover:shadow-md transition-shadow border-blue-100" data-testid={`recommendation-${module.id}`}>
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between mb-3">
                          <Badge className="bg-blue-100 text-blue-700 border-blue-200">Recommended</Badge>
                          <Badge variant="outline" className={getDifficultyColor(module.difficulty)}>
                            {module.difficulty}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg leading-tight">{module.title}</CardTitle>
                        <p className="text-sm text-gray-600 line-clamp-2">{module.description}</p>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {module.estimatedDuration}min
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="w-4 h-4 text-green-500" />
                            {module.supReward} SUP
                          </span>
                        </div>
                        <Button 
                          onClick={() => startInteractiveModule(module.id)}
                          className="w-full"
                          data-testid={`start-recommended-${module.id}`}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Start Learning
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* All Training Modules */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <BookOpen className="h-5 w-5 text-gray-700" />
                <h2 className="text-xl font-semibold text-gray-900">All Training Modules</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modulesLoading ? (
                  <div className="col-span-full text-center py-12">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-gray-500">Loading training modules...</p>
                  </div>
                ) : Array.isArray(modules) && modules.length > 0 ? modules.map((module: any) => (
                  <Card key={module.id} className="hover:shadow-md transition-shadow" data-testid={`module-card-${module.id}`}>
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="outline" className="text-xs">{module.type}</Badge>
                        <Badge variant="outline" className={getDifficultyColor(module.difficulty)}>
                          {module.difficulty}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg leading-tight">{module.title}</CardTitle>
                      <p className="text-sm text-gray-600 line-clamp-2">{module.description}</p>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {module.estimatedDuration}min
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="w-4 h-4 text-green-500" />
                          {module.supReward} SUP
                        </span>
                      </div>
                      <Button 
                        onClick={() => startInteractiveModule(module.id)}
                        className="w-full"
                        data-testid={`start-module-${module.id}`}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Module
                      </Button>
                    </CardContent>
                  </Card>
                )) : (
                  <div className="col-span-full text-center py-12">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Training Modules Available</h3>
                    <p className="text-gray-500">Training modules will appear here once they are loaded.</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Learning Progress</h2>
                <p className="text-gray-600">Track your leadership development journey</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {analytics?.completedModules || 0}
                    </div>
                    <p className="text-sm text-gray-600">Modules Completed</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {Math.round((analytics?.totalTimeSpent || 0) / 60)}h
                    </div>
                    <p className="text-sm text-gray-600">Learning Time</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {analytics?.averageScore || 0}%
                    </div>
                    <p className="text-sm text-gray-600">Average Score</p>
                  </CardContent>
                </Card>
              </div>

              {analytics?.recentActivity?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.recentActivity.map((activity: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{activity.moduleTitle}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(activity.completedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              {activity.score}%
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Certificates Tab */}
          <TabsContent value="certificates">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your Certificates</h2>
                <p className="text-gray-600">Recognition for your completed training modules</p>
              </div>

              {certificatesLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                  <p className="text-gray-500">Loading certificates...</p>
                </div>
              ) : certificates && certificates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {certificates.map((cert: any) => (
                    <Card key={cert.id} className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
                      <CardHeader>
                        <div className="flex items-center justify-center mb-4">
                          <Award className="h-12 w-12 text-yellow-600" />
                        </div>
                        <CardTitle className="text-center text-lg">{cert.moduleTitle}</CardTitle>
                        <p className="text-center text-sm text-gray-600">
                          Earned {new Date(cert.earnedAt).toLocaleDateString()}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center">
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                            Score: {cert.score}%
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Award className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Certificates Yet</h3>
                  <p className="text-gray-500 mb-6">Complete training modules to earn certificates</p>
                  <Button onClick={() => setActiveTab("learn")}>
                    Start Learning
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
    </div>
  );
}