'use client';

/**
 * Auth Error Component
 * Displays authentication errors in German with user-friendly explanations
 *
 * Features:
 * - Maps NextAuth errors to German messages
 * - Clear, accessible error display
 * - Recovery options for users
 * - High contrast for elderly users
 */

import { Button } from '@/components/ui/button';
import { AUTH_ERROR_MESSAGES, type AuthError } from '@/types/auth';

// ============================================
// Component Props
// ============================================

export interface AuthErrorProps {
  /** Error code or message */
  error: AuthError | string | null;
  /** Callback when user clicks retry button */
  onRetry?: () => void;
  /** Additional CSS classes */
  className?: string;
}

// ============================================
// Auth Error Component
// ============================================

export function AuthError({ error, onRetry, className }: AuthErrorProps) {
  // If no error, don't render anything
  if (!error) return null;

  // Map error to German message
  const errorMessage = getErrorMessage(error);

  // ============================================
  // Render
  // ============================================

  return (
    <div className={className}>
      {/* Error icon */}
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <svg
          className="h-8 w-8 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      {/* Error heading */}
      <h1 className="mb-4 text-center text-2xl font-bold text-slate-900">
        Anmeldung fehlgeschlagen
      </h1>

      {/* Error message */}
      <div
        className="mb-6 rounded-lg border-2 border-red-200 bg-red-50 p-6"
        role="alert"
        aria-live="polite"
      >
        <p className="text-center text-lg text-red-800">{errorMessage}</p>
      </div>

      {/* Help section */}
      <div className="mb-6 rounded-lg border-2 border-slate-200 bg-slate-50 p-4">
        <h2 className="mb-3 text-base font-semibold text-slate-900">
          Was können Sie tun?
        </h2>
        <ul className="space-y-2 text-sm text-slate-600">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Versuchen Sie es erneut mit einem neuen Anmeldelink</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Stellen Sie sicher, dass Ihre E-Mail-Adresse korrekt ist</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Prüfen Sie Ihre Internetverbindung</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>
              Kontaktieren Sie unseren Support, wenn das Problem weiterhin besteht
            </span>
          </li>
        </ul>
      </div>

      {/* Action buttons */}
      <div className="space-y-3">
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="primary"
            size="lg"
            fullWidth
            aria-label="Erneut versuchen"
          >
            Erneut versuchen
          </Button>
        )}

        <Button
          asChild
          variant="outline"
          size="default"
          fullWidth
        >
          <a href="/login">Zurück zur Anmeldung</a>
        </Button>
      </div>

      {/* Support contact */}
      <div className="mt-6 text-center">
        <p className="text-sm text-slate-600">
          Benötigen Sie Hilfe?{' '}
          <a
            href="mailto:support@foreverstory.de"
            className="text-emerald-600 underline hover:text-emerald-700"
          >
            Kontaktieren Sie unseren Support
          </a>
        </p>
      </div>
    </div>
  );
}

// ============================================
// Helper Functions
// ============================================

/**
 * Maps error codes to German error messages
 */
function getErrorMessage(error: AuthError | string): string {
  // Check if error is a known AuthError type
  if (isAuthError(error)) {
    return AUTH_ERROR_MESSAGES[error];
  }

  // Handle common error strings
  const lowerError = error.toLowerCase();

  if (lowerError.includes('verification')) {
    return AUTH_ERROR_MESSAGES.Verification;
  }

  if (lowerError.includes('email')) {
    return AUTH_ERROR_MESSAGES.EmailSignin;
  }

  if (lowerError.includes('access') || lowerError.includes('denied')) {
    return AUTH_ERROR_MESSAGES.AccessDenied;
  }

  if (lowerError.includes('session')) {
    return AUTH_ERROR_MESSAGES.SessionRequired;
  }

  // Default error message
  return AUTH_ERROR_MESSAGES.Default;
}

/**
 * Type guard to check if error is a known AuthError
 */
function isAuthError(error: string): error is AuthError {
  return error in AUTH_ERROR_MESSAGES;
}
