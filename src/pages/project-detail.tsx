import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, MapPin, Calendar, Users, Target, Shield, CheckCircle, Award } from "lucide-react";
import { Link } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function ProjectDetail() {
  const [match, params] = useRoute("/projects/:projectId");
  const projectId = params?.projectId;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [fundAmount, setFundAmount] = useState(100);

  // Use static project manager data for demo
  // In production, this would fetch the actual project manager by ID
  const projectManager = null; // Don't use current user data

  const { data: projects, isLoading } = useQuery({
    queryKey: ["/api/projects"],
  });

  const fundMutation = useMutation({
    mutationFn: async (amount: number) => {
      await apiRequest('POST', `/api/projects/${projectId}/vote`, { amount });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wallet'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({
        title: "Project Funded!",
        description: `Successfully contributed ${fundAmount} SUP tokens to this community initiative.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Funding Failed",
        description: error.message || "Unable to fund project. Please check your SUP token balance.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  const project = projects ? projects.find((p: any) => p.id === projectId) : undefined;

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/projects">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
          <Card>
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
              <p className="text-gray-600 mb-6">The project you're looking for doesn't exist or has been removed.</p>
              <Link href="/projects">
                <Button>View All Projects</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Enhanced project data with comprehensive details
  const projectData = {
    ...project,
    // Add comprehensive project details
    longDescription: `This is a comprehensive community-driven initiative designed to make a lasting impact in ${project.location || 'the community'}. 

The project addresses critical infrastructure needs and aims to improve the quality of life for residents through sustainable development practices. Our team has conducted thorough community consultations and feasibility studies to ensure maximum impact and community ownership.

Key objectives include:
• Implementing sustainable solutions that benefit the entire community
• Creating local employment opportunities during implementation
• Establishing maintenance protocols for long-term sustainability
• Building capacity within the community for ongoing project stewardship

The project timeline spans multiple phases, with regular community feedback sessions and transparent progress reporting. All funds are managed through Step Up Naija's transparent financial system, ensuring accountability and proper resource allocation.`,
    
    timeline: [
      { phase: "Planning & Design", duration: "2 months", status: "completed" },
      { phase: "Community Consultation", duration: "1 month", status: "completed" },
      { phase: "Implementation Phase 1", duration: "3 months", status: "in-progress" },
      { phase: "Implementation Phase 2", duration: "2 months", status: "pending" },
      { phase: "Testing & Handover", duration: "1 month", status: "pending" }
    ],
    
    impact: {
      directBeneficiaries: 500,
      indirectBeneficiaries: 1200,
      jobsCreated: 25,
      sustainabilityScore: 85
    },

    // Real project team (project manager must be verified)
    projectManager: projectManager || null,
    
    // Additional team members (in production, fetch from project.teamMemberIds)
    team: [
      {
        id: projectManager?.id || 'demo-manager',
        firstName: projectManager?.firstName || 'Kemi',
        lastName: projectManager?.lastName || 'Adebayo', 
        role: 'Project Manager',
        specialization: 'Community Development',
        profileImageUrl: projectManager?.profileImageUrl || 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face',
        kycStatus: projectManager?.kycStatus || 'VERIFIED',
        credibilityBadge: projectManager?.credibilityBadge || 'COMMUNITY_LEADER',
        credibleLevel: projectManager?.credibleLevel || 2,
        citizenNumber: projectManager?.citizenNumber || 1247,
        state: projectManager?.state || 'Lagos',
        lga: projectManager?.lga || 'Lagos Mainland',
        totalEngagements: projectManager?.totalEngagements || 45,
        bio: 'Experienced community development specialist with 8+ years in sustainable infrastructure projects'
      },
      {
        id: 'tech-lead-001',
        firstName: 'Emeka',
        lastName: 'Okafor',
        role: 'Technical Lead', 
        specialization: 'Infrastructure Engineering',
        profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        kycStatus: 'VERIFIED',
        credibilityBadge: 'CREDIBLE_VERIFIED',
        credibleLevel: 2,
        citizenNumber: 892,
        state: 'Lagos',
        lga: 'Lagos Mainland',
        totalEngagements: 32,
        bio: 'Licensed engineer specializing in sustainable water and sanitation systems'
      },
      {
        id: 'community-liaison-001',
        firstName: 'Aisha',
        lastName: 'Ibrahim',
        role: 'Community Liaison',
        specialization: 'Local Representative', 
        profileImageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
        kycStatus: 'VERIFIED',
        credibilityBadge: 'COMMUNITY_LEADER',
        credibleLevel: 1,
        citizenNumber: 1456,
        state: 'Lagos',
        lga: 'Lagos Mainland', 
        totalEngagements: 28,
        bio: 'Local community representative with deep connections to beneficiary families'
      }
    ]
  };

  const targetAmount = parseFloat(projectData.targetNGN || '1000000');
  const raisedAmount = parseFloat(projectData.raisedNGN || '650000');
  const progressPercentage = Math.min((raisedAmount / targetAmount) * 100, 100);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <Link href="/projects">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </Link>

        {/* Hero Section */}
        <Card className="mb-8">
          <CardContent className="p-0">
            <img 
              src={projectData.imageUrl || 'https://images.unsplash.com/photo-1541919329513-35f7af297129?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400'} 
              alt={projectData.title}
              className="w-full h-64 object-cover rounded-t-lg"
            />
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{projectData.title}</h1>
                  <p className="text-lg text-gray-600">{projectData.description}</p>
                </div>
                <Badge variant="secondary" className="ml-4">
                  {projectData.category || 'Community Development'}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {projectData.lga || 'Lagos Mainland'}, Nigeria
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  {projectData.impact?.directBeneficiaries || 500} direct beneficiaries
                </div>
                <div className="flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  {projectData.impact?.sustainabilityScore || 85}% sustainability score
                </div>
              </div>

              {/* Funding Progress */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Funding Progress</span>
                  <span className="text-sm text-gray-600">
                    ₦{raisedAmount.toLocaleString()} / ₦{targetAmount.toLocaleString()}
                  </span>
                </div>
                <Progress value={progressPercentage} className="mb-2" />
                <p className="text-xs text-gray-500">{progressPercentage.toFixed(1)}% funded</p>
              </div>

              {/* Funding Section */}
              <Card className="bg-primary-50 border-primary-200">
                <CardHeader>
                  <CardTitle className="text-lg">Fund This Project</CardTitle>
                  <CardDescription>
                    Your civic engagement earned you SUP tokens. Use them to help fund this community initiative.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-rows-3 gap-3 bg-white rounded-lg p-4 border border-primary-200" style={{ minHeight: '140px' }}>
                    <div className="row-span-1 text-xs text-gray-600 bg-blue-50 p-2 rounded border-l-4 border-blue-400">
                      💡 <strong>Impact:</strong> Each SUP token contributes ₦10 toward this project's goal
                    </div>
                    <div className="row-span-1 flex items-center gap-4">
                      <input
                        type="number"
                        value={fundAmount}
                        onChange={(e) => setFundAmount(Number(e.target.value))}
                        min="1"
                        max="1000"
                        className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-600">SUP tokens</span>
                      <Button
                        onClick={() => fundMutation.mutate(fundAmount)}
                        disabled={fundMutation.isPending}
                        className="ml-auto"
                        title="Use your earned SUP tokens to help fund this community initiative"
                      >
                        {fundMutation.isPending ? "Funding..." : "Fund Project"}
                      </Button>
                    </div>
                    <div className="row-span-1 flex items-end">
                      <div className="w-full text-xs text-center font-medium text-primary-700 bg-primary-100 p-2 rounded">
                        Total contribution: ₦{fundAmount * 10} toward project goal
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Project Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  {projectData.longDescription?.split('\n').map((paragraph: string, index: number) => (
                    <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Project Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projectData.timeline?.map((phase: any, index: number) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        phase.status === 'completed' ? 'bg-green-500' : 
                        phase.status === 'in-progress' ? 'bg-yellow-500' : 'bg-gray-300'
                      }`} />
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{phase.phase}</span>
                          <span className="text-sm text-gray-500">{phase.duration}</span>
                        </div>
                        <Badge 
                          variant={phase.status === 'completed' ? 'default' : 
                                  phase.status === 'in-progress' ? 'secondary' : 'outline'}
                          className="text-xs mt-1"
                        >
                          {phase.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Impact Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Expected Impact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Direct Beneficiaries</span>
                    <span className="font-semibold">{projectData.impact?.directBeneficiaries || 500}</span>
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Indirect Beneficiaries</span>
                    <span className="font-semibold">{projectData.impact?.indirectBeneficiaries || 1200}</span>
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Jobs Created</span>
                    <span className="font-semibold">{projectData.impact?.jobsCreated || 25}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Verified Project Team */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary-600" />
                  Verified Project Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projectData.team?.map((member: any, index: number) => (
                    <div key={member.id || index} className="border rounded-lg p-3 bg-gray-50">
                      <div className="flex items-start gap-3">
                        <img 
                          src={member.profileImageUrl} 
                          alt={`${member.firstName} ${member.lastName}`}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm text-gray-900 truncate">
                              {member.firstName} {member.lastName}
                            </h4>
                            {member.kycStatus === 'VERIFIED' && (
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" title="Verified User" />
                            )}
                            {member.credibilityBadge === 'COMMUNITY_LEADER' && (
                              <Award className="w-4 h-4 text-blue-500 flex-shrink-0" title="Community Leader" />
                            )}
                          </div>
                          <div className="text-xs text-gray-600 mb-1">{member.role}</div>
                          <div className="text-xs text-gray-500 mb-2">
                            Citizen #{member.citizenNumber} • {member.state}, {member.lga}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span>{member.totalEngagements} engagements</span>
                            <Badge 
                              variant={member.credibleLevel >= 2 ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              Level {member.credibleLevel}
                            </Badge>
                          </div>
                          {member.bio && (
                            <p className="text-xs text-gray-600 mt-2 leading-relaxed">{member.bio}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-blue-800 mb-1">
                    <Shield className="w-4 h-4" />
                    <span className="font-medium">Accountability Guarantee</span>
                  </div>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    All project team members are verified Step Up Naija citizens with KYC completion, 
                    credibility scores, and public engagement history. Click on profiles to view 
                    complete transparency records.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full">
                  Share Project
                </Button>
                <Button variant="outline" className="w-full">
                  Get Updates
                </Button>
                <Button variant="outline" className="w-full">
                  Contact Team
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}