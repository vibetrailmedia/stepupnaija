import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Crown, 
  BarChart3, 
  Globe, 
  DollarSign,
  Users,
  Building,
  Target,
  Zap,
  TrendingUp,
  MapPin,
  Settings,
  Award
} from "lucide-react";
import type { User, Wallet } from "@shared/schema";

interface CivicLeaderDashboardProps {
  user: User;
  wallet: Wallet;
  supBalance: number;
  totalEntries: number;
}

export function CivicLeaderDashboard({ user, wallet, supBalance, totalEntries }: CivicLeaderDashboardProps) {
  const credibilityScore = user.credibilityScore || 0;

  return (
    <div className="space-y-6">
      {/* Executive Status */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Crown className="h-6 w-6 text-purple-600" />
              Civic Leader Executive Dashboard
            </CardTitle>
            <Badge className="bg-purple-600 text-white">
              Level 3 - Civic Leader
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            As a <strong>Civic Leader</strong>, you have full platform capabilities: manage large-scale 
            projects, coordinate cross-state initiatives, access funding mechanisms, and lead 
            Nigeria's civic transformation through the #13kCredibleChallenge network.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-purple-800">Network</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">847</div>
              <div className="text-xs text-gray-600">Leaders in your network</div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">Reach</span>
              </div>
              <div className="text-2xl font-bold text-green-600">23</div>
              <div className="text-xs text-gray-600">LGAs under influence</div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Building className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800">Projects</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-xs text-gray-600">Active funded projects</div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-orange-600" />
                <span className="font-medium text-orange-800">Impact</span>
              </div>
              <div className="text-2xl font-bold text-orange-600">47K</div>
              <div className="text-xs text-gray-600">Citizens directly impacted</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Executive Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-600" />
              Project Portfolio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full bg-blue-600 hover:bg-blue-700" data-testid="button-manage-projects">
              <Building className="h-4 w-4 mr-2" />
              Manage 12 Active Projects
            </Button>
            
            <div className="space-y-3">
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="text-sm font-medium text-blue-800">Featured Project</div>
                <div className="text-sm text-blue-700">"Rural Healthcare Access Initiative"</div>
                <div className="text-xs text-blue-600 mt-1">₦2.5M funded • 8 LGAs • 15,000+ beneficiaries</div>
                <Button size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700">
                  View Details
                </Button>
              </div>
            </div>
            
            <Button variant="outline" className="w-full" data-testid="button-create-project">
              <Target className="h-4 w-4 mr-2" />
              Create New Project
            </Button>
          </CardContent>
        </Card>

        {/* Funding & Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Funding Access
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="text-sm font-medium text-green-800 mb-2">Available Funding</div>
              <div className="text-2xl font-bold text-green-600">₦12.7M</div>
              <div className="text-xs text-green-600">From community pool + external partners</div>
            </div>
            
            <Button className="w-full bg-green-600 hover:bg-green-700" data-testid="button-request-funding">
              <DollarSign className="h-4 w-4 mr-2" />
              Request Project Funding
            </Button>
            
            <Button variant="outline" className="w-full" data-testid="button-funding-reports">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Funding Reports
            </Button>
          </CardContent>
        </Card>

        {/* Cross-State Coordination */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-purple-600" />
              National Coordination
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full bg-purple-600 hover:bg-purple-700" data-testid="button-coordinate-states">
              <Globe className="h-4 w-4 mr-2" />
              Multi-State Initiatives
            </Button>
            
            <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
              <div className="text-sm font-medium text-purple-800">Active Coordination</div>
              <div className="text-sm text-purple-700">"National Youth Leadership Summit"</div>
              <div className="text-xs text-purple-600 mt-1">12 states participating • 500+ delegates</div>
            </div>
            
            <Button variant="outline" className="w-full" data-testid="button-national-network">
              <Users className="h-4 w-4 mr-2" />
              Access National Network
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Analytics & Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-indigo-600" />
            Leadership Analytics & Impact Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                <div className="text-sm font-medium text-indigo-800 mb-3">Leadership Network Growth</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Direct Reports:</span>
                    <span className="font-medium">23 Trained Leaders</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Indirect Network:</span>
                    <span className="font-medium">847 Verified Leaders</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Candidates Influenced:</span>
                    <span className="font-medium">3,241 Citizens</span>
                  </div>
                </div>
              </div>
              
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700" data-testid="button-detailed-analytics">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Detailed Analytics
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <div className="text-sm font-medium text-orange-800 mb-3">Civic Impact Metrics</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Projects Funded:</span>
                    <span className="font-medium">₦47.3M Total Value</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Citizens Served:</span>
                    <span className="font-medium">47,382 People</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Success Rate:</span>
                    <span className="font-medium">94% Completion</span>
                  </div>
                </div>
              </div>
              
              <Button variant="outline" className="w-full" data-testid="button-impact-report">
                <Award className="h-4 w-4 mr-2" />
                Generate Impact Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            Executive Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Button variant="outline" className="flex flex-col h-20 gap-2" data-testid="button-emergency-response">
              <Zap className="h-5 w-5 text-red-500" />
              <span className="text-xs">Emergency Response</span>
            </Button>
            <Button variant="outline" className="flex flex-col h-20 gap-2" data-testid="button-approve-funding">
              <DollarSign className="h-5 w-5 text-green-500" />
              <span className="text-xs">Approve Funding</span>
            </Button>
            <Button variant="outline" className="flex flex-col h-20 gap-2" data-testid="button-verify-leaders">
              <Award className="h-5 w-5 text-blue-500" />
              <span className="text-xs">Verify Leaders</span>
            </Button>
            <Button variant="outline" className="flex flex-col h-20 gap-2" data-testid="button-platform-settings">
              <Settings className="h-5 w-5 text-gray-500" />
              <span className="text-xs">Platform Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Executive Performance */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{supBalance.toFixed(0)}</div>
            <div className="text-sm text-gray-600">SUP Balance</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">12</div>
            <div className="text-sm text-gray-600">Active Projects</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">847</div>
            <div className="text-sm text-gray-600">Network Size</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">47K</div>
            <div className="text-sm text-gray-600">Citizens Impacted</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">₦47M</div>
            <div className="text-sm text-gray-600">Funds Deployed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">94%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}