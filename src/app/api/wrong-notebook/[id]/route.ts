import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const recordId = parseInt(id);

  const data: Record<string, unknown> = {};
  if (body.status === "eliminated") {
    data.status = "eliminated";
    data.masteredAt = new Date();
  }
  if (body.note !== undefined) data.note = body.note;
  if (body.correctCount !== undefined) data.correctCount = body.correctCount;

  await db.wrongRecord.update({
    where: { id: recordId },
    data,
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.wrongRecord.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ ok: true });
}
