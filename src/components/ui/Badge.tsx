import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

type BadgeVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  neutral: 'bg-[var(--glass-bg-strong)] text-[var(--text-secondary)]',
  primary: 'bg-primary-500/15 text-primary-300',
  success: 'bg-success-500/15 text-success-400',
  warning: 'bg-warning-500/15 text-warning-400',
  error: 'bg-error-500/15 text-error-400',
  info: 'bg-info-500/15 text-info-400',
};

export function Badge({ className, variant = 'neutral', children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
