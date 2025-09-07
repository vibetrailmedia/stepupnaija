import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MessageCircle, 
  Users, 
  MapPin, 
  Clock,
  TrendingUp,
  Pin,
  Lock
} from "lucide-react";

interface ForumCategory {
  id: string;
  name: string;
  description: string;
  state?: string;
  lga?: string;
  threadCount: number;
  replyCount: number;
  isActive: boolean;
  iconColor: string;
  lastActivity?: string;
}

interface CommunityForumCardProps {
  categories: ForumCategory[];
  className?: string;
  onCategoryClick?: (categoryId: string) => void;
}

export function CommunityForumCard({ 
  categories = [], 
  className = "",
  onCategoryClick 
}: CommunityForumCardProps) {
  
  const handleCategoryClick = (categoryId: string) => {
    if (onCategoryClick) {
      onCategoryClick(categoryId);
    } else {
      // Default navigation to forums page
      window.location.href = `/forums/${categoryId}`;
    }
  };

  // Sort categories by activity level
  const sortedCategories = [...categories].sort((a, b) => 
    (b.threadCount + b.replyCount) - (a.threadCount + a.replyCount)
  );

  const getLocationBadge = (category: ForumCategory) => {
    if (category.lga) {
      return `${category.lga}, ${category.state}`;
    } else if (category.state) {
      return category.state;
    } else {
      return "National";
    }
  };

  const getActivityLevel = (category: ForumCategory) => {
    const totalActivity = category.threadCount + category.replyCount;
    if (totalActivity >= 50) return { level: "High", color: "text-green-600" };
    if (totalActivity >= 20) return { level: "Medium", color: "text-yellow-600" };
    if (totalActivity >= 5) return { level: "Low", color: "text-blue-600" };
    return { level: "New", color: "text-gray-500" };
  };

  const formatTimeAgo = (dateString?: string) => {
    if (!dateString) return "No activity";
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  if (categories.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <MessageCircle className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="font-semibold text-gray-700 mb-2">No Forum Categories</h3>
          <p className="text-gray-500 text-sm max-w-md">
            Community forums will appear here once they are created for your area. 
            Join the conversation and connect with fellow citizens!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-blue-600" />
          Community Forums ({categories.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedCategories.map((category) => {
          const activity = getActivityLevel(category);
          
          return (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg font-bold group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: category.iconColor }}
                >
                  {category.name.charAt(0).toUpperCase()}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    {!category.isActive && (
                      <Lock className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{getLocationBadge(category)}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      <span>{category.threadCount} topics</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{category.replyCount} replies</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      <span className={activity.color}>{activity.level}</span>
                    </div>
                  </div>
                  
                  {category.lastActivity && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                      <Clock className="h-3 w-3" />
                      <span>Last activity {formatTimeAgo(category.lastActivity)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        
        {categories.length > 3 && (
          <Button 
            variant="ghost" 
            className="w-full mt-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            onClick={() => window.location.href = '/forums'}
          >
            View All Forums →
          </Button>
        )}
      </CardContent>
    </Card>
  );
}