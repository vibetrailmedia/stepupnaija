import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Shield, Users, Trophy } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import logoUrl from "@/assets/primary-logo.png";

export default function LandingSimple() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img 
                src={logoUrl} 
                alt="Step Up Naija Logo" 
                className="h-12 w-12 object-contain mr-3"
                data-testid="img-logo"
              />
              <div>
                <h1 className="text-xl font-bold text-green-600">STEP UP NAIJA</h1>
                <p className="text-sm text-gray-600">Empowering Citizens • Building Leaders</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => window.location.href = '/auth'}
                variant="outline"
                data-testid="button-login"
              >
                Login
              </Button>
              <Button
                onClick={() => window.location.href = '/auth?mode=signup'}
                className="bg-green-600 hover:bg-green-700"
                data-testid="button-join"
              >
                🇳🇬 Join Now
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="bg-gradient-to-r from-green-600 to-yellow-500 text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg inline-block mb-6">
              🇳🇬 Nigeria's Leadership Initiative
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="block bg-gradient-to-r from-green-600 via-yellow-500 to-orange-600 bg-clip-text text-transparent">
                #13K Credible Challenge
              </span>
            </h1>
            
            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Join Nigeria's most ambitious leadership initiative. Help identify, train, and organize 
              13,000 credible leaders across all 774 Local Government Areas by 2027.
            </p>
            
            <Button 
              onClick={() => window.location.href = '/auth?mode=signup'}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 text-lg font-semibold"
              data-testid="button-hero-join"
            >
              🇳🇬 Join the Challenge
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            <p className="text-sm text-gray-500 mt-4">
              ✨ Free to join • Earn SUP tokens • Make real impact
            </p>
          </div>
        </div>
      </section>

      {/* Challenge Progress Section */}
      <section className="py-12 bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">🎯 Challenge Progress</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              <div className="space-y-3">
                <div className="text-3xl font-black text-green-600">3,247</div>
                <div className="text-sm font-semibold text-gray-700">Leaders</div>
                <div className="text-xs text-gray-500">of 13,000 (25%)</div>
                <div className="w-full bg-gray-200/50 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="text-3xl font-black text-yellow-600">542</div>
                <div className="text-sm font-semibold text-gray-700">LGAs</div>
                <div className="text-xs text-gray-500">of 774 (70%)</div>
                <div className="w-full bg-gray-200/50 rounded-full h-2">
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="text-3xl font-black text-blue-600">33</div>
                <div className="text-sm font-semibold text-gray-700">States</div>
                <div className="text-xs text-gray-500">of 37 (89%)</div>
                <div className="w-full bg-gray-200/50 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{ width: '89%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Transform Nigeria Through Leadership
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Be part of a revolutionary movement to identify and develop credible leaders 
              in every corner of Nigeria.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-green-600">IDENTIFY</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Community-driven nominations and verification of credible leaders 
                  with proven track records of integrity and service.
                </p>
                <div className="text-sm text-green-500 font-semibold mt-4">
                  Community nominations • Verified leaders
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-yellow-600" />
                </div>
                <CardTitle className="text-yellow-600">TRAIN</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Comprehensive civic education, governance training, and leadership 
                  development programs for all identified leaders.
                </p>
                <div className="text-sm text-yellow-500 font-semibold mt-4">
                  Leadership workshops • Governance courses • Civic education
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-blue-600">ORGANIZE</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Create a coordinated network of trained leaders working together 
                  to drive positive change in every LGA.
                </p>
                <div className="text-sm text-blue-500 font-semibold mt-4">
                  Coordinated network • Sustainable impact
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-gray-900 to-green-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Step Up for Nigeria?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Join thousands of Nigerians who are already part of this historic movement. 
            Your leadership can make the difference.
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
            Be part of Nigeria's leadership transformation • Earn SUP tokens • Win prizes
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img src={logoUrl} alt="Step Up Naija" className="h-8 w-8 mr-2" />
                <span className="font-bold text-gray-900">Step Up Naija</span>
              </div>
              <p className="text-gray-600 mb-4">
                Empowering Nigeria's future through credible leadership and civic engagement.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
              <div className="space-y-2">
                <a href="/about" className="block text-gray-600 hover:text-green-600">About</a>
                <a href="/faq" className="block text-gray-600 hover:text-green-600">FAQ</a>
                <a href="/contact" className="block text-gray-600 hover:text-green-600">Contact</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
              <div className="space-y-2">
                <a href="/terms" className="block text-gray-600 hover:text-green-600">Terms of Service</a>
                <a href="/privacy" className="block text-gray-600 hover:text-green-600">Privacy Policy</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-gray-600">
              © 2025 CIRAD Good Governance Advocacy Foundation. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}