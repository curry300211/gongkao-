"use client";

import Link from "next/link";
import { AlertTriangle, TrendingDown } from "lucide-react";

interface WeakPoint {
  category: string;
  accuracy: number;
  total: number;
  correct: number;
}

export function WeakPointList({ data }: { data: WeakPoint[] }) {
  const weak = data
    .filter((d) => d.total > 0)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 5);

  if (weak.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-center">
        <TrendingDown size={28} className="text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">
          暂无数据，多刷题后会自动分析
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {weak.map((w, i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
        >
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-semibold ${
                w.accuracy < 40
                  ? "text-destructive"
                  : w.accuracy < 60
                  ? "text-amber-500"
                  : "text-muted-foreground"
              }`}
            >
              {w.accuracy}%
            </span>
            <span className="text-sm font-medium">{w.category}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {w.correct}/{w.total}
          </span>
        </div>
      ))}
      <Link
        href="/quiz"
        className="mt-3 flex items-center justify-center gap-1.5 rounded-lg bg-primary/10 py-2.5 text-sm font-semibold text-primary hover:bg-primary/20 transition-colors"
      >
        <AlertTriangle size={14} />
        针对弱项练习
      </Link>
    </div>
  );
}
