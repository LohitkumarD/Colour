import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUiStore } from '@/store/uiStore';

export function Fab() {
  const setCommandPaletteOpen = useUiStore((s) => s.setCommandPaletteOpen);

  return (
    <motion.button
      type="button"
      onClick={() => setCommandPaletteOpen(true)}
      aria-label="Open search and quick actions"
      whileTap={{ scale: 0.92 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 420, damping: 30 }}
      className="gradient-brand fixed right-4 bottom-20 z-40 flex size-14 items-center justify-center rounded-full text-white shadow-[var(--shadow-glow-primary)] md:bottom-8"
    >
      <Search className="size-6" />
    </motion.button>
  );
}
