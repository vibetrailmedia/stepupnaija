import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  ArrowLeft,
  FileText,
  School,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";

export default function DataSubmissionPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Get submission type from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const submissionType = urlParams.get('type') || 'school';

  const [formData, setFormData] = useState({
    institutionName: "",
    institutionType: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    position: "",
    dataCategory: "",
    academicYear: "",
    description: "",
    documents: [] as File[]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({ ...prev, documents: [...prev.documents, ...files] }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Data Submitted Successfully",
        description: "Your institutional data has been submitted for review. We'll contact you within 5-7 business days.",
      });
      
      // Reset form
      setFormData({
        institutionName: "",
        institutionType: "",
        contactName: "",
        contactEmail: "",
        contactPhone: "",
        position: "",
        dataCategory: "",
        academicYear: "",
        description: "",
        documents: []
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
              <Upload className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Data Submission Portal</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Submit your institutional data for inclusion in the Top Schools rankings
            </p>
          </div>
        </div>

        {/* Information Card */}
        <Card className="mb-8 border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Info className="w-5 h-5 text-blue-600" />
              <span>Submission Guidelines</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Required Information</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Official institutional documents</li>
                  <li>• Academic performance data (last 3 years)</li>
                  <li>• Student enrollment and graduation statistics</li>
                  <li>• Faculty qualifications and research output</li>
                  <li>• Community engagement programs</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Supported File Types</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• PDF documents (preferred)</li>
                  <li>• Excel spreadsheets (.xlsx, .xls)</li>
                  <li>• Word documents (.docx, .doc)</li>
                  <li>• CSV files for data tables</li>
                  <li>• Maximum file size: 10MB per file</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submission Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <School className="w-5 h-5 text-primary-600" />
              <span>Institution Data Submission</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Institution Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="institution-name">Institution Name *</Label>
                  <Input
                    id="institution-name"
                    value={formData.institutionName}
                    onChange={(e) => handleInputChange('institutionName', e.target.value)}
                    placeholder="University of Lagos"
                    required
                    data-testid="input-institution-name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="institution-type">Institution Type *</Label>
                  <Select value={formData.institutionType} onValueChange={(value) => handleInputChange('institutionType', value)}>
                    <SelectTrigger data-testid="select-institution-type">
                      <SelectValue placeholder="Select institution type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="federal-university">Federal University</SelectItem>
                      <SelectItem value="state-university">State University</SelectItem>
                      <SelectItem value="private-university">Private University</SelectItem>
                      <SelectItem value="polytechnic">Polytechnic</SelectItem>
                      <SelectItem value="college-education">College of Education</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">Contact Name *</Label>
                    <Input
                      id="contact-name"
                      value={formData.contactName}
                      onChange={(e) => handleInputChange('contactName', e.target.value)}
                      placeholder="Dr. John Doe"
                      required
                      data-testid="input-contact-name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Email Address *</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                      placeholder="contact@university.edu.ng"
                      required
                      data-testid="input-contact-email"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contact-phone">Phone Number</Label>
                    <Input
                      id="contact-phone"
                      value={formData.contactPhone}
                      onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                      placeholder="+234 xxx xxx xxxx"
                      data-testid="input-contact-phone"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <Label htmlFor="position">Position/Title *</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    placeholder="Registrar, Dean, Director of Planning, etc."
                    required
                    data-testid="input-position"
                  />
                </div>
              </div>

              {/* Data Information */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Data Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="data-category">Data Category *</Label>
                    <Select value={formData.dataCategory} onValueChange={(value) => handleInputChange('dataCategory', value)}>
                      <SelectTrigger data-testid="select-data-category">
                        <SelectValue placeholder="Select data category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="academic-performance">Academic Performance</SelectItem>
                        <SelectItem value="research-output">Research Output</SelectItem>
                        <SelectItem value="leadership-programs">Leadership Programs</SelectItem>
                        <SelectItem value="community-engagement">Community Engagement</SelectItem>
                        <SelectItem value="comprehensive">Comprehensive (All Categories)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="academic-year">Academic Year *</Label>
                    <Select value={formData.academicYear} onValueChange={(value) => handleInputChange('academicYear', value)}>
                      <SelectTrigger data-testid="select-academic-year">
                        <SelectValue placeholder="Select academic year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2023-2024">2023/2024</SelectItem>
                        <SelectItem value="2022-2023">2022/2023</SelectItem>
                        <SelectItem value="2021-2022">2021/2022</SelectItem>
                        <SelectItem value="multiple">Multiple Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Brief description of the data being submitted..."
                    rows={4}
                    data-testid="textarea-description"
                  />
                </div>
              </div>

              {/* File Upload */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Document Upload</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="documents">Upload Documents *</Label>
                    <div className="mt-2">
                      <input
                        id="documents"
                        type="file"
                        multiple
                        accept=".pdf,.xlsx,.xls,.docx,.doc,.csv"
                        onChange={handleFileUpload}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                        data-testid="input-file-upload"
                      />
                    </div>
                  </div>

                  {formData.documents.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Uploaded Files</h4>
                      <div className="space-y-2">
                        {formData.documents.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <FileText className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-700">{file.name}</span>
                              <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                              data-testid={`button-remove-file-${index}`}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
                    disabled={isSubmitting || !formData.institutionName || !formData.contactEmail || formData.documents.length === 0}
                    className="px-8"
                    data-testid="button-submit-data"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Submit Data
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