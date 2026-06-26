import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Clock,
  Contrast,
  History,
  Palette as PaletteIcon,
  Shuffle,
  Sparkles,
  SwatchBook,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ColorSwatch } from '@/components/ui/ColorSwatch';
import { CopyField } from '@/components/ui/CopyField';
import { EmptyState } from '@/components/ui/EmptyState';
import { NAV_ITEMS } from '@/config/navigation';
import { usePaletteStore } from '@/store/paletteStore';
import { useUiStore } from '@/store/uiStore';
import { randomHslHex } from '@/utils/color/random';
import { formatHsl, formatRgb } from '@/utils/color/format';
import { getAllFormats } from '@/utils/color/allFormats';
import { generateHarmonyPalette, HARMONY_RULES } from '@/utils/color/harmony';

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 5) return 'Burning the midnight oil';
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

const QUICK_TOOLS = NAV_ITEMS.filter((item) => item.path !== '/' && item.path !== '/settings');

const TOOL_DESCRIPTIONS: Record<string, string> = {
  '/wheel': 'Pick colors visually on an interactive wheel.',
  '/converter': 'Convert between HEX, RGB, HSL, LAB and more.',
  '/harmony': 'Generate color schemes from harmony rules.',
  '/tones': 'Build tints, shades and tones from a base color.',
  '/gradients': 'Design linear, radial and mesh gradients.',
  '/mixer': 'Mix paints and pigments like a real palette.',
  '/extract': 'Pull a palette out of any image.',
  '/contrast': 'Check WCAG contrast for accessible text.',
  '/blindness': 'Preview your palette under color blindness.',
  '/palettes': 'Browse, organize and export saved palettes.',
  '/assistant': 'Describe a vibe, get a palette back.',
  '/learn': 'Learn color theory fundamentals.',
};

export default function DashboardPage() {
  const palettes = usePaletteStore((s) => s.palettes);
  const history = usePaletteStore((s) => s.history);
  const createPalette = usePaletteStore((s) => s.createPalette);
  const addHistory = usePaletteStore((s) => s.addHistory);
  const addToast = useUiStore((s) => s.addToast);

  const [featured, setFeatured] = useState(() => randomHslHex());
  const [saving, setSaving] = useState(false);

  const greeting = useMemo(() => getGreeting(), []);
  const formats = useMemo(() => getAllFormats(featured), [featured]);
  const recentPalettes = palettes.slice(0, 5);
  const totalColors = useMemo(() => palettes.reduce((sum, p) => sum + p.colors.length, 0), [palettes]);
  const recentActivity = history.slice(0, 5);

  const shuffle = () => setFeatured(randomHslHex());

  const saveAsPalette = async () => {
    setSaving(true);
    try {
      const rule = HARMONY_RULES[Math.floor(Math.random() * (HARMONY_RULES.length - 1))];
      const colors = generateHarmonyPalette(featured, rule, 5);
      const palette = await createPalette({ name: `Untitled Palette`, colors, source: 'harmony' });
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
        <p className="text-sm font-medium text-[var(--text-tertiary)]">{greeting}</p>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
          Your color workspace
        </h1>
      </div>

      <Card strong>
        <CardHeader>
          <CardTitle>Color of the moment</CardTitle>
          <Badge variant="primary">{formats.hex}</Badge>
        </CardHeader>
        <CardContent className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <ColorSwatch hex={formats.hex} size="xl" copyOnClick />
          <div className="grid flex-1 gap-2.5 sm:grid-cols-3">
            <CopyField label="HEX" value={formats.hex} />
            <CopyField label="RGB" value={formatRgb(formats.rgb)} />
            <CopyField label="HSL" value={formatHsl(formats.hsl)} />
          </div>
        </CardContent>
        <CardContent className="flex flex-wrap gap-2.5 pt-0">
          <Button variant="secondary" size="sm" leftIcon={<Shuffle className="size-4" />} onClick={shuffle}>
            Shuffle
          </Button>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Sparkles className="size-4" />}
            loading={saving}
            onClick={saveAsPalette}
          >
            Save as palette
          </Button>
          <Link to="/harmony">
            <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="size-4" />}>
              Explore harmony
            </Button>
          </Link>
          <Link to="/contrast">
            <Button variant="ghost" size="sm" leftIcon={<Contrast className="size-4" />}>
              Check contrast
            </Button>
          </Link>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary-500/15 text-primary-300">
              <PaletteIcon className="size-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-[var(--text-primary)]">{palettes.length}</p>
              <p className="text-xs text-[var(--text-tertiary)]">Saved palettes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 items-center justify-center rounded-xl bg-info-500/15 text-info-400">
              <SwatchBook className="size-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-[var(--text-primary)]">{totalColors}</p>
              <p className="text-xs text-[var(--text-tertiary)]">Colors stored</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 items-center justify-center rounded-xl bg-success-500/15 text-success-400">
              <History className="size-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-[var(--text-primary)]">{history.length}</p>
              <p className="text-xs text-[var(--text-tertiary)]">Activity entries</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-[var(--text-secondary)]">Quick tools</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {QUICK_TOOLS.map(({ path, label, icon: Icon }) => (
            <Link key={path} to={path}>
              <Card interactive className="h-full">
                <CardContent className="flex flex-col gap-2.5 p-4">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-[var(--glass-bg-strong)] text-[var(--text-secondary)]">
                    <Icon className="size-4.5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{label}</p>
                    <p className="text-xs text-[var(--text-tertiary)]">{TOOL_DESCRIPTIONS[path]}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent palettes</CardTitle>
            <Link to="/palettes">
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="size-4" />}>
                View all
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentPalettes.length === 0 ? (
              <EmptyState
                icon={PaletteIcon}
                title="No palettes yet"
                description="Save a palette from the color above, or build one in the Harmony Generator."
                action={
                  <Link to="/harmony">
                    <Button size="sm">Create a palette</Button>
                  </Link>
                }
              />
            ) : (
              <div className="space-y-3">
                {recentPalettes.map((palette) => (
                  <div
                    key={palette.id}
                    className="flex items-center justify-between gap-3 rounded-[var(--radius-control)] border border-[var(--border-subtle)] bg-[var(--glass-bg)] p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex overflow-hidden rounded-lg border border-[var(--border-subtle)]">
                        {palette.colors.slice(0, 5).map((c, i) => (
                          <span key={i} style={{ backgroundColor: c }} className="size-7" />
                        ))}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--text-primary)]">{palette.name}</p>
                        <p className="text-xs text-[var(--text-tertiary)]">
                          {palette.colors.length} colors · {formatTimeAgo(palette.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <EmptyState icon={Clock} title="Nothing yet" description="Your recent actions will show up here." />
            ) : (
              <ul className="space-y-3">
                {recentActivity.map((entry) => (
                  <li key={entry.id} className="flex items-center gap-2.5">
                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: entry.value.startsWith('#') ? entry.value : 'var(--text-tertiary)' }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-[var(--text-primary)]">{entry.label}</p>
                      <p className="text-xs text-[var(--text-tertiary)]">{formatTimeAgo(entry.timestamp)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
