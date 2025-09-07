import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, Menu, ChevronDown, Settings, HelpCircle, Shield, UserCheck, LogOut, Users, MessageSquare, Calendar, BarChart3, Lock, Vote, Wallet, MoreHorizontal, GraduationCap, MapPin, Bell, Crown, BookOpen, Coins, Trophy, Heart, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import primaryLogo from "../assets/primary-logo.png";
import { LanguageSelector } from "./LanguageSelector";
import { Link, useLocation } from "wouter";
import { scrollToTop } from "@/utils/scroll-utils";
// Language context temporarily disabled

interface NavigationProps {
  user?: any;
  wallet?: any; // Keep for backward compatibility
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

export function Navigation({ user, isAuthenticated = false, onLogout }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Translation temporarily disabled

  // Fetch wallet data directly in Navigation component
  const { data: walletData } = useQuery({
    queryKey: ['/api/wallet'],
    enabled: isAuthenticated,
  });

  const supBalance = parseFloat((walletData as any)?.supBalance || '0');
  const ngnEquivalent = Math.round(supBalance * 10);

  return (
    <nav className="bg-gradient-to-r from-green-50/80 via-white/90 to-blue-50/80 border-b border-green-200/30 sticky top-0 z-50 shadow-xl backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Brand Section */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center py-2 px-2 rounded-lg hover:bg-gray-50 transition-colors"
              aria-label="Step Up Naija - Nigeria's Leadership Platform"
              onClick={scrollToTop}
            >
              <img 
                src={primaryLogo} 
                alt="Step Up Naija Official Logo" 
                className="h-7 sm:h-8 lg:h-10 w-auto object-contain block"
                data-testid="img-primary-logo"
                onError={() => {}}
                onLoad={() => {}}
                style={{ 
                  minWidth: '28px',
                  maxHeight: '40px',
                  visibility: 'visible',
                  opacity: 1
                }}
              />
            </Link>
          </div>
          
          {/* Main Navigation - Optimized for User Journey */}
          <div className="hidden lg:flex items-center space-x-1">
            {/* Core Navigation Items */}
            <Link to="/" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors" data-testid="link-dashboard" onClick={scrollToTop}>
              Dashboard
            </Link>
            
            <Link to="/engage" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors" data-testid="link-engage" onClick={scrollToTop}>
              Engage
            </Link>
            
            {/* #13k Challenge - Featured Program */}
            <Link to="/challenge" className="px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 rounded-md shadow-sm transition-all duration-200 hover:shadow-md border border-primary-400/20 whitespace-nowrap" data-testid="link-challenge-featured" onClick={scrollToTop}>
              🗳️ #13k Challenge
            </Link>
            
            <Link to="/projects" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors" data-testid="link-projects" onClick={scrollToTop}>
              Projects
            </Link>
            
            <Link to="/candidates" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors" data-testid="link-candidates" onClick={scrollToTop}>
              Leaders
            </Link>
            
            
            {/* Community Dropdown - Secondary Features */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors" data-testid="dropdown-community">
                  Community
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                {/* Campus Section */}
                <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Campus</div>
                <DropdownMenuItem asChild>
                  <a href="/campus" className="flex items-center py-2" data-testid="link-campus-overview">
                    <GraduationCap className="h-4 w-4 mr-3" />
                    <div>
                      <div className="font-medium">Campus Communities</div>
                      <div className="text-xs text-gray-500">Universities & student unions</div>
                    </div>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/nysc-camps" className="flex items-center py-2" data-testid="link-nysc-camps">
                    <Shield className="h-4 w-4 mr-3" />
                    <div>
                      <div className="font-medium">NYSC Camps</div>
                      <div className="text-xs text-gray-500">Corps member features</div>
                    </div>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/leadership-portal" className="flex items-center py-2" data-testid="link-leadership-portal">
                    <Crown className="h-4 w-4 mr-3" />
                    <div>
                      <div className="font-medium">Leadership Portal</div>
                      <div className="text-xs text-gray-500">Student leader tools</div>
                    </div>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {/* Social Features */}
                <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Social</div>
                <DropdownMenuItem asChild>
                  <a href="/events" className="flex items-center py-2" data-testid="link-events">
                    <Calendar className="h-4 w-4 mr-3" />
                    <div>
                      <div className="font-medium">Events</div>
                      <div className="text-xs text-gray-500">Civic events & meetups</div>
                    </div>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/forum" className="flex items-center py-2" data-testid="link-forum">
                    <MessageSquare className="h-4 w-4 mr-3" />
                    <div>
                      <div className="font-medium">Forum</div>
                      <div className="text-xs text-gray-500">Community discussions</div>
                    </div>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/leaderboard" className="flex items-center py-2" data-testid="link-leaderboard">
                    <Trophy className="h-4 w-4 mr-3" />
                    <div>
                      <div className="font-medium">Leaderboard</div>
                      <div className="text-xs text-gray-500">Community rankings</div>
                    </div>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/network" className="flex items-center py-2" data-testid="link-network">
                    <Users className="h-4 w-4 mr-3" />
                    <div>
                      <div className="font-medium">Network</div>
                      <div className="text-xs text-gray-500">Connect with peers</div>
                    </div>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/training" className="flex items-center py-2" data-testid="link-training">
                    <BookOpen className="h-4 w-4 mr-3" />
                    <div>
                      <div className="font-medium">Training</div>
                      <div className="text-xs text-gray-500">Leadership development</div>
                    </div>
                  </a>
                </DropdownMenuItem>
                {/* Volunteer Section - Consolidated */}
                {user?.userType === 'VOLUNTEER' && user?.volunteerStatus === 'ACTIVE' ? (
                  <DropdownMenuItem asChild>
                    <a href="/volunteer-dashboard" className="flex items-center py-2" data-testid="link-volunteer-dashboard">
                      <Heart className="h-4 w-4 mr-3" />
                      <div>
                        <div className="font-medium">Volunteer Hub</div>
                        <div className="text-xs text-gray-500">Active volunteer dashboard</div>
                      </div>
                    </a>
                  </DropdownMenuItem>
                ) : user?.userType === 'VOLUNTEER' && user?.volunteerStatus === 'INACTIVE' ? (
                  <DropdownMenuItem asChild>
                    <button 
                      onClick={async () => {
                        try {
                          await fetch('/api/volunteer/opt-in', { method: 'POST' });
                          window.location.reload();
                        } catch (error) {
                          console.error('Failed to opt in:', error);
                        }
                      }}
                      className="flex items-center py-2 w-full text-left" 
                      data-testid="button-volunteer-opt-in"
                    >
                      <Heart className="h-4 w-4 mr-3" />
                      <div>
                        <div className="font-medium">Rejoin Volunteers</div>
                        <div className="text-xs text-gray-500">Reactivate volunteer status</div>
                      </div>
                    </button>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem asChild>
                    <a href="/volunteer-onboarding" className="flex items-center py-2" data-testid="link-volunteer-onboarding">
                      <Heart className="h-4 w-4 mr-3" />
                      <div>
                        <div className="font-medium">Become a Volunteer</div>
                        <div className="text-xs text-gray-500">Join civic engagement</div>
                      </div>
                    </a>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <a href="/meet-your-guides" className="flex items-center py-2" data-testid="link-meet-your-guides">
                    <MessageSquare className="h-4 w-4 mr-3" />
                    <div>
                      <div className="font-medium">Meet Your Guides</div>
                      <div className="text-xs text-gray-500">Meet Tari & Kamsi</div>
                    </div>
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Tools Dropdown - Utility Features */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors" data-testid="dropdown-tools">
                  Tools
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-64">
                {/* Financial Tools */}
                <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Financial</div>
                <DropdownMenuItem asChild>
                  <a href="/wallet" className="flex items-center py-2" data-testid="link-wallet">
                    <Wallet className="h-4 w-4 mr-3" />
                    <div>
                      <div className="font-medium">Wallet</div>
                      <div className="text-xs text-gray-500">SUP tokens & transactions</div>
                    </div>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/sup-dashboard" className="flex items-center py-2" data-testid="link-sup-dashboard">
                    <Coins className="h-4 w-4 mr-3" />
                    <div>
                      <div className="font-medium">SUP Dashboard</div>
                      <div className="text-xs text-gray-500">Token analytics</div>
                    </div>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/treasury" className="flex items-center py-2" data-testid="link-treasury">
                    <Lock className="h-4 w-4 mr-3" />
                    <div>
                      <div className="font-medium">Treasury</div>
                      <div className="text-xs text-gray-500">Community funds</div>
                    </div>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {/* Analytics & Learning */}
                <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Analytics</div>
                <DropdownMenuItem asChild>
                  <a href="/progress" className="flex items-center py-2" data-testid="link-progress">
                    <BarChart3 className="h-4 w-4 mr-3" />
                    <div>
                      <div className="font-medium">Progress Tracking</div>
                      <div className="text-xs text-gray-500">Challenge analytics</div>
                    </div>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/transparency" className="flex items-center py-2" data-testid="link-transparency">
                    <Shield className="h-4 w-4 mr-3" />
                    <div>
                      <div className="font-medium">Transparency</div>
                      <div className="text-xs text-gray-500">Impact methodology</div>
                    </div>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/geography" className="flex items-center py-2" data-testid="link-geography">
                    <MapPin className="h-4 w-4 mr-3" />
                    <div>
                      <div className="font-medium">Geography</div>
                      <div className="text-xs text-gray-500">State & LGA progress</div>
                    </div>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {/* Learning Tools */}
                <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Learning</div>
                <DropdownMenuItem asChild>
                  <a href="/quiz-center" className="flex items-center py-2" data-testid="link-quiz-center">
                    <BookOpen className="h-4 w-4 mr-3" />
                    <div>
                      <div className="font-medium">Quiz Center</div>
                      <div className="text-xs text-gray-500">Test civic knowledge</div>
                    </div>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/voting" className="flex items-center py-2" data-testid="link-voting">
                    <Vote className="h-4 w-4 mr-3" />
                    <div>
                      <div className="font-medium">Voting</div>
                      <div className="text-xs text-gray-500">Cast votes & decide</div>
                    </div>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/top-schools" className="flex items-center py-2" data-testid="link-top-schools">
                    <Trophy className="h-4 w-4 mr-3" />
                    <div>
                      <div className="font-medium">Top Schools</div>
                      <div className="text-xs text-gray-500">University rankings</div>
                    </div>
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* User Section */}
          <div className="flex items-center space-x-1">
            {/* Mobile #13k Challenge Button */}
            <a href="/challenge" className="lg:hidden px-2 py-1 text-xs font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-md shadow-sm transition-all duration-200 hover:shadow-md whitespace-nowrap" data-testid="mobile-link-challenge-header">
              #13kChallenge
            </a>
            
            
            {/* Language Selector */}
            <LanguageSelector compact={true} showLabel={false} />
            

            {/* Wallet Balance - Right Edge */}
            <a 
              href="/sup-dashboard" 
              className="flex items-center px-2 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-md border border-green-200 shadow-sm hover:shadow-md transition-all hover:from-green-100 hover:to-emerald-100 cursor-pointer"
              data-testid="link-wallet-balance"
            >
              <div className="text-right">
                <div className="text-sm font-semibold text-green-700" data-testid="text-wallet-balance">
                  ₦{ngnEquivalent.toLocaleString()}
                </div>
                <div className="text-xs text-green-600 hidden sm:block">SUP Balance</div>
              </div>
            </a>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 p-1.5 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition-all" data-testid="dropdown-user-menu">
                  <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center">
                    {user?.profileImageUrl ? (
                      <img 
                        src={user.profileImageUrl} 
                        alt="Profile" 
                        className="w-7 h-7 rounded-full object-cover"
                        data-testid="img-profile-avatar"
                      />
                    ) : (
                      <User className="w-4 h-4 text-gray-600" data-testid="icon-user-avatar" />
                    )}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-medium text-gray-900" data-testid="text-user-display-name">
                      {user?.firstName ? `${user.firstName} ${user.lastName?.charAt(0) || ''}` : 'User'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user?.role || 'Citizen'}
                    </div>
                  </div>
                  <ChevronDown className="w-3 h-3 text-gray-400 hidden sm:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 mt-1">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="text-sm font-semibold text-gray-900" data-testid="text-dropdown-user-name">
                    {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'User'}
                  </div>
                  <div className="text-xs text-gray-500 mt-1" data-testid="text-dropdown-wallet-balance">
                    ₦{ngnEquivalent.toLocaleString()} SUP • {user?.role || 'Citizen'}
                  </div>
                  {((user as any)?.citizenNumber || (user as any)?.citizen_number) && (
                    <div className="text-xs text-primary-600 font-medium mt-1" data-testid="text-dropdown-citizen-number">
                      Citizen #{((user as any)?.citizenNumber || (user as any)?.citizen_number)?.toLocaleString()}
                    </div>
                  )}
                </div>
                  
                <DropdownMenuItem asChild>
                    <a href="/profile" className="flex items-center" data-testid="dropdown-link-profile">
                      <Settings className="w-4 h-4 mr-2" />
                      My Profile
                    </a>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <a href="/verification" className="flex items-center" data-testid="dropdown-link-verification">
                      <UserCheck className="w-4 h-4 mr-2" />
                      Verification Status
                    </a>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <a href="/kyc" className="flex items-center" data-testid="dropdown-link-kyc">
                      <Shield className="w-4 h-4 mr-2" />
                      KYC Verification
                    </a>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem asChild>
                    <a href="/about" className="flex items-center" data-testid="dropdown-link-about">
                      <HelpCircle className="w-4 h-4 mr-2" />
                      About Step Up Naija
                    </a>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <a href="/faq" className="flex items-center" data-testid="dropdown-link-faq">
                      <HelpCircle className="w-4 h-4 mr-2" />
                      FAQ & Support
                    </a>
                  </DropdownMenuItem>
                  
                  {user?.isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <a href="/admin" className="flex items-center text-red-600" data-testid="dropdown-link-admin">
                          <Lock className="w-4 h-4 mr-2" />
                          Admin Panel
                        </a>
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem
                    onClick={async () => {
                      try {
                        onLogout?.();
                        window.location.href = '/';
                      } catch (error) {
                        console.error('Logout error:', error);
                      }
                    }}
                    className="text-red-600 cursor-pointer"
                    data-testid="dropdown-button-logout"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            
            <button 
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 relative"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <Menu className="w-5 h-5 text-gray-600" />
              {/* Notification dot indicator */}
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu - Enhanced */}
        {mobileMenuOpen && (
          <>
            {/* Overlay */}
            <div 
              className="lg:hidden fixed inset-0 top-16 bg-black/30 z-30"
              onClick={() => setMobileMenuOpen(false)}
              data-testid="mobile-menu-overlay"
            />
            
            {/* Menu Content */}
            <div className="lg:hidden fixed inset-x-0 top-16 bg-white shadow-xl z-40 border-b border-gray-200 animate-in slide-in-from-top duration-200">
              <div className="max-h-[calc(100vh-4rem)] overflow-y-auto overscroll-contain">
                <div className="flex flex-col px-4 py-5">
              {isAuthenticated ? (
                <>
                  {/* Main Actions - Order matches desktop navigation */}
                  <div className="space-y-2 mb-6">
                    <a href="/" className="flex items-center text-gray-700 hover:text-green-700 hover:bg-green-50 font-medium px-4 py-3 rounded-lg transition-colors" data-testid="mobile-link-dashboard">
                      <BarChart3 className="w-5 h-5 text-gray-600 mr-3" />
                      <span>Dashboard</span>
                    </a>
                    
                    <a href="/engage" className="flex items-center text-gray-700 hover:text-green-700 hover:bg-green-50 font-medium px-4 py-3 rounded-lg transition-colors" data-testid="mobile-link-engage">
                      <Heart className="w-5 h-5 text-gray-600 mr-3" />
                      <span>Engage</span>
                    </a>
                    
                    <a href="/challenge" className="flex items-center bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold px-4 py-3 rounded-lg shadow-md" data-testid="mobile-link-challenge">
                      <Crown className="w-5 h-5 text-white mr-3" />
                      <span>#13k Challenge</span>
                    </a>
                    
                    <a href="/projects" className="flex items-center text-gray-700 hover:text-green-700 hover:bg-green-50 font-medium px-4 py-3 rounded-lg transition-colors" data-testid="mobile-link-projects">
                      <span className="w-5 h-5 text-center mr-3">🚀</span>
                      <span>Projects</span>
                    </a>
                    
                    <a href="/candidates" className="flex items-center text-gray-700 hover:text-green-700 hover:bg-green-50 font-medium px-4 py-3 rounded-lg transition-colors" data-testid="mobile-link-candidates">
                      <Users className="w-5 h-5 text-gray-600 mr-3" />
                      <span>Leaders</span>
                    </a>
                  </div>

                  {/* Community */}
                  <div className="space-y-2 mb-6">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Community</h3>
                    
                    <a href="/forum" className="flex items-center text-gray-700 hover:text-green-700 hover:bg-green-50 font-medium px-4 py-3 rounded-lg transition-colors" data-testid="mobile-link-forum">
                      <MessageSquare className="w-5 h-5 text-gray-600 mr-3" />
                      <span>Forum</span>
                    </a>
                    
                    <a href="/leaderboard" className="flex items-center text-gray-700 hover:text-green-700 hover:bg-green-50 font-medium px-4 py-3 rounded-lg transition-colors" data-testid="mobile-link-leaderboard">
                      <Trophy className="w-5 h-5 text-gray-600 mr-3" />
                      <span>Leaderboard</span>
                    </a>
                    
                    <a href="/events" className="flex items-center text-gray-700 hover:text-green-700 hover:bg-green-50 font-medium px-4 py-3 rounded-lg transition-colors" data-testid="mobile-link-events">
                      <Calendar className="w-5 h-5 text-gray-600 mr-3" />
                      <span>Events</span>
                    </a>
                  </div>

                  {/* Programs */}
                  <div className="space-y-2 mb-6">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Programs</h3>
                    
                    <a href="/training" className="flex items-center text-gray-700 hover:text-green-700 hover:bg-green-50 font-medium px-4 py-3 rounded-lg transition-colors" data-testid="mobile-link-training">
                      <GraduationCap className="w-5 h-5 text-gray-600 mr-3" />
                      <span>Leadership Training</span>
                    </a>
                    
                    <a href="/network" className="flex items-center text-gray-700 hover:text-green-700 hover:bg-green-50 font-medium px-4 py-3 rounded-lg transition-colors" data-testid="mobile-link-network">
                      <Users className="w-5 h-5 text-gray-600 mr-3" />
                      <span>Network</span>
                    </a>
                  </div>

                  {/* Tools */}
                  <div className="space-y-2 mb-6">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Tools</h3>
                    
                    <a href="/voting" className="flex items-center text-gray-700 hover:text-green-700 hover:bg-green-50 font-medium px-4 py-3 rounded-lg transition-colors" data-testid="mobile-link-voting">
                      <Vote className="w-5 h-5 text-gray-600 mr-3" />
                      <span>Voting</span>
                    </a>
                    
                    <a href="/treasury" className="flex items-center text-gray-700 hover:text-green-700 hover:bg-green-50 font-medium px-4 py-3 rounded-lg transition-colors" data-testid="mobile-link-treasury">
                      <Coins className="w-5 h-5 text-gray-600 mr-3" />
                      <span>Treasury</span>
                    </a>
                    
                    <a href="/progress" className="flex items-center text-gray-700 hover:text-green-700 hover:bg-green-50 font-medium px-4 py-3 rounded-lg transition-colors" data-testid="mobile-link-progress">
                      <BarChart3 className="w-5 h-5 text-gray-600 mr-3" />
                      <span>Analytics</span>
                    </a>
                    
                    <a href="/transparency" className="flex items-center text-gray-700 hover:text-green-700 hover:bg-green-50 font-medium px-4 py-3 rounded-lg transition-colors" data-testid="mobile-link-transparency">
                      <Eye className="w-5 h-5 text-gray-600 mr-3" />
                      <span>Transparency</span>
                    </a>
                  </div>

                  {/* More */}
                  <div className="space-y-2 mb-6">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">More</h3>
                    
                    <a href="/education" className="flex items-center text-gray-700 hover:text-green-700 hover:bg-green-50 font-medium px-4 py-3 rounded-lg transition-colors" data-testid="mobile-link-education">
                      <BookOpen className="w-5 h-5 text-gray-600 mr-3" />
                      <span>Education</span>
                    </a>
                    
                    <a href="/founders-wall" className="flex items-center text-gray-700 hover:text-green-700 hover:bg-green-50 font-medium px-4 py-3 rounded-lg transition-colors" data-testid="mobile-link-founders-wall">
                      <span className="w-5 h-5 text-center mr-3">👑</span>
                      <span>Founders Wall</span>
                    </a>
                    
                    <a href="/geography" className="flex items-center text-gray-700 hover:text-green-700 hover:bg-green-50 font-medium px-4 py-3 rounded-lg transition-colors" data-testid="mobile-link-geography">
                      <MapPin className="w-5 h-5 text-gray-600 mr-3" />
                      <span>Geography</span>
                    </a>
                    
                    <a href="/notifications" className="flex items-center text-gray-700 hover:text-green-700 hover:bg-green-50 font-medium px-4 py-3 rounded-lg transition-colors" data-testid="mobile-link-notifications">
                      <Bell className="w-5 h-5 text-gray-600 mr-3" />
                      <span>Notifications</span>
                    </a>
                  </div>
                  
                  {/* Volunteer */}
                  {user?.userType === 'VOLUNTEER' && (
                    <div className="space-y-2 mb-6">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Volunteer</h3>
                      
                      {user?.volunteerStatus === 'ACTIVE' && (
                        <a href="/volunteer-dashboard" className="flex items-center bg-green-600 text-white font-semibold px-4 py-3 rounded-lg shadow-md" data-testid="mobile-link-volunteer-dashboard">
                          <Heart className="w-5 h-5 mr-3" />
                          <span>Volunteer Hub</span>
                        </a>
                      )}
                      
                      {user?.volunteerStatus === 'INACTIVE' && (
                        <button 
                          onClick={async () => {
                            try {
                              await fetch('/api/volunteer/opt-in', { method: 'POST' });
                              window.location.reload();
                            } catch (error) {
                              console.error('Failed to opt in:', error);
                            }
                          }}
                          className="w-full flex items-center text-green-700 bg-green-50 border border-green-200 font-medium px-4 py-3 rounded-lg hover:bg-green-100 transition-colors" 
                          data-testid="mobile-button-volunteer-opt-in"
                        >
                          <Heart className="w-5 h-5 mr-3" />
                          <span>Rejoin Volunteers</span>
                        </button>
                      )}
                    </div>
                  )}
                  
                  {user?.userType !== 'VOLUNTEER' && (
                    <div className="space-y-2 mb-6">
                      <a href="/volunteer-onboarding" className="flex items-center text-gray-700 hover:text-green-700 hover:bg-green-50 font-medium px-4 py-3 rounded-lg transition-colors" data-testid="mobile-link-volunteer-onboarding">
                        <Heart className="w-5 h-5 text-gray-600 mr-3" />
                        <span>Become a Volunteer</span>
                      </a>
                    </div>
                  )}

                  {/* Account */}
                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Account</h3>
                    
                    <a href="/profile" className="flex items-center text-gray-700 hover:text-green-700 hover:bg-green-50 font-medium px-4 py-3 rounded-lg transition-colors" data-testid="mobile-link-profile">
                      <Settings className="w-5 h-5 text-gray-600 mr-3" />
                      <span>Profile</span>
                    </a>
                    
                    <a href="/wallet" className="flex items-center text-gray-700 hover:text-green-700 hover:bg-green-50 font-medium px-4 py-3 rounded-lg transition-colors" data-testid="mobile-link-wallet">
                      <Wallet className="w-5 h-5 text-gray-600 mr-3" />
                      <span>Wallet</span>
                    </a>
                    
                    <a href="/kyc" className="flex items-center text-gray-700 hover:text-green-700 hover:bg-green-50 font-medium px-4 py-3 rounded-lg transition-colors" data-testid="mobile-link-kyc">
                      <Shield className="w-5 h-5 text-gray-600 mr-3" />
                      <span>KYC</span>
                    </a>
                    
                    <button 
                      onClick={async () => {
                        try {
                          onLogout?.();
                          window.location.href = '/';
                        } catch (error) {
                          console.error('Logout error:', error);
                        }
                      }}
                      className="w-full flex items-center text-red-600 hover:text-red-700 hover:bg-red-50 font-medium px-4 py-3 rounded-lg transition-colors mt-4"
                      data-testid="mobile-button-logout"
                    >
                      <LogOut className="w-5 h-5 mr-3" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Unauthenticated User Navigation */}
                  <a href="/" className="text-gray-700 hover:text-primary-600 font-medium px-4 py-3 rounded-lg hover:bg-white transition-colors" data-testid="mobile-link-home">Home</a>
                  <a href="/about" className="text-gray-700 hover:text-primary-600 font-medium px-4 py-3 rounded-lg hover:bg-white transition-colors" data-testid="mobile-link-about">About Step Up Naija</a>
                  <a href="/faq" className="text-gray-700 hover:text-primary-600 font-medium px-4 py-3 rounded-lg hover:bg-white transition-colors" data-testid="mobile-link-faq">FAQ & Support</a>
                  <a href="/contact" className="text-gray-700 hover:text-primary-600 font-medium px-4 py-3 rounded-lg hover:bg-white transition-colors" data-testid="mobile-link-contact">Contact Us</a>
                  
                  <div className="border-t border-gray-300 pt-4 mt-2">
                    <Button 
                      onClick={() => window.location.href = '/auth'}
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-3 rounded-lg font-medium"
                      data-testid="mobile-button-login"
                    >
                      Login / Join Step Up Naija
                    </Button>
                  </div>
                </>
              )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
