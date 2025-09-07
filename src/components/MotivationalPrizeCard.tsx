import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Star, 
  Clock, 
  TrendingUp,
  Gift,
  Zap,
  Users,
  Timer,
  Target
} from "lucide-react";

interface MotivationalPrizeCardProps {
  currentRound?: any;
  userEntries: number;
  supBalance: number;
  user?: any;
  onOpenDrawModal?: () => void;
}

export function MotivationalPrizeCard({ 
  currentRound, 
  userEntries, 
  supBalance,
  user,
  onOpenDrawModal 
}: MotivationalPrizeCardProps) {
  const [, setLocation] = useLocation();
  const [timeLeft, setTimeLeft] = useState('');
  const [participantCount, setParticipantCount] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [justEntered, setJustEntered] = useState(false);
  
  const poolAmount = parseFloat(currentRound?.poolSUP || '4851340');
  const poolNGN = Math.round(poolAmount * 10);
  const canEnter = supBalance >= 50;
  const isVerified = user?.kycStatus === 'APPROVED';
  const needsMoreSUP = 50 - supBalance;
  const needsVerification = !isVerified;
  
  // Calculate estimated odds
  const estimatedParticipants = participantCount || 1000; // Use dynamic participant count
  const userOdds = userEntries > 0 ? Math.round(estimatedParticipants / userEntries) : 0;
  
  // Countdown timer logic
  useEffect(() => {
    const calculateTimeLeft = () => {
      // Mock draw end time (7 days from now for demo)
      const drawEndTime = new Date();
      drawEndTime.setDate(drawEndTime.getDate() + 6);
      drawEndTime.setHours(23, 59, 59);
      
      const now = new Date().getTime();
      const distance = drawEndTime.getTime() - now;
      
      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        
        return `${days}d ${hours}h ${minutes}m`;
      }
      return 'Draw ended';
    };
    
    const updateTimer = () => {
      setTimeLeft(calculateTimeLeft());
    };
    
    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);
  
  // Use actual participant count from API or reasonable estimate
  useEffect(() => {
    // In production, this should come from the API/database
    // For now, use entry count as proxy for participant activity
    const estimatedCount = Math.max(userEntries * 50, 1000);
    setParticipantCount(estimatedCount);
  }, [userEntries]);

  // Recent entries should come from API in production
  // For enterprise deployment, this would be populated by real-time entry data
  const recentEntries: Array<{name: string; location: string; timeAgo: string}> = [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-2 border-yellow-300 bg-gradient-to-r from-yellow-100 via-orange-100 to-red-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10"></div>
        <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-orange-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      <CardHeader className="pb-3 px-4 sm:px-6 relative">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-lg sm:text-xl font-bold text-gray-900">
            <div className="relative">
              <Trophy className="h-6 w-6 sm:h-7 sm:w-7 text-yellow-600 animate-bounce" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
            </div>
            <div>
              <span className="hidden sm:block">Community Prize Draw</span>
              <span className="block sm:hidden">Prize Draw</span>
              <div className="text-xs text-gray-600 font-normal">Win up to ₦{Math.round(poolNGN * 0.4).toLocaleString()}!</div>
            </div>
          </CardTitle>
          <div className="flex flex-col items-end gap-1">
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs sm:text-sm font-bold px-3 py-1 shadow-lg animate-pulse">
              🔥 LIVE NOW
            </Badge>
            <div className="text-xs text-gray-600 font-medium">{participantCount.toLocaleString()} entries</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
        
        {/* Prize Amount - Enhanced */}
        <div className="relative text-center p-4 sm:p-5 bg-gradient-to-br from-white to-yellow-50 rounded-xl border-2 border-yellow-300 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-xl"></div>
          <div className="relative">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl animate-bounce">💰</span>
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text">
                ₦{poolNGN.toLocaleString()}
              </div>
              <span className="text-2xl animate-bounce delay-300">💎</span>
            </div>
            <div className="text-sm sm:text-base text-gray-700 font-semibold mb-4">Total Prize Pool</div>
            
            {/* Prize Breakdown */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-2 rounded-lg border border-yellow-300">
                <div className="text-sm font-bold text-yellow-800">🥇 ₦{Math.round(poolNGN * 0.4).toLocaleString()}</div>
                <div className="text-xs text-yellow-700">1st Prize</div>
              </div>
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-2 rounded-lg border border-gray-300">
                <div className="text-sm font-bold text-gray-800">🥈 ₦{Math.round(poolNGN * 0.2).toLocaleString()}</div>
                <div className="text-xs text-gray-700">2nd Prize</div>
              </div>
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-2 rounded-lg border border-orange-300">
                <div className="text-sm font-bold text-orange-800">🥉 ₦{Math.round(poolNGN * 0.1).toLocaleString()}</div>
                <div className="text-xs text-orange-700">3rd Prize</div>
              </div>
            </div>
          </div>
          
          {/* Countdown Timer - Enhanced */}
          <div className="mb-4 p-3 bg-gradient-to-r from-red-100 to-pink-100 rounded-lg border-2 border-red-300 shadow-md">
            <div className="flex items-center justify-center gap-2 text-sm font-bold text-red-800">
              <Timer className="h-4 w-4 animate-spin" />
              <span>Draw closes in: {timeLeft}</span>
            </div>
          </div>
          
          {/* Participant Count & Odds */}
          <div className="mb-3 grid grid-cols-2 gap-2">
            <div className="p-2 bg-green-50 rounded-lg border border-green-200">
              <div className="text-xs font-semibold text-green-800">Players Entered</div>
              <div className="flex items-center justify-center gap-1 text-sm font-bold text-green-700">
                <Users className="h-4 w-4" />
                {estimatedParticipants.toLocaleString()}
              </div>
            </div>
            {userEntries > 0 ? (
              <div className="p-2 sm:p-3 bg-purple-50 rounded-lg border border-purple-200 min-h-[60px] flex flex-col justify-center">
                <div className="text-xs font-semibold text-purple-800 text-center mb-1">Your Odds</div>
                <div className="flex items-center justify-center gap-1 text-sm font-bold text-purple-700">
                  <Target className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm">1 in {userOdds}</span>
                </div>
              </div>
            ) : (
              <div className="p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-200 min-h-[60px] flex flex-col justify-center relative">
                <div className="text-xs font-semibold text-blue-800 text-center mb-1">Quick Entry</div>
                <Button 
                  size="sm" 
                  type="button"
                  disabled={false}
                  className="text-xs h-8 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold shadow-md hover:shadow-lg transition-all cursor-pointer z-10 relative pointer-events-auto touch-manipulation"
                  style={{ pointerEvents: 'auto' }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Quick Entry clicked:', { canEnter, isVerified, needsVerification, userKycStatus: user?.kycStatus });
                    if (canEnter && isVerified) {
                      onOpenDrawModal?.();
                    } else if (!isVerified) {
                      console.log('Verify Now clicked - navigating to KYC');
                      setLocation('/kyc');
                      // Scroll to top after navigation
                      setTimeout(() => window.scrollTo(0, 0), 100);
                    } else {
                      setLocation('/engage');
                      setTimeout(() => window.scrollTo(0, 0), 100);
                    }
                  }}
                >
                  {!isVerified ? 'Verify Now' : canEnter ? 'Enter' : 'Earn SUP'}
                </Button>
              </div>
            )}
          </div>
          
          {/* Entry Requirements */}
          <div className="mb-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-xs font-semibold text-blue-800 mb-1">Entry Requirements</div>
            <div className="flex items-center justify-center gap-4 text-xs text-blue-700">
              <span>50 SUP tokens</span>
              <span>•</span>
              <span>Verified identity</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <span>70% Winners</span>
            <span>20% Projects</span>
            <span>10% Platform</span>
          </div>
        </div>

        {/* User Status - Always show appropriate section */}
        {canEnter && isVerified ? (
          <div className="space-y-3">
            {userEntries > 0 ? (
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="p-3 bg-green-50 border border-green-200 rounded-lg relative overflow-hidden"
              >
                <div className="flex items-center gap-2 mb-2">
                  <motion.div
                    animate={{ rotate: justEntered ? [0, 360] : 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Star className="h-4 w-4 text-green-600" />
                  </motion.div>
                  <span className="font-semibold text-green-800">You're In!</span>
                  {justEntered && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.2, 1] }}
                      className="text-xl"
                    >
                      🎉
                    </motion.span>
                  )}
                </div>
                <div className="text-sm text-green-700">
                  You have <strong>{userEntries} entries</strong> in today's draw
                </div>
                
                {/* Celebration confetti overlay */}
                <AnimatePresence>
                  {showCelebration && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center bg-green-100 bg-opacity-90"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.2, 1] }}
                        className="text-4xl"
                      >
                        🎊
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-blue-600" />
                    <span className="font-semibold text-blue-800">Ready to Enter!</span>
                  </div>
                  <div className="text-sm text-blue-700 mb-3">
                    You have <strong>{supBalance.toFixed(0)} SUP tokens</strong> - enough for {Math.floor(supBalance / 50)} entries
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      onClick={() => {
                        setShowCelebration(true);
                        setJustEntered(true);
                        setTimeout(() => setShowCelebration(false), 2000);
                        onOpenDrawModal?.();
                      }}
                      className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 sm:py-4 rounded-lg shadow-md hover:shadow-lg transition-all text-sm sm:text-base h-12 sm:h-14 touch-manipulation"
                      data-testid="button-enter-prize-draw"
                    >
                      🎯 Enter Prize Draw (50 SUP)
                    </Button>
                  </motion.div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {!isVerified && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg shadow-md">
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="h-4 w-4 text-red-600" />
                  <span className="font-semibold text-red-800">Verification Required</span>
                </div>
                <div className="text-sm text-red-700 mb-3">
                  Complete identity verification to enter prize draws and earn SUP tokens
                </div>
                <Button 
                  onClick={() => {
                    console.log('Verify Identity clicked - navigating to KYC');
                    setLocation('/kyc');
                    // Scroll to top after navigation
                    setTimeout(() => window.scrollTo(0, 0), 100);
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-sm sm:text-base h-12 sm:h-14 shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-[1.02]"
                >
                  🔐 Verify Identity Now
                </Button>
              </div>
            )}
            
            {!canEnter && isVerified && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="h-4 w-4 text-orange-600" />
                  <span className="font-semibold text-orange-800">Almost Ready!</span>
                </div>
                <div className="text-sm text-orange-700 mb-3">
                  Earn <strong>{needsMoreSUP.toFixed(0)} more SUP tokens</strong> to enter the prize draw
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>SUP Progress</span>
                    <span>{supBalance.toFixed(0)}/50</span>
                  </div>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1, delay: 0.2 }}
                  >
                    <Progress value={(supBalance / 50) * 100} className="h-2 sm:h-3" />
                  </motion.div>
                </div>
                <Button 
                  onClick={() => {
                    setLocation('/engage');
                    setTimeout(() => window.scrollTo(0, 0), 100);
                  }}
                  variant="outline"
                  className="w-full border-orange-300 text-orange-700 hover:bg-orange-100 font-semibold"
                >
                  Earn SUP Tokens
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Social Proof */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Users className="h-4 w-4" />
            Recent Entries
          </div>
          {recentEntries.map((entry, index) => (
            <div key={index} className="flex items-center justify-between text-xs text-gray-600 bg-white p-2 rounded border">
              <span><strong>{entry.name}</strong> from {entry.location}</span>
              <span className="text-gray-500">{entry.timeAgo}</span>
            </div>
          ))}
        </div>

        {/* Draw Timing */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 bg-white p-3 rounded-lg border">
          <Clock className="h-4 w-4" />
          <span>Next draw in <strong>23h 45m</strong> - Enter before midnight!</span>
        </div>

        {/* Motivation Message */}
        <div className="text-center p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
          <div className="text-sm text-green-800 font-medium mb-1">
            🌟 Free Entry - No Purchase Required!
          </div>
          <div className="text-xs text-green-700">
            SUP tokens are earned through civic participation, keeping the draw fair and community-focused
          </div>
        </div>
      </CardContent>
      </Card>
    </motion.div>
  );
}