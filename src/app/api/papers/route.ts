import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const papers = await db.paper.findMany({
    orderBy: [{ paperYear: "desc" }, { paperType: "asc" }],
  });

  const grouped: Record<number, typeof papers> = {};
  for (const p of papers) {
    (grouped[p.paperYear] ??= []).push(p);
  }

  return NextResponse.json({ papers, grouped });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, paperYear, paperType, content, source } = body;

  const paper = await db.paper.create({
    data: {
      title,
      examType: body.examType || "xingce",
      paperYear,
      paperType: paperType || "A",
      content: content || "",
      source: source || "",
    },
  });

  return NextResponse.json(paper, { status: 201 });
}
