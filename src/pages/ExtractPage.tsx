import { Image } from 'lucide-react';
import { PlaceholderPage } from './PlaceholderPage';

export default function ExtractPage() {
  return (
    <PlaceholderPage
      icon={Image}
      title="Image Color Extractor"
      description="Upload an image to extract its dominant color palette."
    />
  );
}
