import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/login-form';

/**
 * Login Page
 * Magic link authentication entry point
 */

export const metadata: Metadata = {
  title: 'Anmelden',
  description:
    'Melden Sie sich bei ForeverStory an. Sie erhalten einen sicheren Anmeldelink per E-Mail.',
  robots: {
    index: false, // Don't index auth pages
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <div>
      {/* Page heading */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-slate-900">
          Anmelden
        </h2>
        <p className="mt-2 text-base text-slate-600">
          Geben Sie Ihre E-Mail-Adresse ein, um einen Anmeldelink zu erhalten.
        </p>
      </div>

      {/* Login form */}
      <Suspense fallback={<LoginFormSkeleton />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

/**
 * Loading skeleton for login form
 */
function LoginFormSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-12 rounded-lg bg-slate-200" />
      <div className="h-12 rounded-lg bg-slate-200" />
      <div className="h-4 w-3/4 rounded bg-slate-200" />
    </div>
  );
}
