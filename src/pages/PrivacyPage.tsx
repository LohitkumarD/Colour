import { ShieldCheck } from 'lucide-react';
import { PlaceholderPage } from './PlaceholderPage';

export default function PrivacyPage() {
  return (
    <PlaceholderPage
      icon={ShieldCheck}
      title="Privacy Policy"
      description="All data stays on-device — nothing you create here is uploaded anywhere."
    />
  );
}
