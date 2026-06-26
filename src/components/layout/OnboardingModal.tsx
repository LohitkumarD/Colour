import { Blend, Disc3, GraduationCap, Library } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useSettingsStore } from '@/store/settingsStore';

const STEPS: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Disc3,
    title: 'Explore color, precisely',
    description: 'Convert between HEX, RGB, HSL, LAB, OKLCH and more, or build harmonies from the color wheel.',
  },
  {
    icon: Blend,
    title: 'Mix, grade and extract',
    description: 'Generate gradients and tonal scales, mix pigments, or pull a palette straight from an image.',
  },
  {
    icon: Library,
    title: 'Save what you find',
    description: 'Organize palettes into folders and projects, then export to CSS, SCSS, Tailwind or Figma.',
  },
  {
    icon: GraduationCap,
    title: 'Learn as you go',
    description: 'Short lessons and quizzes build color theory intuition alongside the tools.',
  },
];

export function OnboardingModal() {
  const hasOnboarded = useSettingsStore((s) => s.hasOnboarded);
  const completeOnboarding = useSettingsStore((s) => s.completeOnboarding);

  return (
    <Modal
      open={!hasOnboarded}
      onClose={completeOnboarding}
      title="Welcome to Color Theory Studio"
      description="Everything here runs locally in your browser — no account, no server, no tracking."
    >
      <div className="space-y-3">
        {STEPS.map((step) => (
          <div key={step.title} className="flex items-start gap-3 rounded-[var(--radius-control)] bg-[var(--glass-bg)] p-3.5">
            <step.icon className="mt-0.5 size-5 shrink-0 text-primary-400" />
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">{step.title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-[var(--text-tertiary)]">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex justify-end">
        <Button onClick={completeOnboarding}>Get started</Button>
      </div>
    </Modal>
  );
}
