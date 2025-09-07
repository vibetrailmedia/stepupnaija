import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle,
  MapPin,
  Clock,
  TrendingUp,
  CheckCircle,
  Eye,
  ThumbsUp,
  Users,
  Shield,
  Wrench,
  Zap,
  Building,
  Leaf
} from "lucide-react";

interface CitizenReport {
  id: string;
  title: string;
  type: string;
  description: string;
  location: string;
  state: string;
  lga: string;
  status: string;
  priority: string;
  upvotes: number;
  createdAt: string;
  statusUpdatedAt?: string;
  publicId: string;
}

interface CitizenReportingCardProps {
  reports: CitizenReport[];
  userReports?: CitizenReport[];
  className?: string;
  onCreateReport?: () => void;
  onViewReport?: (reportId: string) => void;
}

export function CitizenReportingCard({ 
  reports = [],
  userReports = [],
  className = "",
  onCreateReport,
  onViewReport
}: CitizenReportingCardProps) {
  const [activeTab, setActiveTab] = useState<'community' | 'my-reports'>('community');

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'INFRASTRUCTURE': return Wrench;
      case 'SECURITY': return Shield;
      case 'CORRUPTION': return AlertTriangle;
      case 'SERVICE_DELIVERY': return Users;
      case 'ENVIRONMENTAL': return Leaf;
      case 'ELECTORAL': return Building;
      default: return AlertTriangle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUBMITTED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'UNDER_REVIEW': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'IN_PROGRESS': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'RESOLVED': return 'bg-green-100 text-green-800 border-green-200';
      case 'CLOSED': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'DISMISSED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'text-red-600';
      case 'HIGH': return 'text-orange-600';
      case 'MEDIUM': return 'text-yellow-600';
      case 'LOW': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const handleReportClick = (reportId: string) => {
    if (onViewReport) {
      onViewReport(reportId);
    } else {
      window.location.href = `/reports/${reportId}`;
    }
  };

  const handleCreateReport = () => {
    if (onCreateReport) {
      onCreateReport();
    } else {
      window.location.href = '/reports/create';
    }
  };

  // Calculate statistics
  const totalReports = reports.length;
  const resolvedReports = reports.filter(r => r.status === 'RESOLVED').length;
  const inProgressReports = reports.filter(r => r.status === 'IN_PROGRESS').length;
  const myActiveReports = userReports.filter(r => !['RESOLVED', 'CLOSED', 'DISMISSED'].includes(r.status)).length;

  const displayReports = activeTab === 'community' ? reports.slice(0, 5) : userReports.slice(0, 5);

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Citizen Reporting System
          </CardTitle>
          <Button onClick={handleCreateReport} size="sm" className="bg-orange-600 hover:bg-orange-700">
            Report Issue
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Statistics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalReports}</div>
            <div className="text-xs text-gray-600">Total Reports</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{resolvedReports}</div>
            <div className="text-xs text-gray-600">Resolved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{inProgressReports}</div>
            <div className="text-xs text-gray-600">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{myActiveReports}</div>
            <div className="text-xs text-gray-600">My Active</div>
          </div>
        </div>

        {totalReports > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Resolution Rate</span>
              <span>{Math.round((resolvedReports / totalReports) * 100)}%</span>
            </div>
            <Progress value={(resolvedReports / totalReports) * 100} className="h-2" />
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('community')}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'community'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Community Reports ({reports.length})
          </button>
          <button
            onClick={() => setActiveTab('my-reports')}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'my-reports'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My Reports ({userReports.length})
          </button>
        </div>

        {/* Reports List */}
        {displayReports.length === 0 ? (
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-700 mb-2">No Reports</h3>
            <p className="text-gray-500 text-sm">
              {activeTab === 'community' 
                ? "No community reports have been submitted yet."
                : "You haven't submitted any reports yet."
              }
            </p>
            <Button onClick={handleCreateReport} className="mt-4" size="sm">
              Submit Your First Report
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {displayReports.map((report) => {
              const IconComponent = getReportIcon(report.type);
              
              return (
                <div
                  key={report.id}
                  onClick={() => handleReportClick(report.id)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <IconComponent className="h-4 w-4 text-orange-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm text-gray-800 truncate">
                          {report.title}
                        </h3>
                        <Badge className={`text-xs ${getStatusColor(report.status)}`}>
                          {report.status.replace('_', ' ')}
                        </Badge>
                        <span className={`text-xs font-medium ${getPriorityColor(report.priority)}`}>
                          {report.priority}
                        </span>
                      </div>
                      
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {report.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{report.lga}, {report.state}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3" />
                          <span>{report.upvotes}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatTimeAgo(report.createdAt)}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>#{report.publicId}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {displayReports.length >= 5 && (
              <Button 
                variant="ghost" 
                className="w-full mt-4 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                onClick={() => window.location.href = '/reports'}
              >
                View All Reports →
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}