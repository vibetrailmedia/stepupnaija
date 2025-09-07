import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { X, Loader2, Info } from "lucide-react";

interface DrawEntryModalProps {
  round: any;
  wallet: any;
  userEntries: number;
  onClose: () => void;
}

export function DrawEntryModal({ round, wallet, userEntries, onClose }: DrawEntryModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const enterDrawMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', `/api/rounds/${round.id}/enter`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wallet'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/rounds', round.id, 'entries'] });
      toast({
        title: "Entry Successful!",
        description: "You've entered the Civic Rewards Draw. Good luck!",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to enter Civic Rewards Draw",
        variant: "destructive",
      });
    },
  });

  const supBalance = parseFloat(wallet?.supBalance || '0');
  const entryCost = 50;
  const canEnter = supBalance >= entryCost;

  const poolAmount = parseFloat(round?.poolSUP || '4851340');
  const poolNGN = Math.round(poolAmount / 5);
  
  const firstPrize = Math.round(poolNGN * 0.4);
  const secondPrize = Math.round(poolNGN * 0.2);
  const thirdPrize = Math.round(poolNGN * 0.1);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" data-testid="modal-draw-entry">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <span className="text-xl">🏆</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Civic Rewards Draw</h2>
              <p className="text-sm text-gray-600">Enter to win big!</p>
            </div>
          </div>
          <button 
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
            onClick={onClose}
            data-testid="button-close-draw-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Free Entry Available Banner */}
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-green-600 flex-shrink-0" />
            <div className="text-sm text-green-800">
              <span className="font-semibold">Free Entry Available!</span> Earn SUP tokens by completing civic tasks - no purchase required.
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Prize Pool</span>
              <span className="text-xl font-bold text-gray-900" data-testid="text-prize-pool">
                ₦{poolNGN.toLocaleString()}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="font-semibold text-yellow-600" data-testid="text-first-prize">₦{firstPrize.toLocaleString()}</div>
                  <div className="text-xs">1st Prize</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-600" data-testid="text-second-prize">₦{secondPrize.toLocaleString()}</div>
                  <div className="text-xs">2nd Prize</div>
                </div>
                <div>
                  <div className="font-semibold text-amber-600" data-testid="text-third-prize">₦{thirdPrize.toLocaleString()}</div>
                  <div className="text-xs">3rd Prize</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">Entry Cost</span>
              <Badge variant="outline" className="text-lg font-bold text-primary-600 border-primary-600">
                {entryCost} SUP
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">Your Balance</span>
              <span className="text-lg font-bold text-gray-900" data-testid="text-wallet-balance">
                {supBalance.toLocaleString()} SUP
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">Current Entries</span>
              <span className="text-lg font-bold text-secondary-600" data-testid="text-current-entries">
                {userEntries}
              </span>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <Button 
            className="w-full bg-primary-600 text-white font-semibold py-3 rounded-lg hover:bg-primary-700 transition-colors"
            onClick={() => enterDrawMutation.mutate()}
            disabled={enterDrawMutation.isPending || !canEnter}
            data-testid="button-enter-draw-confirm"
          >
            {enterDrawMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Entering Civic Rewards Draw...
              </>
            ) : (
              `Enter Civic Rewards Draw (${entryCost} SUP)`
            )}
          </Button>
          
          {!canEnter && (
            <div className="text-center">
              <span className="text-sm text-gray-500">Insufficient balance. </span>
              <button className="text-sm text-secondary-600 font-medium hover:text-secondary-700">
                Earn SUP for Free
              </button>
            </div>
          )}
        </div>
        
        <div className="mt-6 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-start space-x-2">
            <Info className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-gray-600">
              <p className="font-medium mb-1">Fair Draw Guarantee</p>
              <p>Our draws use cryptographic commit-reveal for provable fairness. All results are auditable on our transparency page.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
