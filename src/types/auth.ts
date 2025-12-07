/**
 * Authentication Types
 * TypeScript definitions for NextAuth.js v5 integration
 */

// Import required for module augmentation
import 'next-auth';

// ============================================
// User Role Type
// ============================================

/**
 * User role enum (matches Prisma schema)
 */
export type UserRole = 'GIFT_GIVER' | 'STORY_AUTHOR' | 'READER' | 'ADMIN';

// ============================================
// Extended User Type
// ============================================

/**
 * Extended User type with ForeverStory-specific fields
 */
export interface ExtendedUser {
  id: string;
  email: string;
  emailVerified: Date | null;
  firstName: string | null;
  lastName: string | null;
  role: UserRole;
  locale: string;
  stripeCustomerId: string | null;
}

// ============================================
// Module Augmentation for NextAuth
// ============================================

declare module 'next-auth' {
  /**
   * Returned by `auth`, `useSession`, `getSession`
   */
  interface Session {
    user: {
      id: string;
      email: string;
      firstName: string | null;
      lastName: string | null;
      role: UserRole;
      locale: string;
    };
  }

  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User extends ExtendedUser {}
}

// JWT module augmentation will be added when implementing JWT callbacks
// For now, we're using database sessions

// ============================================
// Auth Error Types
// ============================================

export type AuthError =
  | 'Configuration'
  | 'AccessDenied'
  | 'Verification'
  | 'Default'
  | 'EmailSignin'
  | 'OAuthSignin'
  | 'OAuthCallback'
  | 'OAuthCreateAccount'
  | 'EmailCreateAccount'
  | 'Callback'
  | 'OAuthAccountNotLinked'
  | 'SessionRequired'
  | 'InvalidCredentials';

/**
 * German error messages for auth errors
 */
export const AUTH_ERROR_MESSAGES: Record<AuthError, string> = {
  Configuration: 'Es liegt ein Konfigurationsfehler vor. Bitte kontaktieren Sie den Support.',
  AccessDenied: 'Zugriff verweigert. Sie haben keine Berechtigung für diese Aktion.',
  Verification:
    'Der Link ist abgelaufen oder ungültig. Bitte fordern Sie einen neuen Anmeldelink an.',
  Default: 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.',
  EmailSignin: 'Die E-Mail konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.',
  OAuthSignin: 'Die Anmeldung ist fehlgeschlagen. Bitte versuchen Sie es erneut.',
  OAuthCallback: 'Die Anmeldung konnte nicht abgeschlossen werden.',
  OAuthCreateAccount: 'Das Konto konnte nicht erstellt werden.',
  EmailCreateAccount: 'Das Konto konnte nicht erstellt werden.',
  Callback: 'Die Anmeldung ist fehlgeschlagen. Bitte versuchen Sie es erneut.',
  OAuthAccountNotLinked:
    'Diese E-Mail-Adresse ist bereits mit einem anderen Konto verknüpft. Bitte melden Sie sich mit Ihrer ursprünglichen Methode an.',
  SessionRequired: 'Bitte melden Sie sich an, um fortzufahren.',
  InvalidCredentials: 'Die eingegebenen Anmeldedaten sind ungültig.',
};

// ============================================
// Auth UI Types
// ============================================

/**
 * Login form state
 */
export interface LoginFormState {
  email: string;
  isLoading: boolean;
  error: string | null;
}

/**
 * Props for AuthError component
 */
export interface AuthErrorProps {
  error: AuthError | string;
  onRetry?: () => void;
}

/**
 * Props for VerifyRequest component
 */
export interface VerifyRequestProps {
  email: string;
  onResend?: () => void;
}

// ============================================
// Session Helper Types
// ============================================

/**
 * Session user type (extracted from augmented Session)
 */
export interface SessionUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: UserRole;
  locale: string;
}

/**
 * Result type for protected route checks
 */
export type AuthResult<T = void> =
  | { success: true; user: SessionUser; data: T }
  | { success: false; error: string; redirect?: string };

/**
 * Options for requireAuth helper
 */
export interface RequireAuthOptions {
  role?: UserRole | UserRole[];
  redirectTo?: string;
}

// ============================================
// Email Template Types
// ============================================

/**
 * Props for magic link email template
 */
export interface MagicLinkEmailProps {
  url: string;
  host: string;
  email: string;
  locale?: 'de' | 'en';
}

/**
 * Email send result
 */
export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}
