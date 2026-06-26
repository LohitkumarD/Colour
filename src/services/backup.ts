import { exportAllData, importAllData, resetAllData } from './db';
import { useSettingsStore } from '@/store/settingsStore';
import { downloadJson } from '@/utils/download';
import { DEFAULT_SETTINGS } from '@/types/settings';

const BACKUP_VERSION = 1;

export async function createBackup() {
  const data = await exportAllData();
  const settings = useSettingsStore.getState();
  const backup = {
    app: 'Color Theory Studio',
    backupVersion: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    settings: {
      theme: settings.theme,
      accentColor: settings.accentColor,
      language: settings.language,
      animationsEnabled: settings.animationsEnabled,
      reducedMotion: settings.reducedMotion,
      highContrast: settings.highContrast,
      largeText: settings.largeText,
      defaultColorFormat: settings.defaultColorFormat,
      defaultExportFormat: settings.defaultExportFormat,
    },
    data,
  };
  downloadJson(backup, `color-theory-studio-backup-${Date.now()}.json`);
  return backup;
}

export async function restoreBackup(file: File) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  if (!parsed?.data) {
    throw new Error('Invalid backup file');
  }
  await importAllData(parsed.data);
  if (parsed.settings) {
    useSettingsStore.getState().hydrateFromBackup(parsed.settings);
  }
}

export async function resetApp() {
  await resetAllData();
  useSettingsStore.setState({ ...DEFAULT_SETTINGS });
}
