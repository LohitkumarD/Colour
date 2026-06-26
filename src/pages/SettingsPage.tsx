import { Settings } from 'lucide-react';
import { PlaceholderPage } from './PlaceholderPage';

export default function SettingsPage() {
  return (
    <PlaceholderPage
      icon={Settings}
      title="Settings"
      description="Theme, accessibility, data backup and restore options."
    />
  );
}
