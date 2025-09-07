import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { randomBytes } from 'crypto';

export interface TwoFactorSetup {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

export interface TwoFactorVerification {
  isValid: boolean;
  usedBackupCode?: boolean;
}

/**
 * Generate a new 2FA secret and QR code for user setup
 */
export function generateTwoFactorSecret(userEmail: string): Promise<TwoFactorSetup> {
  return new Promise((resolve, reject) => {
    try {
      // Generate secret
      const secret = speakeasy.generateSecret({
        name: `Step Up Naija (${userEmail})`,
        issuer: 'Step Up Naija',
        length: 32,
      });

      // Generate backup codes (8 codes)
      const backupCodes = Array.from({ length: 8 }, () => 
        randomBytes(4).toString('hex').toUpperCase()
      );

      // Generate QR code
      QRCode.toDataURL(secret.otpauth_url!, (err, qrCodeUrl) => {
        if (err) {
          reject(err);
          return;
        }

        resolve({
          secret: secret.base32,
          qrCodeUrl,
          backupCodes,
        });
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Verify a 2FA token (TOTP or backup code)
 */
export function verifyTwoFactorToken(
  token: string,
  secret: string,
  backupCodes: string[]
): TwoFactorVerification {
  // First, try TOTP verification
  const totpValid = speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 2, // Allow 2 time steps (60 seconds) of drift
  });

  if (totpValid) {
    return { isValid: true };
  }

  // If TOTP fails, check backup codes
  const normalizedToken = token.toUpperCase().trim();
  const isBackupCodeValid = backupCodes.includes(normalizedToken);

  if (isBackupCodeValid) {
    return { 
      isValid: true, 
      usedBackupCode: true 
    };
  }

  return { isValid: false };
}

/**
 * Remove a used backup code from the list
 */
export function removeUsedBackupCode(backupCodes: string[], usedCode: string): string[] {
  const normalizedUsedCode = usedCode.toUpperCase().trim();
  return backupCodes.filter(code => code !== normalizedUsedCode);
}

/**
 * Generate new backup codes (for when user runs out)
 */
export function generateNewBackupCodes(): string[] {
  return Array.from({ length: 8 }, () => 
    randomBytes(4).toString('hex').toUpperCase()
  );
}

/**
 * Get current TOTP token (for testing purposes)
 */
export function getCurrentTOTP(secret: string): string {
  return speakeasy.totp({
    secret,
    encoding: 'base32',
  });
}