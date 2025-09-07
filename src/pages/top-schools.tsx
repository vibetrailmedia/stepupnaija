import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";
import { 
  Star, 
  TrendingUp, 
  Users, 
  MapPin, 
  Award,
  Building,
  BookOpen,
  Crown,
  Trophy,
  Target,
  GraduationCap,
  Calendar,
  BarChart3
} from "lucide-react";

// Import generated university logos
import uiLogoImage from "@assets/generated_images/University_of_Ibadan_logo_b36b851a.png";
import unilagLogoImage from "@assets/generated_images/UNILAG_university_logo_2f8621ab.png";
import abuLogoImage from "@assets/generated_images/ABU_university_logo_dfea4cfe.png";
import unnLogoImage from "@assets/generated_images/UNN_university_logo_f3e99836.png";
import covenantLogoImage from "@assets/generated_images/Covenant_University_logo_796d63b3.png";
import oauLogoImage from "@assets/generated_images/OAU_university_logo_c5878c86.png";
import uniloriinLogoImage from "@assets/generated_images/UNILORIN_university_logo_110e2837.png";
import futaLogoImage from "@assets/generated_images/FUTA_university_logo_0104532e.png";
import bukLogoImage from "@assets/generated_images/BUK_university_logo_08e474bb.png";
import unibenLogoImage from "@assets/generated_images/UNIBEN_university_logo_c84ef7a6.png";
import lasuLogoImage from "@assets/generated_images/LASU_university_logo_16d6bf88.png";
import uniportLogoImage from "@assets/generated_images/UNIPORT_university_logo_e90409d0.png";
import futminnaLogoImage from "@assets/generated_images/FUTMINNA_university_logo_28d3b1e7.png";
import nauLogoImage from "@assets/generated_images/NAU_university_logo_fcccd8c1.png";
import unicalLogoImage from "@assets/generated_images/UNICAL_university_logo_71674d48.png";
import unijosLogoImage from "@assets/generated_images/UNIJOS_university_logo_929df0fc.png";
import funaabLogoImage from "@assets/generated_images/FUNAAB_university_logo_ae46856d.png";
import uniabujaLogoImage from "@assets/generated_images/UNIABUJA_university_logo_382b3f47.png";
import rsuLogoImage from "@assets/generated_images/RSU_university_logo_08c2005f.png";
import aauaLogoImage from "@assets/generated_images/AAUA_university_logo_92def4fc.png";

// Map university IDs to their logos
const universityLogoMap: Record<string, string> = {
  "university-of-ibadan": uiLogoImage,
  "university-of-lagos": unilagLogoImage,
  "abu-zaria": abuLogoImage,
  "university-of-nigeria": unnLogoImage,
  "covenant-university": covenantLogoImage,
  "obafemi-awolowo": oauLogoImage,
  "university-of-ilorin": uniloriinLogoImage,
  "futa": futaLogoImage,
  "bayero-university": bukLogoImage,
  "university-of-benin": unibenLogoImage,
  "lagos-state-university": lasuLogoImage,
  "university-of-port-harcourt": uniportLogoImage,
  "futminna": futminnaLogoImage,
  "nnamdi-azikiwe-university": nauLogoImage,
  "university-of-calabar": unicalLogoImage,
  "university-of-jos": unijosLogoImage,
  "funaab": funaabLogoImage,
  "university-of-abuja": uniabujaLogoImage,
  "rivers-state-university": rsuLogoImage,
  "adekunle-ajasin-university": aauaLogoImage,
};

