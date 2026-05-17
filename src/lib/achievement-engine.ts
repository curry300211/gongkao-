import { db } from "@/lib/db";

export async function checkAchievements() {
  const userId = "default";
  const unlocked = new Set<string>();

  // Get all achievements
  const all = await db.achievement.findMany();

  // Get all user achievements
  const existing = await db.userAchievement.findMany({
    where: { userId },
  });
  for (const ua of existing) {
    unlocked.add(ua.achievementId.toString());
  }

  // Get stats
  const totalQuestions = await db.testQuestion.count({
    where: { session: { userId }, isCorrect: { not: null } },
  });
  const sessions = await db.testSession.findMany({
    where: { userId, status: "completed" },
    select: { correctCount: true, answeredCount: true },
  });

  const totalCorrect = sessions.reduce((s, t) => s + t.correctCount, 0);
  const totalAnswered = sessions.reduce((s, t) => s + t.answeredCount, 0);
  const accuracy =
    totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  // Check streak
  const studyDays = await db.studyLog.findMany({
    where: { userId },
    select: { date: true },
    orderBy: { date: "desc" },
    distinct: ["date"],
  });

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < studyDays.length; i++) {
    const expected = new Date(today);
    expected.setDate(expected.getDate() - i);
    const actual = new Date(studyDays[i].date);
    if (actual.getTime() === expected.getTime()) {
      streak++;
    } else {
      break;
    }
  }

  const checks: Record<string, boolean> = {
    streak_3: streak >= 3,
    streak_7: streak >= 7,
    streak_30: streak >= 30,
    questions_100: totalQuestions >= 100,
    questions_500: totalQuestions >= 500,
    questions_1000: totalQuestions >= 1000,
    perfect_score: sessions.some(
      (s) => s.correctCount === s.answeredCount && s.answeredCount >= 5
    ),
    accuracy_80: totalAnswered >= 20 && accuracy >= 80,
  };

  const newUnlocks: string[] = [];
  for (const a of all) {
    if (unlocked.has(String(a.id))) continue;
    if (checks[a.key]) {
      await db.userAchievement.create({
        data: {
          userId,
          achievementId: a.id,
          progress: 1,
          target: 1,
        },
      });
      newUnlocks.push(a.name);
    }
  }

  return { newUnlocks, streak, totalQuestions, totalCorrect, accuracy };
}
