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

const ROUTE_DESCRIPTIONS: Record<string, string> = {
  '/': 'Your color workspace — recent colors, saved palettes and quick links to every tool.',
  '/wheel': 'Pick colors visually on an interactive hue and saturation wheel with live harmony previews.',
  '/converter': 'Convert colors between HEX, RGB, HSL, HSV, CMYK, LAB, XYZ, LCH, OKLab and OKLCH.',
  '/harmony': 'Generate complementary, analogous, triadic and other color harmony palettes from a base color.',
  '/tones': 'Build tints, shades and tones from a base color with adjustable steps.',
  '/gradients': 'Design linear, radial and mesh gradients and export them as CSS.',
  '/mixer': 'Mix paints and pigments like real media with realistic color-mixing math.',
  '/pigment-wheel': 'Explore an artist pigment wheel for traditional color mixing relationships.',
  '/extract': 'Pull a color palette out of any image.',
  '/contrast': 'Check WCAG contrast ratios between foreground and background colors for accessible design.',
  '/blindness': 'Simulate how colors appear under different types of color blindness.',
  '/palettes': 'Manage, organize and export your saved color palettes and projects.',
  '/assistant': 'Generate a color palette from a plain-language prompt.',
  '/learn': 'Short lessons on color theory fundamentals, harmony rules and accessibility.',
  '/settings': 'Customize theme, accessibility, defaults and manage your data.',
  '/about': 'About Color Theory Studio — a premium, offline-first color science workbench.',
  '/privacy': 'Privacy policy for Color Theory Studio.',
  '/terms': 'Terms of use for Color Theory Studio.',
};

function useRouteTitle() {
  const location = useLocation();
  useEffect(() => {
    const name = ROUTE_TITLES[location.pathname];
    document.title = name ? `${name} · Color Theory Studio` : 'Color Theory Studio';

    const description = ROUTE_DESCRIPTIONS[location.pathname];
    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    }
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
