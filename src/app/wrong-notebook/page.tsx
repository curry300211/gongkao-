"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";

interface WrongItem {
  id: number;
  questionId: number;
  wrongCount: number;
  correctCount: number;
  status: "active" | "eliminated";
  note: string | null;
  lastWrongAt: string;
  question: {
    stem: string;
    answer: string;
    explanation: string | null;
    category: { name: string } | null;
  };
}

export default function WrongNotebookPage() {
  const [items, setItems] = useState<WrongItem[]>([]);
  const [filter, setFilter] = useState<"active" | "eliminated" | "all">(
    "active"
  );
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/wrong-notebook${filter !== "all" ? `?status=${filter}` : ""}`
    );
    const data = await res.json();
    setItems(data.items || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, [filter]);

  const markEliminated = async (id: number) => {
    await fetch(`/api/wrong-notebook/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "eliminated" }),
    });
    fetchItems();
  };

  const removeItem = async (id: number) => {
    await fetch(`/api/wrong-notebook/${id}`, { method: "DELETE" });
    fetchItems();
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">错题本</h1>
          <p className="mt-1 text-muted-foreground">
            自动收录错题 · 重做消灭
          </p>
        </div>
        <Link
          href="/quiz"
          className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          去刷题
        </Link>
      </div>

      <div className="mt-6 flex gap-2">
        {(["active", "eliminated", "all"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              filter === f
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            {{ active: "待消灭", eliminated: "已消灭", all: "全部" }[f]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-12 text-center text-muted-foreground">
          加载中...
        </div>
      ) : items.length === 0 ? (
        <div className="mt-12 rounded-xl border border-border bg-card py-16 text-center">
          <p className="text-lg text-muted-foreground">错题本为空</p>
          <p className="mt-2 text-sm text-muted-foreground">
            开始刷题后，错题将自动收录到这里
          </p>
          <Link
            href="/quiz"
            className="mt-4 inline-flex rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            开始刷题
          </Link>
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/20"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {item.question.category && (
                      <span className="rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">
                        {item.question.category.name}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      答错 {item.wrongCount} 次
                    </span>
                    {item.status === "eliminated" && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        已消灭
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed">
                    {item.question.stem.slice(0, 150)}
                    {item.question.stem.length > 150 && "..."}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    正确答案: {item.question.answer}
                  </p>
                  {item.question.explanation && (
                    <p className="mt-1 text-xs text-muted-foreground/70">
                      {item.question.explanation.slice(0, 100)}...
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 gap-1">
                  {item.status === "active" && (
                    <button
                      onClick={() => markEliminated(item.id)}
                      className="rounded-md px-2 py-1 text-xs font-medium text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20"
                    >
                      消灭
                    </button>
                  )}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-destructive"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
