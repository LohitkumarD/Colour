import type { HarmonyRule } from '@/types/color';
import { hslToRgb, rgbToHex } from './conversions';
import { generateHarmonyPalette, HARMONY_LABELS } from './harmony';

interface MoodProfile {
  keywords: string[];
  hue: number;
  saturation: number;
  lightness: number;
  harmony: HarmonyRule;
  blurb: string;
}

const MOOD_PROFILES: MoodProfile[] = [
  { keywords: ['sunset', 'dusk', 'evening'], hue: 18, saturation: 85, lightness: 55, harmony: 'analogous', blurb: 'warm oranges and pinks fading into dusk' },
  { keywords: ['ocean', 'sea', 'beach', 'aqua', 'tropical'], hue: 195, saturation: 70, lightness: 50, harmony: 'analogous', blurb: 'cool blues and teals evoking open water' },
  { keywords: ['forest', 'jungle', 'nature', 'woodland'], hue: 130, saturation: 55, lightness: 35, harmony: 'analogous', blurb: 'deep greens grounded in natural foliage' },
  { keywords: ['cozy', 'autumn', 'fall', 'cabin', 'harvest'], hue: 28, saturation: 60, lightness: 45, harmony: 'split-complementary', blurb: 'warm terracottas and golds for a cozy autumn feel' },
  { keywords: ['spring', 'garden', 'bloom', 'floral'], hue: 330, saturation: 55, lightness: 70, harmony: 'analogous', blurb: 'soft blossom pinks with fresh greens' },
  { keywords: ['cyberpunk', 'neon', 'futuristic', 'synthwave'], hue: 290, saturation: 90, lightness: 55, harmony: 'complementary', blurb: 'electric magenta and cyan for a neon-lit future' },
  { keywords: ['luxury', 'elegant', 'gold', 'premium'], hue: 45, saturation: 65, lightness: 45, harmony: 'monochromatic', blurb: 'rich gold tones layered for understated luxury' },
  { keywords: ['corporate', 'trust', 'professional', 'finance'], hue: 215, saturation: 60, lightness: 45, harmony: 'monochromatic', blurb: 'confident blues that read as trustworthy and professional' },
  { keywords: ['calm', 'peaceful', 'serene', 'spa', 'zen'], hue: 175, saturation: 35, lightness: 65, harmony: 'monochromatic', blurb: 'muted, low-saturation tones for a calm atmosphere' },
  { keywords: ['energetic', 'vibrant', 'bold', 'sport'], hue: 10, saturation: 90, lightness: 55, harmony: 'triadic', blurb: 'high-energy, highly saturated hues' },
  { keywords: ['romantic', 'love', 'valentine'], hue: 340, saturation: 65, lightness: 60, harmony: 'split-complementary', blurb: 'soft, romantic pinks and reds' },
  { keywords: ['halloween', 'spooky', 'horror'], hue: 25, saturation: 85, lightness: 40, harmony: 'complementary', blurb: 'pumpkin orange against deep, eerie purple' },
  { keywords: ['christmas', 'holiday', 'festive', 'winter'], hue: 0, saturation: 70, lightness: 40, harmony: 'complementary', blurb: 'classic festive reds and evergreens' },
  { keywords: ['pastel', 'soft', 'gentle', 'baby'], hue: 280, saturation: 40, lightness: 80, harmony: 'analogous', blurb: 'gentle, low-contrast pastels' },
  { keywords: ['vintage', 'retro', 'nostalgic'], hue: 35, saturation: 45, lightness: 55, harmony: 'analogous', blurb: 'muted, sun-faded retro tones' },
  { keywords: ['monochrome', 'minimal', 'grayscale', 'mono'], hue: 220, saturation: 8, lightness: 50, harmony: 'monochromatic', blurb: 'a restrained, nearly-neutral monochrome palette' },
  { keywords: ['fire', 'lava', 'heat', 'volcano'], hue: 8, saturation: 95, lightness: 50, harmony: 'analogous', blurb: 'searing reds and oranges' },
  { keywords: ['galaxy', 'space', 'cosmic', 'night sky'], hue: 255, saturation: 60, lightness: 35, harmony: 'square', blurb: 'deep cosmic purples and blues scattered with light' },
  { keywords: ['desert', 'sand', 'dune'], hue: 32, saturation: 45, lightness: 60, harmony: 'monochromatic', blurb: 'warm, sun-bleached sand tones' },
  { keywords: ['mint', 'fresh', 'clean'], hue: 160, saturation: 50, lightness: 65, harmony: 'analogous', blurb: 'crisp, fresh minty greens' },
];

const FALLBACK_HARMONIES: HarmonyRule[] = ['complementary', 'analogous', 'triadic', 'split-complementary', 'tetradic', 'square'];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

const wrapHue = (h: number) => ((h % 360) + 360) % 360;

export interface AiPaletteResult {
  name: string;
  colors: string[];
  harmony: HarmonyRule;
  matchedTags: string[];
  explanation: string;
}

export function generateAiPalette(promptRaw: string, options: { seed?: number; count?: number } = {}): AiPaletteResult {
  const { seed = 0, count = 5 } = options;
  const prompt = promptRaw.trim().toLowerCase();
  const matched = MOOD_PROFILES.filter((p) => p.keywords.some((k) => prompt.includes(k)));

  let hue: number;
  let saturation: number;
  let lightness: number;
  let harmony: HarmonyRule;
  let blurb: string;
  let matchedTags: string[];

  if (matched.length > 0) {
    const primary = matched[0];
    hue = primary.hue;
    saturation = primary.saturation;
    lightness = primary.lightness;
    harmony = primary.harmony;
    blurb = primary.blurb;
    matchedTags = [...new Set(matched.flatMap((p) => p.keywords.filter((k) => prompt.includes(k))))];
  } else {
    const hash = hashString(prompt || 'color');
    hue = hash % 360;
    saturation = 55 + (hash % 30);
    lightness = 42 + (hash % 22);
    harmony = FALLBACK_HARMONIES[hash % FALLBACK_HARMONIES.length];
    blurb = 'a custom palette interpreted from your description';
    matchedTags = [];
  }

  hue = wrapHue(hue + seed * 23);
  saturation = Math.min(95, Math.max(15, saturation + ((seed % 3) - 1) * 8));
  lightness = Math.min(85, Math.max(15, lightness + ((seed % 2) * 2 - 1) * 6));

  const base = rgbToHex(hslToRgb({ h: hue, s: saturation, l: lightness }));
  const colors = generateHarmonyPalette(base, harmony, count);

  const name = promptRaw.trim()
    ? promptRaw.trim().replace(/\s+/g, ' ').slice(0, 48).replace(/^./, (c) => c.toUpperCase())
    : 'Untitled mood';

  const explanation = `Built a ${HARMONY_LABELS[harmony].toLowerCase()} palette around ${blurb}${
    matchedTags.length ? ` — matched "${matchedTags.join('", "')}"` : ''
  }.`;

  return { name, colors, harmony, matchedTags, explanation };
}

export const SUGGESTED_PROMPTS = [
  'Sunset over the ocean',
  'Cozy autumn cabin',
  'Cyberpunk neon city',
  'Spring garden in bloom',
  'Calm spa retreat',
  'Corporate trust and stability',
  'Halloween night',
  'Desert sand dunes',
];
