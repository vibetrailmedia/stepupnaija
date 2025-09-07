import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  TrendingUp, 
  Users, 
  Award,
  ArrowLeft,
  Target,
  BarChart3,
  Microscope,
  GraduationCap
} from "lucide-react";

export default function MethodologyPage() {
  const [, setLocation] = useLocation();
  
  // Get focus area from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const focusArea = urlParams.get('focus') || 'overview';

  const methodologyAreas = {
    academic: {
      title: "Academic Performance",
      icon: BookOpen,
      weight: "40%",
      description: "Assessment of institutional academic excellence and student outcomes",
      criteria: [
        "Graduation rates and student success metrics",
        "Faculty qualifications and student-to-faculty ratios", 
        "Academic program quality and accreditation status",
        "Student performance in national assessments",
        "Graduate employment rates and career outcomes"
      ],
      dataSource: "National Universities Commission, JAMB, institutional records"
    },
    research: {
      title: "Research Output",
      icon: Microscope,
      weight: "25%",
      description: "Evaluation of research productivity and innovation",
      criteria: [
        "Number of peer-reviewed publications",
        "Research grants and funding secured",
        "Patents and intellectual property development",
        "International research collaborations",
        "Impact factor of research publications"
      ],
      dataSource: "Academic databases, institutional research offices, patent records"
    },
    leadership: {
      title: "Leadership Development",
      icon: Award,
      weight: "20%",
      description: "Assessment of civic leadership and governance training",
      criteria: [
        "Alumni in leadership positions (government, business, NGOs)",
        "Student government and leadership programs",
        "Civic engagement initiatives and community projects",
        "Public service and social impact programs",
        "Leadership training curriculum and outcomes"
      ],
      dataSource: "Alumni tracking, institutional programs, public service records"
    },
    community: {
      title: "Community Engagement", 
      icon: Users,
      weight: "15%",
      description: "Evaluation of community impact and social responsibility",
      criteria: [
        "Community service hours and volunteer programs",
        "Local development projects and partnerships",
        "Student civic participation rates",
        "Community outreach and extension services",
        "Social innovation and entrepreneurship programs"
      ],
      dataSource: "Community partnerships, volunteer records, local government data"
    }
  };

  const currentArea = methodologyAreas[focusArea as keyof typeof methodologyAreas];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/top-schools')}
            className="mb-4"
            data-testid="button-back-to-rankings"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Top Schools
          </Button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Rankings Methodology</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transparent criteria for evaluating Nigerian educational institutions and their civic impact
            </p>
          </div>
        </div>

        {/* Focus Area Detail */}
        {focusArea !== 'overview' && currentArea && (
          <div className="mb-8">
            <Card className="border-l-4 border-l-primary-500">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <currentArea.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-gray-900">{currentArea.title}</CardTitle>
                    <Badge variant="secondary" className="mt-1">Weight: {currentArea.weight}</Badge>
                  </div>
                </div>
                <p className="text-gray-600 mt-3">{currentArea.description}</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Evaluation Criteria</h4>
                    <ul className="space-y-2">
                      {currentArea.criteria.map((criterion, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Target className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{criterion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Data Sources</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                      {currentArea.dataSource}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Overview of All Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {Object.entries(methodologyAreas).map(([key, area]) => {
            const AreaIcon = area.icon;
            return (
              <Card 
                key={key} 
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  focusArea === key ? 'ring-2 ring-primary-500' : ''
                }`}
                onClick={() => setLocation(`/methodology?focus=${key}`)}
                data-testid={`card-methodology-${key}`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <AreaIcon className="w-5 h-5 text-primary-600" />
                      </div>
                      <CardTitle className="text-lg">{area.title}</CardTitle>
                    </div>
                    <Badge variant="outline">{area.weight}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">{area.description}</p>
                  <div className="text-xs text-gray-500">
                    {area.criteria.length} criteria • Click to explore
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <span>Scoring System</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Rating Scale</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>90-100:</span>
                    <span className="font-medium text-green-600">Exceptional</span>
                  </div>
                  <div className="flex justify-between">
                    <span>80-89:</span>
                    <span className="font-medium text-blue-600">Outstanding</span>
                  </div>
                  <div className="flex justify-between">
                    <span>70-79:</span>
                    <span className="font-medium text-orange-600">Good</span>
                  </div>
                  <div className="flex justify-between">
                    <span>60-69:</span>
                    <span className="font-medium text-gray-600">Average</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-purple-600" />
                <span>Verification Process</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-600 mt-2"></div>
                  <span>Data collection from official sources and institutional submissions</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-600 mt-2"></div>
                  <span>Independent verification by third-party auditors</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-600 mt-2"></div>
                  <span>Public review period for feedback and corrections</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-600 mt-2"></div>
                  <span>Final ranking publication with full transparency</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </main>
    </div>
  );
}