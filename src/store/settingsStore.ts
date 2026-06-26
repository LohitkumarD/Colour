import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_SETTINGS, type AppSettings } from '@/types/settings';

interface SettingsState extends AppSettings {
  setTheme: (theme: AppSettings['theme']) => void;
  setAccentColor: (color: string) => void;
  setLanguage: (language: string) => void;
  toggleAnimations: (enabled?: boolean) => void;
  toggleReducedMotion: (enabled?: boolean) => void;
  toggleHighContrast: (enabled?: boolean) => void;
  toggleLargeText: (enabled?: boolean) => void;
  setDefaultColorFormat: (format: AppSettings['defaultColorFormat']) => void;
  setDefaultExportFormat: (format: AppSettings['defaultExportFormat']) => void;
  completeOnboarding: () => void;
  resetSettings: () => void;
  hydrateFromBackup: (settings: Partial<AppSettings>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      setTheme: (theme) => set({ theme }),
      setAccentColor: (accentColor) => set({ accentColor }),
      setLanguage: (language) => set({ language }),
      toggleAnimations: (enabled) =>
        set((state) => ({ animationsEnabled: enabled ?? !state.animationsEnabled })),
      toggleReducedMotion: (enabled) =>
        set((state) => ({ reducedMotion: enabled ?? !state.reducedMotion })),
      toggleHighContrast: (enabled) =>
        set((state) => ({ highContrast: enabled ?? !state.highContrast })),
      toggleLargeText: (enabled) => set((state) => ({ largeText: enabled ?? !state.largeText })),
      setDefaultColorFormat: (defaultColorFormat) => set({ defaultColorFormat }),
      setDefaultExportFormat: (defaultExportFormat) => set({ defaultExportFormat }),
      completeOnboarding: () => set({ hasOnboarded: true }),
      resetSettings: () => set({ ...DEFAULT_SETTINGS }),
      hydrateFromBackup: (settings) => set((state) => ({ ...state, ...settings })),
    }),
    { name: 'cts-settings' },
  ),
);
