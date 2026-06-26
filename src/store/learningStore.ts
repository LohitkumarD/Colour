import { create } from 'zustand';
import type { LessonProgress } from '@/types/lesson';
import { lessonProgressRepo } from '@/services/db';

interface LearningState {
  progress: Record<string, LessonProgress>;
  hydrated: boolean;

  hydrate: () => Promise<void>;
  getProgress: (lessonId: string) => LessonProgress;
  toggleBookmark: (lessonId: string) => Promise<void>;
  recordQuizResult: (lessonId: string, score: number, passed: boolean) => Promise<void>;
}

const emptyProgress = (lessonId: string): LessonProgress => ({
  lessonId,
  completed: false,
  bookmarked: false,
  quizScore: null,
  completedAt: null,
});

export const useLearningStore = create<LearningState>()((set, get) => ({
  progress: {},
  hydrated: false,

  hydrate: async () => {
    const all = await lessonProgressRepo.getAll();
    const map: Record<string, LessonProgress> = {};
    for (const p of all) map[p.lessonId] = p;
    set({ progress: map, hydrated: true });
  },

  getProgress: (lessonId) => get().progress[lessonId] ?? emptyProgress(lessonId),

  toggleBookmark: async (lessonId) => {
    const current = get().getProgress(lessonId);
    const updated = { ...current, bookmarked: !current.bookmarked };
    await lessonProgressRepo.put(updated);
    set((state) => ({ progress: { ...state.progress, [lessonId]: updated } }));
  },

  recordQuizResult: async (lessonId, score, passed) => {
    const current = get().getProgress(lessonId);
    const updated: LessonProgress = {
      ...current,
      quizScore: score,
      completed: current.completed || passed,
      completedAt: passed ? Date.now() : current.completedAt,
    };
    await lessonProgressRepo.put(updated);
    set((state) => ({ progress: { ...state.progress, [lessonId]: updated } }));
  },
}));
