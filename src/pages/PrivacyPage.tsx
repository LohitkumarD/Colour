import { motion } from 'framer-motion';
import { Database, Lock, ShieldCheck, Trash2, WifiOff } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

const POINTS: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: WifiOff,
    title: 'No server, no account',
    description:
      'Color Theory Studio has no backend. There is nothing to sign up for and nothing that could be breached, because nothing you create is ever sent over the network.',
  },
  {
    icon: Database,
    title: 'Storage stays on your device',
    description:
      'Palettes, folders, projects, color history and lesson progress live in your browser\'s IndexedDB. Preferences like theme and accent color live in localStorage. None of it leaves the device.',
  },
  {
    icon: Lock,
    title: 'The AI Assistant is local-only',
    description:
      'Suggestions and explanations come from a heuristic engine that runs entirely in your browser. It makes no API calls and sends no color data anywhere.',
  },
  {
    icon: ShieldCheck,
    title: 'No analytics, no tracking',
    description:
      'There are no analytics scripts, ad trackers or third-party embeds collecting usage data. We do not know who uses this app or how.',
  },
  {
    icon: Trash2,
    title: 'You own and control your data',
    description:
      'Export everything as a JSON backup or wipe it completely from Settings → Data & backup, at any time, with no confirmation email or account needed.',
  },
];

export default function PrivacyPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6 pb-6"
    >
      <div>
        <p className="text-sm font-medium text-[var(--text-tertiary)]">Legal</p>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">Privacy Policy</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)]">
          The short version: this app doesn't collect anything because it has nowhere to send it. Here's the
          longer version.
        </p>
      </div>

      <div className="space-y-4">
        {POINTS.map((p) => (
          <Card key={p.title}>
            <CardContent className="flex items-start gap-3 p-4">
              <p.icon className="mt-0.5 size-5 shrink-0 text-primary-400" />
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">{p.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-[var(--text-tertiary)]">{p.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card strong>
        <CardContent className="space-y-2 p-5 text-sm leading-relaxed text-[var(--text-secondary)]">
          <p>
            Because everything is stored locally, clearing your browser data, uninstalling the app, or switching
            devices will remove your palettes and progress. Export a backup first if you want to keep it.
          </p>
          <p>
            If a future version of this app ever introduces optional sync or telemetry, it will be opt-in and
            disclosed here before it ships — not added silently.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
