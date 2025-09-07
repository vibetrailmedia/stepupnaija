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
                    Login
                  </button>
                  
                  <Button 
                    onClick={() => {
                      window.location.href = '/auth?mode=signup';
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 min-h-[44px]"
                    data-testid="mobile-button-join"
                  >
                    🇳🇬 Join Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section with Background Image */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-yellow-50 to-orange-50 py-12 sm:py-20 lg:py-32">
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
          <div className="text-center mb-6 sm:mb-12 lg:mb-16">
            
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
                  🇳🇬 Nigeria's Leadership Initiative
                </div>
              </div>
              
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6">
                <span className="block bg-gradient-to-r from-green-600 via-yellow-500 to-orange-600 bg-clip-text text-transparent drop-shadow-lg">
                  #13K CREDIBLE CHALLENGE
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 max-w-4xl mx-auto leading-relaxed">
                13,000 Leaders • 774 Communities • One Nigeria
              </p>
              
              <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
                Join Nigeria's most ambitious leadership initiative. Help identify, train, and organize 
                credible leaders across all 774 Local Government Areas by 2027.
              </p>
            </div>

            {/* Action Buttons - Mobile & Desktop */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button 
                onClick={() => window.location.href = '/auth?mode=signup'}
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                data-testid="button-hero-join"
              >
                🚀 JOIN THE #13K CHALLENGE
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <Button 
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({behavior: 'smooth'})}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-2 border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 text-lg font-semibold rounded-xl"
                data-testid="button-learn-more"
              >
                <Play className="mr-2 w-5 h-5" />
                Learn How It Works
              </Button>
            </div>
            
            <p className="text-sm text-gray-500">
              ✨ Free to join • Earn SUP tokens • Make real impact • Win prizes weekly
            </p>
          </div>

          {/* Live Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-white/50">
              <div className="text-2xl sm:text-3xl font-black text-green-600 mb-2">3,247</div>
              <div className="text-sm font-semibold text-gray-600">Leaders Identified</div>
              <div className="text-xs text-green-500 mt-1">📈 Target: 13,000</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-white/50">
              <div className="text-2xl sm:text-3xl font-black text-yellow-600 mb-2">471</div>
              <div className="text-sm font-semibold text-gray-600">LGAs Covered</div>
              <div className="text-xs text-yellow-500 mt-1">🎯 Target: 774</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-white/50">
              <div className="text-2xl sm:text-3xl font-black text-blue-600 mb-2">₦2.3M</div>
              <div className="text-sm font-semibold text-gray-600">Projects Funded</div>
              <div className="text-xs text-blue-500 mt-1">💰 Growing daily</div>
            </div>
          </div>
        </div>
      </section>

      {/* #13K Challenge Explanation */}
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
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-black text-white">01</span>
              </div>
              <h3 className="font-display text-2xl font-bold mb-4 text-green-400">IDENTIFY</h3>
              <p className="text-lg leading-relaxed mb-4">
                Community-driven nominations and verification of credible leaders with proven track records of integrity and service.
              </p>
              <div className="text-sm text-green-300 font-semibold">
                Target: 13,000 Leaders • Progress: 3,247 ✓
              </div>
            </div>
            
            {/* Phase 2 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-black text-white">02</span>
              </div>
              <h3 className="font-display text-2xl font-bold mb-4 text-yellow-400">TRAIN</h3>
              <p className="text-lg leading-relaxed mb-4">
                Comprehensive civic education, governance training, and leadership development programs for all identified leaders.
              </p>
              <div className="text-sm text-yellow-300 font-semibold">
                Leadership workshops • Governance courses • Civic education
              </div>
            </div>
            
            {/* Phase 3 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-black text-white">03</span>
              </div>
              <h3 className="font-display text-2xl font-bold mb-4 text-blue-400">ORGANIZE</h3>
              <p className="text-lg leading-relaxed mb-4">
                Create a coordinated network of trained leaders working together to drive positive change in every LGA.
              </p>
              <div className="text-sm text-blue-300 font-semibold">
                774 LGAs • Coordinated action • Sustainable impact
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Four simple steps to join Nigeria's leadership transformation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-black text-green-600">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Join & Verify</h3>
              <p className="text-gray-600">
                Sign up and complete your civic profile to become part of the movement.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-black text-yellow-600">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Nominate Leaders</h3>
              <p className="text-gray-600">
                Identify and nominate credible leaders in your local government area.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-black text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Engage & Train</h3>
              <p className="text-gray-600">
                Participate in civic activities and leadership development programs.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-black text-purple-600">4</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Organize & Impact</h3>
              <p className="text-gray-600">
                Connect with your network to drive positive change in your community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Meet the Team
            </h2>
            <p className="text-xl text-gray-600">
              Dedicated leaders driving Nigeria's civic transformation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="relative mb-6">
                <img 
                  src={drRasheedImage} 
                  alt="Dr. Rasheed - Executive Director" 
                  className="w-32 h-32 rounded-full object-cover mx-auto shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Dr. Rasheed</h3>
              <p className="text-green-600 font-semibold mb-2">Executive Director</p>
              <p className="text-sm text-gray-600">
                Leading Nigeria's civic engagement revolution with 15+ years experience.
              </p>
            </div>

            <div className="text-center">
              <div className="relative mb-6">
                <img 
                  src={aishaImage} 
                  alt="Aisha - Program Director" 
                  className="w-32 h-32 rounded-full object-cover mx-auto shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Aisha</h3>
              <p className="text-yellow-600 font-semibold mb-2">Program Director</p>
              <p className="text-sm text-gray-600">
                Coordinating leadership development programs across all 774 LGAs.
              </p>
            </div>

            <div className="text-center">
              <div className="relative mb-6">
                <img 
                  src={emmanuelImage} 
                  alt="Emmanuel - Tech Director" 
                  className="w-32 h-32 rounded-full object-cover mx-auto shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Emmanuel</h3>
              <p className="text-blue-600 font-semibold mb-2">Tech Director</p>
              <p className="text-sm text-gray-600">
                Building the digital infrastructure for Nigeria's leadership network.
              </p>
            </div>

            <div className="text-center">
              <div className="relative mb-6">
                <img 
                  src={sarahImage} 
                  alt="Sarah - Community Relations" 
                  className="w-32 h-32 rounded-full object-cover mx-auto shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sarah</h3>
              <p className="text-purple-600 font-semibold mb-2">Community Relations</p>
              <p className="text-sm text-gray-600">
                Building bridges between communities and fostering collaboration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-br from-gray-900 to-green-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to Step Up for Nigeria?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Join thousands of Nigerians who are already part of this historic movement. 
            Your leadership can make the difference Nigeria needs.
          </p>
          <Button 
            size="lg"
            onClick={() => window.location.href = '/auth?mode=signup'}
            className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-400 hover:to-blue-500 text-white px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300"
            data-testid="button-join-cta"
          >
            🚀 JOIN THE #13K CHALLENGE NOW
          </Button>
          <p className="text-lg mt-4 opacity-80">
            Be part of Nigeria's leadership transformation • Earn SUP tokens • Win prizes • Make history
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center mb-4">
                <img src={logoUrl} alt="Step Up Naija" className="h-8 w-8 mr-2" />
                <span className="font-bold text-gray-900">Step Up Naija</span>
              </div>
              <p className="text-gray-600 mb-4 max-w-md">
                Empowering Nigeria's future through credible leadership and civic engagement. 
                Join the #13K Challenge and be part of the change Nigeria needs.
              </p>
              <div className="flex space-x-4">
                <div className="bg-green-100 px-3 py-1 rounded-full text-sm text-green-600 font-semibold">
                  CAC Registered NGO
                </div>
                <div className="bg-blue-100 px-3 py-1 rounded-full text-sm text-blue-600 font-semibold">
                  774 LGAs
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
              <div className="space-y-2">
                <a href="/about" className="block text-gray-600 hover:text-green-600">About</a>
                <a href="/faq" className="block text-gray-600 hover:text-green-600">FAQ</a>
                <a href="/contact" className="block text-gray-600 hover:text-green-600">Contact</a>
                <a href="/dashboard" className="block text-gray-600 hover:text-green-600">Dashboard</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
              <div className="space-y-2">
                <a href="/terms" className="block text-gray-600 hover:text-green-600">Terms of Service</a>
                <a href="/privacy" className="block text-gray-600 hover:text-green-600">Privacy Policy</a>
                <a href="/security" className="block text-gray-600 hover:text-green-600">Security</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-gray-600">
              © 2025 CIRAD Good Governance Advocacy Foundation. All rights reserved.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Building Nigeria's leadership network, one LGA at a time.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}