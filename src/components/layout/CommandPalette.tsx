import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CornerDownLeft, Search } from 'lucide-react';
import { NAV_ITEMS } from '@/config/navigation';
import { useUiStore } from '@/store/uiStore';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { cn } from '@/utils/cn';

export function CommandPalette() {
  const open = useUiStore((s) => s.commandPaletteOpen);
  const setOpen = useUiStore((s) => s.setCommandPaletteOpen);
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useFocusTrap(open, () => setOpen(false));

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return NAV_ITEMS;
    return NAV_ITEMS.filter((item) => item.label.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, setOpen]);

  const select = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[activeIndex]) {
      e.preventDefault();
      select(results[activeIndex].path);
    }
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[150] flex items-start justify-center px-4 pt-[12vh] sm:pt-[18vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/65 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <motion.div
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -4 }}
            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
            className="glass-panel-strong relative z-10 w-full max-w-lg overflow-hidden shadow-[var(--shadow-elevated)]"
          >
            <div className="flex items-center gap-3 border-b border-[var(--border-subtle)] px-4 py-3.5">
              <Search className="size-4 shrink-0 text-[var(--text-tertiary)]" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search modules…"
                aria-label="Search modules"
                className="w-full bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)]"
              />
              <kbd className="shrink-0 rounded-md border border-[var(--border-subtle)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--text-tertiary)]">
                Esc
              </kbd>
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              {results.length === 0 && (
                <p className="px-3 py-6 text-center text-sm text-[var(--text-tertiary)]">No matches found.</p>
              )}
              {results.map((item, index) => (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => select(item.path)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-[var(--radius-control)] px-3 py-2.5 text-left text-sm font-medium transition-colors',
                    index === activeIndex
                      ? 'bg-[var(--glass-bg-strong)] text-[var(--text-primary)]'
                      : 'text-[var(--text-secondary)]',
                  )}
                >
                  <item.icon className="size-4 shrink-0" />
                  <span className="flex-1 truncate">{item.label}</span>
                  {index === activeIndex && <CornerDownLeft className="size-3.5 shrink-0 text-[var(--text-tertiary)]" />}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
