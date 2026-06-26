import { useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Download,
  History,
  Monitor,
  Moon,
  RotateCcw,
  Smartphone,
  Sun,
  Upload,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { usePaletteStore } from '@/store/paletteStore';
import { useLearningStore } from '@/store/learningStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useUiStore } from '@/store/uiStore';
import { createBackup, resetApp, restoreBackup } from '@/services/backup';
import { cn } from '@/utils/cn';
import type { ColorSpace } from '@/types/color';
import type { ExportFormat, ThemeMode } from '@/types/settings';

const THEME_OPTIONS: { value: ThemeMode; label: string; description: string; icon: LucideIcon }[] = [
  { value: 'light', label: 'Light', description: 'Bright surfaces, dark text', icon: Sun },
  { value: 'dark', label: 'Dark', description: 'Deep glassmorphism UI', icon: Moon },
  { value: 'system', label: 'System', description: 'Match your OS preference', icon: Monitor },
];

const ACCENT_PRESETS = ['#863BFF', '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#F43F5E'];

const COLOR_FORMAT_OPTIONS: { value: ColorSpace; label: string }[] = [
  { value: 'hex', label: 'HEX' },
  { value: 'rgb', label: 'RGB' },
  { value: 'rgba', label: 'RGBA' },
  { value: 'hsl', label: 'HSL' },
  { value: 'hsv', label: 'HSV' },
  { value: 'cmyk', label: 'CMYK' },
  { value: 'lab', label: 'LAB' },
  { value: 'xyz', label: 'XYZ' },
  { value: 'lch', label: 'LCH' },
  { value: 'oklab', label: 'OKLab' },
  { value: 'oklch', label: 'OKLCH' },
];

const EXPORT_FORMAT_OPTIONS: { value: ExportFormat; label: string }[] = [
  { value: 'json', label: 'JSON' },
  { value: 'css', label: 'CSS Variables' },
  { value: 'scss', label: 'SCSS Variables' },
  { value: 'tailwind', label: 'Tailwind Config' },
  { value: 'svg', label: 'SVG' },
  { value: 'png', label: 'PNG' },
  { value: 'figma', label: 'Figma' },
];

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface ToggleRowProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-medium text-[var(--text-primary)]">{label}</p>
        <p className="text-xs text-[var(--text-tertiary)]">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-full transition-colors',
          checked ? 'bg-primary-500' : 'bg-[var(--glass-bg-strong)]',
        )}
      >
        <motion.span
          animate={{ left: checked ? 22 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 32 }}
          className="absolute top-0.5 size-5 rounded-full bg-white shadow-sm"
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const accentColor = useSettingsStore((s) => s.accentColor);
  const setAccentColor = useSettingsStore((s) => s.setAccentColor);
  const animationsEnabled = useSettingsStore((s) => s.animationsEnabled);
  const toggleAnimations = useSettingsStore((s) => s.toggleAnimations);
  const reducedMotion = useSettingsStore((s) => s.reducedMotion);
  const toggleReducedMotion = useSettingsStore((s) => s.toggleReducedMotion);
  const highContrast = useSettingsStore((s) => s.highContrast);
  const toggleHighContrast = useSettingsStore((s) => s.toggleHighContrast);
  const largeText = useSettingsStore((s) => s.largeText);
  const toggleLargeText = useSettingsStore((s) => s.toggleLargeText);
  const defaultColorFormat = useSettingsStore((s) => s.defaultColorFormat);
  const setDefaultColorFormat = useSettingsStore((s) => s.setDefaultColorFormat);
  const defaultExportFormat = useSettingsStore((s) => s.defaultExportFormat);
  const setDefaultExportFormat = useSettingsStore((s) => s.setDefaultExportFormat);

  const palettes = usePaletteStore((s) => s.palettes);
  const folders = usePaletteStore((s) => s.folders);
  const projects = usePaletteStore((s) => s.projects);
  const history = usePaletteStore((s) => s.history);
  const clearHistory = usePaletteStore((s) => s.clearHistory);
  const addToast = useUiStore((s) => s.addToast);
  const installPromptEvent = useUiStore((s) => s.installPromptEvent);
  const setInstallPrompt = useUiStore((s) => s.setInstallPrompt);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [installing, setInstalling] = useState(false);

  const isStandalone =
    typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches;

  const handleInstall = async () => {
    const promptEvent = installPromptEvent as BeforeInstallPromptEvent | null;
    if (!promptEvent) return;
    setInstalling(true);
    try {
      await promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      setInstallPrompt(null);
      addToast({
        message: outcome === 'accepted' ? 'App installed' : 'Install dismissed',
        variant: outcome === 'accepted' ? 'success' : 'info',
      });
    } finally {
      setInstalling(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await createBackup();
      addToast({ message: 'Backup downloaded', variant: 'success' });
    } finally {
      setExporting(false);
    }
  };

  const handleImportFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setImporting(true);
    try {
      await restoreBackup(file);
      await Promise.all([usePaletteStore.getState().hydrate(), useLearningStore.getState().hydrate()]);
      addToast({ message: 'Backup restored', variant: 'success' });
    } catch {
      addToast({ message: 'Restore failed — invalid backup file', variant: 'error' });
    } finally {
      setImporting(false);
    }
  };

  const handleClearHistory = async () => {
    await clearHistory();
    addToast({ message: 'History cleared', variant: 'info' });
  };

  const handleReset = async () => {
    setResetting(true);
    try {
      await resetApp();
      await Promise.all([usePaletteStore.getState().hydrate(), useLearningStore.getState().hydrate()]);
      addToast({ message: 'App reset to defaults', variant: 'info' });
    } finally {
      setResetting(false);
      setResetModalOpen(false);
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
        <p className="text-sm font-medium text-[var(--text-tertiary)]">Preferences</p>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">Settings</h1>
      </div>

      <Card strong>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <p className="mb-2.5 text-sm font-medium text-[var(--text-secondary)]">Theme</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {THEME_OPTIONS.map((opt) => {
                const active = theme === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    aria-pressed={active}
                    aria-label={`Use ${opt.label} theme`}
                    onClick={() => setTheme(opt.value)}
                    className={cn(
                      'flex flex-col items-start gap-1.5 rounded-[var(--radius-card)] border p-4 text-left transition-colors',
                      active
                        ? 'border-primary-400/60 bg-[var(--glass-bg-strong)]'
                        : 'border-[var(--border-subtle)] bg-[var(--glass-bg)] hover:bg-[var(--glass-bg-strong)]',
                    )}
                  >
                    <opt.icon className="size-5 text-primary-400" />
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{opt.label}</p>
                    <p className="text-xs text-[var(--text-tertiary)]">{opt.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-2.5 text-sm font-medium text-[var(--text-secondary)]">Accent color</p>
            <div className="flex flex-wrap items-center gap-2.5">
              {ACCENT_PRESETS.map((color) => {
                const active = accentColor.toLowerCase() === color.toLowerCase();
                return (
                  <button
                    key={color}
                    type="button"
                    aria-label={`Set accent color ${color}`}
                    aria-pressed={active}
                    onClick={() => setAccentColor(color)}
                    style={{ backgroundColor: color }}
                    className={cn(
                      'size-8 rounded-full border-2 transition-transform',
                      active ? 'scale-110 border-[var(--text-primary)]' : 'border-transparent hover:scale-105',
                    )}
                  />
                );
              })}
              <label className="flex h-8 items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--glass-bg)] px-3 text-xs text-[var(--text-tertiary)]">
                Custom
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  aria-label="Custom accent color"
                  className="size-5 cursor-pointer rounded border-none bg-transparent p-0"
                />
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card strong>
        <CardHeader>
          <CardTitle>Accessibility & motion</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-[var(--border-subtle)]">
          <ToggleRow
            label="Interface animations"
            description="Micro-interactions and page transitions"
            checked={animationsEnabled}
            onChange={(v) => toggleAnimations(v)}
          />
          <ToggleRow
            label="Reduce motion"
            description="Minimize movement for motion sensitivity"
            checked={reducedMotion}
            onChange={(v) => toggleReducedMotion(v)}
          />
          <ToggleRow
            label="High contrast"
            description="Stronger borders and text contrast"
            checked={highContrast}
            onChange={(v) => toggleHighContrast(v)}
          />
          <ToggleRow
            label="Large text"
            description="Increase base font size across the app"
            checked={largeText}
            onChange={(v) => toggleLargeText(v)}
          />
        </CardContent>
      </Card>

      <Card strong>
        <CardHeader>
          <CardTitle>Defaults</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Default color format"
            value={defaultColorFormat}
            onChange={(e) => setDefaultColorFormat(e.target.value as ColorSpace)}
          >
            {COLOR_FORMAT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
          <Select
            label="Default export format"
            value={defaultExportFormat}
            onChange={(e) => setDefaultExportFormat(e.target.value as ExportFormat)}
          >
            {EXPORT_FORMAT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </CardContent>
      </Card>

      <Card strong>
        <CardHeader>
          <CardTitle>App</CardTitle>
        </CardHeader>
        <CardContent>
          {isStandalone ? (
            <p className="text-sm text-[var(--text-tertiary)]">
              Running as an installed app — most tools work fully offline.
            </p>
          ) : installPromptEvent ? (
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">Install Color Theory Studio</p>
                <p className="text-xs text-[var(--text-tertiary)]">
                  Add it to your home screen or desktop for quick, offline access.
                </p>
              </div>
              <Button
                leftIcon={<Smartphone className="size-4" />}
                loading={installing}
                onClick={handleInstall}
                className="shrink-0"
              >
                Install
              </Button>
            </div>
          ) : (
            <p className="text-sm text-[var(--text-tertiary)]">
              Use your browser's menu and choose "Install app" or "Add to Home Screen" to install.
            </p>
          )}
        </CardContent>
      </Card>

      <Card strong>
        <CardHeader>
          <CardTitle>Data & backup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-tertiary)]">
            <span>{palettes.length} palettes</span>
            <span>·</span>
            <span>{folders.length} folders</span>
            <span>·</span>
            <span>{projects.length} projects</span>
            <span>·</span>
            <span>{history.length} history entries</span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Button variant="secondary" leftIcon={<Download className="size-4" />} loading={exporting} onClick={handleExport}>
              Export backup
            </Button>
            <Button
              variant="secondary"
              leftIcon={<Upload className="size-4" />}
              loading={importing}
              onClick={() => fileInputRef.current?.click()}
            >
              Import backup
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              onChange={handleImportFile}
              className="hidden"
              aria-label="Import backup file"
            />
            <Button variant="ghost" leftIcon={<History className="size-4" />} onClick={handleClearHistory}>
              Clear history
            </Button>
            <Button
              variant="danger"
              leftIcon={<RotateCcw className="size-4" />}
              onClick={() => setResetModalOpen(true)}
              className="ml-auto"
            >
              Reset app
            </Button>
          </div>
        </CardContent>
      </Card>

      <Modal
        open={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title="Reset app to defaults"
        description="This permanently deletes all palettes, folders, projects, history and lesson progress, and restores default settings. This cannot be undone."
      >
        <div className="space-y-4">
          <div className="flex items-start gap-2.5 rounded-[var(--radius-control)] border border-error-500/30 bg-error-500/10 p-3.5 text-sm text-error-300">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <p>Consider exporting a backup first — this action is irreversible.</p>
          </div>
          <div className="flex justify-end gap-2.5">
            <Button variant="ghost" onClick={() => setResetModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" loading={resetting} onClick={handleReset}>
              Reset everything
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
