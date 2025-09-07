import { OAuth2Client } from 'google-auth-library';
import { storage } from './storage';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  email_verified?: boolean;
}

export async function verifyGoogleToken(token: string): Promise<GoogleUserInfo | null> {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    if (!payload) return null;

    return {
      id: payload.sub,
      email: payload.email!,
      name: payload.name!,
      given_name: payload.given_name,
      family_name: payload.family_name,
      picture: payload.picture,
      email_verified: payload.email_verified,
    };
  } catch (error) {
    console.error('Error verifying Google token:', error);
    return null;
  }
}

export async function findOrCreateGoogleUser(googleUser: GoogleUserInfo) {
  try {
    // First, try to find existing user by Google ID
    let user = await storage.getUserByGoogleId(googleUser.id);
    
    if (user) {
      // Update user profile with latest Google info
      return await storage.updateUser({
        id: user.id,
        firstName: googleUser.given_name || user.firstName,
        lastName: googleUser.family_name || user.lastName,
        profileImageUrl: googleUser.picture || user.profileImageUrl,
      });
    }
    
    // Try to find user by email (in case they signed up with email first)
    user = await storage.getUserByEmail(googleUser.email);
    
    if (user) {
      // Link Google account to existing user
      return await storage.updateUser({
        id: user.id,
        googleId: googleUser.id,
        authProvider: 'GOOGLE',
        providerAccountId: googleUser.id,
        firstName: googleUser.given_name || user.firstName,
        lastName: googleUser.family_name || user.lastName,
        profileImageUrl: googleUser.picture || user.profileImageUrl,
      });
    }
    
    // Create new user
    const newUser = await storage.createUser({
      email: googleUser.email,
      googleId: googleUser.id,
      authProvider: 'GOOGLE',
      providerAccountId: googleUser.id,
      firstName: googleUser.given_name || '',
      lastName: googleUser.family_name || '',
      profileImageUrl: googleUser.picture || null,
    });
    
    return newUser;
    
  } catch (error) {
    console.error('Error finding or creating Google user:', error);
    throw error;
  }
}