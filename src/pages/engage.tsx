import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import type { Wallet, EngagementTask, Transaction } from "@shared/schema";
import { PhotoUploadTaskCard } from "@/components/PhotoUploadTaskCard";
import { SurveyTaskCard } from "@/components/SurveyTaskCard";
import { PetitionTaskCard } from "@/components/PetitionTaskCard";
// import { QuizTaskCard } from "@/components/QuizTaskCard"; // REMOVED - using inline quiz
import { SocialShareTaskCard } from "@/components/SocialShareTaskCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  HelpCircle, 
  Star, 
  Share2, 
  Users, 
  Award,
  Flame,
  TrendingUp,
  Loader2,
  CheckCircle,
  Clock,
  Camera
} from "lucide-react";

export default function Engage() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const queryClient = useQueryClient();
  const [completingTask, setCompletingTask] = useState<string | null>(null);
  const [activeQuizTask, setActiveQuizTask] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number>(120); // 2 minutes per quiz
  const [quizExpired, setQuizExpired] = useState(false);

  // Quiz timer effect
  useEffect(() => {
    if (activeQuizTask && timeLeft > 0 && !quizExpired) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && activeQuizTask) {
      setQuizExpired(true);
    }
  }, [timeLeft, activeQuizTask, quizExpired]);

  // Reset timer when opening new quiz
  useEffect(() => {
    if (activeQuizTask) {
      setTimeLeft(120); // Reset to 2 minutes
      setQuizExpired(false);
    }
  }, [activeQuizTask]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/auth";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: wallet } = useQuery<Wallet>({
    queryKey: ["/api/wallet"],
    enabled: isAuthenticated,
    retry: false,
  });

  const { data: tasks, isLoading: tasksLoading } = useQuery<EngagementTask[]>({
    queryKey: ["/api/tasks"],
    enabled: isAuthenticated,
    retry: false,
  });

  const { data: transactions } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
    enabled: isAuthenticated,
    retry: false,
  });

  const completeTaskMutation = useMutation({
    mutationFn: async (taskData: { taskId: string; data: any }) => {
      await apiRequest('POST', `/api/tasks/${taskData.taskId}/complete`, taskData.data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/wallet'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      toast({
        title: "Task Completed!",
        description: "You've earned SUP tokens for your civic engagement.",
      });
      setCompletingTask(null);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      
      if (error?.message?.includes('already completed')) {
        toast({
          title: "Task Already Completed",
          description: "You've already completed this task.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to complete task",
          variant: "destructive",
        });
      }
      setCompletingTask(null);
    },
  });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <p className="text-gray-600">Loading engagement tasks...</p>
        </div>
      </div>
    );
  }

  const engagementTransactions = transactions?.filter((t: any) => t.type === 'ENGAGE') || [];
  const totalEarned = engagementTransactions.reduce((sum: number, t: any) => sum + parseFloat(t.amountSUP || '0'), 0);
  const tasksCompleted = engagementTransactions.length;
  const currentStreak = 7; // Mock streak data

  const defaultTasks = [
    {
      id: 'daily-quiz',
      kind: 'QUIZ',
      title: 'Daily Civic Quiz',
      description: 'Test your knowledge of Nigerian civics and governance',
      rewardSUP: '25',
      icon: HelpCircle,
      color: 'primary',
      estimate: '5 min',
      difficulty: 'Easy'
    },
    {
      id: 'nomination',
      kind: 'NOMINATION', 
      title: 'Nominate a Community Hero',
      description: 'Recognize someone making a positive impact in your community',
      rewardSUP: '15',
      icon: Star,
      color: 'secondary',
      estimate: '3 min',
      difficulty: 'Easy'
    },
    {
      id: 'share-progress',
      kind: 'SHARE',
      title: 'Share Community Impact',
      description: 'Share Step Up Naija progress on your social media',
      rewardSUP: '10',
      icon: Share2,
      color: 'accent',
      estimate: '2 min',
      difficulty: 'Easy'
    },
    {
      id: 'fact-check',
      kind: 'QUIZ',
      title: 'Nigerian Constitution Facts',
      description: 'Help verify facts about the Nigerian Constitution',
      rewardSUP: '30',
      icon: HelpCircle,
      color: 'primary',
      estimate: '8 min',
      difficulty: 'Medium'
    },
    {
      id: 'town-hall-photo',
      kind: 'PHOTO_UPLOAD',
      title: 'Town Hall Meeting Attendance',
      description: 'Upload a photo showing your attendance at a local town hall or community meeting',
      rewardSUP: '50',
      icon: Camera,
      color: 'secondary',
      estimate: '15 min',
      difficulty: 'Easy'
    },
    {
      id: 'volunteer-photo',
      kind: 'PHOTO_UPLOAD',
      title: 'Community Volunteer Work',
      description: 'Share photo evidence of volunteer work in your community (cleanup, helping elderly, etc.)',
      rewardSUP: '40',
      icon: Camera,
      color: 'primary',
      estimate: '20 min',
      difficulty: 'Medium'
    },
    {
      id: 'civic-education-photo',
      kind: 'PHOTO_UPLOAD',
      title: 'Civic Education Event',
      description: 'Upload photo from attending a civic education workshop, seminar, or training',
      rewardSUP: '35',
      icon: Camera,
      color: 'accent',
      estimate: '10 min',
      difficulty: 'Easy'
    }
  ];

  const tasksToShow = (tasks && tasks.length > 0) ? tasks : defaultTasks;

  const handleCompleteTask = (task: any, uploadData?: any) => {
    // Prevent completing already completed tasks
    if (task.completed) {
      toast({
        title: "Task Already Completed",
        description: "You've already earned rewards for this task.",
        variant: "destructive",
      });
      return;
    }

    // For quiz tasks, show the quiz interface instead of completing immediately
    if (task.kind === 'QUIZ' && !uploadData) {
      setActiveQuizTask(task);
      return;
    }
    
    setCompletingTask(task.id);
    
    let taskData = {};
    switch (task.kind) {
      case 'QUIZ':
        taskData = uploadData || {
          answers: ['B', 'A', 'C', 'A'], // Mock quiz answers
          score: 85
        };
        break;
      case 'NOMINATION':
        taskData = {
          nominee: 'Dr. Amina Mohammed',
          reason: 'Outstanding healthcare work in Lagos',
          contact: 'community@stepupnaija.com'
        };
        break;
      case 'SHARE':
        taskData = {
          platform: 'Twitter',
          url: 'https://twitter.com/user/status/123',
          message: 'Supporting Nigerian communities through @StepUpNaija! 🇳🇬 #CivicEngagement'
        };
        break;
      case 'PHOTO_UPLOAD':
        taskData = uploadData || {
          photoUrl: '',
          taskType: 'photo_verification',
          timestamp: new Date().toISOString()
        };
        break;
      case 'SURVEY':
        taskData = uploadData || {
          responses: {},
          taskType: 'survey',
          completedAt: new Date().toISOString()
        };
        break;
      case 'PETITION':
        taskData = uploadData || {
          signedAt: new Date().toISOString(),
          taskType: 'petition'
        };
        break;
      default:
        taskData = { completed: true };
    }

    completeTaskMutation.mutate({ taskId: task.id, data: taskData });
  };

  const handleQuizComplete = (task: any, quizData: any) => {
    setActiveQuizTask(null);
    handleCompleteTask(task, quizData);
  };


  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary':
        return {
          bg: 'bg-primary-100',
          text: 'text-primary-600',
          button: 'bg-primary-600 hover:bg-primary-700',
          border: 'border-primary-200'
        };
      case 'secondary':
        return {
          bg: 'bg-secondary-100',
          text: 'text-secondary-600',
          button: 'bg-secondary-600 hover:bg-secondary-700',
          border: 'border-secondary-200'
        };
      case 'accent':
        return {
          bg: 'bg-accent-100',
          text: 'text-accent-500',
          button: 'bg-accent-500 hover:bg-accent-600',
          border: 'border-accent-200'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-600',
          button: 'bg-gray-600 hover:bg-gray-700',
          border: 'border-gray-200'
        };
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-700';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'Hard':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30 page-transition">
      {/* Navigation is provided by App.tsx for all authenticated users */}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header - Mobile Optimized */}
        <div className="text-center space-y-4 sm:space-y-6 py-6 sm:py-8 mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            🎯 Civic <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Engagement</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">Complete tasks, earn SUP tokens, and make Nigeria better</p>
        </div>

        {/* Stats Grid - Mobile Optimized */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          {/* Total Earned */}
          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center mb-2 sm:mb-0">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
                <span className="text-xs text-gray-500 hidden sm:block">Total Earned</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1" data-testid="text-total-earned">
                {totalEarned.toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm text-green-600 font-medium">🏆 SUP Earned</div>
            </CardContent>
          </Card>

          {/* Tasks Completed */}
          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2 sm:mb-0">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <span className="text-xs text-gray-500 hidden sm:block">Tasks Done</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1" data-testid="text-tasks-completed">
                {tasksCompleted}
              </div>
              <div className="text-xs sm:text-sm text-blue-600 font-medium">✅ Completed</div>
            </CardContent>
          </Card>

          {/* Current Streak */}
          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-2 sm:mb-0">
                  <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                </div>
                <span className="text-xs text-gray-500 hidden sm:block">Streak</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1" data-testid="text-current-streak">
                {currentStreak}
              </div>
              <div className="text-xs sm:text-sm text-orange-600 font-medium">🔥 Day Streak</div>
            </CardContent>
          </Card>

          {/* Available Tasks */}
          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-2 sm:mb-0">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
                <span className="text-xs text-gray-500 hidden sm:block">Available</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1" data-testid="text-available-tasks">
                {tasksToShow.length}
              </div>
              <div className="text-xs sm:text-sm text-purple-600 font-medium">⏰ New Tasks</div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile-First Layout */}
        
        {/* Tasks Section */}
        {activeQuizTask ? (
          <div className="space-y-4 mb-6 sm:mb-8">
            <Button
              variant="ghost"
              onClick={() => setActiveQuizTask(null)}
              className="mb-4 text-gray-600 hover:text-gray-800 flex items-center gap-2"
              data-testid="button-back-to-tasks"
            >
              ← Back to Tasks
            </Button>
            {/* Mobile-Optimized Quiz Interface */}
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg">
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl sm:text-2xl font-bold text-blue-900 flex items-center">
                      🧠 {activeQuizTask.title}
                    </h3>
                    <div className={`px-4 py-2 rounded-lg font-bold ${
                      timeLeft <= 30 
                        ? 'bg-red-100 text-red-600' 
                        : timeLeft <= 60 
                        ? 'bg-yellow-100 text-yellow-600' 
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      ⏰ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{activeQuizTask.description}</p>
                  <div className={`p-3 rounded-lg ${quizExpired ? 'bg-red-100' : 'bg-blue-100'}`}>
                    <p className={`text-sm font-medium ${quizExpired ? 'text-red-800' : 'text-blue-800'}`}>
                      {quizExpired 
                        ? '⏰ Time expired! Quiz cannot be submitted.' 
                        : `💡 You have ${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')} to complete this quiz and earn ${activeQuizTask.rewardSUP} SUP tokens`
                      }
                    </p>
                  </div>
                </div>
                
                {/* Question 1 */}
                <div className="mb-6 bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h4 className="font-bold text-lg sm:text-xl mb-6 text-gray-900 flex items-center">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">1</span>
                    How many states are there in Nigeria?
                  </h4>
                  <div className="space-y-3">
                    {['A. 35 states', 'B. 36 states', 'C. 37 states', 'D. 38 states'].map((option, i) => (
                      <div
                        key={i}
                        className={`p-4 sm:p-5 border-2 rounded-xl cursor-pointer font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 ${
                          answers['q1'] === option 
                            ? 'bg-gradient-to-r from-green-100 to-green-200 border-green-500 text-green-800 shadow-lg' 
                            : 'bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-700 shadow-sm'
                        }`}
                        onClick={() => {
                          setAnswers(prev => ({ ...prev, q1: option }));
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option}</span>
                          {answers['q1'] === option && (
                            <span className="text-green-600 font-bold text-xl">✓</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div 
                  className={`w-full p-4 sm:p-5 rounded-xl cursor-pointer text-center font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
                    quizExpired || Object.keys(answers).length === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white'
                  }`}
                  onClick={async () => {
                    if (Object.keys(answers).length === 0 || quizExpired) return;
                    
                    try {
                      await handleCompleteTask(activeQuizTask, { answers, completionTime: 120 - timeLeft });
                      setActiveQuizTask(null);
                      setAnswers({});
                      setTimeLeft(120);
                      setQuizExpired(false);
                    } catch (error) {
                      console.error('Quiz submission error:', error);
                      toast({
                        title: "Quiz Submission Failed",
                        description: "There was an error submitting your quiz. Please try again.",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  {quizExpired ? (
                    <>⏰ Time Expired - Cannot Submit</>
                  ) : Object.keys(answers).length > 0 ? (
                    <>🎯 Submit Quiz & Earn {activeQuizTask.rewardSUP} SUP</>
                  ) : (
                    <>⚠️ Please select an answer first</>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="mb-6 sm:mb-8">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                  🎯 Available Tasks
                </CardTitle>
                <Badge className="bg-gradient-to-r from-secondary-500 to-secondary-600 text-white w-fit">
                  {tasksToShow.length} Available
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
                {tasksLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="border border-gray-200 rounded-lg p-4 animate-pulse">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                          <div className="flex-1">
                            <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-48"></div>
                          </div>
                        </div>
                        <div className="w-full h-10 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(tasksToShow || []).map((task: any) => {
                      const IconComponent = task.icon || HelpCircle;
                      const colorClasses = getColorClasses(task.color || task.kind?.toLowerCase());
                      const isCompleting = completingTask === task.id;
                      
                      // Use specialized task cards for different task types
                      if (task.kind === 'PHOTO_UPLOAD') {
                        return (
                          <PhotoUploadTaskCard
                            key={task.id}
                            task={task}
                            onComplete={handleCompleteTask}
                            isCompleting={isCompleting}
                            colors={colorClasses}
                          />
                        );
                      }
                      
                      if (task.kind === 'SURVEY') {
                        return (
                          <SurveyTaskCard
                            key={task.id}
                            task={task}
                            onComplete={handleCompleteTask}
                            isCompleting={isCompleting}
                            colors={colorClasses}
                          />
                        );
                      }
                      
                      if (task.kind === 'PETITION') {
                        return (
                          <PetitionTaskCard
                            key={task.id}
                            task={task}
                            onComplete={handleCompleteTask}
                            isCompleting={isCompleting}
                            colors={colorClasses}
                          />
                        );
                      }
                      
                      if (task.kind === 'SHARE' || task.kind === 'SOCIAL_SHARE') {
                        return (
                          <SocialShareTaskCard
                            key={task.id}
                            task={task}
                            onComplete={handleCompleteTask}
                            isCompleting={isCompleting}
                            colors={colorClasses}
                          />
                        );
                      }
                      
                      // QUIZ tasks - DIRECT YELLOW CARD RENDERING
                      if (task.kind === 'QUIZ') {
                        return (
                          <div 
                            key={task.id} 
                            className={`border-2 rounded-xl p-4 sm:p-6 transition-all duration-300 ${
                              task.completed 
                                ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 opacity-75'
                                : 'border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 hover:border-blue-300 shadow-lg hover:shadow-xl transform hover:scale-105'
                            }`}
                            data-testid={`task-card-${task.id}`}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className={`px-3 py-1 rounded-full ${task.completed ? 'bg-green-100' : 'bg-blue-100'}`}>
                                <span className={`text-sm font-bold ${task.completed ? 'text-green-600' : 'text-blue-600'}`}>
                                  {task.completed ? '✅ COMPLETED' : '🧠 QUIZ TASK'}
                                </span>
                              </div>
                              <div className="bg-green-100 px-3 py-1 rounded-full">
                                <span className="text-sm text-green-600 font-bold">+{task.rewardSUP} SUP</span>
                              </div>
                            </div>
                            
                            <h3 className="font-bold text-gray-900 text-lg sm:text-xl mb-3">
                              {task.completed ? '✅' : '🧠'} {task.title}
                            </h3>
                            <p className="text-gray-600 mb-6 text-sm sm:text-base leading-relaxed">{task.description}</p>
                            
                            {task.completed ? (
                              <div className="w-full p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl text-center font-bold text-lg">
                                ✅ Quiz Completed - SUP Earned!
                              </div>
                            ) : (
                              <div 
                                className="w-full p-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl cursor-pointer text-center font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                onClick={() => {
                                  setActiveQuizTask(task);
                                }}
                                data-testid={`div-start-quiz-${task.id}`}
                              >
                                🧠 Start Quiz Challenge
                              </div>
                            )}
                            
                            <div className={`mt-4 p-3 rounded-lg ${task.completed ? 'bg-green-100' : 'bg-blue-100'}`}>
                              <p className={`text-xs text-center ${task.completed ? 'text-green-700' : 'text-blue-700'}`}>
                                {task.completed 
                                  ? '🎉 Thank you for your civic participation!' 
                                  : '💡 Test your civic knowledge and earn SUP tokens for correct answers'
                                }
                              </p>
                            </div>
                          </div>
                        );
                      }
                      
                      // Regular task card for other task types - Mobile Optimized
                      return (
                        <div 
                          key={task.id} 
                          className={`border rounded-lg p-4 hover:border-primary-300 transition-all duration-300 hover:shadow-lg hover:scale-105 ${colorClasses.border}`}
                          data-testid={`task-card-${task.id}`}
                        >
                          <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 mb-4">
                            {/* Mobile: Icon and badges in header row */}
                            <div className="flex items-center justify-between w-full sm:w-auto">
                              <div className={`w-12 h-12 sm:w-14 sm:h-14 ${colorClasses.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                <IconComponent className={`w-6 h-6 sm:w-7 sm:h-7 ${colorClasses.text}`} />
                              </div>
                              
                              {/* Mobile: Show badges next to icon */}
                              <div className="flex gap-2 sm:hidden">
                                <Badge className={getDifficultyColor(task.difficulty)}>
                                  {task.difficulty || 'Easy'}
                                </Badge>
                                <Badge className="bg-blue-50 text-blue-700 text-xs">
                                  +{task.rewardSUP} SUP
                                </Badge>
                              </div>
                            </div>
                            
                            {/* Task details */}
                            <div className="flex-1 w-full">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-2">
                                <h3 className="font-bold text-gray-900 text-lg sm:text-xl" data-testid={`text-task-title-${task.id}`}>
                                  {task.title}
                                </h3>
                                {/* Desktop: Show badges on the right */}
                                <div className="hidden sm:flex gap-2">
                                  <Badge className={getDifficultyColor(task.difficulty)}>
                                    {task.difficulty || 'Easy'}
                                  </Badge>
                                </div>
                              </div>
                              
                              <p className="text-sm sm:text-base text-gray-600 mb-3 leading-relaxed" data-testid={`text-task-description-${task.id}`}>
                                {task.description}
                              </p>
                              
                              <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
                                <span className="flex items-center gap-1">⏱️ {task.estimate}</span>
                                <span className="hidden sm:flex items-center gap-1">🏆 +{task.rewardSUP} SUP</span>
                              </div>
                            </div>
                          </div>
                          
                          <Button 
                            className={`w-full font-bold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl ${
                              task.completed 
                                ? 'bg-green-100 text-green-800 cursor-not-allowed' 
                                : `text-white ${colorClasses.button}`
                            }`}
                            onClick={() => handleCompleteTask(task)}
                            disabled={isCompleting || task.completed}
                            data-testid={`button-complete-task-${task.id}`}
                          >
                            {task.completed ? (
                              <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                ✅ Completed
                              </>
                            ) : isCompleting ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                🔄 Completing...
                              </>
                            ) : (
                              <>
                                🎯 Complete Task (+{task.rewardSUP} SUP)
                              </>
                            )}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
        )}

        {/* Progress & Stats Section - Mobile Optimized */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
          
          {/* Progress Card */}
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>📈 Your Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>🎯 Daily Goal</span>
                    <span className="font-medium">2/3 tasks</span>
                  </div>
                  <Progress value={67} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>📅 Weekly Goal</span>
                    <span className="font-medium">8/15 tasks</span>
                  </div>
                  <Progress value={53} className="h-2" />
                </div>
                
                <div className="pt-2 border-t">
                  <div className="text-sm text-gray-600 mb-2">⬆️ Next Level</div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-4 h-4 text-primary-600" />
                    <span className="text-sm font-medium">Civic Champion</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  <div className="text-xs text-gray-500 mt-1">
                    Complete 5 more tasks to unlock
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Streak Rewards */}
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                <span>🔥 Streak Rewards</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium">7 days</span>
                  <Badge className="bg-green-100 text-green-700 text-xs">Current 🎉</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">14 days</span>
                  <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">+50 SUP bonus</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">30 days</span>
                  <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">+150 SUP bonus</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">100 days</span>
                  <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">🏅 Special Badge</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card className="hover:shadow-lg transition-all duration-300 md:col-span-2 lg:col-span-1">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                <span>🏆 Top Engagers</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 sm:space-y-3">
                {[
                  { name: 'Adunni K.', points: 2450, rank: 1, emoji: '🥇' },
                  { name: 'Chidi O.', points: 2380, rank: 2, emoji: '🥈' },
                  { name: 'Fatima A.', points: 2320, rank: 3, emoji: '🥉' },
                  { name: 'You', points: totalEarned, rank: 15, emoji: '📍' }
                ].map((person, index) => (
                  <div key={index} className={`flex items-center justify-between p-2 rounded-lg ${person.name === 'You' ? 'bg-primary-50' : 'hover:bg-gray-50'}`}>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">
                        {person.emoji}
                      </span>
                      <span className={`text-sm font-medium ${person.name === 'You' ? 'text-primary-600' : 'text-gray-600'}`}>
                        #{person.rank}
                      </span>
                      <span className={`text-sm ${person.name === 'You' ? 'font-bold text-primary-600' : 'text-gray-900'}`}>
                        {person.name}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                      {person.points.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
