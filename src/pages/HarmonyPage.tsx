import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Shuffle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ColorPickerField } from '@/components/ui/ColorPickerField';
import { Select } from '@/components/ui/Select';
import { Slider } from '@/components/ui/Slider';
import { usePaletteStore } from '@/store/paletteStore';
import { useUiStore } from '@/store/uiStore';
import { randomHex } from '@/utils/color/random';
import { generateHarmonyPalette, HARMONY_DESCRIPTIONS, HARMONY_LABELS, HARMONY_RULES } from '@/utils/color/harmony';
import type { HarmonyRule } from '@/types/color';

const DEFAULT_BASE = '#863BFF';

export default function HarmonyPage() {
  const createPalette = usePaletteStore((s) => s.createPalette);
  const addHistory = usePaletteStore((s) => s.addHistory);
  const addToast = useUiStore((s) => s.addToast);

  const [baseHex, setBaseHex] = useState(DEFAULT_BASE);
  const [rule, setRule] = useState<HarmonyRule>('complementary');
  const [count, setCount] = useState(5);
  const [saving, setSaving] = useState(false);

  const colors = useMemo(() => generateHarmonyPalette(baseHex, rule, count), [baseHex, rule, count]);

  const applyBase = (hex: string) => setBaseHex(hex);

  const handleRandomize = () => applyBase(randomHex());
  const handleReset = () => applyBase(DEFAULT_BASE);

  const copyColor = async (hex: string) => {
    await navigator.clipboard.writeText(hex);
    addToast({ message: `Copied ${hex}`, variant: 'success', duration: 1600 });
  };

  const saveAsPalette = async () => {
    setSaving(true);
    try {
      const palette = await createPalette({ name: `${HARMONY_LABELS[rule]} Palette`, colors, source: 'harmony' });
      await addHistory('palette', palette.name, colors[0], rule);
      addToast({ message: 'Palette saved', description: `${colors.length} colors added to your library`, variant: 'success' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6 pb-6"
    >
      <div>
        <p className="text-sm font-medium text-[var(--text-tertiary)]">Harmony Generator</p>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
          Build a color scheme
        </h1>
      </div>

      <Card strong>
        <CardContent className="flex flex-col gap-4 p-5">
          <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center">
            <ColorPickerField
              value={baseHex}
              onChange={applyBase}
              ariaLabel="Base color hex value"
              swatchSize="xl"
              className="flex-1"
            />
            <div className="flex gap-2.5">
              <Button variant="secondary" size="sm" leftIcon={<Shuffle className="size-4" />} onClick={handleRandomize}>
                Randomize
              </Button>
              <Button variant="ghost" size="sm" leftIcon={<RotateCcw className="size-4" />} onClick={handleReset}>
                Reset
              </Button>
            </div>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-2">
            <Select label="Harmony rule" value={rule} onChange={(e) => setRule(e.target.value as HarmonyRule)}>
              {HARMONY_RULES.map((r) => (
                <option key={r} value={r}>
                  {HARMONY_LABELS[r]}
                </option>
              ))}
            </Select>
            <Slider label="Color count" value={count} min={3} max={10} onChange={setCount} className="pt-1" />
          </div>
          <p className="text-sm text-[var(--text-tertiary)]">{HARMONY_DESCRIPTIONS[rule]}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Generated palette</CardTitle>
          <Button size="sm" leftIcon={<Sparkles className="size-4" />} loading={saving} onClick={saveAsPalette}>
            Save as palette
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {colors.map((c, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  style={{ backgroundColor: c }}
                  onClick={() => copyColor(c)}
                  aria-label={`Copy ${c}`}
                  className="h-24 w-full rounded-xl border border-[var(--border-subtle)] shadow-[var(--shadow-card)] transition-transform hover:-translate-y-0.5"
                />
                <span className="font-mono text-xs text-[var(--text-secondary)]">{c}</span>
                <Button variant="ghost" size="sm" onClick={() => applyBase(c)}>
                  Use as base
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
