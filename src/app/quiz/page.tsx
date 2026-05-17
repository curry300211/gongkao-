"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuizStore, type QuizMode } from "@/stores/quiz-store";
import { Play, Timer, BookOpen, Zap } from "lucide-react";

export default function QuizSetupPage() {
  const router = useRouter();
  const setMode = useQuizStore((s) => s.setMode);
  const [selectedMode, setSelectedMode] = useState<QuizMode>("question_by_question");
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(false);

  const startQuiz = async () => {
    setLoading(true);
    setMode(selectedMode);

    const res = await fetch("/api/quiz/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ count, mode: selectedMode }),
    });
    const data = await res.json();

    if (data.sessionId) {
      router.push(`/quiz/${data.sessionId}`);
    }
    setLoading(false);
  };

  const modes = [
    {
      key: "question_by_question" as const,
      title: "逐题模式",
      desc: "一题一页，即时查看对错与解析",
      icon: Zap,
      color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
    },
    {
      key: "paper_gen" as const,
      title: "组卷模式",
      desc: "智能选题，重点攻克薄弱环节",
      icon: BookOpen,
      color: "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400",
    },
    {
      key: "mock_exam" as const,
      title: "模考模式",
      desc: "限时 2 小时，还原真实考场环境",
      icon: Timer,
      color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    },
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-extrabold tracking-tight">刷题练习</h1>
      <p className="mt-2 text-muted-foreground">选择模式，开始练习</p>

      <div className="mt-8 space-y-3">
        {modes.map((m) => {
          const Icon = m.icon;
          const selected = selectedMode === m.key;
          return (
            <button
              key={m.key}
              onClick={() => setSelectedMode(m.key)}
              className={`flex w-full items-center gap-4 rounded-xl border p-5 text-left transition-all ${
                selected
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border bg-card hover:border-primary/30"
              }`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${m.color}`}
              >
                <Icon size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{m.title}</h3>
                <p className="text-sm text-muted-foreground">{m.desc}</p>
              </div>
              <div
                className={`h-5 w-5 rounded-full border-2 ${
                  selected
                    ? "border-primary bg-primary"
                    : "border-muted-foreground/30"
                } flex items-center justify-center`}
              >
                {selected && (
                  <div className="h-2 w-2 rounded-full bg-white" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        <label className="text-sm font-semibold">题目数量</label>
        <div className="mt-2 flex gap-2">
          {[5, 10, 15, 20, 30].map((n) => (
            <button
              key={n}
              onClick={() => setCount(n)}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                count === n
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {n} 题
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={startQuiz}
        disabled={loading}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        <Play size={20} />
        {loading ? "正在出题..." : "开始答题"}
      </button>
    </div>
  );
}
