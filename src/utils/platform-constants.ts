// Platform-wide constants for Step Up Naija
export const PLATFORM_CONSTANTS = {
  // Branding
  PLATFORM_NAME: "Step Up Naija",
  CHALLENGE_NAME: "#13kCredibleChallenge", 
  ORGANIZATION: "CIRAD Good Governance Advocacy Foundation",
  
  // Contact & Social
  SUPPORT_EMAIL: "support@stepupnaija.org",
  TWITTER_URL: "https://x.com/Step_up_naija",
  FACEBOOK_URL: "https://www.facebook.com/profile.php?id=61572251606931",
  INSTAGRAM_URL: "https://www.instagram.com/step_up_naija/",
  
  // Platform Limits
  MAX_UPLOAD_SIZE: 10 * 1024 * 1024, // 10MB
  MIN_PASSWORD_LENGTH: 8,
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  
  // SUP Token Economics
  SUP_TO_NGN_RATE: 10, // 1 SUP = ₦10
  DEFAULT_ENTRY_COST: 50, // SUP tokens
  PRIZE_POOL_PERCENTAGE: 80, // 80% of entries go to prize pool
  
  // Geography
  NIGERIA_STATES: 36,
  NIGERIA_LGAS: 774,
  SUPPORTED_COUNTRIES: ["NG", "US", "UK", "CA"], // Nigeria, USA, UK, Canada
  
  // User Levels
  USER_LEVELS: {
    CANDIDATE: 0,
    VERIFIED_LEADER: 1,
    TRAINED_LEADER: 2,
    CIVIC_LEADER: 3
  },
  
  // Feature Flags
  FEATURES: {
    MOBILE_APP: true,
    CAMPUS_MODE: true,
    NYSC_INTEGRATION: true,
    INTERNATIONAL_USERS: true,
    ADVANCED_ANALYTICS: true,
    PREMIUM_FEATURES: false
  },
  
  // API Endpoints
  ENDPOINTS: {
    AUTH: "/api/auth",
    USER: "/api/user",
    WALLET: "/api/wallet", 
    PROJECTS: "/api/projects",
    ENGAGE: "/api/engage",
    ADMIN: "/api/admin"
  },
  
  // UI Constants
  BREAKPOINTS: {
    MOBILE: 640,
    TABLET: 768,
    DESKTOP: 1024,
    LARGE: 1280
  },
  
  // Animation Durations (ms)
  ANIMATIONS: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500
  },
  
  // Success Messages
  MESSAGES: {
    LOGIN_SUCCESS: "Welcome back to Step Up Naija!",
    REGISTRATION_SUCCESS: "Welcome to the #13kCredibleChallenge!",
    LOGOUT_SUCCESS: "See you next time!",
    PROFILE_UPDATED: "Your profile has been updated successfully.",
    PASSWORD_CHANGED: "Your password has been changed successfully."
  },
  
  // Error Messages
  ERRORS: {
    NETWORK_ERROR: "Please check your internet connection and try again.",
    SESSION_EXPIRED: "Your session has expired. Please log in again.",
    PERMISSION_DENIED: "You don't have permission to perform this action.",
    INVALID_CREDENTIALS: "Invalid email or password. Please try again.",
    SERVER_ERROR: "Something went wrong. Our team has been notified."
  }
} as const;

// Type-safe accessors
export type UserLevel = typeof PLATFORM_CONSTANTS.USER_LEVELS[keyof typeof PLATFORM_CONSTANTS.USER_LEVELS];
export type SupportedCountry = typeof PLATFORM_CONSTANTS.SUPPORTED_COUNTRIES[number];
export type Breakpoint = keyof typeof PLATFORM_CONSTANTS.BREAKPOINTS;

// Utility functions
export const getUserLevelName = (level: UserLevel): string => {
  const levelNames = {
    [PLATFORM_CONSTANTS.USER_LEVELS.CANDIDATE]: "Candidate",
    [PLATFORM_CONSTANTS.USER_LEVELS.VERIFIED_LEADER]: "Verified Leader", 
    [PLATFORM_CONSTANTS.USER_LEVELS.TRAINED_LEADER]: "Trained Leader",
    [PLATFORM_CONSTANTS.USER_LEVELS.CIVIC_LEADER]: "Civic Leader"
  };
  return levelNames[level] || "Unknown";
};

export const formatSupBalance = (balance: number): string => {
  return `${balance.toLocaleString()} SUP`;
};

export const convertSupToNgn = (supAmount: number): number => {
  return supAmount * PLATFORM_CONSTANTS.SUP_TO_NGN_RATE;
};

export const isFeatureEnabled = (feature: keyof typeof PLATFORM_CONSTANTS.FEATURES): boolean => {
  return PLATFORM_CONSTANTS.FEATURES[feature];
};

export const isMobile = (): boolean => {
  return window.innerWidth < PLATFORM_CONSTANTS.BREAKPOINTS.MOBILE;
};

export const isTablet = (): boolean => {
  return window.innerWidth >= PLATFORM_CONSTANTS.BREAKPOINTS.MOBILE && 
         window.innerWidth < PLATFORM_CONSTANTS.BREAKPOINTS.DESKTOP;
};

export const isDesktop = (): boolean => {
  return window.innerWidth >= PLATFORM_CONSTANTS.BREAKPOINTS.DESKTOP;
};