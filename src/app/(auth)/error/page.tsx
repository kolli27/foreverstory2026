import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AuthError } from '@/components/auth/auth-error';
import type { AuthError as AuthErrorType } from '@/types/auth';

/**
 * Auth Error Page
 * Displays authentication errors with recovery options
 */

export const metadata: Metadata = {
  title: 'Anmeldung fehlgeschlagen',
  description:
    'Bei der Anmeldung ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.',
  robots: {
    index: false, // Don't index auth pages
    follow: false,
  },
};

/**
 * Wrapper component to handle search params
 */
function AuthErrorContent({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const error = (searchParams.error as AuthErrorType) || 'Default';

  return <AuthError error={error} />;
}

export default function ErrorPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <Suspense fallback={<ErrorPageSkeleton />}>
      <AuthErrorContent searchParams={searchParams} />
    </Suspense>
  );
}

/**
 * Loading skeleton for error page
 */
function ErrorPageSkeleton() {
  return (
    <div className="animate-pulse space-y-4 text-center">
      <div className="mx-auto h-16 w-16 rounded-full bg-slate-200" />
      <div className="mx-auto h-8 w-56 rounded bg-slate-200" />
      <div className="mx-auto h-24 w-full rounded-lg bg-slate-200" />
      <div className="mx-auto h-12 w-full rounded-lg bg-slate-200" />
    </div>
  );
}
