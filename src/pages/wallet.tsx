import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import type { Wallet, Transaction } from "@shared/schema";
// Navigation provided by App.tsx - removed duplicate import
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wallet as WalletIcon, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard,
  Banknote,
  Loader2,
  Info
} from "lucide-react";

export default function Wallet() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const queryClient = useQueryClient();
  const [buyAmount, setBuyAmount] = useState('1000');
  const [cashoutAmount, setCashoutAmount] = useState('500');

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

  const { data: wallet, isLoading: walletLoading } = useQuery<Wallet>({
    queryKey: ["/api/wallet"],
    enabled: isAuthenticated,
    retry: false,
  });


  const { data: transactions, isLoading: transactionsLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
    enabled: isAuthenticated,
    retry: false,
  });

  const buyMutation = useMutation({
    mutationFn: async (amount: number) => {
      await apiRequest('POST', '/api/wallet/buy', { amount });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wallet'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      toast({
        title: "Success",
        description: "SUP tokens purchased successfully!",
      });
      setBuyAmount('1000');
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
        title: "Error",
        description: error.message || "Failed to purchase SUP tokens",
        variant: "destructive",
      });
    },
  });

  const cashoutMutation = useMutation({
    mutationFn: async (amount: number) => {
      await apiRequest('POST', '/api/wallet/cashout', { amount });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wallet'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      toast({
        title: "Success",
        description: "Cashout request processed successfully!",
      });
      setCashoutAmount('500');
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
        title: "Error",
        description: error.message || "Failed to process cashout",
        variant: "destructive",
      });
    },
  });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
            <WalletIcon className="w-4 h-4 text-white" />
          </div>
          <p className="text-gray-600">Loading your wallet...</p>
        </div>
      </div>
    );
  }

  const supBalance = parseFloat(wallet?.supBalance || '0');
  const ngnEquivalent = Math.round(supBalance * 10);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'BUY':
        return <ArrowDownLeft className="w-4 h-4 text-green-600" />;
      case 'CASHOUT':
        return <ArrowUpRight className="w-4 h-4 text-red-600" />;
      case 'ENGAGE':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'ENTRY':
        return <ArrowUpRight className="w-4 h-4 text-yellow-600" />;
      case 'VOTE':
        return <ArrowUpRight className="w-4 h-4 text-blue-600" />;
      default:
        return <WalletIcon className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTransactionDescription = (transaction: any) => {
    switch (transaction.type) {
      case 'BUY':
        return 'SUP Purchase';
      case 'CASHOUT':
        return 'Cash Out';
      case 'ENGAGE':
        return 'Task Completed';
      case 'ENTRY':
        return 'Draw Entry';
      case 'VOTE':
        return 'Project Vote';
      default:
        return transaction.type;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation provided by App.tsx - removed duplicate Navigation component */}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Wallet</h1>
          <p className="text-gray-600">Manage your SUP tokens and transaction history</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Wallet Overview */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <WalletIcon className="w-5 h-5 text-primary-600" />
                  <span>Wallet Balance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2" data-testid="text-wallet-balance">
                    {supBalance.toLocaleString()} SUP
                  </div>
                  <div className="text-lg text-gray-600 mb-6" data-testid="text-ngn-value">
                    ≈ ₦{ngnEquivalent.toLocaleString()} NGN
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Exchange Rate</span>
                      <span className="font-medium">1 SUP = ₦10</span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    <Info className="w-4 h-4 inline mr-1" />
                    Minimum cashout: 100 SUP
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Earned</span>
                    <span className="font-semibold text-green-600">
                      +{transactions?.filter((t: any) => ['ENGAGE', 'PRIZE'].includes(t.type))
                        .reduce((sum: number, t: any) => sum + parseFloat(t.amountSUP || '0'), 0)
                        .toLocaleString() || '0'} SUP
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Spent</span>
                    <span className="font-semibold text-red-600">
                      -{transactions?.filter((t: any) => ['ENTRY', 'VOTE', 'CASHOUT'].includes(t.type))
                        .reduce((sum: number, t: any) => sum + parseFloat(t.amountSUP || '0'), 0)
                        .toLocaleString() || '0'} SUP
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Purchased</span>
                    <span className="font-semibold text-blue-600">
                      +{transactions?.filter((t: any) => t.type === 'BUY')
                        .reduce((sum: number, t: any) => sum + parseFloat(t.amountSUP || '0'), 0)
                        .toLocaleString() || '0'} SUP
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transactions & Actions */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="transactions" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="transactions">History</TabsTrigger>
                <TabsTrigger value="buy">Buy SUP</TabsTrigger>
                <TabsTrigger value="cashout">Cash Out</TabsTrigger>
              </TabsList>
              
              <TabsContent value="transactions" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {transactionsLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div key={i} className="flex items-center space-x-3 p-3 animate-pulse">
                            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                            <div className="flex-1">
                              <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                              <div className="h-3 bg-gray-200 rounded w-24"></div>
                            </div>
                            <div className="text-right">
                              <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                              <div className="h-3 bg-gray-200 rounded w-12"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : transactions && transactions.length > 0 ? (
                      <div className="space-y-4">
                        {transactions.map((transaction: any) => (
                          <div 
                            key={transaction.id} 
                            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                            data-testid={`transaction-${transaction.id}`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                {getTransactionIcon(transaction.type)}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">
                                  {getTransactionDescription(transaction)}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {new Date(transaction.createdAt).toLocaleDateString()} at{' '}
                                  {new Date(transaction.createdAt).toLocaleTimeString()}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`font-semibold ${
                                ['ENGAGE', 'BUY', 'PRIZE'].includes(transaction.type) ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {['ENGAGE', 'BUY', 'PRIZE'].includes(transaction.type) ? '+' : '-'}
                                {parseFloat(transaction.amountSUP || '0').toLocaleString()} SUP
                              </div>
                              {transaction.amountNGN && parseFloat(transaction.amountNGN) > 0 && (
                                <div className="text-sm text-gray-500">
                                  ₦{parseFloat(transaction.amountNGN).toLocaleString()}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <WalletIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
                        <p className="text-gray-500">Start engaging with civic tasks to earn SUP tokens!</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="buy" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CreditCard className="w-5 h-5" />
                      <span>Buy SUP Tokens</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="buyAmount">Amount (NGN)</Label>
                        <Input
                          id="buyAmount"
                          type="number"
                          value={buyAmount}
                          onChange={(e) => setBuyAmount(e.target.value)}
                          placeholder="Enter amount in NGN"
                          min="100"
                          step="100"
                          className="mt-1"
                          data-testid="input-buy-amount"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          You'll receive {(parseFloat(buyAmount || '0') / 10).toLocaleString()} SUP tokens
                        </p>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-2">Payment Method</h4>
                        <div className="flex items-center space-x-2 text-blue-800">
                          <CreditCard className="w-4 h-4" />
                          <span className="text-sm">Paystack - Secure Nigerian payment processing</span>
                        </div>
                      </div>

                      <Button 
                        className="w-full bg-primary-600 hover:bg-primary-700"
                        onClick={() => buyMutation.mutate(parseFloat(buyAmount))}
                        disabled={buyMutation.isPending || !buyAmount || parseFloat(buyAmount) < 100}
                        data-testid="button-buy-confirm"
                      >
                        {buyMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Processing...
                          </>
                        ) : (
                          `Purchase ₦${parseInt(buyAmount || '0').toLocaleString()}`
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="cashout" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Banknote className="w-5 h-5" />
                      <span>Cash Out</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="cashoutAmount">Amount (SUP)</Label>
                        <Input
                          id="cashoutAmount"
                          type="number"
                          value={cashoutAmount}
                          onChange={(e) => setCashoutAmount(e.target.value)}
                          placeholder="Enter SUP amount"
                          min="100"
                          step="100"
                          max={supBalance}
                          className="mt-1"
                          data-testid="input-cashout-amount"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          You'll receive ₦{Math.round(parseFloat(cashoutAmount || '0') * 10).toLocaleString()}
                        </p>
                      </div>

                      <div className="bg-yellow-50 rounded-lg p-4">
                        <h4 className="font-medium text-yellow-900 mb-2">Important Notice</h4>
                        <ul className="text-sm text-yellow-800 space-y-1">
                          <li>• Minimum cashout: 100 SUP (₦20)</li>
                          <li>• Processing time: 1-3 business days</li>
                          <li>• KYC verification required for cashouts</li>
                        </ul>
                      </div>

                      <Button 
                        className="w-full bg-secondary-600 hover:bg-secondary-700"
                        onClick={() => cashoutMutation.mutate(parseFloat(cashoutAmount))}
                        disabled={
                          cashoutMutation.isPending || 
                          !cashoutAmount || 
                          parseFloat(cashoutAmount) < 100 || 
                          parseFloat(cashoutAmount) > supBalance
                        }
                        data-testid="button-cashout-confirm"
                      >
                        {cashoutMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Processing...
                          </>
                        ) : (
                          `Cash Out ${parseInt(cashoutAmount || '0').toLocaleString()} SUP`
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
