import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AvatarCard from "@/components/AvatarCard";
import { Heart, Users, Target, Award } from "lucide-react";

interface VolunteerInvitationProps {
  userType?: string;
  volunteerStatus?: string;
}

export default function VolunteerInvitation({ userType, volunteerStatus }: VolunteerInvitationProps) {
  // Don't show for active volunteers
  if (userType === 'VOLUNTEER' && volunteerStatus === 'ACTIVE') {
    return null;
  }

  // Show rejoin option for inactive volunteers
  if (userType === 'VOLUNTEER' && volunteerStatus === 'INACTIVE') {
    return (
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center text-green-800">
            <Heart className="w-5 h-5 mr-2" />
            Welcome Back, Volunteer!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">
            You're currently on a break from volunteering. Ready to make an impact again?
          </p>
          <Button 
            onClick={async () => {
              try {
                const response = await fetch('/api/volunteer/opt-in', { 
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' }
                });
                if (response.ok) {
                  window.location.reload();
                } else {
                  alert('Failed to rejoin volunteers. Please try again.');
                }
              } catch (error) {
                console.error('Failed to opt in:', error);
                alert('Failed to rejoin volunteers. Please try again.');
              }
            }}
            className="bg-green-600 hover:bg-green-700"
          >
            <Heart className="w-4 h-4 mr-2" />
            Rejoin Volunteer Program
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Show invitation for non-volunteers
  return (
    <AvatarCard 
      character="kamsi"
      variant="encouragement"
      message={
        <div>
          <p className="mb-3">
            <strong>Ready to make a difference in Nigeria?</strong> I'd love to help you join our volunteer community!
          </p>
          <p className="mb-4 text-gray-600">
            Join thousands of volunteers working to strengthen democracy and civic engagement across Nigeria's 774 Local Government Areas.
          </p>
          <div className="flex items-center space-x-6 mb-4 text-sm">
            <div className="flex items-center text-blue-600">
              <Users className="w-4 h-4 mr-1" />
              <span>Community Impact</span>
            </div>
            <div className="flex items-center text-green-600">
              <Target className="w-4 h-4 mr-1" />
              <span>Skill Building</span>
            </div>
            <div className="flex items-center text-purple-600">
              <Award className="w-4 h-4 mr-1" />
              <span>Recognition</span>
            </div>
          </div>
        </div>
      }
      action={
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <a href="/volunteer-onboarding">
            <Heart className="w-4 h-4 mr-2" />
            Start Your Volunteer Journey with Me
          </a>
        </Button>
      }
    />
  );
}