import { create } from 'zustand';
import { generateId } from '@/utils/color/random';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  description?: string;
  variant: ToastVariant;
  duration: number;
}

interface UiState {
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;

  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  activeBottomSheet: string | null;
  openBottomSheet: (id: string) => void;
  closeBottomSheet: () => void;

  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id' | 'duration'> & { duration?: number }) => string;
  removeToast: (id: string) => void;

  installPromptEvent: unknown | null;
  setInstallPrompt: (event: unknown | null) => void;

  swUpdateAvailable: boolean;
  setSwUpdateAvailable: (available: boolean) => void;
}

export const useUiStore = create<UiState>()((set, get) => ({
  commandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  activeBottomSheet: null,
  openBottomSheet: (id) => set({ activeBottomSheet: id }),
  closeBottomSheet: () => set({ activeBottomSheet: null }),

  toasts: [],
  addToast: (toast) => {
    const id = generateId();
    const duration = toast.duration ?? 3200;
    set((state) => ({ toasts: [...state.toasts, { ...toast, id, duration }] }));
    if (duration > 0) {
      setTimeout(() => get().removeToast(id), duration);
    }
    return id;
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  installPromptEvent: null,
  setInstallPrompt: (event) => set({ installPromptEvent: event }),

  swUpdateAvailable: false,
  setSwUpdateAvailable: (available) => set({ swUpdateAvailable: available }),
}));
