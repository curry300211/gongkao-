"use client";

import { useQuizStore } from "@/stores/quiz-store";

export function QuizProgress() {
  const questions = useQuizStore((s) => s.questions);
  const currentIndex = useQuizStore((s) => s.currentIndex);
  const goToQuestion = useQuizStore((s) => s.goToQuestion);

  const answered = questions.filter((q) => q.userAnswer !== null).length;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${(answered / Math.max(questions.length, 1)) * 100}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground tabular-nums">
        {answered}/{questions.length}
      </span>
    </div>
  );
}
