import type { ColorSpace } from './color';

export type ThemeMode = 'dark' | 'light' | 'system';
export type ExportFormat = 'json' | 'css' | 'scss' | 'tailwind' | 'svg' | 'png' | 'figma';

export interface AppSettings {
  theme: ThemeMode;
  accentColor: string;
  language: string;
  animationsEnabled: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  defaultColorFormat: ColorSpace;
  defaultExportFormat: ExportFormat;
  hasOnboarded: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  accentColor: '#863BFF',
  language: 'en',
  animationsEnabled: true,
  reducedMotion: false,
  highContrast: false,
  largeText: false,
  defaultColorFormat: 'hex',
  defaultExportFormat: 'json',
  hasOnboarded: false,
};
