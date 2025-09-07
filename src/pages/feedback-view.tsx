import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  MessageSquare,
  Star,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Filter
} from "lucide-react";

export default function FeedbackViewPage() {
  const [, setLocation] = useLocation();

  // Mock feedback data - would come from API in real implementation
  const feedbackData = [
    {
      id: "1",
      title: "Ranking Methodology Transparency",
      category: "methodology-improvement",
      status: "reviewed",
      rating: 4,
      submittedBy: "Dr. Adebayo Johnson",
      institution: "University of Ibadan",
      submittedAt: "2024-01-15",
      description: "The current methodology is comprehensive but could benefit from more detailed explanations of weighting criteria.",
      response: "Thank you for this feedback. We've updated our methodology page with more detailed explanations.",
      responseAt: "2024-01-18"
    },
    {
      id: "2", 
      title: "Missing Research Data",
      category: "data-correction",
      status: "in-progress",
      rating: 3,
      submittedBy: "Prof. Kemi Ade",
      institution: "Lagos State University",
      submittedAt: "2024-01-20",
      description: "Research output data for LASU appears to be incomplete or outdated. Several recent publications are not reflected.",
      response: null,
      responseAt: null
    },
    {
      id: "3",
      title: "Excellent User Experience",
      category: "user-experience",
      status: "acknowledged",
      rating: 5,
      submittedBy: "Anonymous",
      institution: null,
      submittedAt: "2024-01-22",
      description: "The platform is intuitive and the rankings are presented clearly. Great work on the design!",
      response: "We appreciate your positive feedback!",
      responseAt: "2024-01-22"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "reviewed": return "bg-green-100 text-green-800";
      case "in-progress": return "bg-yellow-100 text-yellow-800";
      case "acknowledged": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      "methodology-improvement": "Methodology",
      "data-correction": "Data Accuracy", 
      "user-experience": "User Experience",
      "ranking-accuracy": "Rankings",
      "new-feature": "Feature Request",
      "technical-issue": "Technical"
    };
    return labels[category] || category;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/leadership-portal')}
            className="mb-4"
            data-testid="button-back-to-portal"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Leadership Portal
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Feedback</h1>
              <p className="text-gray-600">
                Review and track feedback from the academic community
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" data-testid="button-filter">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button onClick={() => setLocation('/feedback')} data-testid="button-submit-feedback">
                <MessageSquare className="w-4 h-4 mr-2" />
                Submit Feedback
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">24</div>
              <div className="text-sm text-gray-600">Total Feedback</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">18</div>
              <div className="text-sm text-gray-600">Reviewed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-1">4</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary-600 mb-1">4.2</div>
              <div className="text-sm text-gray-600">Avg Rating</div>
            </CardContent>
          </Card>
        </div>

        {/* Feedback List */}
        <div className="space-y-6">
          {feedbackData.map((feedback) => (
            <Card key={feedback.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <CardTitle className="text-lg">{feedback.title}</CardTitle>
                      <Badge variant="outline" className={getStatusColor(feedback.status)}>
                        {feedback.status.replace('-', ' ')}
                      </Badge>
                      <Badge variant="secondary">
                        {getCategoryLabel(feedback.category)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <span>By:</span>
                        <span className="font-medium">
                          {feedback.submittedBy}
                          {feedback.institution && ` (${feedback.institution})`}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(feedback.submittedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < feedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Feedback</h4>
                    <p className="text-gray-700">{feedback.description}</p>
                  </div>
                  
                  {feedback.response && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <h4 className="font-medium text-green-900">Response</h4>
                        <span className="text-xs text-green-600">
                          {new Date(feedback.responseAt!).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-green-800">{feedback.response}</p>
                    </div>
                  )}
                  
                  {feedback.status === 'in-progress' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm text-yellow-800">
                          This feedback is currently being reviewed by our team.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trends Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span>Feedback Trends</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">67%</div>
                <div className="text-sm text-gray-600">Methodology Related</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">89%</div>
                <div className="text-sm text-gray-600">Response Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">2.3 days</div>
                <div className="text-sm text-gray-600">Avg Response Time</div>
              </div>
            </div>
          </CardContent>
        </Card>

      </main>
    </div>
  );
}