"use client";

import { useEffect, useRef } from "react";
import { useQuizStore } from "@/stores/quiz-store";
import { Timer } from "lucide-react";

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function QuizTimer() {
  const status = useQuizStore((s) => s.status);
  const elapsedSec = useQuizStore((s) => s.elapsedSec);
  const timeLimitSec = useQuizStore((s) => s.timeLimitSec);
  const tick = useQuizStore((s) => s.tick);
  const complete = useQuizStore((s) => s.complete);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (status === "active") {
      intervalRef.current = setInterval(() => {
        tick(1);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [status, tick]);

  useEffect(() => {
    if (timeLimitSec && elapsedSec >= timeLimitSec && status === "active") {
      complete();
    }
  }, [elapsedSec, timeLimitSec, status, complete]);

  const displaySec = timeLimitSec
    ? Math.max(0, timeLimitSec - elapsedSec)
    : elapsedSec;

  const isUrgent = timeLimitSec
    ? timeLimitSec - elapsedSec < 300
    : false;

  return (
    <div
      className={`flex items-center gap-1.5 text-sm font-mono tabular-nums ${
        isUrgent ? "text-destructive" : "text-muted-foreground"
      }`}
    >
      <Timer size={14} />
      <span>{formatTime(displaySec)}</span>
    </div>
  );
}
