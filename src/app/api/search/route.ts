import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q) {
    return NextResponse.json({ results: [] });
  }

  const results = await db.entry.findMany({
    where: {
      OR: [
        { title: { contains: q } },
        { content: { contains: q } },
      ],
    },
    include: { category: true },
    orderBy: { updatedAt: "desc" },
    take: 30,
  });

  return NextResponse.json({ results });
}
