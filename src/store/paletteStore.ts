import { create } from 'zustand';
import type { Folder, HistoryEntry, HistoryEntryType, Palette, PaletteSource, Project } from '@/types/palette';
import { generateId } from '@/utils/color/random';
import {
  folderRepo,
  historyRepo,
  paletteRepo,
  projectRepo,
} from '@/services/db';

interface PaletteState {
  palettes: Palette[];
  folders: Folder[];
  projects: Project[];
  history: HistoryEntry[];
  hydrated: boolean;

  hydrate: () => Promise<void>;

  createPalette: (input: {
    name: string;
    colors: string[];
    source: PaletteSource;
    folderId?: string | null;
    tags?: string[];
  }) => Promise<Palette>;
  updatePalette: (id: string, patch: Partial<Omit<Palette, 'id'>>) => Promise<void>;
  deletePalette: (id: string) => Promise<void>;
  duplicatePalette: (id: string) => Promise<Palette | null>;
  toggleFavorite: (id: string) => Promise<void>;

  createFolder: (name: string) => Promise<Folder>;
  renameFolder: (id: string, name: string) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;

  createProject: (input: { name: string; description?: string; coverColor?: string }) => Promise<Project>;
  updateProject: (id: string, patch: Partial<Omit<Project, 'id'>>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addPaletteToProject: (projectId: string, paletteId: string) => Promise<void>;
  removePaletteFromProject: (projectId: string, paletteId: string) => Promise<void>;

  addHistory: (type: HistoryEntryType, label: string, value: string, meta?: string) => Promise<void>;
  clearHistory: () => Promise<void>;
}

export const usePaletteStore = create<PaletteState>()((set, get) => ({
  palettes: [],
  folders: [],
  projects: [],
  history: [],
  hydrated: false,

  hydrate: async () => {
    const [palettes, folders, projects, history] = await Promise.all([
      paletteRepo.getAll(),
      folderRepo.getAll(),
      projectRepo.getAll(),
      historyRepo.getAll(),
    ]);
    set({
      palettes: palettes.sort((a, b) => b.updatedAt - a.updatedAt),
      folders,
      projects: projects.sort((a, b) => b.updatedAt - a.updatedAt),
      history,
      hydrated: true,
    });
  },

  createPalette: async ({ name, colors, source, folderId = null, tags = [] }) => {
    const now = Date.now();
    const palette: Palette = {
      id: generateId(),
      name,
      colors,
      folderId,
      tags,
      favorite: false,
      source,
      createdAt: now,
      updatedAt: now,
    };
    await paletteRepo.put(palette);
    set((state) => ({ palettes: [palette, ...state.palettes] }));
    return palette;
  },

  updatePalette: async (id, patch) => {
    const existing = get().palettes.find((p) => p.id === id);
    if (!existing) return;
    const updated: Palette = { ...existing, ...patch, updatedAt: Date.now() };
    await paletteRepo.put(updated);
    set((state) => ({ palettes: state.palettes.map((p) => (p.id === id ? updated : p)) }));
  },

  deletePalette: async (id) => {
    await paletteRepo.remove(id);
    set((state) => ({
      palettes: state.palettes.filter((p) => p.id !== id),
      projects: state.projects.map((proj) => ({
        ...proj,
        paletteIds: proj.paletteIds.filter((pid) => pid !== id),
      })),
    }));
  },

  duplicatePalette: async (id) => {
    const existing = get().palettes.find((p) => p.id === id);
    if (!existing) return null;
    const now = Date.now();
    const copy: Palette = {
      ...existing,
      id: generateId(),
      name: `${existing.name} Copy`,
      favorite: false,
      createdAt: now,
      updatedAt: now,
    };
    await paletteRepo.put(copy);
    set((state) => ({ palettes: [copy, ...state.palettes] }));
    return copy;
  },

  toggleFavorite: async (id) => {
    const existing = get().palettes.find((p) => p.id === id);
    if (!existing) return;
    await get().updatePalette(id, { favorite: !existing.favorite });
  },

  createFolder: async (name) => {
    const folder: Folder = { id: generateId(), name, createdAt: Date.now() };
    await folderRepo.put(folder);
    set((state) => ({ folders: [...state.folders, folder] }));
    return folder;
  },

  renameFolder: async (id, name) => {
    const existing = get().folders.find((f) => f.id === id);
    if (!existing) return;
    const updated = { ...existing, name };
    await folderRepo.put(updated);
    set((state) => ({ folders: state.folders.map((f) => (f.id === id ? updated : f)) }));
  },

  deleteFolder: async (id) => {
    await folderRepo.remove(id);
    const affected = get().palettes.filter((p) => p.folderId === id);
    await Promise.all(
      affected.map((p) => paletteRepo.put({ ...p, folderId: null, updatedAt: Date.now() })),
    );
    set((state) => ({
      folders: state.folders.filter((f) => f.id !== id),
      palettes: state.palettes.map((p) => (p.folderId === id ? { ...p, folderId: null } : p)),
    }));
  },

  createProject: async ({ name, description = '', coverColor = '#863BFF' }) => {
    const now = Date.now();
    const project: Project = {
      id: generateId(),
      name,
      description,
      paletteIds: [],
      coverColor,
      createdAt: now,
      updatedAt: now,
    };
    await projectRepo.put(project);
    set((state) => ({ projects: [project, ...state.projects] }));
    return project;
  },

  updateProject: async (id, patch) => {
    const existing = get().projects.find((p) => p.id === id);
    if (!existing) return;
    const updated: Project = { ...existing, ...patch, updatedAt: Date.now() };
    await projectRepo.put(updated);
    set((state) => ({ projects: state.projects.map((p) => (p.id === id ? updated : p)) }));
  },

  deleteProject: async (id) => {
    await projectRepo.remove(id);
    set((state) => ({ projects: state.projects.filter((p) => p.id !== id) }));
  },

  addPaletteToProject: async (projectId, paletteId) => {
    const existing = get().projects.find((p) => p.id === projectId);
    if (!existing || existing.paletteIds.includes(paletteId)) return;
    await get().updateProject(projectId, { paletteIds: [...existing.paletteIds, paletteId] });
  },

  removePaletteFromProject: async (projectId, paletteId) => {
    const existing = get().projects.find((p) => p.id === projectId);
    if (!existing) return;
    await get().updateProject(projectId, {
      paletteIds: existing.paletteIds.filter((id) => id !== paletteId),
    });
  },

  addHistory: async (type, label, value, meta) => {
    const entry: HistoryEntry = { id: generateId(), type, label, value, meta, timestamp: Date.now() };
    await historyRepo.put(entry);
    await historyRepo.trim(200);
    set((state) => ({ history: [entry, ...state.history].slice(0, 200) }));
  },

  clearHistory: async () => {
    await historyRepo.clear();
    set({ history: [] });
  },
}));
