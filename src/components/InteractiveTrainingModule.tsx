import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { leadershipTrainingModules, type TrainingModule as LeadershipTrainingModule } from '@shared/content/leadership-training-modules';
import { 
  Play, 
  Pause, 
  CheckCircle, 
  Circle, 
  Clock, 
  BookOpen, 
  Award, 
  Download,
  FileText,
  Video,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Target,
  Timer
} from 'lucide-react';

// Video Player Component
interface VideoPlayerProps {
  video: { title: string; url: string; duration: number };
  videoId: string;
  onTimeUpdate: (time: number) => void;
  onComplete: () => void;
  isCompleted: boolean;
}

function VideoPlayer({ video, videoId, onTimeUpdate, onComplete, isCompleted }: VideoPlayerProps) {
  const [isWatching, setIsWatching] = useState(false);
  const [timeWatched, setTimeWatched] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  
  const minTime = Math.max(30, video.duration * 0.8 * 60);
  const progress = Math.min(100, (timeWatched / minTime) * 100);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isWatching) {
      interval = setInterval(() => {
        setTimeWatched(prev => {
          const newTime = prev + 1;
          onTimeUpdate(newTime);
          
          // Auto-complete when minimum time is reached
          if (newTime >= minTime && !isCompleted) {
            setTimeout(() => {
              onComplete();
              setIsWatching(false);
            }, 0);
          }
          
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWatching, minTime, onComplete, onTimeUpdate, isCompleted]);

  const toggleWatching = () => {
    setShowVideo(true);
    setIsWatching(!isWatching);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Button 
          size="sm"
          variant={isWatching ? "destructive" : "default"}
          onClick={toggleWatching}
          disabled={isCompleted}
        >
          {isWatching ? <Pause className="h-3 w-3 mr-1" /> : <Play className="h-3 w-3 mr-1" />}
          {isCompleted ? 'Completed' : isWatching ? 'Pause' : 'Watch Video'}
        </Button>
        <div className="text-xs text-muted-foreground">
          Progress: {Math.round(progress)}% ({timeWatched}s/{Math.round(minTime)}s required)
        </div>
      </div>
      
      {progress > 0 && (
        <Progress value={progress} className="h-2 w-full" />
      )}
      
      {/* Always show video player when activated */}
      {showVideo && (
        <div className={`p-4 rounded-lg ${isWatching ? 'bg-slate-100 dark:bg-slate-800 border-blue-200 border' : 'bg-slate-50 dark:bg-slate-900'}`}>
          <div className="aspect-video bg-slate-200 dark:bg-slate-700 rounded flex items-center justify-center">
            <div className="text-center">
              <Video className="h-12 w-12 mx-auto mb-2 text-slate-500" />
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {video.title}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {isWatching ? (
                  <span className="flex items-center justify-center gap-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    Currently watching...
                  </span>
                ) : 'Click Watch Video to start'}
              </p>
              {isCompleted && (
                <p className="text-xs text-green-600 mt-2 flex items-center justify-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Video completed!
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Reading Tracker Component
interface ReadingTrackerProps {
  reading: { title: string; content: string };
  readingId: string;
  onTimeUpdate: (time: number) => void;
  onComplete: () => void;
  isCompleted: boolean;
  currentTime: number;
}

function ReadingTracker({ reading, readingId, onTimeUpdate, onComplete, isCompleted, currentTime }: ReadingTrackerProps) {
  const [isReading, setIsReading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  
  const wordCount = reading.content.split(' ').length;
  const minTime = Math.max(60, wordCount / 200 * 60);
  const progress = Math.min(100, (currentTime / minTime) * 100);

  // Split content into pages (roughly 300 words per page for better reading experience)
  const wordsPerPage = 300;
  const contentWords = reading.content.split(' ');
  const totalPages = Math.ceil(contentWords.length / wordsPerPage);
  
  const getPageContent = (pageIndex: number) => {
    const startIndex = pageIndex * wordsPerPage;
    const endIndex = Math.min(startIndex + wordsPerPage, contentWords.length);
    return contentWords.slice(startIndex, endIndex).join(' ');
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isReading) {
      interval = setInterval(() => {
        const newTime = currentTime + 1;
        onTimeUpdate(newTime);
        
        // Auto-complete when minimum time is reached
        if (newTime >= minTime && !isCompleted) {
          onComplete();
          setIsReading(false);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isReading, currentTime, minTime, onComplete, onTimeUpdate, isCompleted]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant={isReading ? "destructive" : "outline"}
            onClick={() => setIsReading(!isReading)}
            disabled={isCompleted}
          >
            {isReading ? <Pause className="h-3 w-3 mr-1" /> : <Timer className="h-3 w-3 mr-1" />}
            {isCompleted ? 'Completed' : isReading ? 'Pause Timer' : 'Start Timer'}
          </Button>
          <div className="text-xs text-muted-foreground">
            Progress: {Math.round(progress)}% ({currentTime}s/{Math.round(minTime)}s required)
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Page {currentPage + 1} of {totalPages}
        </div>
      </div>
      
      {progress > 0 && (
        <Progress value={progress} className="h-2 w-full" />
      )}
      
      {/* Paginated reading content */}
      <div className={`p-6 border rounded-lg min-h-[400px] ${isReading ? 'border-blue-200 bg-blue-50 dark:bg-blue-950/20' : 'border-gray-200'}`}>
        <div className="prose prose-sm max-w-none">
          {getPageContent(currentPage).split('\n').map((paragraph, i) => (
            <p key={i} className="mb-4 text-sm leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
        
        {/* Page navigation */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t">
          {totalPages > 1 ? (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
              >
                <ArrowLeft className="h-3 w-3 mr-1" />
                Previous
              </Button>
              
              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-2 h-2 rounded-full ${
                      i === currentPage ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage === totalPages - 1}
              >
                Next
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </>
          ) : (
            <>
              <div></div>
              <div className="text-center">
                {!isCompleted && progress < 100 && (
                  <Button 
                    onClick={() => {
                      onComplete();
                      setIsReading(false);
                    }}
                    variant="default"
                    size="sm"
                    disabled={currentTime < 30} // Minimum 30 seconds reading time
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Mark as Read
                  </Button>
                )}
              </div>
              <div></div>
            </>
          )}
        </div>
        
        {isReading && (
          <div className="mt-4 text-xs text-blue-600 dark:text-blue-400 flex items-center gap-2">
            <Timer className="h-3 w-3 animate-pulse" />
            Reading timer active - you need {Math.round(minTime)}s total reading time to complete
          </div>
        )}
        {isCompleted && (
          <div className="mt-4 text-xs text-green-600 dark:text-green-400 flex items-center gap-2">
            <CheckCircle className="h-3 w-3" />
            Reading completed successfully!
          </div>
        )}
      </div>
    </div>
  );
}

interface Question {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
}

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  objectives: string[];
  content: {
    videos?: { title: string; url: string; duration: number }[];
    readings?: { title: string; content: string }[];
    activities?: { title: string; description: string; type: string }[];
  };
  quiz: Question[];
  passingScore: number;
  certificateEligible: boolean;
}

interface UserProgress {
  moduleId: string;
  completedSections: string[];
  quizAttempts: number;
  bestScore: number;
  timeSpent: number;
  completed: boolean;
  certificateEarned: boolean;
}

interface InteractiveTrainingModuleProps {
  module: TrainingModule;
  userProgress?: UserProgress;
  onProgressUpdate: (progress: Partial<UserProgress>) => void;
  onComplete: (finalScore: number) => void;
}

export function InteractiveTrainingModule({ 
  module, 
  userProgress, 
  onProgressUpdate, 
  onComplete 
}: InteractiveTrainingModuleProps) {
  const [currentSection, setCurrentSection] = useState('overview');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizTimeLeft, setQuizTimeLeft] = useState(0);
  const [questionTimeSpent, setQuestionTimeSpent] = useState<Record<number, number>>({});
  const [questionStartTime, setQuestionStartTime] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeSpent, setTimeSpent] = useState(userProgress?.timeSpent || 0);
  const [completedSections, setCompletedSections] = useState<string[]>(
    userProgress?.completedSections || []
  );
  // Engagement tracking
  const [sectionTimeSpent, setSectionTimeSpent] = useState<Record<string, number>>({});
  const [currentVideoTime, setCurrentVideoTime] = useState<Record<string, number>>({});
  const [readingProgress, setReadingProgress] = useState<Record<string, number>>({});
  const [activeSectionStartTime, setActiveSectionStartTime] = useState<number | null>(null);

  // Timer for tracking time spent
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimeSpent(prev => {
          const newTime = prev + 1;
          onProgressUpdate({ timeSpent: newTime });
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, onProgressUpdate]);

  // Track time spent in sections
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && activeSectionStartTime) {
      interval = setInterval(() => {
        const elapsed = Date.now() - activeSectionStartTime;
        setSectionTimeSpent(prev => ({
          ...prev,
          [currentSection]: (prev[currentSection] || 0) + 1
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, activeSectionStartTime, currentSection]);

  // Start tracking when section changes
  useEffect(() => {
    if (isPlaying) {
      setActiveSectionStartTime(Date.now());
    }
  }, [currentSection, isPlaying]);

  const markSectionComplete = (sectionId: string, force = false) => {
    if (completedSections.includes(sectionId)) return;

    // Engagement validation
    if (!force && !validateSectionEngagement(sectionId)) {
      return;
    }

    const newCompleted = [...completedSections, sectionId];
    setCompletedSections(newCompleted);
    onProgressUpdate({ completedSections: newCompleted });
  };

  const validateSectionEngagement = (sectionId: string): boolean => {
    // For videos, require minimum viewing time
    if (sectionId.startsWith('video-')) {
      const videoIndex = parseInt(sectionId.split('-')[1]);
      const video = module.content.videos?.[videoIndex];
      if (video) {
        const minTime = Math.max(30, video.duration * 0.8 * 60); // 80% of video duration or 30 seconds minimum
        const timeSpent = currentVideoTime[sectionId] || 0;
        if (timeSpent < minTime) {
          alert(`Please watch at least ${Math.round(minTime)} seconds of this video before marking it complete.`);
          return false;
        }
      }
    }

    // For readings, require minimum reading time
    if (sectionId.startsWith('reading-')) {
      const readingIndex = parseInt(sectionId.split('-')[1]);
      const reading = module.content.readings?.[readingIndex];
      if (reading) {
        const wordCount = reading.content.split(' ').length;
        const minTime = Math.max(60, wordCount / 200 * 60); // Assume 200 words per minute, minimum 1 minute
        const timeSpent = sectionTimeSpent[sectionId] || 0;
        if (timeSpent < minTime) {
          alert(`Please spend at least ${Math.round(minTime)} seconds reading this material before marking it complete.`);
          return false;
        }
      }
    }

    return true;
  };

  const handleQuizSubmit = () => {
    let correct = 0;
    const totalPoints = module.quiz.reduce((sum, q) => sum + q.points, 0);
    let earnedPoints = 0;

    module.quiz.forEach(question => {
      const userAnswer = quizAnswers[question.id];
      if (userAnswer === question.correctAnswer) {
        correct++;
        earnedPoints += question.points;
      }
    });

    const score = Math.round((earnedPoints / totalPoints) * 100);
    
    console.log('Quiz submitted with score:', score);
    console.log('Setting quiz results to show');
    
    setQuizScore(score);
    setShowQuizResults(true);
    // Keep quizStarted as true so we don't go back to intro screen
    
    // Ensure we're on the quiz tab to see results
    setCurrentSection('quiz');

    const passed = score >= module.passingScore;
    const newAttempts = (userProgress?.quizAttempts || 0) + 1;
    const bestScore = Math.max(userProgress?.bestScore || 0, score);

    onProgressUpdate({
      quizAttempts: newAttempts,
      bestScore,
      completed: passed,
      certificateEarned: passed && module.certificateEligible
    });

    if (passed) {
      onComplete(score);
    }
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    setShowQuizResults(false);
    setQuizScore(0);
    setCurrentQuestionIndex(0);
    setQuizStarted(false);
    setQuizTimeLeft(0);
    setQuestionTimeSpent({});
    setQuestionStartTime(null);
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    const totalTimeMinutes = Math.max(15, module.quiz.length * 2); // 2 minutes per question, minimum 15 minutes
    setQuizTimeLeft(totalTimeMinutes * 60);
    setQuestionStartTime(Date.now());
  };

  // Quiz timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (quizStarted && quizTimeLeft > 0 && !showQuizResults) {
      interval = setInterval(() => {
        setQuizTimeLeft(prev => {
          if (prev <= 1) {
            handleQuizSubmit(); // Auto-submit when time runs out
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [quizStarted, quizTimeLeft, showQuizResults]);

  // Track time spent on each question
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (quizStarted && questionStartTime && !showQuizResults) {
      interval = setInterval(() => {
        setQuestionTimeSpent(prev => ({
          ...prev,
          [currentQuestionIndex]: (prev[currentQuestionIndex] || 0) + 1
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [quizStarted, questionStartTime, currentQuestionIndex, showQuizResults]);

  const nextQuestion = () => {
    const currentQuestion = module.quiz[currentQuestionIndex];
    const timeSpent = questionTimeSpent[currentQuestionIndex] || 0;
    const minTimePerQuestion = 5; // Reduced to 5 seconds for better UX
    
    // Check if answer is selected first (more important)
    if (!quizAnswers[currentQuestion.id]) {
      alert('Please select an answer before proceeding to the next question.');
      return;
    }

    // Reduced time requirement for better UX - warn but allow to proceed
    if (timeSpent < minTimePerQuestion) {
      const proceed = confirm(`You've only spent ${timeSpent} seconds on this question. We recommend at least ${minTimePerQuestion} seconds to carefully consider each question. Do you want to proceed anyway?`);
      if (!proceed) {
        return;
      }
    }

    if (currentQuestionIndex < module.quiz.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setQuestionStartTime(Date.now());
      // Scroll to top of quiz section for better UX
      const quizSection = document.querySelector('[data-testid="quiz-section"]');
      if (quizSection) {
        quizSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setQuestionStartTime(Date.now());
    }
  };

  const canSubmitQuiz = () => {
    const allAnswered = Object.keys(quizAnswers).length === module.quiz.length;
    const totalTimeSpent = Object.values(questionTimeSpent).reduce((sum, time) => sum + time, 0);
    const minTotalTime = module.quiz.length * 10; // Minimum 10 seconds per question
    
    return allAnswered && totalTimeSpent >= minTotalTime;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    const videosLength = module.content.videos?.length || 0;
    const readingsLength = module.content.readings?.length || 0;
    const totalSections = 3 + videosLength + readingsLength + 1; // overview, videos, readings, activities, quiz
    return Math.round((completedSections.length / totalSections) * 100);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-50 dark:bg-green-950/20';
      case 'intermediate': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20';
      case 'advanced': return 'text-red-600 bg-red-50 dark:bg-red-950/20';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-950/20';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6" data-testid="interactive-training-module">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2" data-testid="module-title">
                {module.title}
              </CardTitle>
              <p className="text-muted-foreground mb-4">{module.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className={getDifficultyColor(module.difficulty)} data-testid="difficulty-badge">
                  {module.difficulty}
                </Badge>
                <Badge variant="outline" data-testid="category-badge">
                  {module.category}
                </Badge>
                <Badge variant="secondary" data-testid="duration-badge">
                  <Clock className="h-3 w-3 mr-1" />
                  {module.duration} min
                </Badge>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">Progress</div>
              <div className="text-2xl font-bold" data-testid="progress-percentage">
                {getProgressPercentage()}%
              </div>
              <Progress value={getProgressPercentage()} className="w-20" />
            </div>
          </div>
          
          {/* Time tracking */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span data-testid="time-spent">Time spent: {formatTime(timeSpent)}</span>
              <span data-testid="quiz-attempts">
                Quiz attempts: {userProgress?.quizAttempts || 0}
              </span>
              {userProgress?.bestScore && (
                <span data-testid="best-score">Best score: {userProgress.bestScore}%</span>
              )}
            </div>
            
            <Button
              variant={isPlaying ? "destructive" : "default"}
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              data-testid="play-pause-button"
            >
              {isPlaying ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
              {isPlaying ? 'Pause' : 'Start'} Learning
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <Tabs value={currentSection} onValueChange={setCurrentSection} className="w-full">
        <TabsList className="grid w-full grid-cols-5" data-testid="section-tabs">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="quiz">Quiz</TabsTrigger>
          <TabsTrigger value="certificate">Certificate</TabsTrigger>
        </TabsList>

        {/* Overview Section */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Learning Objectives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {module.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
              
              <Separator className="my-6" />
              
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">What you'll learn:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Core concepts and principles</li>
                    <li>• Practical applications</li>
                    <li>• Real-world examples</li>
                    <li>• Best practices</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Requirements:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Basic understanding of civic engagement</li>
                    <li>• Access to internet</li>
                    <li>• Commitment to complete activities</li>
                    <li>• {module.duration} minutes of focused time</li>
                  </ul>
                </div>
              </div>

              <Button 
                onClick={() => {
                  markSectionComplete('overview');
                  setCurrentSection('content');
                }}
                className="mt-6"
                data-testid="start-learning-button"
              >
                Start Learning
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Section */}
        <TabsContent value="content" className="space-y-4">
          <div className="grid gap-4">
            {/* Videos */}
            {module.content.videos && module.content.videos.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Video Lessons
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {module.content.videos.map((video, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-3 border rounded-lg"
                      data-testid={`video-${index}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 dark:bg-red-950/20 rounded-lg flex items-center justify-center">
                          <Video className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{video.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {video.duration} minutes
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {completedSections.includes(`video-${index}`) ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                        <div className="text-right">
                          {(() => {
                            const videoId = `video-${index}`;
                            const timeWatched = currentVideoTime[videoId] || 0;
                            const minTime = Math.max(30, video.duration * 0.8 * 60);
                            const progress = Math.min(100, (timeWatched / minTime) * 100);
                            
                            return (
                              <div className="text-xs text-muted-foreground mb-1">
                                {timeWatched}s / {Math.round(minTime)}s required
                              </div>
                            );
                          })()}
                          <VideoPlayer
                            video={video}
                            videoId={`video-${index}`}
                            onTimeUpdate={(time) => {
                              setCurrentVideoTime(prev => ({
                                ...prev,
                                [`video-${index}`]: time
                              }));
                            }}
                            onComplete={() => markSectionComplete(`video-${index}`)}
                            isCompleted={completedSections.includes(`video-${index}`)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Readings */}
            {module.content.readings && module.content.readings.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Reading Materials
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {module.content.readings.map((reading, index) => (
                    <div 
                      key={index} 
                      className="space-y-4"
                      data-testid={`reading-${index}`}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-lg">{reading.title}</h4>
                        <div className="flex items-center gap-2">
                          {completedSections.includes(`reading-${index}`) ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                      
                      <ReadingTracker
                        reading={reading}
                        readingId={`reading-${index}`}
                        onTimeUpdate={(time) => {
                          setSectionTimeSpent(prev => ({
                            ...prev,
                            [`reading-${index}`]: time
                          }));
                        }}
                        onComplete={() => markSectionComplete(`reading-${index}`)}
                        isCompleted={completedSections.includes(`reading-${index}`)}
                        currentTime={sectionTimeSpent[`reading-${index}`] || 0}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setCurrentSection('overview')}
              data-testid="back-to-overview"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Overview
            </Button>
            <Button 
              onClick={() => {
                markSectionComplete('content');
                setCurrentSection('activities');
              }}
              data-testid="continue-to-activities"
            >
              Continue to Activities
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </TabsContent>

        {/* Activities Section */}
        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Interactive Activities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {module.content.activities && module.content.activities.length > 0 ? (
                module.content.activities.map((activity, index) => (
                  <div 
                    key={index} 
                    className="border rounded-lg p-4"
                    data-testid={`activity-${index}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{activity.title}</h4>
                      <Badge variant="outline">{activity.type}</Badge>
                    </div>
                    <p className="text-muted-foreground mb-4">{activity.description}</p>
                    
                    {activity.type === 'reflection' && (
                      <div className="space-y-2">
                        <Label htmlFor={`reflection-${index}`}>Your reflection:</Label>
                        <Textarea 
                          id={`reflection-${index}`}
                          placeholder="Write your thoughts here..."
                          className="min-h-24"
                          data-testid={`reflection-input-${index}`}
                        />
                      </div>
                    )}
                    
                    <div className="flex justify-end mt-4">
                      <Button 
                        onClick={() => markSectionComplete(`activity-${index}`)}
                        data-testid={`complete-activity-${index}`}
                      >
                        Complete Activity
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No activities available for this module</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setCurrentSection('content')}
              data-testid="back-to-content"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Content
            </Button>
            <Button 
              onClick={() => {
                markSectionComplete('activities');
                setCurrentSection('quiz');
              }}
              data-testid="continue-to-quiz"
            >
              Take Quiz
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </TabsContent>

        {/* Quiz Section */}
        <TabsContent value="quiz" className="space-y-4" data-testid="quiz-section">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Knowledge Assessment
                <Badge variant="secondary" className="ml-auto">
                  Passing Score: {module.passingScore}%
                </Badge>
              </CardTitle>
              {quizStarted && !showQuizResults && (
                <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">
                      Question {currentQuestionIndex + 1} of {module.quiz.length}
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      Time on question: {questionTimeSpent[currentQuestionIndex] || 0}s
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4" />
                    <div className={`font-mono font-bold ${quizTimeLeft < 300 ? 'text-red-600' : 'text-blue-600'}`}>
                      {formatTime(quizTimeLeft)}
                    </div>
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {!quizStarted ? (
                <div className="text-center space-y-6 py-8">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Ready to Take the Quiz?</h3>
                    <p className="text-muted-foreground">
                      This quiz contains {module.quiz.length} questions and has a time limit of {Math.max(15, module.quiz.length * 2)} minutes.
                    </p>
                  </div>
                  
                  <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 rounded-lg p-4 space-y-2">
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Important Quiz Rules:</h4>
                    <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1 text-left max-w-md mx-auto">
                      <li>• You must achieve {module.passingScore}% to pass</li>
                      <li>• Minimum 10 seconds required per question</li>
                      <li>• Questions are presented one at a time</li>
                      <li>• Timer will auto-submit when time expires</li>
                      <li>• You can review and change answers before submitting</li>
                    </ul>
                  </div>

                  <Button 
                    onClick={startQuiz}
                    size="lg"
                    data-testid="start-quiz"
                  >
                    <Timer className="h-4 w-4 mr-2" />
                    Start Quiz
                  </Button>
                </div>
              ) : !showQuizResults ? (
                <div className="space-y-6">
                  {/* Current Question */}
                  {(() => {
                    const currentQuestion = module.quiz[currentQuestionIndex];
                    return (
                      <div className="space-y-4 p-6 border rounded-lg bg-white dark:bg-gray-950/50">
                        <div className="flex items-start gap-2">
                          <Badge variant="default" className="mt-1">
                            {currentQuestionIndex + 1}
                          </Badge>
                          <h4 className="font-medium flex-1 text-lg">{currentQuestion.question}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {currentQuestion.points} pts
                          </Badge>
                        </div>

                        {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
                          <RadioGroup
                            value={quizAnswers[currentQuestion.id] || ''}
                            onValueChange={(value) => 
                              setQuizAnswers(prev => ({ ...prev, [currentQuestion.id]: value }))
                            }
                            data-testid={`question-options-${currentQuestionIndex}`}
                          >
                            {currentQuestion.options.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                                <RadioGroupItem 
                                  value={option} 
                                  id={`${currentQuestion.id}-${optionIndex}`} 
                                />
                                <Label htmlFor={`${currentQuestion.id}-${optionIndex}`} className="flex-1 cursor-pointer">
                                  {option}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        )}

                        {currentQuestion.type === 'true_false' && (
                          <RadioGroup
                            value={quizAnswers[currentQuestion.id] || ''}
                            onValueChange={(value) => 
                              setQuizAnswers(prev => ({ ...prev, [currentQuestion.id]: value }))
                            }
                            data-testid={`true-false-${currentQuestionIndex}`}
                          >
                            <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                              <RadioGroupItem value="True" id={`${currentQuestion.id}-true`} />
                              <Label htmlFor={`${currentQuestion.id}-true`} className="flex-1 cursor-pointer">True</Label>
                            </div>
                            <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                              <RadioGroupItem value="False" id={`${currentQuestion.id}-false`} />
                              <Label htmlFor={`${currentQuestion.id}-false`} className="flex-1 cursor-pointer">False</Label>
                            </div>
                          </RadioGroup>
                        )}

                        {currentQuestion.type === 'short_answer' && (
                          <Textarea
                            placeholder="Enter your answer..."
                            value={quizAnswers[currentQuestion.id] || ''}
                            onChange={(e) => 
                              setQuizAnswers(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))
                            }
                            data-testid={`short-answer-${currentQuestionIndex}`}
                            className="min-h-24"
                          />
                        )}
                      </div>
                    );
                  })()}

                  {/* Navigation and Progress */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div>
                        Answered: {Object.keys(quizAnswers).length} / {module.quiz.length}
                      </div>
                      <div>
                        Time spent: {Object.values(questionTimeSpent).reduce((sum, time) => sum + time, 0)}s
                      </div>
                    </div>
                    
                    <Progress 
                      value={(Object.keys(quizAnswers).length / module.quiz.length) * 100} 
                      className="h-2"
                    />

                    <div className="flex justify-between pt-4">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline"
                          onClick={() => setCurrentSection('activities')}
                          disabled={quizStarted}
                          data-testid="back-to-activities"
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Back to Activities
                        </Button>
                        
                        <Button 
                          variant="outline"
                          onClick={previousQuestion}
                          disabled={currentQuestionIndex === 0}
                          data-testid="previous-question"
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Previous
                        </Button>
                      </div>

                      <div className="flex gap-2">
                        {currentQuestionIndex < module.quiz.length - 1 ? (
                          <Button 
                            onClick={nextQuestion}
                            data-testid="next-question"
                          >
                            Next
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        ) : (
                          <Button 
                            onClick={handleQuizSubmit}
                            disabled={!canSubmitQuiz()}
                            data-testid="submit-quiz"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Submit Quiz
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Quiz Results */}
                  <div className="text-center space-y-4">
                    <div className={`text-6xl font-bold ${
                      quizScore >= module.passingScore ? 'text-green-600' : 'text-red-600'
                    }`} data-testid="quiz-score">
                      {quizScore}%
                    </div>
                    <div>
                      {quizScore >= module.passingScore ? (
                        <Badge className="bg-green-600 text-white">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Passed
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          Failed - {module.passingScore}% required
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Answer Review */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Answer Review:</h3>
                    {module.quiz.map((question, index) => {
                      const userAnswer = quizAnswers[question.id];
                      const isCorrect = userAnswer === question.correctAnswer;
                      
                      return (
                        <div 
                          key={question.id} 
                          className={`p-4 border rounded-lg ${
                            isCorrect ? 'border-green-200 bg-green-50 dark:bg-green-950/20' 
                                     : 'border-red-200 bg-red-50 dark:bg-red-950/20'
                          }`}
                          data-testid={`question-review-${index}`}
                        >
                          <div className="flex items-start gap-2 mb-2">
                            <Badge 
                              variant={isCorrect ? "default" : "destructive"}
                              className="mt-1"
                            >
                              {index + 1}
                            </Badge>
                            <h4 className="font-medium flex-1">{question.question}</h4>
                            {isCorrect ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <Circle className="h-5 w-5 text-red-600" />
                            )}
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="font-medium">Your answer: </span>
                              <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                                {userAnswer}
                              </span>
                            </div>
                            {!isCorrect && (
                              <div>
                                <span className="font-medium">Correct answer: </span>
                                <span className="text-green-600">{question.correctAnswer}</span>
                              </div>
                            )}
                            <div className="text-muted-foreground italic">
                              {question.explanation}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-center gap-4">
                    {quizScore < module.passingScore && (
                      <Button onClick={resetQuiz} data-testid="retake-quiz">
                        Retake Quiz
                      </Button>
                    )}
                    {quizScore >= module.passingScore && module.certificateEligible && (
                      <Button 
                        onClick={() => setCurrentSection('certificate')}
                        data-testid="view-certificate"
                      >
                        <Award className="h-4 w-4 mr-2" />
                        View Certificate
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certificate Section */}
        <TabsContent value="certificate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Certificate of Completion
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userProgress?.certificateEarned ? (
                <div className="space-y-6">
                  <div className="text-center py-8 border-2 border-dashed border-yellow-300 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                    <Award className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Congratulations! 🎉</h2>
                    <p className="text-muted-foreground mb-4">
                      You have successfully completed the training module:
                    </p>
                    <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Final Score: {userProgress.bestScore}% | 
                      Completed on: {new Date().toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <Button data-testid="download-certificate">
                      <Download className="h-4 w-4 mr-2" />
                      Download Certificate
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Complete the training module and pass the quiz to earn your certificate</p>
                  <p className="text-sm mt-2">Minimum score required: {module.passingScore}%</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}