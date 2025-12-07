/**
 * NextAuth.js v5 Instance
 * Main authentication configuration with Prisma adapter
 */

import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { CustomPrismaAdapter } from './lib/auth/prisma-adapter';
import { prisma } from './lib/prisma';

// ============================================
// NextAuth Instance
// ============================================

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: CustomPrismaAdapter(prisma),
});
