import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageSquare, 
  ArrowLeft,
  Star,
  CheckCircle,
  AlertCircle,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";

export default function FeedbackPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Get feedback type from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const feedbackType = urlParams.get('type') || 'general';

  const [formData, setFormData] = useState({
    category: "",
    institution: "",
    rating: "",
    title: "",
    description: "",
    suggestion: "",
    contactEmail: "",
    anonymous: "false"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Feedback Submitted Successfully",
        description: "Thank you for your feedback! We'll review it and get back to you within 3-5 business days.",
      });
      
      // Reset form
      setFormData({
        category: "",
        institution: "",
        rating: "",
        title: "",
        description: "",
        suggestion: "",
        contactEmail: "",
        anonymous: "false"
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

  const feedbackCategories = {
    rankings: "Top Schools Rankings",
    methodology: "Ranking Methodology", 
    platform: "Platform Experience",
    data: "Data Accuracy",
    general: "General Feedback"
  };

  const categoryTitle = feedbackCategories[feedbackType as keyof typeof feedbackCategories] || "General Feedback";

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => {
              if (feedbackType === 'rankings') {
                setLocation('/top-schools');
              } else {
                setLocation('/');
              }
            }}
            className="mb-4"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Provide Feedback</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Help us improve {categoryTitle.toLowerCase()} - your input matters
            </p>
          </div>
        </div>

        {/* Feedback Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">2,847</div>
              <div className="text-sm text-gray-600">Total Feedback Received</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">94%</div>
              <div className="text-sm text-gray-600">Positive Response Rate</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">72h</div>
              <div className="text-sm text-gray-600">Average Response Time</div>
            </CardContent>
          </Card>
        </div>

        {/* Feedback Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-primary-600" />
              <span>{categoryTitle} Feedback</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Feedback Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Feedback Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger data-testid="select-feedback-category">
                      <SelectValue placeholder="Select feedback category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ranking-accuracy">Ranking Accuracy</SelectItem>
                      <SelectItem value="methodology-improvement">Methodology Improvement</SelectItem>
                      <SelectItem value="data-correction">Data Correction</SelectItem>
                      <SelectItem value="new-feature">New Feature Request</SelectItem>
                      <SelectItem value="user-experience">User Experience</SelectItem>
                      <SelectItem value="technical-issue">Technical Issue</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="institution">Related Institution (Optional)</Label>
                  <Input
                    id="institution"
                    value={formData.institution}
                    onChange={(e) => handleInputChange('institution', e.target.value)}
                    placeholder="University name (if applicable)"
                    data-testid="input-institution"
                  />
                </div>
              </div>

              {/* Overall Rating */}
              <div className="space-y-4">
                <Label>Overall Rating *</Label>
                <RadioGroup 
                  value={formData.rating} 
                  onValueChange={(value) => handleInputChange('rating', value)}
                  className="flex space-x-6"
                >
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <div key={rating} className="flex items-center space-x-2">
                      <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} data-testid={`radio-rating-${rating}`} />
                      <Label htmlFor={`rating-${rating}`} className="flex items-center space-x-1 cursor-pointer">
                        <span>{rating}</span>
                        <Star className="w-4 h-4 fill-current text-yellow-400" />
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Feedback Details */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Feedback Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Brief summary of your feedback"
                    required
                    data-testid="input-feedback-title"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Detailed Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Please provide detailed feedback..."
                    rows={5}
                    required
                    data-testid="textarea-description"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="suggestion">Suggestions for Improvement</Label>
                  <Textarea
                    id="suggestion"
                    value={formData.suggestion}
                    onChange={(e) => handleInputChange('suggestion', e.target.value)}
                    placeholder="How can we improve? Any specific recommendations?"
                    rows={3}
                    data-testid="textarea-suggestion"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                
                <div className="space-y-4">
                  <div className="space-y-4">
                    <Label>Submission Preference</Label>
                    <RadioGroup 
                      value={formData.anonymous} 
                      onValueChange={(value) => handleInputChange('anonymous', value)}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="false" id="with-contact" data-testid="radio-with-contact" />
                        <Label htmlFor="with-contact" className="cursor-pointer">
                          Include my contact information (recommended for follow-up)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="true" id="anonymous" data-testid="radio-anonymous" />
                        <Label htmlFor="anonymous" className="cursor-pointer">
                          Submit anonymously
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {formData.anonymous === "false" && (
                    <div className="space-y-2">
                      <Label htmlFor="contact-email">Email Address</Label>
                      <Input
                        id="contact-email"
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                        placeholder="your.email@example.com"
                        data-testid="input-contact-email"
                      />
                      <p className="text-xs text-gray-500">
                        We'll only use this to follow up on your feedback if needed
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => handleInputChange('category', 'ranking-accuracy')}>
                    <div className="flex items-center space-x-3">
                      <ThumbsUp className="w-5 h-5 text-green-600" />
                      <div>
                        <h4 className="font-medium">Report Ranking Issue</h4>
                        <p className="text-sm text-gray-600">Found an error in school rankings?</p>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => handleInputChange('category', 'new-feature')}>
                    <div className="flex items-center space-x-3">
                      <ThumbsDown className="w-5 h-5 text-blue-600" />
                      <div>
                        <h4 className="font-medium">Suggest Feature</h4>
                        <p className="text-sm text-gray-600">Have an idea for improvement?</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Submit Button */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>All fields marked with * are required</span>
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || !formData.category || !formData.title || !formData.description || !formData.rating}
                    className="px-8"
                    data-testid="button-submit-feedback"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Submit Feedback
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