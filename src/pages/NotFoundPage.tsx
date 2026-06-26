import { Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { PlaceholderPage } from './PlaceholderPage';

export default function NotFoundPage() {
  return (
    <PlaceholderPage
      icon={Compass}
      title="Page not found"
      description="The page you're looking for doesn't exist or has moved."
    >
      <Link to="/">
        <Button>Back to Dashboard</Button>
      </Link>
    </PlaceholderPage>
  );
}
