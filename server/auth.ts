import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";
import connectPg from "connect-pg-simple";
import crypto from "crypto";
import { validatePassword } from "./middleware/password-policy";
import { recordFailedAttempt, clearFailedAttempts, isAccountLocked } from "./middleware/account-lockout";
import { recordBruteForceAttempt } from "./middleware/threat-detection";
import { sendVerificationCode, verifyCode } from "./services/sms";
import { storeTempRegistration, getTempRegistration, deleteTempRegistration } from "./temp-storage";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  // Session store setup
  const PostgresSessionStore = connectPg(session);
  const sessionStore = new PostgresSessionStore({
    conString: process.env.DATABASE_URL,
    tableName: 'sessions', // Use correct table name (plural)
    createTableIfMissing: false, // Table already exists
  });

  // Enforce production security requirements
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction && !process.env.SESSION_SECRET) {
    throw new Error('SESSION_SECRET must be set in production');
  }

  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET!, // Remove fallback in production
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    name: 'stepup.sid', // Custom session name (security through obscurity)
    cookie: {
      secure: isProduction, // HTTPS-only cookies in production
      httpOnly: true, // Prevent XSS access to cookies
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
      sameSite: isProduction ? 'strict' : 'lax', // CSRF protection
      domain: isProduction ? undefined : undefined, // Let Express handle domain
      path: '/', // Restrict cookie path
    },
    rolling: false, // Don't extend session on each request
    unset: 'destroy', // Destroy session data on logout
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Passport Local Strategy - uses email as username
  passport.use(
    new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    }, async (email, password, done) => {
      try {
        const user = await storage.getUserByEmail(email);
        if (!user) {
          // Record failed attempt for non-existent user (prevent user enumeration)
          setTimeout(() => {
            recordFailedAttempt(email, 'passport-strategy').catch(console.error);
          }, 0);
          return done(null, false, { message: 'Invalid credentials' });
        }
        // Check if user has a password (some might be from old auth systems)
        if (!user.password) {
          return done(null, false, { message: 'Account needs password setup' });
        }
        
        const isValid = await comparePasswords(password, user.password);
        if (!isValid) {
          // Record failed attempt for wrong password
          setTimeout(() => {
            recordFailedAttempt(email, 'passport-strategy').catch(console.error);
          }, 0);
          return done(null, false, { message: 'Invalid credentials' });
        }

        // Clear any existing failed attempts on successful login
        setTimeout(() => {
          clearFailedAttempts(email, 'passport-strategy').catch(console.error);
        }, 0);
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return done(null, false);
      }
      done(null, user);
    } catch (error) {
      console.error('Deserialization error:', error);
      done(error);
    }
  });

  // Registration endpoint
  app.post("/api/register", async (req, res) => {
    try {
      const { email, password, firstName, lastName, phoneNumber } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      if (!firstName || !lastName) {
        return res.status(400).json({ error: "First name and last name are required" });
      }

      if (!phoneNumber) {
        return res.status(400).json({ error: "Mobile number is required for 2FA security" });
      }

      // Validate international phone number format (supports diaspora)
      const cleanPhone = phoneNumber.replace(/\s/g, '');
      const isValidInternational = /^\+\d{7,15}$/.test(cleanPhone) || /^\+?(\d{10,15})$/.test(cleanPhone);
      
      if (!isValidInternational) {
        return res.status(400).json({ 
          error: "Please enter a valid international phone number (e.g., +2348012345678, +1555123456, +447123456789)" 
        });
      }

      // Validate password strength with enterprise-grade requirements
      try {
        validatePassword(password);
      } catch (error) {
        return res.status(400).json({ error: (error as Error).message });
      }
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "User with this email already exists" });
      }

      // Check if phone number already exists
      const existingPhoneUser = await storage.getUserByPhone(phoneNumber);
      if (existingPhoneUser) {
        return res.status(400).json({ error: "This phone number is already registered" });
      }

      // Send SMS verification code
      const smsResult = await sendVerificationCode(phoneNumber);
      if (!smsResult.success) {
        return res.status(500).json({ error: smsResult.message });
      }

      // Store user data temporarily (for completion after SMS verification)
      storeTempRegistration(phoneNumber, {
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        timestamp: Date.now()
      });

      // Return verification required response with international phone masking
      const maskInternationalPhone = (phone: string) => {
        if (phone.startsWith('+234')) {
          return phone.replace(/(\+234\d{3})\d{4}(\d{4})/, '$1****$2');
        } else if (phone.startsWith('+1')) {
          return phone.replace(/(\+1\d{3})\d{3}(\d{4})/, '$1***$2');
        } else if (phone.startsWith('+44')) {
          return phone.replace(/(\+44\d{3})\d{3}(\d{3})/, '$1***$2');
        } else {
          // Generic international masking
          const digits = phone.replace(/\D/g, '');
          if (digits.length > 6) {
            return phone.substring(0, phone.length - 6) + '****' + phone.substring(phone.length - 2);
          }
          return phone;
        }
      };

      res.status(200).json({ 
        verificationRequired: true,
        message: "Verification code sent to your phone. Please verify to complete registration.",
        phoneNumber: maskInternationalPhone(phoneNumber)
      });
      
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  // SMS Verification endpoint for completing registration
  app.post("/api/verify-sms", async (req, res) => {
    try {
      const { phoneNumber, verificationCode } = req.body;
      
      if (!phoneNumber || !verificationCode) {
        return res.status(400).json({ error: "Phone number and verification code are required" });
      }

      // Verify the SMS code
      const verificationResult = verifyCode(phoneNumber, verificationCode);
      if (!verificationResult.success) {
        return res.status(400).json({ error: verificationResult.message });
      }

      // Get stored registration data
      const registrationData = getTempRegistration(phoneNumber);
      if (!registrationData) {
        return res.status(400).json({ error: "Registration session expired. Please start registration again." });
      }

      // Hash password and create user
      const hashedPassword = await hashPassword(registrationData.password);
      
      const newUser = await storage.upsertUser({
        id: crypto.randomUUID(),
        email: registrationData.email,
        firstName: registrationData.firstName || null,
        lastName: registrationData.lastName || null,
        phone: registrationData.phoneNumber,
        password: hashedPassword,
        profileImageUrl: null,
      });

      // Create wallet for new user
      await storage.createWallet(newUser.id);

      // Clean up temporary data
      deleteTempRegistration(phoneNumber);

      // Auto-login the user
      req.login(newUser, (err) => {
        if (err) {
          console.error('Login error after registration:', err);
          return res.status(500).json({ error: "Registration successful but login failed" });
        }
        
        // Return success response
        const { password: _, ...userResponse } = newUser;
        res.status(201).json({
          message: "Account created and verified successfully!",
          user: userResponse
        });
      });
      
    } catch (error) {
      console.error('SMS verification error:', error);
      res.status(500).json({ error: "Verification failed" });
    }
  });

  // Resend SMS verification code
  app.post("/api/resend-sms", async (req, res) => {
    try {
      const { phoneNumber } = req.body;
      
      if (!phoneNumber) {
        return res.status(400).json({ error: "Phone number is required" });
      }

      // Check if registration data exists
      const registrationData = getTempRegistration(phoneNumber);
      if (!registrationData) {
        return res.status(400).json({ error: "Registration session expired. Please start registration again." });
      }

      // Send new verification code
      const smsResult = await sendVerificationCode(phoneNumber);
      if (!smsResult.success) {
        return res.status(500).json({ error: smsResult.message });
      }

      res.json({ 
        success: true,
        message: "New verification code sent to your phone.",
        phoneNumber: phoneNumber.replace(/(\+234\d{3})\d{4}(\d{4})/, '$1****$2')
      });
      
    } catch (error) {
      console.error('SMS resend error:', error);
      res.status(500).json({ error: "Failed to resend verification code" });
    }
  });

  // Login endpoint with account lockout protection
  app.post("/api/login", (req, res, next) => {
    // Check account lockout first
    const email = req.body.email?.toLowerCase();
    const ip = req.ip || 'unknown';
    
    if (email) {
      const lockStatus = isAccountLocked(email, ip);
      
      if (lockStatus.locked && lockStatus.remainingLockoutMs) {
        const remainingMinutes = Math.ceil(lockStatus.remainingLockoutMs / (60 * 1000));
        return res.status(429).json({
          error: 'Account temporarily locked due to multiple failed login attempts',
          retryAfter: Math.ceil(lockStatus.remainingLockoutMs / 1000),
          remainingMinutes
        });
      }
    }
    
    // Proceed with authentication
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: "Login failed" });
      }
      
      if (!user) {
        const errorMessage = info?.message || "Invalid credentials";
        
        // Record failed attempt (if it's an actual authentication failure)
        if (req.body.email && errorMessage !== 'Account needs password setup') {
          setTimeout(() => {
            recordFailedAttempt(req.body.email, req.ip || 'unknown').catch(console.error);
          }, 0);
        }
        
        // Check if this is a form submission vs API call
        const isFormSubmission = req.get('Content-Type')?.includes('application/x-www-form-urlencoded');
        
        if (isFormSubmission && errorMessage === 'Account needs password setup') {
          // Redirect legacy users to password setup page instead of showing JSON error
          return res.redirect('/setup-password');
        }
        
        return res.status(401).json({ error: errorMessage });
      }
      
      req.login(user, (loginErr) => {
        if (loginErr) {
          console.error('Session login error:', loginErr);
          return res.status(500).json({ error: "Login session failed" });
        }
        
        // Check if this is a form submission (Content-Type) vs API call  
        const isFormSubmission = req.get('Content-Type')?.includes('application/x-www-form-urlencoded');
        
        if (isFormSubmission) {
          // Form submission - redirect to dashboard
          res.redirect('/');
        } else {
          // API call - return JSON
          const { password: _, ...userResponse } = user;
          res.json(userResponse);
        }
      });
    })(req, res, next);
  });

  // Logout endpoint
  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Password setup endpoint for existing users
  app.post("/api/setup-password", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      // Validate password strength with enterprise-grade requirements
      try {
        validatePassword(password);
      } catch (error) {
        return res.status(400).json({ error: (error as Error).message });
      }
      
      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Check if user already has a password
      if (user.password) {
        return res.status(400).json({ error: "User already has a password. Use login instead." });
      }
      
      // Set password
      const hashedPassword = await hashPassword(password);
      const updatedUser = await storage.upsertUser({
        ...user,
        password: hashedPassword,
      });
      
      // Auto-login the user
      req.login(updatedUser, (err) => {
        if (err) {
          console.error('Login error after password setup:', err);
          return res.status(500).json({ error: "Password set but login failed" });
        }
        
        // Check if this is a form submission vs API call
        const isFormSubmission = req.get('Content-Type')?.includes('application/x-www-form-urlencoded');
        
        if (isFormSubmission) {
          // Form submission - redirect to dashboard
          res.redirect('/');
        } else {
          // API call - return JSON
          const { password: _, ...userResponse } = updatedUser;
          res.json({ 
            message: "Password setup successful", 
            user: userResponse 
          });
        }
      });
      
    } catch (error) {
      console.error('Password setup error:', error);
      res.status(500).json({ error: "Password setup failed" });
    }
  });

  // Google OAuth endpoint
  app.post("/api/auth/google", async (req, res) => {
    try {
      const { credential } = req.body;
      
      if (!credential) {
        return res.status(400).json({ error: "Google credential is required" });
      }

      // Import Google auth functions
      const { verifyGoogleToken, findOrCreateGoogleUser } = await import('./googleAuth');
      
      // Verify Google token
      const googleUser = await verifyGoogleToken(credential);
      if (!googleUser) {
        return res.status(401).json({ error: "Invalid Google credential" });
      }

      // Find or create user
      const user = await findOrCreateGoogleUser(googleUser);
      
      // Log user in
      req.login(user, (err) => {
        if (err) {
          console.error('Google login error:', err);
          return res.status(500).json({ error: "Login failed" });
        }
        
        const { password: _, ...userResponse } = user;
        res.json({ 
          message: "Google authentication successful",
          user: userResponse 
        });
      });
      
    } catch (error) {
      console.error('Google OAuth error:', error);
      res.status(500).json({ error: "Google authentication failed" });
    }
  });

  // Get current user
  app.get("/api/user", async (req, res) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      // Get fresh user data with wallet
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const wallet = await storage.getWallet(user.id);
      
      // Don't send password in response
      const { password: _, ...userResponse } = user;
      res.json({ ...userResponse, wallet });
      
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  console.log('✅ Local authentication system initialized successfully');
}