import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Pipette, RotateCcw, Shuffle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Slider } from '@/components/ui/Slider';
import { ColorSwatch } from '@/components/ui/ColorSwatch';
import { usePaletteStore } from '@/store/paletteStore';
import { useUiStore } from '@/store/uiStore';
import { normalizeHex } from '@/utils/color/format';
import { randomHex } from '@/utils/color/random';
import { generateShades, generateTints, generateTones } from '@/utils/color/tones';
import type { PaletteSource } from '@/types/palette';

const DEFAULT_BASE = '#863BFF';

interface RampRowProps {
  title: string;
  description: string;
  colors: string[];
  baseHex: string;
  source: PaletteSource;
}

function RampRow({ title, description, colors, baseHex, source }: RampRowProps) {
  const createPalette = usePaletteStore((s) => s.createPalette);
  const addHistory = usePaletteStore((s) => s.addHistory);
  const addToast = useUiStore((s) => s.addToast);
  const [saving, setSaving] = useState(false);

  const fullRamp = [baseHex, ...colors];

  const copyColor = async (hex: string) => {
    await navigator.clipboard.writeText(hex);
    addToast({ message: `Copied ${hex}`, variant: 'success', duration: 1600 });
  };

  const saveAsPalette = async () => {
    setSaving(true);
    try {
      const palette = await createPalette({ name: `${title} of ${baseHex}`, colors: fullRamp, source });
      await addHistory('palette', palette.name, fullRamp[0]);
      addToast({ message: 'Palette saved', description: `${fullRamp.length} colors added to your library`, variant: 'success' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>{title}</CardTitle>
          <p className="mt-0.5 text-xs text-[var(--text-tertiary)]">{description}</p>
        </div>
        <Button size="sm" leftIcon={<Sparkles className="size-4" />} loading={saving} onClick={saveAsPalette}>
          Save
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex overflow-hidden rounded-xl border border-[var(--border-subtle)]">
          {fullRamp.map((c, i) => (
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

export default function TonesPage() {
  const [baseHex, setBaseHex] = useState(DEFAULT_BASE);
  const [hexInput, setHexInput] = useState(DEFAULT_BASE);
  const [steps, setSteps] = useState(8);

  const tints = useMemo(() => generateTints(baseHex, steps), [baseHex, steps]);
  const shades = useMemo(() => generateShades(baseHex, steps), [baseHex, steps]);
  const tones = useMemo(() => generateTones(baseHex, steps), [baseHex, steps]);

  const applyBase = (hex: string) => {
    setBaseHex(hex);
    setHexInput(hex);
  };

  const handleHexInputChange = (value: string) => {
    setHexInput(value);
    const normalized = normalizeHex(value);
    if (normalized) setBaseHex(normalized);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6 pb-6"
    >
      <div>
        <p className="text-sm font-medium text-[var(--text-tertiary)]">Tints, Shades & Tones</p>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
          Build lightness ramps
        </h1>
      </div>

      <Card strong>
        <CardContent className="flex flex-col gap-4 p-5">
          <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center">
            <ColorSwatch hex={baseHex} size="xl" copyOnClick />
            <div className="flex-1">
              <Input
                value={hexInput}
                onChange={(e) => handleHexInputChange(e.target.value)}
                onBlur={() => setHexInput(baseHex)}
                prefix={<Pipette className="size-4 text-[var(--text-tertiary)]" />}
                className="font-mono uppercase"
                aria-label="Base color hex value"
              />
            </div>
            <div className="flex gap-2.5">
              <Button variant="secondary" size="sm" leftIcon={<Shuffle className="size-4" />} onClick={() => applyBase(randomHex())}>
                Randomize
              </Button>
              <Button variant="ghost" size="sm" leftIcon={<RotateCcw className="size-4" />} onClick={() => applyBase(DEFAULT_BASE)}>
                Reset
              </Button>
            </div>
          </div>
          <Slider label="Steps per ramp" value={steps} min={3} max={14} onChange={setSteps} />
        </CardContent>
      </Card>

      <div className="space-y-4">
        <RampRow
          title="Tints"
          description="Base mixed toward white — lighter, airier variants."
          colors={tints}
          baseHex={baseHex}
          source="tones"
        />
        <RampRow
          title="Shades"
          description="Base mixed toward black — darker, moodier variants."
          colors={shades}
          baseHex={baseHex}
          source="tones"
        />
        <RampRow
          title="Tones"
          description="Base mixed toward neutral gray — muted, desaturated variants."
          colors={tones}
          baseHex={baseHex}
          source="tones"
        />
      </div>
    </motion.div>
  );
}
