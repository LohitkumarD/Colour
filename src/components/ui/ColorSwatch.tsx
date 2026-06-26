import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/utils/cn';
import { hexToRgb } from '@/utils/color/conversions';
import { relativeLuminance } from '@/utils/color/contrast';
import { useUiStore } from '@/store/uiStore';

interface ColorSwatchProps {
  hex: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  copyOnClick?: boolean;
}

const sizeClasses: Record<NonNullable<ColorSwatchProps['size']>, string> = {
  sm: 'size-8',
  md: 'size-12',
  lg: 'size-16',
  xl: 'size-24',
};

export function ColorSwatch({
  hex,
  label,
  size = 'md',
  selected,
  onClick,
  className,
  copyOnClick = true,
}: ColorSwatchProps) {
  const [copied, setCopied] = useState(false);
  const addToast = useUiStore((s) => s.addToast);
  const isLight = relativeLuminance(hexToRgb(hex)) > 0.5;

  const handleClick = async () => {
    onClick?.();
    if (!copyOnClick) return;
    try {
      await navigator.clipboard.writeText(hex.toUpperCase());
      setCopied(true);
      addToast({ message: `Copied ${hex.toUpperCase()}`, variant: 'success', duration: 1600 });
      setTimeout(() => setCopied(false), 1200);
    } catch {
      addToast({ message: 'Copy failed', variant: 'error' });
    }
  };

  return (
    <div className={cn('inline-flex flex-col items-center gap-1.5', className)}>
      <motion.button
        type="button"
        onClick={handleClick}
        whileTap={{ scale: 0.94 }}
        whileHover={{ scale: 1.04 }}
        transition={{ type: 'spring', stiffness: 460, damping: 30 }}
        aria-label={label ? `${label}: ${hex}` : hex}
        style={{ backgroundColor: hex }}
        className={cn(
          'relative flex shrink-0 items-center justify-center rounded-2xl border shadow-[var(--shadow-card)]',
          selected ? 'border-[var(--text-primary)] ring-2 ring-[var(--text-primary)]/40' : 'border-[var(--border-subtle)]',
          sizeClasses[size],
        )}
      >
        {copied && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn('absolute inset-0 flex items-center justify-center rounded-2xl', isLight ? 'text-black/70' : 'text-white/90')}
          >
            <Check className="size-1/3" />
          </motion.span>
        )}
        {!copied && copyOnClick && (
          <span
            className={cn(
              'absolute inset-0 flex items-center justify-center rounded-2xl opacity-0 transition-opacity hover:opacity-100',
              isLight ? 'text-black/60' : 'text-white/80',
            )}
          >
            <Copy className="size-1/3" />
          </span>
        )}
      </motion.button>
      {label && <span className="text-xs font-medium text-[var(--text-secondary)]">{label}</span>}
    </div>
  );
}
