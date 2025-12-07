import * as React from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * Input Component
 * 
 * Following CLAUDE.md accessibility requirements:
 * - Minimum font size: 16px (prevents iOS zoom)
 * - Clear focus states
 * - High contrast support
 */

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Error message to display */
  error?: string;
  /** Help text below input */
  helpText?: string;
  /** Label for the input */
  label?: string;
  /** Is the field required? */
  required?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, helpText, label, required, id, ...props }, ref) => {
    const inputId = id || React.useId();
    const errorId = `${inputId}-error`;
    const helpId = `${inputId}-help`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-2 block text-base font-medium text-slate-900"
          >
            {label}
            {required && <span className="ml-1 text-red-600">*</span>}
          </label>
        )}
        <input
          type={type}
          id={inputId}
          className={cn(
            // Base styles - 16px minimum font size, adequate padding for touch
            'flex h-12 w-full rounded-lg border-2 bg-white px-4 py-3 text-base text-slate-900 transition-colors',
            // Placeholder styling
            'placeholder:text-slate-400',
            // Focus states - high visibility
            'focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20',
            // Disabled state
            'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500',
            // Error state
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
              : 'border-slate-300',
            // File input styling
            type === 'file' &&
              'file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-emerald-700 hover:file:bg-emerald-100',
            className
          )}
          ref={ref}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? errorId : helpText ? helpId : undefined
          }
          {...props}
        />
        {error && (
          <p id={errorId} className="mt-2 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {helpText && !error && (
          <p id={helpId} className="mt-2 text-sm text-slate-500">
            {helpText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
