import { ChevronLeft, Shield, Lock, Eye, UserCheck, AlertTriangle, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SecurityPage() {
  const [, setLocation] = useLocation();

  const securityFeatures = [
    {
      icon: <Lock className="w-8 h-8 text-green-600" />,
      title: "Data Encryption",
      description: "All data is encrypted in transit and at rest using industry-standard AES-256 encryption",
      status: "Active"
    },
    {
      icon: <UserCheck className="w-8 h-8 text-blue-600" />,
      title: "Multi-Factor Authentication",
      description: "Optional 2FA via SMS and email for enhanced account security",
      status: "Available"
    },
    {
      icon: <Eye className="w-8 h-8 text-purple-600" />,
      title: "Activity Monitoring",
      description: "Real-time monitoring of suspicious activities and automated alerts",
      status: "Active"
    },
    {
      icon: <Shield className="w-8 h-8 text-yellow-600" />,
      title: "Fraud Protection",
      description: "Advanced fraud detection systems to protect your SUP tokens and account",
      status: "Active"
    }
  ];

  const securityTips = [
    {
      title: "Use a Strong Password",
      description: "Create a unique password with at least 8 characters, including numbers and symbols",
      priority: "High"
    },
    {
      title: "Enable Two-Factor Authentication",
      description: "Add an extra layer of security to your account with 2FA",
      priority: "High"
    },
    {
      title: "Keep Contact Info Updated",
      description: "Ensure your email and phone number are current for security alerts",
      priority: "Medium"
    },
    {
      title: "Review Account Activity",
      description: "Regularly check your account activity and report any suspicious behavior",
      priority: "Medium"
    },
    {
      title: "Be Cautious with Public WiFi",
      description: "Avoid accessing your account on unsecured public networks",
      priority: "Medium"
    },
    {
      title: "Log Out on Shared Devices",
      description: "Always log out when using computers or devices that others can access",
      priority: "Low"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setLocation("/")}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              data-testid="button-back"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back to Home
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Security & Safety</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your security is our top priority. Learn about our comprehensive security measures and 
            how to keep your Step Up Naija account safe and secure.
          </p>
        </div>

        {/* Security Overview */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Security Measures</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {securityFeatures.map((feature, index) => (
              <Card key={index} className="border-l-4 border-l-green-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {feature.icon}
                      <CardTitle className="ml-3">{feature.title}</CardTitle>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      {feature.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Security Best Practices */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Best Practices</h2>
            <div className="space-y-4">
              {securityTips.map((tip, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="font-semibold text-gray-900">{tip.title}</h3>
                          <Badge 
                            variant={tip.priority === 'High' ? 'destructive' : tip.priority === 'Medium' ? 'default' : 'secondary'}
                            className="ml-2 text-xs"
                          >
                            {tip.priority} Priority
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm">{tip.description}</p>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-500 ml-4 flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Security Alerts & Support */}
          <div className="space-y-6">
            {/* Security Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-600" />
                  Security Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Platform Security</span>
                    <Badge className="bg-green-100 text-green-700">Optimal</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Data Protection</span>
                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Fraud Monitoring</span>
                    <Badge className="bg-green-100 text-green-700">24/7</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Last Security Audit</span>
                    <span className="text-sm text-gray-500">Dec 2024</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Report Security Issues */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                  Report Security Issues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  Found a security vulnerability or suspicious activity? Report it immediately.
                </p>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full text-sm"
                    data-testid="button-report-security"
                  >
                    Report Security Issue
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full text-sm text-red-600 hover:text-red-700"
                    data-testid="button-emergency-contact"
                  >
                    Emergency: +234 801 234 5678
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Compliance */}
            <Card>
              <CardHeader>
                <CardTitle>Compliance & Certifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-gray-600">NDPR Compliant</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-gray-600">ISO 27001 Standards</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-gray-600">PCI DSS Ready</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-gray-600">Regular Audits</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Data Protection Notice */}
        <div className="mt-12 bg-blue-50 rounded-2xl p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Data, Your Rights</h3>
            <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
              We're committed to protecting your personal information and maintaining transparency 
              about how we collect, use, and safeguard your data. Learn more about your rights 
              and our privacy practices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline"
                onClick={() => setLocation("/privacy")}
                data-testid="button-privacy-policy"
              >
                Read Privacy Policy
              </Button>
              <Button 
                onClick={() => setLocation("/contact")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                data-testid="button-contact-privacy"
              >
                Contact Privacy Team
              </Button>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertTriangle className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-red-800 mb-2">Security Emergency?</h3>
              <p className="text-red-700 text-sm mb-3">
                If you believe your account has been compromised or you've discovered a critical 
                security vulnerability, contact us immediately:
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button size="sm" variant="outline" className="text-red-700 border-red-300">
                  Email: security@stepupnaija.org
                </Button>
                <Button size="sm" variant="outline" className="text-red-700 border-red-300">
                  WhatsApp: +234 801 234 5678
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}