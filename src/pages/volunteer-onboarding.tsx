import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import AvatarCard from "@/components/AvatarCard";
import {
  Users,
  Clock,
  MapPin,
  Heart,
  Target,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Globe,
  BookOpen,
  Megaphone,
  Building
} from "lucide-react";

const steps = [
  { id: 1, title: "Welcome", icon: Heart },
  { id: 2, title: "Your Profile", icon: Users },
  { id: 3, title: "Availability", icon: Clock },
  { id: 4, title: "Skills & Interests", icon: Target },
  { id: 5, title: "Impact Goals", icon: Sparkles },
  { id: 6, title: "Ready to Serve!", icon: CheckCircle }
];

const availabilityOptions = [
  { value: "WEEKENDS", label: "Weekends only", description: "Saturday & Sunday" },
  { value: "EVENINGS", label: "Evenings after work", description: "Weekday evenings" },
  { value: "FLEXIBLE", label: "Flexible schedule", description: "Can adapt as needed" },
  { value: "FULL_TIME", label: "Full-time volunteer", description: "Available most days" }
];

const timeCommitmentOptions = [
  { value: "1-5_HOURS", label: "1-5 hours per week", description: "Light commitment" },
  { value: "5-10_HOURS", label: "5-10 hours per week", description: "Regular volunteer" },
  { value: "10-20_HOURS", label: "10-20 hours per week", description: "Serious commitment" },
  { value: "20+_HOURS", label: "20+ hours per week", description: "Full-time dedication" }
];

const activityOptions = [
  { id: "VOTER_REGISTRATION", label: "Voter Registration", icon: BookOpen, description: "Help citizens register to vote" },
  { id: "COMMUNITY_OUTREACH", label: "Community Outreach", icon: Users, description: "Connect with local communities" },
  { id: "EVENT_ORGANIZATION", label: "Event Organization", icon: Building, description: "Plan and coordinate civic events" },
  { id: "SOCIAL_MEDIA", label: "Social Media Advocacy", icon: Megaphone, description: "Spread awareness online" },
  { id: "DATA_COLLECTION", label: "Data Collection", icon: Target, description: "Research and gather civic data" },
  { id: "AWARENESS_CAMPAIGNS", label: "Awareness Campaigns", icon: Globe, description: "Educate people about civic issues" },
  { id: "SECURITY", label: "Community Security", icon: Globe, description: "Support community safety initiatives" }
];

const skillOptions = [
  "COMMUNICATION", "TECH_SAVVY", "ORGANIZATION", "LEADERSHIP", 
  "MARKETING", "TEACHING", "RESEARCH", "DESIGN", "WRITING", 
  "PUBLIC_SPEAKING", "PROJECT_MANAGEMENT", "FUNDRAISING"
];

const languageOptions = [
  "ENGLISH", "HAUSA", "YORUBA", "IGBO", "FULFULDE", "KANURI", "TIV", "IBIBIO", "EDO", "NUPE"
];

