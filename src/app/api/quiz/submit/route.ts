import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

import { checkAchievements } from "@/lib/achievement-engine";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { sessionId, answers, elapsedSec } = body;
  // answers: { sortOrder: number; userAnswer: string | null; timeSpentSec: number }[]

  if (!sessionId || !Array.isArray(answers)) {
    return NextResponse.json(
      { error: "sessionId and answers required" },
      { status: 400 }
    );
  }

  let correctCount = 0;
  let earnedScore = 0;

  for (const ans of answers) {
    const testQuestion = await db.testQuestion.findUnique({
      where: {
        sessionId_sortOrder: {
          sessionId,
          sortOrder: ans.sortOrder,
        },
      },
      include: { question: true },
    });

    if (!testQuestion) continue;

    const isCorrect = ans.userAnswer === testQuestion.question.answer;
    if (isCorrect) {
      correctCount++;
      earnedScore += testQuestion.question.points;
    }

    await db.testQuestion.update({
      where: {
        sessionId_sortOrder: { sessionId, sortOrder: ans.sortOrder },
      },
      data: {
        userAnswer: ans.userAnswer,
        isCorrect,
        timeSpentSec: ans.timeSpentSec || 0,
      },
    });

    // Auto-record wrong answers
    if (!isCorrect && ans.userAnswer !== null) {
      const existing = await db.wrongRecord.findUnique({
        where: {
          userId_questionId: {
            userId: "default",
            questionId: testQuestion.questionId,
          },
        },
      });

      if (existing) {
        await db.wrongRecord.update({
          where: { id: existing.id },
          data: {
            wrongCount: existing.wrongCount + 1,
            lastWrongAt: new Date(),
          },
        });
      } else {
        await db.wrongRecord.create({
          data: {
            userId: "default",
            questionId: testQuestion.questionId,
            wrongCount: 1,
          },
        });
      }
    }
  }

  // Update module mastery
  const categoryStats = new Map<number, { correct: number; total: number }>();
  for (const ans of answers) {
    const tq = await db.testQuestion.findUnique({
      where: {
        sessionId_sortOrder: { sessionId, sortOrder: ans.sortOrder },
      },
      include: { question: true },
    });
    if (!tq?.question.categoryId) continue;

    const catId = tq.question.categoryId;
    const stats = categoryStats.get(catId) || { correct: 0, total: 0 };
    stats.total++;
    if (tq.isCorrect) stats.correct++;
    categoryStats.set(catId, stats);
  }

  for (const [catId, stats] of categoryStats) {
    const existing = await db.moduleMastery.findUnique({
      where: {
        userId_categoryId: { userId: "default", categoryId: catId },
      },
    });

    if (existing) {
      await db.moduleMastery.update({
        where: { id: existing.id },
        data: {
          questionsTotal: existing.questionsTotal + stats.total,
          questionsCorrect: existing.questionsCorrect + stats.correct,
          accuracy:
            (existing.questionsCorrect + stats.correct) /
            (existing.questionsTotal + stats.total),
          lastPracticedAt: new Date(),
        },
      });
    } else {
      await db.moduleMastery.create({
        data: {
          userId: "default",
          categoryId: catId,
          questionsTotal: stats.total,
          questionsCorrect: stats.correct,
          accuracy: stats.correct / stats.total,
          lastPracticedAt: new Date(),
        },
      });
    }
  }

  // Update session
  const totalQuestions = await db.testQuestion.count({
    where: { sessionId },
  });
  const answeredCount = answers.filter((a) => a.userAnswer !== null).length;

  await db.testSession.update({
    where: { id: sessionId },
    data: {
      answeredCount,
      correctCount,
      earnedScore,
      elapsedSec: elapsedSec || 0,
      status: "completed",
      finishedAt: new Date(),
    },
  });

  // Record study log + daily stat
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const duration = elapsedSec || 0;

  try {
    await db.studyLog.create({
      data: {
        userId: "default",
        date: today,
        durationSec: duration,
        activityType: "quiz_practice",
      },
    });
  } catch {
    // already logged for today
  }

  // Upsert daily stat for heatmap
  const existing = await db.dailyStat.findUnique({
    where: { userId_date: { userId: "default", date: today } },
  });
  if (existing) {
    await db.dailyStat.update({
      where: { id: existing.id },
      data: {
        totalSec: existing.totalSec + duration,
        questionsDone: existing.questionsDone + answeredCount,
        questionsCorrect: existing.questionsCorrect + correctCount,
      },
    });
  } else {
    await db.dailyStat.create({
      data: {
        userId: "default",
        date: today,
        totalSec: duration,
        questionsDone: answeredCount,
        questionsCorrect: correctCount,
      },
    });
  }

  // Check achievements
  const achievementResult = await checkAchievements();

  return NextResponse.json({
    correctCount,
    earnedScore,
    totalQuestions,
    answeredCount,
    newAchievements: achievementResult.newUnlocks,
    streak: achievementResult.streak,
  });
}
