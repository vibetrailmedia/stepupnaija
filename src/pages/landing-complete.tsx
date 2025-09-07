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
import logoUrl from "@/assets/primary-logo.png";
import youthEngagementImage from "@assets/generated_images/Nigerian_youth_civic_engagement_scene_024f101a.png";
import youthLeadershipImage from "@assets/generated_images/Nigerian_youth_leadership_action_scene_a4fe4b9b.png";
import drRasheedImage from "@assets/generated_images/Nigerian_executive_director_headshot_66d7aed0.png";
import aishaImage from "@assets/generated_images/Nigerian_program_director_headshot_e243da1e.png";
import emmanuelImage from "@assets/generated_images/Nigerian_tech_director_headshot_f21fc2b5.png";
import sarahImage from "@assets/generated_images/Nigerian_community_relations_headshot_1fca20ac.png";
import tariAvatarImage from "@/assets/tari-avatar.webp";
import kamsiAvatarImage from "@/assets/kamsi-avatar.webp";

export default function Landing() {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-white page-transition">
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

            {/* Video Placeholder - Hidden on Mobile */}
            <div className="hidden sm:block max-w-4xl mx-auto mb-8 lg:mb-12">
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-green-200/50">
                <div className="aspect-video bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                      <Play className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                      {t('landing.tari.videoTitle')}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Professional AI-powered introduction video coming soon!
                    </p>
                    <div className="flex items-center justify-center gap-2 text-green-600 text-sm font-semibold">
                      <Sparkles className="w-4 h-4" />
                      <span>Powered by HeyGen AI Technology</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 lg:p-6 bg-gradient-to-r from-green-50 to-yellow-50">
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

            {/* Mobile-First CTA Section */}
            <div className="text-center mb-8 sm:mb-12">
              <div className="space-y-4 sm:space-y-6">
                <Button 
                  onClick={() => window.location.href = '/auth?mode=signup'}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 px-8 sm:py-4 sm:px-12 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 text-base sm:text-lg"
                  data-testid="button-hero-join"
                >
                  🇳🇬 Join the Challenge
                </Button>
                <div className="text-xs sm:text-sm text-gray-500 font-medium">
                  ✨ Free to join • Earn rewards • Make impact
                </div>
              </div>
            </div>

            {/* Enhanced Guide Profile Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
              {/* TARI - Authority Guide */}
              <div className="group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-green-600/20 to-yellow-600/20 rounded-3xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
                <div className="relative bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-blue-200/30 hover:shadow-3xl transition-all duration-300">
                  <div className="text-center mb-6">
                    <div className="relative inline-block">
                      <div className="w-28 h-28 rounded-full overflow-hidden border-6 border-blue-200 shadow-xl mx-auto mb-4">
                        <img 
                          src={tariAvatarImage} 
                          alt="Tari Avatar" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-blue-600 rounded-full p-2 shadow-lg">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="font-display text-3xl font-black text-gray-900 tracking-tight">TARI</h3>
                      <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-blue-100 to-green-100 text-blue-800 border border-blue-200">
                        <Shield className="w-4 h-4 mr-2" />
                        {t('landing.tari.profileTitle')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center space-y-4">
                    <p className="text-blue-800 font-bold text-xl leading-relaxed">
                      {t('landing.tari.welcome')}
                    </p>
                    <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
                    <p className="text-gray-700 leading-relaxed text-base">
                      {t('landing.tari.profileDescription')}
                    </p>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <div className="inline-flex items-center space-x-2 text-sm text-blue-600 font-semibold">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span>Your Civic Authority Guide</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* KAMSI - Community Guide */}
              <div className="group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 via-yellow-600/20 to-orange-600/20 rounded-3xl transform -rotate-1 group-hover:-rotate-2 transition-transform duration-300"></div>
                <div className="relative bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-green-200/30 hover:shadow-3xl transition-all duration-300">
                  <div className="text-center mb-6">
                    <div className="relative inline-block">
                      <div className="w-28 h-28 rounded-full overflow-hidden border-6 border-green-200 shadow-xl mx-auto mb-4">
                        <img 
                          src={kamsiAvatarImage} 
                          alt="Kamsi Avatar" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-green-600 rounded-full p-2 shadow-lg">
                        <Heart className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="font-display text-3xl font-black text-gray-900 tracking-tight">KAMSI</h3>
                      <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-green-100 to-yellow-100 text-green-800 border border-green-200">
                        <Heart className="w-4 h-4 mr-2" />
                        {t('landing.kamsi.profileTitle')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center space-y-4">
                    <p className="text-green-800 font-bold text-xl leading-relaxed">
                      {t('landing.kamsi.welcome')}
                    </p>
                    <div className="h-px bg-gradient-to-r from-transparent via-green-200 to-transparent"></div>
                    <p className="text-gray-700 leading-relaxed text-base">
                      {t('landing.kamsi.profileDescription')}
                    </p>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <div className="inline-flex items-center space-x-2 text-sm text-green-600 font-semibold">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Your Community Connection Guide</span>
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
              <div className="card-luxury bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-green-200/30 mb-8">
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
              
              {/* Challenge Progress Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-center max-w-2xl mx-auto lg:mx-0">
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg" style={{color: 'white !important'}}>
                  <div className="text-3xl sm:text-4xl font-black mb-2" style={{color: 'white !important'}}>3,247</div>
                  <div className="text-sm font-bold mb-1" style={{color: 'white !important'}}>Leaders Identified</div>
                  <div className="text-xs mt-1" style={{color: 'white !important'}}>Target: 13,000</div>
                </div>
                <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-xl p-6 shadow-lg" style={{color: 'white !important'}}>
                  <div className="text-3xl sm:text-4xl font-black mb-2" style={{color: 'white !important'}}>542</div>
                  <div className="text-sm font-bold mb-1" style={{color: 'white !important'}}>LGAs Covered</div>
                  <div className="text-xs mt-1" style={{color: 'white !important'}}>Target: 774</div>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl p-6 shadow-lg" style={{color: 'white !important'}}>
                  <div className="text-3xl sm:text-4xl font-black mb-2" style={{color: 'white !important'}}>33</div>
                  <div className="text-sm font-bold mb-1" style={{color: 'white !important'}}>States Active</div>
                  <div className="text-xs mt-1" style={{color: 'white !important'}}>Target: 36 + FCT</div>
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

            {/* Right: Progress & Impact */}
            <div className="relative rounded-xl p-6 sm:p-8 lg:p-8 border border-yellow-200/30 overflow-hidden mx-2 sm:mx-0 animate-luxury-slide-up" style={{backgroundColor: 'rgba(255, 255, 255, 0.95)'}}>
              {/* Background Image */}
              <div className="absolute inset-0 opacity-5">
                <img 
                  src={youthEngagementImage} 
                  alt="Nigerian youth embracing the future" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative z-10">
                <h3 className="font-display text-xl sm:text-2xl lg:text-2xl font-bold text-gray-900 mb-6 text-center">🎯 Challenge Progress</h3>
              
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>3,247 Leaders</span>
                  <span>Target: 13,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full shadow-sm" style={{ width: '25%' }}></div>
                </div>
                <div className="text-center mt-2 text-sm text-gray-600">25% Complete</div>
              </div>

              {/* Success Stories */}
              <div className="space-y-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                      <span className="text-blue-600 font-bold text-xs">AM</span>
                    </div>
                    <span className="font-semibold text-gray-900 text-sm">Amina from Kano</span>
                  </div>
                  <p className="text-xs text-gray-700">
                    "Connected with 47 leaders in my LGA. We've launched 3 projects and secured ₦2.3M!"
                  </p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
                      <span className="text-green-600 font-bold text-xs">OE</span>
                    </div>
                    <span className="font-semibold text-gray-900 text-sm">Olumide from Lagos</span>
                  </div>
                  <p className="text-xs text-gray-700">
                    "Identified 23 genuine leaders. Our network is driving real change!"
                  </p>
                </div>
              </div>

              {/* FOMO Element */}
              <div className="bg-gradient-to-r from-red-100 to-pink-100 rounded-lg p-4 border border-red-200 text-center">
                <div className="font-bold text-red-700 text-sm">⚡ Limited Spots</div>
                <div className="text-xs text-red-600 mb-2">Only 9,753 challenge spots remaining!</div>
                <div className="text-xs text-gray-600">🔥 Join 8,432 active participants</div>
              </div>
              </div>
            </div>
          </div>
        </div>
