import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MOBILE_NAV_ITEMS } from '@/config/navigation';
import { cn } from '@/utils/cn';

export function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
      aria-label="Primary"
    >
      {MOBILE_NAV_ITEMS.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.end}
          className="relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 text-[11px] font-medium"
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.span
                  layoutId="bottomnav-active-dot"
                  className="absolute top-1 h-1 w-6 rounded-full bg-[var(--color-primary-400)]"
                  transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                />
              )}
              <item.icon
                className={cn('size-5', isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]')}
              />
              <span className={isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'}>
                {item.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
