import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";

interface RecentWinnersProps {
  winners: any[];
}

export function RecentWinners({ winners }: RecentWinnersProps) {
  // For enterprise deployment, only show actual winners from the database
  const displayWinners = winners || [];

  const getTierColor = (tier: number) => {
    switch (tier) {
      case 1:
        return 'from-yellow-400 to-yellow-600';
      case 2:
        return 'from-gray-400 to-gray-600';
      case 3:
        return 'from-amber-600 to-amber-800';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const maskName = (firstName: string, lastName: string) => {
    const firstChar = firstName?.charAt(0) || 'U';
    const lastChar = lastName?.charAt(0) || 'S';
    return `${firstChar}${firstName?.slice(1) || 'ser'}_${lastChar}**`;
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-900">Recent Winners</CardTitle>
          <Trophy className="w-5 h-5 text-yellow-500" />
        </div>
      </CardHeader>
      <CardContent>
        {displayWinners.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm font-medium">No recent winners</p>
            <p className="text-xs">Winners will appear here after the next prize draw</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayWinners.map((winner: any) => {
            const supAmount = parseFloat(winner.amountSUP || '0');
            const ngnAmount = Math.round(supAmount * 10);
            
            return (
              <div key={winner.id} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 bg-gradient-to-r ${getTierColor(winner.tier)} rounded-full flex items-center justify-center`}>
                    <span className="text-white text-sm font-bold">{winner.tier}</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900" data-testid={`text-winner-name-${winner.id}`}>
                      {maskName(winner.user?.firstName, winner.user?.lastName)}
                    </div>
                    <div className="text-xs text-gray-500" data-testid={`text-winner-round-${winner.id}`}>
                      Draw #{winner.round?.id?.slice(-2) || '44'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600" data-testid={`text-winner-amount-${winner.id}`}>
                    ₦{ngnAmount.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500" data-testid={`text-winner-time-${winner.id}`}>
                    {formatTimeAgo(winner.createdAt)}
                  </div>
                </div>
              </div>
            );
            })}
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Button 
            variant="ghost"
            className="w-full text-primary-600 text-sm font-medium hover:text-primary-700"
            data-testid="button-view-all-winners"
          >
            View All Winners
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
