"use client";

import { create } from "zustand";

export type QuizMode = "question_by_question" | "paper_gen" | "mock_exam";
export type QuizStatus = "idle" | "active" | "paused" | "completed";

export interface QuizQuestion {
  id: number;
  questionId: number;
  stem: string;
  options: { label: string; text: string }[];
  answer: string;
  explanation: string | null;
  userAnswer: string | null;
  isCorrect: boolean | null;
  timeSpentSec: number;
}

interface QuizStore {
  mode: QuizMode;
  status: QuizStatus;
  title: string;
  sessionId: number | null;
  questions: QuizQuestion[];
  currentIndex: number;
  timeLimitSec: number | null;
  elapsedSec: number;
  startTime: number | null;

  setMode: (mode: QuizMode) => void;
  setTitle: (title: string) => void;
  loadSession: (session: {
    sessionId: number;
    questions: QuizQuestion[];
    mode: QuizMode;
    timeLimitSec: number | null;
    elapsedSec: number;
    status: QuizStatus;
    currentIndex: number;
  }) => void;
  selectAnswer: (answer: string) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  goToQuestion: (index: number) => void;
  togglePause: () => void;
  tick: (deltaSec: number) => void;
  complete: () => void;
  reset: () => void;
}

export const useQuizStore = create<QuizStore>()((set, get) => ({
  mode: "question_by_question",
  status: "idle",
  title: "",
  sessionId: null,
  questions: [],
  currentIndex: 0,
  timeLimitSec: null,
  elapsedSec: 0,
  startTime: null,

  setMode: (mode) => set({ mode }),
  setTitle: (title) => set({ title }),

  loadSession: (session) =>
    set({
      sessionId: session.sessionId,
      questions: session.questions,
      mode: session.mode,
      timeLimitSec: session.timeLimitSec,
      elapsedSec: session.elapsedSec,
      status: session.status,
      currentIndex: session.currentIndex,
      startTime: Date.now() - session.elapsedSec * 1000,
    }),

  selectAnswer: (answer) => {
    const { questions, currentIndex } = get();
    const updated = [...questions];
    const q = updated[currentIndex];
    updated[currentIndex] = {
      ...q,
      userAnswer: answer,
      isCorrect: answer === q.answer,
    };
    set({ questions: updated });
  },

  nextQuestion: () => {
    const { currentIndex, questions } = get();
    if (currentIndex < questions.length - 1) {
      set({ currentIndex: currentIndex + 1 });
    }
  },

  prevQuestion: () => {
    const { currentIndex } = get();
    if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1 });
    }
  },

  goToQuestion: (index) => set({ currentIndex: index }),

  togglePause: () => {
    const { status } = get();
    if (status === "active") set({ status: "paused" });
    else if (status === "paused") set({ status: "active" });
  },

  tick: (deltaSec) => {
    set((s) => ({ elapsedSec: s.elapsedSec + deltaSec }));
  },

  complete: () => set({ status: "completed" }),

  reset: () =>
    set({
      status: "idle",
      sessionId: null,
      questions: [],
      currentIndex: 0,
      timeLimitSec: null,
      elapsedSec: 0,
      startTime: null,
    }),
}));
