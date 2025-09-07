import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { HelpCircle, Star, Share2, Loader2, CheckCircle } from "lucide-react";
import type { EngagementTask } from "@shared/schema";
import { QuizTaskCard } from "./QuizTaskCard";
import { SocialShareTaskCard } from "./SocialShareTaskCard";
import { NominationTaskCard } from "./NominationTaskCard";
import { PetitionTaskCard } from "./PetitionTaskCard";
import { PhotoUploadTaskCard } from "./PhotoUploadTaskCard";
import { SurveyTaskCard } from "./SurveyTaskCard";

export function TaskList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTask, setActiveTask] = useState<any>(null);

  const { data: tasks, isLoading } = useQuery<EngagementTask[]>({
    queryKey: ["/api/tasks"],
    retry: false,
  });

  // Query to check completion status of default tasks
  const { data: taskCompletionStatus } = useQuery<{[key: string]: boolean}>({
    queryKey: ["/api/tasks/completion-status"],
    retry: false,
  });

  const completeTaskMutation = useMutation({
    mutationFn: async ({taskId, taskData}: {taskId: string, taskData?: any}) => {
      await apiRequest('POST', `/api/tasks/${taskId}/complete`, {
        answers: taskData?.answers || ['B', 'A', 'C'], // Use provided answers or mock
        nomination: taskData?.nomination || 'Dr. Amina Mohammed', // Use provided or mock
        socialPost: taskData?.socialPost || 'Shared on Twitter', // Use provided or mock
      });
    },
    onSuccess: (_, {taskId}) => {
      queryClient.invalidateQueries({ queryKey: ['/api/wallet'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/tasks/completion-status'] });
      setActiveTask(null); // Close the task interface
      toast({
        title: "Task Completed!",
        description: "You've earned 25 SUP tokens for your civic engagement.",
      });
    },
    onError: (error) => {
      // Check if this is a KYC limit error
      if (error.message?.includes('KYC_LIMIT_EXCEEDED')) {
        const limitMessage = error.message.replace('KYC_LIMIT_EXCEEDED: ', '');
        toast({
          title: "KYC Verification Required",
          description: limitMessage,
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Error",
        description: error.message || "Failed to complete task",
        variant: "destructive",
      });
    },
  });

  const defaultTasks = [
    {
      id: 'daily-quiz',
      kind: 'QUIZ',
      title: 'Daily Civic Quiz',
      description: 'Test your knowledge of Nigerian civics',
      rewardSUP: '25',
      icon: HelpCircle,
      color: 'primary',
      estimate: '5 min'
    },
    {
      id: 'nomination',
      kind: 'NOMINATION', 
      title: 'Nominate a Hero',
      description: 'Recognize someone making a difference',
      rewardSUP: '15',
      icon: Star,
      color: 'secondary',
      estimate: '3 min'
    },
    {
      id: 'share-progress',
      kind: 'SHARE',
      title: 'Share Progress',
      description: 'Share community impact on social media',
      rewardSUP: '10',
      icon: Share2,
      color: 'accent',
      estimate: '2 min'
    }
  ];

  // Merge default tasks with completion status
  const defaultTasksWithStatus = defaultTasks.map(task => ({
    ...task,
    completed: taskCompletionStatus?.[task.id] || false
  }));

  const tasksToShow = (tasks && tasks.length > 0) ? tasks : defaultTasksWithStatus;

  const handleTaskComplete = (task: any, taskData: any) => {
    completeTaskMutation.mutate({taskId: task.id, taskData});
  };

  const handleStartTask = (task: any) => {
    if (task.kind === 'QUIZ' || task.kind === 'SHARE' || task.kind === 'NOMINATION' || task.kind === 'PETITION' || task.kind === 'PHOTO_UPLOAD' || task.kind === 'SURVEY') {
      setActiveTask(task);
    } else {
      // For simple tasks, complete immediately
      completeTaskMutation.mutate({taskId: task.id});
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary':
        return {
          bg: 'bg-primary-100',
          text: 'text-primary-600',
          button: 'bg-primary-600 hover:bg-primary-700'
        };
      case 'secondary':
        return {
          bg: 'bg-secondary-100',
          text: 'text-secondary-600',
          button: 'bg-secondary-600 hover:bg-secondary-700'
        };
      case 'accent':
        return {
          bg: 'bg-accent-100',
          text: 'text-accent-500',
          button: 'bg-accent-500 hover:bg-accent-600'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-600',
          button: 'bg-gray-600 hover:bg-gray-700'
        };
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-900">Today's Civic Tasks</CardTitle>
            <div className="w-20 h-6 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 animate-pulse">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-48"></div>
                  </div>
                  <div className="text-right">
                    <div className="h-6 bg-gray-200 rounded w-16 mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                  </div>
                </div>
                <div className="w-full h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show task interface if a task is active
  if (activeTask) {
    const colorClasses = getColorClasses(activeTask.color || 'primary');
    
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          onClick={() => setActiveTask(null)}
          className="mb-4 text-gray-600 hover:text-gray-800"
          data-testid="button-back-to-tasks"
        >
          ← Back to Tasks
        </Button>
        
        {activeTask.kind === 'QUIZ' && (
          <QuizTaskCard
            task={activeTask}
            onComplete={handleTaskComplete}
            isCompleting={completeTaskMutation.isPending}
            colors={{
              ...colorClasses,
              border: 'border-primary-200'
            }}
          />
        )}
        
        {activeTask.kind === 'SHARE' && (
          <SocialShareTaskCard
            task={activeTask}
            onComplete={handleTaskComplete}
            isCompleting={completeTaskMutation.isPending}
            colors={{
              ...colorClasses,
              border: 'border-secondary-200'
            }}
          />
        )}
        
        {activeTask.kind === 'NOMINATION' && (
          <NominationTaskCard
            task={activeTask}
            onComplete={handleTaskComplete}
            isCompleting={completeTaskMutation.isPending}
            colors={{
              ...colorClasses,
              border: 'border-secondary-200'
            }}
          />
        )}
        
        {activeTask.kind === 'PETITION' && (
          <PetitionTaskCard
            task={activeTask}
            onComplete={handleTaskComplete}
            isCompleting={completeTaskMutation.isPending}
            colors={{
              ...colorClasses,
              border: 'border-orange-200'
            }}
          />
        )}
        
        {activeTask.kind === 'PHOTO_UPLOAD' && (
          <PhotoUploadTaskCard
            task={activeTask}
            onComplete={handleTaskComplete}
            isCompleting={completeTaskMutation.isPending}
            colors={{
              ...colorClasses,
              border: 'border-purple-200'
            }}
          />
        )}
        
        {activeTask.kind === 'SURVEY' && (
          <SurveyTaskCard
            task={activeTask}
            onComplete={handleTaskComplete}
            isCompleting={completeTaskMutation.isPending}
            colors={{
              ...colorClasses,
              border: 'border-green-200'
            }}
          />
        )}
      </div>
    );
  }

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-900">Today's Civic Tasks</CardTitle>
          <Badge className="bg-secondary-100 text-secondary-700" data-testid="text-available-tasks">
            {tasksToShow.filter((task: any) => !task.completed).length} Available
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasksToShow.map((task: any) => {
            const IconComponent = task.icon || HelpCircle;
            const colorClasses = getColorClasses(task.color || task.kind?.toLowerCase());
            
            return (
              <div 
                key={task.id} 
                className={`border rounded-lg p-4 transition-colors ${
                  task.completed 
                    ? 'border-green-200 bg-green-50 opacity-75' 
                    : 'border-gray-200 hover:border-primary-300'
                }`}
                data-testid={`task-card-${task.kind?.toLowerCase() || task.id}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${colorClasses.bg} rounded-lg flex items-center justify-center`}>
                      <IconComponent className={`w-5 h-5 ${colorClasses.text}`} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900" data-testid={`text-task-title-${task.id}`}>
                          {task.title}
                        </h3>
                        {task.completed && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600" data-testid={`text-task-description-${task.id}`}>
                        {task.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-secondary-600" data-testid={`text-task-reward-${task.id}`}>
                      +{task.rewardSUP} SUP
                    </div>
                    <div className="text-xs text-gray-500" data-testid={`text-task-estimate-${task.id}`}>
                      {task.estimate || '5 min'}
                    </div>
                  </div>
                </div>
                <Button 
                  className={`w-full font-medium py-2 rounded-lg transition-colors ${
                    task.completed 
                      ? 'bg-green-600 text-white cursor-not-allowed' 
                      : `${colorClasses.button} text-white`
                  }`}
                  onClick={() => !task.completed && handleStartTask(task)}
                  disabled={completeTaskMutation.isPending || task.completed}
                  data-testid={`button-start-task-${task.id}`}
                >
                  {completeTaskMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Completing...
                    </>
                  ) : task.completed ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Completed
                    </>
                  ) : (
                    <>
                      Start {task.kind === 'QUIZ' ? 'Quiz' : task.kind === 'NOMINATION' ? 'Nomination' : 'Sharing'}
                    </>
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
