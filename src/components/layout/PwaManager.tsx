import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X } from 'lucide-react';
import { useUiStore } from '@/store/uiStore';

export function PwaManager() {
  const setSwUpdateAvailable = useUiStore((s) => s.setSwUpdateAvailable);
  const setInstallPrompt = useUiStore((s) => s.setInstallPrompt);
  const addToast = useUiStore((s) => s.addToast);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onOfflineReady: () => addToast({ message: 'Ready to work offline', variant: 'success' }),
    onRegisterError: (error) => console.error('Service worker registration failed', error),
  });

  useEffect(() => {
    setSwUpdateAvailable(needRefresh);
  }, [needRefresh, setSwUpdateAvailable]);

  useEffect(() => {
    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    const onAppInstalled = () => setInstallPrompt(null);
    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onAppInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, [setInstallPrompt]);

  if (!needRefresh) return null;

  return (
    <div className="fixed inset-x-4 bottom-20 z-[210] mx-auto flex max-w-sm items-center gap-3 rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--glass-bg-strong)] p-3.5 shadow-[var(--shadow-elevated)] backdrop-blur-xl sm:inset-x-auto sm:right-4 sm:bottom-4">
      <RefreshCw className="size-5 shrink-0 text-primary-400" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[var(--text-primary)]">Update available</p>
        <p className="text-xs text-[var(--text-tertiary)]">Reload to get the latest version</p>
      </div>
      <button
        type="button"
        onClick={() => updateServiceWorker(true)}
        className="shrink-0 rounded-full bg-primary-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-600"
      >
        Reload
      </button>
      <button
        type="button"
        onClick={() => setNeedRefresh(false)}
        aria-label="Dismiss update notification"
        className="shrink-0 rounded-full p-1 text-[var(--text-tertiary)] transition-colors hover:bg-[var(--glass-bg)] hover:text-[var(--text-primary)]"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