export default function VolunteerOnboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    userType: "VOLUNTEER",
    availability: "",
    timeCommitment: "",
    transportationAccess: false,
    preferredActivities: [] as string[],
    skills: [] as string[],
    languages: [] as string[],
    experience: "",
    motivation: "",
    emergencyContact: "",
    impactGoals: [] as string[]
  });

  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const onboardingMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/volunteer/onboard", data);
    },
    onSuccess: () => {
      toast({
        title: "Welcome to the Team! 🎉",
        description: "You're now ready to make a real impact in Nigeria!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      setLocation("/volunteer-dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to complete onboarding",
        variant: "destructive",
      });
    },
  });

  const progress = (currentStep / steps.length) * 100;

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleActivityToggle = (activity: string) => {
    setFormData(prev => ({
      ...prev,
      preferredActivities: prev.preferredActivities.includes(activity)
        ? prev.preferredActivities.filter(a => a !== activity)
        : [...prev.preferredActivities, activity]
    }));
  };

  const handleLanguageToggle = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  const handleSubmit = () => {
    onboardingMutation.mutate({
      ...formData,
      userId: user?.id
    });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return true;
      case 2: return formData.availability && formData.timeCommitment;
      case 3: return formData.preferredActivities.length > 0;
      case 4: return formData.skills.length > 0 && formData.languages.length > 0;
      case 5: return formData.motivation.trim().length > 10;
      default: return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Volunteer Onboarding</h1>
            <Badge className="bg-green-100 text-green-700">
              Step {currentStep} of {steps.length}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
          
          {/* Step indicators */}
          <div className="flex justify-between mt-4">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep >= step.id ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs mt-1 text-gray-600">{step.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        <Card>
          <CardContent className="p-8">
            {/* Step 1: Welcome */}
            {currentStep === 1 && (
              <div className="space-y-6">
                {/* Kamsi's Welcome Message */}
                <AvatarCard 
                  character="kamsi"
                  variant="welcome"
                  message={
                    <div>
                      <p className="mb-3">
                        <strong>Hello and welcome!</strong> I'm Kamsi, and I'm here to guide you through your volunteer journey. 
                        It's so exciting that you want to make a difference in Nigeria!
                      </p>
                      <p>
                        We'll go through 6 quick steps together to set up your volunteer profile. 
                        This helps us connect you with opportunities where you can create real impact while growing your skills.
                      </p>
                    </div>
                  }
                />
                
                <div className="text-center space-y-6">
                  <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                    <Heart className="w-10 h-10 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Welcome to Nigeria's Civic Volunteer Network!
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                      You're about to join thousands of Nigerians creating real change in their communities. 
                      This quick setup will help us match you with the perfect volunteer opportunities that align 
                      with your skills, interests, and availability.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <h3 className="font-semibold text-blue-900">Real Impact</h3>
                      <p className="text-sm text-blue-700">Work on projects that create measurable change</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <h3 className="font-semibold text-green-900">Connect</h3>
                      <p className="text-sm text-green-700">Meet like-minded Nigerians in your area</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <Sparkles className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <h3 className="font-semibold text-purple-900">Grow</h3>
                      <p className="text-sm text-purple-700">Develop leadership and civic skills</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Your Profile */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell Us About Your Availability</h2>
                  <p className="text-gray-600">When can you contribute to making Nigeria better?</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label className="text-base font-semibold">When are you typically available?</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      {availabilityOptions.map((option) => (
                        <div
                          key={option.value}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            formData.availability === option.value
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setFormData(prev => ({ ...prev, availability: option.value }))}
                        >
                          <h3 className="font-medium">{option.label}</h3>
                          <p className="text-sm text-gray-600">{option.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-semibold">How much time can you commit weekly?</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      {timeCommitmentOptions.map((option) => (
                        <div
                          key={option.value}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            formData.timeCommitment === option.value
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setFormData(prev => ({ ...prev, timeCommitment: option.value }))}
                        >
                          <h3 className="font-medium">{option.label}</h3>
                          <p className="text-sm text-gray-600">{option.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="transportation"
                      checked={formData.transportationAccess}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, transportationAccess: checked as boolean }))
                      }
                    />
                    <Label htmlFor="transportation">I have reliable transportation to volunteer locations</Label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Activities */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">What Activities Interest You?</h2>
                  <p className="text-gray-600">Choose the types of civic activities you'd like to participate in</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activityOptions.map((activity) => {
                    const Icon = activity.icon;
                    const isSelected = formData.preferredActivities.includes(activity.id);
                    return (
                      <div
                        key={activity.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          isSelected
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleActivityToggle(activity.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <Icon className={`w-6 h-6 mt-1 ${isSelected ? 'text-green-600' : 'text-gray-400'}`} />
                          <div>
                            <h3 className="font-medium">{activity.label}</h3>
                            <p className="text-sm text-gray-600">{activity.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 4: Skills & Languages */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Skills & Languages</h2>
                  <p className="text-gray-600">Help us match you with opportunities that use your strengths</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label className="text-base font-semibold mb-3 block">What skills do you bring?</Label>
                    <div className="flex flex-wrap gap-2">
                      {skillOptions.map((skill) => (
                        <Badge
                          key={skill}
                          variant={formData.skills.includes(skill) ? "default" : "outline"}
                          className={`cursor-pointer ${
                            formData.skills.includes(skill)
                              ? 'bg-green-600 hover:bg-green-700'
                              : 'hover:bg-gray-100'
                          }`}
                          onClick={() => handleSkillToggle(skill)}
                        >
                          {skill.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-semibold mb-3 block">Which languages do you speak?</Label>
                    <div className="flex flex-wrap gap-2">
                      {languageOptions.map((language) => (
                        <Badge
                          key={language}
                          variant={formData.languages.includes(language) ? "default" : "outline"}
                          className={`cursor-pointer ${
                            formData.languages.includes(language)
                              ? 'bg-blue-600 hover:bg-blue-700'
                              : 'hover:bg-gray-100'
                          }`}
                          onClick={() => handleLanguageToggle(language)}
                        >
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="experience" className="text-base font-semibold">
                      Previous volunteer or civic experience (optional)
                    </Label>
                    <Textarea
                      id="experience"
                      placeholder="Tell us about any relevant experience you have..."
                      value={formData.experience}
                      onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="emergencyContact" className="text-base font-semibold">
                      Emergency Contact (Phone Number)
                    </Label>
                    <Input
                      id="emergencyContact"
                      placeholder="Enter emergency contact number"
                      value={formData.emergencyContact}
                      onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Impact Goals */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Motivation</h2>
                  <p className="text-gray-600">Why do you want to volunteer? What change do you hope to see in Nigeria?</p>
                </div>

                <div>
                  <Label htmlFor="motivation" className="text-base font-semibold">
                    Tell us what drives you to serve Nigeria
                  </Label>
                  <Textarea
                    id="motivation"
                    placeholder="Share your passion for civic engagement and the impact you want to make..."
                    value={formData.motivation}
                    onChange={(e) => setFormData(prev => ({ ...prev, motivation: e.target.value }))}
                    className="mt-2 min-h-32"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    This helps us understand your goals and match you with meaningful opportunities.
                  </p>
                </div>
              </div>
            )}

            {/* Step 6: Ready */}
            {currentStep === 6 && (
              <div className="text-center space-y-6">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    You're Ready to Make an Impact!
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Thank you for joining Nigeria's civic volunteer network. We'll now match you with 
                    volunteer opportunities that align with your skills and interests.
                  </p>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• We'll send you personalized volunteer opportunities</li>
                    <li>• You can browse and apply for projects in your area</li>
                    <li>• Track your impact and volunteer hours</li>
                    <li>• Connect with other volunteers and leaders</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button
                onClick={prevStep}
                disabled={currentStep === 1}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>

              {currentStep < steps.length ? (
                <Button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={onboardingMutation.isPending}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  {onboardingMutation.isPending ? "Setting Up..." : "Start Volunteering!"}
                  <Sparkles className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}