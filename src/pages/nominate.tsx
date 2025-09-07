import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Users, FileText, Award, Check } from "lucide-react";
import { useLocation } from "wouter";

const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", 
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo", 
  "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", 
  "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", 
  "Yobe", "Zamfara"
];

const targetRoles = [
  "Local Government Chairman",
  "Councillor",
  "State Assembly Member", 
  "Accountability Cell Leader",
  "Community Organizer",
  "Youth Leader",
  "Other"
];

export default function Nominate() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("nominate");

  // Nomination form state
  const [nominationData, setNominationData] = useState({
    candidateName: "",
    candidateEmail: "",
    candidatePhone: "",
    stateTarget: "",
    lgaTarget: "",
    targetRole: "",
    reason: "",
    integrityEvidence: "",
    competenceEvidence: "",
    commitmentEvidence: ""
  });

  // Application form state  
  const [applicationData, setApplicationData] = useState({
    stateTarget: "",
    lgaTarget: "",
    targetRole: "",
    applicationStatement: "",
    professionalBackground: "",
    civicExperience: "",
    achievementsAndRecognition: "",
    whyCredible: "",
    visionForLGA: ""
  });

  const nominateMutation = useMutation({
    mutationFn: async (data: typeof nominationData) => {
      return await apiRequest("POST", "/api/challenge/nominate", data);
    },
    onSuccess: () => {
      toast({
        title: "Nomination Submitted",
        description: "Thank you for nominating a credible Nigerian! They will be notified and enter the vetting process.",
        variant: "default",
      });
      setNominationData({
        candidateName: "",
        candidateEmail: "",
        candidatePhone: "",
        stateTarget: "",
        lgaTarget: "",
        targetRole: "",
        reason: "",
        integrityEvidence: "",
        competenceEvidence: "",
        commitmentEvidence: ""
      });
      queryClient.invalidateQueries({ queryKey: ["/api/challenge/candidates"] });
    },
    onError: (error: any) => {
      toast({
        title: "Nomination Failed",
        description: error.message || "Failed to submit nomination. Please try again.",
        variant: "destructive",
      });
    },
  });

  const applyMutation = useMutation({
    mutationFn: async (data: typeof applicationData) => {
      return await apiRequest("POST", "/api/challenge/apply", data);
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted",
        description: "Your application has been submitted! You'll be notified about the vetting process.",
        variant: "default",
      });
      setApplicationData({
        stateTarget: "",
        lgaTarget: "",
        targetRole: "",
        applicationStatement: "",
        professionalBackground: "",
        civicExperience: "",
        achievementsAndRecognition: "",
        whyCredible: "",
        visionForLGA: ""
      });
      queryClient.invalidateQueries({ queryKey: ["/api/challenge/candidates"] });
    },
    onError: (error: any) => {
      toast({
        title: "Application Failed",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleNominationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!nominationData.candidateName || !nominationData.candidateEmail || !nominationData.stateTarget || !nominationData.reason) {
      toast({
        title: "Please fill required fields",
        description: "Name, email, state, and reason for nomination are required.",
        variant: "destructive",
      });
      return;
    }

    nominateMutation.mutate(nominationData);
  };

  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user has completed KYC
    if ((user as any)?.kycStatus !== 'APPROVED') {
      toast({
        title: "KYC Required",
        description: "You must complete KYC verification before applying to the challenge.",
        variant: "destructive",
      });
      setLocation("/kyc");
      return;
    }

    // Validation
    if (!applicationData.stateTarget || !applicationData.applicationStatement || !applicationData.whyCredible) {
      toast({
        title: "Please fill required fields",
        description: "State, application statement, and credibility explanation are required.",
        variant: "destructive",
      });
      return;
    }

    applyMutation.mutate(applicationData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation provided by App.tsx - removed duplicate header */}
        <div className="mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Democratic Nomination Process
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join millions of Nigerians nominating credible leaders for democratic selection. Help identify 13,000 outstanding candidates across all 774 LGAs.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="nominate" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Nominate Someone
            </TabsTrigger>
            <TabsTrigger value="apply" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Apply Yourself
            </TabsTrigger>
          </TabsList>

          {/* Nomination Tab */}
          <TabsContent value="nominate">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  Nominate a Credible Nigerian
                </CardTitle>
                <p className="text-gray-600">
                  Know someone with integrity, competence, and commitment? Nominate them to join Nigeria's democratic leadership selection process.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleNominationSubmit} className="space-y-6">
                  {/* Candidate Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Candidate Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="candidateName">Full Name *</Label>
                        <Input
                          id="candidateName"
                          value={nominationData.candidateName}
                          onChange={(e) => setNominationData(prev => ({ ...prev, candidateName: e.target.value }))}
                          placeholder="Enter candidate's full name"
                          required
                          data-testid="input-candidate-name"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="candidateEmail">Email Address *</Label>
                        <Input
                          id="candidateEmail"
                          type="email"
                          value={nominationData.candidateEmail}
                          onChange={(e) => setNominationData(prev => ({ ...prev, candidateEmail: e.target.value }))}
                          placeholder="candidate@example.com"
                          required
                          data-testid="input-candidate-email"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="candidatePhone">Phone Number</Label>
                      <Input
                        id="candidatePhone"
                        value={nominationData.candidatePhone}
                        onChange={(e) => setNominationData(prev => ({ ...prev, candidatePhone: e.target.value }))}
                        placeholder="+234..."
                        data-testid="input-candidate-phone"
                      />
                    </div>
                  </div>

                  {/* Target Location */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Target Service Area</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="stateTarget">State *</Label>
                        <Select value={nominationData.stateTarget} onValueChange={(value) => setNominationData(prev => ({ ...prev, stateTarget: value }))}>
                          <SelectTrigger data-testid="select-state">
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            {nigerianStates.map((state) => (
                              <SelectItem key={state} value={state}>{state}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="lgaTarget">Local Government Area *</Label>
                        <Input
                          id="lgaTarget"
                          value={nominationData.lgaTarget}
                          onChange={(e) => setNominationData(prev => ({ ...prev, lgaTarget: e.target.value }))}
                          placeholder="Enter LGA name"
                          required
                          data-testid="input-lga"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="targetRole">Target Leadership Role</Label>
                      <Select value={nominationData.targetRole} onValueChange={(value) => setNominationData(prev => ({ ...prev, targetRole: value }))}>
                        <SelectTrigger data-testid="select-role">
                          <SelectValue placeholder="Select target role" />
                        </SelectTrigger>
                        <SelectContent>
                          {targetRoles.map((role) => (
                            <SelectItem key={role} value={role}>{role}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Credibility Evidence */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Why This Person is Credible</h3>
                    
                    <div>
                      <Label htmlFor="reason">Overall Reason for Nomination *</Label>
                      <Textarea
                        id="reason"
                        value={nominationData.reason}
                        onChange={(e) => setNominationData(prev => ({ ...prev, reason: e.target.value }))}
                        placeholder="Explain why you believe this person should be part of the 13k credible leaders..."
                        rows={3}
                        required
                        data-testid="textarea-reason"
                      />
                    </div>

                    <div>
                      <Label htmlFor="integrityEvidence">Integrity Evidence</Label>
                      <Textarea
                        id="integrityEvidence"
                        value={nominationData.integrityEvidence}
                        onChange={(e) => setNominationData(prev => ({ ...prev, integrityEvidence: e.target.value }))}
                        placeholder="Specific examples of their honesty and ethical behavior..."
                        rows={2}
                        data-testid="textarea-integrity"
                      />
                    </div>

                    <div>
                      <Label htmlFor="competenceEvidence">Competence Evidence</Label>
                      <Textarea
                        id="competenceEvidence"
                        value={nominationData.competenceEvidence}
                        onChange={(e) => setNominationData(prev => ({ ...prev, competenceEvidence: e.target.value }))}
                        placeholder="Examples of their professional excellence or achievements..."
                        rows={2}
                        data-testid="textarea-competence"
                      />
                    </div>

                    <div>
                      <Label htmlFor="commitmentEvidence">Commitment Evidence</Label>
                      <Textarea
                        id="commitmentEvidence"
                        value={nominationData.commitmentEvidence}
                        onChange={(e) => setNominationData(prev => ({ ...prev, commitmentEvidence: e.target.value }))}
                        placeholder="Examples of their civic involvement and community service..."
                        rows={2}
                        data-testid="textarea-commitment"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700" 
                    disabled={nominateMutation.isPending}
                    data-testid="button-submit-nomination"
                  >
                    {nominateMutation.isPending ? "Submitting..." : "Submit Nomination"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Application Tab */}
          <TabsContent value="apply">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-600" />
                  Apply to Join the Challenge
                </CardTitle>
                <p className="text-gray-600">
                  Step up to serve your community as one of Nigeria's 13,000 credible leaders.
                </p>
                
                {/* KYC Status */}
                <div className="mt-4">
                  {(user as any)?.kycStatus === 'APPROVED' ? (
                    <Badge className="bg-green-100 text-green-800">
                      <Check className="w-3 h-3 mr-1" />
                      KYC Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-orange-600 border-orange-300">
                      KYC Required - Complete verification to apply
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleApplicationSubmit} className="space-y-6">
                  {/* Target Service Area */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Where You Want to Serve</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="appStateTarget">State *</Label>
                        <Select value={applicationData.stateTarget} onValueChange={(value) => setApplicationData(prev => ({ ...prev, stateTarget: value }))}>
                          <SelectTrigger data-testid="select-app-state">
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            {nigerianStates.map((state) => (
                              <SelectItem key={state} value={state}>{state}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="appLgaTarget">Local Government Area *</Label>
                        <Input
                          id="appLgaTarget"
                          value={applicationData.lgaTarget}
                          onChange={(e) => setApplicationData(prev => ({ ...prev, lgaTarget: e.target.value }))}
                          placeholder="Enter LGA name"
                          required
                          data-testid="input-app-lga"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="appTargetRole">Target Leadership Role</Label>
                      <Select value={applicationData.targetRole} onValueChange={(value) => setApplicationData(prev => ({ ...prev, targetRole: value }))}>
                        <SelectTrigger data-testid="select-app-role">
                          <SelectValue placeholder="Select target role" />
                        </SelectTrigger>
                        <SelectContent>
                          {targetRoles.map((role) => (
                            <SelectItem key={role} value={role}>{role}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Application Statement */}
                  <div>
                    <Label htmlFor="applicationStatement">Personal Statement *</Label>
                    <Textarea
                      id="applicationStatement"
                      value={applicationData.applicationStatement}
                      onChange={(e) => setApplicationData(prev => ({ ...prev, applicationStatement: e.target.value }))}
                      placeholder="Tell us about yourself and why you want to be part of the 13k credible leaders..."
                      rows={4}
                      required
                      data-testid="textarea-statement"
                    />
                  </div>

                  {/* Background Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Your Background</h3>
                    
                    <div>
                      <Label htmlFor="professionalBackground">Professional Background</Label>
                      <Textarea
                        id="professionalBackground"
                        value={applicationData.professionalBackground}
                        onChange={(e) => setApplicationData(prev => ({ ...prev, professionalBackground: e.target.value }))}
                        placeholder="Describe your career, education, and professional achievements..."
                        rows={3}
                        data-testid="textarea-professional"
                      />
                    </div>

                    <div>
                      <Label htmlFor="civicExperience">Civic & Community Experience</Label>
                      <Textarea
                        id="civicExperience"
                        value={applicationData.civicExperience}
                        onChange={(e) => setApplicationData(prev => ({ ...prev, civicExperience: e.target.value }))}
                        placeholder="Describe your involvement in community service, civic organizations, or leadership roles..."
                        rows={3}
                        data-testid="textarea-civic"
                      />
                    </div>

                    <div>
                      <Label htmlFor="achievementsAndRecognition">Achievements & Recognition</Label>
                      <Textarea
                        id="achievementsAndRecognition"
                        value={applicationData.achievementsAndRecognition}
                        onChange={(e) => setApplicationData(prev => ({ ...prev, achievementsAndRecognition: e.target.value }))}
                        placeholder="List any awards, recognitions, or notable achievements..."
                        rows={2}
                        data-testid="textarea-achievements"
                      />
                    </div>
                  </div>

                  {/* Credibility Statement */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Why You Are Credible</h3>
                    
                    <div>
                      <Label htmlFor="whyCredible">Demonstrate Your Credibility *</Label>
                      <Textarea
                        id="whyCredible"
                        value={applicationData.whyCredible}
                        onChange={(e) => setApplicationData(prev => ({ ...prev, whyCredible: e.target.value }))}
                        placeholder="Explain how you demonstrate integrity, competence, and commitment..."
                        rows={4}
                        required
                        data-testid="textarea-credible"
                      />
                    </div>

                    <div>
                      <Label htmlFor="visionForLGA">Vision for Your LGA</Label>
                      <Textarea
                        id="visionForLGA"
                        value={applicationData.visionForLGA}
                        onChange={(e) => setApplicationData(prev => ({ ...prev, visionForLGA: e.target.value }))}
                        placeholder="What changes would you like to see in your LGA and how would you contribute?"
                        rows={3}
                        data-testid="textarea-vision"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black" 
                    disabled={applyMutation.isPending || (user as any)?.kycStatus !== 'APPROVED'}
                    data-testid="button-submit-application"
                  >
                    {applyMutation.isPending ? "Submitting..." : "Submit Application"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
    </div>
  );
}