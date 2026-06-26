import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { EmptyState } from '@/components/ui/EmptyState';

interface PlaceholderPageProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: ReactNode;
}

export function PlaceholderPage({ icon, title, description, children }: PlaceholderPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex min-h-[60vh] items-center justify-center"
    >
      <EmptyState icon={icon} title={title} description={description} action={children} />
    </motion.div>
  );
}
