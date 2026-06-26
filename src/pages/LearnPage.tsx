import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Blend,
  Bookmark,
  CheckCircle2,
  Contrast,
  Disc3,
  Eye,
  GraduationCap,
  Layers,
  Palette as PaletteIcon,
  Sparkles,
  Waves,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { useLearningStore } from '@/store/learningStore';
import { useUiStore } from '@/store/uiStore';
import { LESSONS } from '@/data/lessons';
import { cn } from '@/utils/cn';
import type { Lesson, LessonLevel } from '@/types/lesson';

const LESSON_ICONS: Record<string, LucideIcon> = {
  Disc3,
  Palette: PaletteIcon,
  Sparkles,
  Blend,
  Contrast,
  Eye,
  Layers,
  Waves,
};

const LEVEL_LABELS: Record<LessonLevel, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

const LEVEL_BADGE_VARIANT: Record<LessonLevel, 'success' | 'warning' | 'error'> = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'error',
};

const LEVEL_OPTIONS: { value: 'all' | LessonLevel; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

interface QuizProps {
  lesson: Lesson;
}

function Quiz({ lesson }: QuizProps) {
  const recordQuizResult = useLearningStore((s) => s.recordQuizResult);
  const addToast = useUiStore((s) => s.addToast);

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const allAnswered = lesson.quiz.every((q) => answers[q.id] !== undefined);
  const correctCount = lesson.quiz.filter((q) => answers[q.id] === q.correctIndex).length;
  const score = Math.round((correctCount / lesson.quiz.length) * 100);
  const passed = score >= 60;

  const selectAnswer = (qid: string, idx: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qid]: idx }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await recordQuizResult(lesson.id, score, passed);
      setSubmitted(true);
      addToast({
        message: passed ? 'Quiz passed!' : 'Quiz submitted',
        description: `${correctCount}/${lesson.quiz.length} correct`,
        variant: passed ? 'success' : 'info',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="space-y-4 border-t border-[var(--border-subtle)] pt-5">
      <h3 className="text-base font-semibold text-[var(--text-primary)]">Knowledge check</h3>
      {lesson.quiz.map((q, qi) => (
        <div key={q.id} className="space-y-2 rounded-[var(--radius-control)] border border-[var(--border-subtle)] bg-[var(--glass-bg)] p-4">
          <p className="text-sm font-medium text-[var(--text-primary)]">
            {qi + 1}. {q.question}
          </p>
          <div className="space-y-1.5">
            {q.options.map((opt, oi) => {
              const selected = answers[q.id] === oi;
              const isCorrect = oi === q.correctIndex;
              return (
                <button
                  key={oi}
                  type="button"
                  onClick={() => selectAnswer(q.id, oi)}
                  disabled={submitted}
                  className={cn(
                    'flex w-full items-center justify-between rounded-[var(--radius-control)] border px-3 py-2 text-left text-sm transition-colors disabled:cursor-default',
                    submitted && isCorrect && 'border-success-500/60 bg-success-500/10 text-success-300',
                    submitted && selected && !isCorrect && 'border-error-500/60 bg-error-500/10 text-error-300',
                    !submitted && selected && 'border-accent-400/60 bg-[var(--glass-bg-strong)] text-[var(--text-primary)]',
                    !submitted && !selected && 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--glass-bg-strong)]',
                    submitted && !selected && !isCorrect && 'border-[var(--border-subtle)] text-[var(--text-tertiary)]',
                  )}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {submitted && <p className="text-xs leading-relaxed text-[var(--text-tertiary)]">{q.explanation}</p>}
        </div>
      ))}

      <div className="flex items-center justify-between">
        {submitted ? (
          <>
            <Badge variant={passed ? 'success' : 'warning'}>
              {correctCount}/{lesson.quiz.length} correct · {score}%
            </Badge>
            <Button variant="ghost" onClick={handleRetake}>
              Retake quiz
            </Button>
          </>
        ) : (
          <Button onClick={handleSubmit} disabled={!allAnswered} loading={saving} className="ml-auto">
            Submit answers
          </Button>
        )}
      </div>
    </div>
  );
}

export default function LearnPage() {
  const progress = useLearningStore((s) => s.progress);
  const getProgress = useLearningStore((s) => s.getProgress);
  const toggleBookmark = useLearningStore((s) => s.toggleBookmark);

  const [searchParams] = useSearchParams();
  const [levelFilter, setLevelFilter] = useState<'all' | LessonLevel>('all');
  const [selectedId, setSelectedId] = useState(() => {
    const requested = searchParams.get('lesson');
    return requested && LESSONS.some((l) => l.id === requested) ? requested : LESSONS[0].id;
  });

  const filtered = useMemo(
    () => (levelFilter === 'all' ? LESSONS : LESSONS.filter((l) => l.level === levelFilter)),
    [levelFilter],
  );

  const selectedLesson = LESSONS.find((l) => l.id === selectedId) ?? LESSONS[0];
  const completedCount = LESSONS.filter((l) => progress[l.id]?.completed).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6 pb-6"
    >
      <div>
        <p className="text-sm font-medium text-[var(--text-tertiary)]">Learning Hub</p>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
          Master color theory, lesson by lesson
        </h1>
      </div>

      <Card strong>
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div>
            <p className="text-sm text-[var(--text-tertiary)]">Your progress</p>
            <p className="text-lg font-semibold text-[var(--text-primary)]">
              {completedCount} / {LESSONS.length} lessons completed
            </p>
          </div>
          <div className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-[var(--glass-bg)] sm:w-48">
            <div
              className="h-full gradient-brand transition-all duration-300"
              style={{ width: `${(completedCount / LESSONS.length) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <SegmentedControl options={LEVEL_OPTIONS} value={levelFilter} onChange={setLevelFilter} aria-label="Filter by level" />

      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <div className="space-y-2.5">
          {filtered.map((lesson) => {
            const p = getProgress(lesson.id);
            const Icon = LESSON_ICONS[lesson.icon] ?? GraduationCap;
            const active = lesson.id === selectedId;
            return (
              <button
                key={lesson.id}
                type="button"
                onClick={() => setSelectedId(lesson.id)}
                className={cn(
                  'flex w-full items-start gap-3 rounded-[var(--radius-card)] border p-3.5 text-left transition-colors',
                  active
                    ? 'border-accent-400/60 bg-[var(--glass-bg-strong)]'
                    : 'border-[var(--border-subtle)] bg-[var(--glass-bg)] hover:bg-[var(--glass-bg-strong)]',
                )}
              >
                <Icon className="mt-0.5 size-5 shrink-0 text-accent-400" />
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{lesson.title}</p>
                    {p.completed && <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success-400" />}
                  </div>
                  <p className="text-xs text-[var(--text-tertiary)]">{lesson.summary}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant={LEVEL_BADGE_VARIANT[lesson.level]}>{LEVEL_LABELS[lesson.level]}</Badge>
                    <span className="text-xs text-[var(--text-tertiary)]">{lesson.durationMin} min</span>
                  </div>
                </div>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(lesson.id);
                  }}
                  aria-label={p.bookmarked ? 'Remove bookmark' : 'Bookmark lesson'}
                  className="shrink-0 rounded-lg p-1 hover:bg-black/10"
                >
                  <Bookmark
                    className="size-4"
                    fill={p.bookmarked ? 'currentColor' : 'none'}
                    style={{ color: p.bookmarked ? 'var(--warning-400)' : 'var(--text-tertiary)' }}
                  />
                </span>
              </button>
            );
          })}
        </div>

        <Card strong>
          <CardContent className="space-y-6 p-6">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant={LEVEL_BADGE_VARIANT[selectedLesson.level]}>{LEVEL_LABELS[selectedLesson.level]}</Badge>
                <span className="text-xs text-[var(--text-tertiary)]">{selectedLesson.durationMin} min read</span>
              </div>
              <h2 className="mt-2 text-xl font-bold text-[var(--text-primary)]">{selectedLesson.title}</h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">{selectedLesson.summary}</p>
            </div>

            <div className="space-y-4">
              {selectedLesson.sections.map((s) => (
                <div key={s.heading}>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">{s.heading}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">{s.body}</p>
                </div>
              ))}
            </div>

            <Quiz key={selectedLesson.id} lesson={selectedLesson} />
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
