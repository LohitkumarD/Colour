import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { BottomNav } from './BottomNav';
import { Fab } from './Fab';
import { CommandPalette } from './CommandPalette';
import { OnboardingModal } from './OnboardingModal';
import { PwaManager } from './PwaManager';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { useThemeEffect } from '@/hooks/useThemeEffect';
import { usePaletteStore } from '@/store/paletteStore';
import { useLearningStore } from '@/store/learningStore';

function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 className="size-6 animate-spin text-[var(--text-tertiary)]" />
    </div>
  );
}

const ROUTE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/wheel': 'Color Wheel',
  '/converter': 'Converter',
  '/harmony': 'Harmony',
  '/tones': 'Tints & Shades',
  '/gradients': 'Gradients',
  '/mixer': 'Mixer',
  '/pigment-wheel': 'Pigment Wheel',
  '/extract': 'Image Extractor',
  '/contrast': 'Contrast Checker',
  '/blindness': 'Color Blindness',
  '/palettes': 'Palettes',
  '/assistant': 'AI Assistant',
  '/learn': 'Learning Hub',
  '/settings': 'Settings',
  '/about': 'About',
  '/privacy': 'Privacy',
  '/terms': 'Terms',
};

function useRouteTitle() {
  const location = useLocation();
  useEffect(() => {
    const name = ROUTE_TITLES[location.pathname];
    document.title = name ? `${name} · Color Theory Studio` : 'Color Theory Studio';
  }, [location.pathname]);
}

export function AppShell() {
  useThemeEffect();
  useRouteTitle();

  const paletteHydrated = usePaletteStore((s) => s.hydrated);
  const hydratePalettes = usePaletteStore((s) => s.hydrate);
  const learningHydrated = useLearningStore((s) => s.hydrated);
  const hydrateLearning = useLearningStore((s) => s.hydrate);

  useEffect(() => {
    if (!paletteHydrated) hydratePalettes();
    if (!learningHydrated) hydrateLearning();
  }, [paletteHydrated, hydratePalettes, learningHydrated, hydrateLearning]);

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
      <OnboardingModal />
      <PwaManager />
      <ToastContainer />
    </div>
  );
}
