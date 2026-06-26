import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Sparkles, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ColorSwatch } from '@/components/ui/ColorSwatch';
import { usePaletteStore } from '@/store/paletteStore';
import { useUiStore } from '@/store/uiStore';
import { randomHex } from '@/utils/color/random';
import {
  COLOR_BLINDNESS_DESCRIPTIONS,
  COLOR_BLINDNESS_LABELS,
  simulateColorBlindness,
} from '@/utils/color/blindness';
import type { ColorBlindnessType } from '@/types/color';

const DEFAULT_PALETTE = ['#E53935', '#43A047', '#1E88E5', '#FB8C00', '#8E24AA', '#FDD835'];

const SIMULATED_TYPES: ColorBlindnessType[] = ['protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia'];

interface SimulationRowProps {
  type: ColorBlindnessType;
  colors: string[];
}

function SimulationRow({ type, colors }: SimulationRowProps) {
  const createPalette = usePaletteStore((s) => s.createPalette);
  const addHistory = usePaletteStore((s) => s.addHistory);
  const addToast = useUiStore((s) => s.addToast);
  const [saving, setSaving] = useState(false);

  const simulated = useMemo(() => colors.map((c) => simulateColorBlindness(c, type)), [colors, type]);

  const copyColor = async (hex: string) => {
    await navigator.clipboard.writeText(hex);
    addToast({ message: `Copied ${hex}`, variant: 'success', duration: 1600 });
  };

  const saveAsPalette = async () => {
    setSaving(true);
    try {
      const palette = await createPalette({ name: `${COLOR_BLINDNESS_LABELS[type]} Simulation`, colors: simulated, source: 'manual' });
      await addHistory('palette', palette.name, simulated[0]);
      addToast({ message: 'Palette saved', description: `${simulated.length} colors added to your library`, variant: 'success' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>{COLOR_BLINDNESS_LABELS[type]}</CardTitle>
          <p className="mt-0.5 text-xs text-[var(--text-tertiary)]">{COLOR_BLINDNESS_DESCRIPTIONS[type]}</p>
        </div>
        <Button size="sm" leftIcon={<Sparkles className="size-4" />} loading={saving} onClick={saveAsPalette}>
          Save
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex overflow-hidden rounded-xl border border-[var(--border-subtle)]">
          {simulated.map((c, i) => (
            <button
              key={i}
              type="button"
              style={{ backgroundColor: c }}
              onClick={() => copyColor(c)}
              aria-label={`Copy ${c}`}
              className="h-16 flex-1"
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function BlindnessPage() {
  const [palette, setPalette] = useState<string[]>(DEFAULT_PALETTE);

  const updateColor = (index: number, hex: string) => {
    setPalette((prev) => prev.map((c, i) => (i === index ? hex : c)));
  };

  const addColor = () => {
    setPalette((prev) => [...prev, randomHex()]);
  };

  const removeColor = (index: number) => {
    setPalette((prev) => (prev.length <= 2 ? prev : prev.filter((_, i) => i !== index)));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6 pb-6"
    >
      <div>
        <p className="text-sm font-medium text-[var(--text-tertiary)]">Color Blindness Simulator</p>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
          See your palette through different eyes
        </h1>
      </div>

      <Card strong>
        <CardHeader>
          <CardTitle>Your palette</CardTitle>
          <Button variant="ghost" size="sm" leftIcon={<Plus className="size-4" />} onClick={addColor}>
            Add color
          </Button>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4 p-5">
          {palette.map((hex, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div className="relative">
                <ColorSwatch hex={hex} size="lg" copyOnClick />
                <input
                  type="color"
                  value={hex}
                  onChange={(e) => updateColor(i, e.target.value)}
                  aria-label={`Edit color ${i + 1}`}
                  className="absolute inset-0 size-full cursor-pointer opacity-0"
                />
              </div>
              <button
                type="button"
                onClick={() => removeColor(i)}
                disabled={palette.length <= 2}
                aria-label="Remove color"
                className="flex size-7 items-center justify-center rounded-lg text-[var(--text-tertiary)] transition-colors hover:bg-[var(--glass-bg-strong)] hover:text-error-400 disabled:pointer-events-none disabled:opacity-30"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="space-y-4">
        {SIMULATED_TYPES.map((type) => (
          <SimulationRow key={type} type={type} colors={palette} />
        ))}
      </div>
    </motion.div>
  );
}
