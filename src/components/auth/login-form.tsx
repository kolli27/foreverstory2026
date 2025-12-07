'use client';

/**
 * Login Form Component
 * German magic link authentication form for elderly users
 *
 * Features:
 * - Large, accessible inputs (16px+ font)
 * - German labels and validation
 * - Clear error messages
 * - Loading states
 * - ARIA labels for screen readers
 */

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// ============================================
// Validation Schema
// ============================================

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Bitte geben Sie Ihre E-Mail-Adresse ein.')
    .email('Bitte geben Sie eine gültige E-Mail-Adresse ein.')
    .toLowerCase()
    .trim(),
});

type LoginFormData = z.infer<typeof loginSchema>;

// ============================================
// Component Props
// ============================================

export interface LoginFormProps {
  /** Redirect URL after successful login */
  callbackUrl?: string;
  /** Additional CSS classes */
  className?: string;
}

// ============================================
// Login Form Component
// ============================================

export function LoginForm({ callbackUrl, className }: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Get callback URL from props or search params
  const redirectUrl = callbackUrl || searchParams?.get('callbackUrl') || '/';

  // Form setup with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // ============================================
  // Submit Handler
  // ============================================

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Trigger NextAuth email sign in
      const result = await signIn('email', {
        email: data.email,
        redirect: false,
        callbackUrl: redirectUrl,
      });

      if (result?.error) {
        // Handle sign-in error
        setError(
          'Die E-Mail konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.'
        );
        setIsLoading(false);
      } else {
        // Redirect to verify-request page
        router.push(`/verify-request?email=${encodeURIComponent(data.email)}`);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(
        'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.'
      );
      setIsLoading(false);
    }
  };

  // ============================================
  // Render
  // ============================================

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className} noValidate>
      {/* Global error message */}
      {error && (
        <div
          className="mb-6 rounded-lg border-2 border-red-200 bg-red-50 p-4"
          role="alert"
          aria-live="polite"
        >
          <p className="text-base text-red-800">{error}</p>
        </div>
      )}

      {/* Email input field */}
      <Input
        {...register('email')}
        type="email"
        label="E-Mail-Adresse"
        placeholder="ihre.email@beispiel.de"
        error={errors.email?.message}
        required
        disabled={isLoading}
        autoComplete="email"
        autoFocus
        aria-label="E-Mail-Adresse für Anmeldung"
      />

      {/* Help text */}
      <p className="mt-3 text-sm text-slate-600">
        Sie erhalten einen Anmeldelink per E-Mail. Dieser ist 24 Stunden gültig.
      </p>

      {/* Submit button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={isLoading}
        disabled={isLoading}
        className="mt-6"
      >
        {isLoading ? 'Wird gesendet...' : 'Anmeldelink senden'}
      </Button>

      {/* Privacy notice */}
      <p className="mt-6 text-center text-sm text-slate-500">
        Mit der Anmeldung akzeptieren Sie unsere{' '}
        <a
          href="/datenschutz"
          className="text-emerald-600 underline hover:text-emerald-700"
        >
          Datenschutzerklärung
        </a>
        .
      </p>
    </form>
  );
}
