import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Wallet, Transaction } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wallet as WalletIcon, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  Heart,
  Trophy,
  Target,
  PieChart,
  BarChart3,
  Calendar,
  Coins,
  DollarSign,
  Award,
  Activity,
  Eye,
  Zap
} from "lucide-react";

export default function SUPDashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('30');

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

  const { data: wallet } = useQuery<Wallet>({
    queryKey: ["/api/wallet"],
    enabled: isAuthenticated,
    retry: false,
  });

  const { data: transactions } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
    enabled: isAuthenticated,
    retry: false,
  });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
            <WalletIcon className="w-4 h-4 text-white" />
          </div>
          <p className="text-gray-600">Loading your SUP dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate analytics
  const supBalance = parseFloat(wallet?.supBalance || '0');
  const ngnEscrow = parseFloat(wallet?.ngnEscrow || '0');
  const ngnEquivalent = supBalance * 10; // 1 SUP = ₦10

  // Filter transactions by period
  const periodDays = parseInt(selectedPeriod);
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - periodDays);
  
  const recentTransactions = transactions?.filter(t => 
    new Date(t.createdAt!) > cutoffDate
  ) || [];

  // Calculate transaction analytics
  const earnings = recentTransactions
    .filter(t => t.type === 'EARNED' || t.type === 'PRIZE' || t.type === 'BUY')
    .reduce((sum, t) => sum + parseFloat(t.amountSUP || '0'), 0);

  const spending = recentTransactions
    .filter(t => t.type === 'VOTE' || t.type === 'DONATION' || t.type === 'CASHOUT')
    .reduce((sum, t) => sum + parseFloat(t.amountSUP || '0'), 0);

  const netChange = earnings - spending;

  // Transaction categories
  const categoryStats = {
    rewards: recentTransactions.filter(t => t.type === 'EARNED' || t.type === 'PRIZE').length,
    funding: recentTransactions.filter(t => t.type === 'VOTE' || t.type === 'DONATION').length,
    purchases: recentTransactions.filter(t => t.type === 'BUY').length,
    withdrawals: recentTransactions.filter(t => t.type === 'CASHOUT').length,
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'EARNED':
      case 'PRIZE': return <Award className="w-4 h-4" />;
      case 'VOTE':
      case 'DONATION': return <Heart className="w-4 h-4" />;
      case 'BUY': return <ArrowUpRight className="w-4 h-4" />;
      case 'CASHOUT': return <ArrowDownLeft className="w-4 h-4" />;
      case 'ENGAGE': return <Activity className="w-4 h-4" />;
      case 'ENTRY': return <Trophy className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'EARNED':
      case 'PRIZE': return 'text-green-600 bg-green-100';
      case 'VOTE':
      case 'DONATION': return 'text-blue-600 bg-blue-100';
      case 'BUY': return 'text-purple-600 bg-purple-100';
      case 'CASHOUT': return 'text-orange-600 bg-orange-100';
      case 'ENGAGE': return 'text-indigo-600 bg-indigo-100';
      case 'ENTRY': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTransactionDescription = (type: string) => {
    switch (type) {
      case 'EARNED': return 'Task Reward';
      case 'PRIZE': return 'Prize Won';
      case 'VOTE': return 'Project Vote';
      case 'DONATION': return 'Project Donation';
      case 'BUY': return 'SUP Purchase';
      case 'CASHOUT': return 'Cash Out';
      case 'ENGAGE': return 'Engagement Reward';
      case 'ENTRY': return 'Prize Entry';
      case 'TRANSFER': return 'Transfer';
      case 'FEE': return 'Transaction Fee';
      default: return type || 'Transaction';
    }
  };

  const getTransactionSign = (type: string) => {
    switch (type) {
      case 'EARNED':
      case 'PRIZE':
      case 'BUY':
      case 'ENGAGE':
        return '+';
      case 'VOTE':
      case 'DONATION':
      case 'CASHOUT':
      case 'ENTRY':
      case 'FEE':
        return '-';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SUP Balance Dashboard</h1>
          <p className="text-gray-600">Comprehensive overview of your Step Up Naija tokens</p>
        </div>

        {/* Period Selector */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Showing data for:</span>
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-green-500"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 3 months</option>
              <option value="365">Last year</option>
            </select>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Live Data
          </Badge>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Current Balance */}
          <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Current SUP Balance</p>
                  <p className="text-3xl font-bold" data-testid="text-sup-balance">
                    {supBalance.toLocaleString()}
                  </p>
                  <p className="text-green-100 text-sm mt-1">
                    ≈ ₦{ngnEquivalent.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <WalletIcon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Period Earnings */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Earned ({selectedPeriod}d)</p>
                  <p className="text-2xl font-bold text-green-600">
                    +{earnings.toLocaleString()}
                  </p>
                  <p className="text-gray-500 text-sm">SUP tokens</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Period Spending */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Spent ({selectedPeriod}d)</p>
                  <p className="text-2xl font-bold text-blue-600">
                    -{spending.toLocaleString()}
                  </p>
                  <p className="text-gray-500 text-sm">SUP tokens</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Net Change */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Net Change ({selectedPeriod}d)</p>
                  <p className={`text-2xl font-bold ${netChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {netChange >= 0 ? '+' : ''}{netChange.toLocaleString()}
                  </p>
                  <p className="text-gray-500 text-sm">SUP tokens</p>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${netChange >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                  {netChange >= 0 ? (
                    <TrendingUp className={`w-5 h-5 ${netChange >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                  ) : (
                    <TrendingDown className={`w-5 h-5 ${netChange >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Activity Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PieChart className="w-5 h-5" />
                    <span>Activity Breakdown</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Rewards Earned</span>
                      </div>
                      <span className="font-semibold">{categoryStats.rewards}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Heart className="w-4 h-4 text-blue-600" />
                        <span className="text-sm">Projects Funded</span>
                      </div>
                      <span className="font-semibold">{categoryStats.funding}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <ArrowUpRight className="w-4 h-4 text-purple-600" />
                        <span className="text-sm">Token Purchases</span>
                      </div>
                      <span className="font-semibold">{categoryStats.purchases}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <ArrowDownLeft className="w-4 h-4 text-orange-600" />
                        <span className="text-sm">Withdrawals</span>
                      </div>
                      <span className="font-semibold">{categoryStats.withdrawals}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Balance History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5" />
                    <span>Balance Trend</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-32 flex items-end justify-between space-x-1">
                    {[...Array(30)].map((_, i) => (
                      <div
                        key={i}
                        className="bg-green-200 rounded-t"
                        style={{
                          height: `${Math.random() * 80 + 20}%`,
                          width: '3%'
                        }}
                      />
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                      Balance growth over the last {selectedPeriod} days
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Button className="h-16 flex-col space-y-2" variant="outline">
                    <ArrowUpRight className="w-5 h-5" />
                    <span>Buy SUP</span>
                  </Button>
                  <Button className="h-16 flex-col space-y-2" variant="outline">
                    <ArrowDownLeft className="w-5 h-5" />
                    <span>Cash Out</span>
                  </Button>
                  <Button className="h-16 flex-col space-y-2" variant="outline">
                    <Heart className="w-5 h-5" />
                    <span>Fund Project</span>
                  </Button>
                  <Button className="h-16 flex-col space-y-2" variant="outline">
                    <Eye className="w-5 h-5" />
                    <span>View All</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Earning Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Task Completion</span>
                      <span className="font-semibold text-green-600">65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span>Quiz Participation</span>
                      <span className="font-semibold text-blue-600">25%</span>
                    </div>
                    <Progress value={25} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span>Referral Bonuses</span>
                      <span className="font-semibold text-purple-600">10%</span>
                    </div>
                    <Progress value={10} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Spending Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Project Funding</span>
                      <span className="font-semibold text-blue-600">80%</span>
                    </div>
                    <Progress value={80} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span>Prize Entries</span>
                      <span className="font-semibold text-green-600">15%</span>
                    </div>
                    <Progress value={15} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span>Withdrawals</span>
                      <span className="font-semibold text-orange-600">5%</span>
                    </div>
                    <Progress value={5} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Recent Transactions</span>
                  <Badge variant="secondary">{recentTransactions.length} in {selectedPeriod} days</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentTransactions.slice(0, 10).map((transaction, index) => (
                    <div key={transaction.id || index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getTransactionColor(transaction.type || 'UNKNOWN')}`}>
                          {getTransactionIcon(transaction.type || 'UNKNOWN')}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{getTransactionDescription(transaction.type || 'UNKNOWN')}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(transaction.createdAt!).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${getTransactionSign(transaction.type || '') === '+' ? 'text-green-600' : 'text-red-600'}`}>
                          {getTransactionSign(transaction.type || '')}{parseFloat(transaction.amountSUP || '0').toLocaleString()} SUP
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-blue-900">
                    <Target className="w-5 h-5" />
                    <span>Your Goals</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-blue-800">Monthly Funding Goal</span>
                      <span className="text-sm text-blue-600 font-semibold">500 SUP</span>
                    </div>
                    <Progress value={Math.min((spending / 500) * 100, 100)} className="h-2" />
                    <p className="text-xs text-blue-700 mt-1">
                      {spending.toLocaleString()} of 500 SUP funded this month
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-green-900">
                    <Trophy className="w-5 h-5" />
                    <span>Achievements</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-800">Active Contributor</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-green-800">Project Supporter</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Coins className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm text-green-800">Token Earner</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">🎯 Maximize Your Impact</h4>
                    <p className="text-sm text-blue-800">
                      You've been consistently funding projects! Consider participating in more civic tasks to earn additional SUP tokens.
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">💰 Smart Saving</h4>
                    <p className="text-sm text-green-800">
                      Your current balance is healthy. Consider setting aside 20% for future high-impact projects.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
    </div>
  );
}