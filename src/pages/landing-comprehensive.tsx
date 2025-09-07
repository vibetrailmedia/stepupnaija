import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Shield, Users, Trophy, Zap, LogIn, Menu, X, Play, MessageSquare, Sparkles, Heart } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useToast } from "@/hooks/use-toast";
import AvatarCard from "@/components/AvatarCard";
import IntroductionVideo from "@/components/IntroductionVideo";
import VideoPlayer from "@/components/VideoPlayer";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import logoUrl from "@assets/primary-logo_1756495358509.png";
import youthEngagementImage from "@assets/generated_images/Nigerian_youth_civic_engagement_scene_024f101a.png";
import youthLeadershipImage from "@assets/generated_images/Nigerian_youth_leadership_action_scene_a4fe4b9b.png";
import drRasheedImage from "@assets/generated_images/Nigerian_executive_director_headshot_66d7aed0.png";
import aishaImage from "@assets/generated_images/Nigerian_program_director_headshot_e243da1e.png";
import emmanuelImage from "@assets/generated_images/Nigerian_tech_director_headshot_f21fc2b5.png";
import sarahImage from "@assets/generated_images/Nigerian_community_relations_headshot_1fca20ac.png";
import tariAvatarImage from "@/assets/tari-avatar.webp";
import tariVideoThumbnail from "@/assets/tari-video-thumbnail.webp";
import kamsiAvatarImage from "@/assets/kamsi-avatar.webp";
// Using public directory path for video to fix playback issues
const tariVideoUrl = "/tari-intro-video.mp4";
import coatOfArmsImage from "@assets/Untitled design-4_1757162712832.png";

