import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, MapPin } from "lucide-react";

export function CompactHero() {
  return (
    <div className="bg-gradient-to-r from-green-600 via-green-700 to-blue-700 rounded-xl p-4 shadow-lg mb-6">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-white text-green-700 font-bold text-xs">
              🇳🇬 #13kCredibleChallenge
            </Badge>
            <Badge className="bg-red-500 text-white text-xs font-semibold">
              30 DAYS LEFT
            </Badge>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-white mb-2">
            Nigeria's Leadership Network
          </h1>
          <p className="text-green-100 text-sm lg:text-base">
            Join <strong>millions of Nigerians</strong> democratically selecting 13,000 credible leaders across all 774 LGAs
          </p>
        </div>
        
        <div className="flex items-center gap-6 text-white">
          <div className="text-center">
            <div className="flex items-center gap-1 mb-1">
              <Users className="h-4 w-4" />
              <span className="text-2xl font-bold">2.1M+</span>
            </div>
            <div className="text-xs text-green-100">Citizens Voting</div>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-1 mb-1">
              <MapPin className="h-4 w-4" />
              <span className="text-2xl font-bold">542</span>
            </div>
            <div className="text-xs text-green-100">LGAs Active</div>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-1 mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-2xl font-bold">13K</span>
            </div>
            <div className="text-xs text-green-100">Leaders Target</div>
          </div>
        </div>
      </div>
    </div>
  );
}