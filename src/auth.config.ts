/**
 * NextAuth.js Configuration (Edge-Compatible)
 * Email magic link authentication for ForeverStory
 */

import type { NextAuthConfig } from 'next-auth';
import Email from 'next-auth/providers/email';
import { sendMagicLinkEmail } from './lib/email/send-magic-link';

// ============================================
// NextAuth Configuration
// ============================================

export const authConfig = {
  // ============================================
  // Pages
  // ============================================
  pages: {
    signIn: '/login',
    verifyRequest: '/verify-request',
    error: '/error',
    newUser: '/onboarding', // Redirect after first sign in
  },

  // ============================================
  // Providers
  // ============================================
  providers: [
    Email({
      // Email magic link provider
      id: 'email',

      // Server config (required by NextAuth even when using custom sendVerificationRequest)
      server: {
        host: 'smtp.eu.mailgun.org',
        port: 587,
        auth: {
          user: `postmaster@${process.env.MAILGUN_DOMAIN}`,
          pass: process.env.MAILGUN_API_KEY || '',
        },
      },
      from: process.env.EMAIL_FROM || 'ForeverStory <noreply@foreverstory.de>',

      // Custom email sending logic
      async sendVerificationRequest({ identifier: email, url }) {
        // Send magic link using our custom Mailgun integration
        const result = await sendMagicLinkEmail({
          email,
          magicLink: url,
        });

        if (!result.success) {
          throw new Error(
            `Failed to send magic link to ${email}: ${result.error}`
          );
        }
      },

      // Token configuration
      maxAge: 24 * 60 * 60, // 24 hours (in seconds)

      // Email normalization
      normalizeIdentifier(identifier: string): string {
        // Lowercase and trim email
        return identifier.toLowerCase().trim();
      },
    }),
  ],

  // ============================================
  // Session Configuration
  // ============================================
  session: {
    strategy: 'database', // Use database sessions (not JWT)
    maxAge: 30 * 24 * 60 * 60, // 30 days (in seconds)
    updateAge: 24 * 60 * 60, // Update session in DB every 24 hours
  },

  // ============================================
  // Callbacks
  // ============================================
  callbacks: {
    /**
     * Determines whether user can sign in
     * Use for role-based access control if needed
     */
    async signIn({ user }) {
      // For now, allow all users with valid email
      // Add custom logic here if you need to restrict access
      return Boolean(user.email);
    },

    /**
     * This callback is called whenever a session is checked
     * Use to add custom properties to the session object
     */
    async session({ session, user }) {
      if (session.user) {
        // Add custom user fields to session
        session.user.id = user.id;
        session.user.firstName = user.firstName;
        session.user.lastName = user.lastName;
        session.user.role = user.role;
        session.user.locale = user.locale;
      }

      return session;
    },
  },

  // ============================================
  // Events (for logging/analytics)
  // ============================================
  events: {
    async signIn({ user, isNewUser }) {
      // Log successful sign-in for GDPR audit trail
      console.log(`✅ User signed in: ${user.email} (New: ${isNewUser})`);
    },

    async signOut() {
      // Log sign-out for GDPR audit trail
      console.log(`👋 User signed out`);
    },

    async createUser({ user }) {
      // Log user creation for GDPR audit trail
      console.log(`👤 New user created: ${user.email}`);
    },
  },

  // ============================================
  // Debug (only in development)
  // ============================================
  debug: process.env.NODE_ENV === 'development',

  // ============================================
  // Security
  // ============================================
  useSecureCookies: process.env.NODE_ENV === 'production',
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === 'production'
          ? '__Secure-next-auth.session-token'
          : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
} satisfies NextAuthConfig;
