import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 px-6 py-12 text-center', className)}>
      {Icon && (
        <div className="flex size-14 items-center justify-center rounded-full bg-[var(--glass-bg-strong)] text-[var(--text-tertiary)]">
          <Icon className="size-7" />
        </div>
      )}
      <div className="space-y-1">
        <p className="text-sm font-semibold text-[var(--text-primary)]">{title}</p>
        {description && <p className="max-w-sm text-sm text-[var(--text-secondary)]">{description}</p>}
      </div>
      {action}
    </div>
  );
}
