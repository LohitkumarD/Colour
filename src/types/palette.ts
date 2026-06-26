export type PaletteSource = 'manual' | 'harmony' | 'image' | 'ai' | 'mixer' | 'gradient' | 'tones' | 'wheel';

export interface Palette {
  id: string;
  name: string;
  colors: string[];
  folderId: string | null;
  tags: string[];
  favorite: boolean;
  source: PaletteSource;
  note?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Folder {
  id: string;
  name: string;
  createdAt: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  paletteIds: string[];
  coverColor: string;
  createdAt: number;
  updatedAt: number;
}

export type HistoryEntryType = 'color' | 'palette' | 'tool';

export interface HistoryEntry {
  id: string;
  type: HistoryEntryType;
  label: string;
  value: string;
  meta?: string;
  timestamp: number;
}
