import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Award,
  Target,
  Heart,
  BookOpen,
  Megaphone,
  Building,
  Globe,
  CheckCircle,
  Plus,
  ArrowRight,
  Edit,
  Save
} from "lucide-react";

const availabilityOptions = [
  { value: "WEEKENDS", label: "Weekends only", description: "Saturday and Sunday" },
  { value: "WEEKDAYS", label: "Weekdays only", description: "Monday to Friday" },
  { value: "FLEXIBLE", label: "Flexible", description: "Any day of the week" },
  { value: "EVENINGS", label: "Evenings only", description: "After work hours" },
  { value: "MORNINGS", label: "Mornings only", description: "Before work hours" }
];

const timeCommitmentOptions = [
  { value: "1-2_HOURS", label: "1-2 hours per week", description: "Light commitment" },
  { value: "3-5_HOURS", label: "3-5 hours per week", description: "Moderate commitment" },
  { value: "6-10_HOURS", label: "6-10 hours per week", description: "Regular commitment" },
  { value: "10-20_HOURS", label: "10-20 hours per week", description: "Serious commitment" },
  { value: "20+_HOURS", label: "20+ hours per week", description: "Full-time dedication" }
];

const activityOptions = [
  { id: "VOTER_REGISTRATION", label: "Voter Registration", icon: BookOpen, description: "Help citizens register to vote" },
  { id: "COMMUNITY_OUTREACH", label: "Community Outreach", icon: Users, description: "Connect with local communities" },
  { id: "EVENT_ORGANIZATION", label: "Event Organization", icon: Building, description: "Plan and coordinate civic events" },
  { id: "SOCIAL_MEDIA", label: "Social Media Advocacy", icon: Megaphone, description: "Spread awareness online" },
  { id: "DATA_COLLECTION", label: "Data Collection", icon: Target, description: "Research and gather civic data" },
  { id: "AWARENESS_CAMPAIGNS", label: "Awareness Campaigns", icon: Globe, description: "Educate people about civic issues" },
  { id: "SECURITY", label: "Community Security", icon: Globe, description: "Support community safety initiatives" }
];

const skillOptions = [
  "COMMUNICATION", "TECH_SAVVY", "ORGANIZATION", "LEADERSHIP", 
  "MARKETING", "TEACHING", "RESEARCH", "DESIGN", "WRITING", 
  "PHOTOGRAPHY", "SOCIAL_MEDIA", "EVENT_PLANNING", "FUNDRAISING", 
  "PUBLIC_SPEAKING", "PROJECT_MANAGEMENT", "NETWORKING"
];

const experienceLevelOptions = [
  { value: "BEGINNER", label: "Beginner", description: "New to volunteering" },
  { value: "INTERMEDIATE", label: "Intermediate", description: "Some volunteer experience" },
  { value: "ADVANCED", label: "Advanced", description: "Experienced volunteer" },
  { value: "EXPERT", label: "Expert", description: "Extensive volunteer background" }
];

