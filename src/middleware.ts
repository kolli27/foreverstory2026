/**
 * NextAuth Middleware
 * Handles route protection and authentication at the edge
 */

import NextAuth from 'next-auth';
import { authConfigEdge } from '@/auth.config.edge';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Create edge-compatible auth instance (no Node.js dependencies)
const { auth } = NextAuth(authConfigEdge);

// ============================================
// Route Configuration
// ============================================

/**
 * Protected routes that require authentication
 * Users will be redirected to login if not authenticated
 */
const PROTECTED_ROUTES = [
  '/dashboard',
  '/stories',
  '/questions',
  '/profile',
  '/settings',
  '/book',
  '/family',
];

/**
 * Admin-only routes
 * Requires ADMIN role
 */
const ADMIN_ROUTES = [
  '/admin',
];

/**
 * Auth routes (login, signup, etc.)
 * Redirect to dashboard if already authenticated
 */
const AUTH_ROUTES = [
  '/login',
  '/verify-request',
  '/error',
];

/**
 * Public routes (/, /about, /pricing, etc.) don't require explicit checks
 * They're handled by the default case - all routes not in PROTECTED_ROUTES,
 * ADMIN_ROUTES, or AUTH_ROUTES are considered public
 */

// ============================================
// Middleware Function
// ============================================

export default auth(async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get session from auth
  const session = (request as any).auth;
  const isAuthenticated = Boolean(session?.user);

  // ============================================
  // 1. Check if route requires admin access
  // ============================================
  if (ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      // Redirect to login with callback
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, request.url)
      );
    }

    if (session.user.role !== 'ADMIN') {
      // Redirect to unauthorized page
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    return NextResponse.next();
  }

  // ============================================
  // 2. Check if route requires authentication
  // ============================================
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      // Redirect to login with callback
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, request.url)
      );
    }

    return NextResponse.next();
  }

  // ============================================
  // 3. Redirect authenticated users away from auth pages
  // ============================================
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    if (isAuthenticated) {
      // Redirect to dashboard or callback URL
      const callbackUrl = request.nextUrl.searchParams.get('callbackUrl') || '/dashboard';
      return NextResponse.redirect(new URL(callbackUrl, request.url));
    }

    return NextResponse.next();
  }

  // ============================================
  // 4. Allow access to public routes
  // ============================================
  return NextResponse.next();
});

// ============================================
// Middleware Configuration
// ============================================

/**
 * Configure which routes to run middleware on
 * Exclude API routes, static files, and _next internals
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};
