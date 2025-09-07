import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Shield, Phone, Timer, RefreshCw } from 'lucide-react';

interface SMSVerificationModalProps {
  isOpen: boolean;
  phoneNumber: string;
  onVerificationSuccess: (user: any) => void;
  onClose: () => void;
}

export function SMSVerificationModal({ 
  isOpen, 
  phoneNumber, 
  onVerificationSuccess, 
  onClose 
}: SMSVerificationModalProps) {
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes countdown
  const { toast } = useToast();

  // Countdown timer
  useEffect(() => {
    if (!isOpen) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setVerificationCode('');
      setTimeLeft(600);
    }
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerify = async () => {
    if (!verificationCode.trim()) {
      toast({
        title: "Verification Required",
        description: "Please enter the 6-digit code sent to your phone.",
        variant: "destructive"
      });
      return;
    }

    if (verificationCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Verification code must be 6 digits long.",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);

    try {
      const response = await fetch('/api/verify-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phoneNumber,
          verificationCode: verificationCode.trim()
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "🎉 Account Verified!",
          description: "Your account has been created and verified successfully.",
          variant: "default"
        });
        onVerificationSuccess(data.user);
      } else {
        toast({
          title: "Verification Failed",
          description: data.error || "Invalid verification code. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: "Network Error",
        description: "Unable to verify code. Please check your connection.",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);

    try {
      const response = await fetch('/api/resend-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phoneNumber })
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Code Resent",
          description: "A new verification code has been sent to your phone.",
          variant: "default"
        });
        setVerificationCode('');
        setTimeLeft(600); // Reset timer
      } else {
        toast({
          title: "Resend Failed",
          description: data.error || "Failed to resend code. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Resend error:', error);
      toast({
        title: "Network Error",
        description: "Unable to resend code. Please check your connection.",
        variant: "destructive"
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            Verify Your Phone Number
          </DialogTitle>
          <DialogDescription>
            Complete your account verification by entering the 6-digit code sent to your phone.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Phone className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-sm text-gray-600">
              We've sent a 6-digit verification code to:
            </p>
            <p className="font-medium text-lg">{phoneNumber}</p>
          </div>

          <div className="space-y-3">
            <div>
              <label htmlFor="verification-code" className="block text-sm font-medium mb-1">
                Verification Code
              </label>
              <Input
                id="verification-code"
                type="text"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setVerificationCode(value);
                }}
                className="text-center text-lg tracking-widest"
                maxLength={6}
                data-testid="input-verification-code"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1 text-gray-600">
                <Timer className="w-4 h-4" />
                <span>Code expires in {formatTime(timeLeft)}</span>
              </div>
              {timeLeft > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResendCode}
                  disabled={isResending}
                  className="text-green-600 hover:text-green-700"
                  data-testid="button-resend-code"
                >
                  {isResending ? (
                    <div className="flex items-center gap-1">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      Sending...
                    </div>
                  ) : (
                    'Resend Code'
                  )}
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleVerify}
              disabled={isVerifying || verificationCode.length !== 6}
              className="w-full h-12 text-base font-semibold"
              data-testid="button-verify-code"
            >
              {isVerifying ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Verifying...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Verify & Create Account
                </div>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={onClose}
              className="w-full"
              data-testid="button-cancel-verification"
            >
              Cancel
            </Button>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-800">
            <p className="font-medium mb-1">📱 Didn't receive the code?</p>
            <ul className="space-y-1">
              <li>• Check your phone for SMS messages</li>
              <li>• Ensure you have good network coverage</li>
              <li>• Try resending the code after a few seconds</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}