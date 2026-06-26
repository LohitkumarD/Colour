import { useCallback, useMemo, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ColorPickerField } from '@/components/ui/ColorPickerField';
import { Select } from '@/components/ui/Select';
import { Slider } from '@/components/ui/Slider';
import { CopyField } from '@/components/ui/CopyField';
import { usePaletteStore } from '@/store/paletteStore';
import { useUiStore } from '@/store/uiStore';
import { hexToRgb, hsvToRgb, rgbToHex, rgbToHsv } from '@/utils/color/conversions';
import { formatCmyk, formatHsl, formatHsv, formatRgb } from '@/utils/color/format';
import { getAllFormats } from '@/utils/color/allFormats';
import { generateHarmonyPalette, HARMONY_LABELS, HARMONY_RULES } from '@/utils/color/harmony';
import type { HarmonyRule, HSV } from '@/types/color';

const WHEEL_SIZE = 272;
const WHEEL_RADIUS = WHEEL_SIZE / 2;
const HUE_RING = Array.from({ length: 13 }, (_, i) => `hsl(${i * 30} 100% 50%)`).join(', ');
const DEFAULT_HSV: HSV = { h: 265, s: 70, v: 88 };

/** Maps a pointer position to hue/saturation so 0deg sits at 12 o'clock and increases clockwise, matching the conic-gradient ring. */
function pointToHueSat(clientX: number, clientY: number, rect: DOMRect) {
  const radius = rect.width / 2;
  const dx = clientX - (rect.left + radius);
  const dy = clientY - (rect.top + radius);
  const dist = Math.min(Math.sqrt(dx * dx + dy * dy), radius);
  const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
  const h = (((angleDeg - 270) % 360) + 360) % 360;
  const s = (dist / radius) * 100;
  return { h, s };
}

function hueSatToPoint(h: number, s: number, radius: number) {
  const angleRad = ((h + 270) * Math.PI) / 180;
  const r = (s / 100) * radius;
  return { x: radius + r * Math.cos(angleRad), y: radius + r * Math.sin(angleRad) };
}

export default function ColorWheelPage() {
  const createPalette = usePaletteStore((s) => s.createPalette);
  const addHistory = usePaletteStore((s) => s.addHistory);
  const addToast = useUiStore((s) => s.addToast);

  const [hsv, setHsv] = useState<HSV>(DEFAULT_HSV);
  const [harmonyRule, setHarmonyRule] = useState<HarmonyRule>('complementary');
  const [saving, setSaving] = useState(false);

  const draggingRef = useRef(false);
  const wheelRef = useRef<HTMLDivElement>(null);

  const hex = useMemo(() => rgbToHex(hsvToRgb(hsv)), [hsv]);
  const formats = useMemo(() => getAllFormats(hex), [hex]);
  const harmonyColors = useMemo(() => generateHarmonyPalette(hex, harmonyRule, 5), [hex, harmonyRule]);

  const updateFromPoint = useCallback((clientX: number, clientY: number) => {
    const el = wheelRef.current;
    if (!el) return;
    const { h, s } = pointToHueSat(clientX, clientY, el.getBoundingClientRect());
    setHsv((prev) => ({ ...prev, h, s }));
  }, []);

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromPoint(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    updateFromPoint(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
    void addHistory('color', hex, hex);
  };

  const handleRandomize = () => {
    setHsv({ h: Math.random() * 360, s: 40 + Math.random() * 60, v: 55 + Math.random() * 45 });
  };

  const handleReset = () => setHsv(DEFAULT_HSV);

  const saveAsPalette = async () => {
    setSaving(true);
    try {
      const palette = await createPalette({ name: 'Untitled Palette', colors: harmonyColors, source: 'harmony' });
      await addHistory('palette', palette.name, harmonyColors[0], harmonyRule);
      addToast({
        message: 'Palette saved',
        description: `${harmonyColors.length} colors added to your library`,
        variant: 'success',
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePos = hueSatToPoint(hsv.h, hsv.s, WHEEL_RADIUS);
  const valueOverlay = (100 - hsv.v) / 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6 pb-6"
    >
      <div>
        <p className="text-sm font-medium text-[var(--text-tertiary)]">Color Wheel</p>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
          Pick a color visually
        </h1>
      </div>

      <div className="grid gap-4 lg:grid-cols-[auto_1fr]">
        <Card strong className="flex flex-col items-center gap-5 p-6">
          <div
            ref={wheelRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            role="slider"
            aria-label="Hue and saturation"
            aria-valuetext={`Hue ${Math.round(hsv.h)}, saturation ${Math.round(hsv.s)}%`}
            className="relative shrink-0 touch-none select-none rounded-full shadow-[var(--shadow-card)]"
            style={{
              width: WHEEL_SIZE,
              height: WHEEL_SIZE,
              backgroundImage: `radial-gradient(circle at center, white 0%, transparent 100%), conic-gradient(from 0deg, ${HUE_RING})`,
            }}
          >
            <div className="pointer-events-none absolute inset-0 rounded-full bg-black" style={{ opacity: valueOverlay }} />
            <div
              className="pointer-events-none absolute size-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
              style={{ left: handlePos.x, top: handlePos.y, backgroundColor: hex, boxShadow: '0 0 0 1px rgba(0,0,0,0.35), var(--shadow-card)' }}
            />
          </div>

          <Slider
            label="Brightness"
            value={Math.round(hsv.v)}
            onChange={(v) => setHsv((prev) => ({ ...prev, v }))}
            formatValue={(v) => `${v}%`}
            className="w-full"
            trackGradient={`linear-gradient(90deg, black, hsl(${hsv.h} ${hsv.s}% 50%))`}
          />

          <ColorPickerField
            value={hex}
            onChange={(newHex) => setHsv(rgbToHsv(hexToRgb(newHex)))}
            ariaLabel="Hex color value"
            swatchSize="lg"
            className="w-full"
          />

          <div className="flex w-full flex-wrap gap-2.5">
            <Button variant="secondary" size="sm" leftIcon={<Sparkles className="size-4" />} onClick={handleRandomize}>
              Randomize
            </Button>
            <Button variant="ghost" size="sm" leftIcon={<RotateCcw className="size-4" />} onClick={handleReset}>
              Reset
            </Button>
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Formats</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2.5 sm:grid-cols-2">
              <CopyField label="HEX" value={formats.hex} />
              <CopyField label="RGB" value={formatRgb(formats.rgb)} />
              <CopyField label="HSL" value={formatHsl(formats.hsl)} />
              <CopyField label="HSV" value={formatHsv(hsv)} />
              <CopyField label="CMYK" value={formatCmyk(formats.cmyk)} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Harmony preview</CardTitle>
              <Select
                value={harmonyRule}
                onChange={(e) => setHarmonyRule(e.target.value as HarmonyRule)}
                className="w-44 shrink-0"
                aria-label="Harmony rule"
              >
                {HARMONY_RULES.map((rule) => (
                  <option key={rule} value={rule}>
                    {HARMONY_LABELS[rule]}
                  </option>
                ))}
              </Select>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex overflow-hidden rounded-xl border border-[var(--border-subtle)]">
                {harmonyColors.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    style={{ backgroundColor: c }}
                    className="h-20 flex-1"
                    aria-label={`Harmony color ${c}`}
                    onClick={async () => {
                      await navigator.clipboard.writeText(c);
                      addToast({ message: `Copied ${c}`, variant: 'success', duration: 1600 });
                    }}
                  />
                ))}
              </div>
              <Button leftIcon={<Sparkles className="size-4" />} loading={saving} onClick={saveAsPalette}>
                Save as palette
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
