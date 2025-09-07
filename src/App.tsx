import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import ErrorBoundary from "@/components/ErrorBoundary";
import { AgeVerificationModal } from "@/components/AgeVerificationModal";
import { useState, useEffect, Suspense, lazy } from "react";
import { Navigation } from "@/components/Navigation";
import { CivicGuideChat } from "@/components/CivicGuideChat";
import { Footer } from "@/components/Footer";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { setupGlobalErrorHandlers } from "@/lib/globalErrorHandler";

// Lazy load all page components for better performance
const Landing = lazy(() => import("@/pages/landing-comprehensive"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const Wallet = lazy(() => import("@/pages/wallet"));
const Engage = lazy(() => import("@/pages/engage"));
const Projects = lazy(() => import("@/pages/projects"));
const Transparency = lazy(() => import("@/pages/transparency"));
const Profile = lazy(() => import("@/pages/profile"));
const KYC = lazy(() => import("@/pages/kyc"));
const Admin = lazy(() => import("@/pages/admin"));
const Treasury = lazy(() => import("@/pages/treasury"));
const Education = lazy(() => import("@/pages/education"));
const Geography = lazy(() => import("@/pages/geography"));
const Notifications = lazy(() => import("@/pages/Notifications"));
const Challenge = lazy(() => import("@/pages/challenge"));
const Nominate = lazy(() => import("@/pages/nominate"));
const Candidates = lazy(() => import("@/pages/candidates"));
const Training = lazy(() => import("@/pages/training"));
const Network = lazy(() => import("@/pages/network"));
const Voting = lazy(() => import("@/pages/voting"));
const ForumPage = lazy(() => import("@/pages/forum"));
const ForumThreadPage = lazy(() => import("@/pages/forum-thread"));
const SimpleAuthPage = lazy(() => import("@/pages/simple-auth"));
const ResetPasswordPage = lazy(() => import("@/pages/reset-password"));
const Events = lazy(() => import("@/pages/events"));
const VerificationPage = lazy(() => import("@/pages/verification"));
const ProgressDashboard = lazy(() => import("@/pages/progress-dashboard"));
const ProjectDetail = lazy(() => import("@/pages/ProjectDetails"));
const AboutPage = lazy(() => import("@/pages/about"));
const FAQPage = lazy(() => import("@/pages/faq"));
const ContactPage = lazy(() => import("@/pages/contact"));
const HelpPage = lazy(() => import("@/pages/help"));
const TermsPage = lazy(() => import("@/pages/terms"));
const PrivacyPage = lazy(() => import("@/pages/privacy"));
const SecurityPage = lazy(() => import("@/pages/security"));
const NotFound = lazy(() => import("@/pages/not-found"));
const FoundersWall = lazy(() => import("@/pages/founders-wall"));
const CommunityChat = lazy(() => import("@/pages/community-chat"));
const QuizCenter = lazy(() => import("@/pages/quiz-center"));
const Leaderboard = lazy(() => import("@/pages/leaderboard"));
const SUPDashboard = lazy(() => import("@/pages/sup-dashboard"));
const CampusPage = lazy(() => import("@/pages/campus"));
const NyscCampsPage = lazy(() => import("@/pages/nysc-camps"));
const LeadershipPortalPage = lazy(() => import("@/pages/leadership-portal"));
const TopSchoolsPage = lazy(() => import("@/pages/top-schools"));
const MethodologyPage = lazy(() => import("@/pages/methodology"));
const DataSubmissionPage = lazy(() => import("@/pages/data-submission"));
const FeedbackPage = lazy(() => import("@/pages/feedback"));
const FeedbackViewPage = lazy(() => import("@/pages/feedback-view"));
const CommitteePage = lazy(() => import("@/pages/committee"));
const VolunteerOnboarding = lazy(() => import("@/pages/volunteer-onboarding"));
const VolunteerDashboard = lazy(() => import("@/pages/volunteer-dashboard"));
const MeetYourGuidesPage = lazy(() => import("@/pages/meet-your-guides"));
const VideoLibraryPage = lazy(() => import("@/pages/video-library"));
const AvatarStudio = lazy(() => import("@/pages/avatar-studio"));
const Onboarding = lazy(() => import("@/pages/Onboarding"));

// Loading component for Suspense fallback
function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>
  );
}

