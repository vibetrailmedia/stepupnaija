import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface WalletCardProps {
  balance: string;
  ngnEquivalent: string;
  isLoading?: boolean;
}

export function WalletCard({ balance, ngnEquivalent, isLoading }: WalletCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [buyAmount, setBuyAmount] = useState('1000');

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
      setShowBuyModal(false);
    },
    onError: (error) => {
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
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to process cashout",
        variant: "destructive",
      });
    },
  });

  const handleBuy = () => {
    const amount = parseFloat(buyAmount);
    if (amount > 0) {
      buyMutation.mutate(amount);
    }
  };

  const handleCashout = () => {
    const currentBalance = parseFloat(balance);
    if (currentBalance >= 100) {
      cashoutMutation.mutate(Math.floor(currentBalance / 100) * 100); // Cash out in increments of 100 SUP
    } else {
      toast({
        title: "Error",
        description: "Minimum cashout amount is 100 SUP",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-24 mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-20 mb-4"></div>
            <div className="flex space-x-2">
              <div className="flex-1 h-8 bg-gray-200 rounded"></div>
              <div className="flex-1 h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-primary-600" />
            </div>
            <span className="text-sm text-gray-500">SUP Balance</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1" data-testid="text-sup-balance">
            {parseFloat(balance).toLocaleString()}
          </div>
          <div className="text-sm text-gray-500" data-testid="text-ngn-equivalent">
            ≈ ₦{parseInt(ngnEquivalent).toLocaleString()} NGN
          </div>
          <div className="flex space-x-2 mt-4">
            <Button 
              className="flex-1 bg-primary-600 text-white text-sm font-medium py-2 px-3 rounded-lg hover:bg-primary-700 transition-colors"
              onClick={() => setShowBuyModal(true)}
              disabled={buyMutation.isPending}
              data-testid="button-buy-sup"
            >
              {buyMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Buy SUP"
              )}
            </Button>
            <Button 
              className="flex-1 bg-gray-100 text-gray-700 text-sm font-medium py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors"
              onClick={handleCashout}
              disabled={cashoutMutation.isPending || parseFloat(balance) < 100}
              data-testid="button-cash-out"
            >
              {cashoutMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Cash Out"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Buy SUP Modal */}
      {showBuyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" data-testid="modal-buy-sup">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Buy SUP Tokens</h2>
              <button 
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setShowBuyModal(false)}
                data-testid="button-close-buy-modal"
              >
                ×
              </button>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (NGN)
              </label>
              <input
                type="number"
                value={buyAmount}
                onChange={(e) => setBuyAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter amount in NGN"
                min="100"
                step="100"
                data-testid="input-buy-amount"
              />
              <p className="text-sm text-gray-500 mt-1">
                You'll receive {(parseFloat(buyAmount) / 10).toLocaleString()} SUP tokens
              </p>
            </div>
            
            <div className="space-y-3">
              <Button 
                className="w-full bg-primary-600 text-white font-semibold py-3 rounded-lg hover:bg-primary-700 transition-colors"
                onClick={handleBuy}
                disabled={buyMutation.isPending || !buyAmount || parseFloat(buyAmount) < 100}
                data-testid="button-confirm-buy"
              >
                {buyMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Purchase ₦{parseInt(buyAmount).toLocaleString()}
              </Button>
              
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => setShowBuyModal(false)}
                data-testid="button-cancel-buy"
              >
                Cancel
              </Button>
            </div>
            
            <div className="mt-6 p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-600">
                <p className="font-medium mb-1">Powered by Paystack</p>
                <p>Secure payment processing. Your funds are protected.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
