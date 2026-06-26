import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Pipette, Shuffle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Slider } from '@/components/ui/Slider';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { ColorSwatch } from '@/components/ui/ColorSwatch';
import { CopyField } from '@/components/ui/CopyField';
import { usePaletteStore } from '@/store/paletteStore';
import { useUiStore } from '@/store/uiStore';
import { normalizeHex } from '@/utils/color/format';
import { randomHex } from '@/utils/color/random';
import { applyOpacityOverWhite, mixColors, PAINT_TYPE_LABELS } from '@/utils/color/mixing';
import type { PaintType } from '@/types/color';

const PAINT_OPTIONS = (Object.keys(PAINT_TYPE_LABELS) as PaintType[]).map((value) => ({
  value,
  label: PAINT_TYPE_LABELS[value],
}));

const STEP_COUNT = 7;

interface ColorPickerFieldProps {
  label: string;
  hex: string;
  onChange: (hex: string) => void;
}

function ColorPickerField({ label, hex, onChange }: ColorPickerFieldProps) {
  const [input, setInput] = useState(hex);

  const handleChange = (value: string) => {
    setInput(value);
    const normalized = normalizeHex(value);
    if (normalized) onChange(normalized);
  };

  return (
    <div className="flex flex-1 items-center gap-3">
      <ColorSwatch hex={hex} size="lg" copyOnClick />
      <div className="flex-1">
        <Input
          label={label}
          value={input}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={() => setInput(hex)}
          prefix={<Pipette className="size-4 text-[var(--text-tertiary)]" />}
          className="font-mono uppercase"
        />
      </div>
      <Button variant="ghost" size="icon" aria-label={`Randomize ${label}`} onClick={() => onChange(randomHex())}>
        <Shuffle className="size-4" />
      </Button>
    </div>
  );
}

export default function MixerPage() {
  const addHistory = usePaletteStore((s) => s.addHistory);
  const createPalette = usePaletteStore((s) => s.createPalette);
  const addToast = useUiStore((s) => s.addToast);

  const [hexA, setHexA] = useState('#FF4D6D');
  const [hexB, setHexB] = useState('#4D9FFF');
  const [paintType, setPaintType] = useState<PaintType>('digital');
  const [ratio, setRatio] = useState(50);
  const [opacity, setOpacity] = useState(80);
  const [savingColor, setSavingColor] = useState(false);
  const [savingPalette, setSavingPalette] = useState(false);

  const mixed = useMemo(() => mixColors(hexA, hexB, ratio, paintType), [hexA, hexB, ratio, paintType]);
  const tinted = useMemo(() => applyOpacityOverWhite(mixed, opacity), [mixed, opacity]);

  const steps = useMemo(
    () =>
      Array.from({ length: STEP_COUNT }, (_, i) => mixColors(hexA, hexB, (i / (STEP_COUNT - 1)) * 100, paintType)),
    [hexA, hexB, paintType],
  );

  const copyColor = async (hex: string) => {
    await navigator.clipboard.writeText(hex);
    addToast({ message: `Copied ${hex}`, variant: 'success', duration: 1600 });
  };

  const saveMixedColor = async () => {
    setSavingColor(true);
    try {
      await addHistory('color', mixed, mixed, PAINT_TYPE_LABELS[paintType]);
      addToast({ message: 'Color saved to history', variant: 'success' });
    } finally {
      setSavingColor(false);
    }
  };

  const saveStepsAsPalette = async () => {
    setSavingPalette(true);
    try {
      const palette = await createPalette({ name: `${PAINT_TYPE_LABELS[paintType]} Mix`, colors: steps, source: 'mixer' });
      await addHistory('palette', palette.name, steps[0]);
      addToast({ message: 'Palette saved', description: `${steps.length} colors added to your library`, variant: 'success' });
    } finally {
      setSavingPalette(false);
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
        <p className="text-sm font-medium text-[var(--text-tertiary)]">Color Mixer</p>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
          Mix like real paint
        </h1>
      </div>

      <Card strong>
        <CardContent className="flex flex-col gap-4 p-5">
          <div className="flex flex-col gap-4 sm:flex-row">
            <ColorPickerField label="Color A" hex={hexA} onChange={setHexA} />
            <ColorPickerField label="Color B" hex={hexB} onChange={setHexB} />
          </div>
          <SegmentedControl options={PAINT_OPTIONS} value={paintType} onChange={setPaintType} aria-label="Paint profile" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mixed result</CardTitle>
          <Button size="sm" leftIcon={<Sparkles className="size-4" />} loading={savingColor} onClick={saveMixedColor}>
            Save color
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <ColorSwatch hex={mixed} size="xl" copyOnClick />
          <div className="flex-1 space-y-3">
            <Slider label="Mix ratio (A → B)" value={ratio} onChange={setRatio} formatValue={(v) => `${v}%`} trackGradient={`linear-gradient(90deg, ${hexA}, ${hexB})`} />
            <CopyField label="Mixed HEX" value={mixed} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mix gradient</CardTitle>
          <Button size="sm" leftIcon={<Sparkles className="size-4" />} loading={savingPalette} onClick={saveStepsAsPalette}>
            Save as palette
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex overflow-hidden rounded-xl border border-[var(--border-subtle)]">
            {steps.map((c, i) => (
              <button key={i} type="button" style={{ backgroundColor: c }} onClick={() => copyColor(c)} aria-label={`Copy ${c}`} className="h-16 flex-1" />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Opacity over white canvas</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <ColorSwatch hex={tinted} size="lg" copyOnClick />
          <Slider label="Coverage" value={opacity} onChange={setOpacity} formatValue={(v) => `${v}%`} className="flex-1" />
        </CardContent>
      </Card>
    </motion.div>
  );
}
