import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { NAV_ITEMS } from '@/config/navigation';
import { useUiStore } from '@/store/uiStore';
import { cn } from '@/utils/cn';

export function Sidebar() {
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);

  return (
    <motion.aside
      animate={{ width: collapsed ? 76 : 248 }}
      transition={{ type: 'spring', stiffness: 340, damping: 34 }}
      className="hidden shrink-0 flex-col border-r border-[var(--border-subtle)] bg-[var(--bg-surface)]/60 py-4 backdrop-blur-xl md:flex"
    >
      <div className={cn('flex items-center gap-2.5 px-4 pb-4', collapsed && 'justify-center px-0')}>
        <div className="gradient-brand flex size-9 shrink-0 items-center justify-center rounded-xl shadow-[var(--shadow-glow-primary)]">
          <span className="text-base font-extrabold text-white">C</span>
        </div>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="truncate text-sm font-bold text-[var(--text-primary)]"
          >
            Color Theory Studio
          </motion.span>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-2.5">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            title={collapsed ? item.label : undefined}
            className={({ isActive }) =>
              cn(
                'group relative flex items-center gap-3 rounded-[var(--radius-control)] px-3 py-2.5 text-sm font-medium transition-colors duration-150',
                collapsed && 'justify-center px-0',
                isActive
                  ? 'text-[var(--text-primary)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--glass-bg)] hover:text-[var(--text-primary)]',
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="sidebar-active-pill"
                    className="absolute inset-0 -z-10 rounded-[var(--radius-control)] bg-[var(--glass-bg-strong)]"
                    transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                  />
                )}
                <item.icon className="relative z-10 size-[1.15rem] shrink-0" />
                {!collapsed && <span className="relative z-10 truncate">{item.label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={toggleSidebar}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className={cn(
          'mx-2.5 mt-2 flex items-center gap-3 rounded-[var(--radius-control)] px-3 py-2.5 text-sm font-medium text-[var(--text-tertiary)] transition-colors hover:bg-[var(--glass-bg)] hover:text-[var(--text-primary)]',
          collapsed && 'justify-center px-0',
        )}
      >
        {collapsed ? <PanelLeftOpen className="size-[1.15rem]" /> : <PanelLeftClose className="size-[1.15rem]" />}
        {!collapsed && <span>Collapse</span>}
      </button>
    </motion.aside>
  );
}
