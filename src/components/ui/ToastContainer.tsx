import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useUiStore } from '@/store/uiStore';
import type { ToastVariant } from '@/store/uiStore';
import { cn } from '@/utils/cn';

const variantIcon: Record<ToastVariant, LucideIcon> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const variantClasses: Record<ToastVariant, string> = {
  success: 'text-success-400',
  error: 'text-error-400',
  warning: 'text-warning-400',
  info: 'text-info-400',
};

export function ToastContainer() {
  const toasts = useUiStore((s) => s.toasts);
  const removeToast = useUiStore((s) => s.removeToast);

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[200] flex flex-col items-center gap-2 px-4 sm:items-end sm:right-4 sm:left-auto">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = variantIcon[toast.variant];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              className="glass-panel-strong pointer-events-auto flex w-full max-w-sm items-start gap-3 p-3.5 shadow-[var(--shadow-elevated)] sm:w-96"
              role="status"
            >
              <Icon className={cn('mt-0.5 size-5 shrink-0', variantClasses[toast.variant])} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[var(--text-primary)]">{toast.message}</p>
                {toast.description && <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{toast.description}</p>}
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                aria-label="Dismiss notification"
                className="shrink-0 rounded-full p-1 text-[var(--text-tertiary)] transition-colors hover:bg-[var(--glass-bg)] hover:text-[var(--text-primary)]"
              >
                <X className="size-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>,
    document.body,
  );
}
