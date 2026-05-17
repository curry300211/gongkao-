"use client";

import { cn } from "@/lib/utils";

interface Option {
  label: string;
  text: string;
}

interface QuestionCardProps {
  stem: string;
  options: Option[];
  selectedAnswer: string | null;
  correctAnswer: string;
  showResult: boolean;
  onSelect: (label: string) => void;
  disabled?: boolean;
}

export function QuestionCard({
  stem,
  options,
  selectedAnswer,
  correctAnswer,
  showResult,
  onSelect,
  disabled,
}: QuestionCardProps) {
  const optionLabels = ["A", "B", "C", "D"];

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-base leading-relaxed">{stem}</p>
      </div>

      <div className="space-y-2">
        {options.map((opt, i) => {
          const label = optionLabels[i] || opt.label;
          const isSelected = selectedAnswer === label;
          const isCorrect = label === correctAnswer;

          let borderClass = "border-border";
          let bgClass = "";

          if (showResult && isCorrect) {
            borderClass = "border-green-500 bg-green-50 dark:bg-green-950/20";
          } else if (showResult && isSelected && !isCorrect) {
            borderClass = "border-red-500 bg-red-50 dark:bg-red-950/20";
          } else if (isSelected) {
            borderClass = "border-primary bg-primary/5";
          }

          return (
            <button
              key={label}
              onClick={() => onSelect(label)}
              disabled={disabled}
              className={cn(
                "flex w-full items-start gap-3 rounded-lg border p-4 text-left transition-colors",
                borderClass,
                bgClass,
                !disabled && "cursor-pointer hover:border-primary/50 hover:bg-accent"
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                  isSelected && !showResult
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {label}
              </span>
              <span className="text-sm leading-relaxed pt-0.5">{opt.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
