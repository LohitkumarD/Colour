import { forwardRef, useId } from 'react';
import type { ReactNode, SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  children: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, id, children, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-[var(--text-secondary)]">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'h-11 w-full appearance-none rounded-[var(--radius-control)] border border-[var(--border-subtle)] bg-[var(--glass-bg)] px-3.5 pr-9 text-sm text-[var(--text-primary)] outline-none transition-colors',
              'focus-visible:border-accent-400/60 focus-visible:ring-2 focus-visible:ring-accent-400/20',
              className,
            )}
            {...props}
          >
            {children}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[var(--text-tertiary)]" />
        </div>
      </div>
    );
  },
);

Select.displayName = 'Select';
