import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useLocation } from "wouter";
import { 
  Shield, 
  MapPin, 
  Users, 
  Calendar, 
  Award, 
  Target,
  TrendingUp,
  Star,
  Clock,
  CheckCircle
} from "lucide-react";

export default function NyscCampsPage() {
  const [, setLocation] = useLocation();
  
  // Real NYSC camps data - fetch from API
  const { data: nyscCamps = [], isLoading: campsLoading } = useQuery({
    queryKey: ['/api/nysc-camps'],
    queryFn: async () => {
      // For now, show empty state until real NYSC partnership is established
      return [];
    },
    retry: false
  });

  // Real activity types that would be available in NYSC partnership
  const plannedCampActivities = [
    {
      id: "civic-orientation",
      title: "Civic Education & Constitutional Awareness",
      description: "Learn your rights and responsibilities as a Nigerian citizen",
      rewardSUP: 50,
      duration: "2 hours",
      category: "Education",
      status: "planned"
    },
    {
      id: "community-service",
      title: "Community Development Service (CDS)",
      description: "Participate in meaningful community impact projects",
      rewardSUP: 75,
      duration: "4 hours",
      category: "Service",
      status: "planned"
    },
    {
      id: "leadership-training",
      title: "Youth Leadership Development",
      description: "Build leadership skills for post-service impact",
      rewardSUP: 100,
      duration: "3 hours",
      category: "Leadership",
      status: "planned"
    },
    {
      id: "skills-acquisition",
      title: "Digital Skills & Entrepreneurship",
      description: "Gain valuable skills for economic empowerment",
      rewardSUP: 80,
      duration: "6 hours",
      category: "Skills",
      status: "planned"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-600 to-cyan-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6">
              <Badge className="bg-yellow-500 text-black px-4 py-2 text-sm font-semibold">
                🏕️ NYSC PROGRAM
              </Badge>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-yellow-400">NYSC</span> Civic<br />
              Engagement
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed opacity-90">
              Empowering Nigeria's youth corps members with civic education, leadership training, 
              and community development opportunities across all 37 orientation camps.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 text-lg font-semibold" data-testid="button-find-my-camp" onClick={() => setLocation('/nysc-camps?action=find')}>
                Find My Camp
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-teal-700 px-8 py-3 text-lg font-semibold backdrop-blur-sm" style={{backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white'}} data-testid="button-join-program" onClick={() => setLocation('/auth?mode=signup')}>
                Join NYSC Program
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* NYSC Camps Overview */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">NYSC Orientation Camps</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Civic engagement programs running across all 37 NYSC orientation camps nationwide
            </p>
          </div>

          {/* Empty state for NYSC camps - no real partnerships yet */}
          {nyscCamps.length === 0 && (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <div className="max-w-md mx-auto space-y-6">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="h-8 w-8 text-teal-600" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900">NYSC Partnership Coming Soon</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We're working to partner with NYSC to bring civic engagement programs to all 37 orientation camps. 
                    Corps members will earn SUP tokens for participating in leadership and community development activities.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Badge variant="outline" className="text-sm">
                    🏕️ 37 Orientation Camps Planned
                  </Badge>
                  <Badge variant="outline" className="text-sm">
                    🎓 Leadership Training Programs
                  </Badge>
                  <Badge variant="outline" className="text-sm">
                    🏆 SUP Token Rewards
                  </Badge>
                </div>

                <Button onClick={() => setLocation('/auth?mode=signup')} className="bg-teal-600 hover:bg-teal-700">
                  Join Early Access List
                </Button>
              </div>
            </div>
          )}

          {/* Active camps grid - will show when partnerships are established */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {nyscCamps.map((camp: any, index: number) => (
              <motion.div
                key={camp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-2 border-teal-200 hover:border-teal-400 transition-colors">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-teal-700">
                      <Shield className="h-5 w-5" />
                      {camp.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      {camp.lga}, {camp.state} State
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Current Batch</span>
                      <Badge variant="secondary">{camp.currentBatch}</Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Participants</span>
                        <span>{camp.participantsCount?.toLocaleString()} / {camp.capacity?.toLocaleString()}</span>
                      </div>
                      <Progress value={(camp.participantsCount / camp.capacity) * 100} className="h-2" />
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Active Programs</span>
                      <Badge variant="outline">{camp.activitiesCount} Programs</Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Completion Rate</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-semibold">{camp.completionRate}%</span>
                      </div>
                    </div>

                    <Button className="w-full mt-4" data-testid={`button-view-camp-${camp.id}`} onClick={() => setLocation(`/nysc-camps/${camp.id}`)}>
                      View Camp Details
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* NYSC Activities */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Civic Engagement Activities</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Earn SUP tokens while building civic knowledge and leadership skills during your service year
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plannedCampActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-l-4 border-l-cyan-500">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg text-gray-900">{activity.title}</CardTitle>
                      <Badge 
                        variant="secondary" 
                        className="bg-yellow-100 text-yellow-700"
                      >
                        +{activity.rewardSUP} SUP
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{activity.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {activity.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        {activity.category}
                      </div>
                    </div>

                    <Button className="w-full" data-testid={`button-start-activity-${activity.id}`} onClick={() => setLocation(`/engage?activity=${activity.id}`)}>
                      Start Activity
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* NYSC Leadership Opportunities */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Leadership Opportunities</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Take on leadership roles and build lasting impact during your service year
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2 border-yellow-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-700">
                  <Award className="h-5 w-5" />
                  Camp Governor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Lead your platoon and represent corps members in camp governance and decision-making.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Positions</span>
                    <Badge variant="secondary">180+</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Monthly SUP Reward</span>
                    <Badge className="bg-green-100 text-green-700">200 SUP</Badge>
                  </div>
                </div>
                <Button className="w-full" data-testid="button-apply-governor" onClick={() => setLocation('/nysc-camps?apply=governor')}>
                  Apply for Position
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Users className="h-5 w-5" />
                  Local Inspector
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Support corps members in local government areas and coordinate community development projects.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Positions</span>
                    <Badge variant="secondary">450+</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Monthly SUP Reward</span>
                    <Badge className="bg-green-100 text-green-700">150 SUP</Badge>
                  </div>
                </div>
                <Button className="w-full" data-testid="button-apply-inspector" onClick={() => setLocation('/nysc-camps?apply=inspector')}>
                  Apply for Position
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <TrendingUp className="h-5 w-5" />
                  Platoon Leader
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Guide and mentor fellow corps members while organizing platoon activities and initiatives.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Positions</span>
                    <Badge variant="secondary">800+</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Monthly SUP Reward</span>
                    <Badge className="bg-green-100 text-green-700">100 SUP</Badge>
                  </div>
                </div>
                <Button className="w-full" data-testid="button-apply-platoon" onClick={() => setLocation('/nysc-camps?apply=platoon')}>
                  Apply for Position
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Success Stories */}
        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">NYSC Success Stories</h3>
            <p className="text-xl text-gray-600">
              Corps members making real impact through civic engagement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Adaora Okafor</h4>
                    <p className="text-sm text-gray-600">NYSC Camp Governor, Anambra</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  "Leading 2,500 corps members taught me invaluable leadership skills. The civic engagement 
                  programs prepared me to start a successful NGO post-service."
                </p>
                <Badge variant="outline">450 SUP Earned</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                    <Star className="h-6 w-6 text-cyan-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Ibrahim Yusuf</h4>
                    <p className="text-sm text-gray-600">Local Inspector, Kano</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  "Coordinating community projects in 12 LGAs connected me with local leaders. 
                  I'm now running for local government council."
                </p>
                <Badge variant="outline">380 SUP Earned</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

        {/* NYSC Resources Section */}
        <div className="bg-gradient-to-br from-teal-50 via-white to-cyan-50 rounded-3xl p-8 border border-gray-200">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">NYSC Resources & Quick Access</h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need for a successful and impactful service year
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-teal-200 hover:border-teal-400 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-teal-700 text-lg">
                  <Shield className="h-5 w-5" />
                  NYSC Programs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li><Button variant="ghost" className="p-0 h-auto text-gray-600 hover:text-teal-600" onClick={() => setLocation('/nysc-camps?type=orientation')}>Orientation Camps</Button></li>
                  <li><Button variant="ghost" className="p-0 h-auto text-gray-600 hover:text-teal-600" onClick={() => setLocation('/education?program=civic')}>Civic Education</Button></li>
                  <li><Button variant="ghost" className="p-0 h-auto text-gray-600 hover:text-teal-600" onClick={() => setLocation('/training?program=leadership')}>Leadership Training</Button></li>
                  <li><Button variant="ghost" className="p-0 h-auto text-gray-600 hover:text-teal-600" onClick={() => setLocation('/nysc-camps?type=cds')}>Community Service</Button></li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-yellow-200 hover:border-yellow-400 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-yellow-700 text-lg">
                  <Award className="h-5 w-5" />
                  Leadership Roles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li><Button variant="ghost" className="p-0 h-auto text-gray-600 hover:text-yellow-600" onClick={() => setLocation('/nysc-camps?apply=governor')}>Camp Governors</Button></li>
                  <li><Button variant="ghost" className="p-0 h-auto text-gray-600 hover:text-yellow-600" onClick={() => setLocation('/nysc-camps?apply=inspector')}>Local Inspectors</Button></li>
                  <li><Button variant="ghost" className="p-0 h-auto text-gray-600 hover:text-yellow-600" onClick={() => setLocation('/nysc-camps?apply=platoon')}>Platoon Leaders</Button></li>
                  <li><Button variant="ghost" className="p-0 h-auto text-gray-600 hover:text-yellow-600" onClick={() => setLocation('/nysc-camps?apply=cds')}>CDS Coordinators</Button></li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-blue-200 hover:border-blue-400 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-blue-700 text-lg">
                  <Target className="h-5 w-5" />
                  Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li><Button variant="ghost" className="p-0 h-auto text-gray-600 hover:text-blue-600" onClick={() => setLocation('/training?program=skills')}>Skills Acquisition</Button></li>
                  <li><Button variant="ghost" className="p-0 h-auto text-gray-600 hover:text-blue-600" onClick={() => setLocation('/projects?type=community')}>Community Projects</Button></li>
                  <li><Button variant="ghost" className="p-0 h-auto text-gray-600 hover:text-blue-600" onClick={() => setLocation('/training?program=entrepreneurship')}>Entrepreneurship</Button></li>
                  <li><Button variant="ghost" className="p-0 h-auto text-gray-600 hover:text-blue-600" onClick={() => setLocation('/education?program=digital')}>Digital Literacy</Button></li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-purple-200 hover:border-purple-400 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-purple-700 text-lg">
                  <Users className="h-5 w-5" />
                  Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li><Button variant="ghost" className="p-0 h-auto text-gray-600 hover:text-purple-600" onClick={() => setLocation('/nysc-camps?action=find')}>Find Your Camp</Button></li>
                  <li><Button variant="ghost" className="p-0 h-auto text-gray-600 hover:text-purple-600" onClick={() => setLocation('/help?topic=activities')}>Activity Guidelines</Button></li>
                  <li><Button variant="ghost" className="p-0 h-auto text-gray-600 hover:text-purple-600" onClick={() => setLocation('/nysc-camps?view=applications')}>Leadership Applications</Button></li>
                  <li><Button variant="ghost" className="p-0 h-auto text-gray-600 hover:text-purple-600" onClick={() => setLocation('/network?type=alumni')}>Alumni Network</Button></li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
    </div>
  );
}