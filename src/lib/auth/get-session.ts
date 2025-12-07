/**
 * Server-Side Session Helpers
 * Utilities for accessing and validating user sessions in Server Components
 */

import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import type { UserRole } from '@/types/auth';

// ============================================
// Session Getters
// ============================================

/**
 * Get the current session (server-side only)
 * Returns null if no session exists
 *
 * @example
 * ```tsx
 * const session = await getServerSession();
 * if (!session) {
 *   redirect('/login');
 * }
 * ```
 */
export async function getServerSession() {
  return await auth();
}

/**
 * Get the current user from session (server-side only)
 * Returns null if no session exists
 *
 * @example
 * ```tsx
 * const user = await getCurrentUser();
 * if (user) {
 *   console.log(user.email);
 * }
 * ```
 */
export async function getCurrentUser() {
  const session = await getServerSession();
  return session?.user ?? null;
}

// ============================================
// Protected Route Helpers
// ============================================

/**
 * Require authentication for a page/route
 * Redirects to login if no session exists
 *
 * @param redirectTo - URL to redirect to after login (default: current page)
 * @returns The authenticated user
 *
 * @example
 * ```tsx
 * // In a Server Component or Server Action
 * export default async function ProfilePage() {
 *   const user = await requireAuth();
 *   return <div>Welcome {user.email}</div>;
 * }
 * ```
 */
export async function requireAuth(redirectTo?: string) {
  const session = await getServerSession();

  if (!session?.user) {
    // Build redirect URL with callback
    const callbackUrl = redirectTo || '/';
    const loginUrl = `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;
    redirect(loginUrl);
  }

  return session.user;
}

/**
 * Require specific role(s) for a page/route
 * Redirects to login if no session, or to unauthorized if wrong role
 *
 * @param allowedRoles - Single role or array of allowed roles
 * @param redirectTo - URL to redirect to if unauthorized (default: /unauthorized)
 * @returns The authenticated user (with verified role)
 *
 * @example
 * ```tsx
 * // In a Server Component
 * export default async function AdminPage() {
 *   const user = await requireRole('ADMIN');
 *   return <div>Admin Panel</div>;
 * }
 *
 * // Multiple roles
 * export default async function StoryPage() {
 *   const user = await requireRole(['STORY_AUTHOR', 'ADMIN']);
 *   return <div>Write your story</div>;
 * }
 * ```
 */
export async function requireRole(
  allowedRoles: UserRole | UserRole[],
  redirectTo?: string
) {
  const user = await requireAuth();

  // Normalize to array
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  // Check if user has one of the allowed roles
  if (!roles.includes(user.role)) {
    const unauthorizedUrl = redirectTo || '/unauthorized';
    redirect(unauthorizedUrl);
  }

  return user;
}

// ============================================
// Role Check Helpers
// ============================================

/**
 * Check if current user has a specific role
 * Does NOT redirect, returns boolean
 *
 * @param role - Role to check for
 * @returns True if user has the role, false otherwise
 *
 * @example
 * ```tsx
 * const isAdmin = await hasRole('ADMIN');
 * if (isAdmin) {
 *   // Show admin features
 * }
 * ```
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === role;
}

/**
 * Check if current user has ANY of the specified roles
 * Does NOT redirect, returns boolean
 *
 * @param roles - Array of roles to check
 * @returns True if user has any of the roles, false otherwise
 *
 * @example
 * ```tsx
 * const canWrite = await hasAnyRole(['STORY_AUTHOR', 'ADMIN']);
 * ```
 */
export async function hasAnyRole(roles: UserRole[]): Promise<boolean> {
  const user = await getCurrentUser();
  return user ? roles.includes(user.role) : false;
}

/**
 * Check if current user has ALL of the specified roles
 * (Less common, but included for completeness)
 *
 * @param roles - Array of roles to check
 * @returns True if user has all of the roles, false otherwise
 */
export async function hasAllRoles(roles: UserRole[]): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;

  // For single role system, user can only have one role
  // So this only returns true if checking for exactly their role
  return roles.length === 1 && roles[0] === user.role;
}

// ============================================
// Session Validation Helpers
// ============================================

/**
 * Check if user is authenticated
 * Does NOT redirect, returns boolean
 *
 * @returns True if user has valid session, false otherwise
 *
 * @example
 * ```tsx
 * const authenticated = await isAuthenticated();
 * if (authenticated) {
 *   // Show authenticated content
 * }
 * ```
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getServerSession();
  return Boolean(session?.user);
}

/**
 * Get user ID from session
 * Returns null if no session
 *
 * @returns User ID or null
 */
export async function getUserId(): Promise<string | null> {
  const user = await getCurrentUser();
  return user?.id ?? null;
}

/**
 * Get user email from session
 * Returns null if no session
 *
 * @returns User email or null
 */
export async function getUserEmail(): Promise<string | null> {
  const user = await getCurrentUser();
  return user?.email ?? null;
}
