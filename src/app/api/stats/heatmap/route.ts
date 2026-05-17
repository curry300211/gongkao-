import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const now = new Date();
  const year = parseInt(
    req.nextUrl.searchParams.get("year") || String(now.getFullYear())
  );

  const start = new Date(year, 0, 1);
  const end = new Date(year + 1, 0, 1);

  const stats = await db.dailyStat.findMany({
    where: {
      userId: "default",
      date: { gte: start, lt: end },
    },
    orderBy: { date: "asc" },
  });

  const data = stats.map((s) => ({
    date: s.date.toISOString().slice(0, 10),
    totalSec: s.totalSec,
    questionsDone: s.questionsDone,
    questionsCorrect: s.questionsCorrect,
  }));

  return NextResponse.json({ year, data });
}
