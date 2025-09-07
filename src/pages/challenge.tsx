import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { NigeriaMap } from "@/components/NigeriaMap";
import { Users, Target, Award, MapPin, CheckCircle, TrendingUp, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

interface ChallengeStats {
  totalCandidates: number;
  candidatesNominated: number;
  candidatesInVetting: number;
  candidatesShortlisted: number;
  candidatesInTraining: number;
  candidatesDeployed: number;
  lgasCovered: number;
  statesCovered: number;
  progressToGoal: number;
  lastUpdated: string;
}

export default function Challenge() {
  const [, setLocation] = useLocation();
  
  // Fetch real-time challenge statistics
  const { data: stats, isLoading } = useQuery<ChallengeStats>({
    queryKey: ['/api/challenge/stats'],
    staleTime: 3 * 60 * 1000, // 3 minutes - challenge stats don't change frequently
    refetchInterval: 10 * 60 * 1000, // Refresh every 10 minutes instead of 30 seconds
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation is provided by App.tsx - removed duplicate header */}

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-600 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6">
              <Badge className="bg-yellow-500 text-black px-4 py-2 text-sm font-semibold">
                🎯 FLAGSHIP INITIATIVE
              </Badge>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight">
              The <span className="text-yellow-400">#13k</span><br />
              Credible Challenge
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed opacity-90">
              Empowering millions of Nigerians to democratically nominate, vote, and select 13,000 credible leaders across all 774 Local Government Areas. 
              <span className="block mt-2">The largest democratic leadership selection process in Nigeria's history.</span>
            </p>

            {/* HIGHLY VISIBLE WHITE CALL-TO-ACTION CONTAINER - Mobile Optimized */}
            <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto border-2 border-white shadow-2xl mb-12">
              <div className="text-center">
                <Badge className="bg-green-600 text-white mb-4 px-4 sm:px-6 py-2 text-sm font-bold">
                  🎯 JOIN THE MOVEMENT
                </Badge>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  Ready to Build Nigeria's Future?
                </h3>
                <p className="text-gray-700 mb-6 text-base sm:text-lg leading-relaxed">
                  Join millions of Nigerians in democratically selecting credible leaders. 
                  <span className="block mt-2">Nominate credible candidates, vote for your preferred leaders, and help build Nigeria's future.</span>
                </p>
                
                <div className="flex flex-col gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black px-8 py-4 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                    onClick={() => {
                      setLocation('/nominate');
                      setTimeout(() => window.scrollTo(0, 0), 100);
                    }}
                    data-testid="button-nominate"
                  >
                    🇳🇬 Nominate a Credible Nigerian
                  </Button>
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                    onClick={() => {
                      setLocation('/nominate');
                      setTimeout(() => window.scrollTo(0, 0), 100);
                    }}
                    data-testid="button-apply"
                  >
                    ✋ Apply to Join Challenge
                  </Button>
                </div>
              </div>
            </div>

            {/* Progress Overview */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-2xl mx-auto">
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div>
                      <div className="h-8 bg-white/20 rounded mb-2"></div>
                      <div className="h-4 bg-white/20 rounded"></div>
                    </div>
                    <div>
                      <div className="h-8 bg-white/20 rounded mb-2"></div>
                      <div className="h-4 bg-white/20 rounded"></div>
                    </div>
                    <div>
                      <div className="h-8 bg-white/20 rounded mb-2"></div>
                      <div className="h-4 bg-white/20 rounded"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div>
                      <div className="text-3xl font-bold text-yellow-400">
                        {stats?.totalCandidates || 0}
                      </div>
                      <div className="text-sm opacity-90">Candidates Identified</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-yellow-400">
                        {stats?.lgasCovered || 0}
                      </div>
                      <div className="text-sm opacity-90">LGAs Covered</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-yellow-400">
                        {stats?.candidatesDeployed || 0}
                      </div>
                      <div className="text-sm opacity-90">Leaders Deployed</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress to 13,000</span>
                      <span>{stats?.progressToGoal || 0}%</span>
                    </div>
                    <Progress value={stats?.progressToGoal || 0} className="h-2" />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* What Makes a Credible Nigerian - Mobile Optimized */}
      <div className="py-12 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What Makes a Credible Nigerian?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We identify leaders based on three core criteria that define true credibility
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <Card className="border-green-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center pb-3">
                <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-xl sm:text-2xl text-green-700 font-bold">✅ Integrity</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  Proven honesty with no record of corruption or malpractice. 
                  <span className="block mt-2">A track record of ethical behavior in personal and professional life.</span>
                </p>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center pb-3">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Target className="w-8 h-8 text-yellow-600" />
                </div>
                <CardTitle className="text-xl sm:text-2xl text-yellow-700 font-bold">🎯 Competence</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  Demonstrated ability through professional excellence or community service. 
                  <span className="block mt-2">Skills and knowledge to deliver results in leadership roles.</span>
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center pb-3">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl sm:text-2xl text-blue-700 font-bold">🤝 Commitment</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  Active involvement in civic or community life, not just career ambition. 
                  <span className="block mt-2">Genuine desire to serve and improve Nigeria.</span>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Geographic Coverage Map - Mobile Optimized */}
      <div className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              National Coverage
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              See how the #13kCredibleChallenge is spreading across Nigeria's 774 LGAs
            </p>
          </div>
          
          <NigeriaMap className="mb-8" />
          
          {/* Quick Stats Grid - Mobile Optimized */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-8 sm:mt-12">
            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 sm:p-6">
                <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">
                  {stats?.statesCovered || 0}/37
                </div>
                <div className="text-xs sm:text-sm text-gray-600 leading-tight">States with Candidates</div>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 sm:p-6">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">
                  {stats?.candidatesInVetting || 0}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 leading-tight">In Vetting Process</div>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 sm:p-6">
                <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">
                  {stats?.candidatesInTraining || 0}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 leading-tight">In Training</div>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 sm:p-6">
                <div className="text-2xl sm:text-3xl font-bold text-emerald-600 mb-2">
                  {((stats?.lgasCovered || 0) / 774 * 100).toFixed(1)}%
                </div>
                <div className="text-xs sm:text-sm text-gray-600 leading-tight">LGA Coverage</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* How It Works - Mobile Optimized */}
      <div className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              The Pipeline to Leadership
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              A structured, transparent process that transforms credible Nigerians into effective leaders
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="relative bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="text-center">
                <div className="w-14 h-14 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4 shadow-lg">
                  1
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">📝 Nomination & Application</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Citizens apply or are nominated online/offline. 
                  <span className="block mt-2">Open to all Nigerians with credibility criteria.</span>
                </p>
              </div>
            </div>

            <div className="relative bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="text-center">
                <div className="w-14 h-14 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4 shadow-lg">
                  2
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">🔍 Screening & Vetting</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Background checks, community endorsements, and peer review. 
                  <span className="block mt-2">Credibility scoring based on our three criteria.</span>
                </p>
              </div>
            </div>

            <div className="relative bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="text-center">
                <div className="w-14 h-14 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4 shadow-lg">
                  3
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">🗳️ Public Selection</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Nigeria watches, debates, and votes using SUP tokens. 
                  <span className="block mt-2">Transparent, community-driven selection process.</span>
                </p>
              </div>
            </div>

            <div className="relative bg-yellow-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="text-center">
                <div className="w-14 h-14 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4 shadow-lg">
                  4
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">📚 Training & Mentorship</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Civic education, governance training, and organizing skills. 
                  <span className="block mt-2">Comprehensive leadership development program.</span>
                </p>
              </div>
            </div>

            <div className="relative bg-yellow-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="text-center">
                <div className="w-14 h-14 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4 shadow-lg">
                  5
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">🚀 Deployment</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Run for office, serve as local civic leaders, or lead accountability projects in their communities.
                </p>
              </div>
            </div>

            <div className="relative bg-yellow-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="text-center">
                <div className="w-14 h-14 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4 shadow-lg">
                  6
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">📊 Accountability</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Community accountability cells track performance year-round. 
                  <span className="block mt-2">Continuous monitoring and support.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why 13,000? - Mobile Optimized */}
      <div className="py-12 sm:py-20 bg-gradient-to-br from-green-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Why 13,000 Leaders?
              </h2>
              <div className="space-y-4 sm:space-y-6 text-base sm:text-lg text-gray-600 leading-relaxed">
                <p>
                  Every Local Government Area has councillors, chairmen, state representatives, ward leaders, 
                  and local organizers. Building a pool of 13,000 vetted leaders ensures critical mass coverage.
                </p>
                <p className="bg-white p-4 rounded-lg border-l-4 border-green-600">
                  <strong className="text-gray-900 text-lg">774 LGAs × multiple roles each = 13,000 leaders</strong>
                </p>
                <p>
                  It's about coverage: one credible Nigerian at the ward/LGA level has the power to shift 
                  local governance and accountability across the entire nation.
                </p>
              </div>
              
              <div className="mt-8 space-y-4">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-gray-700">774 LGAs across 36 states + FCT</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-gray-700">Multiple leadership roles per LGA</span>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-gray-700">Bottom-up governance transformation</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Coverage Progress
              </h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>States Covered</span>
                    <span>12/37</span>
                  </div>
                  <Progress value={32} className="h-3" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>LGAs with Candidates</span>
                    <span>89/774</span>
                  </div>
                  <Progress value={11} className="h-3" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Total Progress</span>
                    <span>247/13,000</span>
                  </div>
                  <Progress value={1.9} className="h-3" />
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 text-center space-y-3">
                <Button 
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white w-full font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => {
                    setLocation('/candidates');
                    setTimeout(() => window.scrollTo(0, 0), 100);
                  }}
                  data-testid="button-view-candidates"
                >
                  👥 View All Candidates
                </Button>
                <Button 
                  variant="outline"
                  className="w-full border-green-600 text-green-600 hover:bg-green-50 font-semibold"
                  data-testid="button-track-progress"
                  onClick={() => {
                    setLocation('/analytics');
                    setTimeout(() => window.scrollTo(0, 0), 100);
                  }}
                >
                  📍 Track Progress in Your State
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Award className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-6">
            Join the Leadership Revolution
          </h2>
          <p className="text-xl mb-8 opacity-90 leading-relaxed">
            Help us identify, train, and deploy 13,000 credible leaders who will transform 
            Nigeria from the ground up. Every nomination, vote, and endorsement counts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 text-lg font-semibold"
              onClick={() => {window.scrollTo(0,0); window.location.href = '/nominate'}}
              data-testid="button-nominate-footer"
            >
              Nominate Someone Today
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black px-8 py-4 text-lg font-semibold"
              data-testid="button-learn-more-footer"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}