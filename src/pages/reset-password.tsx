import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Shield, ArrowLeft } from "lucide-react";

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<{
    isValid: boolean;
    feedback: string[];
  }>({ isValid: false, feedback: [] });

  // Validate password strength
  useEffect(() => {
    if (password.length === 0) {
      setPasswordStrength({ isValid: false, feedback: [] });
      return;
    }

    const feedback: string[] = [];
    
    if (password.length < 8) feedback.push('At least 8 characters');
    if (!/[a-z]/.test(password)) feedback.push('Include lowercase letters');
    if (!/[A-Z]/.test(password)) feedback.push('Include uppercase letters');
    if (!/\d/.test(password)) feedback.push('Include numbers');
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      feedback.push('Include special characters');
    }

    setPasswordStrength({
      isValid: feedback.length === 0 && password.length >= 8,
      feedback
    });
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!token) {
      setError('Invalid reset link');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!passwordStrength.isValid) {
      setError('Please meet all password requirements');
      return;
    }

    setIsLoading(true);
    
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });
      
      if (res.ok) {
        setSuccess('Password reset successful! Redirecting to login...');
        setTimeout(() => {
          window.location.href = '/auth';
        }, 2000);
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Invalid Reset Link</h2>
            <p className="text-gray-600 mb-4">This password reset link is invalid or has expired.</p>
            <Button 
              onClick={() => window.location.href = '/auth'} 
              className="w-full"
              data-testid="button-back-to-login"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Reset Your Password</CardTitle>
            <p className="text-gray-600 mt-2">Enter your new password below</p>
          </CardHeader>
          
          <CardContent className="space-y-6 p-6">
            {error && (
              <Alert variant="destructive" data-testid="error-alert">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="border-green-200 bg-green-50 text-green-800" data-testid="success-alert">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <Input
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  data-testid="input-new-password"
                  className="h-12 text-base"
                />
                
                {password.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {passwordStrength.feedback.map((feedback, index) => (
                      <p key={index} className="text-xs text-red-600 flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                        {feedback}
                      </p>
                    ))}
                    {passwordStrength.isValid && (
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Password meets all requirements
                      </p>
                    )}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  data-testid="input-confirm-password"
                  className="h-12 text-base"
                />
                
                {confirmPassword.length > 0 && password !== confirmPassword && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                    Passwords do not match
                  </p>
                )}
              </div>
              
              <Button
                type="submit"
                className="w-full h-12 text-base bg-green-600 hover:bg-green-700"
                disabled={isLoading || !passwordStrength.isValid || password !== confirmPassword}
                data-testid="button-reset-password"
              >
                {isLoading ? 'Resetting Password...' : 'Reset Password'}
              </Button>
            </form>
            
            <div className="text-center pt-4 border-t border-gray-200">
              <Button 
                variant="ghost" 
                onClick={() => window.location.href = '/auth'}
                data-testid="button-back-to-login"
                className="text-sm"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}