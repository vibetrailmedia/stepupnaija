import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Crown, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

interface FoundersWallUser {
  id: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  citizenNumber: number;
  state?: string;
  lga?: string;
  createdAt: string;
}

export default function FoundersWall() {
  const [, setLocation] = useLocation();
  const [offset, setOffset] = useState(0);
  const limit = 50;

  const { data: foundersUsers = [], isLoading } = useQuery<FoundersWallUser[]>({
    queryKey: ["/api/founders-wall", { limit, offset }],
    retry: false,
  });

  const loadMore = () => {
    setOffset(prev => prev + limit);
  };

  const loadPrevious = () => {
    setOffset(prev => Math.max(0, prev - limit));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/")}
              className="mr-4"
              data-testid="button-back-to-dashboard"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Crown className="w-12 h-12 text-yellow-600 mr-3" />
              <Users className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Founders Wall
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              Celebrating Nigeria's First 10,000 Civic Champions
            </p>
            <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">
              🎖️ Founding Citizens Hall of Fame
            </Badge>
          </div>
        </div>

        {/* Introduction */}
        <Card className="mb-8 border-2 border-green-200">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Making History Together
            </h2>
            <p className="text-gray-700 leading-relaxed">
              These brave Nigerians stepped up when it mattered most. As the first 10,000 citizens 
              to join Step Up Naija, they believed in democratic change and took action to build 
              a better Nigeria. Their names will forever be remembered as the founding generation 
              of Nigeria's largest civic movement.
            </p>
          </CardContent>
        </Card>

        {/* Founders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {foundersUsers.map((user) => (
            <Card 
              key={user.id} 
              className="border-2 border-green-200 hover:border-green-300 transition-colors"
              data-testid={`founder-card-${user.citizenNumber}`}
            >
              <CardHeader className="text-center pb-2">
                <Avatar className="w-16 h-16 mx-auto mb-3 border-2 border-green-200">
                  <AvatarImage src={user.profileImageUrl} alt={`${user.firstName} ${user.lastName}`} />
                  <AvatarFallback className="bg-green-100 text-green-800 text-lg font-bold">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-lg">
                  {user.firstName} {user.lastName}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-2">
                  <Badge className="bg-green-100 text-green-800 font-bold">
                    Citizen #{user.citizenNumber.toLocaleString()}
                  </Badge>
                  {user.state && (
                    <div className="text-sm text-gray-600">
                      {user.lga ? `${user.lga}, ` : ''}{user.state}
                    </div>
                  )}
                  <div className="text-xs text-gray-500">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                  <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                    🎖️ Pioneer Badge
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {foundersUsers.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Crown className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Founding Citizens
              </h3>
              <p className="text-gray-600">
                The first 10,000 founding citizens will be displayed here.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {foundersUsers.length > 0 && (
          <div className="flex justify-center items-center gap-4">
            <Button
              variant="outline"
              onClick={loadPrevious}
              disabled={offset === 0}
              data-testid="button-previous-page"
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Showing {offset + 1} - {offset + foundersUsers.length} of first 10,000
            </span>
            <Button
              variant="outline"
              onClick={loadMore}
              disabled={foundersUsers.length < limit}
              data-testid="button-next-page"
            >
              Next
            </Button>
          </div>
        )}
      </div>
      
    </div>
  );
}