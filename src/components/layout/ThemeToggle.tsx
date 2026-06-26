import { Monitor, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ThemeMode } from '@/types/settings';
import { useSettingsStore } from '@/store/settingsStore';
import { cn } from '@/utils/cn';

const OPTIONS: { value: ThemeMode; icon: typeof Sun; label: string }[] = [
  { value: 'light', icon: Sun, label: 'Light theme' },
  { value: 'dark', icon: Moon, label: 'Dark theme' },
  { value: 'system', icon: Monitor, label: 'System theme' },
];

export function ThemeToggle() {
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);

  return (
    <div className="relative flex items-center gap-0.5 rounded-full bg-[var(--glass-bg)] p-1">
      {OPTIONS.map((opt) => {
        const active = theme === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-label={opt.label}
            aria-pressed={active}
            onClick={() => setTheme(opt.value)}
            className={cn(
              'relative z-0 flex size-7 items-center justify-center rounded-full transition-colors',
              active ? 'text-[var(--text-inverse)]' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]',
            )}
          >
            {active && (
              <motion.span
                layoutId="theme-toggle-pill"
                className="absolute inset-0 -z-10 rounded-full bg-[var(--text-primary)]"
                transition={{ type: 'spring', stiffness: 420, damping: 36 }}
              />
            )}
            <opt.icon className="relative z-10 size-3.5" />
          </button>
        );
      })}
    </div>
  );
}
