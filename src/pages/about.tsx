import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, Target, Globe, Award, Heart, Building, 
  CheckCircle, ArrowRight, Shield, Handshake, ArrowLeft 
} from "lucide-react";
import primaryLogo from "../assets/primary-logo.png";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Back Button */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => window.history.back()}
          className="flex items-center text-muted-foreground hover:text-foreground"
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <img 
            src={primaryLogo} 
            alt="Step Up Naija" 
            className="h-20 w-auto object-contain"
            data-testid="img-about-logo"
          />
        </div>
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent leading-tight" data-testid="about-title">
          About "Step Up Naija"
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Empowering Nigeria's future through credible leadership, civic engagement, 
          and transparent governance across all 774 Local Government Areas.
        </p>
      </div>

      {/* CIRAD Foundation Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-2xl">
            <Building className="w-6 h-6 text-primary" />
            <span>CIRAD Good Governance Advocacy Foundation</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg leading-relaxed">
              <strong>Step Up Naija (SUN)</strong> is the public-facing initiative of the 
              <strong> CIRAD Good Governance Advocacy Foundation</strong>, a registered Nigerian NGO 
              dedicated to civic empowerment, accountability, and leadership development. 
            </p>
            
            <p className="text-base leading-relaxed text-muted-foreground">
              CIRAD provides the institutional and legal foundation, while SUN operates as a bold, 
              youth-facing movement that engages citizens at home and in the diaspora through civic 
              education, grassroots organizing, and the #13kCredibleChallenge.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center">
                <Shield className="w-5 h-5 mr-2 text-blue-600" />
                CIRAD Foundation Mission
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Promote good governance and democratic accountability across Nigeria</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Build capacity for credible leadership at all levels of government</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Foster civic engagement and citizen participation in governance</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Ensure transparency and accountability in public service delivery</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center">
                <Target className="w-5 h-5 mr-2 text-orange-600" />
                SUN Movement Goals
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Identify and train 13,000 credible leaders across 774 LGAs</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Create a digital platform for civic engagement and accountability</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Establish a transparent token-based economy for civic participation</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Fund community projects through democratic voting and verification</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950 p-6 rounded-lg">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Legal Structure & Governance
            </h4>
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              <strong>CIRAD Board of Trustees</strong> provides legal and fiduciary oversight, 
              while the <strong>SUN Executive Team</strong> handles daily operations. 
              An <strong>Advisory Council</strong> of civic leaders, academics, and youth representatives 
              provides guidance and visibility to ensure democratic accountability.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Our Approach */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="text-center">
          <CardContent className="p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Grassroots Engagement</h3>
            <p className="text-muted-foreground text-sm">
              We work directly with communities across Nigeria's 774 LGAs to identify 
              and develop credible leaders from the ground up.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Digital Innovation</h3>
            <p className="text-muted-foreground text-sm">
              Our platform combines modern technology with traditional governance 
              to create transparent, accountable systems for civic participation.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Inclusive Development</h3>
            <p className="text-muted-foreground text-sm">
              We ensure every voice is heard, from diaspora Nigerians to local 
              community members, creating pathways for meaningful participation.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* The Challenge */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-2xl">
            <Award className="w-6 h-6 text-yellow-500" />
            <span>The #13kCredibleChallenge</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Our Ambitious Goal</h3>
              <p className="text-muted-foreground mb-4">
                The #13kCredibleChallenge is our flagship initiative to identify, verify, 
                and train 13,000 credible Nigerian leaders across all 774 Local Government Areas. 
                This represents approximately 17 verified leaders per LGA, creating a 
                comprehensive network of accountable governance advocates.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Badge className="bg-green-100 text-green-800">Phase 1</Badge>
                  <span className="text-sm">Candidate identification and nomination</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className="bg-blue-100 text-blue-800">Phase 2</Badge>
                  <span className="text-sm">Community verification and endorsements</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className="bg-purple-100 text-purple-800">Phase 3</Badge>
                  <span className="text-sm">Training and capacity building</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className="bg-orange-100 text-orange-800">Phase 4</Badge>
                  <span className="text-sm">Ongoing engagement and accountability</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Impact & Sustainability</h3>
              <p className="text-muted-foreground mb-4">
                Through our transparent SUP token economy (₦100 = 1 SUP), we create 
                sustainable incentives for civic participation while funding community 
                projects through democratic processes.
              </p>
              
              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Expected Outcomes</h4>
                <ul className="text-sm space-y-1">
                  <li>• Strengthened democratic institutions at the LGA level</li>
                  <li>• Increased citizen engagement in governance processes</li>
                  <li>• Transparent funding for high-impact community projects</li>
                  <li>• A new generation of accountable, credible leaders</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Values */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Our Core Values</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">Transparency</h4>
              <p className="text-sm text-muted-foreground">
                Open, verifiable processes in all our operations and funding
              </p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Handshake className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Accountability</h4>
              <p className="text-sm text-muted-foreground">
                Responsible stewardship of resources and clear impact measurement
              </p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">Inclusivity</h4>
              <p className="text-sm text-muted-foreground">
                Equal representation across all states, zones, and communities
              </p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
              <h4 className="font-semibold mb-2">Impact</h4>
              <p className="text-sm text-muted-foreground">
                Measurable, sustainable change in governance and civic engagement
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="text-center">
        <CardContent className="p-8">
          <h3 className="text-2xl font-bold mb-4">Join the Movement</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Whether you're in Nigeria or the diaspora, there's a place for you in building 
            a more credible, accountable, and prosperous Nigeria. Together, we can step up 
            for good governance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="flex items-center" data-testid="button-join-challenge">
              Join the #13kCredibleChallenge
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" size="lg" data-testid="button-learn-more">
              Learn More About CIRAD
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}