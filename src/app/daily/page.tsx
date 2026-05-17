"use client";

import { useEffect, useState } from "react";
import { QuestionCard } from "@/components/quiz/question-card";
import { CalendarDays, CheckCircle } from "lucide-react";

export default function DailyQuestionPage() {
  const [question, setQuestion] = useState<any>(null);
  const [answered, setAnswered] = useState<any>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchDaily = async () => {
    setLoading(true);
    const res = await fetch("/api/daily-question");
    const data = await res.json();
    setQuestion(data.question);
    setAnswered(data.answered);
    if (data.answered) setSelected(data.answered.answer);
    setLoading(false);
  };

  useEffect(() => {
    fetchDaily();
  }, []);

  const handleSubmit = async () => {
    if (!selected || !question) return;
    setSubmitting(true);
    const res = await fetch("/api/daily-question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer: selected, questionId: question.id }),
    });
    const data = await res.json();
    setAnswered(data);
    setSubmitting(false);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 md:py-10">
      <div className="flex items-center gap-2">
        <CalendarDays size={24} className="text-primary" />
        <h1 className="text-2xl font-extrabold tracking-tight">每日一题</h1>
      </div>
      <p className="mt-1 text-muted-foreground">
        {new Date().toLocaleDateString("zh-CN", {
          year: "numeric",
          month: "long",
          day: "numeric",
          weekday: "long",
        })}
      </p>

      {loading ? (
        <div className="mt-12 text-center text-muted-foreground">加载中...</div>
      ) : !question ? (
        <div className="mt-12 rounded-xl border border-border bg-card py-16 text-center">
          <p className="text-lg text-muted-foreground">今日暂无题目</p>
          <p className="mt-2 text-sm text-muted-foreground">
            题库中还没有题目，开始刷题后会自动出现
          </p>
        </div>
      ) : (
        <div className="mt-6">
          <QuestionCard
            stem={question.stem}
            options={question.options}
            selectedAnswer={selected}
            correctAnswer={answered ? question.answer : ""}
            showResult={!!answered}
            onSelect={(a) => !answered && setSelected(a)}
            disabled={!!answered}
          />

          <div className="mt-6">
            {answered ? (
              <div
                className={`rounded-xl border p-4 text-center ${
                  answered.isCorrect
                    ? "border-green-200 bg-green-50 dark:bg-green-950/10"
                    : "border-red-200 bg-red-50 dark:bg-red-950/10"
                }`}
              >
                <CheckCircle
                  size={20}
                  className={`mx-auto ${
                    answered.isCorrect ? "text-green-500" : "text-destructive"
                  }`}
                />
                <p className="mt-2 font-semibold">
                  {answered.isCorrect ? "回答正确！🎉" : "回答错误"}
                </p>
                {!answered.isCorrect && (
                  <p className="text-sm text-muted-foreground">
                    正确答案: {question.answer}
                  </p>
                )}
              </div>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!selected || submitting}
                className="flex w-full items-center justify-center rounded-xl bg-primary py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {submitting ? "提交中..." : "确认提交"}
              </button>
            )}
          </div>

          {answered && question.explanation && (
            <div className="mt-4 rounded-xl border border-border bg-card p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-1">
                解析
              </p>
              <p className="text-sm leading-relaxed">{question.explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
