import { Eye } from 'lucide-react';
import { PlaceholderPage } from './PlaceholderPage';

export default function BlindnessPage() {
  return (
    <PlaceholderPage
      icon={Eye}
      title="Color Blindness Simulator"
      description="Preview palettes through protanopia, deuteranopia, tritanopia and achromatopsia."
    />
  );
}
