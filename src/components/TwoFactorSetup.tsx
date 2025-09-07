import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Shield, Copy, Eye, EyeOff, Download, AlertTriangle, CheckCircle } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

export function TwoFactorSetup() {
  const [isSetupDialogOpen, setIsSetupDialogOpen] = useState(false);
  const [setupData, setSetupData] = useState<any>(null);
  const [verificationToken, setVerificationToken] = useState('');
  const [disableToken, setDisableToken] = useState('');
  const [disablePassword, setDisablePassword] = useState('');
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [regeneratePassword, setRegeneratePassword] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get 2FA status
  const { data: twoFactorStatus, isLoading } = useQuery({
    queryKey: ['/api/auth/2fa/status'],
  });

  // Setup 2FA mutation
  const setupMutation = useMutation({
    mutationFn: () => apiRequest('/api/auth/2fa/setup', { method: 'POST' }),
    onSuccess: (data) => {
      setSetupData(data);
      toast({
        title: "2FA Setup Initiated",
        description: "Scan the QR code with your authenticator app",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Setup Failed",
        description: error.message || "Failed to setup 2FA",
        variant: "destructive",
      });
    },
  });

  // Enable 2FA mutation
  const enableMutation = useMutation({
    mutationFn: (token: string) => apiRequest('/api/auth/2fa/enable', {
      method: 'POST',
      body: { token }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/2fa/status'] });
      setIsSetupDialogOpen(false);
      setSetupData(null);
      setVerificationToken('');
      toast({
        title: "2FA Enabled Successfully!",
        description: "Your account is now secured with two-factor authentication",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid verification token",
        variant: "destructive",
      });
    },
  });

  // Disable 2FA mutation
  const disableMutation = useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) => 
      apiRequest('/api/auth/2fa/disable', {
        method: 'POST',
        body: { token, password }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/2fa/status'] });
      setDisableToken('');
      setDisablePassword('');
      toast({
        title: "2FA Disabled",
        description: "Two-factor authentication has been disabled for your account",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Disable Failed",
        description: error.message || "Failed to disable 2FA",
        variant: "destructive",
      });
    },
  });

  // Regenerate backup codes mutation
  const regenerateBackupCodesMutation = useMutation({
    mutationFn: (password: string) => apiRequest('/api/auth/2fa/backup-codes/regenerate', {
      method: 'POST',
      body: { password }
    }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/2fa/status'] });
      setSetupData({ ...setupData, backupCodes: data.backupCodes });
      setRegeneratePassword('');
      toast({
        title: "New Backup Codes Generated",
        description: "Your old backup codes are now invalid",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate new backup codes",
        variant: "destructive",
      });
    },
  });

  const handleSetup = () => {
    setupMutation.mutate();
    setIsSetupDialogOpen(true);
  };

  const handleEnable = () => {
    if (!verificationToken.trim()) {
      toast({
        title: "Token Required",
        description: "Please enter the verification code from your authenticator app",
        variant: "destructive",
      });
      return;
    }
    enableMutation.mutate(verificationToken);
  };

  const handleDisable = () => {
    if (!disableToken.trim() || !disablePassword.trim()) {
      toast({
        title: "All Fields Required",
        description: "Please enter both your password and a verification code",
        variant: "destructive",
      });
      return;
    }
    disableMutation.mutate({ token: disableToken, password: disablePassword });
  };

  const handleRegenerateBackupCodes = () => {
    if (!regeneratePassword.trim()) {
      toast({
        title: "Password Required",
        description: "Please enter your password to regenerate backup codes",
        variant: "destructive",
      });
      return;
    }
    regenerateBackupCodesMutation.mutate(regeneratePassword);
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Copied to clipboard",
    });
  };

  const downloadBackupCodes = () => {
    if (!setupData?.backupCodes) return;
    
    const codesText = `Step Up Naija 2FA Backup Codes\nGenerated on: ${new Date().toLocaleDateString()}\n\n${setupData.backupCodes.join('\n')}\n\n⚠️ Keep these codes secure! Each can only be used once.`;
    const blob = new Blob([codesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stepup-naija-2fa-backup-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Backup Codes Downloaded",
      description: "Keep this file secure and accessible",
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 animate-spin" />
            <span>Loading 2FA status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isEnabled = twoFactorStatus?.enabled;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="w-5 h-5" />
          <span>Two-Factor Authentication</span>
          {isEnabled && <Badge variant="secondary" className="bg-green-100 text-green-700">Enabled</Badge>}
          {!isEnabled && <Badge variant="outline">Disabled</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Two-factor authentication adds an extra layer of security to your account by requiring both your password and a verification code from your mobile device.
        </p>

        {!isEnabled ? (
          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>
                Your account is not protected by 2FA. Enable it now for enhanced security.
              </AlertDescription>
            </Alert>
            
            <Dialog open={isSetupDialogOpen} onOpenChange={setIsSetupDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={handleSetup}
                  disabled={setupMutation.isPending}
                  data-testid="button-enable-2fa"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  {setupMutation.isPending ? 'Setting up...' : 'Enable 2FA'}
                </Button>
              </DialogTrigger>
              
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Set Up Two-Factor Authentication</DialogTitle>
                </DialogHeader>
                
                {setupData && (
                  <Tabs defaultValue="qr" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="qr">QR Code</TabsTrigger>
                      <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="qr" className="space-y-4">
                      <div className="text-center space-y-4">
                        <p className="text-sm text-gray-600">
                          Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                        </p>
                        <div className="flex justify-center">
                          <img 
                            src={setupData.qrCode} 
                            alt="2FA QR Code"
                            className="border rounded-lg p-2 bg-white"
                          />
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="manual" className="space-y-4">
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          If you can't scan the QR code, manually enter this secret key:
                        </p>
                        <div className="flex items-center space-x-2">
                          <Input value={setupData.secret} readOnly />
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => copyToClipboard(setupData.secret)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <div className="space-y-4 pt-4 border-t">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Enter verification code:</label>
                        <Input
                          value={verificationToken}
                          onChange={(e) => setVerificationToken(e.target.value)}
                          placeholder="000000"
                          maxLength={6}
                          data-testid="input-2fa-token"
                        />
                      </div>
                      
                      <Button 
                        onClick={handleEnable}
                        disabled={enableMutation.isPending || !verificationToken.trim()}
                        className="w-full"
                      >
                        {enableMutation.isPending ? 'Verifying...' : 'Verify & Enable 2FA'}
                      </Button>
                      
                      {setupData.backupCodes && (
                        <Alert>
                          <AlertTriangle className="w-4 h-4" />
                          <AlertDescription>
                            <div className="space-y-2">
                              <p className="font-semibold">Important: Save your backup codes!</p>
                              <p className="text-xs">
                                These codes can be used if you lose access to your authenticator app.
                              </p>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setShowBackupCodes(!showBackupCodes)}
                                >
                                  {showBackupCodes ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                  {showBackupCodes ? 'Hide' : 'Show'} Codes
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={downloadBackupCodes}
                                >
                                  <Download className="w-4 h-4 mr-1" />
                                  Download
                                </Button>
                              </div>
                              {showBackupCodes && (
                                <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded text-xs font-mono">
                                  {setupData.backupCodes.map((code: string, index: number) => (
                                    <div key={index}>{code}</div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </Tabs>
                )}
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="w-4 h-4" />
              <AlertDescription>
                2FA is active. Set up on {twoFactorStatus.setupAt ? new Date(twoFactorStatus.setupAt).toLocaleDateString() : 'Unknown date'}
                {twoFactorStatus.backupCodesCount > 0 && ` • ${twoFactorStatus.backupCodesCount} backup codes remaining`}
              </AlertDescription>
            </Alert>
            
            <div className="flex space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    Disable 2FA
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Disable Two-Factor Authentication</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Alert>
                      <AlertTriangle className="w-4 h-4" />
                      <AlertDescription>
                        Disabling 2FA will make your account less secure. You'll need both your password and a 2FA code to confirm.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Password:</label>
                      <Input
                        type="password"
                        value={disablePassword}
                        onChange={(e) => setDisablePassword(e.target.value)}
                        placeholder="Enter your password"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">2FA Code:</label>
                      <Input
                        value={disableToken}
                        onChange={(e) => setDisableToken(e.target.value)}
                        placeholder="000000"
                        maxLength={6}
                      />
                    </div>
                    
                    <Button 
                      variant="destructive"
                      onClick={handleDisable}
                      disabled={disableMutation.isPending}
                      className="w-full"
                    >
                      {disableMutation.isPending ? 'Disabling...' : 'Disable 2FA'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    New Backup Codes
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Generate New Backup Codes</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Alert>
                      <AlertTriangle className="w-4 h-4" />
                      <AlertDescription>
                        This will invalidate all existing backup codes. Make sure to save the new ones.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Password:</label>
                      <Input
                        type="password"
                        value={regeneratePassword}
                        onChange={(e) => setRegeneratePassword(e.target.value)}
                        placeholder="Enter your password"
                      />
                    </div>
                    
                    <Button 
                      onClick={handleRegenerateBackupCodes}
                      disabled={regenerateBackupCodesMutation.isPending}
                      className="w-full"
                    >
                      {regenerateBackupCodesMutation.isPending ? 'Generating...' : 'Generate New Codes'}
                    </Button>
                    
                    {setupData?.backupCodes && (
                      <div className="space-y-2">
                        <p className="text-sm font-semibold">Your new backup codes:</p>
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded text-xs font-mono">
                          {setupData.backupCodes.map((code: string, index: number) => (
                            <div key={index}>{code}</div>
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={downloadBackupCodes}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download Codes
                        </Button>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}