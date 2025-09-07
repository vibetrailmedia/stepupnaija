import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Wallet, Transaction, Round, Entry, Project, User } from "@shared/schema";
// Navigation is already provided by App.tsx for authenticated users
import { DrawEntryModal } from "@/components/DrawEntryModal";
import { CompactHero } from "@/components/CompactHero";
import { useState } from "react";
import { CandidateDashboard } from "@/components/role-dashboards/CandidateDashboard";
import { VerifiedLeaderDashboard } from "@/components/role-dashboards/VerifiedLeaderDashboard";
import { TrainedLeaderDashboard } from "@/components/role-dashboards/TrainedLeaderDashboard";
import { CivicLeaderDashboard } from "@/components/role-dashboards/CivicLeaderDashboard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { useLanguage } from "@/contexts/LanguageContext";
import { convertSupToNgn } from "@/utils/platform-constants";

// Role-based dashboard component selector
function RoleBasedDashboard({ user, wallet, supBalance, totalEntries, currentRound, onOpenDrawModal }: {
  user: any;
  wallet: Wallet | undefined;
  supBalance: number;
  totalEntries: number;
  currentRound?: any;
  onOpenDrawModal?: () => void;
}) {
  if (!user || !wallet) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const credibleLevel = user.credibleLevel || 0;
  
  // Determine which dashboard to show based on credible level
  switch (credibleLevel) {
    case 0:
      return <CandidateDashboard user={user} wallet={wallet} supBalance={supBalance} totalEntries={totalEntries} currentRound={currentRound} onOpenDrawModal={onOpenDrawModal} />;
    case 1:
      return <VerifiedLeaderDashboard user={user} wallet={wallet} supBalance={supBalance} totalEntries={totalEntries} />;
    case 2:
      return <TrainedLeaderDashboard user={user} wallet={wallet} supBalance={supBalance} totalEntries={totalEntries} />;
    case 3:
      return <CivicLeaderDashboard user={user} wallet={wallet} supBalance={supBalance} totalEntries={totalEntries} />;
    default:
      // Fallback to candidate dashboard for any other values
      return <CandidateDashboard user={user} wallet={wallet} supBalance={supBalance} totalEntries={totalEntries} currentRound={currentRound} onOpenDrawModal={onOpenDrawModal} />;
  }
}

