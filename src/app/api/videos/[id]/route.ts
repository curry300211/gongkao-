import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { title, url, instructor, description, section, categoryId } = body;

  const video = await db.video.update({
    where: { id: parseInt(id) },
    data: {
      ...(title !== undefined && { title }),
      ...(url !== undefined && { url }),
      ...(instructor !== undefined && { instructor }),
      ...(description !== undefined && { description }),
      ...(section !== undefined && { section }),
      ...(categoryId !== undefined && { categoryId }),
    },
  });

  return NextResponse.json(video);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.video.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ ok: true });
}
