import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Search, 
  MapPin, 
  Users, 
  Award, 
  ThumbsUp, 
  Eye, 
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  Star,
  Vote,
  ArrowLeft,
  Info
} from "lucide-react";
import { useLocation } from "wouter";

// Import generated candidate images
import womanProfessionalImage from "@assets/generated_images/Nigerian_woman_professional_headshot_b062e128.png";
import manProfessionalImage from "@assets/generated_images/Nigerian_man_professional_headshot_671c9909.png";
import academicWomanImage from "@assets/generated_images/Nigerian_academic_woman_portrait_2110a518.png";
import youngProfessionalImage from "@assets/generated_images/Nigerian_young_professional_headshot_5f929c22.png";

// Map server asset paths to imported images
const candidateImageMap: Record<string, string> = {
  "@assets/generated_images/Nigerian_woman_professional_headshot_b062e128.png": womanProfessionalImage,
  "@assets/generated_images/Nigerian_man_professional_headshot_671c9909.png": manProfessionalImage,
  "@assets/generated_images/Nigerian_academic_woman_portrait_2110a518.png": academicWomanImage,
  "@assets/generated_images/Nigerian_young_professional_headshot_5f929c22.png": youngProfessionalImage,
};

const nigerianStates = [
  "All States", "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", 
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo", 
  "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", 
  "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", 
  "Yobe", "Zamfara"
];

const vettingStatuses = [
  "All Status", "PENDING", "SCREENING", "COMMUNITY_REVIEW", "QUALIFIED", "TRAINING", "DEPLOYED"
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING": return "bg-gray-100 text-gray-800";
    case "SCREENING": return "bg-blue-100 text-blue-800";
    case "COMMUNITY_REVIEW": return "bg-yellow-100 text-yellow-800";
    case "QUALIFIED": return "bg-green-100 text-green-800";
    case "TRAINING": return "bg-purple-100 text-purple-800";
    case "DEPLOYED": return "bg-emerald-100 text-emerald-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "PENDING": return <Clock className="w-3 h-3" />;
    case "SCREENING": return <Eye className="w-3 h-3" />;
    case "COMMUNITY_REVIEW": return <Users className="w-3 h-3" />;
    case "QUALIFIED": return <CheckCircle className="w-3 h-3" />;
    case "TRAINING": return <Award className="w-3 h-3" />;
    case "DEPLOYED": return <Star className="w-3 h-3" />;
    default: return <AlertCircle className="w-3 h-3" />;
  }
};

interface Candidate {
  id: string;
  name: string;
  email: string;
  state: string;
  lga: string;
  targetRole: string;
  vettingStatus: string;
  integrityScore: number;
  competenceScore: number;
  commitmentScore: number;
  overallScore: number;
  endorsements: number;
  isNomination: boolean;
  nominatorId?: string;
  createdAt: string;
  profileImageUrl?: string;
  applicationStatement?: string;
  reason?: string;
}

