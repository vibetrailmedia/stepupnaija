import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft,
  MapPin,
  Calendar,
  Target,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  Eye
} from 'lucide-react';
import { Link } from 'wouter';
import ProjectVotingPanel from '@/components/ProjectVotingPanel';

type Project = {
  id: string;
  title: string;
  description: string;
  category: string;
  lga: string;
  status: string;
  targetNGN: string;
  raisedNGN: string;
  imageUrl: string;
  createdAt: string;
  donorCount: number;
};

export default function ProjectDetails() {
  const { projectId } = useParams();
  const { isAuthenticated } = useAuth();

  // Fetch single project details
  const { data: project, isLoading } = useQuery<Project>({
    queryKey: [`/api/projects/${projectId}`],
    enabled: isAuthenticated && !!projectId,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Target className="w-4 h-4 text-white" />
          </div>
          <p className="text-gray-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Project Not Found</h2>
          <p className="text-gray-600 mb-4">The project you're looking for doesn't exist or has been removed.</p>
          <Link href="/projects">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const targetAmount = parseFloat(project.targetNGN || '0');
  const raisedAmount = parseFloat(project.raisedNGN || '0');
  const progressPercentage = targetAmount > 0 ? (raisedAmount / targetAmount) * 100 : 0;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PROPOSED: { color: 'bg-yellow-100 text-yellow-800', text: 'Under Review' },
      APPROVED: { color: 'bg-green-100 text-green-800', text: 'Active' },
      FUNDED: { color: 'bg-blue-100 text-blue-800', text: 'Funded' },
      COMPLETED: { color: 'bg-purple-100 text-purple-800', text: 'Completed' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PROPOSED;
    return (
      <Badge className={`${config.color} font-medium`}>
        {config.text}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/projects">
              <Button variant="ghost" className="flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Projects
              </Button>
            </Link>
            {getStatusBadge(project.status)}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Image */}
            <Card>
              <div className="relative h-64 sm:h-80">
                <img
                  src={project.imageUrl || '/api/placeholder/800/400'}
                  alt={project.title}
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-white/90 text-gray-800">
                    {project.category}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Project Info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                      {project.title}
                    </CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {project.lga}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(project.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {project.donorCount || 0} supporters
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {project.description}
                </p>

                {/* Funding Progress */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-bold text-gray-800 flex items-center">
                      <Target className="w-4 h-4 mr-1 text-green-600" />
                      Funding Progress
                    </span>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        ₦{Math.round(raisedAmount / 1000)}K / ₦{Math.round(targetAmount / 1000)}K
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.round(progressPercentage)}% funded
                      </div>
                    </div>
                  </div>
                  
                  <Progress 
                    value={progressPercentage} 
                    className="h-4 bg-gray-200 [&>div]:bg-gradient-to-r [&>div]:from-green-500 [&>div]:to-emerald-500" 
                  />
                  
                  <div className="grid grid-cols-3 gap-2 text-center mt-4">
                    <div className="bg-white rounded p-2 border border-gray-100">
                      <div className="text-xs text-green-600 font-bold">
                        {project.donorCount || 0}
                      </div>
                      <div className="text-xs text-gray-500">Supporters</div>
                    </div>
                    <div className="bg-white rounded p-2 border border-gray-100">
                      <div className="text-xs text-blue-600 font-bold">
                        ₦{Math.round((targetAmount - raisedAmount) / 1000)}K
                      </div>
                      <div className="text-xs text-gray-500">To Go</div>
                    </div>
                    <div className="bg-white rounded p-2 border border-gray-100">
                      <div className="text-xs text-purple-600 font-bold">
                        {Math.max(1, Math.ceil((targetAmount - raisedAmount) / 1000))} days
                      </div>
                      <div className="text-xs text-gray-500">Left</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Voting Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <ProjectVotingPanel 
                projectId={project.id}
                projectTitle={project.title}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}