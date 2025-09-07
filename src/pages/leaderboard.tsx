import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import EnhancedLeaderboard from '@/components/EnhancedLeaderboard';
import { Trophy } from 'lucide-react';

export default function Leaderboard() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to view the leaderboard.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Trophy className="w-4 h-4 text-white" />
          </div>
          <p className="text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Leaderboard</h1>
            <p className="text-lg text-gray-600">
              Celebrating the leaders building a better Nigeria 🇳🇬
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EnhancedLeaderboard />
      </div>
    </div>
  );
}