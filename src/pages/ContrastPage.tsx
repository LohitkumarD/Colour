import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, Sparkles, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ColorPickerField } from '@/components/ui/ColorPickerField';
import { ColorSwatch } from '@/components/ui/ColorSwatch';
import { usePaletteStore } from '@/store/paletteStore';
import { useUiStore } from '@/store/uiStore';
import { getWcagResult, suggestAccessibleColor } from '@/utils/color/contrast';

const DEFAULT_FG = '#0F1115';
const DEFAULT_BG = '#F4F4F5';

interface CriterionRowProps {
  label: string;
  description: string;
  pass: boolean;
}

function CriterionRow({ label, description, pass }: CriterionRowProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[var(--border-subtle)] px-4 py-3">
      <div>
        <p className="text-sm font-medium text-[var(--text-primary)]">{label}</p>
        <p className="text-xs text-[var(--text-tertiary)]">{description}</p>
      </div>
      <Badge variant={pass ? 'success' : 'error'}>{pass ? 'Pass' : 'Fail'}</Badge>
    </div>
  );
}

export default function ContrastPage() {
  const createPalette = usePaletteStore((s) => s.createPalette);
  const addHistory = usePaletteStore((s) => s.addHistory);
  const addToast = useUiStore((s) => s.addToast);

  const [fg, setFg] = useState(DEFAULT_FG);
  const [bg, setBg] = useState(DEFAULT_BG);
  const [saving, setSaving] = useState(false);

  const result = useMemo(() => getWcagResult(fg, bg), [fg, bg]);
  const suggestion = useMemo(
    () => (result.aaNormal ? null : suggestAccessibleColor(fg, bg, 4.5)),
    [fg, bg, result.aaNormal],
  );

  const swapColors = () => {
    setFg(bg);
    setBg(fg);
  };

  const applySuggestion = () => {
    if (!suggestion) return;
    setFg(suggestion);
  };

  const saveAsPalette = async () => {
    setSaving(true);
    try {
      const palette = await createPalette({ name: 'Contrast Pair', colors: [fg, bg], source: 'manual' });
      await addHistory('palette', palette.name, fg);
      addToast({ message: 'Palette saved', description: '2 colors added to your library', variant: 'success' });
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
        <p className="text-sm font-medium text-[var(--text-tertiary)]">Contrast Checker</p>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
          Verify WCAG accessibility
        </h1>
      </div>

      <Card strong>
        <CardContent className="flex flex-col gap-4 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <ColorPickerField label="Foreground (text)" value={fg} onChange={setFg} swatchSize="lg" className="flex-1" />
            <Button variant="ghost" size="icon" aria-label="Swap colors" onClick={swapColors} className="mt-5 self-center sm:mt-0">
              <ArrowLeftRight className="size-4" />
            </Button>
            <ColorPickerField label="Background" value={bg} onChange={setBg} swatchSize="lg" className="flex-1" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Live preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3 rounded-2xl p-6" style={{ backgroundColor: bg }}>
              <p className="text-3xl font-bold" style={{ color: fg }}>
                Aa
              </p>
              <p className="text-lg font-semibold" style={{ color: fg }}>
                Large text sample, 24px bold
              </p>
              <p className="text-sm" style={{ color: fg }}>
                Normal body text sample at 16px — the quick brown fox jumps over the lazy dog.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contrast ratio</CardTitle>
            <Button size="sm" leftIcon={<Sparkles className="size-4" />} loading={saving} onClick={saveAsPalette}>
              Save pair
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold tracking-tight text-[var(--text-primary)]">{result.ratio}</span>
              <span className="text-sm text-[var(--text-tertiary)]">: 1</span>
              <Badge variant={result.score === 'Fail' ? 'error' : result.score === 'AA' ? 'warning' : 'success'} className="ml-auto">
                {result.score}
              </Badge>
            </div>
            <CriterionRow label="AA — Normal text" description="Minimum ratio of 4.5:1" pass={result.aaNormal} />
            <CriterionRow label="AA — Large text" description="Minimum ratio of 3:1 (18px+ or bold 14px+)" pass={result.aaLarge} />
            <CriterionRow label="AAA — Normal text" description="Minimum ratio of 7:1" pass={result.aaaNormal} />
            <CriterionRow label="AAA — Large text" description="Minimum ratio of 4.5:1" pass={result.aaaLarge} />

            {suggestion && (
              <div className="flex items-center justify-between rounded-xl border border-dashed border-[var(--border-strong)] px-4 py-3">
                <div className="flex items-center gap-3">
                  <ColorSwatch hex={suggestion} size="sm" />
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">Suggested fix</p>
                    <p className="font-mono text-xs text-[var(--text-tertiary)]">{suggestion}</p>
                  </div>
                </div>
                <Button variant="secondary" size="sm" leftIcon={<Wand2 className="size-4" />} onClick={applySuggestion}>
                  Apply
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
