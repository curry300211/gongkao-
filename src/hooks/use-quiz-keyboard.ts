"use client";

import { useEffect } from "react";
import { useQuizStore } from "@/stores/quiz-store";

export function useQuizKeyboard(disabled?: boolean) {
  const status = useQuizStore((s) => s.status);
  const selectAnswer = useQuizStore((s) => s.selectAnswer);
  const nextQuestion = useQuizStore((s) => s.nextQuestion);
  const prevQuestion = useQuizStore((s) => s.prevQuestion);
  const togglePause = useQuizStore((s) => s.togglePause);

  useEffect(() => {
    if (disabled || status !== "active") return;

    const handleKey = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();

      if (["A", "B", "C", "D"].includes(key)) {
        e.preventDefault();
        selectAnswer(key);
      }
      if (key === " " || key === "ENTER") {
        e.preventDefault();
        nextQuestion();
      }
      if (key === "ARROWLEFT") {
        e.preventDefault();
        prevQuestion();
      }
      if (key === "ARROWRIGHT") {
        e.preventDefault();
        nextQuestion();
      }
      if (key === "ESCAPE") {
        e.preventDefault();
        togglePause();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [disabled, status, selectAnswer, nextQuestion, prevQuestion, togglePause]);
}
