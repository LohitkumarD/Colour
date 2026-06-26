import { useState } from 'react';
import type { FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Library, RefreshCw, Sparkles, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { usePaletteStore } from '@/store/paletteStore';
import { useUiStore } from '@/store/uiStore';
import { generateAiPalette, SUGGESTED_PROMPTS } from '@/utils/color/aiAssistant';
import type { AiPaletteResult } from '@/utils/color/aiAssistant';

const THINKING_DELAY_MS = 650;

export default function AssistantPage() {
  const createPalette = usePaletteStore((s) => s.createPalette);
  const addHistory = usePaletteStore((s) => s.addHistory);
  const addToast = useUiStore((s) => s.addToast);

  const [prompt, setPrompt] = useState('');
  const [seed, setSeed] = useState(0);
  const [thinking, setThinking] = useState(false);
  const [result, setResult] = useState<AiPaletteResult | null>(null);
  const [saving, setSaving] = useState(false);

  const runGeneration = (text: string, nextSeed: number) => {
    const value = text.trim();
    if (!value) {
      addToast({ message: 'Describe a mood or theme first', variant: 'error' });
      return;
    }
    setThinking(true);
    window.setTimeout(() => {
      setResult(generateAiPalette(value, { seed: nextSeed }));
      setThinking(false);
    }, THINKING_DELAY_MS);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSeed(0);
    runGeneration(prompt, 0);
  };

  const handleSuggestion = (text: string) => {
    setPrompt(text);
    setSeed(0);
    runGeneration(text, 0);
  };

  const handleRegenerate = () => {
    const nextSeed = seed + 1;
    setSeed(nextSeed);
    runGeneration(prompt, nextSeed);
  };

  const copyColor = async (hex: string) => {
    await navigator.clipboard.writeText(hex);
    addToast({ message: `Copied ${hex}`, variant: 'success', duration: 1600 });
  };

  const handleSave = async () => {
    if (!result) return;
    setSaving(true);
    try {
      const palette = await createPalette({ name: result.name, colors: result.colors, source: 'ai' });
      await addHistory('palette', palette.name, result.colors[0]);
      addToast({ message: 'Palette saved', description: `${result.colors.length} colors added to your library`, variant: 'success' });
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
        <p className="text-sm font-medium text-[var(--text-tertiary)]">AI Color Assistant</p>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
          Describe a mood, get a palette
        </h1>
      </div>

      <Card strong>
        <CardContent className="space-y-4 p-5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Sunset over the ocean, cyberpunk neon city, cozy autumn cabin"
                prefix={<Sparkles className="size-4 text-[var(--text-tertiary)]" />}
                aria-label="Describe a mood or theme"
              />
            </div>
            <Button type="submit" leftIcon={<Wand2 className="size-4" />} loading={thinking}>
              Generate
            </Button>
          </form>

          <div className="flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleSuggestion(s)}
                className="rounded-full bg-[var(--glass-bg)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--glass-bg-strong)] hover:text-[var(--text-primary)]"
              >
                {s}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        {thinking && (
          <motion.div
            key="thinking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-3 rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--glass-bg)] p-10 text-sm text-[var(--text-tertiary)]"
          >
            <Sparkles className="size-4 animate-pulse text-accent-400" />
            Composing a palette for you…
          </motion.div>
        )}

        {!thinking && result && (
          <motion.div
            key={`result-${seed}-${result.name}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Card strong>
              <CardContent className="space-y-4 p-5">
                <div className="flex overflow-hidden rounded-xl border border-[var(--border-subtle)]">
                  {result.colors.map((c, i) => (
                    <button
                      key={i}
                      type="button"
                      style={{ backgroundColor: c }}
                      onClick={() => copyColor(c)}
                      aria-label={`Copy ${c}`}
                      className="h-20 flex-1"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-[var(--text-primary)]">{result.name}</h2>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge>AI</Badge>
                      <span className="text-xs text-[var(--text-tertiary)]">{result.colors.length} colors</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" aria-label="Regenerate" onClick={handleRegenerate}>
                      <RefreshCw className="size-4" />
                    </Button>
                    <Button leftIcon={<Library className="size-4" />} onClick={handleSave} loading={saving}>
                      Save as palette
                    </Button>
                  </div>
                </div>

                <p className="rounded-[var(--radius-control)] border border-[var(--border-subtle)] bg-[var(--glass-bg)] p-3.5 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {result.explanation}
                </p>

                <div className="flex flex-wrap gap-2">
                  {result.colors.map((c) => (
                    <span
                      key={c}
                      className="rounded-full bg-[var(--glass-bg-strong)] px-2.5 py-1 font-mono text-xs text-[var(--text-secondary)]"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
