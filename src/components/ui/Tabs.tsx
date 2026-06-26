import { createContext, useContext, useId } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface TabsContext {
  value: string;
  setValue: (value: string) => void;
  name: string;
}

const TabsContext = createContext<TabsContext | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tabs.* components must be used within <Tabs>');
  return ctx;
}

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
  className?: string;
}

export function Tabs({ value, onValueChange, children, className }: TabsProps) {
  const name = useId();
  return (
    <TabsContext.Provider value={{ value, setValue: onValueChange, name }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex items-center gap-1 rounded-[var(--radius-control)] bg-[var(--glass-bg)] p-1',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children, className }: { value: string; children: ReactNode; className?: string }) {
  const { value: active, setValue, name } = useTabsContext();
  const selected = active === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={() => setValue(value)}
      className={cn(
        'relative z-0 rounded-[calc(var(--radius-control)-0.25rem)] px-3.5 py-1.5 text-sm font-semibold transition-colors duration-200',
        selected ? 'text-[var(--text-inverse)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
        className,
      )}
    >
      {selected && (
        <motion.span
          layoutId={`tabs-pill-${name}`}
          className="absolute inset-0 -z-10 rounded-[calc(var(--radius-control)-0.25rem)] bg-[var(--text-primary)]"
          transition={{ type: 'spring', stiffness: 420, damping: 36 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
}

export function TabsContent({ value, children, className }: { value: string; children: ReactNode; className?: string }) {
  const { value: active } = useTabsContext();
  if (active !== value) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      role="tabpanel"
      className={className}
    >
      {children}
    </motion.div>
  );
}
