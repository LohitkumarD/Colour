export type LessonLevel = 'beginner' | 'intermediate' | 'advanced';

export interface LessonSection {
  heading: string;
  body: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  summary: string;
  level: LessonLevel;
  durationMin: number;
  icon: string;
  sections: LessonSection[];
  quiz: QuizQuestion[];
}

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  bookmarked: boolean;
  quizScore: number | null;
  completedAt: number | null;
}
