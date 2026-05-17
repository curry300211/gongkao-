import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const categoryId = req.nextUrl.searchParams.get("categoryId");
  const where = categoryId ? { categoryId: parseInt(categoryId) } : {};

  const entries = await db.entry.findMany({
    where,
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
    orderBy: { updatedAt: "desc" },
    take: 50,
  });

  return NextResponse.json(
    entries.map((e) => ({
      ...e,
      tags: e.tags.map((t) => t.tag.name),
    }))
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, content, categoryId, tags } = body;

  const entry = await db.entry.create({
    data: {
      title,
      content: content || "",
      categoryId: categoryId || 6,
      tags: {
        create: (tags || []).map((tagName: string) => ({
          tag: {
            connectOrCreate: {
              where: { name: tagName.toLowerCase().trim() },
              create: { name: tagName.toLowerCase().trim() },
            },
          },
        })),
      },
    },
  });

  return NextResponse.json(entry, { status: 201 });
}
