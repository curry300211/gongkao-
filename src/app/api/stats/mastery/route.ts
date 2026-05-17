import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const mastery = await db.moduleMastery.findMany({
    where: { userId: "default" },
    include: { category: { select: { id: true, name: true } } },
    orderBy: { categoryId: "asc" },
  });

  const data = mastery.map((m) => ({
    category: m.category.name,
    accuracy: m.accuracy ? Math.round(m.accuracy * 100) : 0,
    total: m.questionsTotal,
    correct: m.questionsCorrect,
  }));

  return NextResponse.json(data);
}
