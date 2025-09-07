import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  ArrowLeft,
  Award,
  CheckCircle,
  AlertCircle,
  Clock,
  Target,
  Shield,
  FileText
} from "lucide-react";

export default function CommitteePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Get committee type from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const committeeType = urlParams.get('type') || 'rankings';

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    profession: "",
    institution: "",
    expertise: "",
    experience: "",
    motivation: "",
    availability: "",
    references: "",
    agreeTerms: false,
    agreeTime: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Application Submitted Successfully",
        description: "Thank you for your interest! We'll review your application and contact you within 2-3 weeks.",
      });
      
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        profession: "",
        institution: "",
        expertise: "",
        experience: "",
        motivation: "",
        availability: "",
        references: "",
        agreeTerms: false,
        agreeTime: false
      });
      
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again or contact support if the problem persists.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const committeeTypes = {
    rankings: "Rankings Committee",
    methodology: "Methodology Review Board",
    data: "Data Verification Panel",
    ethics: "Ethics and Standards Committee"
  };

  const currentCommittee = committeeTypes[committeeType as keyof typeof committeeTypes] || "Rankings Committee";

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/top-schools')}
            className="mb-4"
            data-testid="button-back-to-schools"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Top Schools
          </Button>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Join {currentCommittee}</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Help shape the future of Nigerian education rankings through expert review and guidance
            </p>
          </div>
        </div>

        {/* Committee Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 text-primary-600 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900 mb-2">Purpose</h3>
              <p className="text-sm text-gray-600">Review ranking methodologies and ensure fair, accurate assessments</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900 mb-2">Commitment</h3>
              <p className="text-sm text-gray-600">2-3 hours monthly, quarterly meetings, annual review cycle</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Award className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900 mb-2">Recognition</h3>
              <p className="text-sm text-gray-600">Official certification, public acknowledgment, networking opportunities</p>
            </CardContent>
          </Card>
        </div>

        {/* Requirements */}
        <Card className="mb-8 border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <span>Committee Requirements</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Essential Qualifications</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Advanced degree in education, administration, or related field</li>
                  <li>• Minimum 5 years experience in higher education</li>
                  <li>• Strong analytical and research skills</li>
                  <li>• Commitment to objectivity and fairness</li>
                  <li>• Nigerian citizen or permanent resident</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Preferred Experience</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• University leadership or administrative roles</li>
                  <li>• Research and academic publishing experience</li>
                  <li>• Policy development or educational assessment</li>
                  <li>• International education or benchmarking</li>
                  <li>• Data analysis and statistical knowledge</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Application Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-primary-600" />
              <span>Committee Application</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name *</Label>
                  <Input
                    id="first-name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Your first name"
                    required
                    data-testid="input-first-name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name *</Label>
                  <Input
                    id="last-name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Your last name"
                    required
                    data-testid="input-last-name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your.email@example.com"
                    required
                    data-testid="input-email"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+234 xxx xxx xxxx"
                    required
                    data-testid="input-phone"
                  />
                </div>
              </div>

              {/* Professional Information */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Background</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="profession">Current Position/Title *</Label>
                    <Input
                      id="profession"
                      value={formData.profession}
                      onChange={(e) => handleInputChange('profession', e.target.value)}
                      placeholder="Professor, Dean, Director, etc."
                      required
                      data-testid="input-profession"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="institution">Current Institution *</Label>
                    <Input
                      id="institution"
                      value={formData.institution}
                      onChange={(e) => handleInputChange('institution', e.target.value)}
                      placeholder="University, organization, or company name"
                      required
                      data-testid="input-institution"
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <Label htmlFor="expertise">Area of Expertise *</Label>
                  <Select value={formData.expertise} onValueChange={(value) => handleInputChange('expertise', value)}>
                    <SelectTrigger data-testid="select-expertise">
                      <SelectValue placeholder="Select your primary area of expertise" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="academic-administration">Academic Administration</SelectItem>
                      <SelectItem value="research-methodology">Research Methodology</SelectItem>
                      <SelectItem value="educational-assessment">Educational Assessment</SelectItem>
                      <SelectItem value="data-analysis">Data Analysis & Statistics</SelectItem>
                      <SelectItem value="quality-assurance">Quality Assurance</SelectItem>
                      <SelectItem value="policy-development">Policy Development</SelectItem>
                      <SelectItem value="international-education">International Education</SelectItem>
                      <SelectItem value="student-affairs">Student Affairs</SelectItem>
                      <SelectItem value="curriculum-development">Curriculum Development</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Experience and Motivation */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Experience & Motivation</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="experience">Relevant Experience *</Label>
                    <Textarea
                      id="experience"
                      value={formData.experience}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                      placeholder="Describe your relevant experience in education, assessment, research, or related fields..."
                      rows={4}
                      required
                      data-testid="textarea-experience"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="motivation">Why do you want to join? *</Label>
                    <Textarea
                      id="motivation"
                      value={formData.motivation}
                      onChange={(e) => handleInputChange('motivation', e.target.value)}
                      placeholder="What motivates you to contribute to educational rankings and assessment?"
                      rows={4}
                      required
                      data-testid="textarea-motivation"
                    />
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Availability</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="availability">Time Commitment *</Label>
                    <Select value={formData.availability} onValueChange={(value) => handleInputChange('availability', value)}>
                      <SelectTrigger data-testid="select-availability">
                        <SelectValue placeholder="Select your availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2-3-hours-monthly">2-3 hours monthly</SelectItem>
                        <SelectItem value="4-6-hours-monthly">4-6 hours monthly</SelectItem>
                        <SelectItem value="6-10-hours-monthly">6-10 hours monthly</SelectItem>
                        <SelectItem value="flexible">Flexible based on project needs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="references">Professional References</Label>
                    <Textarea
                      id="references"
                      value={formData.references}
                      onChange={(e) => handleInputChange('references', e.target.value)}
                      placeholder="Names and contact information of 2-3 professional references (optional)"
                      rows={3}
                      data-testid="textarea-references"
                    />
                  </div>
                </div>
              </div>

              {/* Agreements */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Agreements</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="agree-terms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) => handleInputChange('agreeTerms', checked)}
                      data-testid="checkbox-agree-terms"
                    />
                    <Label htmlFor="agree-terms" className="text-sm cursor-pointer">
                      I agree to maintain confidentiality, objectivity, and ethical standards in all committee activities. I understand that committee decisions must be based on evidence and free from personal or institutional bias.
                    </Label>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="agree-time"
                      checked={formData.agreeTime}
                      onCheckedChange={(checked) => handleInputChange('agreeTime', checked)}
                      data-testid="checkbox-agree-time"
                    />
                    <Label htmlFor="agree-time" className="text-sm cursor-pointer">
                      I commit to attending scheduled meetings and dedicating the necessary time to review materials and participate actively in committee discussions and decisions.
                    </Label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>All required fields must be completed</span>
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || !formData.firstName || !formData.email || !formData.expertise || !formData.agreeTerms || !formData.agreeTime}
                    className="px-8"
                    data-testid="button-submit-application"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Submit Application
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

      </main>
    </div>
  );
}