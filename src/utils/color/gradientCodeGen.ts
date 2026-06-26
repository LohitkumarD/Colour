import type { GradientConfig, GradientStop } from '@/types/color';
import { hexToRgb } from './conversions';

const sortedStops = (stops: GradientStop[]) => [...stops].sort((a, b) => a.position - b.position);

export function toCssGradient(config: GradientConfig): string {
  const stops = sortedStops(config.stops);
  const stopsCss = stops.map((s) => `${s.color} ${s.position}%`).join(', ');

  switch (config.type) {
    case 'linear':
      return `linear-gradient(${config.angle}deg, ${stopsCss})`;
    case 'radial':
      return `radial-gradient(${config.shape ?? 'circle'} at center, ${stopsCss})`;
    case 'angular':
      return `conic-gradient(from ${config.angle}deg at center, ${stopsCss})`;
    case 'mesh': {
      // CSS has no native mesh gradient — approximate with layered radial gradients.
      const seed = config.meshSeed ?? 1;
      const positions = [
        [20, 20],
        [80, 25],
        [25, 80],
        [85, 85],
      ];
      const layers = stops
        .slice(0, 4)
        .map((s, i) => {
          const [px, py] = positions[i % positions.length];
          const jitter = (seed * (i + 1) * 13) % 15;
          return `radial-gradient(circle at ${px + jitter}% ${py - jitter}%, ${s.color} 0%, transparent 60%)`;
        })
        .join(', ');
      return `${layers}, ${stops[0]?.color ?? '#000000'}`;
    }
    default:
      return `linear-gradient(${config.angle}deg, ${stopsCss})`;
  }
}

function hexToFlutterColor(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  const toHex2 = (n: number) => n.toString(16).padStart(2, '0').toUpperCase();
  return `Color(0xFF${toHex2(r)}${toHex2(g)}${toHex2(b)})`;
}

function hexToSwiftUiColor(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  const channel = (n: number) => (n / 255).toFixed(3);
  return `Color(red: ${channel(r)}, green: ${channel(g)}, blue: ${channel(b)})`;
}

export function toFlutterGradient(config: GradientConfig): string {
  const stops = sortedStops(config.stops);
  const colors = stops.map((s) => hexToFlutterColor(s.color)).join(', ');
  const stopValues = stops.map((s) => (s.position / 100).toFixed(2)).join(', ');

  if (config.type === 'radial' || config.type === 'mesh') {
    return `RadialGradient(\n  colors: [${colors}],\n  stops: [${stopValues}],\n  center: Alignment.center,\n  radius: 0.8,\n)`;
  }

  if (config.type === 'angular') {
    return `SweepGradient(\n  colors: [${colors}],\n  stops: [${stopValues}],\n  center: Alignment.center,\n)`;
  }

  const radians = (config.angle * Math.PI) / 180;
  const begin = `Alignment(${Math.cos(radians).toFixed(2)}, ${Math.sin(radians).toFixed(2)})`;
  const end = `Alignment(${(-Math.cos(radians)).toFixed(2)}, ${(-Math.sin(radians)).toFixed(2)})`;
  return `LinearGradient(\n  colors: [${colors}],\n  stops: [${stopValues}],\n  begin: ${begin},\n  end: ${end},\n)`;
}

export function toSwiftUiGradient(config: GradientConfig): string {
  const stops = sortedStops(config.stops);
  const colors = stops.map((s) => hexToSwiftUiColor(s.color)).join(',\n    ');

  if (config.type === 'radial' || config.type === 'mesh') {
    return `RadialGradient(\n  gradient: Gradient(colors: [\n    ${colors}\n  ]),\n  center: .center,\n  startRadius: 0,\n  endRadius: 200\n)`;
  }

  if (config.type === 'angular') {
    return `AngularGradient(\n  gradient: Gradient(colors: [\n    ${colors}\n  ]),\n  center: .center,\n  angle: .degrees(${config.angle})\n)`;
  }

  return `LinearGradient(\n  gradient: Gradient(colors: [\n    ${colors}\n  ]),\n  startPoint: .topLeading,\n  endPoint: .bottomTrailing\n)`;
}

export function toReactNativeGradient(config: GradientConfig): string {
  const stops = sortedStops(config.stops);
  const colors = stops.map((s) => `'${s.color}'`).join(', ');
  const locations = stops.map((s) => (s.position / 100).toFixed(2)).join(', ');
  const radians = (config.angle * Math.PI) / 180;
  const start = `{ x: ${((1 - Math.cos(radians)) / 2).toFixed(2)}, y: ${((1 - Math.sin(radians)) / 2).toFixed(2)} }`;
  const end = `{ x: ${((1 + Math.cos(radians)) / 2).toFixed(2)}, y: ${((1 + Math.sin(radians)) / 2).toFixed(2)} }`;

  return `import { LinearGradient } from 'expo-linear-gradient';\n\n<LinearGradient\n  colors={[${colors}]}\n  locations={[${locations}]}\n  start={${start}}\n  end={${end}}\n  style={{ flex: 1 }}\n/>`;
}

export function toTailwindGradient(config: GradientConfig): string {
  const css = toCssGradient(config);
  return `bg-[${css.replace(/\s+/g, '_')}]`;
}

export function toAndroidXmlGradient(config: GradientConfig): string {
  const stops = sortedStops(config.stops);
  const typeMap: Record<GradientConfig['type'], string> = {
    linear: 'linear',
    radial: 'radial',
    angular: 'sweep',
    mesh: 'linear',
  };
  const startColor = stops[0]?.color ?? '#000000';
  const endColor = stops[stops.length - 1]?.color ?? '#FFFFFF';
  const centerColor = stops.length > 2 ? `\n    android:centerColor="${stops[Math.floor(stops.length / 2)].color}"` : '';

  return `<shape xmlns:android="http://schemas.android.com/apk/res/android">\n  <gradient\n    android:type="${typeMap[config.type]}"\n    android:angle="${config.angle}"\n    android:startColor="${startColor}"${centerColor}\n    android:endColor="${endColor}" />\n</shape>`;
}

export interface GradientExportFormat {
  id: string;
  label: string;
  language: string;
  generate: (config: GradientConfig) => string;
}

export const GRADIENT_EXPORT_FORMATS: GradientExportFormat[] = [
  { id: 'css', label: 'CSS', language: 'css', generate: (c) => `background: ${toCssGradient(c)};` },
  { id: 'tailwind', label: 'Tailwind', language: 'jsx', generate: toTailwindGradient },
  { id: 'flutter', label: 'Flutter', language: 'dart', generate: toFlutterGradient },
  { id: 'swiftui', label: 'SwiftUI', language: 'swift', generate: toSwiftUiGradient },
  { id: 'react-native', label: 'React Native', language: 'tsx', generate: toReactNativeGradient },
  { id: 'android', label: 'Android XML', language: 'xml', generate: toAndroidXmlGradient },
];