export default function LandingComprehensive() {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30 page-transition">
      {/* Navigation - Enterprise Mobile-First Design */}
      <nav className="bg-white/95 border-b border-gray-200/50 sticky top-0 z-50 shadow-sm backdrop-blur-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-18">
            
            {/* Mobile Brand Section - Optimized Layout */}
            <div className="flex items-center min-w-0 flex-1 lg:flex-none">
              <a 
                href="/" 
                className="flex items-center hover:opacity-80 transition-opacity"
                aria-label="Step Up Naija - Back to Home"
              >
                <img 
                  src={logoUrl} 
                  alt="Step Up Naija Logo" 
                  className="h-12 w-12 sm:h-14 sm:w-14 object-contain flex-shrink-0 mr-3 cursor-pointer"
                  data-testid="img-logo"
                />
              </a>
              {/* Mobile: Single line brand, Desktop: Stacked */}
              <div className="min-w-0">
                <div className="flex flex-col sm:hidden">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-green-600 tracking-tight leading-tight drop-shadow-sm">
                      STEP UP NAIJA
                    </span>
                    {/* Nigerian Flag - Mobile */}
                    <div className="w-5 h-3 rounded-sm overflow-hidden border border-gray-300 shadow-sm">
                      <div className="h-full flex">
                        <div className="flex-1 bg-green-600"></div>
                        <div className="flex-1 bg-white"></div>
                        <div className="flex-1 bg-green-600"></div>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-gray-600 tracking-wide leading-normal opacity-90">
                    Empowering Citizens • Building Leaders
                  </span>
                </div>
                <div className="hidden sm:flex sm:flex-col lg:max-w-xs">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg lg:text-xl font-bold text-green-600 tracking-tight leading-tight drop-shadow-lg">
                      STEP UP NAIJA
                    </span>
                    {/* Nigerian Flag - Desktop */}
                    <div className="w-6 h-4 rounded-sm overflow-hidden border border-gray-300 shadow-sm">
                      <div className="h-full flex">
                        <div className="flex-1 bg-green-600"></div>
                        <div className="flex-1 bg-white"></div>
                        <div className="flex-1 bg-green-600"></div>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs lg:text-sm font-medium text-gray-600 tracking-wide leading-normal opacity-90">
                    Empowering Citizens • Building Leaders
                  </span>
                </div>
              </div>
            </div>
            
            {/* Desktop Navigation - Comprehensive Step Up Naija Links */}
            <div className="hidden lg:flex items-center space-x-6">
              <a href="/challenge" className="text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-sm font-semibold px-4 py-2 rounded-lg shadow-md transition-all" data-testid="link-challenge">#13K Challenge</a>
              <a href="/engage" className="text-gray-700 hover:text-green-600 text-sm font-medium px-3 py-2 rounded-lg hover:bg-green-50/50 backdrop-blur-sm" data-testid="link-engage">Engage</a>
              <a href="/projects" className="text-gray-700 hover:text-green-600 text-sm font-medium px-3 py-2 rounded-lg hover:bg-green-50/50 backdrop-blur-sm" data-testid="link-projects">Projects</a>
              <a href="/candidates" className="text-gray-700 hover:text-green-600 text-sm font-medium px-3 py-2 rounded-lg hover:bg-green-50/50 backdrop-blur-sm" data-testid="link-leaders">Leaders</a>
              <a href="/about" className="text-gray-700 hover:text-green-600 text-sm font-medium px-3 py-2 rounded-lg hover:bg-green-50/50 backdrop-blur-sm" data-testid="link-about">About</a>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => window.location.href = '/auth'}
                  className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-all duration-200 px-4 py-2 rounded-md hover:bg-gray-100 min-h-[44px]"
                  data-testid="link-login"
                >
                  Login
                </button>
                
                <Button 
                  onClick={() => window.location.href = '/auth?mode=signup'}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl min-h-[44px] whitespace-nowrap"
                  data-testid="button-join"
                >
                  🇳🇬 Join Now
                </Button>
              </div>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                aria-label="Toggle mobile menu"
                data-testid="button-mobile-menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
            
          </div>
        </div>
        
        {/* Mobile Menu Overlay - Enterprise Standard */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
            <div className="absolute top-16 right-0 w-80 max-w-[calc(100vw-2rem)] bg-white/95 backdrop-blur-lg shadow-2xl border border-gray-200/50 rounded-bl-2xl overflow-hidden animate-in slide-in-from-top-2 duration-300" onClick={(e) => e.stopPropagation()}>
              
              {/* Mobile Menu Items */}
              <div className="p-6 space-y-1">
                <a href="/challenge" 
                   className="block px-4 py-3 text-white bg-gradient-to-r from-green-600 to-green-700 rounded-lg font-semibold transition-all duration-200 min-h-[44px] flex items-center shadow-md mb-3" 
                   data-testid="mobile-link-challenge"
                   onClick={() => setMobileMenuOpen(false)}>
                  🏆 #13K Challenge
                </a>
                <a href="/engage" 
                   className="block px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg font-medium transition-all duration-200 min-h-[44px] flex items-center" 
                   data-testid="mobile-link-engage"
                   onClick={() => setMobileMenuOpen(false)}>
                  Engage & Earn
                </a>
                <a href="/projects" 
                   className="block px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg font-medium transition-all duration-200 min-h-[44px] flex items-center" 
                   data-testid="mobile-link-projects"
                   onClick={() => setMobileMenuOpen(false)}>
                  Community Projects
                </a>
                <a href="/candidates" 
                   className="block px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg font-medium transition-all duration-200 min-h-[44px] flex items-center" 
                   data-testid="mobile-link-leaders"
                   onClick={() => setMobileMenuOpen(false)}>
                  Leadership Board
                </a>
                <a href="/about" 
                   className="block px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg font-medium transition-all duration-200 min-h-[44px] flex items-center" 
                   data-testid="mobile-link-about"
                   onClick={() => setMobileMenuOpen(false)}>
                  About Us
                </a>
                
                <hr className="my-4 border-gray-200" />
                
                <a href="/auth" 
                   className="block px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg font-medium transition-all duration-200 min-h-[44px] flex items-center" 
                   data-testid="mobile-link-login"
                   onClick={() => setMobileMenuOpen(false)}>
                  <LogIn className="w-4 h-4 mr-3" />
                  Login
                </a>
                
                <Button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    window.location.href = '/auth?mode=signup';
                  }}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-4 rounded-xl shadow-lg min-h-[48px] mt-2"
                  data-testid="mobile-button-join"
                >
                  🇳🇬 Join the Challenge
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ULTIMATE HERO SECTION - Transform Nigeria Experience */}
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-green-50 via-yellow-50 to-orange-50 flex items-center animate-luxury-fade-in">
        
        {/* Nigerian Coat of Arms Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <img 
            src={coatOfArmsImage} 
            alt="Nigerian Coat of Arms Background"
            className="w-[600px] h-[600px] object-contain opacity-[0.12] select-none"
          />
        </div>
        
        {/* Dynamic Background with Parallax Effect */}
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full">
            <img 
              src={youthLeadershipImage} 
              alt="Nigerian youth leading transformational change" 
              className="w-full h-full object-cover opacity-25 transform scale-105 animate-pulse"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-green-300/30 via-yellow-300/30 to-orange-300/30"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
          </div>
        </div>

        {/* Floating Elements Animation */}
        <div className="absolute inset-0 z-5 overflow-hidden">
          <div className="absolute top-20 left-10 w-4 h-4 bg-green-400 rounded-full animate-bounce delay-100 opacity-60"></div>
          <div className="absolute top-32 right-20 w-6 h-6 bg-yellow-400 rounded-full animate-bounce delay-300 opacity-70"></div>
          <div className="absolute bottom-40 left-20 w-3 h-3 bg-orange-400 rounded-full animate-bounce delay-500 opacity-50"></div>
          <div className="absolute bottom-60 right-10 w-5 h-5 bg-blue-400 rounded-full animate-bounce delay-700 opacity-60"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          {/* REVOLUTIONARY HERO CONTENT */}
          <div className="text-center space-y-8 sm:space-y-12 animate-luxury-slide-up">
            
            {/* Live Status Badge */}
            <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-xl rounded-full px-4 sm:px-6 py-3 sm:py-4 border border-white/30 shadow-2xl">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm sm:text-base font-bold text-gray-800">🔴 LIVE: 3,247+ Leaders Already Joined</span>
            </div>

            {/* Mobile-Optimized Headline */}
            <div className="sm:hidden space-y-6">
              <div className="relative">
                <h1 className="font-display text-5xl sm:text-6xl font-black leading-tight px-2">
                  <span className="block bg-gradient-to-r from-green-600 via-yellow-500 to-orange-600 bg-clip-text text-transparent drop-shadow-2xl animate-pulse">
                    #13K
                  </span>
                  <span className="block text-3xl font-bold text-gray-900 mt-2">
                    Credible Challenge
                  </span>
                </h1>
                {/* Nigerian Eagle - Mobile */}
                <div className="absolute top-0 right-0 text-3xl animate-bounce opacity-80">🦅</div>
              </div>
              
              <p className="text-lg font-bold text-gray-800 px-4 leading-tight">
                Shape Nigeria's Future<br/>
                <span className="text-green-600">One Leader at a Time</span>
              </p>
            </div>

            {/* Desktop Epic Version */}
            <div className="hidden sm:block space-y-8">
              <div className="relative">
                <h1 className="font-display text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black leading-none">
                  <span className="block bg-gradient-to-r from-green-600 via-yellow-500 to-orange-600 bg-clip-text text-transparent drop-shadow-2xl animate-pulse">
                    #13K
                  </span>
                  <span className="block text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-900 mt-4 drop-shadow-lg">
                    Credible Challenge
                  </span>
                </h1>
                {/* Nigerian Eagle - Desktop */}
                <div className="absolute top-4 right-4 text-5xl lg:text-6xl animate-bounce opacity-80">🦅</div>
              </div>
              
              <div className="max-w-5xl mx-auto space-y-6">
                <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 leading-tight">
                  Nigeria's Most Ambitious Leadership Revolution
                </p>
                <p className="text-xl md:text-2xl text-gray-700 font-semibold leading-relaxed max-w-4xl mx-auto">
                  Join millions of Nigerians choosing 13,000 credible leaders through democratic nomination and voting across all 774 LGAs
                </p>
                <div className="text-lg md:text-xl text-gray-600 leading-relaxed font-medium">
                  <span className="text-green-600 font-bold">Transform Communities</span> • 
                  <span className="text-yellow-600 font-bold"> Earn Rewards</span> • 
                  <span className="text-orange-600 font-bold"> Make History</span>
                </div>
              </div>
            </div>

            {/* Real-Time Impact Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 lg:p-6 border border-white/30 shadow-2xl text-center">
                <div className="text-2xl lg:text-3xl font-black text-green-600 mb-2">3,247+</div>
                <div className="text-sm lg:text-base font-semibold text-gray-700">Leaders Joined</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 lg:p-6 border border-white/30 shadow-2xl text-center">
                <div className="text-2xl lg:text-3xl font-black text-yellow-600 mb-2">156</div>
                <div className="text-sm lg:text-base font-semibold text-gray-700">LGAs Active</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 lg:p-6 border border-white/30 shadow-2xl text-center">
                <div className="text-2xl lg:text-3xl font-black text-orange-600 mb-2">₦2.1M</div>
                <div className="text-sm lg:text-base font-semibold text-gray-700">Prizes Won</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 lg:p-6 border border-white/30 shadow-2xl text-center">
                <div className="text-2xl lg:text-3xl font-black text-blue-600 mb-2">89%</div>
                <div className="text-sm lg:text-base font-semibold text-gray-700">Success Rate</div>
              </div>
            </div>

            {/* Ultimate Call-to-Action Section */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
                <Button 
                  size="lg" 
                  className="group relative w-full sm:w-auto bg-gradient-to-r from-green-600 via-yellow-500 to-orange-600 hover:from-green-700 hover:via-yellow-600 hover:to-orange-700 text-white px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl font-black rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-4 border-white/20 min-h-[64px] overflow-hidden"
                  onClick={() => window.location.href = '/auth?mode=signup'}
                  data-testid="button-join-revolution"
                  aria-label="Join the 13k Credible Challenge - Start your leadership journey today"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse"></div>
                  <div className="relative flex items-center justify-center gap-3">
                    <span className="text-2xl">🚀</span>
                    <span className="hidden sm:inline">JOIN THE REVOLUTION</span>
                    <span className="sm:hidden">JOIN NOW</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="group w-full sm:w-auto border-3 border-gray-800 bg-white/20 backdrop-blur-xl text-gray-800 hover:bg-white/30 hover:border-gray-900 px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-bold rounded-2xl transition-all duration-300 shadow-xl min-h-[64px]"
                  onClick={() => document.getElementById('tari-video')?.scrollIntoView({ behavior: 'smooth' })}
                  data-testid="button-watch-story-hero"
                  aria-label="Watch TARI introduction video and learn about Step Up Naija"
                >
                  <div className="flex items-center gap-3">
                    <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>Watch Story</span>
                  </div>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm sm:text-base text-gray-700">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="font-semibold">100% Free</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold">CAC Registered</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  <span className="font-semibold">Verified Impact</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold">Award Winning</span>
                </div>
              </div>

              {/* Social Proof Testimonial */}
              <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-2xl">
                <div className="flex items-center justify-center mb-4">
                  <div className="flex -space-x-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-green-600 border-2 border-white shadow-lg"></div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 border-2 border-white shadow-lg"></div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 border-2 border-white shadow-lg"></div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 border-2 border-white shadow-lg flex items-center justify-center">
                      <span className="text-white text-sm font-bold">+3K</span>
                    </div>
                  </div>
                </div>
                <p className="text-center text-gray-700 font-medium italic">
                  "Step Up Naija gave me the platform to connect with 127 community members and launch 3 impactful projects in Imo State. This is real change in action!"
                </p>
                <div className="text-center mt-3">
                  <span className="text-sm font-semibold text-green-600">- Adebayo O., Lagos State Leader</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nigerian Flag with Flowing Animation */}

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Dedicated #13K Challenge Explanation Section - Moved to Priority Position */}
      <section id="challenge-explained" className="py-20 bg-gradient-to-br from-gray-900 to-green-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center gap-3 mb-8">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-8 py-4 rounded-full text-lg font-black shadow-xl">
                🔥 WHAT IS THE #13K CHALLENGE?
              </div>
            </div>
            
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6">
              Nigeria's Most Ambitious
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Leadership Initiative
              </span>
            </h2>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-4xl mx-auto leading-relaxed opacity-90 px-4">
              Nigeria's largest democratic participation platform where millions of citizens nominate, vote, and select 
              13,000 credible leaders across all 774 Local Government Areas through transparent democratic processes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Phase 1 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center" style={{backgroundColor: 'rgba(255, 255, 255, 0.1)'}}>
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-black text-white">01</span>
              </div>
              <h3 className="font-display text-2xl font-bold mb-4 text-green-400">IDENTIFY</h3>
              <p className="text-sm sm:text-base lg:text-lg leading-relaxed mb-4 text-white" style={{color: 'white !important'}}>
                Community-driven nominations and verification of credible leaders with proven track records of integrity and service.
              </p>
              <div className="text-sm text-green-300 font-semibold">
                Millions participating • 774 LGAs covered • 13,000 leaders selected
              </div>
            </div>
            
            {/* Phase 2 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center" style={{backgroundColor: 'rgba(255, 255, 255, 0.1)'}}>
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-black text-white">02</span>
              </div>
              <h3 className="font-display text-2xl font-bold mb-4 text-yellow-400">TRAIN</h3>
              <p className="text-sm sm:text-base lg:text-lg leading-relaxed mb-4 text-white" style={{color: 'white !important'}}>
                Comprehensive civic education, governance training, and leadership development programs for all identified leaders.
              </p>
              <div className="text-sm text-yellow-300 font-semibold">
                Leadership workshops • Governance courses • Civic education
              </div>
            </div>
            
            {/* Phase 3 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center" style={{backgroundColor: 'rgba(255, 255, 255, 0.1)'}}>
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-black text-white">03</span>
              </div>
              <h3 className="font-display text-2xl font-bold mb-4 text-blue-400">ORGANIZE</h3>
              <p className="text-sm sm:text-base lg:text-lg leading-relaxed mb-4 text-white" style={{color: 'white !important'}}>
                Create a coordinated network of trained leaders working together to drive positive change in every LGA.
              </p>
              <div className="text-sm text-blue-300 font-semibold">
                774 LGAs • Coordinated action • Sustainable impact
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Button 
              size="lg" 
              className="btn-luxury bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-400 hover:to-blue-500 text-white px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 text-base sm:text-lg lg:text-xl font-black rounded-xl lg:rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-4 border-white/30 w-full sm:w-auto max-w-sm sm:max-w-none"
              onClick={() => window.location.href = '/auth?mode=signup'}
              data-testid="button-join-challenge-main"
            >
              🚀 JOIN THE #13K CHALLENGE NOW
            </Button>
            <p className="text-sm sm:text-base lg:text-lg mt-3 sm:mt-4 opacity-80 px-4">
              Be part of Nigeria's leadership transformation • Earn SUP tokens • Win prizes
            </p>
          </div>
        </div>
      </section>

      {/* Challenge Progress & Impact Section */}  
      <section className="py-16 sm:py-20 bg-gradient-to-br from-blue-50 via-green-50/50 to-yellow-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Impact Statistics */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center justify-center gap-2 mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                📊 Live Progress Update
              </div>
            </div>
            
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Building Nigeria's Future Together
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              Track our collective impact across Nigeria's 774 Local Government Areas
            </p>
          </div>

          {/* Progress Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 text-center shadow-2xl border border-white/20">
              <div className="text-3xl sm:text-4xl font-black text-green-600 mb-2">3,247</div>
              <div className="text-sm font-semibold text-gray-600">Leaders Identified</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div className="bg-green-500 h-2 rounded-full" style={{width: '25%'}}></div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 text-center shadow-2xl border border-white/20">
              <div className="text-3xl sm:text-4xl font-black text-yellow-600 mb-2">1,892</div>
              <div className="text-sm font-semibold text-gray-600">In Training</div>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-3 border border-gray-300">
                <div className="h-full rounded-full relative" style={{width: '15%'}}>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-white to-green-600 rounded-full"></div>
                  <div className="absolute inset-0 bg-green-600 opacity-80 rounded-full"></div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 text-center shadow-2xl border border-white/20">
              <div className="text-3xl sm:text-4xl font-black text-blue-600 mb-2">774</div>
              <div className="text-sm font-semibold text-gray-600">LGAs Reached</div>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-3 border border-gray-300">
                <div className="h-full rounded-full relative" style={{width: '100%'}}>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-white to-green-600 rounded-full"></div>
                  <div className="absolute inset-0 bg-green-600 opacity-80 rounded-full"></div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 text-center shadow-2xl border border-white/20">
              <div className="text-3xl sm:text-4xl font-black text-purple-600 mb-2">₦2.1M</div>
              <div className="text-sm font-semibold text-gray-600">Community Impact</div>
              <div className="text-xs text-gray-500 mt-1">Projects Funded</div>
            </div>
          </div>

          {/* Community Testimonials */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20">
            <h3 className="text-xl sm:text-2xl font-bold text-center mb-8 text-gray-900">
              Voices from the Movement
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">AA</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Aisha A.</p>
                    <p className="text-xs text-gray-600">Lagos State Leader</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 italic">
                  "The #13K Challenge gave me the tools to organize my community. We've completed 3 major projects already!"
                </p>
              </div>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">EM</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Emmanuel M.</p>
                    <p className="text-xs text-gray-600">Rivers State Coordinator</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 italic">
                  "From participating to leading - this platform transformed my civic engagement approach completely."
                </p>
              </div>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">FI</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Fatima I.</p>
                    <p className="text-xs text-gray-600">Kano State Coordinator</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 italic">
                  "Being part of the #13K Challenge opened doors I never knew existed. Now I'm leading youth engagement programs across 5 LGAs."
                </p>
              </div>
            </div>

            <div className="text-center mt-8">
              <Button 
                variant="outline" 
                className="border-2 border-yellow-400 bg-white/20 backdrop-blur-sm text-gray-800 hover:bg-yellow-400/20 px-6 py-2 text-sm font-semibold rounded-full transition-all duration-300"
                onClick={() => window.location.href = '/testimonials'}
                data-testid="button-view-testimonials"
              >
                View More Stories
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* TARI Introduction Video Section - Moved After Challenge Progress */}
      <section id="tari-video" className="py-16 sm:py-20 bg-gradient-to-br from-green-50 via-yellow-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-12 lg:mb-16 animate-luxury-slide-up">
            {/* Mobile Version */}
            <div className="sm:hidden">
              <div className="inline-flex items-center justify-center mb-4">
                <div className="bg-gradient-to-r from-green-600 to-yellow-500 text-white px-4 py-2 rounded-full text-xs font-semibold tracking-wide shadow-lg">
                  AI-Powered Civic Guide
                </div>
              </div>
              
              <h2 className="font-display text-2xl font-black text-gray-900 mb-4 tracking-tight leading-tight px-4">
                Meet
                <span className="block bg-gradient-to-r from-green-600 via-yellow-500 to-orange-600 bg-clip-text text-transparent font-black text-3xl">
                  TARI
                </span>
              </h2>
              
              <p className="text-base text-gray-700 max-w-sm mx-auto leading-relaxed mb-6 font-medium px-4">
                Your AI-powered companion for navigating Nigerian civic engagement
              </p>
            </div>

            {/* Desktop Version */}
            <div className="hidden sm:block">
              <div className="inline-flex items-center justify-center mb-6">
                <div className="bg-gradient-to-r from-green-600 to-yellow-500 text-white px-6 py-3 rounded-full text-sm font-semibold tracking-wide shadow-lg">
                  AI-Powered Civic Guide
                </div>
              </div>
              
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
                Meet
                <span className="block bg-gradient-to-r from-green-600 via-yellow-500 to-orange-600 bg-clip-text text-transparent font-black">
                  TARI
                </span>
              </h2>
              
              <p className="text-lg md:text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8 lg:mb-12 font-medium">
                Your AI-powered companion for navigating Nigerian civic engagement
              </p>
            </div>

            {/* TARI Introduction Video */}
            <div className="max-w-4xl mx-auto mb-6 sm:mb-8 lg:mb-12">
              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 hover:bg-white/15 transition-all duration-500">
                <div className="aspect-video bg-gradient-to-br from-green-50 to-blue-50">
                  <video 
                    src="/tari-intro-web.mp4"
                    poster={tariVideoThumbnail}
                    className="w-full h-full rounded-lg"
                    controls
                    preload="auto"
                    playsInline
                    style={{ backgroundColor: '#000' }}
                  >
                    <source src="/tari-intro-web.mp4" type="video/mp4" />
                    <p>Your browser does not support the video tag. Please update your browser or <a href="/tari-intro-web.mp4" target="_blank">download the video</a>.</p>
                  </video>
                </div>
                
                <div className="p-4 lg:p-6 bg-gradient-to-r from-green-500/10 to-yellow-500/10 backdrop-blur-sm border-t border-white/20">
                  <div className="text-center">
                    <h3 className="font-bold text-lg lg:text-xl text-gray-900 mb-2">
                      Meet Tari - Your Civic Authority Guide
                    </h3>
                    <p className="text-gray-700 text-sm lg:text-base leading-relaxed">
                      Your AI-powered companion for navigating Nigerian civic engagement and the #13K Credible Challenge
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* AI Guide Cards - Concise & Elegant */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {/* TARI - Authority Guide */}
              <div className="group cursor-pointer" onClick={() => window.location.href = '/meet-your-guides'}>
                <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl hover:bg-white/15 transition-all duration-300 overflow-hidden p-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-green-500/5"></div>
                  
                  <div className="relative z-10 text-center">
                    <div className="relative inline-block mb-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/30 shadow-lg bg-white/10 backdrop-blur-sm">
                        <img 
                          src={tariAvatarImage} 
                          alt="Tari Avatar" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                        <Shield className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    
                    <h3 className="font-display text-xl font-bold text-gray-900 mb-2">TARI</h3>
                    <div className="text-xs font-semibold text-blue-700 bg-blue-100/50 px-3 py-1 rounded-full mb-3">
                      Authority Guide
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Navigate government processes & official resources
                    </p>
                  </div>
                </div>
              </div>

              {/* KAMSI - Community Guide */}
              <div className="group cursor-pointer" onClick={() => window.location.href = '/meet-your-guides'}>
                <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl hover:bg-white/15 transition-all duration-300 overflow-hidden p-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-yellow-500/5"></div>
                  
                  <div className="relative z-10 text-center">
                    <div className="relative inline-block mb-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/30 shadow-lg bg-white/10 backdrop-blur-sm">
                        <img 
                          src={kamsiAvatarImage} 
                          alt="Kamsi Avatar" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                        <Heart className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    
                    <h3 className="font-display text-xl font-bold text-gray-900 mb-2">KAMSI</h3>
                    <div className="text-xs font-semibold text-green-700 bg-green-100/50 px-3 py-1 rounded-full mb-3">
                      Community Guide
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Build networks & create lasting community change
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Meet Your Guides button */}
            <div className="text-center mt-12">
              <Button 
                className="bg-gradient-to-r from-green-600 via-blue-600 to-yellow-600 hover:from-green-700 hover:via-blue-700 hover:to-yellow-700 text-white px-10 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-0"
                onClick={() => window.location.href = '/meet-your-guides'}
                data-testid="button-meet-guides"
              >
                <Users className="w-5 h-5 mr-3" />
                Meet Your Civic Guides
                <Sparkles className="w-5 h-5 ml-3" />
              </Button>
            </div>
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="text-sm text-green-600 font-semibold mb-4 uppercase tracking-wider">HOW IT works</div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-4xl font-bold text-gray-900 mb-6">
              How millions choose 13,000 credible leaders democratically
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/20 shadow-lg">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">Sign Up Free</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Create your account using secure authentication. No fees, no hidden costs. 
                Join the movement with just one click.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/20 shadow-lg">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">Nominate Leaders</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Nominate credible leaders from your community. Complete civic activities and 
                earn SUP tokens (₦100 = 1 SUP) while building Nigeria's democracy.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/20 shadow-lg">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">Vote & Win</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Vote for your preferred leaders and enter weekly prize draws with earned tokens. 
                Win cash prizes while participating in Nigeria's democratic process.
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/20 shadow-lg">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">4</span>
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">Select Leaders</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Help choose 13,000 credible leaders across 774 LGAs through democratic voting. 
                Connect with chosen leaders and see your community's transformation.
              </p>
            </div>
          </div>

          {/* Platform Features */}
          <div className="mt-16 bg-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 hover:bg-white/15 transition-all duration-500">
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">Platform Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-yellow-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4 flex-shrink-0 border border-white/20">
                  <Zap className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">SUP Token Economy</h4>
                  <p className="text-sm text-gray-600">Earn, spend, and win with our transparent token system. Every civic action is rewarded.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 bg-green-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4 flex-shrink-0 border border-white/20">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Secure & Transparent</h4>
                  <p className="text-sm text-gray-600">Your data is protected, transactions are transparent, and progress is tracked publicly.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 bg-blue-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4 flex-shrink-0 border border-white/20">
                  <Trophy className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Real Impact</h4>
                  <p className="text-sm text-gray-600">Track your contributions to Nigeria's development across all 774 Local Government Areas.</p>
                </div>
              </div>
            </div>
          </div>


        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-blue-50 to-green-50 relative overflow-hidden">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="text-lg text-green-600 font-bold uppercase tracking-wider mb-4">ABOUT US</div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="max-w-2xl">
              <h3 className="font-display text-2xl sm:text-3xl lg:text-3xl font-bold text-gray-900 mb-6 leading-tight">
                Mobilizing Nigerians to become active change-makers.
              </h3>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Step Up Naija (SUN) is the public-facing initiative of <strong>CIRAD Good Governance Advocacy Foundation</strong>, 
                a registered Nigerian NGO dedicated to civic empowerment, accountability, and leadership development.
              </p>
              <p className="text-base text-gray-500 mb-8 leading-relaxed">
                Our mission: empowering millions of Nigerians to democratically nominate, vote, and select 13,000 credible leaders across all 774 Local Government Areas 
                through transparent, community-driven democratic processes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  className="btn-luxury bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-lg font-semibold focus-luxury"
                  data-testid="button-learn-more"
                  onClick={() => window.location.href = '/about'}
                >
                  Learn More About CIRAD
                </Button>
                <Button 
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50 px-6 py-3 rounded-lg font-medium focus-luxury"
                  data-testid="button-join-challenge"
                  onClick={() => window.location.href = '/challenge'}
                >
                  Join the Challenge
                </Button>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="w-80 h-80 sm:w-96 sm:h-96 rounded-xl overflow-hidden shadow-xl border border-green-200/30 hover-lift">
                <img 
                  src={youthEngagementImage} 
                  alt="Nigerian youth in civic engagement" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Our Cause Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-sm text-green-600 font-semibold mb-4 uppercase tracking-wider">SUPPORT OUR CAUSE</div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Every donation helps us build stronger platforms
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Every donation helps us to build stronger platforms, offer more resources, and reach more
                Nigerians eager to 'Step Up' and make a difference.
              </p>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black px-8 py-4 text-lg font-semibold rounded-lg"
                data-testid="button-fund-movement-footer"
              >
                Fund the Movement
              </Button>
            </div>

            <div className="relative">
              {/* Nigerian Coat of Arms Reference */}
              <div className="absolute -top-8 -right-8 z-10 bg-white/20 rounded-full p-2">
                <img 
                  src={coatOfArmsImage} 
                  alt="Nigerian Coat of Arms"
                  className="w-28 h-28 object-contain drop-shadow-lg"
                  onError={(e) => {
                    console.error('Coat of arms image failed to load:', coatOfArmsImage);
                  }}
                />
              </div>
              <h3 className="font-display text-2xl font-bold text-gray-900 mb-6">Trusted & Verified</h3>
              <div className="space-y-4 mb-8">
                <div className="flex items-center bg-white/10 backdrop-blur-xl rounded-lg p-4 border border-white/20 shadow-2xl">
                  <Shield className="w-8 h-8 text-green-600 mr-4" />
                  <div>
                    <h4 className="font-semibold text-gray-900">CAC Registered NGO</h4>
                    <p className="text-sm text-gray-600">Corporate Affairs Commission certified organization</p>
                  </div>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-xl rounded-lg p-4 border border-white/20 shadow-2xl">
                  <Users className="w-8 h-8 text-blue-600 mr-4" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Transparent Operations</h4>
                    <p className="text-sm text-gray-600">All transactions and activities publicly auditable</p>
                  </div>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-xl rounded-lg p-4 border border-white/20 shadow-2xl">
                  <Trophy className="w-8 h-8 text-yellow-600 mr-4" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Award-Winning Platform</h4>
                    <p className="text-sm text-gray-600">Recognized for civic innovation and community impact</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Partner Organizations</h4>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span className="bg-gray-100 px-3 py-1 rounded-full">CIRAD Foundation</span>
                  <span className="bg-gray-100 px-3 py-1 rounded-full">Youth Development Network</span>
                  <span className="bg-gray-100 px-3 py-1 rounded-full">Civic Tech Alliance</span>
                  <span className="bg-gray-100 px-3 py-1 rounded-full">Nigeria Diaspora Commission</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-green-100 via-yellow-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight max-w-4xl mx-auto">
              A Nigeria where opportunity knows no bounds and progress knows no limits
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            {/* Vision */}
            <div className="text-center bg-white/10 backdrop-blur-xl rounded-xl p-6 sm:p-8 border border-white/20 shadow-2xl">
              <div className="text-4xl sm:text-5xl font-bold text-green-600 mb-4">01</div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                A future where every Nigerian is empowered to lead, participate, and contribute
                to a prosperous, well-governed nation.
              </p>
            </div>

            {/* Mission */}
            <div className="text-center bg-white/10 backdrop-blur-xl rounded-xl p-6 sm:p-8 border border-white/20 shadow-2xl">
              <div className="text-4xl sm:text-5xl font-bold text-yellow-500 mb-4">02</div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To inspire and empower Nigerians through education, advocacy, and leadership
                recruitment, fostering active participation to build a better nation.
              </p>
            </div>

            {/* Core Values */}
            <div className="text-center bg-white/10 backdrop-blur-xl rounded-xl p-6 sm:p-8 border border-white/20 shadow-2xl">
              <div className="text-4xl sm:text-5xl font-bold text-blue-600 mb-4">03</div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-gray-900 mb-4">Core Values</h3>
              <div className="space-y-3 text-sm text-gray-600 text-left max-w-xs mx-auto">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3 flex-shrink-0"></div>
                  <span>Equipping Nigerians with leadership tools</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3 flex-shrink-0"></div>
                  <span>Transparency and accountability</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3 flex-shrink-0"></div>
                  <span>Collaborative partnerships</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3 flex-shrink-0"></div>
                  <span>Inclusive representation</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3 flex-shrink-0"></div>
                  <span>Innovation and solutions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Movement Section - BE THE CHANGE */}
      <div className="relative py-20 bg-gradient-to-br from-green-700 via-green-600 to-green-800 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={youthEngagementImage} 
            alt="Nigerian youth in civic engagement" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-green-800/80 via-green-700/80 to-green-600/80"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-white">
              <div className="bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-bold inline-block mb-4">
                🌟 BE THE CHANGE
              </div>
              <h2 className="text-4xl font-bold mb-6 leading-tight">
                Join the movement for change in Nigeria
              </h2>
              <p className="text-xl mb-8 opacity-95 leading-relaxed">
                Become a cornerstone of change by joining the Step Up Naija community. Connect with verified leaders, 
                drive real impact in your community, and earn rewards for your civic engagement.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-4"></div>
                  <span className="text-lg">Connect with like-minded individuals</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-4"></div>
                  <span className="text-lg">Make a difference in your community</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-4"></div>
                  <span className="text-lg">Drive positive change in Nigeria</span>
                </div>
              </div>

              <Button 
                size="lg"
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black px-8 py-4 text-lg font-bold shadow-xl transform hover:scale-105 transition-all border-2 border-yellow-400"
                onClick={() => window.location.href = '/auth?mode=signup'}
                data-testid="button-join-movement"
              >
                🚀 Join the #13K Challenge
              </Button>
            </div>

            <div className="flex justify-center">
              <div className="relative w-96 h-96 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
                <img 
                  src={youthLeadershipImage} 
                  alt="Nigerian youth embracing the future" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="text-lg font-bold mb-1">🇳🇬 Nigeria's Future</div>
                  <div className="text-sm opacity-90">United by purpose, driven by change</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-sm text-green-600 font-semibold mb-4 uppercase tracking-wider">OUR LEADERSHIP</div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Meet the team building Nigeria's future
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experienced leaders committed to transparency, governance, and civic empowerment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 shadow-2xl">
              <div className="w-24 h-24 mx-auto mb-4 overflow-hidden rounded-full border-4 border-green-200 shadow-lg">
                <img 
                  src={drRasheedImage} 
                  alt="Dr. Rasheed Abubakar - Founder & Executive Director"
                  className="w-full h-full object-cover object-center"
                  data-testid="img-leader-rasheed"
                />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 text-lg">Dr. Rasheed Abubakar</h3>
              <p className="text-sm text-green-600 mb-3 font-medium">Founder & Executive Director</p>
              <p className="text-xs text-gray-600 leading-relaxed">PhD in Public Administration with 15+ years transforming governance systems across Nigeria. Former policy advisor and published researcher on democratic institutions, leading CIRAD's mission to identify and empower 13,000 credible leaders nationwide.</p>
            </div>

            <div className="text-center bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 shadow-2xl">
              <div className="w-24 h-24 mx-auto mb-4 overflow-hidden rounded-full border-4 border-yellow-200 shadow-lg">
                <img 
                  src={aishaImage} 
                  alt="Aisha Abdullahi - Program Director"
                  className="w-full h-full object-cover object-center"
                  data-testid="img-leader-aisha"
                />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 text-lg">Aisha Abdullahi</h3>
              <p className="text-sm text-yellow-600 mb-3 font-medium">Program Director</p>
              <p className="text-xs text-gray-600 leading-relaxed">Masters in Development Studies specializing in community mobilization and youth engagement. Over 10 years designing leadership programs that have trained 2,500+ emerging leaders across Northern Nigeria's 19 states, with expertise in civic education curriculum development.</p>
            </div>

            <div className="text-center bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 shadow-2xl">
              <div className="w-24 h-24 mx-auto mb-4 overflow-hidden rounded-full border-4 border-blue-200 shadow-lg">
                <img 
                  src={emmanuelImage} 
                  alt="Emmanuel Nwosu - Technology Director"
                  className="w-full h-full object-cover object-center"
                  data-testid="img-leader-emmanuel"
                />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 text-lg">Emmanuel Nwosu</h3>
              <p className="text-sm text-blue-600 mb-3 font-medium">Technology Director</p>
              <p className="text-xs text-gray-600 leading-relaxed">Computer Science graduate and fintech entrepreneur with 8+ years building scalable platforms across Africa. Architect of Step Up Naija's blockchain-enabled SUP token system and transparent civic engagement technology, previously CTO at two Nigerian startups reaching 100,000+ users.</p>
            </div>

            <div className="text-center bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 shadow-2xl">
              <div className="w-24 h-24 mx-auto mb-4 overflow-hidden rounded-full border-4 border-purple-200 shadow-lg">
                <img 
                  src={sarahImage} 
                  alt="Sarah Okafor - Community Relations"
                  className="w-full h-full object-cover object-center"
                  data-testid="img-leader-sarah"
                />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 text-lg">Sarah Okafor</h3>
              <p className="text-sm text-purple-600 mb-3 font-medium">Community Relations Director</p>
              <p className="text-xs text-gray-600 leading-relaxed">Communications specialist with 12+ years in stakeholder engagement and partnership development. Former NGO program manager who built coalitions across 200+ civil society organizations, now managing Step Up Naija's relationships with traditional institutions, youth groups, and government agencies.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-sm text-green-600 font-semibold mb-4 uppercase tracking-wider">FREQUENTLY ASKED QUESTIONS</div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Your questions answered
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about Step Up Naija and the #13kCredibleChallenge
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 shadow-2xl">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">How does the SUP token system work?</h3>
              <p className="text-gray-600 leading-relaxed">SUP tokens are earned by completing civic activities like quizzes, surveys, and community events. 1 SUP token equals ₦100. You can use these tokens to enter weekly prize draws or vote on community projects.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 shadow-2xl">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Is it really free to participate?</h3>
              <p className="text-gray-600 leading-relaxed">Yes! Joining Step Up Naija and participating in the #13kCredibleChallenge is completely free. There are no hidden fees, subscription costs, or purchase requirements.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 shadow-2xl">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">How are the 13,000 credible leaders selected?</h3>
              <p className="text-gray-600 leading-relaxed">Leaders are democratically chosen by millions of participating Nigerians through community nominations, public voting, verified background checks, and selection based on demonstrated civic responsibility and community impact across all 774 LGAs.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 shadow-2xl">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">What kind of civic activities can I do?</h3>
              <p className="text-gray-600 leading-relaxed">Activities include civic education quizzes, community surveys, local government awareness programs, voter education, leadership training workshops, and participation in community development projects.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 shadow-2xl">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">How is my personal information protected?</h3>
              <p className="text-gray-600 leading-relaxed">We use enterprise-grade security measures to protect your data. All transactions are transparent and publicly auditable, while personal information remains private and secure.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 shadow-2xl">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Can diaspora Nigerians participate?</h3>
              <p className="text-gray-600 leading-relaxed">Absolutely! Step Up Naija actively engages Nigerians both at home and in the diaspora. You can participate in digital activities, contribute to projects, and stay connected with your home communities.</p>
            </div>
          </div>
        </div>
      </section>






    </div>
  );
}