import { type DBSchema, openDB, type IDBPDatabase } from 'idb';
import type { Folder, HistoryEntry, Palette, Project } from '@/types/palette';
import type { LessonProgress } from '@/types/lesson';

interface ColourDB extends DBSchema {
  palettes: {
    key: string;
    value: Palette;
    indexes: { updatedAt: number };
  };
  folders: {
    key: string;
    value: Folder;
  };
  projects: {
    key: string;
    value: Project;
    indexes: { updatedAt: number };
  };
  history: {
    key: string;
    value: HistoryEntry;
    indexes: { timestamp: number };
  };
  lessonProgress: {
    key: string;
    value: LessonProgress;
  };
}

const DB_NAME = 'colour-theory-studio';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<ColourDB>> | null = null;

export function getDb(): Promise<IDBPDatabase<ColourDB>> {
  if (!dbPromise) {
    dbPromise = openDB<ColourDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('palettes')) {
          const store = db.createObjectStore('palettes', { keyPath: 'id' });
          store.createIndex('updatedAt', 'updatedAt');
        }
        if (!db.objectStoreNames.contains('folders')) {
          db.createObjectStore('folders', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('projects')) {
          const store = db.createObjectStore('projects', { keyPath: 'id' });
          store.createIndex('updatedAt', 'updatedAt');
        }
        if (!db.objectStoreNames.contains('history')) {
          const store = db.createObjectStore('history', { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp');
        }
        if (!db.objectStoreNames.contains('lessonProgress')) {
          db.createObjectStore('lessonProgress', { keyPath: 'lessonId' });
        }
      },
    });
  }
  return dbPromise;
}

export const paletteRepo = {
  async getAll(): Promise<Palette[]> {
    return (await getDb()).getAll('palettes');
  },
  async put(palette: Palette): Promise<void> {
    await (await getDb()).put('palettes', palette);
  },
  async remove(id: string): Promise<void> {
    await (await getDb()).delete('palettes', id);
  },
};

export const folderRepo = {
  async getAll(): Promise<Folder[]> {
    return (await getDb()).getAll('folders');
  },
  async put(folder: Folder): Promise<void> {
    await (await getDb()).put('folders', folder);
  },
  async remove(id: string): Promise<void> {
    await (await getDb()).delete('folders', id);
  },
};

export const projectRepo = {
  async getAll(): Promise<Project[]> {
    return (await getDb()).getAll('projects');
  },
  async put(project: Project): Promise<void> {
    await (await getDb()).put('projects', project);
  },
  async remove(id: string): Promise<void> {
    await (await getDb()).delete('projects', id);
  },
};

export const historyRepo = {
  async getAll(): Promise<HistoryEntry[]> {
    const all = await (await getDb()).getAllFromIndex('history', 'timestamp');
    return all.reverse();
  },
  async put(entry: HistoryEntry): Promise<void> {
    await (await getDb()).put('history', entry);
  },
  async clear(): Promise<void> {
    await (await getDb()).clear('history');
  },
  async trim(maxEntries = 200): Promise<void> {
    const db = await getDb();
    const all = await db.getAllFromIndex('history', 'timestamp');
    if (all.length <= maxEntries) return;
    const toRemove = all.slice(0, all.length - maxEntries);
    const tx = db.transaction('history', 'readwrite');
    await Promise.all(toRemove.map((e) => tx.store.delete(e.id)));
    await tx.done;
  },
};

export const lessonProgressRepo = {
  async getAll(): Promise<LessonProgress[]> {
    return (await getDb()).getAll('lessonProgress');
  },
  async put(progress: LessonProgress): Promise<void> {
    await (await getDb()).put('lessonProgress', progress);
  },
};

export async function exportAllData() {
  const [palettes, folders, projects, history, lessonProgress] = await Promise.all([
    paletteRepo.getAll(),
    folderRepo.getAll(),
    projectRepo.getAll(),
    historyRepo.getAll(),
    lessonProgressRepo.getAll(),
  ]);
  return { palettes, folders, projects, history, lessonProgress, exportedAt: Date.now(), version: DB_VERSION };
}

export async function importAllData(data: {
  palettes?: Palette[];
  folders?: Folder[];
  projects?: Project[];
  history?: HistoryEntry[];
  lessonProgress?: LessonProgress[];
}) {
  const db = await getDb();
  const tx = db.transaction(['palettes', 'folders', 'projects', 'history', 'lessonProgress'], 'readwrite');
  for (const p of data.palettes ?? []) await tx.objectStore('palettes').put(p);
  for (const f of data.folders ?? []) await tx.objectStore('folders').put(f);
  for (const p of data.projects ?? []) await tx.objectStore('projects').put(p);
  for (const h of data.history ?? []) await tx.objectStore('history').put(h);
  for (const l of data.lessonProgress ?? []) await tx.objectStore('lessonProgress').put(l);
  await tx.done;
}

export async function resetAllData() {
  const db = await getDb();
  await Promise.all([
    db.clear('palettes'),
    db.clear('folders'),
    db.clear('projects'),
    db.clear('history'),
    db.clear('lessonProgress'),
  ]);
}
