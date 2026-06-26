import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Download, FolderPlus, Heart, Library, Search, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';
import { usePaletteStore } from '@/store/paletteStore';
import { useUiStore } from '@/store/uiStore';
import { cn } from '@/utils/cn';
import { downloadText } from '@/utils/download';
import { PALETTE_EXPORT_FORMATS } from '@/utils/color/paletteExport';
import type { Folder, Palette } from '@/types/palette';

const SOURCE_LABELS: Record<Palette['source'], string> = {
  manual: 'Manual',
  harmony: 'Harmony',
  image: 'Image',
  ai: 'AI',
  mixer: 'Mixer',
  gradient: 'Gradient',
  tones: 'Tones',
  wheel: 'Wheel',
};

type FilterValue = 'all' | 'favorites' | 'unfiled' | string;

interface FilterChipProps {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  removable?: boolean;
  onRemove?: () => void;
}

function FilterChip({ label, count, active, onClick, removable, onRemove }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex h-8 items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold transition-colors',
        active
          ? 'bg-[var(--text-primary)] text-[var(--text-inverse)]'
          : 'bg-[var(--glass-bg)] text-[var(--text-secondary)] hover:bg-[var(--glass-bg-strong)]',
      )}
    >
      {label}
      <span className={cn(active ? 'opacity-70' : 'text-[var(--text-tertiary)]')}>{count}</span>
      {removable && (
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          aria-label={`Delete folder ${label}`}
          className="ml-0.5 rounded-full p-0.5 hover:bg-black/10"
        >
          <X className="size-3" />
        </span>
      )}
    </button>
  );
}

interface FolderBarProps {
  folders: Folder[];
  activeFilter: FilterValue;
  counts: Record<string, number>;
  onChange: (value: FilterValue) => void;
  onCreateFolder: (name: string) => void;
  onDeleteFolder: (id: string) => void;
}

function FolderBar({ folders, activeFilter, counts, onChange, onCreateFolder, onDeleteFolder }: FolderBarProps) {
  const [creating, setCreating] = useState(false);
  const [folderName, setFolderName] = useState('');

  const submit = () => {
    const trimmed = folderName.trim();
    if (trimmed) onCreateFolder(trimmed);
    setFolderName('');
    setCreating(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <FilterChip label="All" count={counts.all ?? 0} active={activeFilter === 'all'} onClick={() => onChange('all')} />
      <FilterChip label="Favorites" count={counts.favorites ?? 0} active={activeFilter === 'favorites'} onClick={() => onChange('favorites')} />
      <FilterChip label="Unfiled" count={counts.unfiled ?? 0} active={activeFilter === 'unfiled'} onClick={() => onChange('unfiled')} />
      {folders.map((f) => (
        <FilterChip
          key={f.id}
          label={f.name}
          count={counts[f.id] ?? 0}
          active={activeFilter === f.id}
          onClick={() => onChange(f.id)}
          removable
          onRemove={() => onDeleteFolder(f.id)}
        />
      ))}
      {creating ? (
        <input
          autoFocus
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          onBlur={submit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit();
            if (e.key === 'Escape') {
              setFolderName('');
              setCreating(false);
            }
          }}
          placeholder="Folder name"
          className="h-8 w-32 rounded-full border border-[var(--border-subtle)] bg-[var(--glass-bg)] px-3 text-xs text-[var(--text-primary)] outline-none"
        />
      ) : (
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="flex h-8 items-center gap-1 rounded-full border border-dashed border-[var(--border-subtle)] px-3 text-xs font-medium text-[var(--text-tertiary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
        >
          <FolderPlus className="size-3.5" /> New folder
        </button>
      )}
    </div>
  );
}

interface PaletteCardProps {
  palette: Palette;
  folders: Folder[];
  onExport: (palette: Palette) => void;
}

