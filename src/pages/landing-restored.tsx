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
import kamsiAvatarImage from "@/assets/kamsi-avatar.webp";
// Using public directory path for video to fix playback issues
const tariVideoUrl = "/tari-intro-video.mp4";

export default function Landing() {
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
            <div className="flex items-center min-w-0 flex-1">
              <img 
                src={logoUrl} 
                alt="Step Up Naija Logo" 
                className="h-12 w-12 sm:h-14 sm:w-14 object-contain flex-shrink-0 mr-3"
                data-testid="img-logo"
              />
              {/* Mobile: Single line brand, Desktop: Stacked */}
              <div className="min-w-0">
                <div className="flex flex-col sm:hidden">
                  <span className="text-title font-display font-bold text-gradient-hero tracking-tight leading-tight drop-shadow-sm">
                    STEP UP NAIJA
                  </span>
                  <span className="text-body-sm font-ui font-medium text-gray-600 tracking-wide leading-normal opacity-90">
                    Empowering Citizens • Building Leaders
                  </span>
                </div>
                <div className="hidden sm:flex sm:flex-col">
                  <span className="text-heading md:text-display lg:text-hero font-display font-bold text-gradient-hero tracking-tight leading-display drop-shadow-lg">
                    STEP UP NAIJA
                  </span>
                  <span className="text-body sm:text-body-lg lg:text-title font-ui font-medium text-gray-600 tracking-wide leading-normal opacity-90">
                    Empowering Citizens • Building Leaders
                  </span>
                </div>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <a href="/about" className="text-gray-700 hover:text-green-600 text-sm font-medium focus-luxury px-4 py-3 rounded-lg hover:bg-green-50/50 backdrop-blur-sm" data-testid="link-about">About</a>
              <a href="/faq" className="text-gray-700 hover:text-green-600 text-sm font-medium focus-luxury px-4 py-3 rounded-lg hover:bg-green-50/50 backdrop-blur-sm" data-testid="link-faq">Support</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-green-600 text-sm font-medium focus-luxury px-4 py-3 rounded-lg hover:bg-green-50/50 backdrop-blur-sm" data-testid="link-how">How It Works</a>
              
              <LanguageSelector compact={true} />
              
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
                  className="btn-luxury bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl focus-luxury min-h-[44px] whitespace-nowrap"
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
                <a href="/about" 
                   className="block px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg font-medium transition-all duration-200 min-h-[44px] flex items-center" 
                   data-testid="mobile-link-about"
                   onClick={() => setMobileMenuOpen(false)}>
                  About Step Up Naija
                </a>
                <a href="/faq" 
                   className="block px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg font-medium transition-all duration-200 min-h-[44px] flex items-center" 
                   data-testid="mobile-link-faq"
                   onClick={() => setMobileMenuOpen(false)}>
                  Support & FAQ
                </a>
                <a href="#how-it-works" 
                   className="block px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg font-medium transition-all duration-200 min-h-[44px] flex items-center" 
                   data-testid="mobile-link-how"
                   onClick={() => setMobileMenuOpen(false)}>
                  How It Works
                </a>
                
                {/* Language Selection */}
                <div className="px-4 py-3 border-t border-gray-200/50 mt-4 pt-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Language</p>
                  <LanguageSelector compact={false} />
                </div>
                
                {/* Mobile Auth Actions */}
                <div className="space-y-3 pt-4 border-t border-gray-200/50 mt-4">
                  <button
                    onClick={() => {
                      window.location.href = '/auth';
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-center px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg font-medium transition-all duration-200 min-h-[44px] border border-gray-200"
                    data-testid="mobile-link-login"
                  >
                    {t('landing.loginButton')}
                  </button>
                  
                  <Button 
                    onClick={() => {
                      window.location.href = '/auth?mode=signup';
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 min-h-[44px]"
                    data-testid="mobile-button-join"
                  >
                    🇳🇬 {t('landing.loginButton')}
                  </Button>
                </div>
                
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* #13kCredibleChallenge Hero Section - Mobile Optimized */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-yellow-50 to-orange-50 py-12 sm:py-20 lg:py-32 animate-luxury-fade-in">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full">
            <img 
              src={youthLeadershipImage} 
              alt="Nigerian youth leading change" 
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-green-200/40 via-yellow-200/40 to-orange-200/40"></div>
          </div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Ultra-Simplified Mobile Hero */}
          <div className="text-center mb-6 sm:mb-12 lg:mb-16 animate-luxury-slide-up">
            
            {/* Mobile: Just the essential title */}
            <div className="sm:hidden space-y-4">
              <div className="bg-gradient-to-r from-green-600 to-yellow-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg inline-block mb-4">
                🇳🇬 Flagship Initiative
              </div>
              
              <h1 className="font-display text-4xl font-black leading-tight text-center px-2">
                <span className="block bg-gradient-to-r from-green-600 via-yellow-500 to-orange-600 bg-clip-text text-transparent">
                  #13K
                </span>
                <span className="block text-2xl font-bold text-gray-900 mt-1">
                  Credible Challenge
                </span>
              </h1>
              
              <p className="text-base font-semibold text-gray-800 px-4 max-w-sm mx-auto">
                13,000 Leaders • 774 Communities • One Nigeria
              </p>
            </div>

            {/* Desktop: Full version */}
            <div className="hidden sm:block">
              <div className="inline-flex items-center justify-center gap-3 mb-6 sm:mb-8">
                <div className="bg-gradient-to-r from-green-600 to-yellow-500 text-white px-6 py-3 lg:px-8 lg:py-4 rounded-full text-base lg:text-lg font-bold shadow-xl animate-pulse border-2 border-yellow-400">
                  <span>{t('landing.challenge.flagshipBadge')}</span>
                </div>
              </div>
              
              <div className="space-y-4 lg:space-y-6">
                <h1 className="font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-none text-center">
                  <span className="block bg-gradient-to-r from-green-600 via-yellow-500 to-orange-600 bg-clip-text text-transparent drop-shadow-2xl">
                    #13K
                  </span>
                  <span className="block text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mt-2">
                    {t('landing.challenge.title').replace('#13K ', '')}
                  </span>
                </h1>
                
                <div className="max-w-4xl mx-auto space-y-3 lg:space-y-4">
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 leading-tight">
                    {t('landing.challenge.subtitle')}
                  </p>
                  <p className="text-lg md:text-xl text-gray-700 font-medium leading-relaxed">
                    {t('landing.challenge.mainDescription')}
                  </p>
                  <div className="max-w-3xl mx-auto">
                    <p className="text-base md:text-lg text-gray-600 leading-relaxed font-medium">
                      {t('landing.heroDescription') || 'Transform your community • Build lasting change • Shape Nigeria\'s future'}
                    </p>
                  </div>
                  
                  <div className="flex flex-row items-center justify-center gap-6 mt-8">
                    <div className="flex items-center gap-2 text-gray-700">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-semibold">{t('landing.challenge.features.free')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="font-semibold">{t('landing.challenge.features.earnTokens')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="font-semibold">{t('landing.challenge.features.winPrizes')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Simplified TARI Guide Section */}
          <div className="text-center mb-6 sm:mb-12 lg:mb-16 animate-luxury-slide-up">
            
            {/* Mobile: Ultra-simplified */}
            <div className="sm:hidden space-y-3">
              <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg inline-block">
                AI Guide
              </div>
              <h2 className="font-display text-2xl font-black text-gray-900 px-2">
                Meet <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">TARI</span>
              </h2>
              <p className="text-sm text-gray-700 px-4 max-w-xs mx-auto">
                Your civic engagement companion
              </p>
            </div>

            {/* Desktop: Full version */}
            <div className="hidden sm:block">
              <div className="inline-flex items-center justify-center mb-6">
                <div className="bg-gradient-to-r from-green-600 to-yellow-500 text-white px-6 py-3 rounded-full text-sm font-semibold tracking-wide shadow-lg">
                  {t('landing.tari.badge')}
                </div>
              </div>
              
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
                {t('landing.tari.title').split(' ')[0]}
                <span className="block bg-gradient-to-r from-green-600 via-yellow-500 to-orange-600 bg-clip-text text-transparent font-black">
                  {t('landing.tari.title').split(' ')[1] || 'TARI'}
                </span>
              </h2>
              
              <p className="text-lg md:text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8 lg:mb-12 font-medium">
                {t('landing.tari.subtitle')}
              </p>
            </div>
          </div>

            {/* TARI Introduction Video - Hidden on Mobile */}
            <div className="hidden sm:block max-w-4xl mx-auto mb-8 lg:mb-12">
              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 hover:bg-white/15 transition-all duration-500">
                <div className="aspect-video bg-gradient-to-br from-green-50 to-blue-50">
                  <VideoPlayer
                    src={tariVideoUrl}
                    poster={tariVideoUrl}
                    title="Meet Tari - Your Civic Authority Guide"
                    className="w-full h-full"
                  />
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


            {/* Enhanced Guide Profile Cards - Glassmorphism Style */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* TARI - Authority Guide */}
              <div className="group relative h-full">
                <div className="relative h-full bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl hover:shadow-3xl hover:bg-white/15 transition-all duration-500 overflow-hidden">
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-green-500/5"></div>
                  
                  {/* Content */}
                  <div className="relative z-10 p-8 flex flex-col items-center text-center h-full justify-between">
                    {/* Avatar Section */}
                    <div className="flex-shrink-0">
                      <div className="relative inline-block mb-6">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/30 shadow-xl bg-white/10 backdrop-blur-sm">
                          <img 
                            src={tariAvatarImage} 
                            alt="Tari Avatar" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-blue-500/90 backdrop-blur-sm rounded-full p-1.5 border border-white/20">
                          <Shield className="w-3.5 h-3.5 text-white" />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h3 className="font-display text-2xl font-black text-gray-900 tracking-tight">TARI</h3>
                        <div className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm text-blue-700 border border-white/20">
                          <Shield className="w-3 h-3 mr-2" />
                          Authority Guide
                        </div>
                      </div>
                    </div>
                    
                    {/* Content Section */}
                    <div className="flex-grow flex flex-col justify-center space-y-4 py-4">
                      <p className="text-blue-800 font-bold text-lg leading-relaxed">
                        {t('landing.tari.welcome')}
                      </p>
                      <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                      <p className="text-gray-700 leading-relaxed text-sm">
                        {t('landing.tari.profileDescription')}
                      </p>
                    </div>
                    
                    {/* Footer */}
                    <div className="flex-shrink-0 mt-4">
                      <div className="inline-flex items-center space-x-2 text-xs text-blue-600 font-semibold bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                        <span>Your Civic Authority Guide</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* KAMSI - Community Guide */}
              <div className="group relative h-full">
                <div className="relative h-full bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl hover:shadow-3xl hover:bg-white/15 transition-all duration-500 overflow-hidden">
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-yellow-500/5"></div>
                  
                  {/* Content */}
                  <div className="relative z-10 p-8 flex flex-col items-center text-center h-full justify-between">
                    {/* Avatar Section */}
                    <div className="flex-shrink-0">
                      <div className="relative inline-block mb-6">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/30 shadow-xl bg-white/10 backdrop-blur-sm">
                          <img 
                            src={kamsiAvatarImage} 
                            alt="Kamsi Avatar" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-green-500/90 backdrop-blur-sm rounded-full p-1.5 border border-white/20">
                          <Heart className="w-3.5 h-3.5 text-white" />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h3 className="font-display text-2xl font-black text-gray-900 tracking-tight">KAMSI</h3>
                        <div className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm text-green-700 border border-white/20">
                          <Heart className="w-3 h-3 mr-2" />
                          Community Guide
                        </div>
                      </div>
                    </div>
                    
                    {/* Content Section */}
                    <div className="flex-grow flex flex-col justify-center space-y-4 py-4">
                      <p className="text-green-800 font-bold text-lg leading-relaxed">
                        {t('landing.kamsi.welcome')}
                      </p>
                      <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                      <p className="text-gray-700 leading-relaxed text-sm">
                        {t('landing.kamsi.profileDescription')}
                      </p>
                    </div>
                    
                    {/* Footer */}
                    <div className="flex-shrink-0 mt-4">
                      <div className="inline-flex items-center space-x-2 text-xs text-green-600 font-semibold bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                        <span>Your Community Connection Guide</span>
                      </div>
                    </div>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Challenge Description */}
            <div className="text-center lg:text-left px-4 sm:px-6 lg:px-0 max-w-2xl mx-auto lg:mx-0">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20 hover:bg-white/15 transition-all duration-500 mb-8">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  🚀 Join Nigeria's Biggest Civic Movement
                </h2>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  Be part of Nigeria's most ambitious leadership initiative. We're identifying, training, and organizing 13,000 credible leaders across all 774 LGAs to transform Nigeria by 2027.
                </p>
                <div className="bg-gradient-to-r from-green-500 to-yellow-500 text-white p-4 rounded-lg">
                  <p className="font-semibold text-center">
                    💡 Every participant earns SUP tokens • Wins prizes • Drives real change
                  </p>
                </div>
              </div>
              
              {/* Challenge Progress Stats - Optimized & Clean */}
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl mb-8">
                <h3 className="font-display text-xl font-bold text-gray-900 mb-6 text-center">🎯 Challenge Progress</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                  <div className="space-y-2">
                    <div className="text-2xl sm:text-3xl font-black text-green-600">3,247</div>
                    <div className="text-sm font-semibold text-gray-700">Leaders</div>
                    <div className="text-xs text-gray-500">of 13,000</div>
                    <div className="w-full bg-gray-200/50 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-2xl sm:text-3xl font-black text-yellow-600">542</div>
                    <div className="text-sm font-semibold text-gray-700">LGAs</div>
                    <div className="text-xs text-gray-500">of 774</div>
                    <div className="w-full bg-gray-200/50 rounded-full h-2">
                      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-2xl sm:text-3xl font-black text-blue-600">33</div>
                    <div className="text-sm font-semibold text-gray-700">States</div>
                    <div className="text-xs text-gray-500">of 37</div>
                    <div className="w-full bg-gray-200/50 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{ width: '89%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-xl mx-auto lg:mx-0">
                <Button 
                  size="lg" 
                  className="btn-luxury bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-3 sm:px-5 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-black rounded-xl shadow-xl transform hover:scale-105 transition-all duration-300 min-h-[48px] sm:min-h-[56px] border-4 border-white text-center flex-1"
                  onClick={() => window.location.href = '/auth?mode=signup'}
                  data-testid="button-join-13k-challenge"
                  aria-label="Join the 13k Credible Challenge - Start your leadership journey"
                >
                  <span className="inline sm:hidden">🔥 JOIN</span>
                  <span className="hidden sm:inline lg:hidden">🔥 JOIN #13K</span>
                  <span className="hidden lg:inline">🔥 JOIN #13K CHALLENGE</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-3 border-green-600 bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-xl transition-all duration-300 min-h-[48px] sm:min-h-[56px] shadow-lg hover:shadow-xl"
                  onClick={() => document.getElementById('challenge-explained')?.scrollIntoView({ behavior: 'smooth' })}
                  data-testid="button-learn-challenge"
                  aria-label="Learn more about the 13k Credible Challenge"
                >
                  <span className="block sm:inline">Learn More</span>
                  <span className="hidden sm:inline"> About Challenge</span>
                </Button>
              </div>
            </div>

            {/* Right: Community Impact & Testimonials */}
            <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl overflow-hidden mx-2 sm:mx-0">
              {/* Background Image */}
              <div className="absolute inset-0 opacity-5">
                <img 
                  src={youthEngagementImage} 
                  alt="Nigerian youth embracing the future" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="relative z-10">
                <h3 className="font-display text-xl font-bold text-gray-900 mb-6 text-center">💫 Community Impact</h3>
              
                {/* Success Stories - Optimized */}
                <div className="space-y-4 mb-6">
                  <div className="bg-blue-500/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-bold text-xs">AM</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">Amina from Kano</div>
                        <div className="text-xs text-gray-600">Community Leader</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      "Connected with 47 leaders in my LGA. We've launched 3 projects and secured ₦2.3M!"
                    </p>
                  </div>
                  
                  <div className="bg-green-500/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
                        <span className="text-green-600 font-bold text-xs">OE</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">Olumide from Lagos</div>
                        <div className="text-xs text-gray-600">Network Coordinator</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      "Identified 23 genuine leaders. Our network is driving real change!"
                    </p>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30 text-center">
                  <div className="font-bold text-gray-900 text-lg mb-2">Join the Movement</div>
                  <div className="text-sm text-gray-600 mb-4">8,432 active participants driving change</div>
                  <div className="text-xs text-green-600 font-semibold">🔥 9,753 spots remaining</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Dedicated #13K Challenge Explanation Section */}
      <section id="challenge-explained" className="py-20 bg-gradient-to-br from-gray-900 to-green-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center gap-3 mb-8">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-8 py-4 rounded-full text-lg font-black shadow-xl">
                🔥 WHAT IS THE #13K CHALLENGE?
              </div>
            </div>
            
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              Nigeria's Most Ambitious
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Leadership Initiative
              </span>
            </h2>
            
            <p className="text-xl sm:text-2xl max-w-4xl mx-auto leading-relaxed opacity-90">
              A nationwide movement to identify, train, and organize 13,000 credible Nigerian leaders 
              across all 774 Local Government Areas by 2027.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Phase 1 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center" style={{backgroundColor: 'rgba(255, 255, 255, 0.1)'}}>
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-black text-white">01</span>
              </div>
              <h3 className="font-display text-2xl font-bold mb-4 text-green-400">IDENTIFY</h3>
              <p className="text-lg leading-relaxed mb-4 text-white" style={{color: 'white !important'}}>
                Community-driven nominations and verification of credible leaders with proven track records of integrity and service.
              </p>
              <div className="text-sm text-green-300 font-semibold">
                Target: 13,000 Leaders • Progress: 3,247 ✓
              </div>
            </div>
            
            {/* Phase 2 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center" style={{backgroundColor: 'rgba(255, 255, 255, 0.1)'}}>
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-black text-white">02</span>
              </div>
              <h3 className="font-display text-2xl font-bold mb-4 text-yellow-400">TRAIN</h3>
              <p className="text-lg leading-relaxed mb-4 text-white" style={{color: 'white !important'}}>
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
              <p className="text-lg leading-relaxed mb-4 text-white" style={{color: 'white !important'}}>
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
              className="btn-luxury bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-400 hover:to-blue-500 text-white px-12 py-6 text-xl font-black rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-4 border-white/30"
              onClick={() => window.location.href = '/auth?mode=signup'}
              data-testid="button-join-challenge-main"
            >
              🚀 JOIN THE #13K CHALLENGE NOW
            </Button>
            <p className="text-lg mt-4 opacity-80">
              Be part of Nigeria's leadership transformation • Earn SUP tokens • Win prizes
            </p>
          </div>
        </div>
      </section>


      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="text-sm text-green-600 font-semibold mb-4 uppercase tracking-wider">HOW IT WORKS</div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-4xl font-bold text-gray-900 mb-6">
              Simple steps to transform Nigeria together
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
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">Complete Tasks</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Participate in civic activities: quizzes, surveys, community events. 
                Each task earns you SUP tokens (₦100 = 1 SUP).
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/20 shadow-lg">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">Win Prizes</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Enter weekly prize draws with your earned tokens. Win cash prizes 
                and contribute to community projects across 774 LGAs.
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/20 shadow-lg">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">4</span>
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">Drive Change</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Vote on community projects, connect with local leaders, and see 
                your impact across Nigeria's transformation journey.
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

          {/* CTA */}
          <div className="text-center mt-12">
            <Button 
              size="lg"
              className="btn-luxury bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg focus-luxury"
              onClick={() => window.location.href = '/auth?mode=signup'}
              data-testid="button-start-journey"
            >
              Join the Challenge
            </Button>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="max-w-2xl">
              <div className="text-sm text-green-600 font-semibold mb-4 uppercase tracking-wider">ABOUT US</div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                Mobilizing Nigerians to become active change-makers.
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Step Up Naija (SUN) is the public-facing initiative of <strong>CIRAD Good Governance Advocacy Foundation</strong>, 
                a registered Nigerian NGO dedicated to civic empowerment, accountability, and leadership development.
              </p>
              <p className="text-base text-gray-500 mb-8 leading-relaxed">
                Our mission: identifying, training, and organizing 13,000 credible Nigerian leaders across all 774 Local Government Areas 
                through transparent, community-driven processes.
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
            <div className="text-center card-luxury rounded-xl p-6 sm:p-8">
              <div className="text-4xl sm:text-5xl font-bold text-green-600 mb-4">01</div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                A future where every Nigerian is empowered to lead, participate, and contribute
                to a prosperous, well-governed nation.
              </p>
            </div>

            {/* Mission */}
            <div className="text-center card-luxury rounded-xl p-6 sm:p-8">
              <div className="text-4xl sm:text-5xl font-bold text-yellow-500 mb-4">02</div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To inspire and empower Nigerians through education, advocacy, and leadership
                recruitment, fostering active participation to build a better nation.
              </p>
            </div>

            {/* Core Values */}
            <div className="text-center card-luxury rounded-xl p-6 sm:p-8">
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


      {/* Join Movement Section */}
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

      {/* FAQ Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
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
            <div className="card-luxury rounded-xl p-6 border border-gray-200/30">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">How does the SUP token system work?</h3>
              <p className="text-gray-600 leading-relaxed">SUP tokens are earned by completing civic activities like quizzes, surveys, and community events. 1 SUP token equals ₦100. You can use these tokens to enter weekly prize draws or vote on community projects.</p>
            </div>

            <div className="card-luxury rounded-xl p-6 border border-gray-200/30">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Is it really free to participate?</h3>
              <p className="text-gray-600 leading-relaxed">Yes! Joining Step Up Naija and participating in the #13kCredibleChallenge is completely free. There are no hidden fees, subscription costs, or purchase requirements.</p>
            </div>

            <div className="card-luxury rounded-xl p-6 border border-gray-200/30">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">How are the 13,000 credible leaders selected?</h3>
              <p className="text-gray-600 leading-relaxed">Leaders are identified through community nominations, verified through background checks, and selected based on their demonstrated commitment to civic responsibility and community impact across all 774 LGAs.</p>
            </div>

            <div className="card-luxury rounded-xl p-6 border border-gray-200/30">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">What kind of civic activities can I do?</h3>
              <p className="text-gray-600 leading-relaxed">Activities include civic education quizzes, community surveys, local government awareness programs, voter education, leadership training workshops, and participation in community development projects.</p>
            </div>

            <div className="card-luxury rounded-xl p-6 border border-gray-200/30">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">How is my personal information protected?</h3>
              <p className="text-gray-600 leading-relaxed">We use enterprise-grade security measures to protect your data. All transactions are transparent and publicly auditable, while personal information remains private and secure.</p>
            </div>

            <div className="card-luxury rounded-xl p-6 border border-gray-200/30">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Can diaspora Nigerians participate?</h3>
              <p className="text-gray-600 leading-relaxed">Absolutely! Step Up Naija actively engages Nigerians both at home and in the diaspora. You can participate in digital activities, contribute to projects, and stay connected with your home communities.</p>
            </div>
          </div>
        </div>
      </section>


      {/* Team Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
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
            <div className="text-center card-luxury rounded-xl p-6">
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

            <div className="text-center card-luxury rounded-xl p-6">
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

            <div className="text-center card-luxury rounded-xl p-6">
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

            <div className="text-center card-luxury rounded-xl p-6">
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

      {/* Newsletter & Contact Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-green-600 to-green-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-white">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold mb-6">
                Stay connected with Step Up Naija
              </h2>
              <p className="text-xl mb-8 leading-relaxed opacity-90">
                Get weekly updates on civic opportunities, success stories, and platform developments directly in your inbox.
              </p>
              
              <form 
                className="flex flex-col sm:flex-row gap-4 mb-8"
                onSubmit={(e) => {
                  e.preventDefault();
                  const email = (e.target as HTMLFormElement).querySelector('input[type="email"]') as HTMLInputElement;
                  if (email.value) {
                    toast({
                      title: "Successfully subscribed!",
                      description: "You'll receive weekly updates about the #13K Challenge and civic opportunities.",
                      duration: 5000,
                    });
                    email.value = '';
                  }
                }}
              >
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 border-2 border-white/20 focus:border-yellow-400 focus:outline-none"
                  data-testid="input-newsletter-email"
                  required
                />
                <Button 
                  type="submit"
                  className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold"
                  data-testid="button-newsletter-subscribe"
                >
                  Subscribe
                </Button>
              </form>

            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20" style={{backgroundColor: 'rgba(255, 255, 255, 0.1)'}}>
              <h3 className="font-display text-2xl font-bold mb-6 text-white" style={{color: 'white !important'}}>Ready to make a difference?</h3>
              <div className="space-y-4 mb-6">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-4"></div>
                  <span className="text-lg text-white" style={{color: 'white !important'}}>Join 8,432+ active participants</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-4"></div>
                  <span className="text-lg text-white" style={{color: 'white !important'}}>Earn SUP tokens for civic engagement</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-4"></div>
                  <span className="text-lg text-white" style={{color: 'white !important'}}>Win prizes and fund community projects</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-4"></div>
                  <span className="text-lg text-white" style={{color: 'white !important'}}>Drive positive change in Nigeria</span>
                </div>
              </div>


              <Button 
                size="lg"
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black px-8 py-4 text-lg font-bold shadow-xl transition-all border-2 border-yellow-400"
                onClick={() => window.location.href = '/auth?mode=signup'}
                data-testid="button-join-movement"
              >
                🚀 Join the #13K Challenge
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals & Support Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-blue-50 to-green-50">
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
                className="btn-luxury bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black px-8 py-4 text-lg font-semibold rounded-lg"
                data-testid="button-fund-movement-footer"
              >
                Fund the Movement
              </Button>
            </div>

            <div>
              <h3 className="font-display text-2xl font-bold text-gray-900 mb-6">Trusted & Verified</h3>
              <div className="space-y-4 mb-8">
                <div className="flex items-center card-luxury rounded-lg p-4 border border-gray-200/30">
                  <Shield className="w-8 h-8 text-green-600 mr-4" />
                  <div>
                    <h4 className="font-semibold text-gray-900">CAC Registered NGO</h4>
                    <p className="text-sm text-gray-600">Corporate Affairs Commission certified organization</p>
                  </div>
                </div>
                <div className="flex items-center card-luxury rounded-lg p-4 border border-gray-200/30">
                  <Users className="w-8 h-8 text-blue-600 mr-4" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Transparent Operations</h4>
                    <p className="text-sm text-gray-600">All transactions and activities publicly auditable</p>
                  </div>
                </div>
                <div className="flex items-center card-luxury rounded-lg p-4 border border-gray-200/30">
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


    </div>
  );
}