export default function VolunteerDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState<any>({});

  // Fetch volunteer profile
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['/api/volunteer/profile'],
    enabled: !!user
  });

  // Fetch volunteer opportunities
  const { data: opportunities = [], isLoading: opportunitiesLoading } = useQuery({
    queryKey: ['/api/volunteer/opportunities'],
    enabled: !!user
  });

  // Fetch user's assignments
  const { data: assignments = [], isLoading: assignmentsLoading } = useQuery({
    queryKey: ['/api/volunteer/my-assignments'],
    enabled: !!user
  });

  // Apply for opportunity mutation
  const applyMutation = useMutation({
    mutationFn: async ({ opportunityId, role, hoursCommitted }: any) => {
      return await apiRequest("POST", `/api/volunteer/opportunities/${opportunityId}/apply`, {
        role,
        hoursCommitted
      });
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted! 🎉",
        description: "You've successfully applied for the volunteer opportunity.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/volunteer/my-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['/api/volunteer/opportunities'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to apply for opportunity",
        variant: "destructive",
      });
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: any) => {
      return await apiRequest("PUT", `/api/volunteer/profile`, profileData);
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated! ✅",
        description: "Your volunteer profile has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/volunteer/profile'] });
      setIsEditingProfile(false);
      setEditForm({});
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  // Opt out mutation
  const optOutMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", `/api/volunteer/opt-out`, {});
    },
    onSuccess: () => {
      toast({
        title: "Volunteer Status Deactivated",
        description: "You've successfully opted out of volunteer role. You can rejoin anytime!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      // Redirect to main dashboard
      window.location.href = '/dashboard';
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to opt out of volunteer role",
        variant: "destructive",
      });
    },
  });

  // Open edit form with current data
  const openEditForm = () => {
    if (profile) {
      setEditForm({
        availability: profile.availability || '',
        timeCommitment: profile.timeCommitment || '',
        preferredActivities: profile.preferredActivities || [],
        skills: profile.skills || [],
        emergencyContact: profile.emergencyContact || '',
        experience: profile.experience || '',
        motivation: profile.motivation || ''
      });
      setIsEditingProfile(true);
    }
  };

  // Handle form submission
  const handleUpdateProfile = () => {
    if (!editForm.availability || !editForm.timeCommitment || !editForm.preferredActivities?.length || 
        !editForm.skills?.length || !editForm.experience || !editForm.motivation) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    updateProfileMutation.mutate(editForm);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'VOTER_REGISTRATION': return BookOpen;
      case 'COMMUNITY_OUTREACH': return Users;
      case 'EVENT_ORGANIZATION': return Building;
      case 'SOCIAL_MEDIA': return Megaphone;
      case 'SECURITY': return Globe;
      default: return Target;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ASSIGNED': return 'bg-blue-100 text-blue-700';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-700';
      case 'COMPLETED': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-700';
      case 'URGENT': return 'bg-red-200 text-red-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-green-100 text-green-700';
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="text-center py-16">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-heading font-display font-bold text-gray-900 mb-2">Complete Your Volunteer Profile</h2>
              <p className="text-body-lg font-ui text-gray-600 mb-6">
                You need to complete volunteer onboarding to access this dashboard.
              </p>
              <Button asChild>
                <a href="/volunteer-onboarding">Start Volunteer Onboarding</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Mobile-Optimized Header */}
        <div className="mb-4 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Volunteer Hub</h1>
              <p className="text-sm sm:text-base text-gray-600">Welcome back, {user?.firstName}! 👋</p>
            </div>
            <div className="flex items-center flex-wrap gap-2 sm:space-x-3">
              <Badge className="bg-green-100 text-green-700 text-xs sm:text-sm">
                <Heart className="w-3 h-3 mr-1" />
                Active
              </Badge>
              {user?.credibleLevel >= 2 && (
                <Badge className="bg-blue-100 text-blue-700 text-xs sm:text-sm">
                  <Award className="w-3 h-3 mr-1" />
                  Leader
                </Badge>
              )}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                    Settings
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Volunteer Settings</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-gray-600 text-sm">
                      Need a break? You can temporarily opt out and rejoin anytime.
                    </p>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => optOutMutation.mutate()}
                      disabled={optOutMutation.isPending}
                      className="w-full"
                    >
                      {optOutMutation.isPending ? 'Processing...' : 'Opt Out'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Compact Stats - Mobile First */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-3 sm:p-4">
              <div className="text-center">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mx-auto mb-1" />
                <p className="text-xs sm:text-sm font-medium text-gray-600">Hours</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">{profile.totalHoursVolunteered || 0}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-3 sm:p-4">
              <div className="text-center">
                <Target className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 mx-auto mb-1" />
                <p className="text-xs sm:text-sm font-medium text-gray-600">Impact</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">{profile.impactScore || 0}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-3 sm:p-4">
              <div className="text-center">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 mx-auto mb-1" />
                <p className="text-xs sm:text-sm font-medium text-gray-600">Done</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">{assignments.filter((a: any) => a.status === 'COMPLETED').length}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-3 sm:p-4">
              <div className="text-center">
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 mx-auto mb-1" />
                <p className="text-xs sm:text-sm font-medium text-gray-600">Active</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">{assignments.filter((a: any) => a.status === 'ASSIGNED' || a.status === 'IN_PROGRESS').length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Available Opportunities */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center text-lg sm:text-xl">
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  New Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {opportunitiesLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="animate-pulse bg-gray-200 h-24 rounded-lg"></div>
                    ))}
                  </div>
                ) : opportunities.length === 0 ? (
                  <div className="text-center py-8">
                    <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No opportunities available right now.</p>
                    <p className="text-sm text-gray-400">Check back later for new civic engagement activities!</p>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {opportunities.slice(0, 3).map((opportunity: any) => {
                      const IconComponent = getActivityIcon(opportunity.type);
                      const isAlreadyApplied = assignments.some((a: any) => a.opportunityId === opportunity.id);
                      
                      return (
                        <div key={opportunity.id} className="border rounded-lg p-3 sm:p-4 hover:shadow-sm transition-shadow">
                          <div className="flex items-start gap-3">
                            <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                              <IconComponent className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">{opportunity.title}</h3>
                                  <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">{opportunity.description}</p>
                                </div>
                                <div className="flex-shrink-0">
                                  {isAlreadyApplied ? (
                                    <Badge className="bg-green-100 text-green-700 text-xs">Applied</Badge>
                                  ) : (
                                    <Button 
                                      size="sm"
                                      className="text-xs px-3"
                                      onClick={() => applyMutation.mutate({ 
                                        opportunityId: opportunity.id, 
                                        role: 'Participant',
                                        hoursCommitted: opportunity.hoursPerVolunteer 
                                      })}
                                      disabled={applyMutation.isPending || opportunity.volunteersAssigned >= opportunity.volunteersNeeded}
                                    >
                                      {opportunity.volunteersAssigned >= opportunity.volunteersNeeded ? 'Full' : 'Apply'}
                                    </Button>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-3 sm:gap-4 mt-2 text-xs sm:text-sm text-gray-500">
                                <span className="flex items-center">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {opportunity.location}
                                </span>
                                <span className="flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {opportunity.hoursPerVolunteer}h
                                </span>
                                <Badge className={getPriorityColor(opportunity.priority) + ' text-xs'}>
                                  {opportunity.priority}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {opportunities.length > 3 && (
                      <Button variant="outline" className="w-full text-sm" asChild>
                        <a href="/volunteer-opportunities">
                          View All ({opportunities.length} total)
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </a>
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* My Assignments & Profile */}
          <div className="space-y-4 sm:space-y-6">
            {/* Quick Profile */}
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center text-base sm:text-lg">
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Profile
                  </span>
                  <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={openEditForm} className="text-xs sm:text-sm">
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Edit Volunteer Profile</DialogTitle>
                        <DialogDescription>
                          Update your volunteer preferences and availability to help us match you with the right opportunities.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6 py-4">
                        {/* Availability */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">Availability *</label>
                          <Select value={editForm.availability} onValueChange={(value) => setEditForm({...editForm, availability: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your availability" />
                            </SelectTrigger>
                            <SelectContent>
                              {availabilityOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  <div>
                                    <div className="font-medium">{option.label}</div>
                                    <div className="text-xs text-gray-500">{option.description}</div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Time Commitment */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">Time Commitment *</label>
                          <Select value={editForm.timeCommitment} onValueChange={(value) => setEditForm({...editForm, timeCommitment: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your time commitment" />
                            </SelectTrigger>
                            <SelectContent>
                              {timeCommitmentOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  <div>
                                    <div className="font-medium">{option.label}</div>
                                    <div className="text-xs text-gray-500">{option.description}</div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Preferred Activities */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">Preferred Activities *</label>
                          <div className="grid grid-cols-1 gap-3">
                            {activityOptions.map((activity) => (
                              <div key={activity.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`activity-${activity.id}`}
                                  checked={editForm.preferredActivities?.includes(activity.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setEditForm({
                                        ...editForm,
                                        preferredActivities: [...(editForm.preferredActivities || []), activity.id]
                                      });
                                    } else {
                                      setEditForm({
                                        ...editForm,
                                        preferredActivities: editForm.preferredActivities?.filter((a: string) => a !== activity.id)
                                      });
                                    }
                                  }}
                                />
                                <label htmlFor={`activity-${activity.id}`} className="text-sm font-medium">
                                  {activity.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Skills */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">Skills *</label>
                          <div className="grid grid-cols-2 gap-3">
                            {skillOptions.map((skill) => (
                              <div key={skill} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`skill-${skill}`}
                                  checked={editForm.skills?.includes(skill)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setEditForm({
                                        ...editForm,
                                        skills: [...(editForm.skills || []), skill]
                                      });
                                    } else {
                                      setEditForm({
                                        ...editForm,
                                        skills: editForm.skills?.filter((s: string) => s !== skill)
                                      });
                                    }
                                  }}
                                />
                                <label htmlFor={`skill-${skill}`} className="text-sm">
                                  {skill.replace('_', ' ')}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Experience */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">Previous Experience *</label>
                          <Textarea
                            value={editForm.experience || ''}
                            onChange={(e) => setEditForm({...editForm, experience: e.target.value})}
                            placeholder="Describe your previous volunteer or civic experience"
                            rows={3}
                          />
                        </div>

                        {/* Emergency Contact */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">Emergency Contact</label>
                          <Input
                            value={editForm.emergencyContact || ''}
                            onChange={(e) => setEditForm({...editForm, emergencyContact: e.target.value})}
                            placeholder="Emergency contact name"
                          />
                        </div>


                        {/* Motivation */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">Motivation *</label>
                          <Textarea
                            value={editForm.motivation || ''}
                            onChange={(e) => setEditForm({...editForm, motivation: e.target.value})}
                            placeholder="What motivates you to volunteer?"
                            rows={3}
                          />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                          <Button 
                            onClick={handleUpdateProfile}
                            disabled={updateProfileMutation.isPending}
                            className="flex-1"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setIsEditingProfile(false)}
                            disabled={updateProfileMutation.isPending}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-medium text-gray-600">Availability</p>
                      <p className="text-sm text-gray-900">{(profile as any)?.availability?.replace('_', ' ') || 'Not set'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600">Time Commitment</p>
                      <p className="text-sm text-gray-900">{(profile as any)?.timeCommitment?.replace('_', ' ') || 'Not set'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {((profile as any)?.skills || []).slice(0, 3).map((skill: string) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill.replace('_', ' ')}
                        </Badge>
                      ))}
                      {((profile as any)?.skills?.length || 0) > 3 && (
                        <Badge variant="outline" className="text-xs">+{(profile as any).skills.length - 3}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Assignments */}
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  My Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                {assignmentsLoading ? (
                  <div className="space-y-3">
                    {[1, 2].map(i => (
                      <div key={i} className="animate-pulse bg-gray-200 h-16 rounded-lg"></div>
                    ))}
                  </div>
                ) : assignments.length === 0 ? (
                  <div className="text-center py-6">
                    <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No assignments yet</p>
                    <p className="text-xs text-gray-400">Apply for opportunities above!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {assignments.slice(0, 3).map((assignment: any) => (
                      <div key={assignment.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-gray-900">{assignment.opportunityTitle}</h4>
                          <Badge className={getStatusColor(assignment.status)} variant="secondary">
                            {assignment.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-500 space-y-1">
                          <p className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {assignment.opportunityLocation}
                          </p>
                          <p className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {assignment.hoursCommitted}h committed
                          </p>
                        </div>
                        {assignment.status === 'COMPLETED' && assignment.hoursCompleted && (
                          <div className="mt-2">
                            <Progress value={(assignment.hoursCompleted / assignment.hoursCommitted) * 100} className="h-2" />
                            <p className="text-xs text-gray-500 mt-1">{assignment.hoursCompleted}/{assignment.hoursCommitted} hours completed</p>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {assignments.length > 3 && (
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <a href="/volunteer-assignments">View All Assignments</a>
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}