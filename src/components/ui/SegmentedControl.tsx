import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  'aria-label'?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
  ...aria
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={aria['aria-label']}
      className={cn('inline-flex gap-1 rounded-[var(--radius-control)] bg-[var(--glass-bg)] p-1', className)}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={cn(
              'relative flex items-center gap-1.5 rounded-[calc(var(--radius-control)-4px)] px-3 py-1.5 text-sm font-medium transition-colors',
              active ? 'text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
            )}
          >
            {active && (
              <motion.span
                layoutId={`segmented-${aria['aria-label'] ?? 'control'}`}
                className="gradient-brand absolute inset-0 rounded-[calc(var(--radius-control)-4px)]"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {option.icon}
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
