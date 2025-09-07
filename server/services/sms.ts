import twilio from 'twilio';

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

export interface SMSVerificationCode {
  code: string;
  phoneNumber: string;
  expiresAt: Date;
  attempts: number;
}

// In-memory storage for verification codes (in production, use Redis or database)
const verificationCodes = new Map<string, SMSVerificationCode>();

/**
 * Generate a 6-digit verification code
 */
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Format phone number to international format with proper country code
 */
function formatPhoneNumber(phoneNumber: string): string {
  // Remove all non-digit characters except +
  const cleaned = phoneNumber.replace(/[^\d+]/g, '');
  
  // If already has country code, return as is
  if (cleaned.startsWith('+')) {
    return cleaned;
  }
  
  // Auto-detect common formats and add appropriate country codes
  if (cleaned.startsWith('234')) {
    return `+${cleaned}`;
  } else if (cleaned.startsWith('0') && cleaned.length === 11) {
    // Nigerian local format (0803...)
    return `+234${cleaned.slice(1)}`;
  } else if (cleaned.length === 10) {
    // Assume Nigerian without leading 0 (803...)
    return `+234${cleaned}`;
  } else if (cleaned.startsWith('1') && cleaned.length === 11) {
    // US/Canada format
    return `+${cleaned}`;
  } else if (cleaned.startsWith('44') && cleaned.length >= 12) {
    // UK format
    return `+${cleaned}`;
  } else if (cleaned.startsWith('27') && cleaned.length >= 11) {
    // South Africa format
    return `+${cleaned}`;
  } else if (cleaned.startsWith('233') && cleaned.length >= 12) {
    // Ghana format
    return `+${cleaned}`;
  } else if (cleaned.startsWith('254') && cleaned.length >= 12) {
    // Kenya format
    return `+${cleaned}`;
  } else {
    // Default to Nigerian if unclear
    return `+234${cleaned}`;
  }
}

/**
 * Validate international phone number format
 */
function validatePhoneNumber(phoneNumber: string): { isValid: boolean; country?: string } {
  const formatted = formatPhoneNumber(phoneNumber);
  
  // Common international patterns
  const patterns = {
    Nigeria: /^\+234[789]\d{8}$/,
    USA: /^\+1[2-9]\d{9}$/,
    Canada: /^\+1[2-9]\d{9}$/,
    UK: /^\+44[1-9]\d{8,9}$/,
    SouthAfrica: /^\+27[1-9]\d{8}$/,
    Ghana: /^\+233[2-9]\d{8}$/,
    Kenya: /^\+254[1-9]\d{8}$/,
    International: /^\+\d{7,15}$/ // Generic international format
  };
  
  for (const [country, pattern] of Object.entries(patterns)) {
    if (pattern.test(formatted)) {
      return { isValid: true, country };
    }
  }
  
  return { isValid: false };
}

/**
 * Send SMS verification code to phone number (supports international numbers)
 */
export async function sendVerificationCode(phoneNumber: string): Promise<{ success: boolean; message: string }> {
  try {
    if (!TWILIO_PHONE_NUMBER) {
      throw new Error('Twilio phone number not configured');
    }

    // Format and validate phone number
    const formattedPhone = formatPhoneNumber(phoneNumber);
    const validation = validatePhoneNumber(formattedPhone);
    
    if (!validation.isValid) {
      return {
        success: false,
        message: 'Invalid phone number format. Please enter a valid international number (e.g., +234803..., +1555..., +44...).'
      };
    }

    // Generate and store verification code
    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
    
    verificationCodes.set(formattedPhone, {
      code,
      phoneNumber: formattedPhone,
      expiresAt,
      attempts: 0
    });

    // Send SMS via Twilio
    const message = await client.messages.create({
      body: `Your Step Up Naija verification code is: ${code}. This code expires in 10 minutes. Do not share this code with anyone. 🇳🇬`,
      from: TWILIO_PHONE_NUMBER,
      to: formattedPhone
    });

    console.log(`✅ SMS sent successfully to ${formattedPhone} (${validation.country}), SID: ${message.sid}`);
    
    return {
      success: true,
      message: `Verification code sent successfully to ${validation.country || 'international'} number`
    };

  } catch (error) {
    console.error('❌ SMS sending failed:', error);
    
    // Clean up stored code if SMS failed
    const formattedPhone = formatPhoneNumber(phoneNumber);
    verificationCodes.delete(formattedPhone);
    
    return {
      success: false,
      message: 'Failed to send verification code. Please check your number and try again.'
    };
  }
}

/**
 * Verify the SMS code entered by user
 */
export function verifyCode(phoneNumber: string, enteredCode: string): { success: boolean; message: string } {
  // Format phone number to ensure consistency
  const formattedPhone = formatPhoneNumber(phoneNumber);
  const stored = verificationCodes.get(formattedPhone);
  
  if (!stored) {
    return {
      success: false,
      message: 'No verification code found. Please request a new code.'
    };
  }

  // Check if code has expired
  if (new Date() > stored.expiresAt) {
    verificationCodes.delete(formattedPhone);
    return {
      success: false,
      message: 'Verification code has expired. Please request a new code.'
    };
  }

  // Check attempt limit (max 3 attempts)
  if (stored.attempts >= 3) {
    verificationCodes.delete(formattedPhone);
    return {
      success: false,
      message: 'Too many failed attempts. Please request a new code.'
    };
  }

  // Increment attempt counter
  stored.attempts += 1;

  // Verify the code
  if (stored.code === enteredCode.trim()) {
    verificationCodes.delete(formattedPhone); // Clean up after successful verification
    return {
      success: true,
      message: 'Phone number verified successfully'
    };
  }

  return {
    success: false,
    message: `Invalid verification code. ${3 - stored.attempts} attempts remaining.`
  };
}

/**
 * Check if phone number has a pending verification
 */
export function hasPendingVerification(phoneNumber: string): boolean {
  const formattedPhone = formatPhoneNumber(phoneNumber);
  const stored = verificationCodes.get(formattedPhone);
  return stored !== undefined && new Date() <= stored.expiresAt;
}

/**
 * Clear verification code (for cleanup)
 */
export function clearVerificationCode(phoneNumber: string): void {
  verificationCodes.delete(phoneNumber);
}