export default function Dashboard() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [showDrawModal, setShowDrawModal] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Optimize with combined dashboard data fetch
  const { data: dashboardData, isLoading: dashboardLoading } = useQuery({
    queryKey: ["/api/dashboard-combined"],
    enabled: isAuthenticated,
    retry: false,
    staleTime: 30000, // Cache for 30 seconds
  });

  // Fallback to individual queries if combined endpoint fails
  const { data: wallet, isLoading: walletLoading } = useQuery<Wallet>({
    queryKey: ["/api/wallet"],
    enabled: isAuthenticated && !dashboardData,
    retry: false,
  });

  const { data: currentRound, isLoading: roundLoading } = useQuery<Round>({
    queryKey: ["/api/rounds/current"],
    enabled: isAuthenticated && !dashboardData,
    retry: false,
  });

  const { data: userEntries } = useQuery<Entry[]>({
    queryKey: ["/api/rounds", currentRound?.id, "entries"],
    enabled: isAuthenticated && !!currentRound?.id && !dashboardData,
    retry: false,
  });

  // Extract data from combined response or fallback
  const walletData = (dashboardData as any)?.wallet || wallet;
  const roundData = (dashboardData as any)?.currentRound || currentRound;
  const entriesData = (dashboardData as any)?.userEntries || userEntries;


  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30 flex items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-sm mx-auto">
          <LoadingSpinner size="lg" text="Loading your dashboard..." />
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">Welcome back!</h2>
            <p className="text-gray-600 leading-relaxed">Preparing your civic engagement dashboard for Nigerian democracy...</p>
          </div>
          
          {/* Mobile-friendly loading animation */}
          <div className="flex items-center justify-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading if dashboard data is being fetched
  if (dashboardLoading || (walletLoading && !dashboardData)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30 flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" text="Loading your data..." />
          <div className="max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Getting your latest information</h2>
            <p className="text-gray-600">Updating your SUP balance and civic activities...</p>
          </div>
        </div>
      </div>
    );
  }

  const totalEntries = entriesData?.reduce((sum: number, entry: Entry) => sum + (entry.tickets || 0), 0) || 0;
  const supBalance = parseFloat(walletData?.supBalance || '0');
  const ngnEquivalent = convertSupToNgn(supBalance);

  // Determine if user is new (created within last 7 days)
  const isNewUser = user?.createdAt ? 
    (Date.now() - new Date(user.createdAt).getTime()) < (7 * 24 * 60 * 60 * 1000) : false;
  
  const hasCompletedKYC = user?.kycStatus === 'APPROVED';
  const hasEarnedTokens = supBalance > 0;
  const hasParticipatedInProject = totalEntries > 0;
  
  // Show onboarding banner only for new users who haven't completed KYC
  const showOnboardingBanner = isNewUser && !hasCompletedKYC;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30 page-transition">
        {/* Navigation is provided by App.tsx for all authenticated users */}
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 space-y-8">
        {/* New User Onboarding Banner */}
        {showOnboardingBanner && (
          <div className="mb-8 bg-gradient-to-r from-green-600 via-green-500 to-blue-600 rounded-2xl p-6 lg:p-8 text-white shadow-xl border border-green-200/20 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 leading-tight">
                  Welcome to Nigeria's Civic Movement, {user?.firstName || 'Citizen'}! 🇳🇬
                </h2>
                <p className="text-green-50 mb-6 text-lg leading-relaxed">
                  Join millions of Nigerians participating in transparent governance, community projects, and democratic leadership selection. Follow these steps to get started.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className={`bg-white/10 backdrop-blur-sm rounded-xl p-4 transition-all hover:bg-white/20 ${hasCompletedKYC ? 'bg-green-400/30 border border-green-300/30' : 'border border-white/20'}`}>
                    <div className="flex items-center">
                      {hasCompletedKYC ? (
                        <span className="text-green-300 mr-2">✅</span>
                      ) : (
                        <span className="text-yellow-300 mr-2">1️⃣</span>
                      )}
                      <span className="text-sm font-medium">
                        {hasCompletedKYC ? 'Verification Complete' : 'Complete KYC Verification'}
                      </span>
                    </div>
                  </div>
                  <div className={`bg-white/10 backdrop-blur-sm rounded-xl p-4 transition-all hover:bg-white/20 ${hasEarnedTokens ? 'bg-green-400/30 border border-green-300/30' : 'border border-white/20'}`}>
                    <div className="flex items-center">
                      {hasEarnedTokens ? (
                        <span className="text-green-300 mr-2">✅</span>
                      ) : (
                        <span className="text-yellow-300 mr-2">2️⃣</span>
                      )}
                      <span className="text-sm font-medium">
                        {hasEarnedTokens ? 'SUP Tokens Earned' : 'Complete First Task'}
                      </span>
                    </div>
                  </div>
                  <div className={`bg-white/10 backdrop-blur-sm rounded-xl p-4 transition-all hover:bg-white/20 ${hasParticipatedInProject ? 'bg-green-400/30 border border-green-300/30' : 'border border-white/20'}`}>
                    <div className="flex items-center">
                      {hasParticipatedInProject ? (
                        <span className="text-green-300 mr-2">✅</span>
                      ) : (
                        <span className="text-yellow-300 mr-2">3️⃣</span>
                      )}
                      <span className="text-sm font-medium">
                        {hasParticipatedInProject ? 'Projects Supported' : 'Support a Project'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-6">
                  {!hasCompletedKYC && (
                    <a href="/kyc" className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-lg hover:shadow-xl hover:scale-105">
                      Start KYC Verification
                    </a>
                  )}
                  {!hasEarnedTokens && (
                    <a href="/engage" className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all border border-white/30 backdrop-blur-sm hover:scale-105">
                      Earn Your First SUP
                    </a>
                  )}
                  {!hasParticipatedInProject && hasEarnedTokens && (
                    <a href="/projects" className="bg-green-400 hover:bg-green-300 text-green-900 px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-lg hover:shadow-xl hover:scale-105">
                      Explore Projects
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Compact Hero Section - Enhanced */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-1">
          <CompactHero />
        </div>


        {/* Role-Based Dashboard Content - Hero-Style Container */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-2">
          <RoleBasedDashboard 
            user={user} 
            wallet={walletData} 
            supBalance={supBalance} 
            totalEntries={totalEntries}
            currentRound={roundData}
            onOpenDrawModal={() => setShowDrawModal(true)}
          />
        </div>
      </main>

      {showDrawModal && roundData && (
        <DrawEntryModal 
          round={roundData}
          wallet={walletData}
          userEntries={totalEntries}
          onClose={() => setShowDrawModal(false)}
        />
      )}
      </div>
    </ErrorBoundary>
  );
}