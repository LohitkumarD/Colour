import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  strong?: boolean;
  interactive?: boolean;
  children?: ReactNode;
}

export function Card({ className, strong, interactive, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        strong ? 'glass-panel-strong' : 'glass-panel',
        'shadow-[var(--shadow-card)]',
        interactive &&
          'cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)] hover:border-[var(--border-strong)]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center justify-between gap-3 p-5 pb-3', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-base font-bold text-[var(--text-primary)]', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-5 pt-0', className)} {...props}>
      {children}
    </div>
  );
}
