import * as React from 'react';
import { cn } from '@/lib/utils/cn';
import { countWords } from '@/lib/utils/format';

/**
 * Textarea Component
 * 
 * Optimized for story writing with word count
 * and auto-resize functionality
 */

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Error message to display */
  error?: string;
  /** Help text below textarea */
  helpText?: string;
  /** Label for the textarea */
  label?: string;
  /** Is the field required? */
  required?: boolean;
  /** Show word count */
  showWordCount?: boolean;
  /** Maximum word count (for display, not validation) */
  maxWords?: number;
  /** Auto-resize based on content */
  autoResize?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      error,
      helpText,
      label,
      required,
      showWordCount = false,
      maxWords,
      autoResize = false,
      id,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const textareaId = id || React.useId();
    const errorId = `${textareaId}-error`;
    const helpId = `${textareaId}-help`;
    const internalRef = React.useRef<HTMLTextAreaElement>(null);

    // Merge refs
    React.useImperativeHandle(ref, () => internalRef.current!);

    // Calculate word count
    const wordCount = React.useMemo(() => {
      if (!showWordCount) return 0;
      const text = typeof value === 'string' ? value : '';
      return countWords(text);
    }, [value, showWordCount]);

    // Auto-resize handler
    const handleResize = React.useCallback(() => {
      if (autoResize && internalRef.current) {
        internalRef.current.style.height = 'auto';
        internalRef.current.style.height = `${internalRef.current.scrollHeight}px`;
      }
    }, [autoResize]);

    React.useEffect(() => {
      handleResize();
    }, [value, handleResize]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e);
      handleResize();
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="mb-2 block text-base font-medium text-slate-900"
          >
            {label}
            {required && <span className="ml-1 text-red-600">*</span>}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={internalRef}
          value={value}
          onChange={handleChange}
          className={cn(
            // Base styles
            'flex min-h-[200px] w-full rounded-lg border-2 bg-white px-4 py-3 text-base text-slate-900 transition-colors',
            // Placeholder styling
            'placeholder:text-slate-400',
            // Focus states
            'focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20',
            // Disabled state
            'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500',
            // Resize behavior
            autoResize ? 'resize-none overflow-hidden' : 'resize-y',
            // Error state
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
              : 'border-slate-300',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? errorId : helpText ? helpId : undefined
          }
          {...props}
        />
        <div className="mt-2 flex items-center justify-between">
          <div>
            {error && (
              <p id={errorId} className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
            {helpText && !error && (
              <p id={helpId} className="text-sm text-slate-500">
                {helpText}
              </p>
            )}
          </div>
          {showWordCount && (
            <p
              className={cn(
                'text-sm',
                maxWords && wordCount > maxWords
                  ? 'text-red-600'
                  : 'text-slate-500'
              )}
            >
              {wordCount.toLocaleString('de-DE')} Wörter
              {maxWords && ` / ${maxWords.toLocaleString('de-DE')}`}
            </p>
          )}
        </div>
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
