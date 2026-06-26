import type { Palette } from '@/types/palette';

function slugify(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'palette';
}

interface PaletteExportFormat {
  id: string;
  label: string;
  extension: string;
  mime: string;
  generate: (palette: Palette) => string;
}

export const PALETTE_EXPORT_FORMATS: PaletteExportFormat[] = [
  {
    id: 'json',
    label: 'JSON',
    extension: 'json',
    mime: 'application/json',
    generate: (p) => JSON.stringify({ name: p.name, colors: p.colors }, null, 2),
  },
  {
    id: 'css',
    label: 'CSS Variables',
    extension: 'css',
    mime: 'text/css',
    generate: (p) =>
      `:root {\n${p.colors.map((c, i) => `  --${slugify(p.name)}-${i + 1}: ${c};`).join('\n')}\n}`,
  },
  {
    id: 'scss',
    label: 'SCSS Variables',
    extension: 'scss',
    mime: 'text/x-scss',
    generate: (p) => p.colors.map((c, i) => `$${slugify(p.name)}-${i + 1}: ${c};`).join('\n'),
  },
  {
    id: 'tailwind',
    label: 'Tailwind Config',
    extension: 'js',
    mime: 'text/javascript',
    generate: (p) =>
      `colors: {\n  '${slugify(p.name)}': {\n${p.colors
        .map((c, i) => `    ${(i + 1) * 100}: '${c}',`)
        .join('\n')}\n  },\n}`,
  },
  {
    id: 'csv',
    label: 'CSV',
    extension: 'csv',
    mime: 'text/csv',
    generate: (p) => `name,hex\n${p.colors.map((c, i) => `${p.name} ${i + 1},${c}`).join('\n')}`,
  },
  {
    id: 'text',
    label: 'Plain Text',
    extension: 'txt',
    mime: 'text/plain',
    generate: (p) => p.colors.join('\n'),
  },
];
