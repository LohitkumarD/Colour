import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Copy, Plus, Sparkles, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Slider } from '@/components/ui/Slider';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { usePaletteStore } from '@/store/paletteStore';
import { useUiStore } from '@/store/uiStore';
import { generateId, randomHex } from '@/utils/color/random';
import { toCssGradient, GRADIENT_EXPORT_FORMATS } from '@/utils/color/gradientCodeGen';
import type { GradientConfig, GradientStop, GradientType } from '@/types/color';

const TYPE_OPTIONS: { value: GradientType; label: string }[] = [
  { value: 'linear', label: 'Linear' },
  { value: 'radial', label: 'Radial' },
  { value: 'angular', label: 'Angular' },
  { value: 'mesh', label: 'Mesh' },
];

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const addToast = useUiStore((s) => s.addToast);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      addToast({ message: 'Copy failed', variant: 'error' });
    }
  };

  return (
    <div className="relative rounded-[var(--radius-control)] border border-[var(--border-subtle)] bg-[var(--glass-bg)] p-3.5">
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy code"
        className="absolute right-2.5 top-2.5 flex size-8 items-center justify-center rounded-lg text-[var(--text-tertiary)] transition-colors hover:bg-[var(--glass-bg-strong)] hover:text-[var(--text-primary)]"
      >
        {copied ? <Check className="size-4 text-success-400" /> : <Copy className="size-4" />}
      </button>
      <pre className="overflow-x-auto pr-10 font-mono text-xs leading-relaxed text-[var(--text-primary)]">{code}</pre>
    </div>
  );
}

export default function GradientsPage() {
  const createPalette = usePaletteStore((s) => s.createPalette);
  const addHistory = usePaletteStore((s) => s.addHistory);
  const addToast = useUiStore((s) => s.addToast);

  const [type, setType] = useState<GradientType>('linear');
  const [angle, setAngle] = useState(135);
  const [shape, setShape] = useState<'circle' | 'ellipse'>('circle');
  const [stops, setStops] = useState<GradientStop[]>([
    { id: generateId(), color: '#863BFF', position: 0 },
    { id: generateId(), color: '#22D3EE', position: 100 },
  ]);
  const [exportFormatId, setExportFormatId] = useState(GRADIENT_EXPORT_FORMATS[0].id);
  const [saving, setSaving] = useState(false);

  const config: GradientConfig = useMemo(
    () => ({ type, angle, stops, shape, meshSeed: 1 }),
    [type, angle, stops, shape],
  );

  const css = useMemo(() => toCssGradient(config), [config]);
  const exportFormat = GRADIENT_EXPORT_FORMATS.find((f) => f.id === exportFormatId) ?? GRADIENT_EXPORT_FORMATS[0];
  const exportedCode = useMemo(() => exportFormat.generate(config), [exportFormat, config]);

  const updateStop = (id: string, patch: Partial<GradientStop>) => {
    setStops((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const addStop = () => {
    setStops((prev) => [...prev, { id: generateId(), color: randomHex(), position: 50 }]);
  };

  const removeStop = (id: string) => {
    setStops((prev) => (prev.length <= 2 ? prev : prev.filter((s) => s.id !== id)));
  };

  const saveAsPalette = async () => {
    setSaving(true);
    try {
      const colors = stops.slice().sort((a, b) => a.position - b.position).map((s) => s.color);
      const palette = await createPalette({ name: `${TYPE_OPTIONS.find((t) => t.value === type)?.label} Gradient`, colors, source: 'gradient' });
      await addHistory('palette', palette.name, colors[0]);
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
        <p className="text-sm font-medium text-[var(--text-tertiary)]">Gradient Generator</p>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
          Design a gradient
        </h1>
      </div>

      <Card strong>
        <CardContent className="p-5">
          <div className="h-56 w-full rounded-2xl border border-[var(--border-subtle)] shadow-[var(--shadow-card)]" style={{ backgroundImage: css }} />
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <SegmentedControl options={TYPE_OPTIONS} value={type} onChange={setType} aria-label="Gradient type" />
            {(type === 'linear' || type === 'angular') && (
              <Slider label="Angle" value={angle} max={360} onChange={setAngle} formatValue={(v) => `${v}°`} />
            )}
            {type === 'radial' && (
              <Select label="Shape" value={shape} onChange={(e) => setShape(e.target.value as 'circle' | 'ellipse')}>
                <option value="circle">Circle</option>
                <option value="ellipse">Ellipse</option>
              </Select>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stops</CardTitle>
            <Button variant="ghost" size="sm" leftIcon={<Plus className="size-4" />} onClick={addStop}>
              Add stop
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {stops.map((stop) => (
              <div key={stop.id} className="flex items-center gap-3">
                <input
                  type="color"
                  value={stop.color}
                  onChange={(e) => updateStop(stop.id, { color: e.target.value })}
                  aria-label="Stop color"
                  className="size-9 shrink-0 cursor-pointer rounded-lg border border-[var(--border-subtle)] bg-transparent"
                />
                <Slider
                  value={stop.position}
                  onChange={(v) => updateStop(stop.id, { position: v })}
                  formatValue={(v) => `${v}%`}
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => removeStop(stop.id)}
                  disabled={stops.length <= 2}
                  aria-label="Remove stop"
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg text-[var(--text-tertiary)] transition-colors hover:bg-[var(--glass-bg-strong)] hover:text-error-400 disabled:pointer-events-none disabled:opacity-30"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Export code</CardTitle>
          <div className="flex items-center gap-2.5">
            <Select value={exportFormatId} onChange={(e) => setExportFormatId(e.target.value)} className="w-44" aria-label="Export format">
              {GRADIENT_EXPORT_FORMATS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label}
                </option>
              ))}
            </Select>
            <Button size="sm" leftIcon={<Sparkles className="size-4" />} loading={saving} onClick={saveAsPalette}>
              Save stops as palette
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <CodeBlock code={exportedCode} />
        </CardContent>
      </Card>
    </motion.div>
  );
}
