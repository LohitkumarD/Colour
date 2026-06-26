import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: 'Using the app',
    body: [
      'Color Theory Studio is provided free of charge for personal, educational and commercial use. You may use it to create, export and reuse any colors, palettes or assets it generates without attribution.',
    ],
  },
  {
    title: 'No warranty',
    body: [
      'The app is provided "as is", without warranty of any kind. Color conversions, contrast checks and harmony suggestions are computed using standard formulas, but you should independently verify results for safety-critical, accessibility-compliance, or print-production work.',
    ],
  },
  {
    title: 'Your data, your responsibility',
    body: [
      'All data is stored locally on your device. We have no way to view, back up or recover it for you. You are responsible for exporting backups before clearing browser storage, switching browsers, or uninstalling the app.',
    ],
  },
  {
    title: 'Limitation of liability',
    body: [
      'To the extent permitted by law, the authors are not liable for any damages or losses arising from use of this app, including loss of locally stored data.',
    ],
  },
  {
    title: 'Changes',
    body: [
      'These terms may be updated as the app evolves. Continued use after an update means you accept the revised terms.',
    ],
  },
];

export default function TermsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6 pb-6"
    >
      <div>
        <p className="text-sm font-medium text-[var(--text-tertiary)]">Legal</p>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">Terms of Use</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)]">
          Plain-language terms for a free, account-less tool. No legal team, no fine print games.
        </p>
      </div>

      <div className="space-y-4">
        {SECTIONS.map((s) => (
          <Card key={s.title}>
            <CardHeader>
              <CardTitle>{s.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {s.body.map((p, i) => (
                <p key={i} className="text-sm leading-relaxed text-[var(--text-secondary)]">
                  {p}
                </p>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
