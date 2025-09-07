import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
// Navigation provided by App.tsx - removed duplicate import
import { ObjectUploader } from "@/components/ObjectUploader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  Upload, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  FileText,
  Camera,
  MapPin,
  User,
  Mail,
  Phone
} from "lucide-react";

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", 
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo", 
  "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", 
  "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", 
  "Yobe", "Zamfara"
];

export default function KYC() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const queryClient = useQueryClient();
  
  // Detect if user is diaspora based on phone number
  useEffect(() => {
    if (user?.phone && !user.phone.startsWith('+234')) {
      setIsDiaspora(true);
      setPersonalInfo(prev => ({ ...prev, verificationType: 'basic' }));
    }
  }, [user]);
  
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    phoneNumber: "",
    state: "",
    lga: "",
    address: "",
    nationality: "Nigerian",
    verificationType: "full" // 'full' for Nigerian, 'basic' for diaspora
  });
  
  const [isDiaspora, setIsDiaspora] = useState(false);
  
  const [documents, setDocuments] = useState({
    idDocument: null as string | null,
    proofOfAddress: null as string | null,
    passport: null as string | null
  });
  
  const [currentStep, setCurrentStep] = useState(1);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/auth";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: kycStatus } = useQuery({
    queryKey: ["/api/kyc/status"],
    enabled: isAuthenticated,
    retry: false,
  });

  const { data: wallet } = useQuery({
    queryKey: ["/api/wallet"],
    enabled: isAuthenticated,
    retry: false,
  });

  const submitKYCMutation = useMutation({
    mutationFn: async (kycData: any) => {
      await apiRequest('POST', '/api/kyc/submit', kycData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/kyc/status'] });
      toast({
        title: "KYC Submitted Successfully",
        description: "Your verification documents have been submitted for review.",
      });
      setCurrentStep(4); // Move to completion step
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit KYC documents",
        variant: "destructive",
      });
    },
  });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <p className="text-gray-600">Loading KYC verification...</p>
        </div>
      </div>
    );
  }

  const getKYCStatusInfo = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bg: 'bg-green-100',
          text: 'Verified',
          description: 'Your identity has been successfully verified'
        };
      case 'PENDING':
        return {
          icon: Clock,
          color: 'text-yellow-600',
          bg: 'bg-yellow-100',
          text: 'Under Review',
          description: 'Your documents are being reviewed by our team'
        };
      case 'REJECTED':
        return {
          icon: AlertTriangle,
          color: 'text-red-600',
          bg: 'bg-red-100',
          text: 'Rejected',
          description: 'Please resubmit with correct documents'
        };
      default:
        return {
          icon: Shield,
          color: 'text-blue-600',
          bg: 'bg-blue-100',
          text: 'Not Started',
          description: 'Complete KYC verification to access all features'
        };
    }
  };

  const statusInfo = getKYCStatusInfo((kycStatus as any)?.status || 'NOT_STARTED');
  const StatusIcon = statusInfo.icon;

  const handlePersonalInfoChange = (field: string, value: string) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleDocumentUpload = (docType: string, result: any) => {
    const uploadUrl = result.successful?.[0]?.uploadURL || '';
    setDocuments(prev => ({ ...prev, [docType]: uploadUrl }));
    toast({
      title: "Document uploaded",
      description: `${docType.replace(/([A-Z])/g, ' $1').toLowerCase()} uploaded successfully`,
    });
  };
  
  const getUploadParameters = async () => {
    const response = await fetch('/api/objects/upload', { method: 'POST' });
    const data = await response.json();
    return { method: 'PUT' as const, url: data.uploadURL };
  };

  const handleSubmitKYC = () => {
    // Validation
    const requiredFields = ['firstName', 'lastName', 'dateOfBirth', 'phoneNumber', 'state', 'address'];
    const missingFields = requiredFields.filter(field => !(personalInfo as any)[field]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required personal information fields",
        variant: "destructive",
      });
      return;
    }

    if (!documents.idDocument) {
      toast({
        title: "Missing Documents",
        description: "Please upload at least one ID document",
        variant: "destructive",
      });
      return;
    }

    const kycData = {
      personalInfo,
      documents,
      submittedAt: new Date().toISOString()
    };

    submitKYCMutation.mutate(kycData);
  };

  const getStepProgress = () => {
    if ((kycStatus as any)?.status === 'VERIFIED') return 100;
    if ((kycStatus as any)?.status === 'PENDING') return 75;
    return (currentStep - 1) * 25;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation provided by App.tsx - removed duplicate Navigation component */}
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">KYC Verification</h1>
          <p className="text-gray-600">Verify your identity to access premium features and higher transaction limits</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Verification Progress</span>
            <span className="text-sm text-gray-600">{getStepProgress()}%</span>
          </div>
          <Progress value={getStepProgress()} className="h-2" data-testid="progress-kyc" />
        </div>

        {/* Current Status Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 ${statusInfo.bg} rounded-xl flex items-center justify-center`}>
                <StatusIcon className={`w-6 h-6 ${statusInfo.color}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold text-gray-900">Verification Status</h3>
                  <Badge className={statusInfo.bg + ' ' + statusInfo.color} data-testid="badge-kyc-status">
                    {statusInfo.text}
                  </Badge>
                </div>
                <p className="text-gray-600 text-sm">{statusInfo.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Diaspora vs Nigerian Verification Selector */}
        {(kycStatus as any)?.status !== 'VERIFIED' && (
          <div className="mb-6">
            <Card className={`border-2 ${isDiaspora ? 'border-blue-500 bg-blue-50' : 'border-green-500 bg-green-50'}`}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${isDiaspora ? 'bg-blue-100' : 'bg-green-100'} rounded-xl flex items-center justify-center`}>
                    {isDiaspora ? (
                      <span className="text-2xl">🌍</span>
                    ) : (
                      <span className="text-2xl">🇳🇬</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">
                      {isDiaspora ? 'Diaspora Verification' : 'Nigerian Resident Verification'}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {isDiaspora 
                        ? 'Simplified verification for international users - no Nigerian ID required'
                        : 'Full verification with Nigerian identity documents'
                      }
                    </p>
                  </div>
                  <Button
                    variant={isDiaspora ? "default" : "outline"}
                    onClick={() => {
                      setIsDiaspora(!isDiaspora);
                      setPersonalInfo(prev => ({ 
                        ...prev, 
                        verificationType: !isDiaspora ? 'basic' : 'full',
                        nationality: !isDiaspora ? 'Other' : 'Nigerian'
                      }));
                    }}
                    className="text-sm"
                  >
                    Switch to {isDiaspora ? 'Nigerian' : 'Diaspora'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Only show verification form if not already verified */}
        {(kycStatus as any)?.status !== 'VERIFIED' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Step 1: Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Personal Information</span>
                    {currentStep > 1 && <CheckCircle className="w-5 h-5 text-green-500" />}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={personalInfo.firstName}
                        onChange={(e) => handlePersonalInfoChange('firstName', e.target.value)}
                        placeholder="Enter your first name"
                        data-testid="input-first-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={personalInfo.lastName}
                        onChange={(e) => handlePersonalInfoChange('lastName', e.target.value)}
                        placeholder="Enter your last name"
                        data-testid="input-last-name"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={personalInfo.dateOfBirth}
                        onChange={(e) => handlePersonalInfoChange('dateOfBirth', e.target.value)}
                        data-testid="input-date-of-birth"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phoneNumber">Phone Number *</Label>
                      <Input
                        id="phoneNumber"
                        value={personalInfo.phoneNumber}
                        onChange={(e) => handlePersonalInfoChange('phoneNumber', e.target.value)}
                        placeholder="+234XXXXXXXXXX"
                        data-testid="input-phone-number"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Select 
                        value={personalInfo.state} 
                        onValueChange={(value) => handlePersonalInfoChange('state', value)}
                      >
                        <SelectTrigger data-testid="select-state">
                          <SelectValue placeholder="Select your state" />
                        </SelectTrigger>
                        <SelectContent>
                          {NIGERIAN_STATES.map((state) => (
                            <SelectItem key={state} value={state}>{state}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="lga">Local Government Area</Label>
                      <Input
                        id="lga"
                        value={personalInfo.lga}
                        onChange={(e) => handlePersonalInfoChange('lga', e.target.value)}
                        placeholder="Enter your LGA"
                        data-testid="input-lga"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      value={personalInfo.address}
                      onChange={(e) => handlePersonalInfoChange('address', e.target.value)}
                      placeholder="Enter your full address"
                      data-testid="input-address"
                    />
                  </div>

                  {currentStep === 1 && (
                    <Button 
                      onClick={() => setCurrentStep(2)}
                      className="w-full"
                      data-testid="button-next-step-1"
                    >
                      Continue to Document Upload
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Step 2: Document Upload */}
              {currentStep >= 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="w-5 h-5" />
                      <span>Identity Documents</span>
                      {currentStep > 2 && <CheckCircle className="w-5 h-5 text-green-500" />}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    
                    {/* ID Document Upload */}
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">Government-issued ID *</h4>
                          <p className="text-sm text-gray-600">National ID, Driver's License, or International Passport</p>
                        </div>
                        {documents.idDocument && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                      
                      <ObjectUploader
                        onComplete={(result) => handleDocumentUpload('idDocument', result)}
                        onGetUploadParameters={getUploadParameters}
                        maxFileSize={5242880}
                        buttonClassName="w-full"
                      >
                        <div className="flex items-center justify-center">
                          <Camera className="w-4 h-4 mr-2" />
                          {documents.idDocument ? 'Update ID Document' : 'Upload ID Document'}
                        </div>
                      </ObjectUploader>
                    </div>

                    {/* Proof of Address Upload */}
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">Proof of Address</h4>
                          <p className="text-sm text-gray-600">Utility bill, bank statement, or lease agreement</p>
                        </div>
                        {documents.proofOfAddress && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                      
                      <ObjectUploader
                        onComplete={(result) => handleDocumentUpload('proofOfAddress', result)}
                        onGetUploadParameters={getUploadParameters}
                        maxFileSize={5242880}
                        buttonClassName="w-full"
                      >
                        <div className="flex items-center justify-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {documents.proofOfAddress ? 'Update Address Proof' : 'Upload Address Proof'}
                        </div>
                      </ObjectUploader>
                    </div>

                    {currentStep === 2 && (
                      <div className="flex space-x-3">
                        <Button 
                          variant="outline"
                          onClick={() => setCurrentStep(1)}
                          className="flex-1"
                          data-testid="button-back-step-2"
                        >
                          Back
                        </Button>
                        <Button 
                          onClick={() => setCurrentStep(3)}
                          className="flex-1"
                          data-testid="button-next-step-2"
                        >
                          Review & Submit
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Review & Submit */}
              {currentStep >= 3 && (kycStatus as any)?.status !== 'PENDING' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="w-5 h-5" />
                      <span>Review & Submit</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-800">Important Notice</h4>
                          <p className="text-sm text-yellow-700 mt-1">
                            Please ensure all information and documents are accurate. False information may result in account suspension.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Information Summary:</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><span className="font-medium">Name:</span> {personalInfo.firstName} {personalInfo.lastName}</p>
                        <p><span className="font-medium">Phone:</span> {personalInfo.phoneNumber}</p>
                        <p><span className="font-medium">Location:</span> {personalInfo.state}, Nigeria</p>
                        <p><span className="font-medium">Documents:</span> 
                          {documents.idDocument && " ✓ ID Document"}
                          {documents.proofOfAddress && " ✓ Address Proof"}
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Button 
                        variant="outline"
                        onClick={() => setCurrentStep(2)}
                        className="flex-1"
                        data-testid="button-back-step-3"
                      >
                        Back to Edit
                      </Button>
                      <Button 
                        onClick={handleSubmitKYC}
                        disabled={submitKYCMutation.isPending}
                        className="flex-1"
                        data-testid="button-submit-kyc"
                      >
                        {submitKYCMutation.isPending ? "Submitting..." : "Submit for Verification"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Benefits Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>Verification Benefits</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Higher Transaction Limits</p>
                        <p className="text-gray-600">Increased daily and monthly SUP token limits</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Premium Features</p>
                        <p className="text-gray-600">Access to exclusive civic programs and events</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Enhanced Security</p>
                        <p className="text-gray-600">Additional account protection and recovery options</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Priority Support</p>
                        <p className="text-gray-600">Faster response times for customer support</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Requirements Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Required Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-medium text-gray-900 mb-1">Government-issued ID (Required)</p>
                      <ul className="text-gray-600 space-y-1">
                        <li>• National Identity Card</li>
                        <li>• Driver's License</li>
                        <li>• International Passport</li>
                      </ul>
                    </div>
                    
                    <div>
                      <p className="font-medium text-gray-900 mb-1">Proof of Address (Optional)</p>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Utility bill (last 3 months)</li>
                        <li>• Bank statement</li>
                        <li>• Lease agreement</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Verification Complete */}
        {(kycStatus as any)?.status === 'VERIFIED' && (
          <Card className="text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Identity Verified!</h3>
              <p className="text-gray-600 mb-6">
                Your identity has been successfully verified. You now have access to all premium features.
              </p>
              <Button asChild>
                <a href="/engage">Start Earning More SUP</a>
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}