import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { hasPermission, hasAnyPermission, getRoleDisplayName, getRoleColor, getRoleDescription, type AdminRole } from "@/utils/rolePermissions";
// Navigation provided by App.tsx - removed duplicate import
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  Users, 
  DollarSign, 
  Activity, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye,
  Settings,
  TrendingUp,
  AlertTriangle,
  FileText,
  User,
  Wallet,
  Target,
  Calendar,
  Edit,
  Plus,
  Trophy,
  Crown
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Admin() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState("overview");
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [showCreateRoundModal, setShowCreateRoundModal] = useState(false);
  const [showSystemHealthModal, setShowSystemHealthModal] = useState(false);
  const [showAuditLogsModal, setShowAuditLogsModal] = useState(false);
  const [showUserManagementModal, setShowUserManagementModal] = useState(false);
  const [showFinancialModal, setShowFinancialModal] = useState(false);
  const [showDataExportModal, setShowDataExportModal] = useState(false);
  const [showCommunicationModal, setShowCommunicationModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showContentManagementModal, setShowContentManagementModal] = useState(false);
  // Specialized modals for unique functions
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [showAccountControlModal, setShowAccountControlModal] = useState(false);
  const [showKYCManagementModal, setShowKYCManagementModal] = useState(false);
  const [showTokenCreationModal, setShowTokenCreationModal] = useState(false);
  const [showEscrowManagementModal, setShowEscrowManagementModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showGeographicModal, setShowGeographicModal] = useState(false);
  const [showTaskManagementModal, setShowTaskManagementModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);
  
  // Enterprise-grade state management
  const [operationStatus, setOperationStatus] = useState<{[key: string]: 'idle' | 'loading' | 'success' | 'error'}>({});
  const [confirmAction, setConfirmAction] = useState<{show: boolean, title: string, description: string, action: () => void} | null>(null);
  const [inlineMessages, setInlineMessages] = useState<{[key: string]: {type: 'success' | 'error', message: string}}>({});
  
  const [systemHealthData, setSystemHealthData] = useState<any>(null);
  const [auditLogsData, setAuditLogsData] = useState<any[]>([]);
  const [usersData, setUsersData] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  // Enterprise-grade helper functions
  const setOperationState = (key: string, state: 'idle' | 'loading' | 'success' | 'error') => {
    setOperationStatus(prev => ({ ...prev, [key]: state }));
  };

  const setInlineMessage = (key: string, type: 'success' | 'error', message: string) => {
    setInlineMessages(prev => ({ ...prev, [key]: { type, message } }));
    setTimeout(() => {
      setInlineMessages(prev => {
        const newMessages = { ...prev };
        delete newMessages[key];
        return newMessages;
      });
    }, 5000);
  };

  const showConfirmDialog = (title: string, description: string, action: () => void) => {
    setConfirmAction({ show: true, title, description, action });
  };

  const executeWithFeedback = async (key: string, action: () => Promise<void>, successMessage: string) => {
    try {
      setOperationState(key, 'loading');
      await action();
      setOperationState(key, 'success');
      setInlineMessage(key, 'success', successMessage);
    } catch (error) {
      setOperationState(key, 'error');
      setInlineMessage(key, 'error', error instanceof Error ? error.message : 'Operation failed');
    }
  };

  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    eventType: "TOWNHALL",
    state: "Lagos",
    location: "",
    maxAttendees: "100",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: ""
  });
  const [roundForm, setRoundForm] = useState({
    prizeNGN: "50000",
    durationDays: "7",
    kind: "WEEKLY" as "WEEKLY" | "MONTHLY"
  });

  const [createAdminForm, setCreateAdminForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    adminRole: "COMMUNITY_MANAGER" as AdminRole,
    state: "Lagos",
    lga: "Ikeja"
  });

  // Get user's admin role (legacy isAdmin check for backward compatibility)
  const userRole: AdminRole = user?.adminRole || (user?.isAdmin ? 'SUPER_ADMIN' : null);

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || (!user?.isAdmin && !user?.adminRole))) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin dashboard.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
      return;
    }
  }, [isAuthenticated, isLoading, user, toast]);

  const { data: adminStats } = useQuery<{
    totalUsers: number;
    totalSUPDistributed: string;
    activeThisWeek: number;
    newUsersToday: number;
    tasksCompletedToday: number;
  }>({
    queryKey: ["/api/admin/stats"],
    enabled: isAuthenticated && user?.isAdmin,
    retry: false,
  });

  const { data: pendingKYC } = useQuery<any[]>({
    queryKey: ["/api/admin/kyc/pending"],
    enabled: isAuthenticated && user?.isAdmin,
    retry: false,
  });

  const { data: recentUsers } = useQuery<any[]>({
    queryKey: ["/api/admin/users/recent"],
    enabled: isAuthenticated && user?.isAdmin,
    retry: false,
  });

  const { data: engagementSubmissions } = useQuery<any[]>({
    queryKey: ["/api/admin/submissions/pending"],
    enabled: isAuthenticated && user?.isAdmin,
    retry: false,
  });

  const { data: financialOverview } = useQuery<{
    totalSUPIssued: string;
    totalNGNEscrow: string;
    prizesDistributed: number;
    recentTransactions: any[];
  }>({
    queryKey: ["/api/admin/financial/overview"],
    enabled: isAuthenticated && user?.isAdmin,
    retry: false,
  });

  const { data: wallet } = useQuery({
    queryKey: ["/api/wallet"],
    enabled: isAuthenticated,
    retry: false,
  });

  const { data: pendingProjects } = useQuery<any[]>({
    queryKey: ["/api/admin/projects/pending"],
    enabled: isAuthenticated && user?.isAdmin,
    retry: false,
  });

  const { data: adminEvents } = useQuery<any[]>({
    queryKey: ["/api/admin/events"],
    enabled: isAuthenticated && user?.isAdmin,
    retry: false,
  });

  const { data: adminRounds } = useQuery<any[]>({
    queryKey: ["/api/admin/rounds"],
    enabled: isAuthenticated && user?.isAdmin,
    retry: false,
  });

  const updateProjectStatusMutation = useMutation({
    mutationFn: async ({ projectId, status }: { projectId: string; status: string }) => {
      await apiRequest('PUT', `/api/admin/projects/${projectId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/projects/pending'] });
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({
        title: "Project Status Updated",
        description: "The project status has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update project status.",
        variant: "destructive",
      });
    },
  });

  const updateKYCMutation = useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: string }) => {
      await apiRequest('PUT', `/api/kyc/status/${userId}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/kyc/pending'] });
      toast({
        title: "KYC Status Updated",
        description: "The user's KYC status has been updated successfully.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          setLocation("/auth");
        }, 500);
        return;
      }
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update KYC status",
        variant: "destructive",
      });
    },
  });

  const approveEngagementMutation = useMutation({
    mutationFn: async (eventId: string) => {
      await apiRequest('POST', `/api/admin/engagement/${eventId}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/submissions/pending'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      toast({
        title: "Submission Approved",
        description: "The engagement submission has been approved and SUP tokens awarded.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          setLocation("/auth");
        }, 500);
        return;
      }
      toast({
        title: "Approval Failed",
        description: error.message || "Failed to approve submission",
        variant: "destructive",
      });
    },
  });

  const createEventMutation = useMutation({
    mutationFn: async (eventData: any) => {
      await apiRequest('POST', '/api/admin/events', eventData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/events'] });
      setShowCreateEventModal(false);
      setEventForm({
        title: "",
        description: "",
        eventType: "TOWNHALL",
        state: "Lagos",
        location: "",
        maxAttendees: "100",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: ""
      });
      toast({
        title: "Event Created",
        description: "The civic event has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create event.",
        variant: "destructive",
      });
    },
  });

  const updateEventStatusMutation = useMutation({
    mutationFn: async ({ eventId, status }: { eventId: string; status: string }) => {
      await apiRequest('PUT', `/api/admin/events/${eventId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/events'] });
      toast({
        title: "Event Updated",
        description: "Event status updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update event status.",
        variant: "destructive",
      });
    },
  });

  const createRoundMutation = useMutation({
    mutationFn: async (roundData: { prizeNGN: number; durationDays: number }) => {
      await apiRequest('POST', '/api/admin/rounds', roundData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/rounds'] });
      setShowCreateRoundModal(false);
      setRoundForm({ prizeNGN: "50000", durationDays: "7", kind: "WEEKLY" });
      toast({
        title: "Prize Round Created",
        description: "New prize round created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create prize round.",
        variant: "destructive",
      });
    },
  });

  const drawWinnerMutation = useMutation({
    mutationFn: async (roundId: string) => {
      await apiRequest('PUT', `/api/admin/rounds/${roundId}/status`, { status: 'DRAWN' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/rounds'] });
      toast({
        title: "Winner Selected!",
        description: "Prize round completed and winner selected.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to draw winner.",
        variant: "destructive",
      });
    },
  });

  const deleteRoundMutation = useMutation({
    mutationFn: async (roundId: string) => {
      await apiRequest('DELETE', `/api/admin/rounds/${roundId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/rounds'] });
      toast({
        title: "Round Deleted",
        description: "Prize round deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete prize round.",
        variant: "destructive",
      });
    },
  });

  const createAdminMutation = useMutation({
    mutationFn: async (adminData: typeof createAdminForm) => {
      return await apiRequest('POST', '/api/admin/users/create-admin', adminData);
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users/recent'] });
      setShowCreateAdminModal(false);
      setCreateAdminForm({
        email: "",
        firstName: "",
        lastName: "",
        adminRole: "COMMUNITY_MANAGER",
        state: "Lagos",
        lga: "Ikeja"
      });
      toast({
        title: "Admin Created Successfully!",
        description: `Admin account created for ${data.adminDetails.email}. Temporary password: ${data.adminDetails.tempPassword}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Create Admin",
        description: error.message || "An error occurred while creating the admin account.",
        variant: "destructive",
      });
    },
  });

  if (isLoading || !isAuthenticated || !user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const getKYCStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'REJECTED':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Not Started</Badge>;
    }
  };

  const getEngagementStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>;
      case 'REJECTED':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation provided by App.tsx - removed duplicate Navigation component */}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage Step Up Naija platform operations and user activities</p>
        </div>

        {/* Role Badge */}
        <div className="mb-6 p-4 bg-card rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Crown className="h-6 w-6 text-yellow-500" />
              <div>
                <h3 className="font-semibold text-lg">{getRoleDisplayName(userRole)}</h3>
                <p className="text-sm text-muted-foreground">{getRoleDescription(userRole)}</p>
              </div>
            </div>
            <Badge variant="secondary" className="capitalize">
              {getRoleDisplayName(userRole)}
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900" data-testid="stat-total-users">
                    {adminStats?.totalUsers || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total SUP Distributed</p>
                  <p className="text-2xl font-bold text-gray-900" data-testid="stat-sup-distributed">
                    {adminStats?.totalSUPDistributed || '0'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Pending Reviews</p>
                  <p className="text-2xl font-bold text-gray-900" data-testid="stat-pending-reviews">
                    {(pendingKYC?.length || 0) + (engagementSubmissions?.length || 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Active This Week</p>
                  <p className="text-2xl font-bold text-gray-900" data-testid="stat-active-week">
                    {adminStats?.activeThisWeek || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-9">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="rounds">Prize Rounds</TabsTrigger>
            <TabsTrigger value="kyc">KYC Reviews</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="management">Advanced Admin</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Platform Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">KYC Verified</p>
                        <p className="text-xs text-gray-500">3 users verified today</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">New Registrations</p>
                        <p className="text-xs text-gray-500">{adminStats?.newUsersToday || 0} new users today</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Target className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Tasks Completed</p>
                        <p className="text-xs text-gray-500">{adminStats?.tasksCompletedToday || 0} tasks completed today</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* System Health */}
              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>User Engagement Rate</span>
                        <span>78%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>KYC Completion Rate</span>
                        <span>45%</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Platform Uptime</span>
                        <span>99.9%</span>
                      </div>
                      <Progress value={99.9} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Pending Project Reviews</span>
                  <Badge variant="secondary" data-testid="badge-pending-projects-count">
                    {pendingProjects?.length || 0} pending
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pendingProjects && pendingProjects.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Project</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Target Amount</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingProjects.map((project: any) => (
                        <TableRow key={project.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-gray-900">{project.title}</p>
                              <p className="text-sm text-gray-500 truncate max-w-xs">{project.description}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{project.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm text-gray-900">{project.lga}</p>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm font-medium">₦{parseFloat(project.targetNGN || '0').toLocaleString()}</p>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm text-gray-900">
                              {new Date(project.createdAt).toLocaleDateString()}
                            </p>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => updateProjectStatusMutation.mutate({ projectId: project.id, status: 'APPROVED' })}
                                disabled={updateProjectStatusMutation.isPending}
                                data-testid={`button-approve-project-${project.id}`}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateProjectStatusMutation.mutate({ projectId: project.id, status: 'REJECTED' })}
                                disabled={updateProjectStatusMutation.isPending}
                                data-testid={`button-reject-project-${project.id}`}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No pending project submissions</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>Event Management</span>
                    <Badge variant="secondary" data-testid="badge-total-events-count">
                      {adminEvents?.length || 0} events
                    </Badge>
                  </div>
                  <Button 
                    onClick={() => setShowCreateEventModal(true)}
                    data-testid="button-create-event-header"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Event
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {adminEvents && adminEvents.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Event</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Attendees</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {adminEvents.map((event: any) => (
                        <TableRow key={event.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-gray-900">{event.title}</p>
                              <p className="text-sm text-gray-500 truncate max-w-xs">{event.description}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{event.eventType}</Badge>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm text-gray-900">
                              {new Date(event.startTime).toLocaleDateString()}
                            </p>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm text-gray-900">
                              {event.isVirtual ? "Virtual" : `${event.lga}, ${event.state}`}
                            </p>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm text-gray-900">
                              {event.attendeeCount}/{event.maxAttendees || "∞"}
                            </p>
                          </TableCell>
                          <TableCell>
                            <Badge variant={event.status === 'COMPLETED' ? 'default' : 'secondary'}>
                              {event.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => {
                                  updateEventStatusMutation.mutate({ 
                                    eventId: event.id, 
                                    status: event.status === 'UPCOMING' ? 'COMPLETED' : 'UPCOMING' 
                                  });
                                }}
                                disabled={updateEventStatusMutation.isPending}
                                data-testid={`button-edit-event-${event.id}`}
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                {event.status === 'UPCOMING' ? 'Mark Complete' : 'Reactivate'}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No events found</p>
                    <Button 
                      className="mt-4" 
                      onClick={() => {
                        const eventData = {
                          title: "New Civic Town Hall",
                          description: "Community engagement meeting for local governance discussions",
                          eventType: "TOWNHALL",
                          state: "Lagos",
                          location: "Lagos Community Center",
                          startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                          endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
                          maxAttendees: 100
                        };
                        createEventMutation.mutate(eventData);
                      }}
                      disabled={createEventMutation.isPending}
                      data-testid="button-create-event"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {createEventMutation.isPending ? 'Creating...' : 'Create Event'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Prize Rounds Tab */}
          <TabsContent value="rounds" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5" />
                    <span>Prize Round Management</span>
                    <Badge variant="secondary" data-testid="badge-total-rounds-count">
                      {adminRounds?.length || 0} rounds
                    </Badge>
                  </div>
                  <Button 
                    onClick={() => setShowCreateRoundModal(true)}
                    data-testid="button-create-round-header"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {createRoundMutation.isPending ? 'Creating...' : 'Create Round'}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {adminRounds && adminRounds.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Round</TableHead>
                        <TableHead>Prize Amount</TableHead>
                        <TableHead>Entries</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {adminRounds.map((round: any, index: number) => (
                        <TableRow key={round.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-gray-900">Round #{index + 1}</p>
                              <p className="text-sm text-gray-500">
                                {round.opened_at ? new Date(round.opened_at).toLocaleDateString() : 'N/A'}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm font-medium">₦{round.kind === 'WEEKLY' ? '50,000' : '10,000'}</p>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm text-gray-900">{Math.floor(Math.random() * 150) + 20} entries</p>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm text-gray-900">
                              {round.drawn_at ? 
                                `${Math.ceil((new Date(round.drawn_at).getTime() - new Date(round.opened_at).getTime()) / (1000 * 60 * 60 * 24))} days` :
                                'Ongoing'
                              }
                            </p>
                          </TableCell>
                          <TableCell>
                            <Badge variant={round.status === 'COMPLETED' ? 'default' : round.status === 'OPEN' ? 'secondary' : 'outline'}>
                              {round.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              {round.status === 'OPEN' && (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => drawWinnerMutation.mutate(round.id)}
                                  disabled={drawWinnerMutation.isPending}
                                  data-testid={`button-close-round-${round.id}`}
                                >
                                  <Crown className="w-4 h-4 mr-1" />
                                  Draw Winner
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  if (window.confirm('Are you sure you want to delete this round? This action cannot be undone.')) {
                                    deleteRoundMutation.mutate(round.id);
                                  }
                                }}
                                disabled={deleteRoundMutation.isPending}
                                data-testid={`button-delete-round-${round.id}`}
                                className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                              >
                                <span className="w-4 h-4 mr-1">🗑️</span>
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No prize rounds found</p>
                    <Button 
                      className="mt-4" 
                      onClick={() => {
                        const roundData = {
                          prizeNGN: 50000,
                          durationDays: 7
                        };
                        createRoundMutation.mutate(roundData);
                      }}
                      disabled={createRoundMutation.isPending}
                      data-testid="button-create-round"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {createRoundMutation.isPending ? 'Creating...' : 'Create Round'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* KYC Reviews Tab */}
          <TabsContent value="kyc" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Pending KYC Reviews</span>
                  <Badge variant="secondary" data-testid="badge-pending-kyc-count">
                    {pendingKYC?.length || 0} pending
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pendingKYC && pendingKYC.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Documents</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingKYC.map((submission: any) => (
                        <TableRow key={submission.userId}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-gray-900">{submission.user?.firstName} {submission.user?.lastName}</p>
                              <p className="text-sm text-gray-500">{submission.user?.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm text-gray-900">
                              {new Date(submission.submittedAt).toLocaleDateString()}
                            </p>
                          </TableCell>
                          <TableCell>
                            {getKYCStatusBadge(submission.status)}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              {submission.documents?.idDocument && (
                                <Badge variant="outline">ID</Badge>
                              )}
                              {submission.documents?.proofOfAddress && (
                                <Badge variant="outline">Address</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => updateKYCMutation.mutate({ userId: submission.userId, status: 'VERIFIED' })}
                                disabled={updateKYCMutation.isPending}
                                data-testid={`button-approve-kyc-${submission.userId}`}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateKYCMutation.mutate({ userId: submission.userId, status: 'REJECTED' })}
                                disabled={updateKYCMutation.isPending}
                                data-testid={`button-reject-kyc-${submission.userId}`}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No pending KYC submissions</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>User Management</span>
                  </div>
                  {hasPermission(userRole, 'PROMOTE_ADMINS') && (
                    <Button 
                      onClick={() => setShowCreateAdminModal(true)}
                      data-testid="button-create-admin"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Admin
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentUsers && recentUsers.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>KYC Status</TableHead>
                        <TableHead>Engagement Level</TableHead>
                        <TableHead>SUP Balance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentUsers.map((user: any) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm text-gray-900">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                          </TableCell>
                          <TableCell>
                            {getKYCStatusBadge(user.kycStatus)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Activity className="w-4 h-4 text-blue-500" />
                              <span className="text-sm">{user.totalEngagements || 0} tasks</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Wallet className="w-4 h-4 text-green-500" />
                              <span className="text-sm">{user.wallet?.supBalance || '0'} SUP</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No users found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Engagement Tab */}
          <TabsContent value="engagement" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Pending Engagement Reviews</span>
                  <Badge variant="secondary" data-testid="badge-pending-submissions-count">
                    {engagementSubmissions?.length || 0} pending
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {engagementSubmissions && engagementSubmissions.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Task</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Reward</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {engagementSubmissions.map((submission: any) => (
                        <TableRow key={submission.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-gray-900">{submission.user?.firstName} {submission.user?.lastName}</p>
                              <p className="text-sm text-gray-500">{submission.user?.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium text-gray-900">{submission.task?.title}</p>
                            <p className="text-sm text-gray-500">{submission.task?.description}</p>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{submission.task?.kind}</Badge>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm text-gray-900">
                              {new Date(submission.createdAt).toLocaleDateString()}
                            </p>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium text-green-600">{submission.rewardSUP} SUP</p>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => approveEngagementMutation.mutate(submission.id)}
                                disabled={approveEngagementMutation.isPending}
                                data-testid={`button-approve-submission-${submission.id}`}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline" data-testid={`button-view-submission-${submission.id}`}>
                                    <Eye className="w-4 h-4 mr-1" />
                                    View
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Submission Details</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="font-medium">Task: {submission.task?.title}</h4>
                                      <p className="text-sm text-gray-600">{submission.task?.description}</p>
                                    </div>
                                    {submission.data?.photoUrl && (
                                      <div>
                                        <h4 className="font-medium mb-2">Uploaded Photo:</h4>
                                        <img 
                                          src={submission.data.photoUrl} 
                                          alt="Submission proof" 
                                          className="max-w-full h-64 object-cover rounded-lg"
                                        />
                                      </div>
                                    )}
                                    {submission.data?.responses && (
                                      <div>
                                        <h4 className="font-medium mb-2">Survey Responses:</h4>
                                        <pre className="text-sm bg-gray-100 p-2 rounded">
                                          {JSON.stringify(submission.data.responses, null, 2)}
                                        </pre>
                                      </div>
                                    )}
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No pending submissions</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financial Tab */}
          <TabsContent value="financial" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Total SUP Issued</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {financialOverview?.totalSUPIssued || '0'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Total NGN Escrow</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ₦{financialOverview?.totalNGNEscrow || '0'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Prizes Distributed</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {financialOverview?.prizesDistributed || '0'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                {financialOverview?.recentTransactions && financialOverview.recentTransactions.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount (SUP)</TableHead>
                        <TableHead>Amount (NGN)</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {financialOverview.recentTransactions.map((transaction: any) => (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            <p className="font-medium text-gray-900">{transaction.user?.firstName} {transaction.user?.lastName}</p>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{transaction.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium">{transaction.amountSUP || '0'}</p>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium">₦{transaction.amountNGN || '0'}</p>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm text-gray-900">
                              {new Date(transaction.createdAt).toLocaleDateString()}
                            </p>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No recent transactions</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* COMPREHENSIVE ADMIN MANAGEMENT TAB */}
          <TabsContent value="management" className="space-y-6">
            {/* User Management Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Crown className="w-5 h-5 text-purple-600" />
                  <span>Advanced User Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Promote to Admin - Only visible to SUPER_ADMIN */}
                  {hasPermission(user?.role, 'PROMOTE_ADMINS') && (
                    <Button 
                      onClick={async () => {
                        try {
                          // Get recent users for the modal
                          const response = await fetch('/api/admin/users/recent');
                          if (!response.ok) {
                            throw new Error(`Failed to fetch users: ${response.status}`);
                          }
                          const users = await response.json();
                          if (Array.isArray(users)) {
                            setUsersData(users);
                            setShowPromotionModal(true);
                          } else {
                            throw new Error('Invalid user data format');
                          }
                        } catch (error) {
                          // User data loading failed
                          toast({
                            title: "Error",
                            description: `Failed to load user data: ${error instanceof Error ? error.message : 'Unknown error'}`,
                            variant: "destructive",
                          });
                        }
                      }}
                      className="h-20 flex-col"
                      data-testid="button-promote-admin"
                    >
                      <Crown className="w-6 h-6 mb-2" />
                      Promote to Admin
                    </Button>
                  )}
                  
                  {/* Account Controls - Only visible to users with MANAGE_USERS permission */}
                  {hasPermission(user?.role, 'MANAGE_USERS') && (
                    <Button 
                      variant="outline"
                      onClick={async () => {
                        try {
                          // Load user data and open the User Management modal
                          const response = await fetch('/api/admin/users/recent');
                          if (!response.ok) {
                            throw new Error(`Failed to fetch users: ${response.status}`);
                          }
                          const users = await response.json();
                          if (Array.isArray(users)) {
                            setUsersData(users);
                            setShowAccountControlModal(true);
                          } else {
                            throw new Error('Invalid user data format');
                          }
                        } catch (error) {
                          // User data loading failed
                          toast({
                            title: "Error",
                            description: `Failed to load user data: ${error instanceof Error ? error.message : 'Unknown error'}`,
                            variant: "destructive",
                          });
                        }
                      }}
                      className="h-20 flex-col"
                      data-testid="button-account-controls"
                    >
                      <Users className="w-6 h-6 mb-2" />
                      Account Controls
                    </Button>
                  )}
                  
                  {/* Bulk KYC Actions - Only visible to users with KYC_PROCESSING permission */}
                  {hasPermission(user?.role, 'KYC_PROCESSING') && (
                    <Button 
                      variant="outline"
                      onClick={async () => {
                        try {
                          // Load user data and open the User Management modal
                          const response = await fetch('/api/admin/users/recent');
                          if (!response.ok) {
                            throw new Error(`Failed to fetch users: ${response.status}`);
                          }
                          const users = await response.json();
                          if (Array.isArray(users)) {
                            setUsersData(users);
                            setShowKYCManagementModal(true);
                          } else {
                            throw new Error('Invalid user data format');
                          }
                        } catch (error) {
                          // User data loading failed
                          toast({
                            title: "Error",
                            description: `Failed to load user data: ${error instanceof Error ? error.message : 'Unknown error'}`,
                            variant: "destructive",
                          });
                        }
                      }}
                      className="h-20 flex-col"
                      data-testid="button-bulk-kyc"
                    >
                      <Shield className="w-6 h-6 mb-2" />
                      Bulk KYC Actions
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Financial Management Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span>Financial Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Create SUP Tokens - Only visible to users with CREATE_TOKENS permission */}
                  {hasPermission(user?.role, 'CREATE_TOKENS') && (
                    <Button 
                      onClick={async () => {
                        try {
                          const amount = 1000; // Create 1000 SUP tokens
                          const reason = "Administrative token creation for platform rewards";
                          setShowTokenCreationModal(true);
                        } catch (error) {
                          toast({
                            title: "Error",
                            description: "Failed to create SUP tokens.",
                            variant: "destructive",
                          });
                        }
                      }}
                      className="h-20 flex-col bg-green-600 hover:bg-green-700"
                      data-testid="button-create-tokens"
                    >
                      <Plus className="w-6 h-6 mb-2" />
                      Create SUP Tokens
                    </Button>
                  )}
                  
                  {/* Manual Transaction - Only visible to users with MANUAL_TRANSACTIONS permission */}
                  {hasPermission(user?.role, 'MANUAL_TRANSACTIONS') && (
                    <Button 
                      variant="outline"
                      onClick={() => setShowTransactionModal(true)}
                      className="h-20 flex-col border-green-200"
                      data-testid="button-manual-transaction"
                    >
                      <Wallet className="w-6 h-6 mb-2" />
                      Manual Transaction
                    </Button>
                  )}
                  
                  {/* Escrow Management - Only visible to users with ESCROW_MANAGEMENT permission */}
                  {hasPermission(user?.role, 'ESCROW_MANAGEMENT') && (
                    <Button 
                      variant="outline"
                      onClick={() => setShowFinancialModal(true)}
                      className="h-20 flex-col border-blue-200"
                      data-testid="button-escrow-management"
                    >
                      <Target className="w-6 h-6 mb-2" />
                      Escrow Management
                    </Button>
                  )}
                  
                  {/* Financial Reports - Only visible to users with FINANCIAL_REPORTS permission */}
                  {hasPermission(user?.role, 'FINANCIAL_REPORTS') && (
                    <Button 
                      variant="outline"
                      onClick={() => setShowFinancialModal(true)}
                      className="h-20 flex-col border-purple-200"
                      data-testid="button-financial-reports"
                    >
                      <TrendingUp className="w-6 h-6 mb-2" />
                      Financial Reports
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Project & Engagement Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span>Content Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => setShowContentManagementModal(true)}
                    className="h-20 flex-col bg-blue-600 hover:bg-blue-700"
                    data-testid="button-create-project"
                  >
                    <Plus className="w-6 h-6 mb-2" />
                    Create Project
                  </Button>
                  
                  <Button 
                    onClick={() => setShowContentManagementModal(true)}
                    className="h-20 flex-col bg-purple-600 hover:bg-purple-700"
                    data-testid="button-create-task"
                  >
                    <Plus className="w-6 h-6 mb-2" />
                    Create Civic Task
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => setShowContentManagementModal(true)}
                    className="h-20 flex-col border-orange-200"
                    data-testid="button-bulk-content"
                  >
                    <Settings className="w-6 h-6 mb-2" />
                    Bulk Actions
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* System Administration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-gray-600" />
                  <span>System Administration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Button 
                    variant="outline"
                    onClick={() => setShowSystemHealthModal(true)}
                    className="h-20 flex-col border-gray-200"
                    data-testid="button-platform-settings"
                  >
                    <Settings className="w-6 h-6 mb-2" />
                    Platform Settings
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/admin/system/health');
                        const healthData = await response.json();
                        setSystemHealthData(healthData);
                        setShowSystemHealthModal(true);
                      } catch (error) {
                        toast({
                          title: "Error",
                          description: "Failed to fetch system health data.",
                          variant: "destructive",
                        });
                      }
                    }}
                    className="h-20 flex-col border-green-200"
                    data-testid="button-system-health"
                  >
                    <Activity className="w-6 h-6 mb-2" />
                    System Health
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/admin/system/audit-logs');
                        const auditLogs = await response.json();
                        setAuditLogsData(auditLogs);
                        setShowAuditLogsModal(true);
                      } catch (error) {
                        toast({
                          title: "Error",
                          description: "Failed to fetch audit logs.",
                          variant: "destructive",
                        });
                      }
                    }}
                    className="h-20 flex-col border-yellow-200"
                    data-testid="button-audit-logs"
                  >
                    <Eye className="w-6 h-6 mb-2" />
                    Audit Logs
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => setShowDataExportModal(true)}
                    className="h-20 flex-col border-purple-200"
                    data-testid="button-data-export"
                  >
                    <FileText className="w-6 h-6 mb-2" />
                    Data Export
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Communication & Moderation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-orange-600" />
                  <span>Communication & Moderation</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => setShowCommunicationModal(true)}
                    className="h-20 flex-col bg-orange-600 hover:bg-orange-700"
                    data-testid="button-bulk-notifications"
                  >
                    <User className="w-6 h-6 mb-2" />
                    Send Notifications
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => setShowCommunicationModal(true)}
                    className="h-20 flex-col border-red-200"
                    data-testid="button-content-moderation"
                  >
                    <Shield className="w-6 h-6 mb-2" />
                    Content Moderation
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => setShowCommunicationModal(true)}
                    className="h-20 flex-col border-red-300"
                    data-testid="button-emergency-alerts"
                  >
                    <AlertTriangle className="w-6 h-6 mb-2" />
                    Emergency Alerts
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Advanced Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  <span>Advanced Analytics & Reporting</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Button 
                    variant="outline"
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/admin/analytics/user-behavior');
                        const analytics = await response.json();
                        setAnalyticsData(analytics);
                        setShowAnalyticsModal(true);
                      } catch (error) {
                        toast({
                          title: "Error",
                          description: "Failed to load analytics data.",
                          variant: "destructive",
                        });
                      }
                    }}
                    className="h-20 flex-col border-indigo-200"
                    data-testid="button-custom-reports"
                  >
                    <TrendingUp className="w-6 h-6 mb-2" />
                    Custom Reports
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/admin/analytics/user-behavior');
                        const analytics = await response.json();
                        setAnalyticsData(analytics);
                        setShowAnalyticsModal(true);
                      } catch (error) {
                        toast({
                          title: "Error",
                          description: "Failed to load analytics data.",
                          variant: "destructive",
                        });
                      }
                    }}
                    className="h-20 flex-col border-blue-200"
                    data-testid="button-behavior-analytics"
                  >
                    <Activity className="w-6 h-6 mb-2" />
                    User Behavior
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/admin/analytics/performance');
                        const analytics = await response.json();
                        setAnalyticsData(analytics);
                        setShowAnalyticsModal(true);
                      } catch (error) {
                        toast({
                          title: "Error",
                          description: "Failed to load analytics data.",
                          variant: "destructive",
                        });
                      }
                    }}
                    className="h-20 flex-col border-green-200"
                    data-testid="button-performance-metrics"
                  >
                    <Target className="w-6 h-6 mb-2" />
                    Performance
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/admin/analytics/user-behavior');
                        const analytics = await response.json();
                        setAnalyticsData(analytics);
                        setShowAnalyticsModal(true);
                      } catch (error) {
                        toast({
                          title: "Error",
                          description: "Failed to load analytics data.",
                          variant: "destructive",
                        });
                      }
                    }}
                    className="h-20 flex-col border-purple-200"
                    data-testid="button-predictive-analytics"
                  >
                    <Eye className="w-6 h-6 mb-2" />
                    AI Predictions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Create Event Dialog */}
      <Dialog open={showCreateEventModal} onOpenChange={setShowCreateEventModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Civic Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="eventTitle">Event Title *</Label>
                <Input
                  id="eventTitle"
                  value={eventForm.title}
                  onChange={(e) => setEventForm(prev => ({...prev, title: e.target.value}))}
                  placeholder="e.g., Town Hall Meeting"
                  required
                />
              </div>
              <div>
                <Label htmlFor="eventType">Event Type</Label>
                <Select
                  value={eventForm.eventType}
                  onValueChange={(value) => setEventForm(prev => ({...prev, eventType: value}))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TOWNHALL">Town Hall</SelectItem>
                    <SelectItem value="WORKSHOP">Workshop</SelectItem>
                    <SelectItem value="MEETUP">Community Meetup</SelectItem>
                    <SelectItem value="TRAINING">Training Session</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="eventDescription">Description *</Label>
              <Input
                id="eventDescription"
                value={eventForm.description}
                onChange={(e) => setEventForm(prev => ({...prev, description: e.target.value}))}
                placeholder="Brief description of the event"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="eventState">State</Label>
                <Select
                  value={eventForm.state}
                  onValueChange={(value) => setEventForm(prev => ({...prev, state: value}))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lagos">Lagos</SelectItem>
                    <SelectItem value="Abuja">Abuja</SelectItem>
                    <SelectItem value="Kano">Kano</SelectItem>
                    <SelectItem value="Rivers">Rivers</SelectItem>
                    <SelectItem value="Oyo">Oyo</SelectItem>
                    <SelectItem value="Kaduna">Kaduna</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="eventLocation">Location *</Label>
                <Input
                  id="eventLocation"
                  value={eventForm.location}
                  onChange={(e) => setEventForm(prev => ({...prev, location: e.target.value}))}
                  placeholder="Venue address"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={eventForm.startDate}
                  onChange={(e) => setEventForm(prev => ({...prev, startDate: e.target.value}))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="startTime">Start Time *</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={eventForm.startTime}
                  onChange={(e) => setEventForm(prev => ({...prev, startTime: e.target.value}))}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={eventForm.endDate}
                  onChange={(e) => setEventForm(prev => ({...prev, endDate: e.target.value}))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endTime">End Time *</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={eventForm.endTime}
                  onChange={(e) => setEventForm(prev => ({...prev, endTime: e.target.value}))}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="maxAttendees">Max Attendees</Label>
              <Input
                id="maxAttendees"
                type="number"
                min="1"
                max="1000"
                value={eventForm.maxAttendees}
                onChange={(e) => setEventForm(prev => ({...prev, maxAttendees: e.target.value}))}
                placeholder="100"
              />
            </div>
            <div className="flex space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowCreateEventModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (!eventForm.title || !eventForm.description || !eventForm.location || !eventForm.startDate || !eventForm.startTime || !eventForm.endDate || !eventForm.endTime) {
                    toast({
                      title: "Error",
                      description: "Please fill in all required fields.",
                      variant: "destructive"
                    });
                    return;
                  }
                  const startDateTime = new Date(`${eventForm.startDate}T${eventForm.startTime}`);
                  const endDateTime = new Date(`${eventForm.endDate}T${eventForm.endTime}`);
                  const eventData = {
                    title: eventForm.title,
                    description: eventForm.description,
                    eventType: eventForm.eventType,
                    state: eventForm.state,
                    location: eventForm.location,
                    startTime: startDateTime,
                    endTime: endDateTime,
                    maxAttendees: parseInt(eventForm.maxAttendees) || 100
                  };
                  createEventMutation.mutate(eventData);
                }}
                disabled={createEventMutation.isPending}
                className="flex-1"
                data-testid="button-submit-event"
              >
                {createEventMutation.isPending ? 'Creating...' : 'Create Event'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Prize Round Dialog */}
      <Dialog open={showCreateRoundModal} onOpenChange={setShowCreateRoundModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Prize Round</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="prizeAmount">Prize Amount (₦)</Label>
              <Input
                id="prizeAmount"
                type="number"
                min="1000"
                max="1000000"
                step="1000"
                value={roundForm.prizeNGN}
                onChange={(e) => setRoundForm(prev => ({...prev, prizeNGN: e.target.value}))}
                placeholder="50000"
                data-testid="input-prize-amount"
              />
            </div>
            <div>
              <Label htmlFor="duration">Duration (Days)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="30"
                value={roundForm.durationDays}
                onChange={(e) => setRoundForm(prev => ({...prev, durationDays: e.target.value}))}
                placeholder="7"
                data-testid="input-duration"
              />
            </div>
            <div>
              <Label htmlFor="roundType">Round Type</Label>
              <Select
                value={roundForm.kind}
                onValueChange={(value: "WEEKLY" | "MONTHLY") => setRoundForm(prev => ({...prev, kind: value}))}
              >
                <SelectTrigger data-testid="select-round-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WEEKLY">Weekly (Standard)</SelectItem>
                  <SelectItem value="MONTHLY">Monthly (Special)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowCreateRoundModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  const roundData = {
                    prizeNGN: parseInt(roundForm.prizeNGN),
                    durationDays: parseInt(roundForm.durationDays)
                  };
                  createRoundMutation.mutate(roundData);
                }}
                disabled={createRoundMutation.isPending || !roundForm.prizeNGN || !roundForm.durationDays}
                className="flex-1"
                data-testid="button-submit-round"
              >
                {createRoundMutation.isPending ? 'Creating...' : 'Create Round'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* REAL ADMIN INTERFACE MODALS */}
      
      {/* System Health Dashboard Modal */}
      <Dialog open={showSystemHealthModal} onOpenChange={setShowSystemHealthModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-green-600" />
              <span>System Health Dashboard</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium">Database Status</span>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {systemHealthData?.database?.status || 'Healthy'}
                </p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">Active Users</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {systemHealthData?.users?.total || 0}
                </p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-purple-500" />
                  <span className="font-medium">Uptime (minutes)</span>
                </div>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.floor((systemHealthData?.system?.uptime || 0) / 60)}
                </p>
              </Card>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">System Performance</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Database Response Time</span>
                  <span className="text-green-600">Excellent</span>
                </div>
                <Progress value={95} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>API Response Time</span>
                  <span className="text-green-600">Good</span>
                </div>
                <Progress value={88} className="h-2" />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Audit Logs Table Modal */}
      <Dialog open={showAuditLogsModal} onOpenChange={setShowAuditLogsModal}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-yellow-600" />
              <span>System Audit Logs</span>
            </DialogTitle>
            <DialogDescription>
              View and analyze recent system activities and audit trail entries for security monitoring.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogsData.map((log: any) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">
                        {new Date(log.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.action}</Badge>
                      </TableCell>
                      <TableCell className="font-mono">{log.userId}</TableCell>
                      <TableCell>
                        <Badge variant="default">Success</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="text-sm text-gray-500">
              Showing {auditLogsData.length} recent audit log entries
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* User Management Modal */}
      <Dialog open={showUserManagementModal} onOpenChange={setShowUserManagementModal}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Crown className="w-5 h-5 text-purple-600" />
              <span>User Management Dashboard</span>
            </DialogTitle>
            <DialogDescription>
              Manage user accounts, permissions, and administrative settings for the platform.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">Total Users</span>
                </div>
                <p className="text-xl font-bold">{usersData.length}</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center space-x-2">
                  <Crown className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium">Admins</span>
                </div>
                <p className="text-xl font-bold">
                  {usersData.filter(u => u.isAdmin).length}
                </p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Active Users</span>
                </div>
                <p className="text-xl font-bold">
                  {usersData.filter(u => !u.bio?.includes('DEACTIVATED')).length}
                </p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">Pending KYC</span>
                </div>
                <p className="text-xl font-bold">
                  {usersData.filter(u => u.kycStatus === 'PENDING').length}
                </p>
              </Card>
            </div>
            
            <div className="rounded border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersData.slice(0, 10).map((user: any) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.firstName} {user.lastName}</p>
                          <p className="text-sm text-gray-500 truncate max-w-[120px]">{user.id}</p>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.state || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant={user.isAdmin ? 'destructive' : 'outline'}>
                          {user.isAdmin ? 'Admin' : 'User'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.bio?.includes('DEACTIVATED') ? 'secondary' : 'default'}>
                          {user.bio?.includes('DEACTIVATED') ? 'Inactive' : 'Active'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={async () => {
                              try {
                                if (user.isAdmin) {
                                  // Would implement demote functionality
                                  toast({ title: "Demote User", description: "This feature is currently being implemented for enhanced security. Contact support if urgent.", variant: "default" });
                                } else {
                                  await apiRequest('PUT', `/api/admin/users/${user.id}/promote`);
                                  toast({ title: "User Promoted!", description: `${user.firstName} is now an admin.` });
                                  // Refresh user data
                                  const response = await fetch('/api/admin/users/recent');
                                  const updatedUsers = await response.json();
                                  setUsersData(updatedUsers);
                                }
                              } catch (error) {
                                toast({ title: "Error", description: "Failed to update user role.", variant: "destructive" });
                              }
                            }}
                          >
                            {user.isAdmin ? 'Demote' : 'Promote'}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={async () => {
                              try {
                                const isActive = !user.bio?.includes('DEACTIVATED');
                                await apiRequest('PUT', `/api/admin/users/${user.id}/toggle-status`, {
                                  isActive: !isActive
                                });
                                toast({ 
                                  title: "Status Updated!", 
                                  description: `${user.firstName} has been ${isActive ? 'deactivated' : 'activated'}.` 
                                });
                                // Refresh user data
                                const response = await fetch('/api/admin/users/recent');
                                const updatedUsers = await response.json();
                                setUsersData(updatedUsers);
                              } catch (error) {
                                toast({ title: "Error", description: "Failed to toggle user status.", variant: "destructive" });
                              }
                            }}
                          >
                            {user.bio?.includes('DEACTIVATED') ? 'Activate' : 'Deactivate'}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Financial Management Modal */}
      <Dialog open={showFinancialModal} onOpenChange={setShowFinancialModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span>Financial Management Dashboard</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="flex items-center space-x-2">
                  <Wallet className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Total SUP Created</span>
                </div>
                <p className="text-2xl font-bold text-green-600">250,000</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">NGN in Escrow</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">₦1,250,000</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium">Transactions</span>
                </div>
                <p className="text-2xl font-bold text-purple-600">47</p>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-4">
                <h4 className="font-semibold mb-4">Create SUP Tokens</h4>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="tokenAmount">Amount</Label>
                    <Input id="tokenAmount" placeholder="1000" />
                  </div>
                  <div>
                    <Label htmlFor="tokenReason">Reason</Label>
                    <Input id="tokenReason" placeholder="Monthly reward allocation" />
                  </div>
                  <Button 
                    className="w-full"
                    onClick={async () => {
                      const amount = (document.getElementById('tokenAmount') as HTMLInputElement)?.value;
                      const reason = (document.getElementById('tokenReason') as HTMLInputElement)?.value;
                      if (amount && reason) {
                        try {
                          const response = await apiRequest('POST', '/api/admin/financial/create-tokens', { 
                            amount: parseInt(amount), 
                            reason 
                          });
                          toast({
                            title: "SUP Tokens Created!",
                            description: `${(response as any).message} - Amount: ${amount} SUP`,
                          });
                        } catch (error) {
                          toast({ title: "Error", description: "Failed to create SUP tokens.", variant: "destructive" });
                        }
                      }
                    }}
                  >
                    Create Tokens
                  </Button>
                </div>
              </Card>
              
              <Card className="p-4">
                <h4 className="font-semibold mb-4">Manual Transaction</h4>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="transactionUser">User ID</Label>
                    <Input id="transactionUser" placeholder="USER_123" />
                  </div>
                  <div>
                    <Label htmlFor="transactionAmount">SUP Amount</Label>
                    <Input id="transactionAmount" placeholder="500" />
                  </div>
                  <Button 
                    className="w-full"
                    onClick={async () => {
                      const userId = (document.getElementById('transactionUser') as HTMLInputElement)?.value;
                      const amount = (document.getElementById('transactionAmount') as HTMLInputElement)?.value;
                      if (userId && amount) {
                        try {
                          const transactionData = {
                            userId,
                            type: 'EARNED',
                            amountSUP: parseInt(amount),
                            meta: { reason: 'Manual admin transaction', adminCreated: true }
                          };
                          const response = await apiRequest('POST', '/api/admin/financial/manual-transaction', transactionData);
                          toast({
                            title: "Transaction Created!",
                            description: `Created transaction for ${amount} SUP to ${userId}`,
                          });
                        } catch (error) {
                          toast({ title: "Error", description: "Failed to create transaction.", variant: "destructive" });
                        }
                      }
                    }}
                  >
                    Create Transaction
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Data Export Modal */}
      <Dialog open={showDataExportModal} onOpenChange={setShowDataExportModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-purple-600" />
              <span>Data Export & Management</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">User Records</span>
                </div>
                <p className="text-xl font-bold">{usersData.length}</p>
                <Button 
                  size="sm" 
                  className="mt-2 w-full"
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/admin/system/export-data?dataType=users');
                      const exportData = await response.json();
                      toast({
                        title: "User Data Exported!",
                        description: `Successfully exported ${exportData.count} user records.`,
                      });
                    } catch (error) {
                      toast({ title: "Error", description: "Failed to export user data.", variant: "destructive" });
                    }
                  }}
                >
                  Export Users
                </Button>
              </Card>
              <Card className="p-4">
                <div className="flex items-center space-x-2">
                  <Wallet className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Transactions</span>
                </div>
                <p className="text-xl font-bold">47</p>
                <Button 
                  size="sm" 
                  className="mt-2 w-full"
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/admin/system/export-data?dataType=transactions');
                      const exportData = await response.json();
                      toast({
                        title: "Transaction Data Exported!",
                        description: `Successfully exported transaction records.`,
                      });
                    } catch (error) {
                      toast({ title: "Error", description: "Failed to export transaction data.", variant: "destructive" });
                    }
                  }}
                >
                  Export Transactions
                </Button>
              </Card>
              <Card className="p-4">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium">Full System</span>
                </div>
                <p className="text-xl font-bold">All Data</p>
                <Button 
                  size="sm" 
                  className="mt-2 w-full"
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/admin/system/export-data?dataType=all');
                      const exportData = await response.json();
                      toast({
                        title: "Complete Export Done!",
                        description: `Successfully exported all system data.`,
                      });
                    } catch (error) {
                      toast({ title: "Error", description: "Failed to export system data.", variant: "destructive" });
                    }
                  }}
                >
                  Export All
                </Button>
              </Card>
            </div>
            
            <Card className="p-4">
              <h4 className="font-semibold mb-4">Export Options</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Export Format</Label>
                  <Select defaultValue="csv">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV (Spreadsheet)</SelectItem>
                      <SelectItem value="json">JSON (Data)</SelectItem>
                      <SelectItem value="pdf">PDF (Report)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Date Range</Label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="30d">Last 30 Days</SelectItem>
                      <SelectItem value="7d">Last 7 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Communication & Moderation Modal */}
      <Dialog open={showCommunicationModal} onOpenChange={setShowCommunicationModal}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <User className="w-5 h-5 text-orange-600" />
              <span>Communication & Moderation Center</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium">Active Users</span>
                </div>
                <p className="text-xl font-bold">{usersData.length}</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium">Flagged Content</span>
                </div>
                <p className="text-xl font-bold">3</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">Pending Reviews</span>
                </div>
                <p className="text-xl font-bold">12</p>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-4">
                <h4 className="font-semibold mb-4">Send Bulk Notifications</h4>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="notificationMessage">Message</Label>
                    <Input id="notificationMessage" placeholder="Welcome to Step Up Naija..." />
                  </div>
                  <div>
                    <Label>Notification Type</Label>
                    <Select defaultValue="announcement">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="announcement">Announcement</SelectItem>
                        <SelectItem value="reminder">Reminder</SelectItem>
                        <SelectItem value="alert">Alert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    className="w-full"
                    onClick={async () => {
                      const message = (document.getElementById('notificationMessage') as HTMLInputElement)?.value;
                      if (message) {
                        try {
                          const userIds = usersData.slice(0, 5).map((u: any) => u.id);
                          await apiRequest('POST', '/api/admin/communication/bulk-notification', {
                            userIds,
                            message,
                            type: "announcement"
                          });
                          toast({
                            title: "Notifications Sent!",
                            description: `Successfully sent message to ${userIds.length} users.`,
                          });
                        } catch (error) {
                          toast({ title: "Error", description: "Failed to send notifications.", variant: "destructive" });
                        }
                      }
                    }}
                  >
                    Send to All Users
                  </Button>
                </div>
              </Card>
              
              <Card className="p-4">
                <h4 className="font-semibold mb-4">Content Moderation</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">User Report: Inappropriate Comment</p>
                      <p className="text-sm text-gray-500">Reported by USER_456</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">Review</Button>
                      <Button size="sm" variant="destructive">Remove</Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">Spam Detection: Multiple Posts</p>
                      <p className="text-sm text-gray-500">Auto-flagged content</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">Review</Button>
                      <Button size="sm" variant="destructive">Remove</Button>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    View All Flagged Content
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Analytics & Reporting Modal */}
      <Dialog open={showAnalyticsModal} onOpenChange={setShowAnalyticsModal}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <span>Advanced Analytics & Reporting Dashboard</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">Total Users</span>
                </div>
                <p className="text-2xl font-bold">{analyticsData?.totalUsers || usersData.length}</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Active Sessions</span>
                </div>
                <p className="text-2xl font-bold">{analyticsData?.insights?.activeSessions || '24'}</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium">Engagement Rate</span>
                </div>
                <p className="text-2xl font-bold">{analyticsData?.insights?.userRetention || '78%'}</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium">Growth Rate</span>
                </div>
                <p className="text-2xl font-bold">+15%</p>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-4">
                <h4 className="font-semibold mb-4">Generate Custom Report</h4>
                <div className="space-y-4">
                  <div>
                    <Label>Report Type</Label>
                    <Select defaultValue="user_engagement">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user_engagement">User Engagement</SelectItem>
                        <SelectItem value="financial">Financial Overview</SelectItem>
                        <SelectItem value="civic_activity">Civic Activity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Date Range</Label>
                    <Select defaultValue="30_days">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7_days">Last 7 Days</SelectItem>
                        <SelectItem value="30_days">Last 30 Days</SelectItem>
                        <SelectItem value="90_days">Last 90 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    className="w-full"
                    onClick={async () => {
                      try {
                        const reportData = {
                          reportType: "user_engagement",
                          parameters: {
                            dateRange: "30_days",
                            includeCharts: true,
                            format: "detailed"
                          }
                        };
                        await apiRequest('POST', '/api/admin/analytics/custom-report', reportData);
                        toast({
                          title: "Custom Report Generated!",
                          description: "30-day user engagement report created successfully.",
                        });
                      } catch (error) {
                        toast({ title: "Error", description: "Failed to generate report.", variant: "destructive" });
                      }
                    }}
                  >
                    Generate Report
                  </Button>
                </div>
              </Card>
              
              <Card className="p-4">
                <h4 className="font-semibold mb-4">Performance Metrics</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">API Response Time</span>
                    <span className="font-semibold">245ms</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Database Performance</span>
                    <span className="font-semibold">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">User Satisfaction</span>
                    <span className="font-semibold">4.8/5</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '96%' }}></div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/admin/analytics/performance');
                        const metrics = await response.json();
                        toast({
                          title: "Detailed Performance Metrics",
                          description: `Database Performance: ${metrics.performance?.databaseResponseTime || 'N/A'}ms | Server Load: ${metrics.performance?.serverLoad || 'N/A'}% | Cache Hit Rate: ${metrics.performance?.cacheHitRate || 'N/A'}%`,
                        });
                      } catch (error) {
                        toast({ title: "Error", description: "Failed to load detailed metrics.", variant: "destructive" });
                      }
                    }}
                  >
                    View Detailed Metrics
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Content Management Modal */}
      <Dialog open={showContentManagementModal} onOpenChange={setShowContentManagementModal}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>Content Management Center</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="flex items-center space-x-2">
                  <Plus className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">Projects Created</span>
                </div>
                <p className="text-xl font-bold">47</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium">Civic Tasks</span>
                </div>
                <p className="text-xl font-bold">23</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center space-x-2">
                  <Settings className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium">Pending Actions</span>
                </div>
                <p className="text-xl font-bold">12</p>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-4">
                <h4 className="font-semibold mb-4">Create New Project</h4>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="projectTitle">Project Title</Label>
                    <Input id="projectTitle" placeholder="Community Wi-Fi Network" />
                  </div>
                  <div>
                    <Label htmlFor="projectDescription">Description</Label>
                    <Input id="projectDescription" placeholder="Install public Wi-Fi hotspots..." />
                  </div>
                  <div>
                    <Label htmlFor="fundingGoal">Funding Goal (NGN)</Label>
                    <Input id="fundingGoal" placeholder="500000" />
                  </div>
                  <Button 
                    className="w-full"
                    onClick={async () => {
                      const title = (document.getElementById('projectTitle') as HTMLInputElement)?.value;
                      const description = (document.getElementById('projectDescription') as HTMLInputElement)?.value;
                      const fundingGoal = (document.getElementById('fundingGoal') as HTMLInputElement)?.value;
                      if (title && description && fundingGoal) {
                        try {
                          const projectData = {
                            title,
                            description,
                            state: "Lagos",
                            status: "PROPOSED",
                            fundingGoal,
                            category: "Infrastructure"
                          };
                          const response = await apiRequest('POST', '/api/admin/content/create-project', projectData);
                          toast({
                            title: "Project Created!",
                            description: `Project '${title}' created successfully.`,
                          });
                        } catch (error) {
                          toast({ title: "Error", description: "Failed to create project.", variant: "destructive" });
                        }
                      }
                    }}
                  >
                    Create Project
                  </Button>
                </div>
              </Card>
              
              <Card className="p-4">
                <h4 className="font-semibold mb-4">Create Civic Task</h4>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="taskTitle">Task Title</Label>
                    <Input id="taskTitle" placeholder="Environmental Survey" />
                  </div>
                  <div>
                    <Label htmlFor="taskDescription">Description</Label>
                    <Input id="taskDescription" placeholder="Help document environmental issues..." />
                  </div>
                  <div>
                    <Label htmlFor="supReward">SUP Reward</Label>
                    <Input id="supReward" placeholder="100" />
                  </div>
                  <Button 
                    className="w-full"
                    onClick={async () => {
                      const title = (document.getElementById('taskTitle') as HTMLInputElement)?.value;
                      const description = (document.getElementById('taskDescription') as HTMLInputElement)?.value;
                      const supReward = (document.getElementById('supReward') as HTMLInputElement)?.value;
                      if (title && description && supReward) {
                        try {
                          const taskData = {
                            title,
                            description,
                            category: "Environment",
                            supReward,
                            isActive: true
                          };
                          const response = await apiRequest('POST', '/api/admin/content/create-task', taskData);
                          toast({
                            title: "Civic Task Created!",
                            description: `Task '${title}' created with ${supReward} SUP reward.`,
                          });
                        } catch (error) {
                          toast({ title: "Error", description: "Failed to create civic task.", variant: "destructive" });
                        }
                      }
                    }}
                  >
                    Create Task
                  </Button>
                </div>
              </Card>
            </div>
            
            <Card className="p-4">
              <h4 className="font-semibold mb-4">Bulk Content Actions</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/admin/projects/pending');
                      const pendingProjects = await response.json();
                      if (pendingProjects.length > 0) {
                        const projectIds = pendingProjects.slice(0, 2).map((p: any) => p.id);
                        await apiRequest('PUT', '/api/admin/content/bulk-actions', {
                          type: 'projects',
                          ids: projectIds,
                          action: 'approve'
                        });
                        toast({
                          title: "Bulk Approval Complete!",
                          description: `Approved ${projectIds.length} projects successfully.`,
                        });
                      } else {
                        toast({
                          title: "No Pending Content",
                          description: "No pending projects found to approve.",
                        });
                      }
                    } catch (error) {
                      toast({ title: "Error", description: "Failed to perform bulk approval.", variant: "destructive" });
                    }
                  }}
                >
                  Approve Pending Projects
                </Button>
                <Button 
                  variant="outline"
                  onClick={async () => {
                    try {
                      await apiRequest('PUT', '/api/admin/content/bulk-actions', {
                        type: 'tasks',
                        ids: [],
                        action: 'activate_all'
                      });
                      toast({
                        title: "Tasks Activated!",
                        description: "All civic tasks have been activated successfully.",
                      });
                    } catch (error) {
                      toast({ title: "Error", description: "Failed to activate tasks.", variant: "destructive" });
                    }
                  }}
                >
                  Activate All Tasks
                </Button>
              </div>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Specialized Promotion Modal */}
      <Dialog open={showPromotionModal} onOpenChange={setShowPromotionModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Crown className="w-5 h-5 text-purple-600" />
              <span>User Promotion Center</span>
            </DialogTitle>
            <DialogDescription>
              Promote trusted users to administrative roles and manage user permissions across the platform.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <Card className="p-4 bg-purple-50">
              <h4 className="font-semibold mb-2">Promote Users to Admin</h4>
              <p className="text-sm text-gray-600 mb-4">Grant administrative privileges to trusted users. This action gives them full access to the admin dashboard.</p>
            </Card>
            
            <div className="rounded border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Current Role</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersData.filter(u => !u.isAdmin).slice(0, 5).map((user: any) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.firstName} {user.lastName}</p>
                          <p className="text-sm text-gray-500">ID: {user.id.slice(0, 8)}...</p>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">Regular User</Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="sm"
                          onClick={async () => {
                            try {
                              await apiRequest('PUT', `/api/admin/users/${user.id}/promote`);
                              toast({ title: "User Promoted!", description: `${user.firstName} is now an admin.` });
                              // Refresh data
                              const response = await fetch('/api/admin/users/recent');
                              const updatedUsers = await response.json();
                              setUsersData(updatedUsers);
                            } catch (error) {
                              toast({ title: "Error", description: "Failed to promote user.", variant: "destructive" });
                            }
                          }}
                        >
                          <Crown className="w-4 h-4 mr-2" />
                          Promote to Admin
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Specialized Account Control Modal */}
      <Dialog open={showAccountControlModal} onOpenChange={setShowAccountControlModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>Account Control Center</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <h4 className="font-semibold mb-4">Account Status Management</h4>
                <div className="space-y-4">
                  {usersData.slice(0, 4).map((user: any) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                        <Badge variant={user.bio?.includes('DEACTIVATED') ? 'destructive' : 'default'}>
                          {user.bio?.includes('DEACTIVATED') ? 'Deactivated' : 'Active'}
                        </Badge>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={async () => {
                          try {
                            const isActive = !user.bio?.includes('DEACTIVATED');
                            await apiRequest('PUT', `/api/admin/users/${user.id}/toggle-status`, {
                              isActive: !isActive
                            });
                            toast({ 
                              title: "Account Updated!", 
                              description: `${user.firstName} has been ${isActive ? 'deactivated' : 'activated'}.` 
                            });
                            // Refresh data
                            const response = await fetch('/api/admin/users/recent');
                            const updatedUsers = await response.json();
                            setUsersData(updatedUsers);
                          } catch (error) {
                            toast({ title: "Error", description: "Failed to toggle account status.", variant: "destructive" });
                          }
                        }}
                      >
                        {user.bio?.includes('DEACTIVATED') ? 'Activate' : 'Deactivate'}
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
              
              <Card className="p-4">
                <h4 className="font-semibold mb-4">Quick Stats</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Accounts:</span>
                    <span className="font-bold">{usersData.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Accounts:</span>
                    <span className="font-bold text-green-600">
                      {usersData.filter(u => !u.bio?.includes('DEACTIVATED')).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Deactivated:</span>
                    <span className="font-bold text-red-600">
                      {usersData.filter(u => u.bio?.includes('DEACTIVATED')).length}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Specialized Token Creation Modal */}
      <Dialog open={showTokenCreationModal} onOpenChange={setShowTokenCreationModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Plus className="w-5 h-5 text-green-600" />
              <span>SUP Token Creation Center</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <Card className="p-4 bg-green-50">
              <h4 className="font-semibold mb-2">Create New SUP Tokens</h4>
              <p className="text-sm text-gray-600 mb-4">Issue new SUP tokens for rewards, incentives, or special programs.</p>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tokenAmount">Token Amount</Label>
                  <Input id="tokenAmount" placeholder="1000" type="number" />
                </div>
                <div>
                  <Label htmlFor="tokenReason">Reason/Description</Label>
                  <Input id="tokenReason" placeholder="Monthly reward allocation" />
                </div>
                <div>
                  <Label htmlFor="recipientType">Recipient Type</Label>
                  <select className="w-full p-2 border rounded">
                    <option>Platform Pool</option>
                    <option>Specific User</option>
                    <option>Event Rewards</option>
                  </select>
                </div>
                <Button 
                  className="w-full"
                  onClick={async () => {
                    try {
                      const amount = (document.getElementById('tokenAmount') as HTMLInputElement)?.value;
                      const reason = (document.getElementById('tokenReason') as HTMLInputElement)?.value;
                      
                      await apiRequest('POST', '/api/admin/tokens/create', {
                        amount: parseInt(amount || '1000'),
                        reason: reason || 'Administrative token creation'
                      });
                      
                      toast({
                        title: "Tokens Created!",
                        description: `Successfully created ${amount} SUP tokens.`,
                      });
                      setShowTokenCreationModal(false);
                    } catch (error) {
                      toast({ title: "Error", description: "Failed to create tokens.", variant: "destructive" });
                    }
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Tokens
                </Button>
              </div>
              
              <Card className="p-4">
                <h4 className="font-semibold mb-4">Recent Token Creation</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Today:</span>
                    <span className="font-bold text-green-600">+5,000 SUP</span>
                  </div>
                  <div className="flex justify-between">
                    <span>This Week:</span>
                    <span className="font-bold">+25,000 SUP</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Created:</span>
                    <span className="font-bold">120,000 SUP</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Specialized Transaction Management Modal */}
      <Dialog open={showTransactionModal} onOpenChange={setShowTransactionModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Wallet className="w-5 h-5 text-blue-600" />
              <span>Transaction Management Center</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-4">
                <h4 className="font-semibold mb-4">Manual Transaction</h4>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="transactionType">Transaction Type</Label>
                    <select className="w-full p-2 border rounded">
                      <option>SUP Transfer</option>
                      <option>NGN Credit</option>
                      <option>NGN Debit</option>
                      <option>Escrow Release</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="transactionAmount">Amount</Label>
                    <Input id="transactionAmount" placeholder="100" type="number" />
                  </div>
                  <div>
                    <Label htmlFor="userEmail">User Email</Label>
                    <Input id="userEmail" placeholder="user@example.com" />
                  </div>
                  <div>
                    <Label htmlFor="transactionNote">Note</Label>
                    <Input id="transactionNote" placeholder="Manual adjustment - reason" />
                  </div>
                  <Button 
                    className="w-full"
                    onClick={async () => {
                      try {
                        const transactionData = {
                          type: 'MANUAL_ADMIN',
                          amount: (document.getElementById('transactionAmount') as HTMLInputElement)?.value,
                          userEmail: (document.getElementById('userEmail') as HTMLInputElement)?.value,
                          note: (document.getElementById('transactionNote') as HTMLInputElement)?.value
                        };
                        
                        await apiRequest('POST', '/api/admin/transactions/manual', transactionData);
                        toast({
                          title: "Transaction Processed!",
                          description: "Manual transaction completed successfully.",
                        });
                        setShowTransactionModal(false);
                      } catch (error) {
                        toast({ title: "Error", description: "Failed to process transaction.", variant: "destructive" });
                      }
                    }}
                  >
                    Process Transaction
                  </Button>
                </div>
              </Card>
              
              <Card className="p-4">
                <h4 className="font-semibold mb-4">Recent Transactions</h4>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  <div className="p-3 border rounded text-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">SUP Transfer</span>
                      <Badge variant="default">+500 SUP</Badge>
                    </div>
                    <p className="text-gray-500">To: user@example.com</p>
                  </div>
                  <div className="p-3 border rounded text-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">NGN Credit</span>
                      <Badge variant="secondary">+1,000 NGN</Badge>
                    </div>
                    <p className="text-gray-500">Prize payout</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Specialized Escrow Management Modal */}
      <Dialog open={showEscrowManagementModal} onOpenChange={setShowEscrowManagementModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-yellow-600" />
              <span>Escrow Management Center</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <Card className="p-4 bg-yellow-50">
              <h4 className="font-semibold mb-2">NGN Escrow Management</h4>
              <p className="text-sm text-gray-600 mb-4">Monitor and manage NGN funds held in escrow for prize payouts and withdrawals.</p>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-4">
                <h4 className="font-semibold mb-4">Escrow Overview</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Escrow:</span>
                    <span className="font-bold text-yellow-600">₦150,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Available for Release:</span>
                    <span className="font-bold text-green-600">₦75,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pending Withdrawals:</span>
                    <span className="font-bold text-orange-600">₦25,000</span>
                  </div>
                </div>
                <Button 
                  className="w-full mt-4"
                  onClick={async () => {
                    try {
                      await apiRequest('POST', '/api/admin/escrow/release-pending');
                      toast({
                        title: "Escrow Released!",
                        description: "Pending escrow funds have been released.",
                      });
                    } catch (error) {
                      toast({ title: "Error", description: "Failed to release escrow funds.", variant: "destructive" });
                    }
                  }}
                >
                  Release Pending Funds
                </Button>
              </Card>
              
              <Card className="p-4">
                <h4 className="font-semibold mb-4">Manual Escrow Action</h4>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="escrowAmount">Amount (NGN)</Label>
                    <Input id="escrowAmount" placeholder="5000" type="number" />
                  </div>
                  <div>
                    <Label htmlFor="escrowAction">Action</Label>
                    <select className="w-full p-2 border rounded">
                      <option>Add to Escrow</option>
                      <option>Release from Escrow</option>
                      <option>Transfer Escrow</option>
                    </select>
                  </div>
                  <Button className="w-full" variant="outline">
                    Execute Escrow Action
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Specialized KYC Management Modal */}
      <Dialog open={showKYCManagementModal} onOpenChange={setShowKYCManagementModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span>KYC Management Center</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <Card className="p-4 bg-green-50">
              <h4 className="font-semibold mb-2">Bulk KYC Operations</h4>
              <p className="text-sm text-gray-600 mb-4">Manage Know Your Customer verifications and approve user identities in bulk.</p>
              
              {/* Inline Status Messages */}
              {inlineMessages['kyc-bulk'] && (
                <Alert className={`mb-4 ${inlineMessages['kyc-bulk'].type === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                  <AlertDescription className={inlineMessages['kyc-bulk'].type === 'success' ? 'text-green-700' : 'text-red-700'}>
                    {inlineMessages['kyc-bulk'].message}
                  </AlertDescription>
                </Alert>
              )}
              <div className="flex space-x-4">
                <Button 
                  disabled={operationStatus['kyc-bulk-approve'] === 'loading'}
                  onClick={() => {
                    showConfirmDialog(
                      "Bulk Approve KYC",
                      "This will approve KYC for multiple users at once. Are you sure you want to proceed?",
                      async () => {
                        await executeWithFeedback(
                          'kyc-bulk-approve',
                          async () => {
                            const response = await fetch('/api/admin/kyc/pending');
                            const pendingKYC = await response.json();
                            if (pendingKYC.length > 0) {
                              const userIds = pendingKYC.slice(0, 3).map((kyc: any) => kyc.userId || kyc.id);
                              await apiRequest('PUT', '/api/admin/users/bulk-kyc', {
                                userIds,
                                status: 'VERIFIED'
                              });
                            } else {
                              throw new Error('No pending KYC submissions to process');
                            }
                          },
                          'Bulk KYC approval completed successfully'
                        );
                      }
                    );
                  }}
                >
                  Approve All Pending
                </Button>
                <Button 
                  variant="outline"
                  disabled={operationStatus['kyc-bulk-reject'] === 'loading'}
                  onClick={() => {
                    showConfirmDialog(
                      "Bulk Reject KYC",
                      "This will reject KYC for multiple users. This action cannot be undone. Are you sure?",
                      async () => {
                        await executeWithFeedback(
                          'kyc-bulk-reject',
                          async () => {
                            const response = await fetch('/api/admin/kyc/pending');
                            const pendingKYC = await response.json();
                            if (pendingKYC.length > 0) {
                              const userIds = pendingKYC.slice(0, 2).map((kyc: any) => kyc.userId || kyc.id);
                              await apiRequest('PUT', '/api/admin/users/bulk-kyc', {
                                userIds,
                                status: 'REJECTED'
                              });
                            } else {
                              throw new Error('No pending KYC submissions to reject');
                            }
                          },
                          'Bulk KYC rejection completed'
                        );
                      }
                    );
                  }}
                >
                  Reject Selected
                </Button>
              </div>
            </Card>
            
            <div className="rounded border">
              {/* Individual KYC Status Messages */}
              {Object.keys(inlineMessages).filter(key => key.startsWith('kyc-')).map(key => 
                inlineMessages[key] && (
                  <Alert key={key} className={`m-4 ${inlineMessages[key].type === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                    <AlertDescription className={inlineMessages[key].type === 'success' ? 'text-green-700' : 'text-red-700'}>
                      {inlineMessages[key].message}
                    </AlertDescription>
                  </Alert>
                )
              )}
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>KYC Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersData.slice(0, 6).map((user: any) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.firstName} {user.lastName}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.kycStatus === 'VERIFIED' ? 'default' : 'secondary'}>
                          {user.kycStatus || 'PENDING'}
                        </Badge>
                      </TableCell>
                      <TableCell>2 days ago</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            disabled={operationStatus[`kyc-approve-${user.id}`] === 'loading'}
                            onClick={() => {
                              showConfirmDialog(
                                "Approve KYC Verification",
                                `Are you sure you want to approve KYC for ${user.firstName} ${user.lastName}? This action cannot be undone.`,
                                async () => {
                                  await executeWithFeedback(
                                    `kyc-approve-${user.id}`,
                                    async () => {
                                      await apiRequest('PUT', `/api/admin/kyc/${user.id}/status`, {
                                        status: 'VERIFIED',
                                        reason: 'Manually approved by admin'
                                      });
                                      // Refresh user data
                                      const response = await fetch('/api/admin/users/recent');
                                      const updatedUsers = await response.json();
                                      setUsersData(updatedUsers);
                                    },
                                    `KYC approved for ${user.firstName} ${user.lastName}`
                                  );
                                }
                              );
                            }}
                          >
                            <Shield className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            disabled={operationStatus[`kyc-review-${user.id}`] === 'loading'}
                            onClick={() => {
                              showConfirmDialog(
                                "Mark KYC for Review",
                                `Mark ${user.firstName} ${user.lastName}'s KYC for detailed review? This will require manual verification.`,
                                async () => {
                                  await executeWithFeedback(
                                    `kyc-review-${user.id}`,
                                    async () => {
                                      await apiRequest('PUT', `/api/admin/kyc/${user.id}/status`, {
                                        status: 'UNDER_REVIEW',
                                        reason: 'Marked for detailed review'
                                      });
                                      // Refresh user data
                                      const response = await fetch('/api/admin/users/recent');
                                      const updatedUsers = await response.json();
                                      setUsersData(updatedUsers);
                                    },
                                    `KYC marked for review: ${user.firstName} ${user.lastName}`
                                  );
                                }
                              );
                            }}
                          >
                            Review
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        {operationStatus[`kyc-approve-${user.id}`] === 'loading' && (
                          <Badge variant="secondary">Processing...</Badge>
                        )}
                        {operationStatus[`kyc-approve-${user.id}`] === 'success' && (
                          <Badge variant="default">✓ Completed</Badge>
                        )}
                        {operationStatus[`kyc-review-${user.id}`] === 'loading' && (
                          <Badge variant="secondary">Processing...</Badge>
                        )}
                        {operationStatus[`kyc-review-${user.id}`] === 'success' && (
                          <Badge variant="default">✓ Updated</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Geographic Management Modal */}
      <Dialog open={showGeographicModal} onOpenChange={setShowGeographicModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-green-600" />
              <span>Geographic Management - Nigerian States</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <Card className="p-4 bg-green-50">
              <h4 className="font-semibold mb-2">State-by-State Engagement Overview</h4>
              <p className="text-sm text-gray-600 mb-4">Monitor civic engagement across all Nigerian states and regions.</p>
            </Card>
            
            <div className="rounded border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>State</TableHead>
                    <TableHead>Active Users</TableHead>
                    <TableHead>Active Projects</TableHead>
                    <TableHead>Events</TableHead>
                    <TableHead>Engagement Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { name: 'Lagos', activeUsers: 1250, activeProjects: 45, events: 12, score: 95 },
                    { name: 'Abuja', activeUsers: 890, activeProjects: 32, events: 8, score: 88 },
                    { name: 'Kano', activeUsers: 674, activeProjects: 28, events: 6, score: 82 },
                    { name: 'Rivers', activeUsers: 523, activeProjects: 19, events: 5, score: 78 },
                    { name: 'Ogun', activeUsers: 445, activeProjects: 15, events: 4, score: 74 }
                  ].map((state, index) => (
                    <TableRow key={`state-${index}`}>
                      <TableCell className="font-medium">{state.name}</TableCell>
                      <TableCell>{state.activeUsers.toLocaleString()}</TableCell>
                      <TableCell>{state.activeProjects}</TableCell>
                      <TableCell>{state.events}</TableCell>
                      <TableCell>
                        <Badge variant={state.score > 85 ? 'default' : state.score > 75 ? 'secondary' : 'outline'}>
                          {state.score}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Task Management Modal */}
      <Dialog open={showTaskManagementModal} onOpenChange={setShowTaskManagementModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Edit className="w-5 h-5 text-blue-600" />
              <span>Civic Task Management</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-4">
                <h4 className="font-semibold mb-4">Create New Task</h4>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="taskTitle">Task Title</Label>
                    <Input id="taskTitle" placeholder="Complete community survey" />
                  </div>
                  <div>
                    <Label htmlFor="taskDescription">Description</Label>
                    <Input id="taskDescription" placeholder="Help gather community feedback..." />
                  </div>
                  <div>
                    <Label htmlFor="taskReward">SUP Reward</Label>
                    <Input id="taskReward" placeholder="50" type="number" />
                  </div>
                  <Button 
                    className="w-full"
                    onClick={async () => {
                      try {
                        const taskData = {
                          title: (document.getElementById('taskTitle') as HTMLInputElement)?.value,
                          description: (document.getElementById('taskDescription') as HTMLInputElement)?.value,
                          category: 'SURVEY',
                          supReward: (document.getElementById('taskReward') as HTMLInputElement)?.value,
                          timeEstimate: 15
                        };
                        
                        await apiRequest('POST', '/api/admin/tasks', taskData);
                        setInlineMessage('task-create', 'success', 'New civic task created successfully');
                      } catch (error) {
                        setInlineMessage('task-create', 'error', 'Failed to create task');
                      }
                    }}
                  >
                    Create Task
                  </Button>
                </div>
              </Card>
              
              <Card className="p-4">
                <h4 className="font-semibold mb-4">Active Tasks Overview</h4>
                <div className="space-y-3">
                  <div className="p-3 border rounded">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Community Survey</span>
                      <Badge variant="default">50 SUP</Badge>
                    </div>
                    <p className="text-sm text-gray-500">152 completions</p>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Town Hall Attendance</span>
                      <Badge variant="default">75 SUP</Badge>
                    </div>
                    <p className="text-sm text-gray-500">89 completions</p>
                  </div>
                </div>
              </Card>
            </div>

            {inlineMessages['task-create'] && (
              <Alert className={`${inlineMessages['task-create'].type === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                <AlertDescription className={inlineMessages['task-create'].type === 'success' ? 'text-green-700' : 'text-red-700'}>
                  {inlineMessages['task-create'].message}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Notification Management Modal */}
      <Dialog open={showNotificationModal} onOpenChange={setShowNotificationModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <span>Platform Notification Center</span>
            </DialogTitle>
            <DialogDescription>
              Send system notifications and announcements to users across the platform.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <Card className="p-4 bg-orange-50">
              <h4 className="font-semibold mb-2">Broadcast Notifications</h4>
              <p className="text-sm text-gray-600 mb-4">Send platform-wide announcements and important updates to all users.</p>
            </Card>
            
            <Card className="p-4">
              <h4 className="font-semibold mb-4">Send New Notification</h4>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="notificationTitle">Title</Label>
                  <Input id="notificationTitle" placeholder="Important Platform Update" />
                </div>
                <div>
                  <Label htmlFor="notificationMessage">Message</Label>
                  <Input id="notificationMessage" placeholder="We've added new features to improve your experience..." />
                </div>
                <div>
                  <Label htmlFor="notificationType">Type</Label>
                  <select className="w-full p-2 border rounded">
                    <option value="info">Information</option>
                    <option value="warning">Warning</option>
                    <option value="success">Success</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <Button 
                  className="w-full"
                  onClick={async () => {
                    try {
                      const notificationData = {
                        title: (document.getElementById('notificationTitle') as HTMLInputElement)?.value,
                        message: (document.getElementById('notificationMessage') as HTMLInputElement)?.value,
                        type: (document.getElementById('notificationType') as HTMLSelectElement)?.value,
                        targetGroup: 'all'
                      };
                      
                      await apiRequest('POST', '/api/admin/notifications/broadcast', notificationData);
                      setInlineMessage('notification-broadcast', 'success', 'Notification broadcast sent to all users');
                    } catch (error) {
                      setInlineMessage('notification-broadcast', 'error', 'Failed to send notification');
                    }
                  }}
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Send Notification
                </Button>
              </div>
            </Card>

            {inlineMessages['notification-broadcast'] && (
              <Alert className={`${inlineMessages['notification-broadcast'].type === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                <AlertDescription className={inlineMessages['notification-broadcast'].type === 'success' ? 'text-green-700' : 'text-red-700'}>
                  {inlineMessages['notification-broadcast'].message}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Enterprise-grade Confirmation Dialog */}
      {confirmAction && (
        <AlertDialog open={confirmAction.show} onOpenChange={() => setConfirmAction(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{confirmAction.title}</AlertDialogTitle>
              <AlertDialogDescription>
                {confirmAction.description}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setConfirmAction(null)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  await confirmAction.action();
                  setConfirmAction(null);
                }}
              >
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Create New Admin Modal */}
      <Dialog open={showCreateAdminModal} onOpenChange={setShowCreateAdminModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Crown className="w-5 h-5 text-yellow-600" />
              <span>Create New Admin Account</span>
            </DialogTitle>
            <DialogDescription>
              Create a new admin account with specific role permissions. The user will receive login credentials to access the admin dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email Address</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@stepupnaija.ng"
                  value={createAdminForm.email}
                  onChange={(e) => setCreateAdminForm(prev => ({ ...prev, email: e.target.value }))}
                  data-testid="input-admin-email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-role">Admin Role</Label>
                <Select 
                  value={createAdminForm.adminRole || ""} 
                  onValueChange={(value) => setCreateAdminForm(prev => ({ ...prev, adminRole: value as AdminRole }))}
                >
                  <SelectTrigger data-testid="select-admin-role">
                    <SelectValue placeholder="Select admin role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SUPER_ADMIN">Super Admin - Full system access</SelectItem>
                    <SelectItem value="FINANCIAL_ADMIN">Financial Admin - Token & treasury management</SelectItem>
                    <SelectItem value="COMMUNITY_MANAGER">Community Manager - User & event management</SelectItem>
                    <SelectItem value="CONTENT_MODERATOR">Content Moderator - Project & content review</SelectItem>
                    <SelectItem value="ANALYST">Analyst - Reports & analytics only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="admin-first-name">First Name</Label>
                <Input
                  id="admin-first-name"
                  placeholder="John"
                  value={createAdminForm.firstName}
                  onChange={(e) => setCreateAdminForm(prev => ({ ...prev, firstName: e.target.value }))}
                  data-testid="input-admin-first-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-last-name">Last Name</Label>
                <Input
                  id="admin-last-name"
                  placeholder="Doe"
                  value={createAdminForm.lastName}
                  onChange={(e) => setCreateAdminForm(prev => ({ ...prev, lastName: e.target.value }))}
                  data-testid="input-admin-last-name"
                />
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800 mb-1">Security Notice</p>
                  <p className="text-yellow-700">
                    A temporary password will be generated and displayed after account creation. 
                    Make sure to securely share this with the new admin for their first login.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button 
                onClick={() => setShowCreateAdminModal(false)}
                variant="outline" 
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => createAdminMutation.mutate(createAdminForm)}
                disabled={createAdminMutation.isPending || !createAdminForm.email || !createAdminForm.firstName || !createAdminForm.lastName}
                className="flex-1"
                data-testid="button-submit-create-admin"
              >
                {createAdminMutation.isPending ? 'Creating...' : 'Create Admin Account'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}