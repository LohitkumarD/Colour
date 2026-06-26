import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useUiStore } from '@/store/uiStore';

interface CopyFieldProps {
  label?: string;
  value: string;
  className?: string;
  monospace?: boolean;
}

export function CopyField({ label, value, className, monospace = true }: CopyFieldProps) {
  const [copied, setCopied] = useState(false);
  const addToast = useUiStore((s) => s.addToast);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      addToast({ message: 'Copy failed', variant: 'error' });
    }
  };

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 rounded-[var(--radius-control)] border border-[var(--border-subtle)] bg-[var(--glass-bg)] px-3.5 py-2.5',
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        {label && <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">{label}</p>}
        <p className={cn('truncate text-sm text-[var(--text-primary)]', monospace && 'font-mono')}>{value}</p>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={`Copy ${label ?? value}`}
        className="relative flex size-8 shrink-0 items-center justify-center rounded-lg text-[var(--text-tertiary)] transition-colors hover:bg-[var(--glass-bg-strong)] hover:text-[var(--text-primary)]"
      >
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.span
              key="check"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.15 }}
              className="text-success-400"
            >
              <Check className="size-4" />
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.15 }}
            >
              <Copy className="size-4" />
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
