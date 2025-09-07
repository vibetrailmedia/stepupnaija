// Quiz Center - Real Nigerian Civic Education Quizzes
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Clock, BookOpen, Trophy, Star, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  nigerianCivicQuizBank, 
  quizCategories, 
  getQuizByCategory, 
  getQuizByDifficulty,
  generateRandomQuiz,
  type QuizQuestion 
} from '@shared/content/civic-quiz-bank';

interface QuizSession {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  answers: Record<string, string>;
  startTime: Date;
  timeElapsed: number;
  isCompleted: boolean;
  score?: number;
}

export default function QuizCenter() {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [quizSession, setQuizSession] = useState<QuizSession | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Timer effect
  useEffect(() => {
    if (quizSession && !quizSession.isCompleted) {
      const interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [quizSession]);

  const startQuiz = (category?: string, difficulty?: string, count: number = 10) => {
    let questions: QuizQuestion[];
    
    if (category && category !== 'Random') {
      questions = getQuizByCategory(category);
    } else if (difficulty) {
      questions = getQuizByDifficulty(difficulty as any);
    } else {
      questions = generateRandomQuiz(count);
    }

    // Shuffle and limit to requested count
    const shuffledQuestions = [...questions].sort(() => Math.random() - 0.5).slice(0, count);

    setQuizSession({
      questions: shuffledQuestions,
      currentQuestionIndex: 0,
      answers: {},
      startTime: new Date(),
      timeElapsed: 0,
      isCompleted: false
    });
    setTimeElapsed(0);
  };

  const selectAnswer = (questionId: string, answer: string) => {
    if (!quizSession) return;
    
    setQuizSession(prev => ({
      ...prev!,
      answers: {
        ...prev!.answers,
        [questionId]: answer
      }
    }));
  };

  const nextQuestion = () => {
    if (!quizSession) return;
    
    if (quizSession.currentQuestionIndex < quizSession.questions.length - 1) {
      setQuizSession(prev => ({
        ...prev!,
        currentQuestionIndex: prev!.currentQuestionIndex + 1
      }));
    } else {
      completeQuiz();
    }
  };

  const previousQuestion = () => {
    if (!quizSession || quizSession.currentQuestionIndex === 0) return;
    
    setQuizSession(prev => ({
      ...prev!,
      currentQuestionIndex: prev!.currentQuestionIndex - 1
    }));
  };

  const completeQuiz = () => {
    if (!quizSession) return;

    // Calculate score
    let correctAnswers = 0;
    let totalPoints = 0;
    let earnedPoints = 0;

    quizSession.questions.forEach(question => {
      totalPoints += question.points;
      const userAnswer = quizSession.answers[question.id];
      if (userAnswer === question.correctAnswer) {
        correctAnswers++;
        earnedPoints += question.points;
      }
    });

    const score = Math.round((earnedPoints / totalPoints) * 100);

    setQuizSession(prev => ({
      ...prev!,
      isCompleted: true,
      score
    }));

    toast({
      title: score >= 70 ? "🎉 Quiz Completed!" : "Quiz Completed",
      description: `You scored ${score}% (${correctAnswers}/${quizSession.questions.length} correct)`,
    });
  };

  const resetQuiz = () => {
    setQuizSession(null);
    setTimeElapsed(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (quizSession && !quizSession.isCompleted) {
    const currentQuestion = quizSession.questions[quizSession.currentQuestionIndex];
    const progress = ((quizSession.currentQuestionIndex + 1) / quizSession.questions.length) * 100;
    const userAnswer = quizSession.answers[currentQuestion.id];

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Quiz Header */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl">Nigerian Civic Knowledge Quiz</CardTitle>
                  <p className="text-gray-600">Question {quizSession.currentQuestionIndex + 1} of {quizSession.questions.length}</p>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatTime(timeElapsed)}
                  </div>
                  <Badge variant="outline" className="bg-blue-50">
                    {currentQuestion.category}
                  </Badge>
                  <Badge variant="outline" className={`
                    ${currentQuestion.difficulty === 'beginner' ? 'bg-green-50 text-green-700' : ''}
                    ${currentQuestion.difficulty === 'intermediate' ? 'bg-yellow-50 text-yellow-700' : ''}
                    ${currentQuestion.difficulty === 'advanced' ? 'bg-red-50 text-red-700' : ''}
                  `}>
                    {currentQuestion.difficulty}
                  </Badge>
                </div>
              </div>
              <Progress value={progress} className="mt-4" />
            </CardHeader>
          </Card>

          {/* Question Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg leading-relaxed">
                {currentQuestion.question}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Star className="w-4 h-4" />
                {currentQuestion.points} points
              </div>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={userAnswer || ''} 
                onValueChange={(value) => selectAnswer(currentQuestion.id, value)}
                className="space-y-3"
              >
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <div className="flex justify-between mt-8">
                <Button 
                  variant="outline" 
                  onClick={previousQuestion}
                  disabled={quizSession.currentQuestionIndex === 0}
                >
                  Previous
                </Button>
                <Button 
                  onClick={nextQuestion}
                  disabled={!userAnswer}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {quizSession.currentQuestionIndex === quizSession.questions.length - 1 ? 'Complete Quiz' : 'Next Question'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (quizSession && quizSession.isCompleted) {
    const score = quizSession.score!;
    const correctAnswers = quizSession.questions.filter(q => 
      quizSession.answers[q.id] === q.correctAnswer
    ).length;

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Results Header */}
          <Card className="mb-6 text-center">
            <CardHeader>
              <div className="w-20 h-20 mx-auto mb-4">
                {score >= 90 ? (
                  <Trophy className="w-20 h-20 text-yellow-500" />
                ) : score >= 70 ? (
                  <CheckCircle className="w-20 h-20 text-green-500" />
                ) : (
                  <AlertCircle className="w-20 h-20 text-orange-500" />
                )}
              </div>
              <CardTitle className="text-3xl mb-2">
                {score >= 90 ? 'Outstanding!' : score >= 70 ? 'Well Done!' : 'Keep Learning!'}
              </CardTitle>
              <p className="text-xl text-gray-600 mb-4">
                You scored {score}% ({correctAnswers}/{quizSession.questions.length} correct)
              </p>
              <div className="flex justify-center gap-4 text-sm text-gray-600">
                <div>Time: {formatTime(timeElapsed)}</div>
                <div>•</div>
                <div>Average: {Math.round(timeElapsed / quizSession.questions.length)}s per question</div>
              </div>
            </CardHeader>
          </Card>

          {/* Detailed Results */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Detailed Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quizSession.questions.map((question, index) => {
                  const userAnswer = quizSession.answers[question.id];
                  const isCorrect = userAnswer === question.correctAnswer;
                  
                  return (
                    <div key={question.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium flex-1 pr-4">
                          {index + 1}. {question.question}
                        </h4>
                        <div className="flex items-center gap-2">
                          {isCorrect ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-red-500" />
                          )}
                          <span className="text-sm text-gray-600">
                            {question.points} pts
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className={`p-2 rounded ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                          <strong>Your answer:</strong> {userAnswer || 'No answer'}
                        </div>
                        {!isCorrect && (
                          <div className="p-2 rounded bg-blue-50 text-blue-800">
                            <strong>Correct answer:</strong> {question.correctAnswer}
                          </div>
                        )}
                        <div className="p-2 rounded bg-gray-50 text-gray-700">
                          <strong>Explanation:</strong> {question.explanation}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={resetQuiz}>
              Take Another Quiz
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              Continue Learning
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Selection Screen
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Nigerian Civic Knowledge Quiz Center
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Test your knowledge of Nigerian civics, constitution, governance, and leadership. 
            Real questions designed to build credible leaders.
          </p>
        </div>

        {/* Quiz Options */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Quick Start */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Quick Start
              </CardTitle>
              <p className="text-gray-600">Jump right into a mixed quiz</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Difficulty Level</Label>
                <RadioGroup value={selectedDifficulty} onValueChange={(value: any) => setSelectedDifficulty(value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="beginner" id="beginner" />
                    <Label htmlFor="beginner">Beginner</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="intermediate" id="intermediate" />
                    <Label htmlFor="intermediate">Intermediate</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="advanced" id="advanced" />
                    <Label htmlFor="advanced">Advanced</Label>
                  </div>
                </RadioGroup>
              </div>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => startQuiz(undefined, selectedDifficulty)}
              >
                Start Random Quiz
              </Button>
            </CardContent>
          </Card>

          {/* Category Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                By Category
              </CardTitle>
              <p className="text-gray-600">Focus on specific knowledge areas</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Choose Category</Label>
                <RadioGroup value={selectedCategory} onValueChange={setSelectedCategory}>
                  {quizCategories.map(category => (
                    <div key={category} className="flex items-center space-x-2">
                      <RadioGroupItem value={category} id={category} />
                      <Label htmlFor={category} className="text-sm">{category}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => startQuiz(selectedCategory)}
                disabled={!selectedCategory}
              >
                Start Category Quiz
              </Button>
            </CardContent>
          </Card>

          {/* Quiz Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Available Content
              </CardTitle>
              <p className="text-gray-600">Comprehensive question bank</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{nigerianCivicQuizBank.length}</div>
                  <div className="text-sm text-gray-600">Total Questions</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{quizCategories.length}</div>
                  <div className="text-sm text-gray-600">Categories</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Categories Available:</h4>
                <div className="space-y-1">
                  {quizCategories.map(category => (
                    <div key={category} className="flex justify-between text-sm">
                      <span>{category}</span>
                      <Badge variant="outline" className="text-xs">
                        {getQuizByCategory(category).length} questions
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Real Nigerian Content</h3>
            <p className="text-gray-600 text-sm">
              Questions based on actual Nigerian laws, constitution, and governance structures
            </p>
          </div>
          <div className="text-center p-6">
            <BookOpen className="w-12 h-12 text-blue-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Detailed Explanations</h3>
            <p className="text-gray-600 text-sm">
              Learn from detailed explanations for every question, right or wrong
            </p>
          </div>
          <div className="text-center p-6">
            <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Track Progress</h3>
            <p className="text-gray-600 text-sm">
              Monitor your learning progress and areas for improvement
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}