import type { LucideIcon } from 'lucide-react';
import {
  Blend,
  Contrast,
  Disc3,
  Droplet,
  Eye,
  GraduationCap,
  Image,
  LayoutDashboard,
  Library,
  Palette,
  Repeat,
  Settings,
  Sparkles,
  Waves,
} from 'lucide-react';

export interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { path: '/wheel', label: 'Color Wheel', icon: Disc3 },
  { path: '/converter', label: 'Converter', icon: Repeat },
  { path: '/harmony', label: 'Harmony', icon: Palette },
  { path: '/tones', label: 'Tints & Shades', icon: Droplet },
  { path: '/gradients', label: 'Gradients', icon: Waves },
  { path: '/mixer', label: 'Mixer', icon: Blend },
  { path: '/extract', label: 'Image Extractor', icon: Image },
  { path: '/contrast', label: 'Contrast Checker', icon: Contrast },
  { path: '/blindness', label: 'Color Blindness', icon: Eye },
  { path: '/palettes', label: 'Palettes', icon: Library },
  { path: '/assistant', label: 'AI Assistant', icon: Sparkles },
  { path: '/learn', label: 'Learning Hub', icon: GraduationCap },
  { path: '/settings', label: 'Settings', icon: Settings },
];

/** Subset shown in the mobile bottom tab bar — keep to 5 for thumb reach. */
export const MOBILE_NAV_ITEMS: NavItem[] = [
  NAV_ITEMS[0],
  NAV_ITEMS[1],
  NAV_ITEMS[3],
  NAV_ITEMS[10],
  NAV_ITEMS[13],
];
