import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { FileText, Clock, Loader2, CheckCircle } from "lucide-react";

interface SurveyTaskCardProps {
  task: any;
  onComplete: (task: any, surveyData: any) => void;
  isCompleting: boolean;
  colors: any;
}

export function SurveyTaskCard({ task, onComplete, isCompleting, colors }: SurveyTaskCardProps) {
  const { toast } = useToast();
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Sample survey questions based on task type
  const getSurveyQuestions = (taskId: string) => {
    switch (taskId) {
      case 'local-governance-survey':
        return [
          {
            id: 'satisfaction',
            question: 'How satisfied are you with your local government services?',
            type: 'radio',
            options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied']
          },
          {
            id: 'priority',
            question: 'What should be the top priority for your local government?',
            type: 'radio',
            options: ['Infrastructure', 'Healthcare', 'Education', 'Security', 'Economic Development']
          },
          {
            id: 'participation',
            question: 'How often do you attend local government meetings?',
            type: 'radio',
            options: ['Regularly', 'Sometimes', 'Rarely', 'Never']
          }
        ];
      case 'youth-civic-survey':
        return [
          {
            id: 'engagement',
            question: 'How would you rate youth engagement in your community?',
            type: 'radio',
            options: ['Excellent', 'Good', 'Average', 'Poor', 'Very Poor']
          },
          {
            id: 'barriers',
            question: 'What is the biggest barrier to youth civic participation?',
            type: 'radio',
            options: ['Lack of Information', 'Time Constraints', 'Lack of Interest', 'No Accessible Platforms', 'Cultural Barriers']
          },
          {
            id: 'improvement',
            question: 'How can civic engagement be improved for young people?',
            type: 'radio',
            options: ['Digital Platforms', 'Youth Councils', 'Educational Programs', 'Mentorship', 'Financial Incentives']
          }
        ];
      default:
        return [
          {
            id: 'general',
            question: 'How would you rate this civic initiative?',
            type: 'radio',
            options: ['Excellent', 'Good', 'Average', 'Poor']
          }
        ];
    }
  };

  const questions = getSurveyQuestions(task.id);

  const handleResponseChange = (questionId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmitSurvey = () => {
    // Validate that all questions are answered
    const unansweredQuestions = questions.filter(q => !responses[q.id]);
    if (unansweredQuestions.length > 0) {
      toast({
        title: "Survey incomplete",
        description: "Please answer all questions before submitting",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    const surveyData = {
      responses,
      feedback,
      completedAt: new Date().toISOString(),
      taskType: 'survey',
    };

    onComplete(task, surveyData);
  };

  return (
    <Card key={task.id} className={`border-2 transition-all duration-200 ${
      task.completed 
        ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 opacity-75' 
        : `${colors.border} hover:shadow-lg`
    }`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            task.completed ? 'bg-green-100' : colors.bg
          }`}>
            {task.completed ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <FileText className={`w-6 h-6 ${colors.text}`} />
            )}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              +{parseFloat(task.rewardSUP).toLocaleString()} SUP
            </div>
            <div className="text-sm text-gray-500">
              {task.completed ? 'Earned' : 'Reward'}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold text-lg text-gray-900 mb-2" data-testid={`text-task-title-${task.id}`}>
            {task.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3" data-testid={`text-task-description-${task.id}`}>
            {task.description}
          </p>
          
          <div className="flex items-center space-x-2 mb-4">
            <Badge variant="outline" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              {task.estimate || '5 min'}
            </Badge>
            <Badge variant="outline" className={`text-xs ${
              task.completed ? 'bg-green-100 text-green-700 border-green-300' : ''
            }`}>
              {task.completed ? (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Completed
                </>
              ) : (
                <>
                  <FileText className="w-3 h-3 mr-1" />
                  Survey
                </>
              )}
            </Badge>
            {task.difficulty && (
              <Badge className={`text-xs ${getDifficultyColor(task.difficulty)}`}>
                {task.difficulty}
              </Badge>
            )}
          </div>
        </div>

        {/* Survey Questions */}
        <div className="space-y-6 mb-6">
          {questions.map((question, index) => (
            <div key={question.id} className="bg-gray-50 p-4 rounded-xl space-y-4">
              <Label className="text-base font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-600 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold mr-3">
                  {index + 1}
                </span>
                {question.question}
              </Label>
              
              {question.type === 'radio' && (
                <div className="space-y-2">
                  {question.options.map((option) => (
                    <div 
                      key={option}
                      className={`p-4 border-2 rounded-xl cursor-pointer font-semibold transition-all duration-300 transform hover:scale-105 ${
                        responses[question.id] === option 
                          ? 'bg-gradient-to-r from-green-100 to-green-200 border-green-500 text-green-800 shadow-lg' 
                          : 'bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-700 shadow-sm'
                      }`}
                      onClick={() => {
                        handleResponseChange(question.id, option);
                      }}
                      data-testid={`option-${question.id}-${option.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-left">{option}</span>
                        {responses[question.id] === option && (
                          <span className="text-green-600 font-bold text-xl ml-2">✓</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Optional Feedback */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900">
              Additional Comments (Optional)
            </Label>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share any additional thoughts or suggestions..."
              className="resize-none"
              rows={3}
              data-testid="textarea-survey-feedback"
            />
          </div>
        </div>

        {/* Submit Button */}
        {task.completed ? (
          <Button
            disabled
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-medium"
            data-testid={`button-completed-${task.id}`}
          >
            ✅ Survey Completed - SUP Earned!
          </Button>
        ) : (
          <Button
            onClick={handleSubmitSurvey}
            disabled={isCompleting || submitting}
            className={`w-full ${colors.button} text-white font-medium`}
            data-testid={`button-complete-${task.id}`}
          >
            {isCompleting || submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              `Submit Survey & Earn ${parseFloat(task.rewardSUP).toLocaleString()} SUP`
            )}
          </Button>
        )}

        {/* Survey Info */}
        <div className={`mt-4 p-3 rounded-lg ${
          task.completed 
            ? 'bg-green-50' 
            : 'bg-blue-50'
        }`}>
          {task.completed ? (
            <>
              <h5 className="font-medium text-green-900 mb-1">Survey Completed!</h5>
              <p className="text-xs text-green-700">
                🎉 Thank you for your valuable civic participation! Your feedback contributes to better governance.
              </p>
            </>
          ) : (
            <>
              <h5 className="font-medium text-blue-900 mb-1">Survey Guidelines:</h5>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Your responses help improve civic services</li>
                <li>• All answers are confidential and anonymous</li>
                <li>• Complete all questions to earn full rewards</li>
                <li>• Your feedback contributes to policy decisions</li>
              </ul>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function getDifficultyColor(difficulty: string) {
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
}