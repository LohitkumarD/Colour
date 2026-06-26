import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Pipette, RotateCcw, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Slider } from '@/components/ui/Slider';
import { ColorSwatch } from '@/components/ui/ColorSwatch';
import { CopyField } from '@/components/ui/CopyField';
import { getAllFormats } from '@/utils/color/allFormats';
import { cmykToRgb, hexToRgb, hslToRgb, hsvToRgb, rgbToHex } from '@/utils/color/conversions';
import {
  formatCmyk,
  formatHsl,
  formatHsv,
  formatLab,
  formatLch,
  formatOklab,
  formatOklch,
  formatRgb,
  formatXyz,
  parseColorInput,
} from '@/utils/color/format';
import { randomHex } from '@/utils/color/random';
import type { CMYK, HSL, HSV, RGB } from '@/types/color';

const DEFAULT_RGB: RGB = { r: 134, g: 59, b: 255 };
const HUE_GRADIENT = 'linear-gradient(90deg, red, yellow, lime, cyan, blue, magenta, red)';

export default function ConverterPage() {
  const [rgb, setRgb] = useState<RGB>(DEFAULT_RGB);
  const [smartInput, setSmartInput] = useState('');

  const formats = useMemo(() => getAllFormats(rgbToHex(rgb)), [rgb]);

  useEffect(() => {
    setSmartInput(formats.hex);
  }, [formats.hex]);

  const handleSmartInputChange = (value: string) => {
    setSmartInput(value);
    const parsed = parseColorInput(value);
    if (parsed) setRgb(parsed);
  };

  const setRgbChannel = (key: keyof RGB, value: number) => setRgb((prev) => ({ ...prev, [key]: value }));
  const setFromHsl = (key: keyof HSL, value: number) => setRgb(hslToRgb({ ...formats.hsl, [key]: value }));
  const setFromHsv = (key: keyof HSV, value: number) => setRgb(hsvToRgb({ ...formats.hsv, [key]: value }));
  const setFromCmyk = (key: keyof CMYK, value: number) => setRgb(cmykToRgb({ ...formats.cmyk, [key]: value }));

  const handleRandomize = () => setRgb(hexToRgb(randomHex()));
  const handleReset = () => setRgb(DEFAULT_RGB);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6 pb-6"
    >
      <div>
        <p className="text-sm font-medium text-[var(--text-tertiary)]">Color Converter</p>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
          Convert between formats
        </h1>
      </div>

      <Card strong>
        <CardContent className="flex flex-col gap-3.5 p-5 sm:flex-row sm:items-center">
          <ColorSwatch hex={formats.hex} size="xl" copyOnClick />
          <div className="flex-1">
            <Input
              value={smartInput}
              onChange={(e) => handleSmartInputChange(e.target.value)}
              onBlur={() => setSmartInput(formats.hex)}
              prefix={<Pipette className="size-4 text-[var(--text-tertiary)]" />}
              placeholder="#863BFF, rgb(134, 59, 255), hsl(265, 100%, 62%)..."
              className="font-mono"
              aria-label="Paste a color in any format"
            />
          </div>
          <div className="flex gap-2.5">
            <Button variant="secondary" size="sm" leftIcon={<Shuffle className="size-4" />} onClick={handleRandomize}>
              Randomize
            </Button>
            <Button variant="ghost" size="sm" leftIcon={<RotateCcw className="size-4" />} onClick={handleReset}>
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>RGB</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Slider
              label="Red"
              value={rgb.r}
              max={255}
              onChange={(v) => setRgbChannel('r', v)}
              trackGradient={`linear-gradient(90deg, rgb(0,${rgb.g},${rgb.b}), rgb(255,${rgb.g},${rgb.b}))`}
            />
            <Slider
              label="Green"
              value={rgb.g}
              max={255}
              onChange={(v) => setRgbChannel('g', v)}
              trackGradient={`linear-gradient(90deg, rgb(${rgb.r},0,${rgb.b}), rgb(${rgb.r},255,${rgb.b}))`}
            />
            <Slider
              label="Blue"
              value={rgb.b}
              max={255}
              onChange={(v) => setRgbChannel('b', v)}
              trackGradient={`linear-gradient(90deg, rgb(${rgb.r},${rgb.g},0), rgb(${rgb.r},${rgb.g},255))`}
            />
            <CopyField value={formatRgb(formats.rgb)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>HSL</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Slider label="Hue" value={Math.round(formats.hsl.h)} max={360} onChange={(v) => setFromHsl('h', v)} formatValue={(v) => `${v}°`} trackGradient={HUE_GRADIENT} />
            <Slider label="Saturation" value={Math.round(formats.hsl.s)} onChange={(v) => setFromHsl('s', v)} formatValue={(v) => `${v}%`} />
            <Slider label="Lightness" value={Math.round(formats.hsl.l)} onChange={(v) => setFromHsl('l', v)} formatValue={(v) => `${v}%`} />
            <CopyField value={formatHsl(formats.hsl)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>HSV</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Slider label="Hue" value={Math.round(formats.hsv.h)} max={360} onChange={(v) => setFromHsv('h', v)} formatValue={(v) => `${v}°`} trackGradient={HUE_GRADIENT} />
            <Slider label="Saturation" value={Math.round(formats.hsv.s)} onChange={(v) => setFromHsv('s', v)} formatValue={(v) => `${v}%`} />
            <Slider label="Value" value={Math.round(formats.hsv.v)} onChange={(v) => setFromHsv('v', v)} formatValue={(v) => `${v}%`} />
            <CopyField value={formatHsv(formats.hsv)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>CMYK</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Slider label="Cyan" value={Math.round(formats.cmyk.c)} onChange={(v) => setFromCmyk('c', v)} formatValue={(v) => `${v}%`} />
            <Slider label="Magenta" value={Math.round(formats.cmyk.m)} onChange={(v) => setFromCmyk('m', v)} formatValue={(v) => `${v}%`} />
            <Slider label="Yellow" value={Math.round(formats.cmyk.y)} onChange={(v) => setFromCmyk('y', v)} formatValue={(v) => `${v}%`} />
            <Slider label="Key (black)" value={Math.round(formats.cmyk.k)} onChange={(v) => setFromCmyk('k', v)} formatValue={(v) => `${v}%`} />
            <CopyField value={formatCmyk(formats.cmyk)} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Advanced & perceptual spaces</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2.5 sm:grid-cols-2">
          <CopyField label="LAB" value={formatLab(formats.lab)} />
          <CopyField label="XYZ" value={formatXyz(formats.xyz)} />
          <CopyField label="LCH" value={formatLch(formats.lch)} />
          <CopyField label="OKLab" value={formatOklab(formats.oklab)} />
          <CopyField label="OKLCH" value={formatOklch(formats.oklch)} />
        </CardContent>
      </Card>
    </motion.div>
  );
}
