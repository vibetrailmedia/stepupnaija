import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  GraduationCap, 
  Users, 
  MapPin, 
  Award, 
  Target,
  BookOpen,
  Star,
  TrendingUp,
  UserCheck,
  Building,
  Calendar,
  Shield,
  UserPlus
} from "lucide-react";
import { Link, useLocation } from "wouter";

export default function CampusPage() {
  const [, setLocation] = useLocation();
  const [showProfileForm, setShowProfileForm] = useState(false);

  const handleCreateProfile = () => {
    setShowProfileForm(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-600 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6">
              <Badge className="bg-yellow-500 text-black px-4 py-2 text-sm font-semibold">
                🎓 CAMPUS COMMUNITIES
              </Badge>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Empowering <span className="text-yellow-400">Nigerian</span><br />
              Campus Leaders
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed opacity-90">
              Connecting top schools, student unions, NYSC camps, and campus leaders across Nigeria. 
              Building the next generation of credible civic leaders.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 text-lg font-semibold flex items-center gap-2"
                data-testid="button-create-campus-profile"
                onClick={handleCreateProfile}
              >
                <UserPlus className="h-5 w-5" />
                Create Campus Profile
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-green-700 px-8 py-3 text-lg font-semibold backdrop-blur-sm" 
                style={{backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white'}}
                data-testid="button-explore-programs"
                onClick={() => {window.scrollTo(0,0); setLocation('/training')}}
              >
                Explore Campus Programs
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Campus Categories */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Campus Communities</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Step Up Naija targets specific campus communities to maximize civic engagement impact
            </p>
          </div>

          <Tabs defaultValue="universities" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="universities" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Top Schools
              </TabsTrigger>
              <TabsTrigger value="unions" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Student Unions
              </TabsTrigger>
              <TabsTrigger value="leadership" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                Campus Leaders
              </TabsTrigger>
              <TabsTrigger value="nysc" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                NYSC Camps
              </TabsTrigger>
            </TabsList>

            <TabsContent value="universities" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="border-2 border-blue-200 hover:border-blue-400 transition-colors">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-700">
                      <Star className="h-5 w-5" />
                      Federal Universities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Nigeria's premier federal universities leading in academic excellence and research.
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Building className="h-4 w-4" />
                        University of Ibadan, UNILAG, ABU Zaria
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <UserCheck className="h-4 w-4" />
                        200,000+ Active Students
                      </div>
                    </div>
                    <Button className="w-full" data-testid="button-explore-federal" onClick={() => {window.scrollTo(0,0); setLocation('/top-schools?type=federal')}}>
                      Explore Federal Universities
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 border-green-200 hover:border-green-400 transition-colors">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-700">
                      <MapPin className="h-5 w-5" />
                      State Universities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Leading state universities driving local development and community impact.
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Building className="h-4 w-4" />
                        LASU, UNIZIK, EKSU, KASU
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <UserCheck className="h-4 w-4" />
                        150,000+ Active Students
                      </div>
                    </div>
                    <Button className="w-full" data-testid="button-explore-state" onClick={() => {window.scrollTo(0,0); setLocation('/top-schools?type=state')}}>
                      Explore State Universities
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 border-purple-200 hover:border-purple-400 transition-colors">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-700">
                      <Target className="h-5 w-5" />
                      Private Universities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Innovation-focused private institutions with strong industry connections.
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Building className="h-4 w-4" />
                        Covenant, BUK, Babcock, AUN
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <UserCheck className="h-4 w-4" />
                        80,000+ Active Students
                      </div>
                    </div>
                    <Button className="w-full" data-testid="button-explore-private" onClick={() => {window.scrollTo(0,0); setLocation('/top-schools?type=private')}}>
                      Explore Private Universities
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="unions" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-2 border-orange-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-700">
                      <Users className="h-5 w-5" />
                      Student Union Governments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Connect with student union executives and representatives across Nigerian campuses.
                    </p>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Union Presidents</span>
                        <Badge variant="secondary">450+ Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Executive Members</span>
                        <Badge variant="secondary">2,800+ Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Faculty Representatives</span>
                        <Badge variant="secondary">5,200+ Active</Badge>
                      </div>
                    </div>
                    <Button className="w-full" data-testid="button-join-unions" onClick={() => {window.scrollTo(0,0); setLocation('/network?type=unions')}}>
                      Join Union Network
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 border-red-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-700">
                      <BookOpen className="h-5 w-5" />
                      Faculty &amp; Department Reps
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Empowering faculty representatives and department leaders across all disciplines.
                    </p>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Faculty Presidents</span>
                        <Badge variant="secondary">1,200+ Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Department Reps</span>
                        <Badge variant="secondary">3,500+ Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Class Representatives</span>
                        <Badge variant="secondary">8,000+ Active</Badge>
                      </div>
                    </div>
                    <Button className="w-full" data-testid="button-join-faculty" onClick={() => {window.scrollTo(0,0); setLocation('/network?type=faculty')}}>
                      Connect with Faculty Leaders
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="leadership" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-2 border-yellow-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-yellow-700">
                      <Award className="h-5 w-5" />
                      School Presidents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Executive leadership development for student union presidents and vice presidents.
                    </p>
                    <div className="text-center mb-4">
                      <div className="text-2xl font-bold text-yellow-700">450+</div>
                      <div className="text-sm text-gray-500">Active Presidents</div>
                    </div>
                    <Button className="w-full" data-testid="button-president-portal" onClick={() => {window.scrollTo(0,0); setLocation('/leadership-portal?type=presidents')}}>
                      President Portal
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 border-indigo-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-indigo-700">
                      <TrendingUp className="h-5 w-5" />
                      Emerging Leaders
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Leadership development program for aspiring campus leaders and activists.
                    </p>
                    <div className="text-center mb-4">
                      <div className="text-2xl font-bold text-indigo-700">2,300+</div>
                      <div className="text-sm text-gray-500">Rising Leaders</div>
                    </div>
                    <Button className="w-full" data-testid="button-leadership-program" onClick={() => {window.scrollTo(0,0); setLocation('/training?program=leadership')}}>
                      Join Leadership Program
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 border-pink-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-pink-700">
                      <Users className="h-5 w-5" />
                      Campus Influencers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Engaging campus influencers and social impact leaders across Nigeria.
                    </p>
                    <div className="text-center mb-4">
                      <div className="text-2xl font-bold text-pink-700">1,800+</div>
                      <div className="text-sm text-gray-500">Active Influencers</div>
                    </div>
                    <Button className="w-full" data-testid="button-influencer-network" onClick={() => {window.scrollTo(0,0); setLocation('/network?type=influencers')}}>
                      Influencer Network
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="nysc" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-2 border-teal-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-teal-700">
                      <Shield className="h-5 w-5" />
                      NYSC Orientation Camps
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Civic engagement programs designed specifically for corps members during orientation.
                    </p>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Active Camps</span>
                        <Badge variant="secondary">37 Camps</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Corps Members</span>
                        <Badge variant="secondary">350,000+ Annual</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Camp Governors</span>
                        <Badge variant="secondary">180+ Leaders</Badge>
                      </div>
                    </div>
                    <Button className="w-full" data-testid="button-nysc-orientation" onClick={() => {window.scrollTo(0,0); setLocation('/nysc-camps?type=orientation')}}>
                      Join NYSC Program
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 border-cyan-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-cyan-700">
                      <Calendar className="h-5 w-5" />
                      CDS &amp; Post-Service
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Continued civic engagement for corps members during CDS and post-service years.
                    </p>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">CDS Groups</span>
                        <Badge variant="secondary">2,500+ Groups</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Active Corps Members</span>
                        <Badge variant="secondary">280,000+</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Post-Service Alumni</span>
                        <Badge variant="secondary">150,000+</Badge>
                      </div>
                    </div>
                    <Button className="w-full" data-testid="button-cds-program" onClick={() => {window.scrollTo(0,0); setLocation('/nysc-camps?type=cds')}}>
                      CDS &amp; Alumni Network
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to Lead Your Campus?</h3>
          <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
            Join thousands of Nigerian campus leaders building credible civic engagement across all 774 LGAs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold flex items-center gap-2" 
              data-testid="button-create-profile-cta"
              onClick={handleCreateProfile}
            >
              <UserPlus className="h-5 w-5" />
              Create Your Campus Profile
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-green-600 text-green-700 hover:bg-green-50 px-8 py-3 text-lg font-semibold" 
              data-testid="button-register-institution"
              onClick={() => {window.scrollTo(0,0); setLocation('/nominate')}}
            >
              Register Your Institution
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Creation Modal */}
      {showProfileForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Create Campus Profile</h2>
            <p className="mb-4">Campus profile creation is coming soon! Join the waitlist to be notified when it's available.</p>
            <div className="flex gap-2">
              <Button 
                className="flex-1" 
                onClick={() => {
                  setShowProfileForm(false);
                  setLocation('/nominate');
                }}
              >
                Join Waitlist
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowProfileForm(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}