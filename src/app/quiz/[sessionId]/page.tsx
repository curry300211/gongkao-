"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuizStore, type QuizQuestion } from "@/stores/quiz-store";
import { useQuizKeyboard } from "@/hooks/use-quiz-keyboard";
import { QuestionCard } from "@/components/quiz/question-card";
import { QuizTimer } from "@/components/quiz/quiz-timer";
import { QuizProgress } from "@/components/quiz/quiz-progress";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  CheckCircle,
} from "lucide-react";

export default function QuizSessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = Number(params["sessionId"]);

  const status = useQuizStore((s) => s.status);
  const questions = useQuizStore((s) => s.questions);
  const currentIndex = useQuizStore((s) => s.currentIndex);
  const mode = useQuizStore((s) => s.mode);
  const loadSession = useQuizStore((s) => s.loadSession);
  const selectAnswer = useQuizStore((s) => s.selectAnswer);
  const nextQuestion = useQuizStore((s) => s.nextQuestion);
  const prevQuestion = useQuizStore((s) => s.prevQuestion);
  const togglePause = useQuizStore((s) => s.togglePause);
  const complete = useQuizStore((s) => s.complete);
  const elapsedSec = useQuizStore((s) => s.elapsedSec);
  const reset = useQuizStore((s) => s.reset);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState("");

  useQuizKeyboard(status === "idle" || status === "completed");

  useEffect(() => {
    if (!sessionId) return;
    (async () => {
      const res = await fetch(`/api/quiz/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count: 10, mode: "question_by_question" }),
      });
      const data = await res.json();
      if (!data.sessionId) {
        setError("加载题目失败，请重试");
        setLoading(false);
        return;
      }
      loadSession({
        sessionId: data.sessionId,
        questions: data.questions.map((q: QuizQuestion) => ({
          ...q,
          userAnswer: null,
          isCorrect: null,
          timeSpentSec: 0,
        })),
        mode: "question_by_question",
        timeLimitSec: data.timeLimitSec,
        elapsedSec: 0,
        status: "active",
        currentIndex: 0,
      });
      setLoading(false);
    })();
    return () => reset();
  }, [sessionId]);

  const handleSubmit = async () => {
    if (submitting) return;

    const unanswered = questions.filter((q) => q.userAnswer === null).length;
    if (
      unanswered > 0 &&
      !confirm(`还有 ${unanswered} 道题未作答，确定提交吗？`)
    ) {
      return;
    }

    setSubmitting(true);
    complete();

    const answers = questions.map((q, i) => ({
      sortOrder: i,
      userAnswer: q.userAnswer,
      timeSpentSec: q.timeSpentSec,
    }));

    await fetch("/api/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, answers, elapsedSec }),
    });

    setSubmitting(false);
  };

  const handleRestart = () => {
    reset();
    router.push("/quiz");
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">加载题目中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-destructive">{error}</p>
        <button
          onClick={() => router.push("/quiz")}
          className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
        >
          返回重试
        </button>
      </div>
    );
  }

  if (status === "completed") {
    const correct = questions.filter((q) => q.isCorrect).length;
    const total = questions.length;
    const score = questions.reduce(
      (s, q) => s + (q.isCorrect ? (q as any).points || 1 : 0),
      0
    );
    const totalScore = questions.reduce(
      (s, q) => s + ((q as any).points || 1),
      0
    );

    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-center">
        <CheckCircle size={56} className="mx-auto text-green-500" />
        <h1 className="mt-4 text-2xl font-extrabold">答题结束</h1>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-3xl font-extrabold text-primary">
              {correct}/{total}
            </p>
            <p className="text-sm text-muted-foreground">正确率</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-3xl font-extrabold">
              {score}/{totalScore}
            </p>
            <p className="text-sm text-muted-foreground">得分</p>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          {questions.map((q, i) => (
            <div
              key={i}
              className={`rounded-lg border p-3 text-left text-sm ${
                q.isCorrect
                  ? "border-green-200 bg-green-50 dark:bg-green-950/10"
                  : q.userAnswer === null
                  ? "border-amber-200 bg-amber-50 dark:bg-amber-950/10"
                  : "border-red-200 bg-red-50 dark:bg-red-950/10"
              }`}
            >
              <span className="font-semibold">#{i + 1}</span>{" "}
              {q.stem.slice(0, 80)}
              {q.userAnswer === null && " ⚠️ 未作答"}
              {q.userAnswer !== null && !q.isCorrect && (
                <span className="ml-2 text-xs text-destructive">
                  你的答案: {q.userAnswer} → 正确答案: {q.answer}
                </span>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleRestart}
          className="mt-8 rounded-full bg-primary px-8 py-3 text-base font-semibold text-primary-foreground hover:bg-primary/90"
        >
          再来一组
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">题目为空</p>
      </div>
    );
  }

  const isPaused = status === "paused";

  return (
    <div className="mx-auto max-w-2xl px-4 py-4 md:py-6">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <QuizTimer />
        <QuizProgress />
        <div className="flex items-center gap-1">
          <button
            onClick={togglePause}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent"
            aria-label={isPaused ? "继续" : "暂停"}
          >
            {isPaused ? <Play size={18} /> : <Pause size={18} />}
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {submitting ? "提交中..." : "交卷"}
          </button>
        </div>
      </div>

      {/* Question indicator */}
      <div className="mb-3 text-sm text-muted-foreground">
        第 {currentIndex + 1} / {questions.length} 题
        {currentQuestion.userAnswer && (
          <span className="ml-2 text-green-600 dark:text-green-400">
            ✓ 已作答
          </span>
        )}
      </div>

      {isPaused ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
          <p className="text-lg font-semibold text-muted-foreground">
            已暂停
          </p>
          <button
            onClick={togglePause}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            继续答题
          </button>
        </div>
      ) : (
        <>
          <QuestionCard
            stem={currentQuestion.stem}
            options={currentQuestion.options}
            selectedAnswer={currentQuestion.userAnswer}
            correctAnswer={currentQuestion.answer}
            showResult={showResult && mode === "question_by_question"}
            onSelect={selectAnswer}
          />

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={prevQuestion}
              disabled={currentIndex === 0}
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent disabled:opacity-30"
            >
              <ChevronLeft size={18} />
              上一题
            </button>

            {mode === "question_by_question" ? (
              <button
                onClick={() => setShowResult(!showResult)}
                className="rounded-lg bg-muted px-4 py-2 text-sm font-medium hover:bg-accent"
              >
                {showResult ? "隐藏解析" : "查看对错"}
              </button>
            ) : null}

            <button
              onClick={nextQuestion}
              disabled={currentIndex >= questions.length - 1}
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent disabled:opacity-30"
            >
              下一题
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Explanation (逐题模式) */}
          {showResult &&
            mode === "question_by_question" &&
            currentQuestion.explanation && (
              <div className="mt-4 rounded-xl border border-border bg-card p-4">
                <p className="text-xs font-semibold text-muted-foreground mb-1">
                  解析
                </p>
                <p className="text-sm leading-relaxed">
                  {currentQuestion.explanation}
                </p>
              </div>
            )}
        </>
      )}
    </div>
  );
}
