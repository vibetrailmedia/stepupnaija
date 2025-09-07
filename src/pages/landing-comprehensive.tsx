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
const logoUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";
const youthEngagementImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";
const youthLeadershipImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";
const drRasheedImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";
const aishaImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";
const emmanuelImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";
const sarahImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";
const tariAvatarImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";
const tariVideoThumbnail = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";
const kamsiAvatarImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";
// Using public directory path for video to fix playback issues
const tariVideoUrl = "/tari-intro-video.mp4";
const coatOfArmsImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";

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

      {/* TARI Video Introduction Section */}
      <section id="tari-video" className="py-16 sm:py-20 bg-gradient-to-br from-green-50 via-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-sm text-green-600 font-semibold mb-4 uppercase tracking-wider">MEET OUR AI GUIDE</div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              <span className="block">Meet TARI</span>
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Your Civic Engagement Guide
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              TARI (The AI Resource for Initiative) is your intelligent companion for navigating civic participation, 
              earning SUP tokens, and discovering opportunities to make a meaningful impact in Nigeria.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Video Section */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-green-100 to-green-200 rounded-2xl p-6 shadow-2xl">
                <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden bg-white shadow-lg">
                  <VideoPlayer
                    src={tariVideoUrl}
                    poster={tariVideoThumbnail}
                    title="TARI Introduction Video"
                    className="w-full h-full"
                  />
                </div>
                
                {/* Video Stats */}
                <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-lg font-bold text-green-600">4.9⭐</div>
                    <div className="text-xs text-gray-600 font-medium">User Rating</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-lg font-bold text-blue-600">10K+</div>
                    <div className="text-xs text-gray-600 font-medium">Views</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-lg font-bold text-purple-600">98%</div>
                    <div className="text-xs text-gray-600 font-medium">Helpful</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                    <MessageSquare className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Personalized Guidance</h3>
                  <p className="text-gray-600 leading-relaxed">
                    TARI learns your interests and location to recommend the most relevant civic activities,
                    community projects, and leadership opportunities in your area.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Instant Support</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Get real-time answers about SUP tokens, voting processes, community events, and
                    how to maximize your civic impact across Nigeria's 774 LGAs.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Community Connection</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Connect with verified community leaders, join local initiatives, and discover
                    collaborative opportunities to drive positive change in your region.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-yellow-50 rounded-xl p-6 border border-green-200 shadow-lg">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-green-300 mr-3">
                    <img 
                      src={tariAvatarImage} 
                      alt="TARI Avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">TARI</div>
                    <div className="text-sm text-green-600">AI Civic Guide</div>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "Hello! I'm here to help you navigate your civic journey. Whether you're earning SUP tokens,
                  exploring leadership opportunities, or looking to make an impact in your community, I'll guide
                  you every step of the way. Let's build a better Nigeria together! 🇳🇬"
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg"
                  onClick={() => window.location.href = '/auth?mode=signup'}
                  data-testid="button-start-with-tari"
                >
                  Start with TARI
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1 border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold py-3 px-6 rounded-xl"
                  onClick={() => window.location.href = '/tari-demo'}
                  data-testid="button-tari-demo"
                >
                  Try Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="text-sm text-blue-600 font-semibold mb-4 uppercase tracking-wider">HOW IT WORKS</div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              <span className="block">Your path to civic leadership</span>
              <span className="block bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                in 4 simple steps
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join millions of Nigerians building a more transparent, accountable, and participatory democracy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative group">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl text-center transform group-hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-2xl font-black text-white">1</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Join Free</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Sign up with your phone number or email. No fees, no hidden costs. Complete your profile and verify your Nigerian identity.
                </p>
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-sm font-semibold text-green-600">💡 Quick Tip</div>
                  <div className="text-xs text-green-700 mt-1">Verification takes 30 seconds</div>
                </div>
              </div>
              {/* Connection Line */}
              <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-8 h-0.5 bg-gradient-to-r from-green-300 to-yellow-300"></div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl text-center transform group-hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-2xl font-black text-white">2</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Engage & Earn</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Complete civic quizzes, surveys, and community activities to earn SUP tokens. Each token = ₦100 value.
                </p>
                <div className="bg-yellow-50 rounded-lg p-3">
                  <div className="text-sm font-semibold text-yellow-600">🏆 Earn Range</div>
                  <div className="text-xs text-yellow-700 mt-1">5-50 SUP tokens daily</div>
                </div>
              </div>
              {/* Connection Line */}
              <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-8 h-0.5 bg-gradient-to-r from-yellow-300 to-blue-300"></div>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl text-center transform group-hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-2xl font-black text-white">3</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Vote & Lead</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Use your tokens to vote for community projects and credible leaders. Run for leadership positions in your LGA.
                </p>
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-sm font-semibold text-blue-600">🗳️ Your Voice</div>
                  <div className="text-xs text-blue-700 mt-1">Shapes community future</div>
                </div>
              </div>
              {/* Connection Line */}
              <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-8 h-0.5 bg-gradient-to-r from-blue-300 to-purple-300"></div>
            </div>

            {/* Step 4 */}
            <div className="relative group">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl text-center transform group-hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-2xl font-black text-white">4</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Win & Impact</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Enter weekly prize draws, win cash rewards, and see your community projects come to life through collective action.
                </p>
                <div className="bg-purple-50 rounded-lg p-3">
                  <div className="text-sm font-semibold text-purple-600">💰 Weekly Prizes</div>
                  <div className="text-xs text-purple-700 mt-1">Up to ₦500,000</div>
                </div>
              </div>
            </div>
          </div>

          {/* Success Metrics */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-xl rounded-full px-6 py-3 border border-white/30 shadow-2xl mb-8">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-bold text-gray-800">Join 3,247+ Active Civic Leaders</span>
            </div>

            <Button 
              size="lg"
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white px-8 py-4 text-lg font-bold rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300"
              onClick={() => window.location.href = '/auth?mode=signup'}
              data-testid="button-start-journey"
            >
              🚀 Start Your Journey
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="text-sm text-green-600 font-semibold mb-4 uppercase tracking-wider">PLATFORM FEATURES</div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Everything you need for civic engagement
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Comprehensive tools for democratic participation, community building, and transparent governance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 shadow-2xl">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">SUP Token System</h3>
              <p className="text-gray-600 leading-relaxed">
                Earn digital currency for civic participation. 1 SUP token = ₦100 value for voting and prize entries.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 shadow-2xl">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Community Projects</h3>
              <p className="text-gray-600 leading-relaxed">
                Propose, vote on, and fund local development projects with transparent allocation and progress tracking.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 shadow-2xl">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Weekly Prizes</h3>
              <p className="text-gray-600 leading-relaxed">
                Enter draws to win cash prizes up to ₦500,000 weekly, funded by community contributions and partners.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 shadow-2xl">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Transparent Voting</h3>
              <p className="text-gray-600 leading-relaxed">
                Blockchain-secured voting system ensuring every voice counts in selecting credible leaders across 774 LGAs.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 shadow-2xl">
              <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Guidance</h3>
              <p className="text-gray-600 leading-relaxed">
                TARI AI provides personalized civic education, activity recommendations, and real-time support.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 shadow-2xl">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Impact Tracking</h3>
              <p className="text-gray-600 leading-relaxed">
                Monitor your civic contributions, community projects progress, and collective impact across Nigeria.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to make a difference?</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Join the most comprehensive civic engagement platform in Nigeria and be part of the change you want to see.
              </p>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-bold rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300"
                onClick={() => window.location.href = '/auth?mode=signup'}
                data-testid="button-get-started-features"
              >
                Get Started Today
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Security Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-green-100 via-yellow-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="text-sm text-green-600 font-semibold mb-4 uppercase tracking-wider">TRUST & TRANSPARENCY</div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight max-w-4xl mx-auto">
              Built on trust, secured by technology, verified by impact
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-center bg-white/10 backdrop-blur-xl rounded-lg p-4 border border-white/20 shadow-2xl">
                <Shield className="w-8 h-8 text-green-600 mr-4" />
                <div>
                  <h4 className="font-semibold text-gray-900">Blockchain Security</h4>
                  <p className="text-sm text-gray-600">All votes and transactions are cryptographically secured and publicly verifiable</p>
                </div>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-xl rounded-lg p-4 border border-white/20 shadow-2xl">
                <Users className="w-8 h-8 text-blue-600 mr-4" />
                <div>
                  <h4 className="font-semibold text-gray-900">CAC Registration</h4>
                  <p className="text-sm text-gray-600">Officially registered organization with Corporate Affairs Commission</p>
                </div>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-xl rounded-lg p-4 border border-white/20 shadow-2xl">
                <Trophy className="w-8 h-8 text-yellow-600 mr-4" />
                <div>
                  <h4 className="font-semibold text-gray-900">Award-Winning Platform</h4>
                  <p className="text-sm text-gray-600">Recognized for civic innovation and community impact</p>
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