function Router() {
  const { user, isAuthenticated, isLoading, logoutMutation } = useAuth();
  const [showAgeVerification, setShowAgeVerification] = useState(false);

  // Check if user needs age verification
  useEffect(() => {
    if (isAuthenticated && user && !(user as any).ageVerified) {
      setShowAgeVerification(true);
    } else {
      setShowAgeVerification(false);
    }
  }, [isAuthenticated, user]);

  // Show age verification modal if needed
  if (showAgeVerification) {
    return (
      <AgeVerificationModal
        onVerified={() => setShowAgeVerification(false)}
      />
    );
  }

  // Show loading state during authentication to prevent 404 flashes
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Router state management

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && (
        <Navigation 
          user={user} 
          isAuthenticated={isAuthenticated}
          onLogout={() => logoutMutation.mutate()}
        />
      )}
      {isAuthenticated && <CivicGuideChat />}
      
      <Suspense fallback={<LoadingSpinner />}>
        <Switch>
          {/* Public routes available to everyone */}
          <Route path="/about" component={AboutPage} />
          <Route path="/faq" component={FAQPage} />
          <Route path="/contact" component={ContactPage} />
          <Route path="/help" component={HelpPage} />
          <Route path="/terms" component={TermsPage} />
          <Route path="/privacy" component={PrivacyPage} />
          <Route path="/security" component={SecurityPage} />
          <Route path="/auth" component={SimpleAuthPage} />
          <Route path="/reset-password/:token" component={ResetPasswordPage} />
          
          {/* Onboarding route for new authenticated users */}
          <Route path="/onboarding" component={() => <ProtectedRoute><Onboarding /></ProtectedRoute>} />
          
          {/* Home route - Smart routing based on authentication and onboarding status */}
          <Route path="/" component={() => {
            if (!isAuthenticated) return <Landing />;
            
            // Check if user needs onboarding (new users who haven't completed it)
            const needsOnboarding = user && !(user as any).onboardingCompleted;
            if (needsOnboarding) {
              return <ProtectedRoute><Onboarding /></ProtectedRoute>;
            }
            
            return <ProtectedRoute><Dashboard /></ProtectedRoute>;
          }} />
          
          {/* Protected routes - require authentication */}
          <Route path="/dashboard" component={() => <ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/wallet" component={() => <ProtectedRoute><Wallet /></ProtectedRoute>} />
          <Route path="/engage" component={() => <ProtectedRoute><Engage /></ProtectedRoute>} />
          <Route path="/projects" component={() => <ProtectedRoute><Projects /></ProtectedRoute>} />
          <Route path="/leaderboard" component={() => <ProtectedRoute><Leaderboard /></ProtectedRoute>} />
          <Route path="/projects/:projectId" component={() => <ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
          <Route path="/transparency" component={() => <ProtectedRoute><Transparency /></ProtectedRoute>} />
          <Route path="/profile" component={() => <ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/kyc" component={() => <ProtectedRoute><KYC /></ProtectedRoute>} />
          <Route path="/admin" component={() => <ProtectedRoute><Admin /></ProtectedRoute>} />
          <Route path="/treasury" component={() => <ProtectedRoute><Treasury /></ProtectedRoute>} />
          <Route path="/education" component={() => <ProtectedRoute><Education /></ProtectedRoute>} />
          <Route path="/geography" component={() => <ProtectedRoute><Geography /></ProtectedRoute>} />
          <Route path="/notifications" component={() => <ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/challenge" component={() => <ProtectedRoute><Challenge /></ProtectedRoute>} />
          <Route path="/nominate" component={() => <ProtectedRoute><Nominate /></ProtectedRoute>} />
          <Route path="/candidates" component={() => <ProtectedRoute><Candidates /></ProtectedRoute>} />
          <Route path="/training" component={() => <ProtectedRoute><Training /></ProtectedRoute>} />
          <Route path="/network" component={() => <ProtectedRoute><Network /></ProtectedRoute>} />
          <Route path="/voting" component={() => <ProtectedRoute><Voting /></ProtectedRoute>} />
          <Route path="/forum" component={() => <ProtectedRoute><ForumPage /></ProtectedRoute>} />
          <Route path="/forum/thread/:threadId" component={() => <ProtectedRoute><ForumThreadPage /></ProtectedRoute>} />
          <Route path="/community-chat" component={() => <ProtectedRoute><CommunityChat /></ProtectedRoute>} />
          <Route path="/events" component={() => <ProtectedRoute><Events /></ProtectedRoute>} />
          <Route path="/verification" component={() => <ProtectedRoute><VerificationPage /></ProtectedRoute>} />
          <Route path="/progress" component={() => <ProtectedRoute><ProgressDashboard /></ProtectedRoute>} />
          <Route path="/founders-wall" component={() => <ProtectedRoute><FoundersWall /></ProtectedRoute>} />
          <Route path="/quiz-center" component={() => <ProtectedRoute><QuizCenter /></ProtectedRoute>} />
          <Route path="/sup-dashboard" component={() => <ProtectedRoute><SUPDashboard /></ProtectedRoute>} />
          <Route path="/campus" component={() => <ProtectedRoute><CampusPage /></ProtectedRoute>} />
          <Route path="/nysc-camps" component={() => <ProtectedRoute><NyscCampsPage /></ProtectedRoute>} />
          <Route path="/leadership-portal" component={() => <ProtectedRoute><LeadershipPortalPage /></ProtectedRoute>} />
          <Route path="/top-schools" component={() => <ProtectedRoute><TopSchoolsPage /></ProtectedRoute>} />
          <Route path="/methodology" component={() => <ProtectedRoute><MethodologyPage /></ProtectedRoute>} />
          <Route path="/data-submission" component={() => <ProtectedRoute><DataSubmissionPage /></ProtectedRoute>} />
          <Route path="/feedback" component={() => <ProtectedRoute><FeedbackPage /></ProtectedRoute>} />
          <Route path="/feedback/view" component={() => <ProtectedRoute><FeedbackViewPage /></ProtectedRoute>} />
          <Route path="/committee" component={() => <ProtectedRoute><CommitteePage /></ProtectedRoute>} />
          <Route path="/volunteer-onboarding" component={() => <ProtectedRoute><VolunteerOnboarding /></ProtectedRoute>} />
          <Route path="/volunteer-dashboard" component={() => <ProtectedRoute><VolunteerDashboard /></ProtectedRoute>} />
          {/* Public routes - accessible without authentication */}
          <Route path="/meet-your-guides" component={MeetYourGuidesPage} />
          <Route path="/video-library" component={VideoLibraryPage} />
          
          <Route path="/avatar-studio" component={() => <ProtectedRoute><AvatarStudio /></ProtectedRoute>} />
        
        {/* 404 fallback only for truly unmatched routes */}
          <Route component={NotFound} />
        </Switch>
      </Suspense>

      <Footer />
    </div>
  );
}

function App() {
  // Set up global error handlers when the app initializes
  useEffect(() => {
    setupGlobalErrorHandlers();
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
