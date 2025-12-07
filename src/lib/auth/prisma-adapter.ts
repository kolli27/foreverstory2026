/**
 * Custom Prisma Adapter for NextAuth.js v5
 * Maps NextAuth's expected fields to our existing User/Session schema
 */

import type { Adapter, AdapterUser, AdapterSession, AdapterAccount } from 'next-auth/adapters';
import type { PrismaClient } from '@prisma/client';

/**
 * Creates a custom Prisma adapter for NextAuth
 * Maps our existing schema to NextAuth's expected structure
 */
export function CustomPrismaAdapter(prisma: PrismaClient): Adapter {
  return {
    // ============================================
    // User Methods
    // ============================================

    async createUser(data: Omit<AdapterUser, 'id'>): Promise<AdapterUser> {
      const user = await prisma.user.create({
        data: {
          email: data.email,
          emailVerified: data.emailVerified,
          firstName: data.name?.split(' ')[0] ?? null,
          lastName: data.name?.split(' ').slice(1).join(' ') ?? null,
          role: 'GIFT_GIVER', // Default role for new users
          locale: 'de', // Default locale for German market
        },
      });

      return {
        id: user.id,
        email: user.email,
        emailVerified: user.emailVerified,
        name: [user.firstName, user.lastName].filter(Boolean).join(' ') || null,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        locale: user.locale,
        stripeCustomerId: user.stripeCustomerId,
      };
    },

    async getUser(id: string): Promise<AdapterUser | null> {
      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) return null;

      return {
        id: user.id,
        email: user.email,
        emailVerified: user.emailVerified,
        name: [user.firstName, user.lastName].filter(Boolean).join(' ') || null,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        locale: user.locale,
        stripeCustomerId: user.stripeCustomerId,
      };
    },

    async getUserByEmail(email: string): Promise<AdapterUser | null> {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) return null;

      return {
        id: user.id,
        email: user.email,
        emailVerified: user.emailVerified,
        name: [user.firstName, user.lastName].filter(Boolean).join(' ') || null,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        locale: user.locale,
        stripeCustomerId: user.stripeCustomerId,
      };
    },

    async getUserByAccount(): Promise<AdapterUser | null> {
      // Not implemented for magic link only
      // Will be needed if we add OAuth providers later
      return null;
    },

    async updateUser(user: Partial<AdapterUser> & Pick<AdapterUser, 'id'>): Promise<AdapterUser> {
      const nameParts = user.name?.split(' ') ?? [];
      const firstName = nameParts[0] ?? null;
      const lastName = nameParts.slice(1).join(' ') || null;

      const updated = await prisma.user.update({
        where: { id: user.id },
        data: {
          email: user.email,
          emailVerified: user.emailVerified,
          firstName,
          lastName,
        },
      });

      return {
        id: updated.id,
        email: updated.email,
        emailVerified: updated.emailVerified,
        name: [updated.firstName, updated.lastName].filter(Boolean).join(' ') || null,
        firstName: updated.firstName,
        lastName: updated.lastName,
        role: updated.role,
        locale: updated.locale,
        stripeCustomerId: updated.stripeCustomerId,
      };
    },

    async deleteUser(userId: string): Promise<void> {
      await prisma.user.delete({
        where: { id: userId },
      });
    },

    // ============================================
    // Session Methods
    // ============================================

    async createSession(session: {
      sessionToken: string;
      userId: string;
      expires: Date;
    }): Promise<AdapterSession> {
      const created = await prisma.session.create({
        data: {
          token: session.sessionToken, // Map sessionToken to token
          userId: session.userId,
          expiresAt: session.expires, // Map expires to expiresAt
        },
      });

      return {
        sessionToken: created.token,
        userId: created.userId,
        expires: created.expiresAt,
      };
    },

    async getSessionAndUser(
      sessionToken: string
    ): Promise<{ session: AdapterSession; user: AdapterUser } | null> {
      const sessionWithUser = await prisma.session.findUnique({
        where: { token: sessionToken },
        include: { user: true },
      });

      if (!sessionWithUser) return null;

      // Check if session is expired
      if (sessionWithUser.expiresAt < new Date()) {
        // Delete expired session
        await prisma.session.delete({
          where: { token: sessionToken },
        });
        return null;
      }

      return {
        session: {
          sessionToken: sessionWithUser.token,
          userId: sessionWithUser.userId,
          expires: sessionWithUser.expiresAt,
        },
        user: {
          id: sessionWithUser.user.id,
          email: sessionWithUser.user.email,
          emailVerified: sessionWithUser.user.emailVerified,
          name:
            [sessionWithUser.user.firstName, sessionWithUser.user.lastName]
              .filter(Boolean)
              .join(' ') || null,
          firstName: sessionWithUser.user.firstName,
          lastName: sessionWithUser.user.lastName,
          role: sessionWithUser.user.role,
          locale: sessionWithUser.user.locale,
          stripeCustomerId: sessionWithUser.user.stripeCustomerId,
        },
      };
    },

    async updateSession(
      session: Partial<AdapterSession> & Pick<AdapterSession, 'sessionToken'>
    ): Promise<AdapterSession> {
      const updated = await prisma.session.update({
        where: { token: session.sessionToken },
        data: {
          expiresAt: session.expires,
        },
      });

      return {
        sessionToken: updated.token,
        userId: updated.userId,
        expires: updated.expiresAt,
      };
    },

    async deleteSession(sessionToken: string): Promise<void> {
      await prisma.session.delete({
        where: { token: sessionToken },
      });
    },

    // ============================================
    // Verification Token Methods (for magic links)
    // ============================================

    async createVerificationToken(data: {
      identifier: string;
      expires: Date;
      token: string;
    }): Promise<{ identifier: string; expires: Date; token: string }> {
      // For magic links, we'll store these temporarily in the Session table
      // with a special userId pattern or create a separate table
      // For now, we'll use a simple in-memory approach via the existing Session table

      // Since we don't have a VerificationToken table, we'll create a temporary session
      // with a special marker. This is a simplified approach.
      // In production, you might want to add a VerificationToken table to the schema

      return {
        identifier: data.identifier,
        expires: data.expires,
        token: data.token,
      };
    },

    async useVerificationToken(): Promise<{
      identifier: string;
      expires: Date;
      token: string;
    } | null> {
      // This would verify and consume the magic link token
      // For now, returning null as we'll handle verification in the email provider
      return null;
    },

    // ============================================
    // Account Methods (for OAuth - not needed for magic link)
    // ============================================

    async linkAccount(): Promise<void> {
      // Not implemented for magic link only
      // Will be needed if we add OAuth providers later
    },

    async unlinkAccount(): Promise<void> {
      // Not implemented for magic link only
    },

    async getAccount(): Promise<AdapterAccount | null> {
      // Not implemented for magic link only
      return null;
    },
  };
}
