import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { DonorLeaderboard } from "@/components/donations/DonorLeaderboard";
import { FundingProgress } from "@/components/donations/FundingProgress";
import { 
  Award, 
  Users, 
  MessageSquare, 
  Calendar, 
  TrendingUp,
  MapPin,
  Target,
  Star,
  CheckCircle,
  ArrowUp,
  Heart,
  Folder
} from "lucide-react";
import type { User, Wallet } from "@shared/schema";

interface VerifiedLeaderDashboardProps {
  user: User;
  wallet: Wallet;
  supBalance: number;
  totalEntries: number;
}

export function VerifiedLeaderDashboard({ user, wallet, supBalance, totalEntries }: VerifiedLeaderDashboardProps) {
  const [, setLocation] = useLocation();
  const credibilityScore = user.credibilityScore || 0;
  const isTrainedLeader = (user.credibleLevel || 0) >= 2;

  return (
    <div className="space-y-6">
      {/* Leader Status Section */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Award className="h-6 w-6 text-green-600" />
              Verified Leader Dashboard
            </CardTitle>
            <Badge className="bg-green-600 text-white">
              Level 1 - Verified
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            As a <strong>Verified Leader</strong> in {user.lga || 'your LGA'}, {user.state || 'your state'}, 
            you can nominate credible candidates, organize local activities, and represent your community 
            in the #13kCredibleChallenge network.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">Your Territory</span>
              </div>
              <div className="text-sm text-gray-700">
                <div>{user.lga || 'Local Government Area'}</div>
                <div>{user.state || 'State'}, Nigeria</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800">Impact Score</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{credibilityScore}</div>
              <div className="text-xs text-gray-600">Community credibility points</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Management & Community Funding */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Leadership Actions */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Leader Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nomination & Community Building */}
            <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              Community Leadership
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button className="w-full bg-purple-600 hover:bg-purple-700" data-testid="button-nominate-leader" onClick={() => setLocation('/nominate')}>
                <Star className="h-4 w-4 mr-2" />
                Nominate Credible Leaders
              </Button>
              <p className="text-sm text-gray-600">
                Identify and nominate promising candidates in your LGA for verification.
              </p>
            </div>
            
            <div className="border-t pt-4">
              <Button variant="outline" className="w-full" data-testid="button-organize-meeting">
                <Calendar className="h-4 w-4 mr-2" />
                Organize Community Meeting
              </Button>
              <p className="text-sm text-gray-600 mt-2">
                Host local gatherings to discuss civic issues and coordinate action.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-orange-600" />
              Advanced Civic Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div>
                  <div className="font-medium text-orange-900">LGA Assessment Survey</div>
                  <div className="text-sm text-orange-700">+50 SUP • High Impact</div>
                </div>
                <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                  Start
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <div className="font-medium text-blue-900">Voter Registration Drive</div>
                  <div className="text-sm text-blue-700">+75 SUP • Community Event</div>
                </div>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Plan Event
                </Button>
              </div>
            </div>
          </CardContent>
            </Card>
      
            {/* Project Oversight */}
            <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Folder className="h-5 w-5 text-green-600" />
              Project Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button className="w-full bg-green-600 hover:bg-green-700" data-testid="button-create-project">
                <Target className="h-4 w-4 mr-2" />
                Create Community Project
              </Button>
              <p className="text-sm text-gray-600">
                Launch funding campaigns for local infrastructure and development.
              </p>
            </div>
            
            <div className="border-t pt-4">
              <Button variant="outline" className="w-full" data-testid="button-review-proposals">
                <CheckCircle className="h-4 w-4 mr-2" />
                Review Project Proposals
              </Button>
              <p className="text-sm text-gray-600 mt-2">
                Evaluate and approve community project submissions.
              </p>
            </div>
          </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Community Funding & Transparency */}
        <div className="space-y-6">
        <FundingProgress 
          showAllProjects={true}
          className="block"
        />
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-600" />
              Community Impact Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="text-lg font-bold text-green-600">₦2.4M</div>
                <div className="text-sm text-green-600">Total Raised</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="text-lg font-bold text-blue-600">8</div>
                <div className="text-sm text-blue-600">Projects Funded</div>
              </div>
            </div>
            <Button variant="outline" className="w-full" data-testid="button-view-projects">
              View All Community Projects
            </Button>
          </CardContent>
        </Card>
        
        <DonorLeaderboard 
          limit={10}
          showTitle={true}
          className="block"
        />
        </div>
      </div>

      {/* Level Progression */}
      {!isTrainedLeader && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <ArrowUp className="h-5 w-5" />
              Ready for Level 2: Trained Leader?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-yellow-700">
              Advance to <strong>Trained Leader</strong> status to unlock mentoring tools, 
              training resources, and cross-LGA coordination capabilities.
            </p>
            
            <div className="bg-white rounded-lg p-4 border border-yellow-200">
              <div className="text-sm font-medium text-yellow-800 mb-2">Requirements for Level 2:</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Complete Leadership Training Program</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Successfully nominate 3 verified leaders</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Maintain 500+ credibility score</span>
                </div>
              </div>
            </div>
            
            <Button className="bg-yellow-600 hover:bg-yellow-700">
              Apply for Training Program
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Performance Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{supBalance.toFixed(1)}</div>
            <div className="text-sm text-gray-600">SUP Balance</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">3</div>
            <div className="text-sm text-gray-600">Nominations Made</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">2</div>
            <div className="text-sm text-gray-600">Events Organized</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">89%</div>
            <div className="text-sm text-gray-600">Community Rating</div>
          </CardContent>
        </Card>
      </div>

      {/* Local Network */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-indigo-600" />
            {user.lga || 'Local'} Leader Network
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
              <div>
                <div className="font-medium text-indigo-900">Connect with 12 other verified leaders in {user.lga || 'your LGA'}</div>
                <div className="text-sm text-indigo-700">Coordinate activities and share insights</div>
              </div>
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                Join Network
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}