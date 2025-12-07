'use client';

/**
 * Session Provider for Client Components
 * Wraps NextAuth SessionProvider for client-side session access
 */

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';

// ============================================
// Session Provider Component
// ============================================

export interface SessionProviderProps {
  /** The session object from server */
  session?: Session | null;
  /** Child components */
  children: React.ReactNode;
}

/**
 * Provides session context to client components
 *
 * Wrap your app with this provider to enable client-side session access
 *
 * @example
 * ```tsx
 * // In root layout or _app
 * import { SessionProvider } from '@/lib/auth/session-context';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <SessionProvider>
 *       {children}
 *     </SessionProvider>
 *   );
 * }
 * ```
 *
 * Then use in client components:
 * ```tsx
 * 'use client';
 * import { useSession } from 'next-auth/react';
 *
 * export function UserMenu() {
 *   const { data: session, status } = useSession();
 *
 *   if (status === 'loading') {
 *     return <div>Lädt...</div>;
 *   }
 *
 *   if (status === 'unauthenticated') {
 *     return <a href="/login">Anmelden</a>;
 *   }
 *
 *   return <div>Hallo, {session?.user?.email}</div>;
 * }
 * ```
 */
export function SessionProvider({ children, session }: SessionProviderProps) {
  return (
    <NextAuthSessionProvider
      session={session}
      // Refetch session every 5 minutes
      refetchInterval={5 * 60}
      // Refetch session when window regains focus
      refetchOnWindowFocus={true}
    >
      {children}
    </NextAuthSessionProvider>
  );
}

// ============================================
// Re-export hooks for convenience
// ============================================

/**
 * Re-export useSession from next-auth/react
 * Use this in client components to access session
 *
 * @example
 * ```tsx
 * import { useSession } from '@/lib/auth/session-context';
 *
 * const { data: session, status } = useSession();
 * ```
 */
export { useSession, signIn, signOut } from 'next-auth/react';
