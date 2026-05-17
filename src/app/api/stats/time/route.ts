import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const period = req.nextUrl.searchParams.get("period") || "week";
  const now = new Date();
  let start: Date;
  let groupFormat: "day" | "week" | "month";

  if (period === "month") {
    start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    groupFormat = "week";
  } else {
    start = new Date(now);
    start.setDate(start.getDate() - 7);
    groupFormat = "day";
  }

  const logs = await db.studyLog.findMany({
    where: {
      userId: "default",
      date: { gte: start, lte: now },
    },
    orderBy: { date: "asc" },
  });

  // Group by date
  const grouped: Record<string, number> = {};
  for (const log of logs) {
    const key = log.date.toISOString().slice(0, 10);
    grouped[key] = (grouped[key] || 0) + log.durationSec;
  }

  const data = Object.entries(grouped).map(([date, seconds]) => ({
    date,
    minutes: Math.round(seconds / 60),
  }));

  return NextResponse.json(data);
}
