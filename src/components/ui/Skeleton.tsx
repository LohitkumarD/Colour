import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-shimmer rounded-[var(--radius-control)] bg-[linear-gradient(110deg,var(--glass-bg)_8%,var(--glass-bg-strong)_18%,var(--glass-bg)_33%)] bg-[length:200%_100%]',
        className,
      )}
      {...props}
    />
  );
}

export function SkeletonText({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <Skeleton className={cn('h-4 w-full', className)} {...props} />;
}

export function SkeletonCard({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('glass-panel space-y-3 p-5', className)} {...props}>
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}
