import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Sun } from "lucide-react";

interface PoolMeterProps {
  currentRound?: any;
  userEntries: number;
}

export function PoolMeter({ currentRound, userEntries }: PoolMeterProps) {
  const poolAmount = parseFloat(currentRound?.poolSUP || '4851340'); // Default pool in SUP
  const poolNGN = Math.round(poolAmount * 10); // Convert to NGN
  
  const prizesAmount = Math.round(poolNGN * 0.7);
  const projectsAmount = Math.round(poolNGN * 0.2);
  const platformAmount = Math.round(poolNGN * 0.1);

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-900">Live Community Pool</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Live</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Free Entry Notice */}
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-sm text-green-800">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-green-700 font-bold" />
              <span className="font-semibold">Free Entry:</span>
            </div>
            Complete civic tasks to earn SUP tokens and enter automatically - no purchase required!
          </div>
        </div>
        
        {/* Pool Breakdown */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Total Pool</span>
            <span className="text-lg font-bold text-gray-900" data-testid="text-total-pool">
              ₦{poolNGN.toLocaleString()}
            </span>
          </div>
          
          {/* Visual Pool Distribution */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div className="h-3 rounded-full flex">
              <div className="bg-yellow-500 h-3 rounded-l-full" style={{ width: '70%' }}></div>
              <div className="bg-accent-500 h-3" style={{ width: '20%' }}></div>
              <div className="bg-gray-400 h-3 rounded-r-full" style={{ width: '10%' }}></div>
            </div>
          </div>
          
          {/* Distribution Legend */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span className="text-gray-600">Prizes (70%)</span>
              <Badge variant="secondary" className="text-xs" data-testid="text-prizes-amount">
                ₦{prizesAmount.toLocaleString()}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-accent-500 rounded"></div>
              <span className="text-gray-600">Projects (20%)</span>
              <Badge variant="secondary" className="text-xs" data-testid="text-projects-amount">
                ₦{projectsAmount.toLocaleString()}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-400 rounded"></div>
              <span className="text-gray-600">Platform (10%)</span>
              <Badge variant="secondary" className="text-xs" data-testid="text-platform-amount">
                ₦{platformAmount.toLocaleString()}
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Draw Countdown */}
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-600 mb-1">Next Draw In</div>
              <div className="text-2xl font-bold text-gray-900" data-testid="text-countdown">
                2d 14h 23m
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-600 mb-1">Your Entries</div>
              <div className="text-xl font-bold text-primary-600" data-testid="text-user-entries">
                {userEntries}
              </div>
            </div>
          </div>
        </div>

        {/* Pool Growth Indicator */}
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1 text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>+₦{Math.round(poolNGN * 0.05).toLocaleString()} today</span>
          </div>
          <div className="text-gray-500">
            Round #{currentRound?.id?.slice(-6) || '000045'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
