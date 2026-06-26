import { useMemo, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ColorSwatch } from '@/components/ui/ColorSwatch';
import { CopyField } from '@/components/ui/CopyField';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Slider } from '@/components/ui/Slider';
import { usePaletteStore } from '@/store/paletteStore';
import { useUiStore } from '@/store/uiStore';
import { hexToRgb, rgbToHex } from '@/utils/color/conversions';
import { mixColors, PAINT_TYPE_LABELS } from '@/utils/color/mixing';
import { cn } from '@/utils/cn';
import type { PaintType, RGB } from '@/types/color';

interface Pigment {
  name: string;
  hex: string;
  type: 'primary' | 'secondary' | 'tertiary';
}

/** A traditional 12-hue painter's (RYB) color wheel, ordered clockwise from red. */
const PIGMENTS: Pigment[] = [
  { name: 'Red', hex: '#E0282E', type: 'primary' },
  { name: 'Red-Orange', hex: '#EC5B23', type: 'tertiary' },
  { name: 'Orange', hex: '#F7941D', type: 'secondary' },
  { name: 'Yellow-Orange', hex: '#FBB917', type: 'tertiary' },
  { name: 'Yellow', hex: '#FFE100', type: 'primary' },
  { name: 'Yellow-Green', hex: '#A6CE39', type: 'tertiary' },
  { name: 'Green', hex: '#00A651', type: 'secondary' },
  { name: 'Blue-Green', hex: '#00A99D', type: 'tertiary' },
  { name: 'Blue', hex: '#0072BC', type: 'primary' },
  { name: 'Blue-Violet', hex: '#3F48CC', type: 'tertiary' },
  { name: 'Violet', hex: '#92278F', type: 'secondary' },
  { name: 'Red-Violet', hex: '#ED1C75', type: 'tertiary' },
];

type RingId = 'tint' | 'pure' | 'tone' | 'shade';

const RINGS: { id: RingId; label: string; innerR: number; outerR: number; mixTarget: RGB | null; amount: number }[] = [
  { id: 'tint', label: 'Tint', innerR: 0, outerR: 56, mixTarget: { r: 255, g: 255, b: 255 }, amount: 0.55 },
  { id: 'pure', label: 'Pure pigment', innerR: 59, outerR: 122, mixTarget: null, amount: 0 },
  { id: 'tone', label: 'Tone', innerR: 125, outerR: 150, mixTarget: { r: 128, g: 128, b: 128 }, amount: 0.45 },
  { id: 'shade', label: 'Shade', innerR: 153, outerR: 170, mixTarget: { r: 0, g: 0, b: 0 }, amount: 0.45 },
];

const SVG_SIZE = 340;
const CENTER = SVG_SIZE / 2;
const SEGMENT_DEG = 360 / PIGMENTS.length;
const STEP_COUNT = 7;

const clampByte = (n: number) => Math.min(255, Math.max(0, Math.round(n)));

function mixToward(hex: string, target: RGB, t: number): string {
  const rgb = hexToRgb(hex);
  return rgbToHex({
    r: clampByte(rgb.r + (target.r - rgb.r) * t),
    g: clampByte(rgb.g + (target.g - rgb.g) * t),
    b: clampByte(rgb.b + (target.b - rgb.b) * t),
  });
}

function ringColor(pigment: Pigment, ring: (typeof RINGS)[number]): string {
  return ring.mixTarget ? mixToward(pigment.hex, ring.mixTarget, ring.amount) : pigment.hex;
}

function polarToCartesian(r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: CENTER + r * Math.cos(rad), y: CENTER + r * Math.sin(rad) };
}

/** Builds an SVG path for a donut/pie wedge spanning [startDeg, endDeg) between innerR and outerR. */
function wedgePath(innerR: number, outerR: number, startDeg: number, endDeg: number): string {
  const outerStart = polarToCartesian(outerR, startDeg);
  const outerEnd = polarToCartesian(outerR, endDeg);
  const innerEnd = polarToCartesian(innerR, endDeg);
  const innerStart = polarToCartesian(innerR, startDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    'Z',
  ].join(' ');
}

interface Pick {
  index: number;
  ring: RingId;
}

const PAINT_OPTIONS = (Object.keys(PAINT_TYPE_LABELS) as PaintType[]).map((value) => ({
  value,
  label: PAINT_TYPE_LABELS[value],
}));

