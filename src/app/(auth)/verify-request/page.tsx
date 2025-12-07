import type { Metadata } from 'next';
import { Suspense } from 'react';
import { VerifyRequest } from '@/components/auth/verify-request';

/**
 * Verify Request Page
 * Shown after user requests a magic link
 * Displays "check your email" message
 */

export const metadata: Metadata = {
  title: 'E-Mail gesendet',
  description:
    'Wir haben Ihnen einen Anmeldelink per E-Mail gesendet. Bitte prüfen Sie Ihr Postfach.',
  robots: {
    index: false, // Don't index auth pages
    follow: false,
  },
};

/**
 * Wrapper component to handle search params
 */
function VerifyRequestContent({
  searchParams,
}: {
  searchParams: { email?: string };
}) {
  const email = searchParams.email || 'Ihre E-Mail-Adresse';

  return <VerifyRequest email={email} />;
}

export default function VerifyRequestPage({
  searchParams,
}: {
  searchParams: { email?: string };
}) {
  return (
    <Suspense fallback={<VerifyRequestSkeleton />}>
      <VerifyRequestContent searchParams={searchParams} />
    </Suspense>
  );
}

/**
 * Loading skeleton for verify request page
 */
function VerifyRequestSkeleton() {
  return (
    <div className="animate-pulse space-y-4 text-center">
      <div className="mx-auto h-16 w-16 rounded-full bg-slate-200" />
      <div className="mx-auto h-8 w-48 rounded bg-slate-200" />
      <div className="mx-auto h-6 w-64 rounded bg-slate-200" />
      <div className="mx-auto h-6 w-56 rounded bg-slate-200" />
    </div>
  );
}