function PaletteCard({ palette, folders, onExport }: PaletteCardProps) {
  const updatePalette = usePaletteStore((s) => s.updatePalette);
  const deletePalette = usePaletteStore((s) => s.deletePalette);
  const duplicatePalette = usePaletteStore((s) => s.duplicatePalette);
  const toggleFavorite = usePaletteStore((s) => s.toggleFavorite);
  const addToast = useUiStore((s) => s.addToast);

  const [name, setName] = useState(palette.name);
  const [tagInput, setTagInput] = useState('');

  const commitName = () => {
    const trimmed = name.trim();
    if (trimmed && trimmed !== palette.name) updatePalette(palette.id, { name: trimmed });
    else setName(palette.name);
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (!tag || palette.tags.includes(tag)) {
      setTagInput('');
      return;
    }
    updatePalette(palette.id, { tags: [...palette.tags, tag] });
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    updatePalette(palette.id, { tags: palette.tags.filter((t) => t !== tag) });
  };

  const copyColor = async (hex: string) => {
    await navigator.clipboard.writeText(hex);
    addToast({ message: `Copied ${hex}`, variant: 'success', duration: 1600 });
  };

  const handleDuplicate = async () => {
    await duplicatePalette(palette.id);
    addToast({ message: 'Palette duplicated', variant: 'success' });
  };

  const handleDelete = async () => {
    await deletePalette(palette.id);
    addToast({ message: 'Palette deleted', variant: 'info' });
  };

  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <div className="flex overflow-hidden rounded-xl border border-[var(--border-subtle)]">
          {palette.colors.map((c, i) => (
            <button key={i} type="button" style={{ backgroundColor: c }} onClick={() => copyColor(c)} aria-label={`Copy ${c}`} className="h-14 flex-1" />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={commitName}
            onKeyDown={(e) => e.key === 'Enter' && (e.currentTarget as HTMLInputElement).blur()}
            aria-label="Palette name"
            className="flex-1 rounded-lg bg-transparent px-1.5 py-0.5 text-sm font-semibold text-[var(--text-primary)] outline-none focus:bg-[var(--glass-bg)]"
          />
          <button
            type="button"
            onClick={() => toggleFavorite(palette.id)}
            aria-label={palette.favorite ? 'Unfavorite' : 'Favorite'}
            className={cn(
              'flex size-7 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-[var(--glass-bg-strong)]',
              palette.favorite ? 'text-warning-400' : 'text-[var(--text-tertiary)]',
            )}
          >
            <Heart className="size-4" fill={palette.favorite ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Badge>{SOURCE_LABELS[palette.source]}</Badge>
          <span className="text-xs text-[var(--text-tertiary)]">{palette.colors.length} colors</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {palette.tags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-[var(--glass-bg-strong)] px-2 py-0.5 text-xs text-[var(--text-secondary)]">
              {tag}
              <button type="button" onClick={() => removeTag(tag)} aria-label={`Remove tag ${tag}`}>
                <X className="size-3" />
              </button>
            </span>
          ))}
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
              }
            }}
            onBlur={addTag}
            placeholder="Add tag"
            aria-label="Add tag"
            className="w-20 bg-transparent text-xs text-[var(--text-tertiary)] outline-none placeholder:text-[var(--text-tertiary)]/70"
          />
        </div>

        <Select
          value={palette.folderId ?? ''}
          onChange={(e) => updatePalette(palette.id, { folderId: e.target.value || null })}
          aria-label="Folder"
          className="h-9 text-xs"
        >
          <option value="">Unfiled</option>
          {folders.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </Select>

        <div className="flex items-center justify-end gap-1.5 border-t border-[var(--border-subtle)] pt-3">
          <Button variant="ghost" size="icon" aria-label="Export palette" onClick={() => onExport(palette)}>
            <Download className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Duplicate palette" onClick={handleDuplicate}>
            <Copy className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Delete palette" onClick={handleDelete} className="hover:text-error-400">
            <Trash2 className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface ExportModalProps {
  palette: Palette | null;
  onClose: () => void;
}

function ExportModal({ palette, onClose }: ExportModalProps) {
  const addToast = useUiStore((s) => s.addToast);
  const [formatId, setFormatId] = useState(PALETTE_EXPORT_FORMATS[0].id);
  const format = PALETTE_EXPORT_FORMATS.find((f) => f.id === formatId) ?? PALETTE_EXPORT_FORMATS[0];
  const code = palette ? format.generate(palette) : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      addToast({ message: 'Copied to clipboard', variant: 'success', duration: 1600 });
    } catch {
      addToast({ message: 'Copy failed', variant: 'error' });
    }
  };

  const handleDownload = () => {
    if (!palette) return;
    downloadText(code, `${palette.name.toLowerCase().replace(/\s+/g, '-')}.${format.extension}`, format.mime);
  };

  return (
    <Modal open={!!palette} onClose={onClose} title="Export palette" description={palette?.name}>
      <div className="space-y-4">
        <Select label="Format" value={formatId} onChange={(e) => setFormatId(e.target.value)}>
          {PALETTE_EXPORT_FORMATS.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
            </option>
          ))}
        </Select>
        <pre className="max-h-64 overflow-auto rounded-[var(--radius-control)] border border-[var(--border-subtle)] bg-[var(--glass-bg)] p-3.5 font-mono text-xs leading-relaxed text-[var(--text-primary)]">
          {code}
        </pre>
        <div className="flex justify-end gap-2.5">
          <Button variant="ghost" leftIcon={<Copy className="size-4" />} onClick={handleCopy}>
            Copy
          </Button>
          <Button leftIcon={<Download className="size-4" />} onClick={handleDownload}>
            Download
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default function PalettesPage() {
  const palettes = usePaletteStore((s) => s.palettes);
  const folders = usePaletteStore((s) => s.folders);
  const createFolder = usePaletteStore((s) => s.createFolder);
  const deleteFolder = usePaletteStore((s) => s.deleteFolder);
  const addToast = useUiStore((s) => s.addToast);

  const [filter, setFilter] = useState<FilterValue>('all');
  const [search, setSearch] = useState('');
  const [exportTarget, setExportTarget] = useState<Palette | null>(null);

  const counts = useMemo(() => {
    const result: Record<string, number> = {
      all: palettes.length,
      favorites: palettes.filter((p) => p.favorite).length,
      unfiled: palettes.filter((p) => !p.folderId).length,
    };
    folders.forEach((f) => {
      result[f.id] = palettes.filter((p) => p.folderId === f.id).length;
    });
    return result;
  }, [palettes, folders]);

  const filtered = useMemo(() => {
    let list = palettes;
    if (filter === 'favorites') list = list.filter((p) => p.favorite);
    else if (filter === 'unfiled') list = list.filter((p) => !p.folderId);
    else if (filter !== 'all') list = list.filter((p) => p.folderId === filter);

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q)));
    }
    return list;
  }, [palettes, filter, search]);

  const handleCreateFolder = async (name: string) => {
    await createFolder(name);
    addToast({ message: `Folder "${name}" created`, variant: 'success' });
  };

  const handleDeleteFolder = async (id: string) => {
    await deleteFolder(id);
    if (filter === id) setFilter('all');
    addToast({ message: 'Folder deleted', variant: 'info' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6 pb-6"
    >
      <div>
        <p className="text-sm font-medium text-[var(--text-tertiary)]">Palette Manager</p>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
          Organize your library
        </h1>
      </div>

      <Card strong>
        <CardContent className="space-y-4 p-5">
          <FolderBar
            folders={folders}
            activeFilter={filter}
            counts={counts}
            onChange={setFilter}
            onCreateFolder={handleCreateFolder}
            onDeleteFolder={handleDeleteFolder}
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or tag"
            prefix={<Search className="size-4 text-[var(--text-tertiary)]" />}
            aria-label="Search palettes"
          />
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Library}
          title="No palettes yet"
          description="Save palettes from any tool — Harmony, Mixer, Gradients and more — and they'll show up here."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((palette) => (
            <PaletteCard key={palette.id} palette={palette} folders={folders} onExport={setExportTarget} />
          ))}
        </div>
      )}

      <ExportModal palette={exportTarget} onClose={() => setExportTarget(null)} />
    </motion.div>
  );
}
