"use client";

import { useEffect, useState } from "react";

interface Achievement {
  id: number;
  key: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt: string | null;
  progress: number;
  target: number;
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/achievements");
      const data = await res.json();
      setAchievements(data.achievements || []);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
      <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">
        成就徽章
      </h1>
      <p className="mt-1 text-muted-foreground">
        完成目标，解锁成就
      </p>

      {loading ? (
        <div className="mt-12 text-center text-muted-foreground">加载中...</div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {achievements.map((a) => (
            <div
              key={a.key}
              className={`flex flex-col items-center gap-2 rounded-xl border p-5 text-center transition-all ${
                a.unlocked
                  ? "border-primary/30 bg-primary/5"
                  : "border-border bg-card opacity-50"
              }`}
            >
              <span className="text-3xl">{a.icon}</span>
              <h3 className="text-sm font-semibold">{a.name}</h3>
              <p className="text-xs text-muted-foreground">{a.description}</p>
              {a.unlocked ? (
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  ✓ 已解锁
                </span>
              ) : (
                <span className="text-[10px] text-muted-foreground">
                  未解锁
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
