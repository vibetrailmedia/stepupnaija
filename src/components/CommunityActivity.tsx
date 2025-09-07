import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  Trophy, 
  Target, 
  Users, 
  MapPin,
  TrendingUp,
  Rocket
} from "lucide-react";
import { useLocation } from "wouter";

// Getting started activities for new users
const onboardingActivities = [
  {
    id: 1,
    type: 'onboarding',
    action: 'Complete your profile verification',
    description: 'Verify your identity to unlock premium features',
    timeAgo: 'Next step',
    icon: Target,
    color: 'text-green-600',
    actionUrl: '/kyc'
  },
  {
    id: 2,
    type: 'onboarding',
    action: 'Take a civic engagement quiz',
    description: 'Learn about Nigerian governance and earn SUP tokens',
    timeAgo: 'Recommended',
    icon: Trophy,
    color: 'text-blue-600',
    actionUrl: '/quiz-center'
  },
  {
    id: 3,
    type: 'onboarding',
    action: 'Explore community projects',
    description: 'See how citizens are driving change in your area',
    timeAgo: 'Discover',
    icon: Users,
    color: 'text-purple-600',
    actionUrl: '/projects'
  },
  {
    id: 4,
    type: 'onboarding',
    action: 'Join the #13K Challenge',
    description: 'Be part of Nigeria\'s leadership transformation',
    timeAgo: 'Join now',
    icon: TrendingUp,
    color: 'text-orange-600',
    actionUrl: '/challenge'
  }
];

// Platform stats - real numbers from the system
const platformStats = [
  { label: 'Registered Citizens', count: 1, trend: 'You are among the first!' },
  { label: 'Platform Launch', count: '2025', trend: 'Building the future' },
];

export function CommunityActivity() {
  const [, setLocation] = useLocation();
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Rocket className="h-5 w-5 text-primary-600" />
            Get Started
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-600">New User</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Platform Stats */}
        <div className="grid grid-cols-2 gap-3 p-3 bg-primary-50 rounded-lg border border-primary-200">
          {platformStats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-lg font-bold text-primary-600">{stat.count}</div>
              <div className="text-xs text-gray-600 mb-1">{stat.label}</div>
              <div className="text-xs text-green-600 font-medium">{stat.trend}</div>
            </div>
          ))}
        </div>

        {/* Getting Started Activities */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Target className="h-4 w-4" />
            Your Next Steps
          </h4>
          
          {onboardingActivities.map((activity) => {
            const IconComponent = activity.icon;
            return (
              <div key={activity.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        activity.id === 1 ? 'bg-green-100' :
                        activity.id === 2 ? 'bg-blue-100' :
                        activity.id === 3 ? 'bg-purple-100' : 'bg-orange-100'
                      }`}>
                        <IconComponent className={`h-5 w-5 ${activity.color}`} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm font-semibold text-gray-900 leading-tight">
                          {activity.action}
                        </h4>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium ml-2 flex-shrink-0">
                          {activity.timeAgo}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 leading-relaxed">{activity.description}</p>
                      <Button 
                        size="sm" 
                        className={`w-full font-semibold text-white shadow-md hover:shadow-lg transition-all duration-200 ${
                          activity.id === 1 ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800' :
                          activity.id === 2 ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800' :
                          activity.id === 3 ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800' : 
                          'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800'
                        }`}
                        onClick={() => setLocation(activity.actionUrl)}
                        data-testid={`button-${activity.type}-${activity.id}`}
                      >
                        Get Started
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-4 border-t border-gray-200">
          <Button 
            size="sm"
            onClick={() => setLocation('/kyc')}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 py-3"
            data-testid="button-complete-profile"
          >
            <span className="flex items-center justify-center gap-2">
              📋 Complete Your Profile
              <span className="text-sm">→</span>
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}