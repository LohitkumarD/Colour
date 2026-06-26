import { LayoutDashboard } from 'lucide-react';
import { PlaceholderPage } from './PlaceholderPage';

export default function DashboardPage() {
  return (
    <PlaceholderPage
      icon={LayoutDashboard}
      title="Dashboard"
      description="Your color activity, quick tools, and recent palettes will live here."
    />
  );
}
