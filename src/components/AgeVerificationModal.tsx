import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { X, AlertTriangle, Sun } from "lucide-react";

interface AgeVerificationModalProps {
  onVerified: () => void;
}

export function AgeVerificationModal({ onVerified }: AgeVerificationModalProps) {
  const [hasChecked, setHasChecked] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const verifyAgeMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/auth/verify-age', {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      toast({
        title: "Age Verified",
        description: "Welcome to Step Up Naija! You can now access all platform features.",
      });
      onVerified();
    },
    onError: (error) => {
      toast({
        title: "Verification Failed",
        description: error.message || "Failed to verify age",
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" data-testid="modal-age-verification">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Age Verification Required</h2>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="text-sm text-yellow-800">
              <p className="font-semibold mb-2">Legal Requirement</p>
              <p>You must be at least 18 years old to participate in Step Up Naija's Civic Rewards Draws and access platform features.</p>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="text-sm text-green-800">
              <div className="flex items-center gap-2 mb-2">
                <Sun className="w-4 h-4 text-green-700 font-bold" />
                <p className="font-semibold">Remember: Free Entry Available!</p>
              </div>
              <p>You can earn SUP tokens through civic tasks - no purchase required to participate.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 mb-6">
            <Checkbox 
              id="age-verify" 
              checked={hasChecked}
              onCheckedChange={(checked) => setHasChecked(checked as boolean)}
              data-testid="checkbox-age-verification"
            />
            <label htmlFor="age-verify" className="text-sm text-gray-700 cursor-pointer">
              <span className="font-semibold">I confirm that I am 18 years of age or older</span> and understand that this is required to participate in Civic Rewards Draws in compliance with Nigerian law.
            </label>
          </div>
        </div>
        
        <div className="space-y-3">
          <Button 
            className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-colors"
            onClick={() => verifyAgeMutation.mutate()}
            disabled={!hasChecked || verifyAgeMutation.isPending}
            data-testid="button-verify-age"
          >
            {verifyAgeMutation.isPending ? "Verifying..." : "Verify Age & Continue"}
          </Button>
          
          <Button 
            variant="outline"
            className="w-full border-gray-300 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={handleLogout}
            data-testid="button-age-verification-logout"
          >
            I am under 18 - Sign Out
          </Button>
        </div>
        
        <div className="mt-6 p-3 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-600">
            <p className="font-medium mb-1">Your Privacy</p>
            <p>We only collect age verification for legal compliance. Your specific age or birth date is not stored - only confirmation that you meet the minimum age requirement.</p>
          </div>
        </div>
      </div>
    </div>
  );
}