import { z } from 'zod';

// Common weak passwords to reject
const COMMON_PASSWORDS = new Set([
  'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
  'admin', 'letmein', 'welcome', 'monkey', '1234567890', 'password1',
  'qwerty123', '123qwe', 'admin123', '000000', '111111', '123123',
  'password1234', 'iloveyou', 'princess', 'dragon', 'sunshine', 'master',
  'nigeria', 'lagos', 'abuja', 'naija', 'stepup', 'stepupnaija', 'civic',
  '1234', '12345', '567890', 'asdfgh', 'zxcvbn', 'nigeria123', 'lagos123'
]);

// Password strength validation schema
export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters long')
  .max(128, 'Password cannot exceed 128 characters')
  .refine((password) => {
    // Check for at least one lowercase letter
    return /[a-z]/.test(password);
  }, 'Password must contain at least one lowercase letter')
  .refine((password) => {
    // Check for at least one uppercase letter
    return /[A-Z]/.test(password);
  }, 'Password must contain at least one uppercase letter')
  .refine((password) => {
    // Check for at least one number
    return /\d/.test(password);
  }, 'Password must contain at least one number')
  .refine((password) => {
    // Check for at least one special character
    return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  }, 'Password must contain at least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)')
  .refine((password) => {
    // Check that it's not a common password
    return !COMMON_PASSWORDS.has(password.toLowerCase());
  }, 'This password is too common and easily guessed')
  .refine((password) => {
    // Check for no more than 3 consecutive identical characters
    return !/(.)\1{3,}/.test(password);
  }, 'Password cannot contain more than 3 consecutive identical characters')
  .refine((password) => {
    // Check for no simple sequential patterns
    const sequentialPatterns = [
      '123456', '654321', 'abcdef', 'fedcba', 'qwerty', 'asdfgh', 'zxcvbn'
    ];
    return !sequentialPatterns.some(pattern => 
      password.toLowerCase().includes(pattern)
    );
  }, 'Password cannot contain common sequential patterns');

// Password strength checker
export const checkPasswordStrength = (password: string): {
  isValid: boolean;
  score: number;
  feedback: string[];
  strength: 'weak' | 'fair' | 'good' | 'strong';
} => {
  const feedback: string[] = [];
  let score = 0;

  // Length scoring
  if (password.length >= 8) score += 10;
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;

  // Character variety scoring
  if (/[a-z]/.test(password)) score += 10;
  if (/[A-Z]/.test(password)) score += 10;
  if (/\d/.test(password)) score += 10;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 15;

  // Advanced patterns
  if (!/(.)\1{2,}/.test(password)) score += 10; // No repeated characters
  if (password.length > 0 && [...new Set(password)].length / password.length > 0.7) {
    score += 10; // Good character diversity
  }

  // Deductions for weak patterns
  if (COMMON_PASSWORDS.has(password.toLowerCase())) {
    score = Math.max(0, score - 30);
    feedback.push('Avoid common passwords');
  }

  // Generate feedback
  if (password.length < 8) feedback.push('Use at least 8 characters');
  if (!/[a-z]/.test(password)) feedback.push('Include lowercase letters');
  if (!/[A-Z]/.test(password)) feedback.push('Include uppercase letters');
  if (!/\d/.test(password)) feedback.push('Include numbers');
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    feedback.push('Include special characters');
  }

  // Determine strength
  let strength: 'weak' | 'fair' | 'good' | 'strong';
  if (score < 30) strength = 'weak';
  else if (score < 60) strength = 'fair';
  else if (score < 85) strength = 'good';
  else strength = 'strong';

  return {
    isValid: score >= 50 && feedback.length === 0,
    score,
    feedback,
    strength
  };
};

// Validation function for use in routes
export const validatePassword = (password: string) => {
  try {
    passwordSchema.parse(password);
    const strength = checkPasswordStrength(password);
    
    if (!strength.isValid) {
      throw new Error(`Password too weak. ${strength.feedback.join(', ')}`);
    }
    
    return { valid: true, strength };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.errors.map(e => e.message).join(', '));
    }
    throw error;
  }
};

export default {
  passwordSchema,
  checkPasswordStrength,
  validatePassword
};