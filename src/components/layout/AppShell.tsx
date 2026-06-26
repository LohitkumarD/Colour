import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { BottomNav } from './BottomNav';
import { Fab } from './Fab';
import { CommandPalette } from './CommandPalette';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { useThemeEffect } from '@/hooks/useThemeEffect';

function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 className="size-6 animate-spin text-[var(--text-tertiary)]" />
    </div>
  );
}

export function AppShell() {
  useThemeEffect();

  return (
    <div className="flex min-h-dvh bg-[var(--bg-base)]">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Sidebar />
      <div className="flex min-h-dvh flex-1 flex-col">
        <TopBar />
        <main id="main-content" className="flex-1 px-4 pb-24 pt-4 sm:px-6 sm:pb-8 lg:px-8">
          <Suspense fallback={<RouteFallback />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
      <BottomNav />
      <Fab />
      <CommandPalette />
      <ToastContainer />
    </div>
  );
}
