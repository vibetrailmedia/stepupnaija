import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Coins, 
  Trophy, 
  Users, 
  Target,
  Gift,
  Heart,
  Flag,
  Smartphone,
  Star,
  Award,
  Clock,
  MapPin
} from 'lucide-react';
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import AvatarCard from '@/components/AvatarCard';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: any;
  content: React.ReactNode;
}

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get user data
  const { data: user } = useQuery({ queryKey: ['/api/user'] });
  const { data: wallet } = useQuery({ queryKey: ['/api/wallet'] });

  // Mark onboarding as completed
  const completeOnboardingMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/user/complete-onboarding');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      toast({
        title: 'Welcome to Step Up Naija! 🎉',
        description: 'Your onboarding is complete. Let\'s start your civic journey!'
      });
      // Navigate to dashboard and scroll to top
      setLocation('/dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: 'Failed to complete onboarding. Please try again.',
        variant: 'destructive'
      });
    }
  });

  const steps: OnboardingStep[] = [
    {
      id: 1,
      title: 'Welcome to Step Up Naija!',
      description: 'Join millions of Nigerians building a better future',
      icon: Flag,
      content: (
        <div className="space-y-6">
          <AvatarCard 
            character="tari" 
            variant="welcome"
            message={
              <div>
                <p className="mb-3">
                  🇳🇬 Welcome to Step Up Naija, {(user as any)?.firstName}! I'm Tari, your civic engagement guide.
                </p>
                <p className="mb-3">
                  You've joined Nigeria's largest platform for democratic participation and community impact. Together, we're selecting 13,000 credible leaders across all 774 Local Government Areas!
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                  <h4 className="font-semibold text-green-800 mb-2">🌟 Your Mission:</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Complete civic tasks and earn SUP tokens</li>
                    <li>• Vote on community projects</li>
                    <li>• Win amazing prizes in our weekly draws</li>
                    <li>• Help build transparent governance</li>
                  </ul>
                </div>
              </div>
            }
          />
        </div>
      )
    },
    {
      id: 2,
      title: 'Understanding SUP Tokens',
      description: 'Your key to civic engagement and rewards',
      icon: Coins,
      content: (
        <div className="space-y-6">
          <AvatarCard 
            character="kamsi" 
            variant="explanation"
            message={
              <div>
                <p className="mb-3">
                  Let me explain SUP tokens - the heart of Step Up Naija! 
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Coins className="w-5 h-5 text-blue-600 mr-2" />
                      <h4 className="font-semibold text-blue-800">How to Earn</h4>
                    </div>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Complete civic tasks (+10-50 SUP)</li>
                      <li>• Vote on projects (+5 SUP)</li>
                      <li>• Refer friends (+25 SUP)</li>
                      <li>• Join events (+15 SUP)</li>
                    </ul>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Trophy className="w-5 h-5 text-yellow-600 mr-2" />
                      <h4 className="font-semibold text-yellow-800">How to Use</h4>
                    </div>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Enter weekly prize draws</li>
                      <li>• Boost project funding</li>
                      <li>• Unlock premium features</li>
                      <li>• Convert to cash rewards</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">Your Current Balance</p>
                      <p className="text-2xl font-bold text-green-600">{(wallet as any)?.supBalance || '0'} SUP</p>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex items-center justify-center">
                      <Coins className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            }
          />
        </div>
      )
    },
    {
      id: 3,
      title: 'Your First Civic Task',
      description: 'Start earning SUP tokens today',
      icon: Target,
      content: (
        <div className="space-y-6">
          <AvatarCard 
            character="tari" 
            variant="encouragement"
            message={
              <div>
                <p className="mb-3">
                  Ready for your first civic task? Let's start with something simple but impactful!
                </p>
                
                <div className="bg-white border-2 border-green-200 rounded-lg p-6 mt-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-2">📋 Complete Your Profile</h4>
                      <p className="text-gray-700 mb-3">
                        Help us understand you better by completing your profile information.
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge className="bg-green-100 text-green-800">
                          Reward: +20 SUP
                        </Badge>
                        <Badge variant="outline" className="text-orange-600 border-orange-300">
                          5 minutes
                        </Badge>
                      </div>
                      
                      <Button 
                        className="w-full mt-4 bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          toast({
                            title: 'Profile Task Started!',
                            description: 'We\'ll guide you through this after onboarding.'
                          });
                        }}
                        data-testid="button-start-profile-task"
                      >
                        Start This Task
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <h4 className="font-semibold text-blue-800 mb-2">🎯 Other Available Tasks:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Verify your local government area (+15 SUP)</li>
                    <li>• Share Step Up Naija with friends (+25 SUP)</li>
                    <li>• Join our community discussion (+10 SUP)</li>
                    <li>• Watch civic education video (+5 SUP)</li>
                  </ul>
                </div>
              </div>
            }
          />
        </div>
      )
    },
    {
      id: 4,
      title: 'Weekly Prize Draws',
      description: 'Win amazing rewards every week',
      icon: Gift,
      content: (
        <div className="space-y-6">
          <AvatarCard 
            character="kamsi" 
            variant="encouragement"
            message={
              <div>
                <p className="mb-3">
                  This is exciting! Every week, we give away incredible prizes to our active community members.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-lg p-4">
                    <div className="text-center">
                      <Trophy className="w-12 h-12 mx-auto text-yellow-600 mb-3" />
                      <h4 className="font-bold text-gray-900 mb-2">This Week's Prizes</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>🥇 1st Prize:</span>
                          <span className="font-semibold">₦100,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>🥈 2nd Prize:</span>
                          <span className="font-semibold">₦50,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>🥉 3rd Prize:</span>
                          <span className="font-semibold">₦25,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>🎁 10 Prizes:</span>
                          <span className="font-semibold">₦5,000 each</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-4">
                    <div className="text-center">
                      <Coins className="w-12 h-12 mx-auto text-green-600 mb-3" />
                      <h4 className="font-bold text-gray-900 mb-2">How to Enter</h4>
                      <div className="space-y-3 text-sm text-left">
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                          <span>Earn SUP tokens through tasks</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                          <span>Each 10 SUP = 1 draw entry</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                          <span>More entries = higher chances</span>
                        </div>
                        <div className="flex items-center">
                          <Heart className="w-4 h-4 text-red-500 mr-2" />
                          <span>Free entry always available!</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-4 text-center">
                  <Star className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                  <p className="font-semibold text-purple-800">Next Draw: Every Friday 8PM</p>
                  <p className="text-sm text-purple-700 mt-1">
                    Draw results are broadcast live and stored on blockchain for transparency
                  </p>
                </div>
              </div>
            }
          />
        </div>
      )
    },
    {
      id: 5,
      title: 'Community & Projects',
      description: 'Connect with fellow citizens and support local initiatives',
      icon: Users,
      content: (
        <div className="space-y-6">
          <AvatarCard 
            character="tari" 
            variant="guidance"
            message={
              <div>
                <p className="mb-3">
                  Step Up Naija isn't just about individual rewards - it's about building stronger communities together.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <Users className="w-6 h-6 text-blue-600 mr-2" />
                      <h4 className="font-semibold text-gray-900">Community Features</h4>
                    </div>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                        Local government discussions
                      </li>
                      <li className="flex items-center">
                        <Award className="w-4 h-4 text-gray-500 mr-2" />
                        Civic leader nominations
                      </li>
                      <li className="flex items-center">
                        <Smartphone className="w-4 h-4 text-gray-500 mr-2" />
                        Town hall meetings
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <Target className="w-6 h-6 text-green-600 mr-2" />
                      <h4 className="font-semibold text-gray-900">Project Voting</h4>
                    </div>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-gray-500 mr-2" />
                        Review proposed projects
                      </li>
                      <li className="flex items-center">
                        <Heart className="w-4 h-4 text-gray-500 mr-2" />
                        Vote for community priorities
                      </li>
                      <li className="flex items-center">
                        <Clock className="w-4 h-4 text-gray-500 mr-2" />
                        Track project progress
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mt-4">
                  <div className="text-center">
                    <h4 className="font-bold text-gray-900 mb-2">🏆 Current Featured Project</h4>
                    <p className="text-gray-700 mb-3">Solar-Powered Clinic for Kano Rural Communities</p>
                    <div className="flex items-center justify-center space-x-4 text-sm">
                      <div className="text-center">
                        <p className="font-semibold text-green-600">₦2.5M</p>
                        <p className="text-gray-500">Funded</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-blue-600">1,234</p>
                        <p className="text-gray-500">Votes</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-purple-600">85%</p>
                        <p className="text-gray-500">Complete</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
          />
        </div>
      )
    },
    {
      id: 6,
      title: 'You\'re All Set!',
      description: 'Ready to start your civic journey',
      icon: CheckCircle,
      content: (
        <div className="space-y-6">
          <AvatarCard 
            character="kamsi" 
            variant="encouragement"
            message={
              <div>
                <p className="mb-4">
                  🎉 Congratulations, {(user as any)?.firstName}! You're now ready to make a real difference in Nigeria's future.
                </p>
                
                <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-6 mt-4">
                  <h4 className="font-bold text-gray-900 mb-4 text-center">Your Next Steps:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                        <Target className="w-6 h-6 text-green-600" />
                      </div>
                      <h5 className="font-semibold text-gray-800 mb-1">Complete Tasks</h5>
                      <p className="text-sm text-gray-600">Start earning SUP tokens</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <h5 className="font-semibold text-gray-800 mb-1">Join Community</h5>
                      <p className="text-sm text-gray-600">Connect with neighbors</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                        <Gift className="w-6 h-6 text-yellow-600" />
                      </div>
                      <h5 className="font-semibold text-gray-800 mb-1">Enter Draws</h5>
                      <p className="text-sm text-gray-600">Win amazing prizes</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                  <div className="flex items-center">
                    <Gift className="w-6 h-6 text-yellow-600 mr-3" />
                    <div>
                      <h4 className="font-semibold text-yellow-800">🎁 Onboarding Bonus!</h4>
                      <p className="text-sm text-yellow-700">You'll receive 50 SUP tokens for completing this onboarding</p>
                    </div>
                  </div>
                </div>
              </div>
            }
          />
        </div>
      )
    }
  ];

  const currentStepData = steps.find(step => step.id === currentStep);
  const totalSteps = steps.length;
  const progress = (currentStep / totalSteps) * 100;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const finishOnboarding = () => {
    completeOnboardingMutation.mutate();
  };

  if (!currentStepData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                <Flag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome to Step Up Naija</h1>
                <p className="text-gray-600">Step {currentStep} of {totalSteps}</p>
              </div>
            </div>
            <Badge variant="outline" className="px-4 py-2">
              {Math.round(progress)}% Complete
            </Badge>
          </div>
          
          <Progress value={progress} className="w-full h-2" />
          
          {/* Step Indicators */}
          <div className="flex justify-between mt-4">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;
              
              return (
                <div 
                  key={step.id} 
                  className={`flex items-center space-x-2 ${
                    isActive ? 'text-green-600' : isCompleted ? 'text-gray-700' : 'text-gray-400'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isActive 
                      ? 'bg-green-600 text-white' 
                      : isCompleted 
                        ? 'bg-gray-200 text-gray-700' 
                        : 'bg-gray-100 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">{step.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex items-center justify-center">
              <currentStepData.icon className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
            <CardDescription className="text-lg">{currentStepData.description}</CardDescription>
          </CardHeader>
          
          <CardContent>
            {currentStepData.content}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center"
            data-testid="button-previous-step"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              onClick={() => setLocation('/dashboard')}
              data-testid="button-skip-onboarding"
            >
              Skip for Now
            </Button>
            
            {currentStep === totalSteps ? (
              <Button
                onClick={finishOnboarding}
                disabled={completeOnboardingMutation.isPending}
                className="bg-green-600 hover:bg-green-700 flex items-center"
                data-testid="button-complete-onboarding"
              >
                {completeOnboardingMutation.isPending ? 'Completing...' : 'Complete Onboarding'}
                <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                className="bg-green-600 hover:bg-green-700 flex items-center"
                data-testid="button-next-step"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}