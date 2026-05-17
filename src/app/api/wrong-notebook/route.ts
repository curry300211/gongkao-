import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status") || "active";

  const where: Record<string, unknown> = { userId: "default" };
  if (status !== "all") {
    where.status = status;
  }

  const items = await db.wrongRecord.findMany({
    where,
    include: {
      question: {
        select: {
          stem: true,
          answer: true,
          explanation: true,
          category: { select: { name: true } },
        },
      },
    },
    orderBy: { lastWrongAt: "desc" },
  });

  return NextResponse.json({ items });
}
