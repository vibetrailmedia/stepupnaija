import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { HelpCircle, Mail, Shield, AlertCircle, CheckCircle2, Eye, EyeOff, Phone, ArrowLeft, ArrowRight, Lock, User } from "lucide-react";
import { SMSVerificationModal } from '@/components/SMSVerificationModal';
import { GoogleSignInButton } from '@/components/GoogleSignInButton';

export default function SimpleAuthPage() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading, loginMutation, registerMutation } = useAuth();
  const { toast } = useToast();
  
  // Check URL parameters to determine initial auth mode and get return URL
  const getInitialAuthMode = (): 'signin' | 'signup' => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    return mode === 'signup' ? 'signup' : 'signin';
  };
  
  // Get return URL from query params
  const getReturnUrl = (): string => {
    const urlParams = new URLSearchParams(window.location.search);
    const returnUrl = urlParams.get('returnUrl') || '/dashboard';
    return returnUrl;
  };
  
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>(getInitialAuthMode());
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{
    isValid: boolean;
    feedback: string[];
  }>({ isValid: false, feedback: [] });
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationPhoneNumber, setVerificationPhoneNumber] = useState('');

  // Password strength validation (same as reset-password)
  useEffect(() => {
    if (authMode === 'signin' || password.length === 0) {
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
  }, [password, authMode]);

  // Enhanced validation for international numbers
  const validatePhoneNumber = (phone: string): boolean => {
    // Remove spaces and validate international format
    const cleaned = phone.replace(/\s/g, '');
    return /^\+\d{7,15}$/.test(cleaned) || /^\+?\d{10,15}$/.test(cleaned);
  };

  // Form validation for signup
  const validateSignupForm = (): string | null => {
    if (!firstName.trim() || !lastName.trim()) {
      return "First name and last name are required";
    }
    
    if (!phoneNumber.trim()) {
      return "Phone number is required for account security";
    }
    
    if (!validatePhoneNumber(phoneNumber)) {
      return "Please enter a valid international phone number (e.g., +2348012345678)";
    }
    
    if (!passwordStrength.isValid) {
      return "Password does not meet security requirements";
    }
    
    if (password !== confirmPassword) {
      return "Passwords do not match";
    }
    
    return null;
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const returnUrl = getReturnUrl();
      setLocation(returnUrl);
    }
  }, [isAuthenticated, isLoading, setLocation]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    if (authMode === 'signup') {
      const validationError = validateSignupForm();
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    setIsLoadingAction(true);

    try {
      if (authMode === 'signup') {
        // Register with SMS verification
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            firstName,
            lastName,
            phoneNumber,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          if (data.requiresVerification) {
            setVerificationPhoneNumber(phoneNumber);
            setShowVerificationModal(true);
            setSuccess(`Verification code sent to ${data.maskedPhone}`);
          } else {
            toast({
              title: "Account Created!",
              description: "Welcome to Step Up Naija!",
            });
            setLocation(getReturnUrl());
          }
        } else {
          setError(data.error || "Registration failed");
        }
      } else {
        // Sign in
        loginMutation.mutate({
          email,
          password,
        });
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleVerificationSuccess = (user: any) => {
    setShowVerificationModal(false);
    toast({
      title: "🎉 Welcome to Step Up Naija!",
      description: "Your account has been created and verified successfully.",
    });
    setLocation(getReturnUrl());
  };

  const handlePasswordRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/request-password-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: recoveryEmail }),
      });

      if (response.ok) {
        toast({
          title: "Reset Link Sent",
          description: "Check your email for password reset instructions.",
        });
        setShowRecoveryModal(false);
        setRecoveryEmail('');
      } else {
        const data = await response.json();
        toast({
          title: "Reset Failed",
          description: data.error || "Unable to send reset email.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Password recovery error:', error);
      toast({
        title: "Network Error",
        description: "Unable to send reset email. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Redirect to dashboard on successful authentication
  useEffect(() => {
    if (loginMutation.isSuccess || registerMutation.isSuccess) {
      setLocation(getReturnUrl());
    }
  }, [loginMutation.isSuccess, registerMutation.isSuccess, setLocation]);

  // Handle auth errors
  useEffect(() => {
    if (loginMutation.error) {
      setError(loginMutation.error.message || "Login failed");
    }
    if (registerMutation.error) {
      setError(registerMutation.error.message || "Registration failed");
    }
  }, [loginMutation.error, registerMutation.error]);

  // Force mobile layout for screens smaller than 1024px
  const [isMobile, setIsMobile] = useState(() => {
    return typeof window !== 'undefined' && window.innerWidth < 1024;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-white lg:bg-gradient-to-br lg:from-green-50 lg:to-blue-50">
      {/* Mobile Layout - Match desktop styling */}
      {isMobile ? (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
          {/* Simple mobile header */}
          <div className="p-4 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
            <button
              onClick={() => setLocation('/')}
              className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-2"
              data-testid="button-back-to-home"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </button>
          </div>

          <div className="p-6">
            <div className="max-w-md mx-auto">
              {/* Mobile Hero section - styled like desktop */}
              <div className="text-center mb-8 space-y-4">
                <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                  {authMode === 'signin' ? (
                    <>
                      Welcome Back to <br />
                      <span className="text-green-600">Step Up Naija</span>
                    </>
                  ) : (
                    <>
                      Join Nigeria's <br />
                      <span className="text-green-600">Civic Movement</span>
                    </>
                  )}
                </h1>
                <p className="text-gray-600 leading-relaxed">
                  {authMode === 'signin' 
                    ? 'Continue your civic engagement journey and connect with fellow Nigerians building democracy' 
                    : 'Join millions of Nigerians participating in transparent governance, community projects, and democratic leadership selection'
                  }
                </p>

                {authMode === 'signup' && (
                  <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-left">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-green-800 text-sm mb-1">Join the Movement</h3>
                        <p className="text-green-700 text-xs">
                          Connect with fellow Nigerians, participate in civic activities, vote on community projects, 
                          and help build transparent, accountable leadership.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Auth Card - styled like desktop */}
              <Card className="shadow-xl border-0 bg-white">
                <CardHeader className="text-center space-y-2 pb-4">
                  <CardTitle className="text-xl font-bold">
                    {authMode === 'signin' ? 'Sign In' : 'Create Your Account'}
                  </CardTitle>
                  <p className="text-gray-600 text-sm">
                    {authMode === 'signin' 
                      ? 'Access your civic engagement dashboard' 
                      : 'Connect with millions of Nigerians building democracy'
                    }
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-4">
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

                  {/* Google Sign-In Button */}
                  <GoogleSignInButton 
                    onSuccess={(user: any) => {
                      toast({
                        title: "Welcome to Step Up Naija!",
                        description: `Successfully signed ${authMode === 'signin' ? 'in' : 'up'} with Google.`,
                      });
                      setLocation(getReturnUrl());
                    }}
                    onError={(error: string) => {
                      setError(error);
                    }}
                  />

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-3 text-gray-500 font-medium">Or continue with email</span>
                    </div>
                  </div>

                  <form onSubmit={handleEmailAuth} className="space-y-4">
                    {/* Signup fields with labels - mobile version */}
                    {authMode === 'signup' && (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                            <User className="h-3 w-3" />
                            First Name
                          </label>
                          <Input
                            type="text"
                            placeholder="First name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            className="h-12 text-base"
                            data-testid="input-first-name"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                            <User className="h-3 w-3" />
                            Last Name
                          </label>
                          <Input
                            type="text"
                            placeholder="Last name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            className="h-12 text-base"
                            data-testid="input-last-name"
                          />
                        </div>
                      </div>
                    )}

                    {authMode === 'signup' && (
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          Phone Number
                        </label>
                        <Input
                          type="tel"
                          placeholder="e.g., +2348012345678"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          required
                          className="h-12 text-base"
                          data-testid="input-phone-number"
                        />
                        <p className="text-xs text-gray-500">Required for SMS verification</p>
                      </div>
                    )}

                    {/* Email Input with label */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        Email Address
                      </label>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-12 text-base"
                        data-testid="input-email"
                      />
                    </div>

                    {/* Password Input with label */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="h-12 text-base pr-10"
                          data-testid="input-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          data-testid="button-toggle-password"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>

                      {/* Password strength feedback for signup */}
                      {authMode === 'signup' && password.length > 0 && (
                        <div className="mt-1 space-y-1">
                          {passwordStrength.feedback.map((feedback, index) => (
                            <p key={index} className="text-xs text-red-600 flex items-center gap-1">
                              <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                              {feedback}
                            </p>
                          ))}
                          {passwordStrength.isValid && (
                            <p className="text-xs text-green-600 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Password meets all security requirements
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Confirm Password for signup with label */}
                    {authMode === 'signup' && (
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                          <Lock className="h-3 w-3" />
                          Confirm Password
                        </label>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="h-12 text-base pr-10"
                            data-testid="input-confirm-password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            data-testid="button-toggle-confirm-password"
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {confirmPassword && password !== confirmPassword && (
                          <p className="text-xs text-red-600">Passwords do not match</p>
                        )}
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isLoadingAction || loginMutation.isPending || registerMutation.isPending}
                      className="w-full h-12 text-base font-semibold bg-green-600 hover:bg-green-700"
                      data-testid="button-submit"
                    >
                      {isLoadingAction || loginMutation.isPending || registerMutation.isPending ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          {authMode === 'signin' ? 'Signing in...' : 'Creating account...'}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <ArrowRight className="h-4 w-4" />
                          🇳🇬 {authMode === 'signin' ? 'Sign In to Dashboard' : 'Join Step Up Naija'}
                        </div>
                      )}
                    </Button>
                  </form>

                  {/* Forgot password link - only for signin */}
                  {authMode === 'signin' && (
                    <div className="text-center pt-4">
                      <Dialog open={showRecoveryModal} onOpenChange={setShowRecoveryModal}>
                        <DialogTrigger asChild>
                          <button
                            type="button"
                            className="text-sm text-green-600 hover:text-green-700 font-medium"
                            data-testid="button-forgot-password"
                          >
                            <HelpCircle className="h-3 w-3 inline mr-1" />
                            Forgot your password?
                          </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <Shield className="w-5 h-5 text-green-600" />
                              Reset Password
                            </DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handlePasswordRecovery} className="space-y-4">
                            <div>
                              <Input
                                type="email"
                                placeholder="Enter your email address"
                                value={recoveryEmail}
                                onChange={(e) => setRecoveryEmail(e.target.value)}
                                required
                                data-testid="input-recovery-email"
                                className="h-12"
                              />
                            </div>
                            <Button type="submit" className="w-full" data-testid="button-send-reset">
                              Send Reset Link
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}

                  {/* Toggle auth mode */}
                  <div className="text-center pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                      className="text-sm text-green-600 hover:text-green-700 font-medium"
                      data-testid="button-toggle-auth-mode"
                    >
                      {authMode === 'signin' 
                        ? "Don't have an account? Sign up" 
                        : "Already have an account? Sign in"
                      }
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        /* Desktop Layout - Full experience */
        <div className="min-h-screen flex flex-col">
          <div className="p-6">
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              onClick={() => setLocation('/')}
              data-testid="button-back-to-home-desktop"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </div>
          
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Hero Section */}
              <div className="space-y-6 text-left">
                <div className="space-y-4">
                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                    {authMode === 'signin' ? (
                      <>
                        Welcome Back to <br />
                        <span className="text-green-600">Step Up Naija</span>
                      </>
                    ) : (
                      <>
                        Join Nigeria's <br />
                        <span className="text-green-600">Civic Movement</span>
                      </>
                    )}
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    {authMode === 'signin' 
                      ? "Continue your civic engagement journey and connect with fellow Nigerians building democracy."
                      : "Join millions of Nigerians participating in transparent governance, community projects, and democratic leadership selection."
                    }
                  </p>
                </div>
                
                {authMode === 'signup' && (
                  <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                    <div className="flex items-start gap-3">
                      <Shield className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-green-800 mb-2">Join the Movement</h3>
                        <p className="text-green-700 text-sm">
                          Connect with fellow Nigerians, participate in civic activities, vote on community projects, 
                          and help build transparent, accountable leadership across the nation.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Auth Form */}
              <div className="w-full">
                <Card className="shadow-xl border-0">
                  <CardHeader className="text-center space-y-2 pb-6">
                    <CardTitle className="text-2xl font-bold">
                      {authMode === 'signin' ? 'Sign In' : 'Create Your Account'}
                    </CardTitle>
                    <p className="text-gray-600">
                      {authMode === 'signin' 
                        ? 'Access your civic engagement dashboard' 
                        : 'Connect with millions of Nigerians building democracy'
                      }
                    </p>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {error && (
                      <Alert variant="destructive" data-testid="error-alert-desktop">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    {success && (
                      <Alert className="border-green-200 bg-green-50 text-green-800" data-testid="success-alert-desktop">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">{success}</AlertDescription>
                      </Alert>
                    )}
                    {/* Google Sign-In Button */}
                    <GoogleSignInButton 
                      onSuccess={(user: any) => {
                        toast({
                          title: "Welcome to Step Up Naija!",
                          description: `Successfully signed ${authMode === 'signin' ? 'in' : 'up'} with Google.`,
                        });
                        setLocation(getReturnUrl());
                      }}
                    />

                    {/* Divider */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-200" />
                      </div>
                      <div className="relative flex justify-center text-sm uppercase">
                        <span className="bg-white px-4 text-gray-500 font-medium">Or continue with email</span>
                      </div>
                    </div>
                    
                    <form onSubmit={handleEmailAuth} className="space-y-5">
                      {authMode === 'signup' && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                              <User className="h-4 w-4" />
                              First Name
                            </label>
                            <Input
                              type="text"
                              placeholder="Enter first name"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              required
                              className="h-12"
                              data-testid="input-first-name-desktop"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                              <User className="h-4 w-4" />
                              Last Name
                            </label>
                            <Input
                              type="text"
                              placeholder="Enter last name"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              required
                              className="h-12"
                              data-testid="input-last-name-desktop"
                            />
                          </div>
                        </div>
                      )}

                      {authMode === 'signup' && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            Phone Number
                          </label>
                          <Input
                            type="tel"
                            placeholder="e.g., +2348012345678 (International format)"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                            className="h-12"
                            data-testid="input-phone-number-desktop"
                          />
                          <p className="text-xs text-gray-500">
                            Required for SMS verification and account security
                          </p>
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email Address
                        </label>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="h-12"
                          data-testid="input-email-desktop"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          Password
                        </label>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="h-12 pr-10"
                            data-testid="input-password-desktop"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            data-testid="button-toggle-password-desktop"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        
                        {authMode === 'signup' && password.length > 0 && (
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
                                Password meets all security requirements
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {authMode === 'signup' && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            Confirm Password
                          </label>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm your password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              required
                              className="h-12 pr-10"
                              data-testid="input-confirm-password-desktop"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              data-testid="button-toggle-confirm-password-desktop"
                            >
                              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                          {confirmPassword && password !== confirmPassword && (
                            <p className="text-xs text-red-600">Passwords do not match</p>
                          )}
                        </div>
                      )}
                      
                      <Button
                        type="submit"
                        disabled={isLoadingAction || loginMutation.isPending || registerMutation.isPending}
                        className="w-full h-12 text-base font-semibold bg-green-600 hover:bg-green-700"
                        data-testid="button-submit-desktop"
                      >
                        {isLoadingAction || loginMutation.isPending || registerMutation.isPending ? (
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            {authMode === 'signin' ? 'Signing in...' : 'Creating account...'}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <ArrowRight className="h-4 w-4" />
                            🇳🇬 {authMode === 'signin' ? 'Sign In to Dashboard' : 'Join Step Up Naija'}
                          </div>
                        )}
                      </Button>
                    </form>
                    
                    {authMode === 'signin' && (
                      <div className="text-center">
                        <Dialog open={showRecoveryModal} onOpenChange={setShowRecoveryModal}>
                          <DialogTrigger asChild>
                            <button
                              type="button"
                              className="text-sm text-green-600 hover:text-green-700 font-medium"
                              data-testid="button-forgot-password-desktop"
                            >
                              <HelpCircle className="h-4 w-4 inline mr-1" />
                              Forgot your password?
                            </button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-green-600" />
                                Reset Password
                              </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handlePasswordRecovery} className="space-y-4">
                              <div>
                                <Input
                                  type="email"
                                  placeholder="Enter your email address"
                                  value={recoveryEmail}
                                  onChange={(e) => setRecoveryEmail(e.target.value)}
                                  required
                                  data-testid="input-recovery-email-desktop"
                                  className="h-12"
                                />
                              </div>
                              <Button type="submit" className="w-full" data-testid="button-send-reset-desktop">
                                Send Reset Link
                              </Button>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                    
                    <div className="text-center pt-4 border-t">
                      <button
                        type="button"
                        onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                        className="text-sm text-green-600 hover:text-green-700 font-medium"
                        data-testid="button-toggle-auth-mode-desktop"
                      >
                        {authMode === 'signin' 
                          ? "Don't have an account? Sign up" 
                          : "Already have an account? Sign in"
                        }
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SMS Verification Modal */}
      <SMSVerificationModal
        isOpen={showVerificationModal}
        phoneNumber={verificationPhoneNumber}
        onVerificationSuccess={handleVerificationSuccess}
        onClose={() => setShowVerificationModal(false)}
      />
    </div>
  );
}