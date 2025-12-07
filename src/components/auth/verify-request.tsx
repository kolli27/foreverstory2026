'use client';

/**
 * Verify Request Component
 * "Check your email" message shown after magic link is sent
 *
 * Features:
 * - Clear German instructions
 * - Large, readable text (16px+)
 * - Resend link option
 * - High contrast design for elderly users
 */

import * as React from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';

// ============================================
// Component Props
// ============================================

export interface VerifyRequestProps {
  /** Email address that was sent the magic link */
  email: string;
  /** Additional CSS classes */
  className?: string;
}

// ============================================
// Verify Request Component
// ============================================

export function VerifyRequest({ email, className }: VerifyRequestProps) {
  const [isResending, setIsResending] = React.useState(false);
  const [resendSuccess, setResendSuccess] = React.useState(false);
  const [resendError, setResendError] = React.useState<string | null>(null);
  const [canResend, setCanResend] = React.useState(false);

  // Enable resend button after 60 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setCanResend(true);
    }, 60000); // 60 seconds

    return () => clearTimeout(timer);
  }, []);

  // ============================================
  // Resend Handler
  // ============================================

  const handleResend = async () => {
    setIsResending(true);
    setResendError(null);
    setResendSuccess(false);

    try {
      // Trigger another magic link email
      const result = await signIn('email', {
        email,
        redirect: false,
      });

      if (result?.error) {
        setResendError(
          'Die E-Mail konnte nicht erneut gesendet werden. Bitte versuchen Sie es später erneut.'
        );
      } else {
        setResendSuccess(true);
        // Reset resend ability
        setCanResend(false);
        setTimeout(() => setCanResend(true), 60000);
      }
    } catch (err) {
      console.error('Resend error:', err);
      setResendError(
        'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.'
      );
    } finally {
      setIsResending(false);
    }
  };

  // ============================================
  // Render
  // ============================================

  return (
    <div className={className}>
      {/* Success icon */}
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
        <svg
          className="h-8 w-8 text-emerald-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </div>

      {/* Main heading */}
      <h1 className="mb-4 text-center text-2xl font-bold text-slate-900">
        E-Mail gesendet!
      </h1>

      {/* Instructions */}
      <div className="mb-6 space-y-4">
        <p className="text-center text-lg text-slate-700">
          Bitte prüfen Sie Ihr Postfach.
        </p>

        <p className="text-center text-base text-slate-600">
          Wir haben einen Anmeldelink an{' '}
          <span className="font-medium text-slate-900">{email}</span> gesendet.
        </p>

        <p className="text-center text-base text-slate-600">
          Klicken Sie auf den Link in der E-Mail, um sich anzumelden.
        </p>

        <p className="text-center text-sm text-slate-500">
          Der Link ist 24 Stunden gültig.
        </p>
      </div>

      {/* Troubleshooting tips */}
      <div className="mb-6 rounded-lg border-2 border-slate-200 bg-slate-50 p-4">
        <h2 className="mb-3 text-base font-semibold text-slate-900">
          E-Mail nicht erhalten?
        </h2>
        <ul className="space-y-2 text-sm text-slate-600">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Prüfen Sie Ihren Spam-Ordner</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Warten Sie 1-2 Minuten, die Zustellung kann etwas dauern</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Stellen Sie sicher, dass die E-Mail-Adresse korrekt ist</span>
          </li>
        </ul>
      </div>

      {/* Resend success message */}
      {resendSuccess && (
        <div
          className="mb-4 rounded-lg border-2 border-emerald-200 bg-emerald-50 p-4"
          role="alert"
          aria-live="polite"
        >
          <p className="text-base text-emerald-800">
            ✓ E-Mail wurde erneut gesendet!
          </p>
        </div>
      )}

      {/* Resend error message */}
      {resendError && (
        <div
          className="mb-4 rounded-lg border-2 border-red-200 bg-red-50 p-4"
          role="alert"
          aria-live="polite"
        >
          <p className="text-base text-red-800">{resendError}</p>
        </div>
      )}

      {/* Resend button */}
      <Button
        onClick={handleResend}
        variant="outline"
        size="default"
        fullWidth
        loading={isResending}
        disabled={!canResend || isResending}
        aria-label="Anmeldelink erneut senden"
      >
        {isResending
          ? 'Wird gesendet...'
          : canResend
            ? 'Link erneut senden'
            : 'Link erneut senden (bitte warten)'}
      </Button>

      {/* Back to login */}
      <div className="mt-6 text-center">
        <a
          href="/login"
          className="text-base text-emerald-600 underline hover:text-emerald-700"
        >
          ← Zurück zur Anmeldung
        </a>
      </div>
    </div>
  );
}
