import { useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Sparkles, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Slider } from '@/components/ui/Slider';
import { ColorSwatch } from '@/components/ui/ColorSwatch';
import { cn } from '@/utils/cn';
import { usePaletteStore } from '@/store/paletteStore';
import { useUiStore } from '@/store/uiStore';
import { extractPaletteFromImageData, type ExtractedPalette } from '@/utils/color/imageExtractor';

const MAX_DIMENSION = 240;

export default function ExtractPage() {
  const createPalette = usePaletteStore((s) => s.createPalette);
  const addHistory = usePaletteStore((s) => s.addHistory);
  const addToast = useUiStore((s) => s.addToast);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [extracted, setExtracted] = useState<ExtractedPalette | null>(null);
  const [count, setCount] = useState(6);
  const [isDragging, setIsDragging] = useState(false);
  const [saving, setSaving] = useState(false);

  const imageDataRef = useRef<Uint8ClampedArray | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      addToast({ message: 'Please choose an image file', variant: 'error' });
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, w, h);
      const data = ctx.getImageData(0, 0, w, h).data;
      imageDataRef.current = data;
      setExtracted(extractPaletteFromImageData(data, count));
      setImageSrc(url);
    };
    img.src = url;
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleCountChange = (value: number) => {
    setCount(value);
    if (imageDataRef.current) setExtracted(extractPaletteFromImageData(imageDataRef.current, value));
  };

  const copyColor = async (hex: string) => {
    await navigator.clipboard.writeText(hex);
    addToast({ message: `Copied ${hex}`, variant: 'success', duration: 1600 });
  };

  const saveAsPalette = async () => {
    if (!extracted || extracted.palette.length === 0) return;
    setSaving(true);
    try {
      const palette = await createPalette({ name: 'Image Palette', colors: extracted.palette, source: 'image' });
      await addHistory('palette', palette.name, extracted.palette[0]);
      addToast({ message: 'Palette saved', description: `${extracted.palette.length} colors added to your library`, variant: 'success' });
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
        <p className="text-sm font-medium text-[var(--text-tertiary)]">Image Color Extractor</p>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
          Pull a palette from a photo
        </h1>
      </div>

      <Card strong>
        <CardContent className="p-5">
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
            className={cn(
              'flex min-h-64 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed transition-colors',
              isDragging ? 'border-accent-400 bg-accent-400/10' : 'border-[var(--border-subtle)] hover:border-[var(--border-strong)]',
            )}
          >
            {imageSrc ? (
              <img src={imageSrc} alt="Uploaded preview" className="max-h-56 max-w-full rounded-xl object-contain" />
            ) : (
              <>
                <UploadCloud className="size-9 text-[var(--text-tertiary)]" />
                <p className="text-sm font-medium text-[var(--text-secondary)]">Drop an image here, or click to browse</p>
                <p className="text-xs text-[var(--text-tertiary)]">JPG, PNG, WebP, GIF</p>
              </>
            )}
          </div>
          {imageSrc && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-3"
              leftIcon={<RefreshCw className="size-4" />}
              onClick={() => fileInputRef.current?.click()}
            >
              Replace image
            </Button>
          )}
        </CardContent>
      </Card>

      {extracted && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Highlights</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-6">
              <ColorSwatch hex={extracted.dominant} label="Dominant" size="lg" copyOnClick />
              <ColorSwatch hex={extracted.average} label="Average" size="lg" copyOnClick />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Extracted palette</CardTitle>
              <Button size="sm" leftIcon={<Sparkles className="size-4" />} loading={saving} onClick={saveAsPalette}>
                Save as palette
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <Slider label="Number of colors" value={count} min={3} max={10} onChange={handleCountChange} />
              <div className="flex overflow-hidden rounded-xl border border-[var(--border-subtle)]">
                {extracted.palette.map((c, i) => (
                  <button key={i} type="button" style={{ backgroundColor: c }} onClick={() => copyColor(c)} aria-label={`Copy ${c}`} className="h-20 flex-1" />
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </motion.div>
  );
}
