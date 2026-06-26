import { useEffect } from 'react';
import { useSettingsStore } from '@/store/settingsStore';
import { buildAccentRamp } from '@/utils/color/accentRamp';

function resolveTheme(theme: 'dark' | 'light' | 'system'): 'dark' | 'light' {
  if (theme !== 'system') return theme;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

/** Applies settingsStore preferences to `<html>` data-attributes so CSS tokens can react. */
export function useThemeEffect() {
  const theme = useSettingsStore((s) => s.theme);
  const reducedMotion = useSettingsStore((s) => s.reducedMotion);
  const highContrast = useSettingsStore((s) => s.highContrast);
  const largeText = useSettingsStore((s) => s.largeText);
  const accentColor = useSettingsStore((s) => s.accentColor);

  useEffect(() => {
    const ramp = buildAccentRamp(accentColor);
    const root = document.documentElement;
    for (const [step, hex] of Object.entries(ramp)) {
      root.style.setProperty(`--color-primary-${step}`, hex);
    }
  }, [accentColor]);

  useEffect(() => {
    const root = document.documentElement;
    const apply = () => {
      root.setAttribute('data-theme', resolveTheme(theme));
    };
    apply();

    if (theme !== 'system') return;
    const media = window.matchMedia('(prefers-color-scheme: light)');
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    root.setAttribute('data-motion', reducedMotion || prefersReduced ? 'reduced' : 'full');
  }, [reducedMotion]);

  useEffect(() => {
    document.documentElement.setAttribute('data-contrast', highContrast ? 'high' : 'normal');
  }, [highContrast]);

  useEffect(() => {
    document.documentElement.setAttribute('data-textsize', largeText ? 'large' : 'normal');
  }, [largeText]);
}