function PigmentChip({ slot, pick, active, onClick }: { slot: 'A' | 'B'; pick: Pick; active: boolean; onClick: () => void }) {
  const ring = RINGS.find((r) => r.id === pick.ring)!;
  const hex = ringColor(PIGMENTS[pick.index], ring);
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Edit Pigment ${slot}`}
      className={cn(
        'flex flex-1 items-center gap-3 rounded-[var(--radius-control)] border px-3.5 py-2.5 text-left transition-colors',
        active ? 'border-accent-400/60 bg-[var(--glass-bg-strong)]' : 'border-[var(--border-subtle)] bg-[var(--glass-bg)] hover:bg-[var(--glass-bg-strong)]',
      )}
    >
      <span className="size-8 shrink-0 rounded-full border border-[var(--border-subtle)]" style={{ backgroundColor: hex }} />
      <span className="min-w-0">
        <span className="block text-xs font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">Pigment {slot}</span>
        <span className="block truncate text-sm font-medium text-[var(--text-primary)]">
          {ring.label} {PIGMENTS[pick.index].name}
        </span>
      </span>
    </button>
  );
}

export default function PigmentWheelPage() {
  const createPalette = usePaletteStore((s) => s.createPalette);
  const addHistory = usePaletteStore((s) => s.addHistory);
  const addToast = useUiStore((s) => s.addToast);

  const [pickA, setPickA] = useState<Pick>({ index: 0, ring: 'pure' });
  const [pickB, setPickB] = useState<Pick>({ index: 4, ring: 'pure' });
  const [activeSlot, setActiveSlot] = useState<'A' | 'B'>('A');
  const [paintType, setPaintType] = useState<PaintType>('acrylic');
  const [ratio, setRatio] = useState(50);
  const [saving, setSaving] = useState(false);

  const hexA = useMemo(() => ringColor(PIGMENTS[pickA.index], RINGS.find((r) => r.id === pickA.ring)!), [pickA]);
  const hexB = useMemo(() => ringColor(PIGMENTS[pickB.index], RINGS.find((r) => r.id === pickB.ring)!), [pickB]);

  const mixed = useMemo(() => mixColors(hexA, hexB, ratio, paintType), [hexA, hexB, ratio, paintType]);
  const steps = useMemo(
    () => Array.from({ length: STEP_COUNT }, (_, i) => mixColors(hexA, hexB, (i / (STEP_COUNT - 1)) * 100, paintType)),
    [hexA, hexB, paintType],
  );

  const circDiff = useMemo(() => {
    const diff = Math.abs(pickA.index - pickB.index);
    return Math.min(diff, PIGMENTS.length - diff);
  }, [pickA.index, pickB.index]);
  const isComplementary = circDiff >= 5 && pickA.index !== pickB.index;

  const handleWedgePick = (index: number, ring: RingId) => {
    if (activeSlot === 'A') {
      setPickA({ index, ring });
      setActiveSlot('B');
    } else {
      setPickB({ index, ring });
      setActiveSlot('A');
    }
  };

  const handleWedgeKeyDown = (e: KeyboardEvent<SVGPathElement>, index: number, ring: RingId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleWedgePick(index, ring);
    }
  };

  const copyColor = async (hex: string) => {
    await navigator.clipboard.writeText(hex);
    addToast({ message: `Copied ${hex}`, variant: 'success', duration: 1600 });
  };

  const saveAsPalette = async () => {
    setSaving(true);
    try {
      const name = `${PIGMENTS[pickA.index].name} + ${PIGMENTS[pickB.index].name} Mix`;
      const palette = await createPalette({ name, colors: steps, source: 'wheel' });
      await addHistory('palette', palette.name, steps[0], PAINT_TYPE_LABELS[paintType]);
      addToast({ message: 'Palette saved', description: `${steps.length} colors added to your library`, variant: 'success' });
    } finally {
      setSaving(false);
    }
  };

  const markerFor = (pick: Pick) => {
    const ring = RINGS.find((r) => r.id === pick.ring)!;
    const midR = (ring.innerR + ring.outerR) / 2;
    return polarToCartesian(midR, pick.index * SEGMENT_DEG + SEGMENT_DEG / 2);
  };

  const markerA = markerFor(pickA);
  const markerB = markerFor(pickB);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6 pb-6"
    >
      <div>
        <p className="text-sm font-medium text-[var(--text-tertiary)]">Pigment Wheel</p>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
          Predict what happens when you mix paint
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-[var(--text-secondary)]">
          A traditional 12-hue artist&apos;s color wheel. Pick two pigments — from any tint, tone, or shade ring — and see the
          predicted mixed result for your medium.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[auto_1fr]">
        <Card strong className="flex flex-col items-center gap-5 p-6">
          <svg width={SVG_SIZE} height={SVG_SIZE} viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`} role="img" aria-label="Pigment color wheel">
            {RINGS.map((ring) =>
              PIGMENTS.map((pigment, index) => {
                const start = index * SEGMENT_DEG;
                const end = start + SEGMENT_DEG;
                const fill = ringColor(pigment, ring);
                const isPickA = pickA.index === index && pickA.ring === ring.id;
                const isPickB = pickB.index === index && pickB.ring === ring.id;
                return (
                  <path
                    key={`${ring.id}-${pigment.name}`}
                    d={wedgePath(ring.innerR, ring.outerR, start, end)}
                    fill={fill}
                    stroke="var(--bg-page)"
                    strokeWidth={1.5}
                    role="button"
                    tabIndex={0}
                    aria-label={`${ring.label} ${pigment.name}`}
                    aria-pressed={isPickA || isPickB}
                    onClick={() => handleWedgePick(index, ring.id)}
                    onKeyDown={(e) => handleWedgeKeyDown(e, index, ring.id)}
                    className="cursor-pointer outline-none transition-opacity hover:opacity-80 focus-visible:opacity-80"
                  />
                );
              }),
            )}

            <circle cx={markerA.x} cy={markerA.y} r={9} fill="none" stroke="white" strokeWidth={2.5} className="pointer-events-none" />
            <circle cx={markerA.x} cy={markerA.y} r={9} fill="none" stroke="black" strokeWidth={1} className="pointer-events-none" />
            <text x={markerA.x} y={markerA.y + 1} textAnchor="middle" dominantBaseline="middle" className="pointer-events-none select-none text-[10px] font-bold" fill="white" stroke="black" strokeWidth={0.6}>
              A
            </text>

            <circle cx={markerB.x} cy={markerB.y} r={9} fill="none" stroke="white" strokeWidth={2.5} className="pointer-events-none" />
            <circle cx={markerB.x} cy={markerB.y} r={9} fill="none" stroke="black" strokeWidth={1} className="pointer-events-none" />
            <text x={markerB.x} y={markerB.y + 1} textAnchor="middle" dominantBaseline="middle" className="pointer-events-none select-none text-[10px] font-bold" fill="white" stroke="black" strokeWidth={0.6}>
              B
            </text>
          </svg>

          <div className="flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-[var(--text-tertiary)]">
            {RINGS.map((ring) => (
              <span key={ring.id} className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full" style={{ backgroundColor: ringColor(PIGMENTS[0], ring) }} />
                {ring.label}
              </span>
            ))}
          </div>

          <p className="text-center text-xs text-[var(--text-tertiary)]">
            Click a wedge to set Pigment {activeSlot}, or pick a chip below to re-target.
          </p>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardContent className="flex flex-col gap-3 p-5 sm:flex-row">
              <PigmentChip slot="A" pick={pickA} active={activeSlot === 'A'} onClick={() => setActiveSlot('A')} />
              <PigmentChip slot="B" pick={pickB} active={activeSlot === 'B'} onClick={() => setActiveSlot('B')} />
            </CardContent>
          </Card>

          {isComplementary && (
            <div className="flex items-start gap-2.5 rounded-[var(--radius-control)] border border-warning-500/30 bg-warning-500/10 p-3.5">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning-400" />
              <p className="text-sm text-warning-200">
                These pigments sit near-opposite on the wheel. In real paint, near-complementary mixes tend to neutralize each
                other into a muddy gray or brown rather than a vivid blend.
              </p>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Mixed result</CardTitle>
              <Button size="sm" leftIcon={<Sparkles className="size-4" />} loading={saving} onClick={saveAsPalette}>
                Save as palette
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <SegmentedControl options={PAINT_OPTIONS} value={paintType} onChange={setPaintType} aria-label="Paint medium" />
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <ColorSwatch hex={mixed} size="xl" copyOnClick />
                <div className="flex-1 space-y-3">
                  <Slider
                    label="Mix ratio (A → B)"
                    value={ratio}
                    onChange={setRatio}
                    formatValue={(v) => `${v}%`}
                    trackGradient={`linear-gradient(90deg, ${hexA}, ${hexB})`}
                  />
                  <CopyField label="Mixed HEX" value={mixed} />
                </div>
              </div>
              {isComplementary && (
                <Badge variant="warning" className="self-start">
                  Mix may look muddy
                </Badge>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mix gradient</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex overflow-hidden rounded-xl border border-[var(--border-subtle)]">
                {steps.map((c, i) => (
                  <button key={i} type="button" style={{ backgroundColor: c }} onClick={() => copyColor(c)} aria-label={`Copy ${c}`} className="h-16 flex-1" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
