import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (id) {
    const video = await db.video.findUnique({ where: { id: parseInt(id) } });
    return NextResponse.json(video || null);
  }

  const section = req.nextUrl.searchParams.get("section");
  const categoryId = req.nextUrl.searchParams.get("categoryId");

  const where: Record<string, unknown> = {};
  if (section) where.section = section;
  if (categoryId) where.categoryId = parseInt(categoryId);

  const videos = await db.video.findMany({
    where,
    include: { category: true },
    orderBy: [{ instructor: "asc" }, { sortOrder: "asc" }],
  });

  return NextResponse.json(videos);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, url, instructor, description, section, categoryId } = body;

  const video = await db.video.create({
    data: {
      title,
      url: url || "",
      embedUrl: body.embedUrl || null,
      cloudType: body.cloudType || "",
      cloudUrl: body.cloudUrl || "",
      cloudPassword: body.cloudPassword || "",
      instructor: instructor || "",
      description: description || "",
      section: section || "xingce",
      categoryId: categoryId || null,
    },
  });

  return NextResponse.json(video, { status: 201 });
}
