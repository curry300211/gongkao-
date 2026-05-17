import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const allAchievements = await db.achievement.findMany({
    orderBy: { id: "asc" },
  });
  const unlocked = await db.userAchievement.findMany({
    where: { userId: "default" },
  });
  const unlockedIds = new Set(unlocked.map((u) => u.achievementId));

  const achievements = allAchievements.map((a) => ({
    id: a.id,
    key: a.key,
    name: a.name,
    description: a.description,
    icon: a.icon,
    unlocked: unlockedIds.has(a.id),
    unlockedAt: unlocked.find((u) => u.achievementId === a.id)?.unlockedAt || null,
    progress: unlocked.find((u) => u.achievementId === a.id)?.progress || 0,
    target: unlocked.find((u) => u.achievementId === a.id)?.target || 1,
  }));

  return NextResponse.json({ achievements });
}
