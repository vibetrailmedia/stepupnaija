import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Calendar,
  Network,
  Target,
  Award,
  Briefcase,
  ArrowUp,
  CheckCircle,
  MapPin
} from "lucide-react";
import type { User, Wallet } from "@shared/schema";

interface TrainedLeaderDashboardProps {
  user: User;
  wallet: Wallet;
  supBalance: number;
  totalEntries: number;
}

export function TrainedLeaderDashboard({ user, wallet, supBalance, totalEntries }: TrainedLeaderDashboardProps) {
  const credibilityScore = user.credibilityScore || 0;
  const isCivicLeader = (user.credibleLevel || 0) >= 3;

  return (
    <div className="space-y-6">
      {/* Trained Leader Status */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl">
              <GraduationCap className="h-6 w-6 text-indigo-600" />
              Trained Leader Command Center
            </CardTitle>
            <Badge className="bg-indigo-600 text-white">
              Level 2 - Trained
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            As a <strong>Trained Leader</strong>, you mentor emerging leaders, coordinate 
            multi-LGA initiatives, and access advanced training resources. You're building 
            the next generation of civic leaders across Nigeria.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-indigo-200">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-indigo-600" />
                <span className="font-medium text-indigo-800">Mentees</span>
              </div>
              <div className="text-2xl font-bold text-indigo-600">8</div>
              <div className="text-xs text-gray-600">Active mentorship relationships</div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Network className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-purple-800">Network</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">3</div>
              <div className="text-xs text-gray-600">LGAs in coordination network</div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">Training Score</span>
              </div>
              <div className="text-2xl font-bold text-green-600">92%</div>
              <div className="text-xs text-gray-600">Leadership effectiveness rating</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Core Responsibilities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mentorship & Training */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Mentorship & Development
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button className="w-full bg-blue-600 hover:bg-blue-700" data-testid="button-manage-mentees">
                <Users className="h-4 w-4 mr-2" />
                Manage Your 8 Mentees
              </Button>
              <p className="text-sm text-gray-600">
                Guide verified leaders through training programs and skill development.
              </p>
            </div>
            
            <div className="border-t pt-4 space-y-3">
              <Button variant="outline" className="w-full" data-testid="button-training-resources">
                <BookOpen className="h-4 w-4 mr-2" />
                Access Training Resources
              </Button>
              <p className="text-sm text-gray-600">
                Advanced leadership materials, facilitation guides, and assessment tools.
              </p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <div className="text-sm font-medium text-blue-800 mb-2">Next Training Session</div>
              <div className="text-sm text-blue-700">
                "Conflict Resolution in Community Leadership" - Tomorrow, 2:00 PM
              </div>
              <Button size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700">
                Join Session
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Cross-LGA Coordination */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5 text-purple-600" />
              Multi-LGA Coordination
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button className="w-full bg-purple-600 hover:bg-purple-700" data-testid="button-coordinate-initiatives">
                <Target className="h-4 w-4 mr-2" />
                Coordinate State Initiatives
              </Button>
              <p className="text-sm text-gray-600">
                Lead collaborative projects across multiple Local Government Areas.
              </p>
            </div>
            
            <div className="border-t pt-4">
              <div className="bg-purple-50 rounded-lg p-3 border border-purple-200 mb-3">
                <div className="text-sm font-medium text-purple-800">Active Initiative</div>
                <div className="text-sm text-purple-700">"Youth Voter Registration Drive"</div>
                <div className="text-xs text-purple-600 mt-1">Spanning {user.state || 'your state'} - 5 LGAs participating</div>
              </div>
              
              <Button variant="outline" className="w-full" data-testid="button-create-initiative">
                <Calendar className="h-4 w-4 mr-2" />
                Create New Initiative
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Projects */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-green-600" />
            Leadership Projects & Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div>
                  <div className="font-medium text-green-900">Community Infrastructure Survey</div>
                  <div className="text-sm text-green-700">Multi-LGA assessment • +200 SUP</div>
                </div>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  Lead
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div>
                  <div className="font-medium text-orange-900">Leadership Workshop Series</div>
                  <div className="text-sm text-orange-700">Train 20 new leaders • +300 SUP</div>
                </div>
                <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                  Organize
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="text-sm font-medium text-gray-800 mb-2">Your Impact This Month</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Leaders Trained:</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Initiatives Led:</span>
                    <span className="font-medium">2</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Communities Reached:</span>
                    <span className="font-medium">2,450</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Level 3 Progression */}
      {!isCivicLeader && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <ArrowUp className="h-5 w-5" />
              Advance to Level 3: Civic Leader
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-amber-700">
              Ready to become a <strong>Civic Leader</strong> with full platform capabilities? 
              Unlock project funding, cross-state coordination, and executive leadership tools.
            </p>
            
            <div className="bg-white rounded-lg p-4 border border-amber-200">
              <div className="text-sm font-medium text-amber-800 mb-2">Requirements for Level 3:</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Successfully mentor 10+ leaders to verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Lead multi-LGA initiative with measurable impact</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Maintain 1000+ credibility score</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Complete Executive Leadership Certification</span>
                </div>
              </div>
            </div>
            
            <Button className="bg-amber-600 hover:bg-amber-700">
              Apply for Civic Leader Status
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Performance Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{supBalance.toFixed(1)}</div>
            <div className="text-sm text-gray-600">SUP Balance</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">12</div>
            <div className="text-sm text-gray-600">Leaders Mentored</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">3</div>
            <div className="text-sm text-gray-600">Active Projects</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">2.4K</div>
            <div className="text-sm text-gray-600">People Impacted</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}