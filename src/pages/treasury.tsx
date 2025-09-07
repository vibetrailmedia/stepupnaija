import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// Navigation provided by App.tsx - removed duplicate import
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { hasPermission } from "@/utils/rolePermissions";
import { 
  Wallet, 
  TrendingUp, 
  AlertTriangle, 
  Shield, 
  DollarSign, 
  Users,
  Activity,
  Lock,
  Eye,
  BarChart3
} from "lucide-react";

interface TreasuryOverview {
  totalPoolSUP: string;
  totalEscrowNGN: string;
  weeklyInflow: string;
  weeklyOutflow: string;
  reserveRatio: number;
  activeUsers: number;
  pendingWithdrawals: number;
  lastAuditDate: string;
}

interface SecurityAlert {
  id: string;
  type: 'LARGE_WITHDRAWAL' | 'UNUSUAL_ACTIVITY' | 'LOW_RESERVES' | 'RATE_LIMIT_HIT';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  resolved: boolean;
}

export default function Treasury() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [transferAmount, setTransferAmount] = useState("");
  const [transferReason, setTransferReason] = useState("");

  // Fetch treasury overview
  const { data: overview, isLoading: overviewLoading } = useQuery<TreasuryOverview>({
    queryKey: ['/api/admin/treasury/overview'],
  });

  // Fetch security alerts
  const { data: alerts = [], isLoading: alertsLoading } = useQuery<SecurityAlert[]>({
    queryKey: ['/api/admin/treasury/alerts'],
  });

  // Emergency fund freeze mutation
  const freezeFundsMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/admin/treasury/emergency-freeze', {});
    },
    onSuccess: () => {
      toast({
        title: "Emergency Freeze Activated",
        description: "All fund movements have been temporarily suspended.",
        variant: "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/treasury'] });
    },
  });

  // Fund transfer mutation
  const transferMutation = useMutation({
    mutationFn: async (data: { amount: string; reason: string; type: 'RESERVE' | 'EMERGENCY' }) => {
      await apiRequest('POST', '/api/admin/treasury/transfer', data);
    },
    onSuccess: () => {
      toast({
        title: "Fund Transfer Completed",
        description: "Treasury operation completed successfully.",
      });
      setTransferAmount("");
      setTransferReason("");
      queryClient.invalidateQueries({ queryKey: ['/api/admin/treasury'] });
    },
  });

  // Resolve alert mutation
  const resolveAlertMutation = useMutation({
    mutationFn: async (alertId: string) => {
      await apiRequest('POST', `/api/admin/treasury/alerts/${alertId}/resolve`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/treasury/alerts'] });
    },
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(parseFloat(amount));
  };

  const formatSUP = (amount: string) => {
    return `${parseFloat(amount).toLocaleString()} SUP`;
  };

  if (overviewLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30">
        {/* Navigation provided by App.tsx - removed duplicate Navigation component */}
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading treasury dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30 page-transition" data-testid="page-treasury">
      {/* Navigation provided by App.tsx - removed duplicate Navigation component */}
      
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Header - Hero Style */}
        <div className="text-center space-y-6 py-8 lg:py-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight" data-testid="heading-treasury">
            💰 Community <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Treasury</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Transparent financial oversight of community funds and operations across Nigeria's democratic transformation
          </p>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/admin/treasury'] })}
              data-testid="button-refresh-treasury"
            >
              <Activity className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            
            {/* Emergency Freeze - Only visible to SUPER_ADMIN users with EMERGENCY_CONTROLS permission */}
            {hasPermission(user?.role, 'EMERGENCY_CONTROLS') && (
              <Button
                variant="destructive"
                onClick={() => freezeFundsMutation.mutate()}
                disabled={freezeFundsMutation.isPending}
                data-testid="button-emergency-freeze"
              >
                <Lock className="w-4 h-4 mr-2" />
                Emergency Freeze
              </Button>
            )}
          </div>
        </div>

        {/* Security Alerts */}
        {alerts.filter(a => !a.resolved).length > 0 && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>{alerts.filter(a => !a.resolved).length} active security alerts</strong> require attention.
            </AlertDescription>
          </Alert>
        )}

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card data-testid="card-total-pool" className="bg-white/70 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total SUP Pool</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-pool">
                {overview ? formatSUP(overview.totalPoolSUP) : "Loading..."}
              </div>
              <p className="text-xs text-muted-foreground">Available for distribution</p>
            </CardContent>
          </Card>

          <Card data-testid="card-escrow-ngn">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">NGN Escrow</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-escrow-ngn">
                {overview ? formatCurrency(overview.totalEscrowNGN) : "Loading..."}
              </div>
              <p className="text-xs text-muted-foreground">Held for withdrawals</p>
            </CardContent>
          </Card>

          <Card data-testid="card-reserve-ratio">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reserve Ratio</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-reserve-ratio">
                {overview ? `${overview.reserveRatio}%` : "Loading..."}
              </div>
              <p className="text-xs text-muted-foreground">
                {overview && overview.reserveRatio < 20 ? "⚠️ Below minimum" : "✅ Healthy"}
              </p>
            </CardContent>
          </Card>

          <Card data-testid="card-active-users">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-active-users">
                {overview ? overview.activeUsers.toLocaleString() : "Loading..."}
              </div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="operations" className="space-y-6">
          <TabsList>
            <TabsTrigger value="operations" data-testid="tab-operations">Operations</TabsTrigger>
            <TabsTrigger value="alerts" data-testid="tab-alerts">
              Security Alerts
              {alerts.filter(a => !a.resolved).length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {alerts.filter(a => !a.resolved).length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="transparency" data-testid="tab-transparency">Transparency</TabsTrigger>
          </TabsList>

          <TabsContent value="operations" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Fund Transfer Controls */}
              <Card data-testid="card-fund-transfer">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Fund Operations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="transfer-amount">Transfer Amount (NGN)</Label>
                    <Input
                      id="transfer-amount"
                      type="number"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      placeholder="Enter amount"
                      data-testid="input-transfer-amount"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="transfer-reason">Reason</Label>
                    <Input
                      id="transfer-reason"
                      value={transferReason}
                      onChange={(e) => setTransferReason(e.target.value)}
                      placeholder="Operational necessity, emergency, etc."
                      data-testid="input-transfer-reason"
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => transferMutation.mutate({ 
                        amount: transferAmount, 
                        reason: transferReason, 
                        type: 'RESERVE' 
                      })}
                      disabled={!transferAmount || !transferReason || transferMutation.isPending}
                      className="flex-1"
                      data-testid="button-transfer-reserve"
                    >
                      Move to Reserve
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => transferMutation.mutate({ 
                        amount: transferAmount, 
                        reason: transferReason, 
                        type: 'EMERGENCY' 
                      })}
                      disabled={!transferAmount || !transferReason || transferMutation.isPending}
                      className="flex-1"
                      data-testid="button-transfer-emergency"
                    >
                      Emergency Fund
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Flow Summary */}
              <Card data-testid="card-weekly-flow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Weekly Flow
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Inflow (SUP purchases)</span>
                    <span className="font-semibold text-green-600" data-testid="text-weekly-inflow">
                      {overview ? formatCurrency(overview.weeklyInflow) : "Loading..."}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Outflow (Withdrawals)</span>
                    <span className="font-semibold text-red-600" data-testid="text-weekly-outflow">
                      {overview ? formatCurrency(overview.weeklyOutflow) : "Loading..."}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm font-medium">Net Flow</span>
                    <span className={`font-semibold ${
                      overview && (parseFloat(overview.weeklyInflow) - parseFloat(overview.weeklyOutflow)) >= 0 
                        ? 'text-green-600' : 'text-red-600'
                    }`} data-testid="text-net-flow">
                      {overview ? formatCurrency(
                        (parseFloat(overview.weeklyInflow) - parseFloat(overview.weeklyOutflow)).toString()
                      ) : "Loading..."}
                    </span>
                  </div>
                  
                  <div className="mt-4">
                    <div className="text-xs text-gray-500 mb-1">
                      Pending Withdrawals: {overview ? overview.pendingWithdrawals : 0}
                    </div>
                    <div className="text-xs text-gray-500">
                      Last Audit: {overview ? new Date(overview.lastAuditDate).toLocaleDateString() : "N/A"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            {alertsLoading ? (
              <div className="text-center py-8">Loading security alerts...</div>
            ) : alerts.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">All Clear</h3>
                  <p className="text-gray-600">No security alerts detected</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <Card key={alert.id} className={`border-l-4 ${
                    alert.resolved ? 'border-l-gray-300 opacity-60' : `border-l-${getSeverityColor(alert.severity).replace('bg-', '')}`
                  }`} data-testid={`alert-${alert.id}`}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className={getSeverityColor(alert.severity)}>
                              {alert.severity.toUpperCase()}
                            </Badge>
                            <Badge variant="outline">
                              {alert.type.replace(/_/g, ' ')}
                            </Badge>
                            {alert.resolved && (
                              <Badge variant="secondary">RESOLVED</Badge>
                            )}
                          </div>
                          
                          <p className="text-gray-900 mb-1">{alert.message}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(alert.timestamp).toLocaleString()}
                          </p>
                        </div>
                        
                        {!alert.resolved && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => resolveAlertMutation.mutate(alert.id)}
                            disabled={resolveAlertMutation.isPending}
                            data-testid={`button-resolve-${alert.id}`}
                          >
                            Resolve
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="transparency" className="space-y-6">
            <Card data-testid="card-transparency">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  Public Transparency
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">✅ Treasury Transparency Active</h4>
                  <p className="text-sm text-green-700">
                    Key fund metrics are publicly visible on the transparency page. 
                    All draw operations use cryptographically secure random number generation.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="space-y-2">
                    <h5 className="font-medium text-gray-900">Public Metrics</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Total SUP tokens in circulation</li>
                      <li>• Prize distribution history</li>
                      <li>• Community project funding</li>
                      <li>• Draw winner verification</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h5 className="font-medium text-gray-900">Security Measures</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Multi-signature treasury controls</li>
                      <li>• Automated fraud detection</li>
                      <li>• Real-time audit logging</li>
                      <li>• Reserve ratio monitoring</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t">
                  <Button variant="outline" className="w-full" data-testid="button-view-public-transparency">
                    <Eye className="w-4 h-4 mr-2" />
                    View Public Transparency Page
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}