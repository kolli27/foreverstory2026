import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

/**
 * Button Component
 * 
 * Following CLAUDE.md accessibility requirements:
 * - Minimum touch target: 44x44px
 * - High contrast support
 * - Keyboard navigable
 */

const buttonVariants = cva(
  // Base styles - ensuring 44px minimum touch target for elderly users
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-base font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-700',
        primary:
          'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800',
        destructive:
          'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
        outline:
          'border-2 border-slate-300 bg-white text-slate-900 hover:bg-slate-50 hover:border-slate-400',
        secondary:
          'bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300',
        ghost:
          'text-slate-900 hover:bg-slate-100 active:bg-slate-200',
        link:
          'text-emerald-600 underline-offset-4 hover:underline',
      },
      size: {
        // All sizes meet 44px minimum height for touch targets
        default: 'h-12 px-6 py-3',
        sm: 'h-11 px-4 py-2 text-sm',
        lg: 'h-14 px-8 py-4 text-lg',
        xl: 'h-16 px-10 py-5 text-xl', // Extra large for primary CTAs
        icon: 'h-12 w-12', // Square icon button, meets 44px minimum
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render as child element (for use with Link) */
  asChild?: boolean;
  /** Show loading spinner */
  loading?: boolean;
  /** Left icon */
  leftIcon?: React.ReactNode;
  /** Right icon */
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    
    // Only pass button-specific props when not using asChild
    const buttonProps = asChild
      ? {}
      : {
          disabled: disabled || loading,
          'aria-disabled': disabled || loading,
        };
    
    // When asChild is true, we can't have multiple children due to Slot limitation
    // So we only render the children directly
    if (asChild) {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, fullWidth, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Comp>
      );
    }
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        {...buttonProps}
        {...props}
      >
        {loading ? (
          <LoadingSpinner className="mr-2" />
        ) : leftIcon ? (
          <span className="mr-2">{leftIcon}</span>
        ) : null}
        {children}
        {rightIcon && !loading && <span className="ml-2">{rightIcon}</span>}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

/**
 * Loading Spinner for button loading state
 */
function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-5 w-5 animate-spin', className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export { Button, buttonVariants };
