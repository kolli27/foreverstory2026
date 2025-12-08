/**
 * NextAuth.js Edge-Compatible Configuration
 * Used ONLY in middleware (no Node.js dependencies)
 */

import type { NextAuthConfig } from 'next-auth';

// ============================================
// Edge-Compatible NextAuth Configuration
// ============================================

export const authConfigEdge = {
  // ============================================
  // Pages
  // ============================================
  pages: {
    signIn: '/login',
    verifyRequest: '/verify-request',
    error: '/error',
    newUser: '/onboarding',
  },

  // ============================================
  // Providers
  // ============================================
  // NOTE: No providers needed in middleware config
  // Providers are only used in the full auth instance with Prisma adapter
  providers: [],

  // ============================================
  // Session Configuration
  // ============================================
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // Update session every 24 hours
  },

  // ============================================
  // Callbacks
  // ============================================
  callbacks: {
    /**
     * This callback is called whenever a session is checked in middleware
     * Keep it minimal - no database calls, no async operations
     */
    async authorized({ request }) {
      // This is checked in middleware for protected routes
      // Return true to allow access, false to redirect to login
      const { pathname } = request.nextUrl;

      // Allow access to API routes
      if (pathname.startsWith('/api')) {
        return true;
      }

      // For protected routes, check if user is authenticated
      // The actual route protection logic is in middleware.ts
      return true;
    },
  },

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
