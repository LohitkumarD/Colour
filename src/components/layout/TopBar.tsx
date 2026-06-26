import { useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import { NAV_ITEMS } from '@/config/navigation';
import { useUiStore } from '@/store/uiStore';
import { ThemeToggle } from './ThemeToggle';

export function TopBar() {
  const location = useLocation();
  const setCommandPaletteOpen = useUiStore((s) => s.setCommandPaletteOpen);
  const current = NAV_ITEMS.find((item) => (item.end ? location.pathname === item.path : location.pathname.startsWith(item.path)));

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-[var(--border-subtle)] bg-[var(--bg-base)]/70 px-4 py-3 backdrop-blur-xl sm:px-6">
      <h1 className="truncate text-lg font-bold text-[var(--text-primary)]">{current?.label ?? 'Color Theory Studio'}</h1>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setCommandPaletteOpen(true)}
          className="hidden items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--glass-bg)] px-3.5 py-1.5 text-sm text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-primary)] sm:flex"
        >
          <Search className="size-3.5" />
          <span>Search</span>
          <kbd className="rounded-md border border-[var(--border-subtle)] bg-[var(--glass-bg-strong)] px-1.5 py-0.5 text-[10px] font-semibold">
            ⌘K
          </kbd>
        </button>
        <button
          type="button"
          onClick={() => setCommandPaletteOpen(true)}
          aria-label="Search"
          className="flex size-9 items-center justify-center rounded-full text-[var(--text-tertiary)] transition-colors hover:bg-[var(--glass-bg)] hover:text-[var(--text-primary)] sm:hidden"
        >
          <Search className="size-[1.1rem]" />
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