export default function TopSchoolsPage() {
  const [, setLocation] = useLocation();
  
  // Mock data for top schools - will be replaced with real API calls
  const topSchools = [
    {
      id: "university-of-ibadan",
      name: "University of Ibadan",
      shortName: "UI",
      type: "Federal University",
      rank: 1,
      score: 95.8,
      state: "Oyo",
      lga: "Ibadan North",
      establishedYear: 1948,
      studentPopulation: 45000,
      activeCivicLeaders: 230,
      totalSUPEarned: 12500,
      averageEngagement: 87,
      logoUrl: uiLogoImage,
      programs: ["Medicine", "Engineering", "Law", "Sciences"],
      rankingBody: "NUC Official Ranking"
    },
    {
      id: "university-of-lagos",
      name: "University of Lagos",
      shortName: "UNILAG",
      type: "Federal University", 
      rank: 2,
      score: 94.2,
      state: "Lagos",
      lga: "Yaba",
      establishedYear: 1962,
      studentPopulation: 57000,
      activeCivicLeaders: 310,
      totalSUPEarned: 15200,
      averageEngagement: 92,
      logoUrl: unilagLogoImage,
      programs: ["Engineering", "Medicine", "Business", "Arts"],
      rankingBody: "NUC Official Ranking"
    },
    {
      id: "abu-zaria",
      name: "Ahmadu Bello University",
      shortName: "ABU",
      type: "Federal University",
      rank: 3,
      score: 93.1,
      state: "Kaduna",
      lga: "Zaria",
      establishedYear: 1962,
      studentPopulation: 75000,
      activeCivicLeaders: 280,
      totalSUPEarned: 11800,
      averageEngagement: 85,
      logoUrl: abuLogoImage,
      programs: ["Agriculture", "Engineering", "Medicine", "Education"],
      rankingBody: "NUC Official Ranking"
    },
    {
      id: "university-of-nigeria",
      name: "University of Nigeria, Nsukka",
      shortName: "UNN",
      type: "Federal University",
      rank: 4,
      score: 91.7,
      state: "Enugu",
      lga: "Nsukka",
      establishedYear: 1955,
      studentPopulation: 36000,
      activeCivicLeaders: 195,
      totalSUPEarned: 9800,
      averageEngagement: 81,
      logoUrl: unnLogoImage,
      programs: ["Arts", "Sciences", "Engineering", "Medicine"],
      rankingBody: "NUC Official Ranking"
    },
    {
      id: "covenant-university",
      name: "Covenant University",
      shortName: "CU",
      type: "Private University",
      rank: 5,
      score: 90.4,
      state: "Ogun",
      lga: "Ota",
      establishedYear: 2002,
      studentPopulation: 12000,
      activeCivicLeaders: 85,
      totalSUPEarned: 4200,
      averageEngagement: 94,
      logoUrl: covenantLogoImage,
      programs: ["Engineering", "Business", "Sciences", "Social Sciences"],
      rankingBody: "NUC Official Ranking"
    },
    {
      id: "obafemi-awolowo",
      name: "Obafemi Awolowo University",
      shortName: "OAU",
      type: "Federal University",
      rank: 6,
      score: 89.8,
      state: "Osun",
      lga: "Ife Central",
      establishedYear: 1961,
      studentPopulation: 35000,
      activeCivicLeaders: 180,
      totalSUPEarned: 8900,
      averageEngagement: 83,
      logoUrl: oauLogoImage,
      programs: ["Medicine", "Pharmacy", "Engineering", "Arts"],
      rankingBody: "NUC Official Ranking"
    },
    {
      id: "university-of-ilorin",
      name: "University of Ilorin",
      shortName: "UNILORIN",
      type: "Federal University",
      rank: 7,
      score: 88.5,
      state: "Kwara",
      lga: "Ilorin West",
      establishedYear: 1975,
      studentPopulation: 42000,
      activeCivicLeaders: 165,
      totalSUPEarned: 8200,
      averageEngagement: 79,
      logoUrl: uniloriinLogoImage,
      programs: ["Engineering", "Medicine", "Education", "Arts"],
      rankingBody: "NUC Official Ranking"
    },
    {
      id: "futa",
      name: "Federal University of Technology, Akure",
      shortName: "FUTA",
      type: "Federal University",
      rank: 8,
      score: 87.3,
      state: "Ondo",
      lga: "Akure South",
      establishedYear: 1981,
      studentPopulation: 28000,
      activeCivicLeaders: 145,
      totalSUPEarned: 7800,
      averageEngagement: 82,
      logoUrl: futaLogoImage,
      programs: ["Engineering", "Technology", "Sciences", "Agriculture"],
      rankingBody: "NUC Official Ranking"
    },
    {
      id: "bayero-university",
      name: "Bayero University, Kano",
      shortName: "BUK",
      type: "Federal University",
      rank: 9,
      score: 86.7,
      state: "Kano",
      lga: "Kano Municipal",
      establishedYear: 1975,
      studentPopulation: 45000,
      activeCivicLeaders: 190,
      totalSUPEarned: 7500,
      averageEngagement: 78,
      logoUrl: bukLogoImage,
      programs: ["Arts", "Sciences", "Law", "Education"],
      rankingBody: "NUC Official Ranking"
    },
    {
      id: "university-of-benin",
      name: "University of Benin",
      shortName: "UNIBEN",
      type: "Federal University",
      rank: 10,
      score: 85.9,
      state: "Edo",
      lga: "Egor",
      establishedYear: 1970,
      studentPopulation: 40000,
      activeCivicLeaders: 170,
      totalSUPEarned: 7200,
      averageEngagement: 80,
      logoUrl: unibenLogoImage,
      programs: ["Medicine", "Engineering", "Pharmacy", "Arts"],
      rankingBody: "NUC Official Ranking"
    },
    {
      id: "lagos-state-university",
      name: "Lagos State University",
      shortName: "LASU",
      type: "State University",
      rank: 11,
      score: 84.8,
      state: "Lagos",
      lga: "Ojo",
      establishedYear: 1983,
      studentPopulation: 30000,
      activeCivicLeaders: 140,
      totalSUPEarned: 6800,
      averageEngagement: 85,
      logoUrl: lasuLogoImage,
      programs: ["Law", "Medicine", "Engineering", "Business"],
      rankingBody: "NUC Official Ranking"
    },
    {
      id: "university-of-port-harcourt",
      name: "University of Port Harcourt",
      shortName: "UNIPORT",
      type: "Federal University",
      rank: 12,
      score: 83.6,
      state: "Rivers",
      lga: "Port Harcourt",
      establishedYear: 1975,
      studentPopulation: 38000,
      activeCivicLeaders: 155,
      totalSUPEarned: 6500,
      averageEngagement: 77,
      logoUrl: uniportLogoImage,
      programs: ["Engineering", "Medicine", "Law", "Sciences"],
      rankingBody: "NUC Official Ranking"
    },
    {
      id: "futminna",
      name: "Federal University of Technology, Minna",
      shortName: "FUTMINNA",
      type: "Federal University",
      rank: 13,
      score: 82.4,
      state: "Niger",
      lga: "Minna",
      establishedYear: 1983,
      studentPopulation: 25000,
      activeCivicLeaders: 120,
      totalSUPEarned: 6000,
      averageEngagement: 76,
      logoUrl: futminnaLogoImage,
      programs: ["Engineering", "Technology", "Sciences", "Agriculture"],
      rankingBody: "NUC Official Ranking"
    },
    {
      id: "nnamdi-azikiwe-university",
      name: "Nnamdi Azikiwe University",
      shortName: "NAU",
      type: "Federal University",
      rank: 14,
      score: 81.7,
      state: "Anambra",
      lga: "Awka",
      establishedYear: 1991,
      studentPopulation: 32000,
      activeCivicLeaders: 130,
      totalSUPEarned: 5800,
      averageEngagement: 75,
      logoUrl: nauLogoImage,
      programs: ["Medicine", "Engineering", "Arts", "Sciences"],
      rankingBody: "NUC Official Ranking"
    },
    {
      id: "university-of-calabar",
      name: "University of Calabar",
      shortName: "UNICAL",
      type: "Federal University",
      rank: 15,
      score: 80.9,
      state: "Cross River",
      lga: "Calabar Municipal",
      establishedYear: 1975,
      studentPopulation: 27000,
      activeCivicLeaders: 115,
      totalSUPEarned: 5500,
      averageEngagement: 73,
      logoUrl: unicalLogoImage,
      programs: ["Medicine", "Law", "Arts", "Sciences"],
      rankingBody: "NUC Official Ranking"
    },
    {
      id: "university-of-jos",
      name: "University of Jos",
      shortName: "UNIJOS",
      type: "Federal University",
      rank: 16,
      score: 79.8,
      state: "Plateau",
      lga: "Jos North",
      establishedYear: 1975,
      studentPopulation: 35000,
      activeCivicLeaders: 125,
      totalSUPEarned: 5200,
      averageEngagement: 74,
      logoUrl: unijosLogoImage,
      programs: ["Medicine", "Engineering", "Arts", "Natural Sciences"],
      rankingBody: "NUC Official Ranking"
    },
    {
      id: "funaab",
      name: "Federal University of Agriculture, Abeokuta",
      shortName: "FUNAAB",
      type: "Federal University",
      rank: 17,
      score: 78.6,
      state: "Ogun",
      lga: "Abeokuta South",
      establishedYear: 1988,
      studentPopulation: 22000,
      activeCivicLeaders: 95,
      totalSUPEarned: 4800,
      averageEngagement: 72,
      logoUrl: funaabLogoImage,
      programs: ["Agriculture", "Engineering", "Sciences", "Veterinary Medicine"],
      rankingBody: "NUC Official Ranking"
    },
    {
      id: "university-of-abuja",
      name: "University of Abuja",
      shortName: "UNIABUJA",
      type: "Federal University",
      rank: 18,
      score: 77.5,
      state: "FCT",
      lga: "Gwagwalada",
      establishedYear: 1988,
      studentPopulation: 20000,
      activeCivicLeaders: 90,
      totalSUPEarned: 4500,
      averageEngagement: 71,
      logoUrl: uniabujaLogoImage,
      programs: ["Arts", "Sciences", "Engineering", "Law"],
      rankingBody: "NUC Official Ranking"
    },
    {
      id: "rivers-state-university",
      name: "Rivers State University",
      shortName: "RSU",
      type: "State University",
      rank: 19,
      score: 76.3,
      state: "Rivers",
      lga: "Port Harcourt",
      establishedYear: 1980,
      studentPopulation: 18000,
      activeCivicLeaders: 80,
      totalSUPEarned: 4200,
      averageEngagement: 70,
      logoUrl: rsuLogoImage,
      programs: ["Engineering", "Sciences", "Medicine", "Agriculture"],
      rankingBody: "NUC Official Ranking"
    },
    {
      id: "adekunle-ajasin-university",
      name: "Adekunle Ajasin University",
      shortName: "AAUA",
      type: "State University",
      rank: 20,
      score: 75.1,
      state: "Ondo",
      lga: "Akungba-Akoko",
      establishedYear: 1999,
      studentPopulation: 15000,
      activeCivicLeaders: 70,
      totalSUPEarned: 3800,
      averageEngagement: 69,
      logoUrl: aauaLogoImage,
      programs: ["Arts", "Sciences", "Engineering", "Social Sciences"],
      rankingBody: "NUC Official Ranking"
    }
  ];

  const rankingCategories = [
    {
      id: "overall",
      name: "Overall Excellence",
      description: "Comprehensive ranking across all academic and civic parameters",
      schools: topSchools
    },
    {
      id: "civic-engagement",
      name: "Civic Engagement",
      description: "Leadership in civic education and community impact",
      schools: [...topSchools].sort((a, b) => b.averageEngagement - a.averageEngagement)
    },
    {
      id: "student-leadership",
      name: "Student Leadership",
      description: "Development of student leaders and civic champions",
      schools: [...topSchools].sort((a, b) => b.activeCivicLeaders - a.activeCivicLeaders)
    },
    {
      id: "community-impact",
      name: "Community Impact", 
      description: "Real-world impact through student-led projects",
      schools: [...topSchools].sort((a, b) => b.totalSUPEarned - a.totalSUPEarned)
    }
  ];

  const getTierBadge = (rank: number) => {
    if (rank <= 3) return <Badge className="bg-yellow-100 text-yellow-700">TOP TIER</Badge>;
    if (rank <= 10) return <Badge className="bg-blue-100 text-blue-700">FIRST CLASS</Badge>;
    if (rank <= 20) return <Badge className="bg-green-100 text-green-700">SECOND CLASS</Badge>;
    return <Badge variant="secondary">DEVELOPING</Badge>;
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Award className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Star className="h-6 w-6 text-amber-600" />;
    return <Target className="h-6 w-6 text-blue-500" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-purple-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6">
              <Badge className="bg-yellow-500 text-black px-4 py-2 text-sm font-semibold">
                🏆 TOP SCHOOLS RANKING
              </Badge>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Nigeria's <span className="text-yellow-400">Leading</span><br />
              Universities
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed opacity-90">
              Recognizing excellence in academic achievement, civic engagement, and leadership development 
              across Nigerian higher education institutions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 text-lg font-semibold" 
                data-testid="button-nominate-school"
                onClick={() => setLocation('/data-submission?type=school-nomination')}
              >
                Nominate Your School
              </Button>
              <Button 
                size="lg" 
                className="bg-green-500 hover:bg-green-600 text-white border-2 border-green-500 px-8 py-3 text-lg font-semibold shadow-lg" 
                data-testid="button-view-methodology"
                onClick={() => setLocation('/methodology')}
              >
                📊 View Ranking Methodology
              </Button>
            </div>
            
            {/* ENHANCED METHODOLOGY PREVIEW */}
            <div className="bg-gradient-to-br from-blue-900/95 via-purple-900/95 to-indigo-900/95 backdrop-blur-md rounded-3xl p-8 max-w-5xl mx-auto border border-white/20 shadow-2xl relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-transparent rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-400/20 to-transparent rounded-full blur-xl"></div>
              
              <div className="relative text-center space-y-6">
                <div className="inline-flex items-center gap-2 bg-yellow-400 text-black px-6 py-3 rounded-full text-sm font-bold shadow-lg">
                  📊 RANKING METHODOLOGY
                </div>
                
                <h3 className="text-3xl font-bold text-white leading-tight">
                  How We Rank Nigerian Universities
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6">
                  <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="text-3xl font-bold text-yellow-400 mb-2">40%</div>
                    <div className="text-sm text-white/90 font-medium">Academic Excellence</div>
                  </div>
                  <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="text-3xl font-bold text-blue-400 mb-2">25%</div>
                    <div className="text-sm text-white/90 font-medium">Civic Engagement</div>
                  </div>
                  <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="text-3xl font-bold text-purple-400 mb-2">20%</div>
                    <div className="text-sm text-white/90 font-medium">Leadership Dev.</div>
                  </div>
                  <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="text-3xl font-bold text-green-400 mb-2">15%</div>
                    <div className="text-sm text-white/90 font-medium">Innovation</div>
                  </div>
                </div>
                
                <Button 
                  className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 font-bold rounded-lg shadow-lg transition-all transform hover:scale-105"
                  onClick={() => setLocation('/methodology')}
                  data-testid="button-hero-methodology-details"
                >
                  🔍 View Complete Methodology
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Ranking Categories */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">University Rankings</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Multiple ranking categories highlighting different aspects of university excellence
            </p>
          </div>

          <Tabs defaultValue="overall" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              {rankingCategories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="flex flex-col items-center gap-1 py-3">
                  <span className="text-xs font-medium">{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {rankingCategories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{category.name} Rankings</h3>
                  <p className="text-gray-600">{category.description}</p>
                </div>

                <div className="space-y-4">
                  {category.schools.slice(0, 10).map((school, index) => (
                    <motion.div
                      key={school.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-3">
                                {getRankIcon(index + 1)}
                                <div className="text-2xl font-bold text-gray-900">#{index + 1}</div>
                              </div>
                              
                              <div className="w-16 h-16 flex-shrink-0">
                                <img 
                                  src={school.logoUrl} 
                                  alt={`${school.shortName} logo`}
                                  className="w-full h-full object-contain rounded-lg border border-gray-200"
                                />
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-xl font-bold text-gray-900">{school.name}</h3>
                                  <Badge variant="outline">{school.shortName}</Badge>
                                  {getTierBadge(index + 1)}
                                </div>
                                
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <Building className="h-4 w-4" />
                                    {school.type}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {school.lga}, {school.state}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    Est. {school.establishedYear}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    {school.studentPopulation.toLocaleString()} students
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="text-right space-y-2">
                              <div className="text-2xl font-bold text-blue-600">{school.score}/100</div>
                              <div className="text-sm text-gray-500">Overall Score</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
                            <div className="text-center">
                              <div className="text-lg font-semibold text-green-600">{school.activeCivicLeaders}</div>
                              <div className="text-xs text-gray-500">Civic Leaders</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold text-purple-600">{school.totalSUPEarned.toLocaleString()}</div>
                              <div className="text-xs text-gray-500">SUP Earned</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold text-blue-600">{school.averageEngagement}%</div>
                              <div className="text-xs text-gray-500">Engagement</div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            <div className="flex flex-wrap gap-1">
                              {school.programs.slice(0, 3).map((program) => (
                                <Badge key={program} variant="secondary" className="text-xs">
                                  {program}
                                </Badge>
                              ))}
                              {school.programs.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{school.programs.length - 3} more
                                </Badge>
                              )}
                            </div>
                            
                            <Button 
                              size="sm" 
                              data-testid={`button-view-school-${school.id}`}
                              onClick={() => setLocation('/methodology')}
                            >
                              View Methodology
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Ranking Methodology - HIGHLY VISIBLE WHITE CONTAINER */}
        <div className="my-16 bg-white border-4 border-blue-600 shadow-2xl rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          
          <div className="text-center mb-10">
            <div className="mb-6">
              <Badge className="bg-blue-600 text-white mb-4 px-6 py-3 text-lg font-bold shadow-lg">
                📊 RANKING METHODOLOGY
              </Badge>
            </div>
            
            <h3 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">
              How We Rank Nigerian Universities
            </h3>
            
            <p className="text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed font-medium">
              Our transparent, data-driven approach to evaluating academic excellence, 
              civic engagement, and leadership development across Nigerian universities
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
              <p className="text-lg text-blue-800 font-semibold">
                🎯 Comprehensive evaluation across 4 key pillars of university excellence
              </p>
            </div>
            
            <Button 
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 text-xl font-bold shadow-lg transform hover:scale-105 transition-all duration-200"
              onClick={() => setLocation('/methodology')}
              data-testid="button-view-full-methodology"
            >
              🔍 View Complete Methodology
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <BookOpen className="h-5 w-5" />
                  Academic Excellence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600 mb-2">40%</div>
                <p className="text-sm text-gray-600">
                  Research output, faculty qualifications, graduation rates, and academic rankings
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <Users className="h-5 w-5" />
                  Civic Engagement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 mb-2">25%</div>
                <p className="text-sm text-gray-600">
                  Student participation in civic activities, community projects, and leadership development
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <Crown className="h-5 w-5" />
                  Leadership Development
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600 mb-2">20%</div>
                <p className="text-sm text-gray-600">
                  Student union effectiveness, leadership training programs, and alumni leadership roles
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <TrendingUp className="h-5 w-5" />
                  Innovation & Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600 mb-2">15%</div>
                <p className="text-sm text-gray-600">
                  Entrepreneurship programs, startup incubation, and community impact initiatives
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Is Your School Missing?</h3>
          <p className="text-xl mb-6 max-w-3xl mx-auto opacity-90">
            Help us build the most comprehensive ranking of Nigerian universities. Nominate your institution 
            and showcase its excellence in academics and civic engagement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 text-lg font-semibold" data-testid="button-nominate-institution" onClick={() => setLocation('/data-submission?type=institution-nomination')}>
              Nominate Your Institution
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-700 px-8 py-3 text-lg font-semibold backdrop-blur-sm" style={{backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white'}} data-testid="button-submit-data" onClick={() => setLocation('/data-submission?type=school')}>
              Submit School Data
            </Button>
          </div>
        </div>

        {/* School Rankings Resources Section */}
        <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl p-8 border border-gray-200">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">School Rankings Resources & Navigation</h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore comprehensive university data, rankings methodology, and ways to participate
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-blue-200 hover:border-blue-400 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-blue-700 text-lg">
                  <Building className="h-5 w-5" />
                  University Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li><Button variant="ghost" className="p-0 h-auto text-gray-600 hover:text-blue-600" onClick={() => setLocation('/top-schools?type=federal')}>Federal Universities</Button></li>
                  <li><Button variant="ghost" className="p-0 h-auto text-gray-600 hover:text-blue-600" onClick={() => setLocation('/top-schools?type=state')}>State Universities</Button></li>
                  <li><Button variant="ghost" className="p-0 h-auto text-gray-600 hover:text-blue-600" onClick={() => setLocation('/top-schools?type=private')}>Private Universities</Button></li>
                  <li><Button variant="ghost" className="p-0 h-auto text-gray-600 hover:text-blue-600" onClick={() => setLocation('/top-schools?type=specialized')}>Specialized Institutions</Button></li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-green-200 hover:border-green-400 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-green-700 text-lg">
                  <BarChart3 className="h-5 w-5" />
                  Ranking Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li><Button variant="ghost" className="p-0 h-auto text-gray-600 hover:text-green-600" onClick={() => setLocation('/top-schools')}>Overall Excellence</Button></li>
                  <li><Button variant="ghost" className="p-0 h-auto text-gray-600 hover:text-green-600" onClick={() => setLocation('/engage')}>Civic Engagement</Button></li>
                  <li><Button variant="ghost" className="p-0 h-auto text-gray-600 hover:text-green-600" onClick={() => setLocation('/leadership-portal')}>Student Leadership</Button></li>
                  <li><Button variant="ghost" className="p-0 h-auto text-gray-600 hover:text-green-600" onClick={() => setLocation('/projects')}>Community Impact</Button></li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-orange-200 hover:border-orange-400 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-orange-700 text-lg">
                  <BookOpen className="h-5 w-5" />
                  Methodology
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li><Button variant="ghost" className="p-0 h-auto text-gray-600 hover:text-orange-600" onClick={() => setLocation('/methodology?focus=academic')}>Academic Performance</Button></li>
                  <li><Button variant="ghost" className="p-0 h-auto text-gray-600 hover:text-orange-600" onClick={() => setLocation('/methodology?focus=research')}>Research Output</Button></li>
                  <li><Button variant="ghost" className="p-0 h-auto text-gray-600 hover:text-orange-600" onClick={() => setLocation('/methodology?focus=leadership')}>Leadership Development</Button></li>
                  <li><Button variant="ghost" className="p-0 h-auto text-gray-600 hover:text-orange-600" onClick={() => setLocation('/methodology?focus=community')}>Community Engagement</Button></li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-purple-200 hover:border-purple-400 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-purple-700 text-lg">
                  <Target className="h-5 w-5" />
                  Participate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li><Button variant="ghost" className="p-0 h-auto text-gray-600 hover:text-purple-600" onClick={() => setLocation('/data-submission?type=school-nomination')}>Nominate Schools</Button></li>
                  <li><Button variant="ghost" className="p-0 h-auto text-gray-600 hover:text-purple-600" onClick={() => setLocation('/data-submission?type=school')}>Submit Data</Button></li>
                  <li><Button variant="ghost" className="p-0 h-auto text-gray-600 hover:text-purple-600" onClick={() => setLocation('/feedback?type=rankings')}>Provide Feedback</Button></li>
                  <li><Button variant="ghost" className="p-0 h-auto text-gray-600 hover:text-purple-600" onClick={() => setLocation('/committee?type=rankings')}>Join Rankings Committee</Button></li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}