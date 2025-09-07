import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { HelpCircle, Clock, Loader2, CheckCircle, AlertTriangle, Timer } from "lucide-react";

interface QuizTaskCardProps {
  task: any;
  onComplete: (task: any, quizData: any) => void;
  isCompleting: boolean;
  colors: any;
}

export function QuizTaskCard({ task, onComplete, isCompleting, colors }: QuizTaskCardProps) {
  const { toast } = useToast();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResults, setQuizResults] = useState<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Quiz questions - always show multiple questions for better engagement
  const getQuizQuestions = (taskId: string) => {
    return [
      {
        id: 'question1',
        question: 'How many states are there in Nigeria?',
        options: [
          { value: 'A', label: '35 states' },
          { value: 'B', label: '36 states' },
          { value: 'C', label: '37 states' },
          { value: 'D', label: '38 states' }
        ],
        correct: 'B'
      },
      {
        id: 'question2',
        question: 'What is the minimum voting age in Nigeria?',
        options: [
          { value: 'A', label: '18 years' },
          { value: 'B', label: '16 years' },
          { value: 'C', label: '21 years' },
          { value: 'D', label: '20 years' }
        ],
        correct: 'A'
      },
      {
        id: 'question3',
        question: 'Which body is responsible for conducting elections in Nigeria?',
        options: [
          { value: 'A', label: 'National Assembly' },
          { value: 'B', label: 'Federal High Court' },
          { value: 'C', label: 'Independent National Electoral Commission (INEC)' },
          { value: 'D', label: 'Nigeria Police Force' }
        ],
        correct: 'C'
      },
      {
        id: 'question4',
        question: 'What does civic engagement mean?',
        options: [
          { value: 'A', label: 'Participating in community activities' },
          { value: 'B', label: 'Voting in elections' },
          { value: 'C', label: 'Being informed about public issues' },
          { value: 'D', label: 'All of the above' }
        ],
        correct: 'D'
      }
    ];
  };

  const questions = getQuizQuestions(task.id);

  // Timer effect
  useEffect(() => {
    if (quizStarted && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [quizStarted, timeLeft]);

  // Page unload warning
  useEffect(() => {
    if (quizStarted && !submitting) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = 'Your quiz progress will be lost and you can only retake this quiz after 24 hours. Are you sure you want to leave?';
        return e.returnValue;
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [quizStarted, submitting]);

  const startQuiz = () => {
    setQuizStarted(true);
    toast({
      title: "Quiz Started!",
      description: "You have 5 minutes to complete this quiz. Good luck!",
    });
  };

  const handleTimeUp = () => {
    toast({
      title: "Time's Up!",
      description: "Quiz time has expired. Submitting your current answers...",
      variant: "destructive",
    });
    handleSubmitQuiz(true);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    console.log('Answer change:', questionId, value); // Debug log
    setAnswers(prev => {
      const newAnswers = {
        ...prev,
        [questionId]: value
      };
      console.log('New answers state:', newAnswers); // Debug log
      return newAnswers;
    });
  };

  const handleSubmitQuiz = (timeExpired = false) => {
    // Clear the timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Validate that all questions are answered (unless time expired)
    const unansweredQuestions = questions.filter(q => !answers[q.id]);
    if (!timeExpired && unansweredQuestions.length > 0) {
      toast({
        title: "Quiz incomplete",
        description: "Please answer all questions before submitting",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    
    // Convert answers to the format expected by the backend
    const formattedAnswers = questions.map(q => answers[q.id] || '');
    
    // Calculate score based on correct answers
    const correctAnswers = questions.filter(q => answers[q.id] === q.correct).length;
    const score = Math.round((correctAnswers / questions.length) * 100);
    
    // Prepare results for display
    const resultsData = {
      score,
      correctAnswers,
      totalQuestions: questions.length,
      timeUsed: 300 - timeLeft,
      timeExpired,
      passed: score === 100, // Only 100% passes
      questionsWithAnswers: questions.map(q => ({
        ...q,
        userAnswer: answers[q.id] || '',
        isCorrect: answers[q.id] === q.correct
      }))
    };
    
    setQuizResults(resultsData);
    setQuizCompleted(true);
    setSubmitting(false);
    
    // Only complete task if score is 100%
    if (score === 100) {
      const quizData = {
        answers: formattedAnswers,
        score,
        timeUsed: 300 - timeLeft,
        timeExpired,
        taskType: 'quiz',
        completedAt: new Date().toISOString(),
      };
      onComplete(task, quizData);
    } else {
      toast({
        title: "Quiz Failed",
        description: "You need 100% to earn SUP tokens. Review the correct answers and try again in 24 hours.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card key={task.id} className={`border-2 ${colors.border} transition-all duration-200 hover:shadow-lg`}>
      <CardContent className="p-4 sm:p-6">
        {/* Mobile-Optimized Header */}
        <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 mb-6">
          <div className={`w-12 h-12 sm:w-14 sm:h-14 ${colors.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
            <HelpCircle className={`w-6 h-6 sm:w-7 sm:h-7 ${colors.text}`} />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start gap-2">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                🧠 {task.title}
              </h3>
              <div className="text-right">
                <div className="text-lg sm:text-2xl font-bold text-primary-600">
                  +{parseFloat(task.rewardSUP).toLocaleString()}
                </div>
                <div className="text-xs sm:text-sm text-gray-500">SUP Reward</div>
              </div>
            </div>
            <p className="text-gray-600 mt-2 sm:mt-3 leading-relaxed">
              {task.description}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-3 sm:mt-4">
              <Clock className="w-4 h-4" />
              <span>⏱️ Time limit: 5 minutes</span>
            </div>
          </div>
        </div>

        {/* Timer display when quiz is started - Mobile Enhanced */}
        {quizStarted && (
          <div className="mb-6">
            <div className={`flex items-center justify-center p-4 sm:p-6 rounded-lg ${timeLeft <= 60 ? 'bg-red-50 border-2 border-red-200' : 'bg-blue-50 border-2 border-blue-200'} shadow-lg`}>
              <Timer className={`w-6 h-6 mr-3 ${timeLeft <= 60 ? 'text-red-600' : 'text-blue-600'}`} />
              <div className="text-center">
                <div className={`text-2xl sm:text-3xl font-bold ${timeLeft <= 60 ? 'text-red-700' : 'text-blue-700'}`}>
                  {formatTime(timeLeft)}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">
                  {timeLeft <= 60 ? '⚠️ Time running out!' : '⏰ Time remaining'}
                </div>
              </div>
            </div>
            {timeLeft <= 60 && (
              <Alert className="mt-2 border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">
                  Less than 1 minute remaining! The quiz will auto-submit when time expires.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Navigation warning alert */}
        {quizStarted && !submitting && (
          <Alert className="mb-6 border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-700">
              Don't navigate away from this page! Your progress will be lost and you can only retake this quiz after 24 hours.
            </AlertDescription>
          </Alert>
        )}

        {quizCompleted ? (
          /* Quiz results screen */
          <div className="text-center space-y-6">
            <div className={`p-6 rounded-lg ${quizResults.passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${quizResults.passed ? 'bg-green-100' : 'bg-red-100'}`}>
                {quizResults.passed ? (
                  <CheckCircle className="w-8 h-8 text-green-600" />
                ) : (
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                )}
              </div>
              
              <h3 className={`text-2xl font-bold mb-2 ${quizResults.passed ? 'text-green-800' : 'text-red-800'}`}>
                {quizResults.passed ? 'Congratulations!' : 'Quiz Failed'}
              </h3>
              
              <p className={`text-lg mb-4 ${quizResults.passed ? 'text-green-700' : 'text-red-700'}`}>
                Your Score: {quizResults.score}% ({quizResults.correctAnswers}/{quizResults.totalQuestions})
              </p>
              
              {quizResults.passed ? (
                <p className="text-green-600">
                  Perfect score! You've earned {task.rewardSUP} SUP tokens.
                </p>
              ) : (
                <p className="text-red-600">
                  You need 100% to earn SUP tokens. Try again in 24 hours.
                </p>
              )}
              
              <div className="mt-4 text-sm text-gray-600">
                Time used: {Math.floor(quizResults.timeUsed / 60)}:{(quizResults.timeUsed % 60).toString().padStart(2, '0')}
                {quizResults.timeExpired && <span className="text-red-600 ml-2">(Time expired)</span>}
              </div>
            </div>

            {/* Answer review */}
            <div className="text-left space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Answer Review:</h4>
              {quizResults.questionsWithAnswers.map((question: any, index: number) => (
                <div key={question.id} className={`p-4 rounded-lg border ${question.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium text-gray-900">
                      {index + 1}. {question.question}
                    </p>
                    <div className={`flex items-center ml-2 ${question.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                      {question.isCorrect ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <AlertTriangle className="w-5 h-5" />
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <p className={question.isCorrect ? 'text-green-700' : 'text-red-700'}>
                      <strong>Your answer:</strong> {question.options.find((opt: any) => opt.value === question.userAnswer)?.label || 'Not answered'}
                    </p>
                    {!question.isCorrect && (
                      <p className="text-green-700">
                        <strong>Correct answer:</strong> {question.options.find((opt: any) => opt.value === question.correct)?.label}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <p className="text-sm text-gray-600 mb-4">
                {quizResults.passed 
                  ? "Great job! Keep up your civic engagement!" 
                  : "Study the correct answers above and try again tomorrow."}
              </p>
            </div>
          </div>
        ) : !quizStarted ? (
          /* Quiz intro screen */
          <div className="text-center space-y-4">
            <div className="bg-gray-50 rounded-lg p-6">
              <Timer className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Ready to Start?</h4>
              <p className="text-gray-600 mb-4">
                This quiz contains {questions.length} questions about Nigerian civics and governance.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>⏰ Time limit: 5 minutes</p>
                <p>📝 {questions.length} multiple choice questions</p>
                <p>⚠️ Cannot pause once started</p>
                <p>🔒 Can only be retaken after 24 hours</p>
              </div>
            </div>
            <Button
              onClick={startQuiz}
              className={`${colors.button} text-white font-bold py-3 sm:py-4 px-6 sm:px-8 text-base sm:text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto`}
              data-testid="button-start-quiz"
            >
              <Timer className="w-5 h-5 mr-2" />
              🚀 Start Quiz
            </Button>
          </div>
        ) : (
          /* Quiz questions */
          <>
            <div className="space-y-6 sm:space-y-8">
              {questions.map((question, index) => (
                <div key={question.id} className="bg-gray-50 rounded-lg p-4 sm:p-6">
                  <Label className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 block leading-relaxed">
                    <span className="text-primary-600 mr-2">Q{index + 1}.</span>
                    {question.question}
                  </Label>
                  <div className="space-y-3">
                    {question.options.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`w-full p-5 text-left border-3 rounded-xl font-bold text-lg min-h-[70px] ${
                          answers[question.id] === option.value
                            ? 'border-green-500 bg-green-200 text-green-900' 
                            : 'border-blue-300 bg-blue-50 text-gray-800 active:bg-blue-200'
                        }`}
                        style={{
                          WebkitTapHighlightColor: 'rgba(59, 130, 246, 0.3)',
                          touchAction: 'manipulation'
                        }}
                        onTouchStart={() => {
                          alert(`Touched: ${option.label}`);
                          setAnswers(prev => ({
                            ...prev,
                            [question.id]: option.value
                          }));
                        }}
                        onClick={() => {
                          alert(`Clicked: ${option.label}`);
                          setAnswers(prev => ({
                            ...prev,
                            [question.id]: option.value
                          }));
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-blue-600">{option.value}.</span>
                          <span className="flex-1">{option.label}</span>
                          {answers[question.id] === option.value && (
                            <span className="text-green-600 text-xl font-bold">✓</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex gap-3">
              <Button
                onClick={() => handleSubmitQuiz()}
                disabled={isCompleting || submitting || timeLeft === 0}
                className={`flex-1 ${colors.button} text-white font-bold py-4 text-base sm:text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300`}
                data-testid="button-submit-quiz"
              >
                {isCompleting || submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    🔄 Submitting Quiz...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    ✅ Submit Quiz
                  </>
                )}
              </Button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Answer all questions to earn your SUP tokens
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}