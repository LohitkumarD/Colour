import { motion } from 'framer-motion';
import {
  Blend,
  Disc3,
  Download,
  GraduationCap,
  Library,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

const HIGHLIGHTS: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Disc3,
    title: 'A full color-space engine',
    description: 'Convert and reason about HEX, RGB, HSL, HSV, CMYK, LAB, XYZ, LCH, OKLab and OKLCH.',
  },
  {
    icon: Blend,
    title: 'Tools for designers and artists',
    description: 'Harmony generation, gradients, an RGB color mixer, and a traditional 12-hue pigment wheel for painters.',
  },
  {
    icon: Library,
    title: 'A real palette library',
    description: 'Save, tag, favorite and organize palettes into folders and projects, then export to CSS, SCSS or Tailwind.',
  },
  {
    icon: GraduationCap,
    title: 'A learning hub',
    description: 'Short lessons and quizzes that build color theory intuition, not just terminology.',
  },
  {
    icon: ShieldCheck,
    title: 'Local-first by design',
    description: 'Everything you create is stored on your device. There is no account, server or tracking.',
  },
  {
    icon: Download,
    title: 'Installable PWA',
    description: 'Add it to your home screen or desktop and keep working with most tools available offline.',
  },
];

export default function AboutPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6 pb-6"
    >
      <div>
        <p className="text-sm font-medium text-[var(--text-tertiary)]">About</p>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
          Color Theory Studio
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)]">
          A single workbench for thinking about color — whether you're picking an accessible UI
          palette, mixing paint for a canvas, or just trying to understand why two colors clash.
          It bundles color science, palette management and short lessons into one offline-capable app.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {HIGHLIGHTS.map((h) => (
          <Card key={h.title}>
            <CardContent className="flex items-start gap-3 p-4">
              <h.icon className="mt-0.5 size-5 shrink-0 text-primary-400" />
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">{h.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-[var(--text-tertiary)]">{h.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card strong>
        <CardContent className="flex items-start gap-3 p-5">
          <Sparkles className="mt-0.5 size-5 shrink-0 text-primary-400" />
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            Built with React, TypeScript and Tailwind CSS. No accounts, no telemetry, no ads — just a
            tool for working with color.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
