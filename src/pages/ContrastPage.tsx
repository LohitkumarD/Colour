import { Contrast } from 'lucide-react';
import { PlaceholderPage } from './PlaceholderPage';

export default function ContrastPage() {
  return (
    <PlaceholderPage
      icon={Contrast}
      title="Contrast Checker"
      description="Check WCAG AA/AAA contrast ratios between foreground and background colors."
    />
  );
}
