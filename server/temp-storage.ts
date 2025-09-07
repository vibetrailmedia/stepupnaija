// Temporary in-memory storage for registration data during SMS verification
// In production, this should be replaced with Redis or database storage with TTL

export interface TempRegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  timestamp: number;
}

const tempStorage = new Map<string, TempRegistrationData>();

// Clean up expired registrations (older than 15 minutes)
const EXPIRY_TIME = 15 * 60 * 1000; // 15 minutes

export function storeTempRegistration(phoneNumber: string, data: TempRegistrationData): void {
  tempStorage.set(phoneNumber, data);
}

export function getTempRegistration(phoneNumber: string): TempRegistrationData | null {
  const data = tempStorage.get(phoneNumber);
  
  if (!data) {
    return null;
  }

  // Check if expired
  if (Date.now() - data.timestamp > EXPIRY_TIME) {
    tempStorage.delete(phoneNumber);
    return null;
  }

  return data;
}

export function deleteTempRegistration(phoneNumber: string): void {
  tempStorage.delete(phoneNumber);
}

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [phoneNumber, data] of Array.from(tempStorage.entries())) {
    if (now - data.timestamp > EXPIRY_TIME) {
      tempStorage.delete(phoneNumber);
    }
  }
}, 5 * 60 * 1000); // Clean up every 5 minutes