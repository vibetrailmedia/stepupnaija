import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import type { Wallet, Project, Transaction } from "@shared/schema";
// Navigation provided by App.tsx - removed duplicate import
import { ProjectCard } from "@/components/ProjectCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  MapPin, 
  Calendar,
  TrendingUp,
  HandHeart,
  CheckCircle,
  Clock,
  Target,
  Filter,
  Info
} from "lucide-react";
// Removed unused asset imports - using external URLs from database
import { ProjectSubmissionModal } from "@/components/ProjectSubmissionModal";
import ProjectVotingPanel from "@/components/ProjectVotingPanel";

export default function Projects() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: wallet } = useQuery<Wallet>({
    queryKey: ["/api/wallet"],
    enabled: isAuthenticated,
    retry: false,
  });

  const { data: projects, isLoading: projectsLoading, error: projectsError } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    enabled: isAuthenticated,
    retry: 1,
    refetchOnMount: true,
    staleTime: 0,
  });

  const { data: analytics } = useQuery<{
    totalPool: string;
    projectsFunded: number;
    activeUsers: number;
    recentWinners: any[];
  }>({
    queryKey: ["/api/analytics/overview"],
    enabled: isAuthenticated,
    retry: false,
  });

  const { data: transactions } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
    enabled: isAuthenticated,
    retry: false,
  });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-sm mx-auto">
          <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse shadow-lg">
            <HandHeart className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Loading Projects</h3>
            <p className="text-gray-600">Discovering community initiatives across Nigeria...</p>
          </div>
          
          {/* Mobile loading dots */}
          <div className="flex justify-center space-x-2 mt-6">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  // Error handling
  if (projectsError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HandHeart className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load projects</h3>
          <p className="text-gray-500 mb-4">There was an issue loading community projects. Please try again.</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-primary-600 hover:bg-primary-700 text-white"
          >
            Reload Page
          </Button>
        </div>
      </div>
    );
  }

  const projectsToShow = projects || [];
  // Only show demo banner when there are no projects at all
  const showingDemoData = projectsToShow.length === 0;
  
  const categories = ['all', 'Water & Sanitation', 'Education', 'Healthcare', 'Youth Development', 'Agriculture', 'Infrastructure'];
  
  const filteredProjects = selectedCategory === 'all' 
    ? projectsToShow 
    : projectsToShow.filter((p: any) => p.category === selectedCategory);

  // Filter out proposed projects for regular users, show only to owners and admins
  const publicProjects = filteredProjects.filter((p: any) => 
    p.status !== 'PROPOSED' || p.ownerUserId === user?.id || user?.isAdmin
  );


  const voteTransactions = transactions?.filter((t: any) => t.type === 'VOTE') || [];
  const totalVoted = voteTransactions.reduce((sum: number, t: any) => sum + parseFloat(t.amountSUP || '0'), 0);
  const projectsVoted = new Set(voteTransactions.map((t: any) => t.meta?.projectId)).size;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PROPOSED':
        return <Badge className="bg-yellow-100 text-yellow-700">Proposed</Badge>;
      case 'APPROVED':
        return <Badge className="bg-blue-100 text-blue-700">Active</Badge>;
      case 'FUNDED':
        return <Badge className="bg-green-100 text-green-700">Funded</Badge>;
      case 'COMPLETED':
        return <Badge className="bg-purple-100 text-purple-700">Completed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700">Unknown</Badge>;
    }
  };

  // Removed emoji category icons for cleaner UI

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30 page-transition">
      {/* Navigation provided by App.tsx - removed duplicate Navigation component */}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header - Hero Style - Mobile Optimized */}
        <div className="text-center space-y-4 sm:space-y-6 py-6 sm:py-8 lg:py-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            🏆 Community <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Projects</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">Join millions voting on projects that will transform Nigerian communities across all 774 LGAs</p>
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            <Button 
              onClick={() => setShowSubmissionModal(true)}
              className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3"
              data-testid="button-submit-project"
            >
              ➕ Submit Project
            </Button>
          </div>
        </div>

        {/* Stats Grid - Mobile Optimized */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2 sm:mb-0">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <span className="text-xs text-gray-500 hidden sm:block">Total</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1" data-testid="text-total-projects">
                {projectsToShow.length}
              </div>
              <div className="text-xs sm:text-sm text-blue-600 font-medium">📋 Projects</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center mb-2 sm:mb-0">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
                <span className="text-xs text-gray-500 hidden sm:block">Funded</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1" data-testid="text-funded-projects">
                {analytics?.projectsFunded || projectsToShow.filter((p: any) => p.status === 'FUNDED').length}
              </div>
              <div className="text-xs sm:text-sm text-green-600 font-medium">✅ Completed</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-2 sm:mb-0">
                  <HandHeart className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
                <span className="text-xs text-gray-500 hidden sm:block">Votes</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1" data-testid="text-user-votes">
                {totalVoted.toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm text-purple-600 font-medium">💜 SUP voted</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-2 sm:mb-0">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                </div>
                <span className="text-xs text-gray-500 hidden sm:block">Fund</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1" data-testid="text-community-fund">
                ₦{analytics?.totalPool ? Math.round(parseFloat(analytics.totalPool) * 0.2 * 10).toLocaleString() : '847K'}
              </div>
              <div className="text-xs sm:text-sm text-orange-600 font-medium">💰 Available</div>
            </CardContent>
          </Card>
        </div>

        {/* No Projects Notice */}
        {showingDemoData && (
          <Card className="border-orange-200 bg-orange-50 mb-8">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-orange-900 mb-1">Ready for Community Projects</h4>
                  <p className="text-sm text-orange-700 mb-2">
                    Be the first to submit a project for your community! Projects go through community voting to receive funding.
                  </p>
                  <Button 
                    size="sm" 
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                    onClick={() => setShowSubmissionModal(true)}
                    data-testid="button-submit-first-project"
                  >
                    Submit Your Project
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mobile-First Layout */}
        
        {/* Category Filters - Mobile Optimized */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
              <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>📂 Project Categories</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`text-center px-2 py-2 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm transition-all duration-200 font-medium ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 bg-gray-100 hover:bg-gray-200 hover:scale-105'
                  }`}
                  data-testid={`filter-${category}`}
                >
                  {category === 'all' ? '🗂️ All' : category}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Project Header - Mobile Enhanced */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {selectedCategory === 'all' ? '🗂️ All Projects' : `📂 ${selectedCategory}`}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {publicProjects.length} project{publicProjects.length !== 1 ? 's' : ''} found
            </p>
          </div>
          
          {/* Quick Stats for Mobile */}
          <div className="flex gap-2 text-xs sm:text-sm">
            <div className="bg-blue-50 px-2 py-1 rounded-full text-blue-700">
              🔴 {projectsToShow.filter((p: any) => p.status === 'APPROVED').length} Active
            </div>
            <div className="bg-green-50 px-2 py-1 rounded-full text-green-700">
              ✅ {projectsToShow.filter((p: any) => p.status === 'FUNDED').length} Funded
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div>

          {projectsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="w-full h-40 sm:h-48 bg-gray-200 rounded-lg mb-3"></div>
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                    <div className="h-2 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="flex justify-between mb-3">
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-full"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : publicProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {publicProjects.map((project: any) => (
                <div key={project.id} className="relative group hover:scale-105 transition-all duration-300">
                  {/* Enhanced Status Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 shadow-lg">
                      {getStatusBadge(project.status)}
                    </div>
                  </div>
                  
                  {/* Enhanced Location and Date */}
                  <div className="absolute bottom-3 left-3 right-3 z-10">
                    <div className="flex items-center justify-between text-xs text-white bg-gradient-to-r from-black/70 to-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span className="font-medium">📍 {project.lga}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>📅 {new Date(project.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <ProjectCard 
                    project={{
                      ...project,
                      imageUrl: project.imageUrl
                    }}
                    showVoteButton={project.status === 'APPROVED'}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12 max-w-md mx-auto">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <HandHeart className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                {selectedCategory === 'all' ? '🚀 No projects yet' : `📂 No ${selectedCategory} projects`}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {selectedCategory === 'all' 
                  ? 'Be the first to submit a project for your community!' 
                  : `No projects found in ${selectedCategory} category. Try viewing all projects or submit one!`
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {selectedCategory !== 'all' && (
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedCategory('all')}
                    className="border-primary-300 text-primary-700 hover:bg-primary-50"
                  >
                    🗂️ View All Projects
                  </Button>
                )}
                <Button 
                  onClick={() => setShowSubmissionModal(true)}
                  className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  ➕ Submit Project
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Project Submission Modal */}
      <ProjectSubmissionModal 
        isOpen={showSubmissionModal}
        onClose={() => setShowSubmissionModal(false)}
      />
    </div>
  );
}
