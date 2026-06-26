import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';

type NativeInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'suffix'>;

interface InputProps extends NativeInputProps {
  label?: string;
  error?: string;
  hint?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, prefix, suffix, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const hintId = `${inputId}-hint`;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[var(--text-secondary)]">
            {label}
          </label>
        )}
        <div
          className={cn(
            'flex h-11 items-center gap-2 rounded-[var(--radius-control)] border border-[var(--border-subtle)] bg-[var(--glass-bg)] px-3.5 transition-colors',
            'focus-within:border-accent-400/60 focus-within:ring-2 focus-within:ring-accent-400/20',
            error && 'border-error-500/60 focus-within:ring-error-500/20',
          )}
        >
          {prefix}
          <input
            ref={ref}
            id={inputId}
            aria-describedby={hint ? hintId : undefined}
            aria-invalid={!!error}
            className={cn(
              'h-full w-full bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)]',
              className,
            )}
            {...props}
          />
          {suffix}
        </div>
        {(hint || error) && (
          <p id={hintId} className={cn('text-xs', error ? 'text-error-400' : 'text-[var(--text-tertiary)]')}>
            {error || hint}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
