import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AvatarCard from "@/components/AvatarCard";
import IntroductionVideo from "@/components/IntroductionVideo";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import tariAvatarImage from "@/assets/tari-avatar.webp";
import kamsiAvatarImage from "@/assets/kamsi-avatar.webp";
import { 
  ArrowLeft, 
  MessageSquare, 
  BookOpen, 
  Users, 
  Shield, 
  Heart,
  Megaphone,
  Target,
  Sparkles,
  Globe,
  Play,
  Award,
  Lightbulb,
  CheckCircle,
  Star
} from "lucide-react";

export default function MeetYourGuidesPage() {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/")}
            className="mb-6 hover:bg-green-100"
            data-testid="button-back-to-home"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-green-300 shadow-xl mr-4">
                  <img 
                    src={kamsiAvatarImage}
                    alt="Kamsi"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                  <Heart className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-blue-300 shadow-xl">
                  <img 
                    src={tariAvatarImage}
                    alt="Tari"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-2 -right-2 bg-blue-500 rounded-full p-1">
                  <Shield className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-black text-gray-900 mb-4 tracking-tight">
              Meet Your 
              <span className="block bg-gradient-to-r from-green-600 via-blue-600 to-yellow-600 bg-clip-text text-transparent">
                Civic Guides
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-6 max-w-3xl mx-auto leading-relaxed">
              Your AI-powered companions on Nigeria's most ambitious civic transformation journey
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <Badge className="bg-green-100 text-green-800 text-base px-4 py-2">
                <Star className="w-4 h-4 mr-1" />
                Official Step Up Naija Ambassadors
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 text-base px-4 py-2">
                <Award className="w-4 h-4 mr-1" />
                AI-Powered Civic Education
              </Badge>
            </div>
            <div className="text-center text-gray-600 text-lg">
              Meet the two personalities that will guide 13,000+ Nigerians toward credible leadership
            </div>
          </div>
        </div>

        {/* Video Introduction */}
        <Card className="mb-12 overflow-hidden shadow-2xl border-0">
          <div className="bg-gradient-to-r from-green-600 via-blue-600 to-yellow-600 p-1">
            <CardContent className="bg-white p-8 rounded-lg">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
                  <Play className="w-8 h-8 mr-3 text-green-600" />
                  Your Personal Civic Engagement Team
                </h2>
                <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  Meet Tari and Kamsi - your AI-powered civic guides designed specifically for Nigeria's leadership transformation. 
                  These aren't just avatars; they're your personal mentors with distinct personalities, expertise areas, and communication styles 
                  crafted to make civic engagement accessible, engaging, and impactful for every Nigerian.
                </p>
              </div>
              <IntroductionVideo showUploadOption={false} />
            </CardContent>
          </div>
        </Card>

        {/* Interactive Character Profiles */}
        <Tabs defaultValue="tari" className="w-full mb-12">
          <TabsList className="grid w-full grid-cols-2 mb-8 h-16">
            <TabsTrigger value="tari" className="text-lg font-semibold py-4 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-current mr-3">
                  <img src={tariAvatarImage} alt="Tari" className="w-full h-full object-cover" />
                </div>
                <div className="text-left">
                  <div className="font-bold">TARI</div>
                  <div className="text-xs opacity-75">Authority Guide</div>
                </div>
              </div>
            </TabsTrigger>
            <TabsTrigger value="kamsi" className="text-lg font-semibold py-4 data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-current mr-3">
                  <img src={kamsiAvatarImage} alt="Kamsi" className="w-full h-full object-cover" />
                </div>
                <div className="text-left">
                  <div className="font-bold">KAMSI</div>
                  <div className="text-xs opacity-75">Community Guide</div>
                </div>
              </div>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="tari" className="space-y-6">
            {/* Tari Detailed Profile */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Overview */}
              <Card className="lg:col-span-2 overflow-hidden shadow-xl">
                <CardHeader className="bg-gradient-to-br from-blue-700 via-blue-600 to-green-600 text-white p-8">
                  <CardTitle className="flex items-center text-3xl">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-xl mr-6">
                      <img 
                        src={tariAvatarImage}
                        alt="Tari - Civic Authority Guide"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black tracking-tight">TARI</h3>
                      <p className="text-blue-100 font-medium text-lg">Your Civic Authority Guide</p>
                      <div className="flex items-center mt-2">
                        <Shield className="w-5 h-5 mr-2" />
                        <span className="text-sm font-semibold">Specializes in Government & Policy</span>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-8">
                    {/* Personality & Approach */}
                    <div>
                      <h4 className="font-bold text-xl mb-4 flex items-center text-blue-800">
                        <Lightbulb className="w-6 h-6 mr-3" />
                        Personality & Approach
                      </h4>
                      <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-500">
                        <p className="text-gray-800 text-lg leading-relaxed mb-4">
                          <strong className="text-blue-700">Calm, grounded, and principled.</strong> Tari embodies the wisdom of institutional knowledge 
                          with the clarity of a seasoned civic educator. His approach is methodical, evidence-based, and designed to build 
                          deep structural understanding of Nigeria's democratic systems.
                        </p>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="flex items-center text-blue-700">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            <span className="font-semibold">Analytical Thinking</span>
                          </div>
                          <div className="flex items-center text-blue-700">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            <span className="font-semibold">Constitutional Expert</span>
                          </div>
                          <div className="flex items-center text-blue-700">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            <span className="font-semibold">Policy Breakdown</span>
                          </div>
                          <div className="flex items-center text-blue-700">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            <span className="font-semibold">Institutional Focus</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* When You'll Meet Tari */}
                    <div>
                      <h4 className="font-bold text-xl mb-4 flex items-center text-blue-800">
                        <Target className="w-6 h-6 mr-3" />
                        When You'll Work with Tari
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white border border-blue-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex items-center mb-2">
                            <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                            <span className="font-semibold text-blue-800">System Explanations</span>
                          </div>
                          <p className="text-gray-600 text-sm">Complex policy breakdowns and government structure tutorials</p>
                        </div>
                        <div className="bg-white border border-blue-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex items-center mb-2">
                            <Shield className="w-5 h-5 mr-2 text-blue-600" />
                            <span className="font-semibold text-blue-800">Civic Processes</span>
                          </div>
                          <p className="text-gray-600 text-sm">Electoral systems, voting procedures, and democratic frameworks</p>
                        </div>
                        <div className="bg-white border border-blue-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex items-center mb-2">
                            <Globe className="w-5 h-5 mr-2 text-blue-600" />
                            <span className="font-semibold text-blue-800">Constitutional Law</span>
                          </div>
                          <p className="text-gray-600 text-sm">Legal frameworks and constitutional provisions</p>
                        </div>
                        <div className="bg-white border border-blue-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex items-center mb-2">
                            <Award className="w-5 h-5 mr-2 text-blue-600" />
                            <span className="font-semibold text-blue-800">Leadership Training</span>
                          </div>
                          <p className="text-gray-600 text-sm">Formal civic education and credible leadership development</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sample Interaction */}
              <div className="space-y-6">
                <Card className="shadow-xl">
                  <CardHeader className="bg-blue-600 text-white">
                    <CardTitle className="text-lg flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2" />
                      Sample Tari Message
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <AvatarCard 
                      character="tari"
                      variant="explanation"
                      message="Understanding Nigeria's electoral process requires grasping three key institutions: INEC manages elections, the judiciary resolves disputes, and civil society ensures transparency. Each plays a crucial role in maintaining democratic integrity across our 774 Local Government Areas."
                    />
                  </CardContent>
                </Card>
                
                <Card className="shadow-xl">
                  <CardHeader className="bg-blue-100">
                    <CardTitle className="text-lg text-blue-800 flex items-center">
                      <Star className="w-5 h-5 mr-2" />
                      Tari's Expertise
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span>Nigerian Constitution</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span>Electoral Processes</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span>Government Structure</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span>Policy Analysis</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span>Civic Rights & Duties</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="kamsi" className="space-y-6">

            {/* Kamsi Detailed Profile */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Overview */}
              <Card className="lg:col-span-2 overflow-hidden shadow-xl">
                <CardHeader className="bg-gradient-to-br from-green-700 via-green-600 to-yellow-600 text-white p-8">
                  <CardTitle className="flex items-center text-3xl">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-xl mr-6">
                      <img 
                        src={kamsiAvatarImage}
                        alt="Kamsi - Community Connection Guide"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black tracking-tight">KAMSI</h3>
                      <p className="text-green-100 font-medium text-lg">Your Community Connection Guide</p>
                      <div className="flex items-center mt-2">
                        <Heart className="w-5 h-5 mr-2" />
                        <span className="text-sm font-semibold">Specializes in Community & Engagement</span>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-8">
                    {/* Personality & Approach */}
                    <div>
                      <h4 className="font-bold text-xl mb-4 flex items-center text-green-800">
                        <Sparkles className="w-6 h-6 mr-3" />
                        Personality & Approach
                      </h4>
                      <div className="bg-green-50 p-6 rounded-xl border-l-4 border-green-500">
                        <p className="text-gray-800 text-lg leading-relaxed mb-4">
                          <strong className="text-green-700">Clear, warm, intelligent, and engaging.</strong> Kamsi excels at emotional framing 
                          and human connection. She transforms civic engagement from abstract concepts into personal, achievable actions 
                          that resonate with every Nigerian's desire to create positive change in their communities.
                        </p>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="flex items-center text-green-700">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            <span className="font-semibold">Empathetic Communication</span>
                          </div>
                          <div className="flex items-center text-green-700">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            <span className="font-semibold">Community Building</span>
                          </div>
                          <div className="flex items-center text-green-700">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            <span className="font-semibold">Motivation & Inspiration</span>
                          </div>
                          <div className="flex items-center text-green-700">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            <span className="font-semibold">Action-Oriented</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* When You'll Meet Kamsi */}
                    <div>
                      <h4 className="font-bold text-xl mb-4 flex items-center text-green-800">
                        <Heart className="w-6 h-6 mr-3" />
                        When You'll Work with Kamsi
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white border border-green-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex items-center mb-2">
                            <Users className="w-5 h-5 mr-2 text-green-600" />
                            <span className="font-semibold text-green-800">Community Stories</span>
                          </div>
                          <p className="text-gray-600 text-sm">Volunteer onboarding and inspiring community impact tales</p>
                        </div>
                        <div className="bg-white border border-green-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex items-center mb-2">
                            <Megaphone className="w-5 h-5 mr-2 text-green-600" />
                            <span className="font-semibold text-green-800">Motivation & Support</span>
                          </div>
                          <p className="text-gray-600 text-sm">Encouragement during challenges and celebrating your wins</p>
                        </div>
                        <div className="bg-white border border-green-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex items-center mb-2">
                            <Sparkles className="w-5 h-5 mr-2 text-green-600" />
                            <span className="font-semibold text-green-800">Impact Stories</span>
                          </div>
                          <p className="text-gray-600 text-sm">Personal success stories and community transformation examples</p>
                        </div>
                        <div className="bg-white border border-green-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex items-center mb-2">
                            <Heart className="w-5 h-5 mr-2 text-green-600" />
                            <span className="font-semibold text-green-800">Network Building</span>
                          </div>
                          <p className="text-gray-600 text-sm">Connecting you with like-minded Nigerians and community leaders</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sample Interaction */}
              <div className="space-y-6">
                <Card className="shadow-xl">
                  <CardHeader className="bg-green-600 text-white">
                    <CardTitle className="text-lg flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2" />
                      Sample Kamsi Message
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <AvatarCard 
                      character="kamsi"
                      variant="encouragement"
                      message="Every small action you take creates ripples of change! When you volunteer for a community project or engage with local leaders, you're not just helping today—you're building the Nigeria we all dream of. Your voice matters, and your community needs you!"
                    />
                  </CardContent>
                </Card>
                
                <Card className="shadow-xl">
                  <CardHeader className="bg-green-100">
                    <CardTitle className="text-lg text-green-800 flex items-center">
                      <Star className="w-5 h-5 mr-2" />
                      Kamsi's Expertise
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span>Community Organizing</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span>Volunteer Engagement</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span>Personal Development</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span>Grassroots Movements</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span>Social Impact Stories</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Dynamic Collaboration Section */}
        <Card className="mt-12 overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 p-1">
            <div className="bg-white rounded-lg">
              <CardHeader className="text-center py-8">
                <CardTitle className="text-4xl font-bold mb-4">
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-blue-300 shadow-xl mr-2">
                        <img src={tariAvatarImage} alt="Tari" className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1">
                        <Shield className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div className="mx-4 text-gray-400">+</div>
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-green-300 shadow-xl ml-2">
                        <img src={kamsiAvatarImage} alt="Kamsi" className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                        <Heart className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  </div>
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
                    The Perfect Partnership
                  </span>
                </CardTitle>
                <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  Your complete civic education experience combines institutional knowledge with community connection
                </p>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                  {/* Tari's Domain */}
                  <Card className="border-2 border-blue-200 hover:border-blue-400 transition-colors">
                    <CardHeader className="bg-blue-50">
                      <CardTitle className="flex items-center text-blue-800">
                        <Shield className="w-6 h-6 mr-3" />
                        <div>
                          <h3 className="font-bold text-lg">TARI HANDLES</h3>
                          <p className="font-normal text-sm text-blue-600">Structural & Institutional</p>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 mr-3 text-blue-500 mt-0.5" />
                          <span className="text-gray-700">Constitutional frameworks & legal processes</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 mr-3 text-blue-500 mt-0.5" />
                          <span className="text-gray-700">Government structure & electoral systems</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 mr-3 text-blue-500 mt-0.5" />
                          <span className="text-gray-700">Policy analysis & civic rights education</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 mr-3 text-blue-500 mt-0.5" />
                          <span className="text-gray-700">Formal leadership training modules</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Collaboration Flow */}
                  <div className="flex flex-col justify-center items-center space-y-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mb-3">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-bold text-lg text-gray-800 mb-2">Seamless Integration</h4>
                      <p className="text-gray-600 text-sm">
                        They work together to provide you with complete civic education that's both informative and inspiring
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-400">
                      <div className="w-8 h-0.5 bg-blue-300"></div>
                      <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                      <div className="w-8 h-0.5 bg-green-300"></div>
                    </div>
                  </div>

                  {/* Kamsi's Domain */}
                  <Card className="border-2 border-green-200 hover:border-green-400 transition-colors">
                    <CardHeader className="bg-green-50">
                      <CardTitle className="flex items-center text-green-800">
                        <Heart className="w-6 h-6 mr-3" />
                        <div>
                          <h3 className="font-bold text-lg">KAMSI HANDLES</h3>
                          <p className="font-normal text-sm text-green-600">Personal & Community</p>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 mr-3 text-green-500 mt-0.5" />
                          <span className="text-gray-700">Community stories & volunteer guidance</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 mr-3 text-green-500 mt-0.5" />
                          <span className="text-gray-700">Personal motivation & encouragement</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 mr-3 text-green-500 mt-0.5" />
                          <span className="text-gray-700">Impact stories & success celebrations</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 mr-3 text-green-500 mt-0.5" />
                          <span className="text-gray-700">Community building & networking</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-green-50 p-8 rounded-2xl text-center border border-gray-200">
                  <h4 className="font-bold text-2xl text-gray-800 mb-4 flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 mr-3 text-yellow-600" />
                    The Result: Complete Civic Transformation
                  </h4>
                  <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
                    <strong>Together, Tari and Kamsi ensure</strong> you develop both the institutional knowledge needed for credible leadership 
                    and the community connection skills required for lasting impact. You'll emerge as one of Nigeria's 13,000 credible leaders, 
                    equipped to transform your Local Government Area and contribute to national progress.
                  </p>
                </div>
              </CardContent>
            </div>
          </div>
        </Card>

        {/* Enhanced Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-green-600 via-blue-600 to-yellow-600 p-1 rounded-2xl shadow-2xl">
            <div className="bg-white rounded-xl p-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to Transform Nigeria with Tari & Kamsi?
              </h3>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Join the #13K Credible Challenge and become part of Nigeria's most ambitious civic transformation. 
                Your guides are waiting to help you develop the knowledge, skills, and community connections needed 
                for credible leadership.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {/* Kamsi Path */}
                <Card className="border-2 border-green-300 hover:border-green-500 transition-colors cursor-pointer" onClick={() => setLocation("/volunteer-onboarding")}>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-green-300 shadow-lg mx-auto mb-4">
                      <img src={kamsiAvatarImage} alt="Kamsi" className="w-full h-full object-cover" />
                    </div>
                    <h4 className="font-bold text-xl text-green-800 mb-3">Start with Kamsi</h4>
                    <p className="text-gray-700 mb-4">
                      Begin your journey with community connection, volunteer opportunities, and personal motivation
                    </p>
                    <Button className="bg-green-600 hover:bg-green-700 w-full" data-testid="button-meet-kamsi">
                      <Heart className="w-4 h-4 mr-2" />
                      Meet Kamsi in Volunteer Onboarding
                    </Button>
                  </CardContent>
                </Card>

                {/* Tari Path */}
                <Card className="border-2 border-blue-300 hover:border-blue-500 transition-colors cursor-pointer" onClick={() => setLocation("/training")}>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-blue-300 shadow-lg mx-auto mb-4">
                      <img src={tariAvatarImage} alt="Tari" className="w-full h-full object-cover" />
                    </div>
                    <h4 className="font-bold text-xl text-blue-800 mb-3">Learn with Tari</h4>
                    <p className="text-gray-700 mb-4">
                      Dive deep into civic education, constitutional knowledge, and formal leadership training
                    </p>
                    <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 w-full" data-testid="button-learn-tari">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Learn with Tari in Training Modules
                    </Button>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-gray-600 mb-4">
                  Not sure where to start? Both paths lead to the same goal: credible leadership in your community.
                </p>
                <Button 
                  onClick={() => setLocation("/dashboard")}
                  variant="secondary"
                  className="px-8 py-3 text-lg"
                  data-testid="button-explore-dashboard"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Explore the Full Platform
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}