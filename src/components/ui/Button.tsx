import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

type NativeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd'
>;

interface ButtonProps extends NativeButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'gradient-brand text-white shadow-[var(--shadow-glow-primary)] hover:brightness-110 active:brightness-95',
  secondary: 'glass-panel-strong text-[var(--text-primary)] hover:bg-[var(--glass-bg-strong)]',
  ghost: 'bg-transparent text-[var(--text-secondary)] hover:bg-[var(--glass-bg)] hover:text-[var(--text-primary)]',
  outline: 'bg-transparent border border-[var(--border-strong)] text-[var(--text-primary)] hover:bg-[var(--glass-bg)]',
  danger: 'bg-error-600 text-white hover:bg-error-500 shadow-[0_0_24px_rgb(239_68_68/0.35)]',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm gap-1.5 rounded-[var(--radius-control)]',
  md: 'h-10 px-4 text-sm gap-2 rounded-[var(--radius-control)]',
  lg: 'h-12 px-6 text-base gap-2.5 rounded-[var(--radius-control)]',
  icon: 'h-10 w-10 rounded-[var(--radius-control)] p-0',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'primary', size = 'md', loading, leftIcon, rightIcon, children, disabled, ...props },
    ref,
  ) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.96 }}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={cn(
          'inline-flex select-none items-center justify-center whitespace-nowrap font-semibold transition-colors duration-200',
          'disabled:pointer-events-none disabled:opacity-50',
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? <Loader2 className="size-4 animate-spin" /> : leftIcon}
        {children}
        {!loading && rightIcon}
      </motion.button>
    );
  },
);

Button.displayName = 'Button';
