import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let daily = await db.dailyQuestion.findUnique({
    where: { date: today },
    include: {
      question: {
        select: { id: true, stem: true, options: true, answer: true, explanation: true },
      },
    },
  });

  // If no daily question for today, pick a random one
  if (!daily) {
    const count = await db.question.count();
    if (count > 0) {
      const skip = Math.floor(Math.random() * count);
      const randomQ = await db.question.findFirst({
        skip,
        take: 1,
      });
      if (randomQ) {
        daily = await db.dailyQuestion.create({
          data: { questionId: randomQ.id, date: today },
          include: {
            question: {
              select: { id: true, stem: true, options: true, answer: true, explanation: true },
            },
          },
        });
      }
    }
  }

  if (!daily) {
    return NextResponse.json({ question: null });
  }

  // Check if already answered
  const answer = await db.userDailyAnswer.findUnique({
    where: {
      userId_dailyQuestionId: { userId: "default", dailyQuestionId: daily.id },
    },
  });

  return NextResponse.json({
    question: {
      id: daily.question.id,
      stem: daily.question.stem,
      options: JSON.parse(daily.question.options),
      answer: daily.question.answer,
      explanation: daily.question.explanation,
    },
    answered: answer
      ? { answer: answer.answer, isCorrect: answer.isCorrect }
      : null,
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { answer, questionId } = body;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daily = await db.dailyQuestion.findUnique({
    where: { date: today },
    include: { question: true },
  });
  if (!daily || daily.questionId !== questionId) {
    return NextResponse.json({ error: "Invalid question" }, { status: 400 });
  }

  const isCorrect = answer === daily.question.answer;

  await db.userDailyAnswer.create({
    data: {
      userId: "default",
      dailyQuestionId: daily.id,
      answer,
      isCorrect,
    },
  });

  return NextResponse.json({ isCorrect, correctAnswer: daily.question.answer });
}