export default function Candidates() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("All States");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedView, setSelectedView] = useState("all");

  // Fetch candidates
  const { data: candidates = [], isLoading } = useQuery<Candidate[]>({
    queryKey: ["/api/challenge/candidates", selectedState, selectedStatus, searchTerm],
    retry: false,
  });

  // Check if we have real candidates or need to show empty state
  const showingDemoData = candidates.length === 0;

  // Endorse candidate mutation
  const endorseMutation = useMutation({
    mutationFn: async (candidateId: string) => {
      return await apiRequest(`/api/challenge/candidates/${candidateId}/endorse`, "POST");
    },
    onSuccess: () => {
      toast({
        title: "Endorsement Added",
        description: "Your endorsement has been recorded.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/challenge/candidates"] });
    },
    onError: (error: any) => {
      toast({
        title: "Endorsement Failed",
        description: error.message || "Failed to endorse candidate.",
        variant: "destructive",
      });
    },
  });

  // Filter candidates
  const filteredCandidates = candidates.filter((candidate: Candidate) => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.lga.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = selectedState === "All States" || candidate.state === selectedState;
    const matchesStatus = selectedStatus === "All Status" || candidate.vettingStatus === selectedStatus;
    const matchesView = selectedView === "all" || 
                       (selectedView === "nominations" && candidate.isNomination) ||
                       (selectedView === "applications" && !candidate.isNomination);
    
    return matchesSearch && matchesState && matchesStatus && matchesView;
  });

  // Get summary stats
  const stats = {
    total: candidates.length,
    qualified: candidates.filter((c: Candidate) => c.vettingStatus === "QUALIFIED").length,
    training: candidates.filter((c: Candidate) => c.vettingStatus === "TRAINING").length,
    deployed: candidates.filter((c: Candidate) => c.vettingStatus === "DEPLOYED").length,
  };

  const handleEndorse = (candidateId: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to endorse candidates.",
        variant: "destructive",
      });
      return;
    }
    endorseMutation.mutate(candidateId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading candidates...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30 page-transition">
      {/* Navigation provided by App.tsx - removed duplicate header */}
      
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header - Hero Style - Mobile Optimized */}
          <div className="text-center space-y-4 sm:space-y-6 py-6 sm:py-8 lg:py-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            🏆 Nigeria's Credible <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Leaders</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Meet the credible Nigerians who have been nominated or applied to be part of the 13,000 leaders transforming Nigeria.
          </p>
        </div>

        {/* Stats Overview - Mobile Optimized */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">{stats.total}</div>
              <div className="text-xs sm:text-sm text-gray-600 leading-tight">Total Candidates</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">{stats.qualified}</div>
              <div className="text-xs sm:text-sm text-gray-600 leading-tight">Qualified</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">{stats.training}</div>
              <div className="text-xs sm:text-sm text-gray-600 leading-tight">In Training</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-600 mb-2">{stats.deployed}</div>
              <div className="text-xs sm:text-sm text-gray-600 leading-tight">Deployed</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters - Mobile Optimized */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
              Filter Candidates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Mobile-first: Search always on top, full width */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">🔍 Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search by name or LGA..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 text-base"
                    data-testid="input-search"
                  />
                </div>
              </div>
              
              {/* Mobile: Stack filters in 1 column, tablet+ in 2 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">📍 State</label>
                  <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger data-testid="select-state-filter" className="text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {nigerianStates.map((state) => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">📊 Status</label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger data-testid="select-status-filter" className="text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {vettingStatuses.map((status) => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">📋 Type</label>
                  <Tabs value={selectedView} onValueChange={setSelectedView}>
                    <TabsList className="grid w-full grid-cols-3 h-10">
                      <TabsTrigger value="all" className="text-xs sm:text-sm">All</TabsTrigger>
                      <TabsTrigger value="nominations" className="text-xs sm:text-sm">Nominations</TabsTrigger>
                      <TabsTrigger value="applications" className="text-xs sm:text-sm">Applications</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results - Mobile Optimized */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between items-start sm:items-center">
          <p className="text-sm sm:text-base text-gray-600">
            Showing {filteredCandidates.length} of {candidates.length} candidates
          </p>
          <Button
            onClick={() => setLocation("/nominate")}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
            data-testid="button-add-candidate"
          >
            ➕ Add New Candidate
          </Button>
        </div>

        {/* Empty State for No Candidates */}
        {showingDemoData && (
          <Card className="border-primary-200 bg-primary-50 mb-6">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                  <Users className="w-8 h-8 text-primary-600" />
                </div>
                
                <div>
                  <h4 className="font-semibold text-primary-900 mb-2">Building Nigeria's Leadership Pipeline</h4>
                  <p className="text-sm text-primary-700 mb-4 max-w-md mx-auto">
                    The #13K Challenge will showcase 13,000 credible Nigerians ready to lead in their local government areas. 
                    Candidates will be nominated by communities and vetted through our transparent process.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button 
                      size="sm" 
                      className="bg-primary-600 hover:bg-primary-700 text-white"
                      onClick={() => setLocation("/nominate")}
                      data-testid="button-nominate-someone"
                    >
                      Nominate a Leader
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-primary-300 text-primary-700"
                      onClick={() => setLocation("/challenge")}
                      data-testid="button-learn-more-challenge"
                    >
                      Learn More About #13K
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Candidates Grid */}
        {filteredCandidates.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No candidates found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedState !== "All States" || selectedStatus !== "All Status"
                  ? "Try adjusting your filters or search terms."
                  : "Be the first to nominate a credible Nigerian for the challenge."}
              </p>
              <Button
                onClick={() => setLocation("/nominate")}
                className="bg-green-600 hover:bg-green-700"
                data-testid="button-nominate-first"
              >
                Nominate Someone
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {filteredCandidates.map((candidate: Candidate) => (
              <Card key={candidate.id} className="hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                    {/* Mobile: Avatar and status badge side by side at top */}
                    <div className="flex items-center justify-between w-full sm:w-auto">
                      <Avatar className="w-14 h-14 sm:w-16 sm:h-16 ring-2 ring-gray-100 shadow-sm">
                        <AvatarImage 
                          src={candidate.profileImageUrl ? (candidateImageMap[candidate.profileImageUrl] || candidate.profileImageUrl) : undefined} 
                          alt={`${candidate.name} profile`}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-green-100 to-green-200 text-green-700 text-base sm:text-lg font-semibold">
                          {candidate.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      {/* Status badge - mobile: next to avatar, desktop: top right */}
                      <Badge className={`${getStatusColor(candidate.vettingStatus)} sm:absolute sm:top-4 sm:right-4`}>
                        {getStatusIcon(candidate.vettingStatus)}
                        <span className="ml-1 text-xs">{candidate.vettingStatus}</span>
                      </Badge>
                    </div>
                    
                    {/* Info section */}
                    <div className="flex-1 w-full">
                      <h3 className="font-bold text-gray-900 text-lg sm:text-xl mb-2">{candidate.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{candidate.lga}, {candidate.state}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {candidate.isNomination ? "📝 Nominated" : "✋ Applied"} {new Date(candidate.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3 sm:space-y-4">
                  {/* Target Role & Profile Statement */}
                  <div className="space-y-2 sm:space-y-3">
                    <div>
                      <div className="text-xs sm:text-sm font-medium text-gray-700 mb-1">🎯 Target Role</div>
                      <div className="text-sm text-gray-600 font-medium">{candidate.targetRole || "Not specified"}</div>
                    </div>

                    {/* Profile Statement or Nomination Reason */}
                    {(candidate.applicationStatement || candidate.reason) && (
                      <div>
                        <div className="text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          {candidate.isNomination ? "💡 Why Nominated" : "📝 Candidate Statement"}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 bg-gray-50 p-2 sm:p-3 rounded-lg border-l-4 border-primary-500 leading-relaxed">
                          {/* Truncate long text on mobile */}
                          <div className="line-clamp-3">
                            {candidate.isNomination ? candidate.reason : candidate.applicationStatement}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Type Badge & Email */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <Badge variant="outline" className={`w-fit ${candidate.isNomination ? "text-blue-600 border-blue-300" : "text-purple-600 border-purple-300"}`}>
                        {candidate.isNomination ? "📝 Nomination" : "✋ Application"}
                      </Badge>
                      {candidate.email && (
                        <div className="text-xs text-gray-500 truncate">
                          📧 {candidate.email.replace(/(.{3}).*@/, "$1***@")}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Credibility Scores - Compact Mobile Version */}
                  <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1">
                      ⭐ Credibility Scores
                    </div>
                    
                    {/* Mobile: Compact grid layout */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>✅ Integrity</span>
                          <span className="font-medium">{candidate.integrityScore}</span>
                        </div>
                        <Progress value={candidate.integrityScore} className="h-2" />
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>🎯 Competence</span>
                          <span className="font-medium">{candidate.competenceScore}</span>
                        </div>
                        <Progress value={candidate.competenceScore} className="h-2" />
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>🤝 Commitment</span>
                          <span className="font-medium">{candidate.commitmentScore}</span>
                        </div>
                        <Progress value={candidate.commitmentScore} className="h-2" />
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span>📊 Overall</span>
                          <span className={`${candidate.overallScore >= 80 ? 'text-green-600' : candidate.overallScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {candidate.overallScore}
                          </span>
                        </div>
                        <Progress value={candidate.overallScore} className="h-2" />
                      </div>
                    </div>
                  </div>

                  {/* Community Support & Actions - Mobile Optimized */}
                  <div className="space-y-3 pt-2 border-t">
                    {/* Endorsements count */}
                    <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600 bg-blue-50 px-2 py-1 rounded-full w-fit">
                      <ThumbsUp className="w-3 h-3" />
                      <span>{candidate.endorsements} endorsements</span>
                    </div>
                    
                    {/* Action buttons - Mobile: Full width stack, Desktop: Side by side */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEndorse(candidate.id)}
                        disabled={endorseMutation.isPending}
                        className="text-xs font-medium flex-1 border-green-300 text-green-600 hover:bg-green-50"
                        data-testid={`button-endorse-${candidate.id}`}
                      >
                        <ThumbsUp className="w-3 h-3 mr-1" />
                        👍 Endorse
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs font-medium flex-1 border-blue-300 text-blue-600 hover:bg-blue-50"
                        data-testid={`button-view-${candidate.id}`}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        👀 Profile
                      </Button>
                    </div>

                    {/* Voting for qualified candidates */}
                    {candidate.vettingStatus === "QUALIFIED" && (
                      <Button
                        size="sm"
                        className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                        onClick={() => setLocation("/voting")}
                        data-testid={`button-vote-${candidate.id}`}
                      >
                        <Vote className="w-3 h-3 mr-1" />
                        🗳️ Vote to Select
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        </div>
      </div>
      
    </div>
  );
}